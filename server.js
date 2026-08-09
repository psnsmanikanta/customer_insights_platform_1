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
   this.INITIAL_PRODUCTS = INITIAL_PRODUCTS;
   this.INITIAL_TRANSACTIONS = INITIAL_TRANSACTIONS;
   this.INITIAL_CUSTOMERS = typeof INITIAL_CUSTOMERS !== 'undefined' ? INITIAL_CUSTOMERS : [];`,
  dataContext
);

let vendors = dataContext.INITIAL_VENDORS.map((vendor) => ({
  ...vendor,
  commission: vendor.commissionStructure?.rate ?? 10,
  status: vendor.operationalStatus === "active" ? "active" : vendor.operationalStatus === "suspended" ? "suspended" : "pending",
  createdAt: vendor.createdDate
}));

const transactions = Array.isArray(dataContext.INITIAL_TRANSACTIONS) ? dataContext.INITIAL_TRANSACTIONS : [];
const customers = Array.isArray(dataContext.INITIAL_CUSTOMERS) ? dataContext.INITIAL_CUSTOMERS : [];
const products = Array.isArray(dataContext.INITIAL_PRODUCTS) ? dataContext.INITIAL_PRODUCTS : [];

function isCompletedTransaction(transaction) {
  return String(transaction.status || "completed").toLowerCase() !== "cancelled";
}

function completedTransactions(records = transactions) {
  return records.filter(isCompletedTransaction);
}

function aggregateRevenueAnalytics() {
  return vendors.map((vendor) => {
    const vendorTransactions = completedTransactions(transactions.filter((txn) => txn.vendorId === vendor.id));
    return {
      vendorId: vendor.id,
      totalRevenue: vendorTransactions.reduce((sum, txn) => sum + Number(txn.totalAmount || 0), 0),
      totalUnitsSold: vendorTransactions.reduce((sum, txn) => sum + Number(txn.quantity || 0), 0),
      transactionCount: vendorTransactions.length
    };
  });
}

function buildCustomerBehaviorAnalytics() {
  const now = new Date();
  const day = 86400000;
  const totalOrders = customers.reduce((sum, customer) => sum + Number(customer.orderCount || 0), 0);
  const totalLifetimeValue = customers.reduce((sum, customer) => sum + Number(customer.lifetimeValue || 0), 0);
  const repeatCustomers = customers.filter((customer) => Number(customer.orderCount || 0) > 1);
  const atRiskCustomers = customers.filter((customer) => (now - new Date(customer.lastPurchaseDate)) / day > 30);
  const segmentCounts = { Champions: 0, Loyal: 0, New: 0, "At risk": 0 };

  const customerRows = customers.map((customer) => {
    const daysSinceLastPurchase = Math.max(0, Math.floor((now - new Date(customer.lastPurchaseDate)) / day));
    const daysSinceFirstPurchase = Math.max(0, Math.floor((now - new Date(customer.firstPurchaseDate)) / day));
    let segment = "At risk";
    if (Number(customer.lifetimeValue || 0) >= 1000 || Number(customer.orderCount || 0) >= 10) segment = "Champions";
    else if (daysSinceFirstPurchase <= 30) segment = "New";
    else if (daysSinceLastPurchase <= 30) segment = "Loyal";
    segmentCounts[segment] += 1;
    return {
      id: customer.id,
      name: customer.name,
      lifetimeValue: Number(customer.lifetimeValue || 0),
      orderCount: Number(customer.orderCount || 0),
      daysSinceLastPurchase,
      segment
    };
  });

  const salesByProduct = completedTransactions().reduce((totals, transaction) => {
    totals[transaction.productId] = (totals[transaction.productId] || 0) + Number(transaction.quantity || 0);
    return totals;
  }, {});
  const popularProducts = products
    .filter((product) => product.status === "active" && Number(product.stock || 0) > 0)
    .map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: Number(product.price || 0),
      unitsSold: salesByProduct[product.id] || 0,
      stock: Number(product.stock || 0)
    }))
    .sort((left, right) => right.unitsSold - left.unitsSold || right.stock - left.stock)
    .slice(0, 5);

  const recommendations = customerRows
    .sort((left, right) => right.lifetimeValue - left.lifetimeValue)
    .slice(0, 5)
    .map((customer, index) => {
      const product = popularProducts[index % Math.max(popularProducts.length, 1)];
      return {
        customerId: customer.id,
        customerName: customer.name,
        segment: customer.segment,
        productName: product?.name || "No in-stock products",
        category: product?.category || "",
        reason: customer.segment === "At risk"
          ? "Win-back offer based on marketplace best sellers."
          : "Suggested from the most purchased in-stock marketplace products."
      };
    });

  return {
    metrics: {
      totalCustomers: customers.length,
      repeatPurchaseRate: customers.length ? Math.round((repeatCustomers.length / customers.length) * 100) : 0,
      averageOrderValue: totalOrders ? totalLifetimeValue / totalOrders : 0,
      atRiskCustomers: atRiskCustomers.length
    },
    segments: Object.entries(segmentCounts).map(([label, count]) => ({ label, count })),
    popularProducts,
    recommendations,
    customers: customerRows.sort((left, right) => right.lifetimeValue - left.lifetimeValue)
  };
}

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
  const customerDashboardMatch = url.pathname.match(/^\/api\/customers\/([^/]+)\/dashboard$/);
  const vendorDashboardMatch = url.pathname.match(/^\/api\/vendors\/([^/]+)\/dashboard$/);
  const actionMatch = url.pathname.match(/^\/api\/vendors\/([^/]+)\/(verify|approve|suspend|profile)$/);

  try {
    if (request.method === "GET" && url.pathname === "/api/vendors") {
      const status = url.searchParams.get("status");
      const records = vendors
        .filter((vendor) => !status || status === "all" || getStatus(vendor) === status)
        .map(toRecord);
      return sendJson(response, 200, records);
    }

    if (request.method === "GET" && url.pathname === "/api/analytics/revenue") {
      return sendJson(response, 200, aggregateRevenueAnalytics());
    }

    if (request.method === "GET" && url.pathname === "/api/admin/dashboard") {
      const totalRevenue = completedTransactions().reduce((sum, transaction) => sum + Number(transaction.totalAmount || 0), 0);
      const vendorRevenue = vendors.map((vendor) => {
        const vendorTransactions = completedTransactions(transactions.filter((transaction) => transaction.vendorId === vendor.id));
        const revenue = vendorTransactions.reduce((sum, transaction) => sum + Number(transaction.totalAmount || 0), 0);
        return {
          id: vendor.id,
          name: vendor.businessName,
          categories: vendor.categories || [],
          status: getStatus(vendor),
          revenue,
          commission: revenue * Number(vendor.commission ?? vendor.commissionStructure?.rate ?? 10) / 100
        };
      }).sort((a, b) => b.revenue - a.revenue);
      const lowStockProducts = products
        .filter((product) => Number(product.stock || 0) < 20)
        .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
        .map((product) => ({
          ...product,
          vendorName: vendors.find((vendor) => vendor.id === product.vendorId)?.businessName || product.vendorId,
          stockStatus: Number(product.stock || 0) === 0 ? "Out of stock" : "Low stock"
        }));
      const pendingVendors = vendors
        .filter((vendor) => ["pending", "approved"].includes(getStatus(vendor)))
        .map((vendor) => toRecord(vendor));

      return sendJson(response, 200, {
        summary: {
          totalRevenue,
          totalOrders: transactions.length,
          totalProducts: products.length,
          totalVendors: vendors.length,
          activeVendors: vendors.filter((vendor) => getStatus(vendor) === "active").length,
          lowStockCount: lowStockProducts.length,
          pendingVendorCount: pendingVendors.length
        },
        pendingVendors,
        lowStockProducts,
        vendorRevenue
      });
    }

    if (request.method === "GET" && url.pathname === "/api/admin/categories") {
      const categories = Object.values(products.reduce((result, product) => {
        const category = product.category || "Uncategorised";
        if (!result[category]) result[category] = { category, productCount: 0, availableUnits: 0, lowStockCount: 0 };
        result[category].productCount += 1;
        result[category].availableUnits += Number(product.stock || 0);
        if (Number(product.stock || 0) < 20) result[category].lowStockCount += 1;
        return result;
      }, {})).sort((left, right) => left.category.localeCompare(right.category));
      return sendJson(response, 200, categories);
    }

    if (request.method === "GET" && url.pathname === "/api/admin/benchmark") {
      const productById = new Map(products.map((product) => [product.id, product]));
      const totalRevenue = completedTransactions().reduce((sum, transaction) => sum + Number(transaction.totalAmount || 0), 0);
      const vendorRankings = vendors.map((vendor) => {
        const vendorTransactions = completedTransactions(transactions.filter((transaction) => transaction.vendorId === vendor.id));
        return {
          id: vendor.id,
          name: vendor.businessName,
          revenue: vendorTransactions.reduce((sum, transaction) => sum + Number(transaction.totalAmount || 0), 0),
          orderCount: vendorTransactions.length
        };
      }).filter((vendor) => vendor.revenue > 0).sort((left, right) => right.revenue - left.revenue).map((vendor, index) => ({ ...vendor, rank: index + 1 }));
      const categoryPerformance = Object.values(completedTransactions().reduce((result, transaction) => {
        const category = productById.get(transaction.productId)?.category || "Uncategorised";
        if (!result[category]) result[category] = { category, revenue: 0, unitsSold: 0 };
        result[category].revenue += Number(transaction.totalAmount || 0);
        result[category].unitsSold += Number(transaction.quantity || 0);
        return result;
      }, {})).sort((left, right) => right.revenue - left.revenue);
      return sendJson(response, 200, {
        totalRevenue,
        totalVendorCount: vendors.length,
        activeVendorCount: vendors.filter((vendor) => getStatus(vendor) === "active").length,
        sellingVendorCount: vendorRankings.length,
        averageVendorRevenue: vendorRankings.length ? totalRevenue / vendorRankings.length : 0,
        leader: vendorRankings[0] || null,
        vendorRankings,
        categoryPerformance
      });
    }

    if (request.method === "GET" && url.pathname === "/api/admin/system-status") {
      const completed = completedTransactions();
      const cancelled = transactions.filter((transaction) => String(transaction.status || "").toLowerCase() === "cancelled");
      const invalidTransactionCount = transactions.filter((transaction) => {
        const product = products.find((item) => item.id === transaction.productId);
        return !product || Math.abs((Number(product.price || 0) * Number(transaction.quantity || 0)) - Number(transaction.totalAmount || 0)) > 0.001;
      }).length;
      return sendJson(response, 200, {
        services: [
          { name: "Node application server", message: "API service is active" },
          { name: "Marketplace analytics endpoints", message: "Revenue, benchmark, and customer analytics are available" },
          { name: "Forecasting integration", message: "Not configured in this project" },
          { name: "BI dashboard data", message: `${products.length} products and ${transactions.length} orders are available` }
        ],
        validation: {
          complete: invalidTransactionCount === 0 && products.length > 0 && transactions.length > 0,
          transactionCount: transactions.length,
          completedOrderCount: completed.length,
          cancelledOrderCount: cancelled.length,
          productCount: products.length,
          invalidTransactionCount
        }
      });
    }

    if (request.method === "GET" && url.pathname === "/api/admin/executive-report") {
      const completed = completedTransactions();
      const netRevenue = completed.reduce((sum, transaction) => sum + Number(transaction.totalAmount || 0), 0);
      const cancelledOrders = transactions.filter((transaction) => String(transaction.status || "").toLowerCase() === "cancelled").length;
      const topVendors = vendors.map((vendor) => {
        const orders = completed.filter((transaction) => transaction.vendorId === vendor.id);
        return { name: vendor.businessName, revenue: orders.reduce((sum, transaction) => sum + Number(transaction.totalAmount || 0), 0), orders: orders.length };
      }).filter((vendor) => vendor.revenue > 0).sort((left, right) => right.revenue - left.revenue).slice(0, 5);
      const categoryRevenue = Object.values(completed.reduce((result, transaction) => {
        const category = products.find((product) => product.id === transaction.productId)?.category || "Uncategorised";
        if (!result[category]) result[category] = { category, revenue: 0 };
        result[category].revenue += Number(transaction.totalAmount || 0);
        return result;
      }, {})).sort((left, right) => right.revenue - left.revenue);
      return sendJson(response, 200, {
        netRevenue,
        completedOrders: completed.length,
        cancelledOrders,
        cancellationRate: transactions.length ? (cancelledOrders / transactions.length) * 100 : 0,
        averageOrderValue: completed.length ? netRevenue / completed.length : 0,
        activeVendors: vendors.filter((vendor) => getStatus(vendor) === "active").length,
        lowStockCount: products.filter((product) => Number(product.stock || 0) < 20).length,
        topVendors,
        leadingCategory: categoryRevenue[0] || null
      });
    }

    if (request.method === "GET" && url.pathname === "/api/analytics/customer-behavior") {
      return sendJson(response, 200, buildCustomerBehaviorAnalytics());
    }

    if (request.method === "GET" && url.pathname === "/api/customers") {
      return sendJson(response, 200, customers);
    }

    if (request.method === "GET" && customerDashboardMatch) {
      const customer = customers.find((item) => item.id === customerDashboardMatch[1]);
      if (!customer) return sendJson(response, 404, { error: "Customer not found" });
      const salesByProduct = completedTransactions().reduce((totals, transaction) => {
        totals[transaction.productId] = (totals[transaction.productId] || 0) + Number(transaction.quantity || 0);
        return totals;
      }, {});
      const recommendations = products
        .filter((product) => product.status === "active" && Number(product.stock || 0) > 0)
        .map((product) => ({ ...product, unitsSold: salesByProduct[product.id] || 0, recommendationReason: salesByProduct[product.id] ? "Popular with ShopSense customers" : "New in-stock product to discover" }))
        .sort((left, right) => right.unitsSold - left.unitsSold || right.stock - left.stock)
        .slice(0, 6);
      return sendJson(response, 200, { customer, recommendations });
    }

    if (request.method === "GET" && url.pathname === "/api/transactions") {
      return sendJson(response, 200, transactions);
    }

    if (request.method === "GET" && url.pathname === "/api/products") {
      return sendJson(response, 200, products);
    }

    if (request.method === "GET" && vendorDashboardMatch) {
      const vendor = findVendor(vendorDashboardMatch[1]);
      if (!vendor) return sendJson(response, 404, { error: "Vendor not found" });

      const vendorProducts = products.filter((product) => product.vendorId === vendor.id);
      const vendorTransactions = transactions.filter((transaction) => transaction.vendorId === vendor.id);
      const completedVendorTransactions = completedTransactions(vendorTransactions);
      const revenue = completedVendorTransactions.reduce((sum, transaction) => sum + Number(transaction.totalAmount || 0), 0);
      const unitsSold = completedVendorTransactions.reduce((sum, transaction) => sum + Number(transaction.quantity || 0), 0);
      const categoryBreakdown = vendorProducts.reduce((breakdown, product) => {
        breakdown[product.category || "Uncategorised"] = (breakdown[product.category || "Uncategorised"] || 0) + 1;
        return breakdown;
      }, {});
      const stockBreakdown = vendorProducts.reduce((breakdown, product) => {
        const bucket = Number(product.stock || 0) === 0 ? "Out of stock" : Number(product.stock || 0) < 20 ? "Low stock" : "In stock";
        breakdown[bucket] = (breakdown[bucket] || 0) + 1;
        return breakdown;
      }, {});
      const productMap = new Map(products.map((product) => [product.id, product]));
      const recentTransactions = [...vendorTransactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6)
        .map((transaction) => ({
          ...transaction,
          productName: productMap.get(transaction.productId)?.name || transaction.productId
        }));
      const topProducts = Object.values(completedVendorTransactions.reduce((result, transaction) => {
        const product = productMap.get(transaction.productId);
        const key = transaction.productId;
        if (!result[key]) result[key] = { id: key, name: product?.name || key, unitsSold: 0, revenue: 0 };
        result[key].unitsSold += Number(transaction.quantity || 0);
        result[key].revenue += Number(transaction.totalAmount || 0);
        return result;
      }, {})).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
      const inventoryAlerts = vendorProducts
        .filter((product) => Number(product.stock || 0) < 20)
        .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
        .map((product) => ({ id: product.id, name: product.name, stock: Number(product.stock || 0), status: Number(product.stock || 0) === 0 ? "Out of stock" : "Low stock" }));
      const marketplaceRevenue = completedTransactions().reduce((sum, transaction) => sum + Number(transaction.totalAmount || 0), 0);
      const vendorsWithSales = vendors.filter((item) => completedTransactions().some((transaction) => transaction.vendorId === item.id));
      const revenueStandings = vendorsWithSales.map((item) => ({
        id: item.id,
        name: item.businessName,
        revenue: completedTransactions(transactions.filter((transaction) => transaction.vendorId === item.id)).reduce((sum, transaction) => sum + Number(transaction.totalAmount || 0), 0)
      })).sort((a, b) => b.revenue - a.revenue);
      const rank = revenueStandings.findIndex((item) => item.id === vendor.id) + 1;
      const marketplaceOrderValue = completedTransactions().length ? marketplaceRevenue / completedTransactions().length : 0;
      const revenueByDate = Object.values(completedVendorTransactions.reduce((result, transaction) => {
        const date = String(transaction.date || "").slice(0, 10);
        if (!result[date]) result[date] = { date, revenue: 0, orders: 0 };
        result[date].revenue += Number(transaction.totalAmount || 0);
        result[date].orders += 1;
        return result;
      }, {})).sort((left, right) => left.date.localeCompare(right.date)).slice(-6);

      return sendJson(response, 200, {
        vendor: toRecord(vendor),
        summary: {
          totalProducts: vendorProducts.length,
          inventoryRecords: vendorProducts.length,
          inventoryUnits: vendorProducts.reduce((sum, product) => sum + Number(product.stock || 0), 0),
          transactionCount: vendorTransactions.length,
          revenue,
          unitsSold,
          commission: revenue * Number(vendor.commission ?? vendor.commissionStructure?.rate ?? 10) / 100,
          lowStockProducts: vendorProducts.filter((product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) < 20).length,
          outOfStockProducts: vendorProducts.filter((product) => Number(product.stock || 0) === 0).length
        },
        categoryBreakdown,
        stockBreakdown,
        recentTransactions,
        topProducts,
        inventoryAlerts,
        salesAnalytics: {
          completedOrders: completedVendorTransactions.length,
          cancelledOrders: vendorTransactions.filter((transaction) => String(transaction.status || "").toLowerCase() === "cancelled").length,
          averageOrderValue: completedVendorTransactions.length ? revenue / completedVendorTransactions.length : 0,
          revenueByDate
        },
        benchmark: {
          marketplaceRevenue,
          activeSellers: vendors.filter((item) => getStatus(item) === "active").length,
          averageVendorRevenue: vendorsWithSales.length ? marketplaceRevenue / vendorsWithSales.length : 0,
          vendorRevenueRank: rank || null,
          rankedVendors: revenueStandings.length,
          vendorAverageOrderValue: vendorTransactions.length ? revenue / vendorTransactions.length : 0,
          marketplaceAverageOrderValue: marketplaceOrderValue,
          revenueVsAveragePercent: vendorsWithSales.length ? ((revenue / (marketplaceRevenue / vendorsWithSales.length)) - 1) * 100 : 0,
          leader: revenueStandings[0] || null,
          revenueDistribution: revenueStandings.map((item) => ({
            label: item.id === vendor.id ? `${item.name} (You)` : item.name,
            value: item.revenue
          }))
        }
      });
    }

    if (request.method === "POST" && url.pathname === "/api/products") {
      const body = await readBody(request);
      const newProduct = {
        id: `PROD-${Math.floor(100 + Math.random() * 900)}`,
        vendorId: body.vendorId,
        name: body.name,
        category: body.category,
        price: Number(body.price),
        sku: body.sku,
        stock: Number(body.stock),
        status: body.status || "active",
        imageUrl: body.imageUrl || ""
      };
      products.push(newProduct);
      return sendJson(response, 201, newProduct);
    }

    if (request.method === "POST" && url.pathname === "/api/transactions") {
      const body = await readBody(request);
      const newTransaction = {
        transactionId: `TRN-${Math.floor(1000 + Math.random() * 9000)}`,
        vendorId: body.vendorId,
        productId: body.productId,
        quantity: Number(body.quantity),
        totalAmount: Number(body.totalAmount),
        date: new Date().toISOString(),
        status: body.status || "processing"
      };
      transactions.push(newTransaction);
      return sendJson(response, 201, newTransaction);
    }

    const transactionStatusMatch = url.pathname.match(/^\/api\/transactions\/([^/]+)\/status$/);
    if (request.method === "PATCH" && transactionStatusMatch) {
      const body = await readBody(request);
      const allowedStatuses = new Set(["processing", "shipped", "delivered", "cancelled"]);
      const status = String(body.status || "").toLowerCase();
      const transaction = transactions.find((item) => item.transactionId === decodeURIComponent(transactionStatusMatch[1]));
      if (!transaction) return sendJson(response, 404, { error: "Transaction not found" });
      if (!allowedStatuses.has(status)) return sendJson(response, 400, { error: "Invalid order status" });
      transaction.status = status;
      return sendJson(response, 200, transaction);
    }

    if (request.method === "POST" && url.pathname === "/api/orders") {
      const body = await readBody(request);
      const { customerId, productId, quantity, totalAmount } = body;

      // Create a new transaction
      const newTransaction = {
        transactionId: `TRN-${Math.floor(1000 + Math.random() * 9000)}`,
        customerId,
        vendorId: products.find(p => p.id === productId)?.vendorId || "UNKNOWN", // Assuming product exists
        productId: productId,
        quantity: Number(quantity),
        totalAmount: Number(totalAmount),
        date: new Date().toISOString(),
        status: "processing"
      };
      transactions.push(newTransaction);

      // Update customer's order count and lifetime value
      const customerIndex = customers.findIndex(cust => cust.id === customerId);
      if (customerIndex !== -1) {
        customers[customerIndex].orderCount = (customers[customerIndex].orderCount || 0) + 1;
        customers[customerIndex].lifetimeValue = (customers[customerIndex].lifetimeValue || 0) + Number(totalAmount);
        customers[customerIndex].lastPurchaseDate = new Date().toISOString();
      } else {
        // If customer not found, create a new one (basic implementation)
        const newCustomer = {
          id: customerId,
          name: `Customer ${customerId}`, // Placeholder name
          firstPurchaseDate: new Date().toISOString(),
          lastPurchaseDate: new Date().toISOString(),
          lifetimeValue: Number(totalAmount),
          orderCount: 1
        };
        customers.push(newCustomer);
      }

      return sendJson(response, 201, { transaction: newTransaction, customer: customers.find(cust => cust.id === customerId) });
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

function createServer() {
  return http.createServer((request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      handleApi(request, response, url);
      return;
    }
    serveStatic(request, response, decodeURIComponent(url.pathname));
  });
}

if (require.main === module) {
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`ShopSense Module 1 running at http://localhost:${PORT}`);
  });
}

module.exports = { createServer };
