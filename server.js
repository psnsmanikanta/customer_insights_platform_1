const http = require("http");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = __dirname;
const dataContext = {};

vm.createContext(dataContext);
vm.runInContext(
  `${fs.readFileSync(path.join(__dirname, "mockdata.js"), "utf8")}
   this.INITIAL_VENDORS = INITIAL_VENDORS;
   this.INITIAL_PRODUCTS = INITIAL_PRODUCTS;`,
  dataContext
);

let vendors = dataContext.INITIAL_VENDORS.map((vendor) => ({
  ...vendor,
  commission: vendor.commissionStructure?.rate ?? 10,
  status: vendor.operationalStatus === "active" ? "active" : vendor.operationalStatus === "suspended" ? "suspended" : "pending",
  createdAt: vendor.createdDate
}));

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  });
  response.end(JSON.stringify(payload, null, 2));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";
    request.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) request.destroy();
    });
    request.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function getStatus(vendor) {
  if (vendor.operationalStatus === "suspended") return "suspended";
  if (vendor.operationalStatus === "active") return "active";
  if (vendor.verificationStatus === "approved") return "approved";
  return "pending";
}

function toRecord(vendor) {
  return {
    id: vendor.id,
    businessName: vendor.businessName,
    email: vendor.email,
    phone: vendor.phone,
    commission: vendor.commission ?? vendor.commissionStructure?.rate ?? 10,
    status: getStatus(vendor),
    createdAt: vendor.createdAt || vendor.createdDate
  };
}

function findVendor(id) {
  return vendors.find((vendor) => vendor.id === id);
}

function createVendor(payload) {
  const required = ["businessName", "email", "phone"];
  const missing = required.filter((field) => !payload[field]);
  if (missing.length) {
    return { status: 400, payload: { error: `Missing required field(s): ${missing.join(", ")}` } };
  }
  if (vendors.some((vendor) => vendor.email.toLowerCase() === payload.email.toLowerCase())) {
    return { status: 409, payload: { error: "Vendor email already exists" } };
  }

  const commission = Number(payload.commission ?? 10);
  const vendor = {
    id: `VND-${Math.floor(1000 + Math.random() * 9000)}`,
    businessName: payload.businessName,
    registrationNumber: payload.registrationNumber || "Pending",
    address: payload.address || "Not provided",
    contactPerson: payload.contactPerson || payload.businessName,
    email: payload.email.toLowerCase(),
    phone: payload.phone,
    categories: payload.categories || ["General Merchandise"],
    commission,
    status: "pending",
    createdAt: new Date().toISOString(),
    commissionStructure: {
      type: "percentage",
      rate: commission,
      details: `${commission}% marketplace commission`
    },
    operationalStatus: "pending",
    verificationStatus: "pending",
    documents: [],
    metrics: {
      fulfillmentRate: 0,
      avgRating: 0,
      salesVolume: 0,
      commissionEarned: 0
    },
    settings: {
      paymentMethod: "ACH Direct Deposit",
      billingEmail: payload.email.toLowerCase(),
      webhookUrl: "",
      apiToken: `mkt_live_${Math.random().toString(36).slice(2, 14)}`
    }
  };

  vendors.unshift(vendor);
  return { status: 201, payload: toRecord(vendor) };
}

function serveStatic(request, response, pathname) {
  const filePath = pathname === "/" ? path.join(PUBLIC_DIR, "index.html") : path.join(PUBLIC_DIR, pathname);
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(PUBLIC_DIR)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  fs.readFile(resolved, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    const extension = path.extname(resolved).toLowerCase();
    const contentTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
      ".json": "application/json"
    };
    response.writeHead(200, { "Content-Type": contentTypes[extension] || "text/plain" });
    response.end(content);
  });
}

async function handleApi(request, response, url) {
  if (request.method === "OPTIONS") return sendJson(response, 204, {});

  const vendorMatch = url.pathname.match(/^\/api\/vendors\/([^/]+)$/);
  const actionMatch = url.pathname.match(/^\/api\/vendors\/([^/]+)\/(verify|approve|suspend|profile)$/);

  try {
    if (request.method === "GET" && url.pathname === "/api/vendors") {
      const status = url.searchParams.get("status");
      const records = vendors
        .filter((vendor) => !status || status === "all" || getStatus(vendor) === status)
        .map(toRecord);
      return sendJson(response, 200, records);
    }

    if (request.method === "GET" && vendorMatch) {
      const vendor = findVendor(vendorMatch[1]);
      return vendor ? sendJson(response, 200, toRecord(vendor)) : sendJson(response, 404, { error: "Vendor not found" });
    }

    if (request.method === "POST" && url.pathname === "/api/vendors/register") {
      const result = createVendor(await readBody(request));
      return sendJson(response, result.status, result.payload);
    }

    if (request.method === "POST" && url.pathname === "/api/vendors/login") {
      const body = await readBody(request);
      const vendor = vendors.find((item) => item.email.toLowerCase() === String(body.email || "").toLowerCase());
      return vendor ? sendJson(response, 200, { token: vendor.settings.apiToken, vendor: toRecord(vendor) }) : sendJson(response, 401, { error: "Invalid vendor email" });
    }

    if (actionMatch) {
      const vendor = findVendor(actionMatch[1]);
      if (!vendor) return sendJson(response, 404, { error: "Vendor not found" });
      const action = actionMatch[2];
      if (request.method === "POST" && action === "verify") {
        vendor.verificationStatus = "approved";
        vendor.status = "approved";
        return sendJson(response, 200, toRecord(vendor));
      }
      if (request.method === "POST" && action === "approve") {
        vendor.verificationStatus = "approved";
        vendor.operationalStatus = "active";
        vendor.status = "active";
        return sendJson(response, 200, toRecord(vendor));
      }
      if (request.method === "POST" && action === "suspend") {
        vendor.operationalStatus = "suspended";
        vendor.status = "suspended";
        return sendJson(response, 200, toRecord(vendor));
      }
      if (request.method === "PUT" && action === "profile") {
        const body = await readBody(request);
        if (body.email && vendors.some((item) => item.id !== vendor.id && item.email.toLowerCase() === body.email.toLowerCase())) {
          return sendJson(response, 409, { error: "Vendor email already exists" });
        }
        ["businessName", "email", "phone", "address", "contactPerson", "registrationNumber"].forEach((field) => {
          if (body[field] !== undefined) vendor[field] = String(body[field]).trim();
        });
        if (body.categories !== undefined) {
          vendor.categories = Array.isArray(body.categories)
            ? body.categories
            : String(body.categories).split(",").map((item) => item.trim()).filter(Boolean);
        }
        if (body.commission !== undefined) {
          vendor.commission = Number(body.commission);
          vendor.commissionStructure.rate = Number(body.commission);
          vendor.commissionStructure.details = `${Number(body.commission)}% marketplace commission`;
        }
        return sendJson(response, 200, toRecord(vendor));
      }
    }

    return sendJson(response, 404, { error: "Endpoint not found" });
  } catch (error) {
    return sendJson(response, 400, { error: "Invalid request body" });
  }
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (url.pathname.startsWith("/api/")) {
    handleApi(request, response, url);
    return;
  }
  serveStatic(request, response, decodeURIComponent(url.pathname));
});

server.listen(PORT, () => {
  console.log(`ShopSense Module 1 running at http://localhost:${PORT}`);
});
