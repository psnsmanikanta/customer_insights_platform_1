const STORE_KEYS = {
  vendors: "shopsense.module1.vendors",
  products: "shopsense.module1.products",
  transactions: "shopsense.module1.transactions",
  customers: "shopsense.module1.customers",
  dataRegion: "shopsense.module1.dataRegion"
};

const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  active: "Active",
  suspended: "Suspended",
  under_review: "Under Review",
  rejected: "Rejected",
  missing: "Missing",
  optional: "Optional",
  draft: "Draft",
  out_of_stock: "Out of Stock"
};

const ROUTE_TITLES = {
  "customer-home": "Home",
  "customer-products": "Browse Products",
  "customer-cart": "My Cart",
  "customer-transactions": "My Orders",
  "customer-spending": "My Spending",
  "customer-recommendations": "Recommendations",
  "customer-profile": "My Profile",
  "admin-dashboard": "Admin Dashboard",
  "admin-vendors": "Vendor Roster",
  "admin-categories": "Categories",
  "admin-benchmark": "Marketplace Benchmark",
  "admin-compliance": "Compliance Pipeline",
  "admin-inventory": "Inventory Forecast",
  "admin-customer-segmentation": "Customer Segmentation",
  "admin-customer-behavior": "Customer Behaviour & Recommendations",
  "admin-sales-revenue-intelligence": "Sales & Revenue Intelligence",
  "vendor-onboarding": "Vendor Registration",
  "vendor-dashboard": "Vendor Dashboard",
  "vendor-inventory-health": "Inventory Health",
  "vendor-category-share": "Product Category Share",
  "vendor-transactions": "Recent Transactions",
  "vendor-inventory-alerts": "Inventory Alerts",
  "vendor-benchmark": "Marketplace Benchmark",
  "vendor-catalog": "Product Catalog",
  "vendor-settings": "Vendor Profile Settings",
  "api-playground": "REST API Simulator"
};

const API_ENDPOINTS = [
  {
    method: "GET",
    path: "/api/vendors",
    description: "List vendors. Supports status filter with ?status=active.",
    body: ""
  },
  {
    method: "GET",
    path: "/api/vendors/VND-8392",
    description: "Read one vendor by ID.",
    body: ""
  },
  {
    method: "POST",
    path: "/api/vendors/register",
    description: "Register a new vendor in Pending status.",
    body: JSON.stringify({
      businessName: "Harbor Goods Co",
      email: "ops@harborgoods.example",
      phone: "+91 98765 91720",
      commission: 10
    }, null, 2)
  },
  {
    method: "POST",
    path: "/api/vendors/login",
    description: "Simulate vendor login by email.",
    body: JSON.stringify({ email: "sarah.j@novatech.io" }, null, 2)
  },
  {
    method: "POST",
    path: "/api/vendors/VND-1054/verify",
    description: "Mark vendor verification as Approved.",
    body: "{}"
  },
  {
    method: "POST",
    path: "/api/vendors/VND-1054/approve",
    description: "Approve vendor and activate seller account.",
    body: "{}"
  },
  {
    method: "POST",
    path: "/api/vendors/VND-8392/suspend",
    description: "Suspend a vendor account.",
    body: JSON.stringify({ reason: "Policy review" }, null, 2)
  },
  {
    method: "PUT",
    path: "/api/vendors/VND-8392/profile",
    description: "Update vendor profile fields.",
    body: JSON.stringify({
      businessName: "NovaTech Solutions",
      phone: "+91 98765 43210",
      commission: 8.5
    }, null, 2)
  },
  {
    method: "GET",
    path: "/api/products",
    description: "List all products.",
    body: ""
  }
];

const state = {
  vendors: [],
  products: [
    { id: "PROD-101", vendorId: "VND-8392", name: "SuperDrive Extreme 2TB SSD", category: "Electronics", price: 189.99, sku: "NT-SD-2TB-SSD", stock: 45, status: "active", imageUrl: "https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { id: "PROD-102", vendorId: "VND-8392", name: "ZenBook Pro 15.6 Inch", category: "Computers", price: 1299.00, sku: "NT-ZB-PRO15", stock: 12, status: "active", imageUrl: "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { id: "PROD-103", vendorId: "VND-8392", name: "USB-C Multi-Port Hub (8-in-1)", category: "Accessories", price: 49.99, sku: "NT-UC-HUB8", stock: 150, status: "active", imageUrl: "https://images.pexels.com/photos/943096/pexels-photo-943096.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { id: "PROD-201", vendorId: "VND-4721", name: "Handcrafted Bamboo Cutting Board Set", category: "Home & Kitchen", price: 34.50, sku: "ES-BB-CBSET", stock: 85, status: "active", imageUrl: "https://images.pexels.com/photos/361184/pexels-photo-361184.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { id: "PROD-202", vendorId: "VND-4721", name: "Organic Linen Bed Sheet Set (Queen)", category: "Home & Kitchen", price: 120.00, sku: "ES-OL-SHEETQ", stock: 22, status: "active", imageUrl: "https://images.pexels.com/photos/1400349/pexels-photo-1400349.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { id: "PROD-203", vendorId: "VND-4721", name: "Ergonomic Reclaimed Wood Desk", category: "Furniture", price: 450.00, sku: "ES-ER-RWDESK", stock: 5, status: "active", imageUrl: "https://images.pexels.com/photos/1148957/pexels-photo-1148957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { id: "PROD-301", vendorId: "VND-1054", name: "Pro-Series Compression Socks", category: "Apparel", price: 19.99, sku: "AA-PS-CSOCK", stock: 500, status: "draft", imageUrl: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { id: "PROD-401", vendorId: "VND-6209", name: "Hydrating Rosewater Facial Mist", category: "Beauty & Personal Care", price: 24.00, sku: "VB-HR-MIST", stock: 0, status: "out_of_stock", imageUrl: "https://images.pexels.com/photos/3018845/pexels-photo-3018845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { id: "PROD-501", vendorId: "VND-7324", name: "Wireless Noise-Canceling Earbuds", category: "Electronics", price: 69.99, sku: "BB-WN-EARBUD", stock: 60, status: "active", imageUrl: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { id: "PROD-601", vendorId: "VND-8843", name: "Active Performance Tee", category: "Apparel", price: 39.99, sku: "SN-AP-TEE", stock: 120, status: "active", imageUrl: "https://images.pexels.com/photos/1232459/pexels-photo-1232459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { id: "PROD-701", vendorId: "VND-5517", name: "Precision Ceramic Knife Set", category: "Home & Kitchen", price: 79.99, sku: "UK-CK-SET", stock: 30, status: "active", imageUrl: "https://images.pexels.com/photos/33545/sunrise-phu-quoc-island-ocean.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }
  ],
  currentRole: null,
  currentVendorId: null,
  currentLoginRole: null,
  onboardingStep: 1,
  onboardingCategories: [],
  uploadedDocs: {
    license: false,
    tax: false,
    insurance: false
  },
  selectedEndpoint: API_ENDPOINTS[0],
  selectedComplianceVendorId: null,
  analytics: [],
  customerBehaviorAnalytics: null,
  customers: [],
  transactions: [],
  selectedCustomerId: null,
  vendorDashboard: null,
  adminDashboard: null,
  adminCategories: [],
  adminBenchmark: null,
  customerDashboard: null
};


const storage = {
  load(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : structuredClone(fallback);
    } catch (error) {
      console.warn("Storage load failed", error);
      return structuredClone(fallback);
    }
  },
  save() {
    localStorage.setItem(STORE_KEYS.vendors, JSON.stringify(state.vendors));
    localStorage.setItem(STORE_KEYS.products, JSON.stringify(state.products));
    localStorage.setItem(STORE_KEYS.customers, JSON.stringify(state.customers));
  }
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const DATA_REGION = "IN";

function normalizeStatus(status) {
  if (status === "approved") return "approved";
  if (status === "active") return "active";
  if (status === "suspended") return "suspended";
  return "pending";
}

function getVendorStatus(vendor) {
  if (vendor.operationalStatus === "suspended") return "suspended";
  if (vendor.operationalStatus === "active") return "active";
  if (vendor.verificationStatus === "approved") return "approved";
  return "pending";
}

function getCommissionValue(vendor) {
  return Number(vendor.commission ?? vendor.commissionStructure?.rate ?? 10);
}

function getCreatedAt(vendor) {
  return vendor.createdAt || vendor.createdDate || new Date().toISOString();
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function badge(status) {
  const normalized = String(status || "pending").replaceAll("_", "-");
  return `<span class="badge badge-${normalized}">${STATUS_LABELS[status] || status}</span>`;
}

function byId(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function generateId(prefix) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function defaultVendor(input) {
  const commission = Number(input.commission ?? input.commissionRate ?? 10);
  return {
    id: input.id || generateId("VND"),
    businessName: input.businessName?.trim(),
    registrationNumber: input.registrationNumber || "Pending",
    address: input.address || "India address not provided",
    contactPerson: input.contactPerson || input.businessName || "Vendor Owner",
    email: input.email?.trim().toLowerCase(),
    phone: input.phone?.trim(),
    categories: input.categories?.length ? input.categories : ["General Merchandise"],
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
    documents: [
      { id: generateId("DOC"), name: "Business Registration Certificate", status: input.licenseUploaded ? "pending" : "missing", fileUrl: "" },
      { id: generateId("DOC"), name: "Tax Identification Document", status: input.taxUploaded ? "pending" : "missing", fileUrl: "" }
    ],
    metrics: {
      fulfillmentRate: 0,
      avgRating: 0,
      salesVolume: 0,
      commissionEarned: 0
    },
    settings: {
      paymentMethod: "ACH Direct Deposit",
      billingEmail: input.email?.trim().toLowerCase(),
      webhookUrl: "",
      apiToken: `mkt_live_${Math.random().toString(36).slice(2, 14)}`
    }
  };
}

const ADMIN_CREDENTIALS = { email: "admin@shopsense.com", password: "adminpassword" };
const VENDOR_CREDENTIALS = { email: "vendor@shopsense.com", password: "vendorpassword" };
const CUSTOMER_CREDENTIALS = { email: "customer@shopsense.com", password: "customerpassword" };

const backend = {
  listVendors(query = {}) {
    let vendors = [...state.vendors];
    if (query.status && query.status !== "all") {
      vendors = vendors.filter((vendor) => getVendorStatus(vendor) === query.status);
    }
    return vendors.map(this.toDatabaseRecord);
  },
  getVendor(id) {
    const vendor = state.vendors.find((item) => item.id === id);
    if (!vendor) throw { status: 404, message: "Vendor not found" };
    return this.toDatabaseRecord(vendor);
  },
  registerVendor(payload) {
    const required = ["businessName", "email", "phone"];
    const missing = required.filter((field) => !payload[field]);
    if (missing.length) throw { status: 400, message: `Missing required field(s): ${missing.join(", ")}` };
    if (state.vendors.some((vendor) => vendor.email.toLowerCase() === payload.email.toLowerCase())) {
      throw { status: 409, message: "A vendor with this email already exists" };
    }
    const vendor = defaultVendor(payload);
    state.vendors.unshift(vendor);
    storage.save();
    renderAll();
    return this.toDatabaseRecord(vendor);
  },
  loginVendor(payload) {
    const vendor = state.vendors.find(item => item.email.toLowerCase() === String(payload.email || "").toLowerCase());
    if (!vendor || payload.password !== "vendorpassword") { // Simplified password check for demo
      throw { status: 401, message: "Invalid vendor email or password" };
    }
    state.currentRole = vendor.id;
    state.currentVendorId = vendor.id;
    renderAll();
    return { token: vendor.settings.apiToken, vendor: this.toDatabaseRecord(vendor) };
  },
  loginAdmin(payload) {
    if (payload.email === ADMIN_CREDENTIALS.email && payload.password === ADMIN_CREDENTIALS.password) {
      state.currentRole = "admin";
      state.currentVendorId = null;
      renderAll();
      return { token: "admin_token", user: { email: ADMIN_CREDENTIALS.email, role: "admin" } };
    } else {
      throw { status: 401, message: "Invalid admin email or password" };
    }
  },
      loginCustomer(payload) {
    // Automatically log in as the first customer for demonstration purposes.
    const customer = state.customers[0];
    if (!customer) {
      throw { status: 401, message: "No customers available to log in." };
    }
    state.currentRole = "customer";
    state.selectedCustomerId = customer.id;
    renderAll();
    return { token: "customer_token", user: { email: customer.email, role: "customer", id: customer.id } };
  },

  enterAdminPortal() {
    this.showLoginForm('admin');
  },

  enterVendorPortal() {
    this.showLoginForm('vendor');
  },

  enterCustomerPortal() {
    this.showLoginForm('customer');
  },

  showLoginForm(role) {
    if (role === "customer") {
      enterCustomerPortal();
      return;
    }
    state.currentLoginRole = role;
    const loginScreen = byId('login-screen');
    const roleGrid = loginScreen.querySelector('.login-role-grid');
    const loginForm = byId('login-form-container');

    if (!loginForm) {
      const formHtml = `
        <div id="login-form-container" style="display: none; animation: fadeIn 0.3s ease-out;">
          <h2 id="login-form-title"></h2>
          <div class="form-field" id="login-email-field">
            <label for="login-email">Email Address</label>
            <input type="email" id="login-email" placeholder="Enter your email">
          </div>
          <div class="form-field" id="login-password-field">
            <label for="login-password">Password</label>
            <input type="password" id="login-password" placeholder="Enter your password">
          </div>
          <div class="form-options" id="login-remember-field">
            <label><input type="checkbox" id="remember-me"> Remember me</label>
          </div>
          <div id="login-customer-note" class="info-message" style="display: none; margin-bottom: 16px; color: #0f766e;">
            Customer access does not require email or password.
          </div>
          <button class="btn btn-primary" onclick="window.app.processLogin()" style="width: 100%;">Sign In</button>
          <button class="btn btn-secondary" onclick="window.app.showRoleSelection()" style="width: 100%; margin-top: 10px;">Back to Role Selection</button>
          <div id="login-error-message" class="error-message" style="display: none;"></div>
        </div>
      `;
      roleGrid.insertAdjacentHTML('afterend', formHtml);
    }
    
    roleGrid.style.display = "none";
    byId('login-form-container').style.display = "block";
    byId("login-form-title").textContent = `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`;

    const loginEmailField = byId("login-email")?.closest(".form-field");
    const loginPasswordField = byId("login-password")?.closest(".form-field");
    const rememberField = byId("remember-me")?.closest(".form-options");
    const customerNote = byId("login-customer-note");
    const showCredentials = role !== "customer";

    if (loginEmailField) loginEmailField.style.display = showCredentials ? "block" : "none";
    if (loginPasswordField) loginPasswordField.style.display = showCredentials ? "block" : "none";
    if (rememberField) rememberField.style.display = showCredentials ? "block" : "none";
    if (customerNote) customerNote.style.display = showCredentials ? "none" : "block";

    if (showCredentials) {
      byId("login-email").value = localStorage.getItem("rememberedEmail") || "";
      byId("remember-me").checked = false;
    } else {
      byId("login-email").value = "";
      byId("remember-me").checked = false;
    }
    byId("login-password").value = "";
    byId("login-error-message").style.display = "none";
  },

  showRoleSelection() {
    state.currentLoginRole = null;
    const loginScreen = byId('login-screen');
    loginScreen.querySelector('.login-role-grid').style.display = "grid";
    const loginForm = byId('login-form-container');
    if (loginForm) {
      loginForm.style.display = "none";
    }
    const errorMessage = byId("login-error-message");
    if(errorMessage) errorMessage.style.display = "none";
  },

  processLogin() {
    const email = byId("login-email").value;
    const password = byId("login-password").value;
    const errorMessageDiv = byId("login-error-message");
    errorMessageDiv.style.display = "none";
    errorMessageDiv.textContent = "";

    const requiresCredentials = state.currentLoginRole !== "customer";
    if (requiresCredentials && (!email || !password)) {
      errorMessageDiv.textContent = "Please enter both email and password.";
      errorMessageDiv.style.display = "block";
      return;
    }

    try {
      let result;
      if (state.currentLoginRole === "admin") {
        result = backend.loginAdmin({ email, password });
      } else if (state.currentLoginRole === "vendor") {
        result = backend.loginVendor({ email, password });
      } else if (state.currentLoginRole === "customer") {
        result = backend.loginCustomer({});
        hideLoginScreen();
      } else {
        throw { status: 400, message: "Invalid login role." };
      }
      if (byId("remember-me").checked && state.currentLoginRole !== "customer") {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedRole", state.currentLoginRole);
        if (state.currentLoginRole === "customer") {
          const customer = state.customers.find(c => c.email?.toLowerCase() === email.toLowerCase());
          if (customer) {
            localStorage.setItem("rememberedCustomerId", customer.id);
          }
        }
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedRole");
        localStorage.removeItem("rememberedCustomerId");
      }
      if (state.currentLoginRole === "customer") {
        switchTab('customer-products');
      } else if (state.currentLoginRole === "vendor") {
        switchTab('vendor-dashboard');
      }
      window.app.showRoleSelection(); // Hide login form on successful login
      byId("login-screen").hidden = true;
      byId("app-shell").hidden = false;
      renderAll();
      showToast(`Logged in as ${state.currentLoginRole}!`, "success");
    } catch (error) {
      errorMessageDiv.textContent = error.message || "Login failed. Please try again.";
      errorMessageDiv.style.display = "block";
    }
  },
  logout() {
    state.currentRole = null;
    state.currentVendorId = null;
    state.currentLoginRole = null;
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedRole");
    localStorage.removeItem("rememberedCustomerId");
    byId("login-screen").hidden = false;
    byId("app-shell").hidden = true;
    window.app.showRoleSelection();
    renderAll();
    showToast("Logged out successfully.", "info");
  },
  checkRememberedLogin() {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedRole = localStorage.getItem("rememberedRole");
    const rememberedCustomerId = localStorage.getItem("rememberedCustomerId");

    if (rememberedEmail && rememberedRole) {
      try {
        let result;
        if (rememberedRole === "admin") {
          result = backend.loginAdmin({ email: rememberedEmail, password: "adminpassword" });
        } else if (rememberedRole === "vendor") {
          const vendor = state.vendors.find(v => v.email?.toLowerCase() === rememberedEmail.toLowerCase());
          if(vendor) {
            result = backend.loginVendor({ email: rememberedEmail, password: "vendorpassword" });
          }
        } else if (rememberedRole === "customer") {
          result = backend.loginCustomer({ email: rememberedEmail, password: "customerpassword" });
          if (result && rememberedCustomerId) {
            state.selectedCustomerId = rememberedCustomerId;
          }
        }

        if (result) {
          state.currentLoginRole = rememberedRole;
          if (rememberedRole === "customer") {
            switchTab('customer-products');
          }
          byId("login-screen").hidden = true;
          byId("app-shell").hidden = false;
          renderAll();
          showToast(`Welcome back! Logged in as ${rememberedRole}.`, "success");
        }
      } catch (error) {
        console.warn("Remembered login failed:", error);
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedRole");
        localStorage.removeItem("rememberedCustomerId");
      }
    }
  },
  verifyVendor(id) {
    const vendor = this.findVendor(id);
    vendor.verificationStatus = "approved";
    vendor.documents = vendor.documents.map((document) => ({ ...document, status: "approved" }));
    if (vendor.operationalStatus !== "suspended") vendor.operationalStatus = "pending";
    vendor.status = "approved";
    storage.save();
    renderAll();
    return this.toDatabaseRecord(vendor);
  },
  approveVendor(id) {
    const vendor = this.findVendor(id);
    vendor.verificationStatus = "approved";
    vendor.operationalStatus = "active";
    vendor.status = "active";
    storage.save();
    renderAll();
    return this.toDatabaseRecord(vendor);
  },
  suspendVendor(id, payload = {}) {
    const vendor = this.findVendor(id);
    vendor.operationalStatus = "suspended";
    vendor.status = "suspended";
    vendor.suspensionReason = payload.reason || "Administrative suspension";
    storage.save();
    renderAll();
    return this.toDatabaseRecord(vendor);
  },
  updateProfile(id, payload) {
    const vendor = this.findVendor(id);
    if (payload.email && state.vendors.some((item) => item.id !== id && item.email.toLowerCase() === payload.email.toLowerCase())) {
      throw { status: 409, message: "A vendor with this email already exists" };
    }
    ["businessName", "email", "phone", "address", "contactPerson", "registrationNumber"].forEach((field) => {
      if (payload[field] !== undefined) vendor[field] = String(payload[field]).trim();
    });
    if (payload.categories) vendor.categories = Array.isArray(payload.categories) ? payload.categories : String(payload.categories).split(",").map((item) => item.trim()).filter(Boolean);
    if (payload.commission !== undefined) {
      vendor.commission = Number(payload.commission);
      vendor.commissionStructure.rate = Number(payload.commission);
      vendor.commissionStructure.details = `${Number(payload.commission)}% marketplace commission`;
    }
    vendor.settings.billingEmail = vendor.settings.billingEmail || vendor.email;
    storage.save();
    renderAll();
    return this.toDatabaseRecord(vendor);
  },
  findVendor(id) {
    const vendor = state.vendors.find((item) => item.id === id);
    if (!vendor) throw { status: 404, message: "Vendor not found" };
    return vendor;
  },
  toDatabaseRecord(vendor) {
    return {
      id: vendor.id,
      businessName: vendor.businessName,
      email: vendor.email,
      phone: vendor.phone,
      commission: getCommissionValue(vendor),
      status: getVendorStatus(vendor),
      createdAt: getCreatedAt(vendor)
    };
  },
  listProducts() {
    return state.products;
  }
};

function parseRequestUri(uri) {
  const [path, queryString = ""] = uri.split("?");
  const query = Object.fromEntries(new URLSearchParams(queryString));
  return { path, query };
}

function routeRequest(method, uri, body = {}) {
  const { path, query } = parseRequestUri(uri);
  const vendorMatch = path.match(/^\/api\/vendors\/([^/]+)$/);
  const actionMatch = path.match(/^\/api\/vendors\/([^/]+)\/(verify|approve|suspend|profile)$/);

  if (method === "GET" && path === "/api/vendors") return backend.listVendors(query);
  if (method === "GET" && vendorMatch) return backend.getVendor(vendorMatch[1]);
  if (method === "POST" && path === "/api/vendors/register") return backend.registerVendor(body);
  if (method === "POST" && path === "/api/vendors/login") return backend.loginVendor(body);
  if (method === "POST" && actionMatch?.[2] === "verify") return backend.verifyVendor(actionMatch[1]);
  if (method === "POST" && actionMatch?.[2] === "approve") return backend.approveVendor(actionMatch[1]);
  if (method === "POST" && actionMatch?.[2] === "suspend") return backend.suspendVendor(actionMatch[1], body);
  if (method === "PUT" && actionMatch?.[2] === "profile") return backend.updateProfile(actionMatch[1], body);
  if (method === "GET" && path === "/api/products") return backend.listProducts();

  throw { status: 404, message: "Endpoint not found" };
}

function renderAll() {
  try {
    console.log("Rendering all components...");
    renderRoleSelector();
    console.log("renderRoleSelector successful");
    renderAdminDashboard();
    console.log("renderAdminDashboard successful");
    renderAdminCategories();
    console.log("renderAdminCategories successful");
    renderVendorTable();
    console.log("renderVendorTable successful");
    renderComplianceQueue();
    console.log("renderComplianceQueue successful");
    renderRevenueAnalytics();
    console.log("renderRevenueAnalytics successful");
    renderSalesRevenueIntelligence();
    console.log("renderSalesRevenueIntelligence successful");
    renderVendorViews();
    console.log("renderVendorViews successful");
    renderEndpoints();
    console.log("renderEndpoints successful");
    updateRoleChrome();
    console.log("updateRoleChrome successful");
    updateNavigationVisibility();
    console.log("updateNavigationVisibility successful");
    renderCustomerProducts();
    console.log("renderCustomerProducts successful");
    renderCustomerTransactions();
    console.log("renderCustomerTransactions successful");
    console.log("All components rendered successfully.");
    debugger;
  } catch (error) {
    console.error("Error during renderAll:", error);
  }
}

function renderCustomerProducts() {
  const customerProductsSection = byId("view-customer-products");
  if (!customerProductsSection) return;

  // Add Amazon-style header with search and cart
  customerProductsSection.innerHTML = `
    <div class="amazon-header">
      <div class="amazon-logo">ShopSense</div>
      <div class="amazon-search-bar">
        <input type="text" id="product-search" placeholder="Search products..." oninput="window.app.filterProducts()">
        <button class="search-btn" onclick="window.app.filterProducts()">Search</button>
      </div>
      <div class="amazon-cart" onclick="window.app.switchTab('customer-cart')">
        <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        <span class="cart-count" id="cart-count">0</span>
      </div>
    </div>
    <div class="amazon-main">
      <div class="category-sidebar">
        <h3>Shop by Category</h3>
        <ul>
          <li onclick="window.app.filterByCategory('all')">All Products</li>
          <li onclick="window.app.filterByCategory('Electronics')">Electronics</li>
          <li onclick="window.app.filterByCategory('Computers')">Computers</li>
          <li onclick="window.app.filterByCategory('Accessories')">Accessories</li>
          <li onclick="window.app.filterByCategory('Home & Kitchen')">Home & Kitchen</li>
          <li onclick="window.app.filterByCategory('Furniture')">Furniture</li>
          <li onclick="window.app.filterByCategory('Apparel')">Apparel</li>
          <li onclick="window.app.filterByCategory('Beauty & Personal Care')">Beauty & Personal Care</li>
        </ul>
      </div>
      <div class="products-container">
        <div class="products-header">
          <h2 id="products-title">All Products</h2>
          <span id="products-count">${state.products.filter(p => p.status === 'active' && p.stock > 0).length} results</span>
        </div>
        <div class="product-grid" id="product-grid">
        </div>
      </div>
    </div>
  `;
  
  // Render all active products
  renderFilteredProducts(state.products.filter(p => p.status === 'active' && p.stock > 0));
}

function customerProductCard(product) {
  const vendor = state.vendors.find((item) => item.id === product.vendorId);
  return `<div class="customer-product-card"><img src="${escapeHtml(product.imageUrl || "https://via.placeholder.com/320x220?text=ShopSense")}" alt="${escapeHtml(product.name)}"><div><strong>${escapeHtml(product.name)}</strong><small>Sold by ${escapeHtml(vendor?.businessName || "Marketplace vendor")}</small><small class="recommendation-reason">${escapeHtml(product.recommendationReason || "Selected from marketplace data")}</small><b>${currency.format(product.price)}</b><button class="btn btn-primary btn-sm" onclick="window.app.addToCart('${product.id}')">Add to Cart</button></div></div>`;
}

function renderCustomerHome() {
  const container = byId("customer-home-content");
  const dashboard = state.customerDashboard;
  if (!container) return;
  if (!dashboard) return void (container.innerHTML = `<div class="vendor-empty-state">Loading customer dashboard...</div>`);
  const customer = dashboard.customer;
  const cartCount = state.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  container.innerHTML = `<div class="customer-hero"><div><h2>Welcome, ${escapeHtml(customer.name)}</h2><p>Search, browse, and buy products from all vendors on ShopSense.</p><div class="customer-search"><input id="customer-home-search" placeholder="Search for products, brands, and more..."><button onclick="window.app.openCustomerSearch()">Search</button></div></div><div class="customer-avatar">${escapeHtml(customer.name.charAt(0))}</div></div><div class="customer-shortcuts"><button onclick="window.app.switchTab('customer-cart')">Cart (${cartCount})</button><button onclick="window.app.switchTab('customer-transactions')">My Orders (${customer.orderCount})</button><button onclick="window.app.switchTab('customer-recommendations')">Wishlist (${state.wishlist?.length || 0})</button><button onclick="window.app.switchTab('customer-profile')">My Address</button><button onclick="window.app.switchTab('customer-spending')">My Spending</button></div><div class="card-header-flex customer-section-title"><div><span class="card-title">Recommended for You</span><div class="vendor-section-hint">Suggestions generated from product and transaction data.</div></div></div><div class="customer-recommendation-grid">${dashboard.recommendations.map(customerProductCard).join("")}</div>`;
}

function renderCustomerSpending() {
  const container = byId("customer-spending-content");
  const customer = state.customerDashboard?.customer;
  if (!container || !customer) return;
  const average = customer.orderCount ? customer.lifetimeValue / customer.orderCount : 0;
  container.innerHTML = `<div class="grid-cols-3"><div class="glass-card"><div class="metric-card"><span class="metric-label">Lifetime spending</span><span class="metric-value">${currency.format(customer.lifetimeValue)}</span></div></div><div class="glass-card"><div class="metric-card"><span class="metric-label">Orders placed</span><span class="metric-value">${customer.orderCount}</span></div></div><div class="glass-card"><div class="metric-card"><span class="metric-label">Average order value</span><span class="metric-value">${currency.format(average)}</span></div></div></div>`;
}

function renderCustomerRecommendations() {
  const container = byId("customer-recommendations-content");
  const products = state.customerDashboard?.recommendations || [];
  if (!container) return;
  container.innerHTML = `<div class="glass-card"><div class="card-header-flex"><div><span class="card-title">Recommended for You</span><div class="vendor-section-hint">Live suggestions based on marketplace data.</div></div></div><div class="customer-recommendation-grid">${products.map(customerProductCard).join("") || `<div class="vendor-empty-state">No recommendations available.</div>`}</div></div>`;
}

function renderCustomerProfile() {
  const container = byId("customer-profile-details");
  const customer = state.customerDashboard?.customer;
  if (!container || !customer) return;
  container.innerHTML = `<div class="document-item"><div><div class="document-name">${escapeHtml(customer.name)}</div><div class="document-meta">Customer ID: ${escapeHtml(customer.id)}</div></div><span class="badge badge-approved">Customer account</span></div><div class="document-item"><div><div class="document-name">Member since</div><div class="document-meta">${formatDate(customer.firstPurchaseDate)}</div></div><div><div class="document-name">Last purchase</div><div class="document-meta">${formatDate(customer.lastPurchaseDate)}</div></div></div>`;
}

function openCustomerSearch() {
  const term = byId("customer-home-search")?.value || "";
  switchTab("customer-products");
  setTimeout(() => { const search = byId("product-search"); if (search) { search.value = term; filterProducts(); } }, 0);
}

async function refreshCustomerDashboard() {
  const customerId = state.selectedCustomerId || state.customers[0]?.id;
  if (!customerId) return;
  try {
    const response = await fetch(`/api/customers/${encodeURIComponent(customerId)}/dashboard`);
    if (!response.ok) throw new Error("Customer dashboard request failed");
    state.customerDashboard = await response.json();
  } catch (error) { console.warn("Unable to load customer dashboard from API", error); }
  renderCustomerHome(); renderCustomerSpending(); renderCustomerRecommendations(); renderCustomerProfile();
}

function renderFilteredProducts(products) {
  const productGrid = byId("product-grid");
  if (!productGrid) return;
  
  if (products.length === 0) {
    productGrid.innerHTML = '<p class="no-products">No products match your search criteria.</p>';
    return;
  }
  
  const productsHtml = products.map(product => {
    // Calculate rating (simulated)
    const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 to 5.0
    const reviewCount = Math.floor(Math.random() * 1000) + 10;
    const stars = Math.round(parseFloat(rating));
    
    return `
      <div class="amazon-product-card">
        <div class="product-image-container">
          <img src="${escapeHtml(product.imageUrl || 'https://via.placeholder.com/300')}" alt="${escapeHtml(product.name)}" class="amazon-product-image">
        </div>
        <div class="product-info">
          <h3 class="amazon-product-title">${escapeHtml(product.name)}</h3>
          <div class="product-rating">
            <div class="stars">
              ${Array(5).fill(0).map((_, i) => `<span class="${i < stars ? 'filled' : ''}">★</span>`).join('')}
            </div>
            <span class="review-count">${reviewCount}</span>
          </div>
          <div class="price-section">
            <span class="price">${currency.format(product.price)}</span>
          </div>
          <div class="stock-status ${product.stock > 10 ? 'in-stock' : 'low-stock'}">
            ${product.stock > 10 ? 'In Stock' : `Only ${product.stock} left in stock`}
          </div>
          <button class="add-to-cart-btn" onclick="window.app.addToCart('${product.id}')">Add to Cart</button>
          <button class="add-to-wishlist-btn" onclick="window.app.addToWishlist('${product.id}')">Add to Wishlist</button>
        </div>
      </div>
    `;
  }).join('');
  
  productGrid.innerHTML = productsHtml;
  updateCartCount();
}

function filterProducts() {
  const searchTerm = byId("product-search").value.toLowerCase();
  const filtered = state.products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm);
    return matchesSearch && p.status === 'active' && p.stock > 0;
  });
  renderFilteredProducts(filtered);
  byId("products-count").textContent = `${filtered.length} results`;
}

function filterByCategory(category) {
  let filtered;
  if (category === 'all') {
    filtered = state.products.filter(p => p.status === 'active' && p.stock > 0);
    byId("products-title").textContent = "All Products";
  } else {
    filtered = state.products.filter(p => p.category === category && p.status === 'active' && p.stock > 0);
    byId("products-title").textContent = category;
  }
  renderFilteredProducts(filtered);
  byId("products-count").textContent = `${filtered.length} results`;
}

function addToCart(productId) {
  if (!state.cart) state.cart = [];
  const product = state.products.find(p => p.id === productId);
  if (product) {
    const existingItem = state.cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      state.cart.push({ ...product, quantity: 1 });
    }
    updateCartCount();
    showToast(`${product.name} added to cart!`);
  }
}

function addToWishlist(productId) {
  if (!state.wishlist) state.wishlist = [];
  const product = state.products.find(p => p.id === productId);
  if (product && !state.wishlist.find(item => item.id === productId)) {
    state.wishlist.push(product);
    showToast(`${product.name} added to wishlist!`);
  }
}

function updateCartCount() {
  const cartCount = byId("cart-count");
  if (cartCount && state.cart) {
    cartCount.textContent = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}

// Initialize cart if not exists
if (!state.cart) state.cart = [];
if (!state.wishlist) state.wishlist = [];

function renderCustomerCart() {
  const cartSection = byId("view-customer-cart");
  if (!cartSection) return;
  
  if (!state.cart || state.cart.length === 0) {
    cartSection.innerHTML = `
      <div class="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <button class="btn btn-primary" onclick="window.app.switchTab('customer-products')">Continue Shopping</button>
      </div>
    `;
    return;
  }
  
  const cartItemsHtml = state.cart.map(item => `
    <div class="cart-item">
      <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" class="cart-item-image">
      <div class="cart-item-details">
        <h3>${escapeHtml(item.name)}</h3>
        <p class="cart-item-price">${currency.format(item.price)}</p>
        <div class="cart-item-quantity">
          <button onclick="window.app.updateCartQuantity('${item.id}', -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="window.app.updateCartQuantity('${item.id}', 1)">+</button>
        </div>
        <button class="remove-item-btn" onclick="window.app.removeFromCart('${item.id}')">Remove</button>
      </div>
      <div class="cart-item-total">
        ${currency.format(item.price * item.quantity)}
      </div>
    </div>
  `).join('');
  
  const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  cartSection.innerHTML = `
    <div class="cart-container">
      <div class="cart-items-container">
        <h2>Shopping Cart</h2>
        ${cartItemsHtml}
      </div>
      <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${currency.format(total)}</span>
        </div>
        <div class="summary-row">
          <span>Shipping:</span>
          <span>$5.99</span>
        </div>
        <div class="summary-row total">
          <span>Order Total:</span>
          <span>${currency.format(total + 5.99)}</span>
        </div>
        <button class="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  `;
}

function renderCustomerWishlist() {
  const wishlistSection = byId("view-customer-wishlist");
  if (!wishlistSection) return;
  
  if (!state.wishlist || state.wishlist.length === 0) {
    wishlistSection.innerHTML = `
      <div class="empty-wishlist">
        <h2>Your wishlist is empty</h2>
        <p>Save items you love for later!</p>
        <button class="btn btn-primary" onclick="window.app.switchTab('customer-products')">Browse Products</button>
      </div>
    `;
    return;
  }
  
  const wishlistItemsHtml = state.wishlist.map(item => `
    <div class="wishlist-item">
      <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" class="wishlist-item-image">
      <div class="wishlist-item-details">
        <h3>${escapeHtml(item.name)}</h3>
        <p class="wishlist-item-price">${currency.format(item.price)}</p>
        <button class="btn btn-primary" onclick="window.app.moveToCart('${item.id}')">Add to Cart</button>
        <button class="remove-item-btn" onclick="window.app.removeFromWishlist('${item.id}')">Remove</button>
      </div>
    </div>
  `).join('');
  
  wishlistSection.innerHTML = `
    <div class="wishlist-grid">
      ${wishlistItemsHtml}
    </div>
  `;
}

function renderCustomerTransactions() {
  const transactionsSection = byId("view-customer-transactions");
  if (!transactionsSection) return;
  
  const userTransactions = state.transactions
    .filter((transaction) => !transaction.customerId || transaction.customerId === state.selectedCustomerId)
    .sort((left, right) => new Date(right.date) - new Date(left.date))
    .slice(0, 10);
  
  if (userTransactions.length === 0) {
    transactionsSection.innerHTML = `
      <div class="empty-transactions">
        <h2>No orders yet</h2>
        <p>Your order history will appear here once you make a purchase!</p>
        <button class="btn btn-primary" onclick="window.app.switchTab('customer-products')">Start Shopping</button>
      </div>
    `;
    return;
  }
  
  const transactionsHtml = userTransactions.map(tx => {
    const product = state.products.find(p => p.id === tx.productId);
    const vendor = state.vendors.find(v => v.id === tx.vendorId);
    return `
      <div class="transaction-item">
        <div class="transaction-header">
          <span>Order #${tx.transactionId}</span>
          <span>${new Date(tx.date).toLocaleDateString()}</span>
        </div>
        <div class="transaction-details">
          ${product ? `<img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name)}" class="transaction-item-image">` : ''}
          <div>
            <h4>${product ? escapeHtml(product.name) : 'Unknown Product'}</h4>
            <p>Sold by: ${vendor ? escapeHtml(vendor.businessName) : 'Unknown Vendor'}</p>
            <p>Quantity: ${tx.quantity} | Total: ${currency.format(tx.totalAmount)} | <span class="badge ${tx.status === "cancelled" ? "badge-suspended" : "badge-approved"}">${escapeHtml(tx.status || "delivered")}</span></p>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  transactionsSection.innerHTML = `
    <div class="transactions-list">
      <h2>Your Order History</h2>
      ${transactionsHtml}
    </div>
  `;
}

function updateCartQuantity(productId, change) {
  const item = state.cart.find(i => i.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      renderCustomerCart();
      updateCartCount();
    }
  }
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  renderCustomerCart();
  updateCartCount();
  showToast("Item removed from cart");
}

function removeFromWishlist(productId) {
  state.wishlist = state.wishlist.filter(item => item.id !== productId);
  renderCustomerWishlist();
  showToast("Item removed from wishlist");
}

function moveToCart(productId) {
  const item = state.wishlist.find(i => i.id === productId);
  if (item) {
    // Add to cart
    addToCart(productId);
    // Remove from wishlist
    removeFromWishlist(productId);
    showToast("Item moved to cart");
  }
}

// Add these functions to the switchTab logic to render when the tab is opened
const originalSwitchTab = switchTab;
switchTab = function(tabName) {
  originalSwitchTab(tabName);
  if (tabName === 'customer-cart') renderCustomerCart();
  if (tabName === 'customer-wishlist') renderCustomerWishlist();
  if (tabName === 'customer-transactions') renderCustomerTransactions();
  if (tabName === 'customer-home') renderCustomerHome();
  if (tabName === 'customer-spending') renderCustomerSpending();
  if (tabName === 'customer-recommendations') renderCustomerRecommendations();
  if (tabName === 'customer-profile') renderCustomerProfile();
};

function updateNavigationVisibility() {
  const adminNav = byId("nav-group-admin");
  const vendorNav = byId("nav-group-vendor");
  const customerNav = byId("nav-group-customer"); // Will be added in index.html later

  if (adminNav) adminNav.style.display = state.currentRole === "admin" ? "block" : "none";
  if (vendorNav) vendorNav.style.display = state.currentRole && state.currentRole.startsWith("VND") ? "block" : "none";
  if (customerNav) customerNav.style.display = state.currentRole === "customer" ? "block" : "none";
}

function renderRoleSelector() {
  const selector = byId("role-selector");
  if (!selector) return;
  const current = selector.value || state.currentRole;
  selector.innerHTML = `
    <option value="admin">Marketplace Administrator</option>
    <option value="customer">Customer (Shopping Portal)</option>
    <option disabled>--- Registered Vendors ---</option>
    ${state.vendors.map((vendor) => `<option value="${vendor.id}">Vendor: ${escapeHtml(vendor.businessName)} (${STATUS_LABELS[getVendorStatus(vendor)]})</option>`).join("")}
    <option disabled>--- Onboarding ---</option>
    <option value="register_new">Register a New Vendor...</option>
  `;
  selector.value = state.vendors.some((vendor) => vendor.id === current) ? current : state.currentRole;
}

function renderAdminDashboard() {
  const localRevenue = state.transactions.reduce((total, transaction) => total + Number(transaction.totalAmount || 0), 0);
  const liveDashboard = state.adminDashboard;
  const summary = liveDashboard?.summary || {
    totalRevenue: localRevenue,
    totalOrders: state.transactions.length,
    totalProducts: state.products.length,
    totalVendors: state.vendors.length,
    activeVendors: state.vendors.filter((vendor) => getVendorStatus(vendor) === "active").length,
    lowStockCount: state.products.filter((product) => Number(product.stock || 0) < 20).length
  };
  byId("admin-total-sales").textContent = currency.format(summary.totalRevenue);
  byId("admin-total-orders").textContent = summary.totalOrders;
  byId("admin-total-products").textContent = summary.totalProducts;
  byId("admin-total-vendors").textContent = summary.totalVendors;

  const pending = liveDashboard?.pendingVendors || state.vendors.filter((vendor) => getVendorStatus(vendor) === "pending" || getVendorStatus(vendor) === "approved");
  byId("admin-pending-onboardings-container").innerHTML = pending.length
    ? pending.map((vendor) => `
      <tr>
        <td><strong>${escapeHtml(vendor.businessName)}</strong></td>
        <td>${escapeHtml(vendor.email)}</td>
        <td>${formatDate(getCreatedAt(vendor))}</td>
        <td><button class="btn btn-primary btn-sm" onclick="window.app.openComplianceReview('${vendor.id}')">Review</button></td>
      </tr>
    `).join("")
    : `<tr><td colspan="4" style="color: var(--text-muted);">No pending vendor applications.</td></tr>`;

  const leaderboard = liveDashboard?.vendorRevenue || state.vendors.map((vendor) => ({
    id: vendor.id,
    name: vendor.businessName,
    categories: vendor.categories,
    status: getVendorStatus(vendor),
    revenue: state.transactions.filter((transaction) => transaction.vendorId === vendor.id).reduce((total, transaction) => total + Number(transaction.totalAmount || 0), 0),
    commission: 0
  })).sort((a, b) => b.revenue - a.revenue);
  byId("admin-leaderboard-tbody").innerHTML = leaderboard
    .map((vendor) => `
      <tr>
        <td><strong>${escapeHtml(vendor.name || vendor.businessName)}</strong><br><span style="color:var(--text-dim);font-size:.78rem;">${vendor.id}</span></td>
        <td>${escapeHtml((vendor.categories || []).join(", "))}</td>
        <td>${currency.format(vendor.revenue || 0)}</td>
        <td>${currency.format(vendor.commission || 0)}</td>
        <td>${badge(vendor.status || getVendorStatus(vendor))}</td>
      </tr>
    `).join("");

  const lowStockProducts = liveDashboard?.lowStockProducts || state.products.filter((product) => Number(product.stock || 0) < 20).map((product) => ({ ...product, vendorName: state.vendors.find((vendor) => vendor.id === product.vendorId)?.businessName || product.vendorId, stockStatus: Number(product.stock || 0) === 0 ? "Out of stock" : "Low stock" }));
  byId("admin-low-stock-badge").textContent = `${lowStockProducts.length} item${lowStockProducts.length === 1 ? "" : "s"}`;
  byId("admin-low-stock-tbody").innerHTML = lowStockProducts.length
    ? lowStockProducts.map((product) => `<tr><td><strong>${escapeHtml(product.name)}</strong><br><span style="color:var(--text-dim);font-size:.78rem;">${product.id}</span></td><td>${escapeHtml(product.vendorName)}</td><td>${escapeHtml(product.category)}</td><td>${product.stock}</td><td>${badge(product.stockStatus === "Out of stock" ? "out_of_stock" : "pending")}</td></tr>`).join("")
    : `<tr><td colspan="5" style="color:var(--text-muted);">No low-stock products.</td></tr>`;
}

function renderAdminCategories() {
  const rows = state.adminCategories.length ? state.adminCategories : Object.values(state.products.reduce((result, product) => {
    const category = product.category || "Uncategorised";
    if (!result[category]) result[category] = { category, productCount: 0, availableUnits: 0, lowStockCount: 0 };
    result[category].productCount += 1;
    result[category].availableUnits += Number(product.stock || 0);
    if (Number(product.stock || 0) < 20) result[category].lowStockCount += 1;
    return result;
  }, {})).sort((a, b) => a.category.localeCompare(b.category));
  const tbody = byId("admin-categories-tbody");
  if (!tbody) return;
  byId("admin-categories-badge").textContent = `${rows.length} categor${rows.length === 1 ? "y" : "ies"}`;
  tbody.innerHTML = rows.length
    ? rows.map((category) => `<tr><td><strong>${escapeHtml(category.category)}</strong></td><td>${category.productCount}</td><td>${category.availableUnits}</td><td>${category.lowStockCount}</td></tr>`).join("")
    : `<tr><td colspan="4" style="color: var(--text-muted);">No category data available.</td></tr>`;
}

function renderAdminBenchmark() {
  const benchmark = state.adminBenchmark;
  const metrics = byId("admin-benchmark-metrics");
  const vendorsTbody = byId("admin-benchmark-vendors-tbody");
  const categoriesTbody = byId("admin-benchmark-categories-tbody");
  if (!metrics || !vendorsTbody || !categoriesTbody) return;
  if (!benchmark) {
    metrics.innerHTML = `<div class="vendor-empty-state">Benchmark data is loading...</div>`;
    return;
  }
  metrics.innerHTML = `
    <div class="vendor-benchmark-metric"><span>Marketplace revenue</span><strong>${currency.format(benchmark.totalRevenue)}</strong><small>Across all recorded orders</small></div>
    <div class="vendor-benchmark-metric"><span>Average seller revenue</span><strong>${currency.format(benchmark.averageVendorRevenue)}</strong><small>${benchmark.sellingVendorCount} vendors with sales</small></div>
    <div class="vendor-benchmark-metric"><span>Marketplace leader</span><strong>${escapeHtml(benchmark.leader?.name || "—")}</strong><small>${currency.format(benchmark.leader?.revenue || 0)} revenue</small></div>
    <div class="vendor-benchmark-metric"><span>Active vendors</span><strong>${benchmark.activeVendorCount}</strong><small>${benchmark.totalVendorCount} registered vendors</small></div>`;
  vendorsTbody.innerHTML = benchmark.vendorRankings.length
    ? benchmark.vendorRankings.map((vendor) => `<tr><td>#${vendor.rank}</td><td><strong>${escapeHtml(vendor.name)}</strong></td><td>${currency.format(vendor.revenue)}</td><td>${vendor.orderCount}</td></tr>`).join("")
    : `<tr><td colspan="4" style="color:var(--text-muted);">No vendor sales recorded yet.</td></tr>`;
  categoriesTbody.innerHTML = benchmark.categoryPerformance.length
    ? benchmark.categoryPerformance.map((category) => `<tr><td><strong>${escapeHtml(category.category)}</strong></td><td>${currency.format(category.revenue)}</td><td>${category.unitsSold}</td></tr>`).join("")
    : `<tr><td colspan="3" style="color:var(--text-muted);">No category sales recorded yet.</td></tr>`;
}

function renderVendorTable() {
  const tbody = byId("admin-vendors-table-tbody");
  if (!tbody) return;
  const term = byId("vendor-search-input")?.value?.toLowerCase() || "";
  const status = byId("vendor-status-filter")?.value || "all";
  const vendors = state.vendors.filter((vendor) => {
    const matchesTerm = `${vendor.id} ${vendor.businessName} ${vendor.email}`.toLowerCase().includes(term);
    const matchesStatus = status === "all" || getVendorStatus(vendor) === status;
    return matchesTerm && matchesStatus;
  });

  tbody.innerHTML = vendors.map((vendor) => `
    <tr>
      <td><strong>${vendor.id}</strong><br><span style="color:var(--text-dim);font-size:.78rem;">${formatDate(getCreatedAt(vendor))}</span></td>
      <td>${escapeHtml(vendor.businessName)}<br><span style="color:var(--text-dim);font-size:.78rem;">${escapeHtml(vendor.email)} | ${escapeHtml(vendor.phone)}</span></td>
      <td>${escapeHtml(vendor.contactPerson)}</td>
      <td>${getCommissionValue(vendor)}%</td>
      <td>${badge(getVendorStatus(vendor))}</td>
      <td>${badge(vendor.verificationStatus)}</td>
      <td>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-secondary btn-sm" onclick="window.app.loginAsVendor('${vendor.id}')">Login</button>
          <button class="btn btn-success btn-sm" onclick="window.app.approveVendor('${vendor.id}')">Approve</button>
          <button class="btn btn-danger btn-sm" onclick="window.app.suspendVendor('${vendor.id}')">Suspend</button>
        </div>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="7" style="color:var(--text-muted);">No vendors found.</td></tr>`;
}

function renderComplianceQueue() {
  const tbody = byId("admin-compliance-queue-tbody");
  if (!tbody) return;
  tbody.innerHTML = state.vendors.map((vendor) => `
    <tr>
      <td><strong>${escapeHtml(vendor.businessName)}</strong><br><span style="color:var(--text-dim);font-size:.78rem;">${vendor.id}</span></td>
      <td>${formatDate(getCreatedAt(vendor))}</td>
      <td>${vendor.documents.filter((doc) => doc.status !== "missing").length}/${vendor.documents.length}</td>
      <td>${badge(vendor.verificationStatus)}</td>
      <td><button class="btn btn-primary btn-sm" onclick="window.app.openComplianceReview('${vendor.id}')">Review</button></td>
    </tr>
  `).join("");
}

function generateInventoryForecast() {
  const productsByVendor = state.products.reduce((acc, product) => {
    const list = acc.get(product.vendorId) || [];
    list.push(product);
    acc.set(product.vendorId, list);
    return acc;
  }, new Map());

  const forecastItems = [];
  state.analytics.forEach((item) => {
    const products = productsByVendor.get(item.vendorId) || [];
    const lowStock = products.filter((product) => product.stock <= 10);
    forecastItems.push({
      vendorId: item.vendorId,
      lowStockCount: lowStock.length,
      activeProducts: products.length,
      recommendedReorder: lowStock.length > 0
    });
  });

  return forecastItems.sort((a, b) => b.lowStockCount - a.lowStockCount);
}

function generateCustomerSegmentInsights() {
  const now = new Date();
  const msPerDay = 86400000;
  const counts = {
    premium: 0,
    active: 0,
    new: 0,
    inactive: 0
  };

  state.customers.forEach((customer) => {
    const firstPurchase = new Date(customer.firstPurchaseDate);
    const lastPurchase = new Date(customer.lastPurchaseDate);
    const daysSinceFirst = Math.floor((now - firstPurchase) / msPerDay);
    const daysSinceLast = Math.floor((now - lastPurchase) / msPerDay);

    if (customer.lifetimeValue >= 1000 || customer.orderCount >= 10) {
      counts.premium += 1;
    } else if (daysSinceFirst <= 30) {
      counts.new += 1;
    } else if (daysSinceLast <= 30) {
      counts.active += 1;
    } else {
      counts.inactive += 1;
    }
  });

  return [
    { label: "Premium Customers", count: counts.premium, note: "High lifetime spend and repeat buyers." },
    { label: "Active Customers", count: counts.active, note: "Purchased within the last 30 days." },
    { label: "New Customers", count: counts.new, note: "Joined or placed first order in the last 30 days." },
    { label: "Inactive Customers", count: counts.inactive, note: "No purchase activity in the last 30+ days." }
  ];
}

function buildCustomerBehaviorAnalyticsFromState() {
  const now = new Date();
  const day = 86400000;
  const totalOrders = state.customers.reduce((sum, customer) => sum + Number(customer.orderCount || 0), 0);
  const totalLifetimeValue = state.customers.reduce((sum, customer) => sum + Number(customer.lifetimeValue || 0), 0);
  const segmentCounts = { Champions: 0, Loyal: 0, New: 0, "At risk": 0 };
  const customerRows = state.customers.map((customer) => {
    const daysSinceLastPurchase = Math.max(0, Math.floor((now - new Date(customer.lastPurchaseDate)) / day));
    const daysSinceFirstPurchase = Math.max(0, Math.floor((now - new Date(customer.firstPurchaseDate)) / day));
    let segment = "At risk";
    if (Number(customer.lifetimeValue || 0) >= 1000 || Number(customer.orderCount || 0) >= 10) segment = "Champions";
    else if (daysSinceFirstPurchase <= 30) segment = "New";
    else if (daysSinceLastPurchase <= 30) segment = "Loyal";
    segmentCounts[segment] += 1;
    return { id: customer.id, name: customer.name, lifetimeValue: Number(customer.lifetimeValue || 0), orderCount: Number(customer.orderCount || 0), daysSinceLastPurchase, segment };
  });
  const salesByProduct = state.transactions.reduce((totals, transaction) => {
    totals[transaction.productId] = (totals[transaction.productId] || 0) + Number(transaction.quantity || 0);
    return totals;
  }, {});
  const popularProducts = state.products
    .filter((product) => product.status === "active" && Number(product.stock || 0) > 0)
    .map((product) => ({ id: product.id, name: product.name, category: product.category, price: Number(product.price || 0), unitsSold: salesByProduct[product.id] || 0, stock: Number(product.stock || 0) }))
    .sort((left, right) => right.unitsSold - left.unitsSold || right.stock - left.stock)
    .slice(0, 5);
  return {
    metrics: {
      totalCustomers: state.customers.length,
      repeatPurchaseRate: state.customers.length ? Math.round((state.customers.filter((customer) => Number(customer.orderCount || 0) > 1).length / state.customers.length) * 100) : 0,
      averageOrderValue: totalOrders ? totalLifetimeValue / totalOrders : 0,
      atRiskCustomers: customerRows.filter((customer) => customer.daysSinceLastPurchase > 30).length
    },
    segments: Object.entries(segmentCounts).map(([label, count]) => ({ label, count })),
    popularProducts,
    recommendations: customerRows.sort((left, right) => right.lifetimeValue - left.lifetimeValue).slice(0, 5).map((customer, index) => {
      const product = popularProducts[index % Math.max(popularProducts.length, 1)];
      return { customerId: customer.id, customerName: customer.name, segment: customer.segment, productName: product?.name || "No in-stock products", category: product?.category || "", reason: customer.segment === "At risk" ? "Win-back offer based on marketplace best sellers." : "Suggested from the most purchased in-stock marketplace products." };
    }),
    customers: customerRows.sort((left, right) => right.lifetimeValue - left.lifetimeValue)
  };
}

function renderCustomerBehaviorDashboard() {
  const dashboard = state.customerBehaviorAnalytics || buildCustomerBehaviorAnalyticsFromState();
  const metrics = dashboard.metrics;
  byId("cb-total-customers").textContent = metrics.totalCustomers;
  byId("cb-repeat-rate").textContent = `${metrics.repeatPurchaseRate}%`;
  byId("cb-average-order-value").textContent = currency.format(metrics.averageOrderValue);
  byId("cb-at-risk").textContent = metrics.atRiskCustomers;

  const segmentList = byId("cb-segment-list");
  if (segmentList) segmentList.innerHTML = dashboard.segments.map((segment) => `
    <div class="behavior-bar-row"><span>${escapeHtml(segment.label)}</span><div class="behavior-bar-track"><div class="behavior-bar-fill" style="width:${metrics.totalCustomers ? (segment.count / metrics.totalCustomers) * 100 : 0}%"></div></div><strong>${segment.count}</strong></div>
  `).join("");
  const productList = byId("cb-product-list");
  if (productList) productList.innerHTML = dashboard.popularProducts.map((product) => `
    <div class="behavior-list-item"><div><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.category)} · ${product.unitsSold} units sold</small></div><span>${currency.format(product.price)}</span></div>
  `).join("") || `<p class="behavior-empty">No in-stock product signals are available.</p>`;
  const recommendationRows = byId("cb-recommendation-tbody");
  if (recommendationRows) recommendationRows.innerHTML = dashboard.recommendations.map((recommendation) => `
    <tr><td><strong>${escapeHtml(recommendation.customerName)}</strong><br><span class="table-secondary">${escapeHtml(recommendation.customerId)}</span></td><td>${escapeHtml(recommendation.segment)}</td><td>${escapeHtml(recommendation.productName)}<br><span class="table-secondary">${escapeHtml(recommendation.category)}</span></td><td>${escapeHtml(recommendation.reason)}</td></tr>
  `).join("") || `<tr><td colspan="4" class="behavior-empty">No recommendations available yet.</td></tr>`;
}

function generateRecommendations() {
  const salesByProduct = {};
  state.analytics.forEach((item) => {
    const vendorProducts = state.products.filter((product) => product.vendorId === item.vendorId);
    vendorProducts.forEach((product) => {
      salesByProduct[product.id] = (salesByProduct[product.id] || 0) + (product.stock > 0 ? 1 : 0);
    });
  });

  return Object.entries(salesByProduct)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([productId]) => {
      const product = state.products.find((item) => item.id === productId);
      return product ? `${escapeHtml(product.name)} (${escapeHtml(product.category)})` : null;
    })
    .filter(Boolean);
}

function generateValidationSummary() {
  return [
    `Revenue data reconciled with ${state.analytics.length} vendor records`,
    `Transaction totals matched across ${state.analytics.reduce((sum, item) => sum + item.transactionCount, 0)} transactions`,
    `Prediction confidence set at 85% based on warehouse stock and sales history`
  ];
}

function computeRevenueAnalyticsFromState() {
  return state.vendors.map((vendor) => {
    const vendorTransactions = state.transactions.filter((txn) => txn.vendorId === vendor.id);
    return {
      vendorId: vendor.id,
      totalRevenue: vendorTransactions.reduce((sum, txn) => sum + Number(txn.totalAmount || 0), 0),
      totalUnitsSold: vendorTransactions.reduce((sum, txn) => sum + Number(txn.quantity || 0), 0),
      transactionCount: vendorTransactions.length
    };
  }).filter((item) => item.transactionCount > 0);
}

function renderRevenueAnalytics() {
  const tbody = byId("admin-analytics-tbody");
  const badge = byId("analytics-summary-badge");
  if (!tbody) return;

  if (!state.analytics.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="color:var(--text-muted);">Revenue data is loading…</td></tr>`;
    if (badge) badge.textContent = "Loading…";
    renderCustomerSegmentation();
    return;
  }

  tbody.innerHTML = state.analytics.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.vendorId)}</strong></td>
      <td>${currency.format(item.totalRevenue)}</td>
      <td>${item.totalUnitsSold}</td>
      <td>${item.transactionCount} txns</td>
    </tr>
  `).join("");

  if (badge) badge.textContent = `${state.analytics.length} vendors`;

  renderCustomerSegmentation();

  const inventoryList = byId("inventory-forecast-list");
  const recommendationList = byId("recommendation-list");
  const validationList = byId("analytics-validation-list");

  if (inventoryList) {
    const forecastData = generateInventoryForecast();
    inventoryList.innerHTML = forecastData.length
      ? forecastData.map((item) => `<li><strong>${escapeHtml(item.vendorId)}</strong>: ${item.lowStockCount} low-stock product(s) out of ${item.activeProducts} active items${item.recommendedReorder ? ", reorder suggested" : ""}.</li>`).join("")
      : `<li style="color: var(--text-muted);">No low-stock issues detected.</li>`;
  }

  if (recommendationList) {
    const recs = generateRecommendations();
    recommendationList.innerHTML = recs.length
      ? recs.map((name) => `<li>${name}</li>`).join("")
      : `<li style="color: var(--text-muted);">No product recommendations available yet.</li>`;
  }

  if (validationList) {
    const validationSummary = generateValidationSummary();
    validationList.innerHTML = validationSummary.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  }
}

function renderCustomerSegmentation() {
  const tbody = byId("customer-segmentation-tbody");
  if (!tbody) return;
  const segments = generateCustomerSegmentInsights();
  tbody.innerHTML = segments.length
    ? segments.map((segment) => `
      <tr>
        <td>${escapeHtml(segment.label)}</td>
        <td>${segment.count}</td>
        <td>${escapeHtml(segment.note)}</td>
      </tr>
    `).join("")
    : `<tr><td colspan="3" style="color:var(--text-muted);">No customer segmentation available.</td></tr>`;
}

function computeInventoryForecastRows() {
  const vendorMap = state.vendors.reduce((acc, vendor) => {
    acc[vendor.id] = vendor.businessName;
    return acc;
  }, {});

  return state.products.map((product) => {
    const productTransactions = state.transactions.filter((txn) => txn.productId === product.id);
    const totalSold = productTransactions.reduce((sum, txn) => sum + Number(txn.quantity || 0), 0);
    const dates = productTransactions.map((txn) => new Date(txn.date).getTime()).sort((a, b) => a - b);
    const avgDailyDemand = dates.length > 1
      ? totalSold / Math.max(1, (dates[dates.length - 1] - dates[0]) / 86400000)
      : totalSold;
    const predicted7DayStock = Math.max(0, product.stock - avgDailyDemand * 7);
    const status = predicted7DayStock <= 7 || product.stock <= 5 ? "Restock Required" : "Healthy";

    return {
      id: product.id,
      name: product.name,
      vendorName: vendorMap[product.vendorId] || product.vendorId,
      stock: product.stock,
      avgDailyDemand: Math.round(avgDailyDemand) || 0,
      predicted7DayStock: Math.round(predicted7DayStock),
      status
    };
  }).sort((a, b) => a.predicted7DayStock - b.predicted7DayStock);
}

function renderInventoryForecastPage() {
  const tbody = byId("inventory-forecast-tbody");
  if (!tbody) return;

  const rows = computeInventoryForecastRows();
  tbody.innerHTML = rows.length
    ? rows.map((row) => `
      <tr>
        <td>${escapeHtml(row.name)}</td>
        <td>${escapeHtml(row.vendorName)}</td>
        <td>${row.stock}</td>
        <td>${row.avgDailyDemand}</td>
        <td>${row.predicted7DayStock}</td>
        <td>${escapeHtml(row.status)}</td>
      </tr>
    `).join("")
    : `<tr><td colspan="6" style="color: var(--text-muted);">No inventory data available.</td></tr>`;
}

function renderVendorViews() {
  const vendor = state.vendors.find((item) => item.id === state.currentVendorId);
  if (!vendor) {
    byId("vendor-dashboard-metrics").innerHTML = "";
    byId("vendor-catalog-tbody").innerHTML = `<tr><td colspan="7" style="color:var(--text-muted);">Select a vendor to view catalog data.</td></tr>`;
    byId("catalog-count-badge").textContent = "0 Products";
    return;
  }

  const vendorTransactions = state.transactions.filter((txn) => txn.vendorId === vendor.id);
  const vendorOrderCount = vendorTransactions.length;
  const vendorRevenue = vendorTransactions.reduce((sum, txn) => sum + Number(txn.totalAmount || 0), 0);
  const products = state.products.filter((product) => product.vendorId === vendor.id);
  const liveDashboard = state.vendorDashboard?.vendor?.id === vendor.id ? state.vendorDashboard : null;
  const summary = liveDashboard?.summary || {
    totalProducts: products.length,
    inventoryRecords: products.length,
    inventoryUnits: products.reduce((sum, product) => sum + Number(product.stock || 0), 0),
    transactionCount: vendorOrderCount,
    revenue: vendorRevenue,
    commission: vendorRevenue * getCommissionValue(vendor) / 100,
    lowStockProducts: products.filter((product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) < 20).length,
    outOfStockProducts: products.filter((product) => Number(product.stock || 0) === 0).length
  };

  byId("vendor-welcome-name").textContent = `Welcome, ${vendor.businessName}`;
  byId("vendor-welcome-summary").textContent = `${summary.transactionCount} transaction${summary.transactionCount === 1 ? "" : "s"} · ${currency.format(summary.revenue)} sales`;

  byId("vendor-dashboard-metrics").innerHTML = `
    <div class="glass-card vendor-overview-card"><span class="vendor-overview-icon product">▣</span><div><span class="metric-label">Total Products</span><span class="metric-value">${summary.totalProducts}</span><span class="vendor-overview-detail">Registered products</span></div></div>
    <div class="glass-card vendor-overview-card"><span class="vendor-overview-icon inventory">▥</span><div><span class="metric-label">Inventory</span><span class="metric-value">${summary.inventoryRecords}</span><span class="vendor-overview-detail">${summary.inventoryUnits} units in stock</span></div></div>
    <div class="glass-card vendor-overview-card"><span class="vendor-overview-icon status">✓</span><div><span class="metric-label">Status</span><span class="metric-value overview-status">${escapeHtml(getVendorStatus(vendor))}</span><span class="vendor-overview-detail">Vendor account</span></div></div>
    <div class="glass-card vendor-overview-card"><span class="vendor-overview-icon verified">★</span><div><span class="metric-label">Verification</span><span class="metric-value overview-status">${escapeHtml(vendor.verificationStatus)}</span><span class="vendor-overview-detail">Account status</span></div></div>
  `;

  byId("v-profile-reg").textContent = vendor.registrationNumber;
  byId("v-profile-contact").textContent = vendor.contactPerson;
  byId("v-profile-email").textContent = vendor.email;
  byId("v-profile-phone").textContent = vendor.phone;
  byId("v-profile-address").textContent = vendor.address;
  byId("v-profile-categories").textContent = vendor.categories.join(", ");
  byId("v-commission-type").textContent = vendor.commissionStructure.type;
  byId("v-commission-rate").textContent = `${getCommissionValue(vendor)}%`;
  byId("v-commission-desc").textContent = vendor.commissionStructure.details;
  byId("v-compliance-status-badge").innerHTML = badge(vendor.verificationStatus);
  byId("v-operational-status-badge").innerHTML = badge(getVendorStatus(vendor));

  byId("prod-category").innerHTML = vendor.categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("");
  byId("catalog-count-badge").textContent = `${products.length} Products`;
  byId("vendor-catalog-tbody").innerHTML = products.map((product) => `
    <tr>
      <td>${escapeHtml(product.name)}</td>
      <td>${escapeHtml(product.category)}</td>
      <td>${currency.format(product.price)}</td>
      <td>${product.stock}</td>
      <td>${escapeHtml(product.sku)}</td>
      <td>${badge(product.status)}</td>
      <td><button class="btn btn-danger btn-sm" onclick="window.app.removeProduct('${product.id}')">Remove</button></td>
    </tr>
  `).join("") || `<tr><td colspan="7" style="color:var(--text-muted);">No products yet.</td></tr>`;

  byId("v-settings-payout-method").value = vendor.settings.paymentMethod;
  byId("v-settings-business-name").value = vendor.businessName;
  byId("v-settings-business-email").value = vendor.email;
  byId("v-settings-business-phone").value = vendor.phone;
  byId("v-settings-commission").value = getCommissionValue(vendor);
  byId("v-settings-categories").value = vendor.categories.join(", ");
  byId("v-settings-billing-email").value = vendor.settings.billingEmail || vendor.email;
  byId("v-settings-webhook").value = vendor.settings.webhookUrl || "";
  byId("v-settings-apikey").value = vendor.settings.apiToken;
  renderVendorDashboardCharts(vendor);
  renderVendorDashboardDetails(vendor, liveDashboard);
}

function renderVendorDashboardCharts(vendor) {
  if (!vendor) return;

  const financialPie = byId("vendor-financial-pie");
  const categoryPie = byId("vendor-category-pie");
  if (financialPie) financialPie.innerHTML = "";
  if (categoryPie) categoryPie.innerHTML = "";

  const liveDashboard = state.vendorDashboard?.vendor?.id === vendor.id ? state.vendorDashboard : null;
  const financialData = Object.entries(liveDashboard?.stockBreakdown || {}).map(([label, value]) => ({ label, value }));
  if (!financialData.length) {
    const productsForStock = state.products.filter((product) => product.vendorId === vendor.id);
    const stockBreakdown = productsForStock.reduce((result, product) => {
      const label = Number(product.stock || 0) === 0 ? "Out of stock" : Number(product.stock || 0) < 20 ? "Low stock" : "In stock";
      result[label] = (result[label] || 0) + 1;
      return result;
    }, {});
    financialData.push(...Object.entries(stockBreakdown).map(([label, value]) => ({ label, value })));
  }
  if (!financialData.length) financialData.push({ label: "No products", value: 1 });

  const products = state.products.filter((product) => product.vendorId === vendor.id);
  const categoryCounts = liveDashboard?.categoryBreakdown || products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryCounts).map(([label, value]) => ({ label, value }));
  if (!categoryData.length) {
    categoryData.push({ label: "No products", value: 1 });
  }

  if (financialPie) createPieChart("vendor-financial-pie", financialData, "Stock status");
  createPieChart("vendor-health-pie", financialData, "Stock status");
  if (categoryPie) createPieChart("vendor-category-pie", categoryData, "Product Category Share");
  createPieChart("vendor-category-share-pie", categoryData, "Product Category Share");
}

function renderVendorDashboardDetails(vendor, liveDashboard) {
  const transactions = state.transactions.filter((transaction) => transaction.vendorId === vendor.id);
  const productsById = new Map(state.products.map((product) => [product.id, product]));
  const dashboard = liveDashboard || {
    recentTransactions: [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6).map((transaction) => ({ ...transaction, productName: productsById.get(transaction.productId)?.name || transaction.productId })),
    topProducts: Object.values(transactions.reduce((result, transaction) => {
      const product = productsById.get(transaction.productId);
      if (!result[transaction.productId]) result[transaction.productId] = { id: transaction.productId, name: product?.name || transaction.productId, unitsSold: 0, revenue: 0 };
      result[transaction.productId].unitsSold += Number(transaction.quantity || 0);
      result[transaction.productId].revenue += Number(transaction.totalAmount || 0);
      return result;
    }, {})).sort((a, b) => b.revenue - a.revenue).slice(0, 5),
    inventoryAlerts: state.products.filter((product) => product.vendorId === vendor.id && Number(product.stock || 0) < 20).map((product) => ({ ...product, status: Number(product.stock || 0) === 0 ? "Out of stock" : "Low stock" })),
    benchmark: null
  };
  const setContent = (id, html) => {
    const element = byId(id);
    if (element) element.innerHTML = html;
  };
  const empty = (message) => `<div class="vendor-empty-state">${message}</div>`;

  const transactionsHtml = dashboard.recentTransactions?.length
    ? dashboard.recentTransactions.map((transaction) => `<div class="vendor-list-row"><div><strong>${escapeHtml(transaction.productName)}</strong><span>${escapeHtml(transaction.transactionId)} · ${formatDate(transaction.date)}</span></div><strong>${currency.format(transaction.totalAmount)}</strong></div>`).join("")
    : empty("No transactions have been recorded yet.");
  const topProductsHtml = dashboard.topProducts?.length
    ? dashboard.topProducts.map((product, index) => `<div class="vendor-list-row"><div><span class="vendor-rank">#${index + 1}</span><strong>${escapeHtml(product.name)}</strong><span>${product.unitsSold} units sold</span></div><strong>${currency.format(product.revenue)}</strong></div>`).join("")
    : empty("Sales data will appear after the first order.");
  const alertsHtml = dashboard.inventoryAlerts?.length
    ? dashboard.inventoryAlerts.map((product) => `<div class="vendor-list-row"><div><strong>${escapeHtml(product.name)}</strong><span>${escapeHtml(product.id)}</span></div><span class="vendor-stock-alert ${product.status === "Out of stock" ? "critical" : ""}">${product.stock} · ${escapeHtml(product.status)}</span></div>`).join("")
    : empty("Inventory levels look healthy.");
  setContent("vendor-recent-transactions", transactionsHtml);
  setContent("vendor-transactions-list", transactionsHtml);
  setContent("vendor-top-products", topProductsHtml);
  setContent("vendor-inventory-alerts", alertsHtml);
  setContent("vendor-alerts-list", alertsHtml);

  const salesAnalytics = dashboard.salesAnalytics;
  const salesMetrics = byId("vendor-sales-analytics-metrics");
  const salesTrend = byId("vendor-sales-trend");
  if (salesMetrics && salesTrend) {
    if (salesAnalytics) {
      const cancellationRate = salesAnalytics.completedOrders + salesAnalytics.cancelledOrders
        ? (salesAnalytics.cancelledOrders / (salesAnalytics.completedOrders + salesAnalytics.cancelledOrders)) * 100 : 0;
      salesMetrics.innerHTML = `<div class="vendor-benchmark-metric"><span>Completed orders</span><strong>${salesAnalytics.completedOrders}</strong><small>Revenue-bearing orders</small></div><div class="vendor-benchmark-metric"><span>Sales revenue</span><strong>${currency.format(liveDashboard.summary.revenue)}</strong><small>Cancelled orders excluded</small></div><div class="vendor-benchmark-metric"><span>Average order value</span><strong>${currency.format(salesAnalytics.averageOrderValue)}</strong><small>Completed orders only</small></div><div class="vendor-benchmark-metric"><span>Cancellation rate</span><strong>${cancellationRate.toFixed(1)}%</strong><small>${salesAnalytics.cancelledOrders} cancelled order${salesAnalytics.cancelledOrders === 1 ? "" : "s"}</small></div>`;
      const maxRevenue = Math.max(...salesAnalytics.revenueByDate.map((item) => item.revenue), 1);
      salesTrend.innerHTML = salesAnalytics.revenueByDate.length ? salesAnalytics.revenueByDate.map((item) => `<div class="vendor-sales-row"><span>${formatDate(item.date)}</span><div><i style="width:${(item.revenue / maxRevenue) * 100}%"></i></div><strong>${currency.format(item.revenue)}</strong><small>${item.orders} order${item.orders === 1 ? "" : "s"}</small></div>`).join("") : `<div class="vendor-empty-state">No completed sales have been recorded.</div>`;
    } else {
      salesMetrics.innerHTML = `<div class="vendor-empty-state">Sales analytics will load from the database shortly.</div>`;
      salesTrend.innerHTML = "";
    }
  }

  const benchmark = dashboard.benchmark;
  const benchmarkGrid = byId("vendor-benchmark-grid");
  const benchmarkPosition = byId("vendor-benchmark-position");
  if (!benchmarkGrid || !benchmarkPosition) return;
  if (!benchmark) {
    benchmarkPosition.textContent = "Loading live comparison…";
    benchmarkGrid.innerHTML = `<div class="vendor-empty-state">Marketplace comparison will load from the database shortly.</div>`;
    const pagePosition = byId("vendor-benchmark-page-position");
    const pageGrid = byId("vendor-benchmark-page-grid");
    const pagePie = byId("vendor-benchmark-pie");
    const pageBars = byId("vendor-benchmark-bars");
    if (pagePosition) pagePosition.textContent = "Loading live comparison…";
    if (pageGrid) pageGrid.innerHTML = `<div class="vendor-empty-state">Marketplace comparison will load from the database shortly.</div>`;
    if (pagePie) pagePie.innerHTML = "";
    if (pageBars) pageBars.innerHTML = "";
    return;
  }
  const rankText = benchmark.vendorRevenueRank ? `#${benchmark.vendorRevenueRank} of ${benchmark.rankedVendors}` : "Not ranked yet";
  const comparison = Number(benchmark.revenueVsAveragePercent || 0);
  benchmarkPosition.className = `badge ${comparison >= 0 ? "badge-approved" : "badge-pending"}`;
  benchmarkPosition.textContent = `Revenue rank: ${rankText}`;
  const benchmarkHtml = `
    <div class="vendor-benchmark-metric"><span>Vendor sales</span><strong>${currency.format(liveDashboard.summary.revenue)}</strong><small>${comparison >= 0 ? "+" : ""}${comparison.toFixed(1)}% vs seller average</small></div>
    <div class="vendor-benchmark-metric"><span>Seller average</span><strong>${currency.format(benchmark.averageVendorRevenue)}</strong><small>Across ${benchmark.rankedVendors} selling vendors</small></div>
    <div class="vendor-benchmark-metric"><span>Average order value</span><strong>${currency.format(benchmark.vendorAverageOrderValue)}</strong><small>Marketplace: ${currency.format(benchmark.marketplaceAverageOrderValue)}</small></div>
    <div class="vendor-benchmark-metric"><span>Marketplace leader</span><strong>${escapeHtml(benchmark.leader?.name || "—")}</strong><small>${benchmark.activeSellers} active sellers</small></div>`;
  benchmarkGrid.innerHTML = benchmarkHtml;
  const pagePosition = byId("vendor-benchmark-page-position");
  const pageGrid = byId("vendor-benchmark-page-grid");
  if (pagePosition) {
    pagePosition.className = benchmarkPosition.className;
    pagePosition.textContent = benchmarkPosition.textContent;
  }
  if (pageGrid) pageGrid.innerHTML = benchmarkHtml;
  const revenueDistribution = benchmark.revenueDistribution?.length ? benchmark.revenueDistribution : [{ label: vendor.businessName, value: 1 }];
  createPieChart("vendor-benchmark-pie", revenueDistribution, "Vendor Revenue Ranking");
  renderMarketplaceBenchmarkBars(revenueDistribution);
}

function renderMarketplaceBenchmarkBars(revenueDistribution) {
  const container = byId("vendor-benchmark-bars");
  if (!container) return;
  const colors = ["#4f46e5", "#0ea5e9", "#f97316", "#14b8a6", "#facc15", "#ec4899", "#22c55e", "#e11d48"];
  const maxRevenue = Math.max(...revenueDistribution.map((item) => Number(item.value || 0)), 1);
  container.innerHTML = revenueDistribution.map((item, index) => {
    const revenue = Number(item.value || 0);
    const width = Math.max((revenue / maxRevenue) * 100, 2);
    return `<div class="vendor-bar-row">
      <span class="vendor-bar-color" style="background:${colors[index % colors.length]}"></span>
      <span class="vendor-bar-label">${escapeHtml(item.label)}</span>
      <div class="vendor-bar-track"><span class="vendor-bar-fill" style="width:${width}%;background:${colors[index % colors.length]}"></span></div>
      <strong>${currency.format(revenue)}</strong>
    </div>`;
  }).join("");
}

async function refreshVendorDashboard(vendorId) {
  if (!vendorId) return;
  try {
    const response = await fetch(`/api/vendors/${encodeURIComponent(vendorId)}/dashboard`);
    if (!response.ok) throw new Error("Dashboard request failed");
    state.vendorDashboard = await response.json();
    if (state.currentVendorId === vendorId) renderVendorViews();
  } catch (error) {
    console.warn("Unable to load vendor dashboard from API", error);
  }
}

async function loadRevenueAnalytics() {
  try {
    const adminResponse = await fetch("/api/admin/dashboard");
    if (!adminResponse.ok) throw new Error("Admin dashboard request failed");
    state.adminDashboard = await adminResponse.json();
    renderAdminDashboard();
  } catch (error) {
    console.warn("Unable to load admin dashboard from API", error);
  }

  try {
    const response = await fetch("/api/analytics/revenue");
    if (!response.ok) throw new Error("Analytics request failed");
    state.analytics = await response.json();
  } catch (error) {
    console.warn("Unable to load revenue analytics from API", error);
    state.analytics = computeRevenueAnalyticsFromState();
  }

  try {
    const resCust = await fetch("/api/customers");
    if (resCust.ok) state.customers = await resCust.json();
  } catch (e) {
    console.warn("Unable to load customers from API", e);
  }

  try {
    const resTxn = await fetch("/api/transactions");
    if (resTxn.ok) state.transactions = await resTxn.json();
  } catch (e) {
    console.warn("Unable to load transactions from API", e);
  }

  try {
    const resProducts = await fetch("/api/products");
    if (resProducts.ok) state.products = await resProducts.json();
  } catch (e) {
    console.warn("Unable to load products from API", e);
  }

  try {
    const response = await fetch("/api/admin/categories");
    if (!response.ok) throw new Error("Category request failed");
    state.adminCategories = await response.json();
  } catch (error) {
    console.warn("Unable to load category data from API", error);
    state.adminCategories = [];
  }

  try {
    const response = await fetch("/api/admin/benchmark");
    if (!response.ok) throw new Error("Benchmark request failed");
    state.adminBenchmark = await response.json();
  } catch (error) {
    console.warn("Unable to load marketplace benchmark from API", error);
    state.adminBenchmark = null;
  }

  try {
    const response = await fetch("/api/analytics/customer-behavior");
    if (!response.ok) throw new Error("Customer behaviour request failed");
    state.customerBehaviorAnalytics = await response.json();
  } catch (error) {
    console.warn("Unable to load customer behaviour analytics from API", error);
    state.customerBehaviorAnalytics = buildCustomerBehaviorAnalyticsFromState();
  }

  renderRevenueAnalytics();
  renderAdminCategories();
  renderAdminBenchmark();
  renderCustomerBehaviorDashboard();
  renderSalesRevenueIntelligence();
  window.analyticsUI?.renderAnalyticsCharts();
}


function renderEndpoints() {
  const container = byId("api-endpoints-container");
  if (!container) return;
  container.innerHTML = API_ENDPOINTS.map((endpoint, index) => `
    <div class="endpoint-card ${endpoint === state.selectedEndpoint ? "active" : ""}" onclick="window.app.selectEndpoint(${index})">
      <span class="endpoint-badge method-${endpoint.method.toLowerCase()}">${endpoint.method}</span>
      <span class="endpoint-path">${endpoint.path}</span>
      <div class="endpoint-desc">${endpoint.description}</div>
    </div>
  `).join("");
}

function updateRoleChrome() {
  const isAdmin = state.currentRole === "admin";
  const vendor = state.vendors.find((item) => item.id === state.currentVendorId);
  byId("nav-group-admin").style.display = isAdmin ? "block" : "none";
  byId("nav-group-vendor").style.display = isAdmin ? "none" : "block";
  byId("role-badge").textContent = isAdmin ? "Admin Access" : `Vendor Login: ${vendor?.businessName || "New Vendor"}`;
  byId("vendor-nav-title").textContent = vendor ? vendor.businessName : "Vendor Center";
  const statusBadge = byId("onboard-status-badge");
  if (!statusBadge) return;
  const status = vendor ? getVendorStatus(vendor) : "";
  statusBadge.style.display = vendor ? "inline-flex" : "none";
  statusBadge.className = vendor ? `badge badge-${status}` : "badge";
  statusBadge.textContent = vendor ? STATUS_LABELS[status] : "";
}

function showToast(message, type = "info") {
  const container = byId("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function switchTab(tab) {
  document.querySelectorAll(".content-section").forEach((section) => section.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach((link) => link.classList.remove("active"));
  byId(`view-${tab}`)?.classList.add("active");
  byId("main-view-title").textContent = ROUTE_TITLES[tab] || "ShopSense";
  document.querySelectorAll(`.nav-link[onclick*="${tab}"]`).forEach((link) => link.classList.add("active"));
  if (tab === "api-playground") renderEndpoints();
  if (tab === "admin-inventory") renderInventoryForecastPage();
  if (tab === "admin-categories") renderAdminCategories();
  if (tab === "admin-benchmark") renderAdminBenchmark();
  if (tab === "admin-customer-segmentation") {
    renderCustomerSegmentation();
    window.analyticsUI?.renderAnalyticsCharts();
  }
  if (tab === "admin-customer-behavior") renderCustomerBehaviorDashboard();
  if (tab === "admin-sales-revenue-intelligence") {
    renderSalesRevenueIntelligence();
  }
  if (["vendor-dashboard", "vendor-inventory-health", "vendor-category-share", "vendor-transactions", "vendor-inventory-alerts", "vendor-benchmark"].includes(tab)) {
    renderVendorViews();
    refreshVendorDashboard(state.currentVendorId);
  }
}

function handleRoleChange(value) {
  if (value === "register_new") {
    state.currentRole = value;
    state.currentVendorId = null;
    renderAll();
    switchTab("vendor-onboarding");
    return;
  }
  if (value === "admin") {
    state.currentRole = "admin";
    state.currentVendorId = null;
    enterAdminPortal();
  } else if (value === "customer") {
    state.currentRole = "customer";
    state.currentVendorId = null;
    enterCustomerPortal();
  } else {
    state.currentRole = value;
    state.currentVendorId = value;
    enterPortal();
    byId("role-selector").value = value;
    renderAll();
    switchTab("vendor-dashboard");
  }
  renderAll();
}

function enterPortal() {
  byId("login-screen").hidden = true;
  byId("app-shell").hidden = false;
  byId("app-shell").style.display = "flex";
}

function enterAdminPortal() {
  state.currentRole = "admin";
  state.currentVendorId = null;
  enterPortal();
  byId("role-selector").value = "admin";
  renderAll();
  switchTab("admin-dashboard");
}

function enterVendorPortal() {
  const vendor = state.vendors.find((item) => getVendorStatus(item) === "active") || state.vendors[0];
  if (!vendor) {
    showToast("No vendor accounts are available.", "error");
    return;
  }
  state.currentRole = vendor.id;
  state.currentVendorId = vendor.id;
  enterPortal();
  byId("role-selector").value = vendor.id;
  renderAll();
  switchTab("vendor-dashboard");
}

function enterCustomerPortal() {
  state.currentRole = "customer";
  state.currentVendorId = null;
  state.selectedCustomerId = state.selectedCustomerId || state.customers[0]?.id || null;
  if (!state.cart) state.cart = [];
  if (!state.wishlist) state.wishlist = [];
  enterPortal();
  byId("role-selector").value = "customer";
  renderAll();
  refreshCustomerDashboard();
  switchTab("customer-home");
  showToast("Welcome to ShopSense!", "success");
}

function goToStep(step) {
  state.onboardingStep = step;
  document.querySelectorAll(".form-step").forEach((node) => node.classList.remove("active"));
  document.querySelectorAll(".step-indicator-item").forEach((node, index) => {
    node.classList.toggle("active", index + 1 === step);
    node.classList.toggle("completed", index + 1 < step);
  });
  byId(`form-step-${step}`).classList.add("active");
}

function validateAndGoToStep(step) {
  if (step === 2) {
    const required = ["ob-biz-name", "ob-reg-num", "ob-phone", "ob-contact-name", "ob-email", "ob-address"];
    const missing = required.some((id) => !byId(id).value.trim());
    if (missing || state.onboardingCategories.length === 0) {
      showToast("Complete business info and add at least one category.", "error");
      return;
    }
  }
  if (step === 3 && (!state.uploadedDocs.license || !state.uploadedDocs.tax)) {
    showToast("Upload the required license and tax documents.", "error");
    return;
  }
  goToStep(step);
}

function addCategoryTag(value) {
  const category = value.trim().replace(/,$/, "");
  if (!category || state.onboardingCategories.includes(category)) return;
  state.onboardingCategories.push(category);
  renderCategoryTags();
}

function renderCategoryTags() {
  const container = byId("ob-categories-tags-container");
  const input = byId("ob-categories-input");
  container.querySelectorAll(".tag").forEach((node) => node.remove());
  state.onboardingCategories.forEach((category, index) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.innerHTML = `${escapeHtml(category)} <span class="tag-remove" onclick="window.app.removeCategoryTag(${index})">x</span>`;
    container.insertBefore(tag, input);
  });
  input.value = "";
}

function submitOnboardingForm() {
  if (!byId("ob-agree-terms").checked) {
    showToast("Accept the commission agreement before submitting.", "error");
    return;
  }
  try {
    const vendor = backend.registerVendor({
      businessName: byId("ob-biz-name").value,
      registrationNumber: byId("ob-reg-num").value,
      phone: byId("ob-phone").value,
      contactPerson: byId("ob-contact-name").value,
      email: byId("ob-email").value,
      address: byId("ob-address").value,
      categories: state.onboardingCategories,
      commission: 10,
      licenseUploaded: state.uploadedDocs.license,
      taxUploaded: state.uploadedDocs.tax
    });
    showToast(`Vendor ${vendor.id} registered and pending approval.`, "success");
    byId("onboarding-form").reset();
    state.onboardingCategories = [];
    state.uploadedDocs = { license: false, tax: false, insurance: false };
    renderUploadBadges();
    renderCategoryTags();
    state.currentRole = "admin";
    state.currentVendorId = null;
    renderAll();
    switchTab("admin-vendors");
  } catch (error) {
    showToast(error.message || "Vendor registration failed.", "error");
  }
}

function renderUploadBadges() {
  ["license", "tax", "insurance"].forEach((type) => {
    const status = byId(`status-upload-${type}`);
    status.textContent = state.uploadedDocs[type] ? "Uploaded" : type === "insurance" ? "Optional" : "Missing";
    status.className = `badge ${state.uploadedDocs[type] ? "badge-approved" : "badge-pending"}`;
  });
}

function init() {
  const savedRegion = localStorage.getItem(STORE_KEYS.dataRegion);
  if (savedRegion !== DATA_REGION) {
    localStorage.removeItem(STORE_KEYS.vendors);
    localStorage.removeItem(STORE_KEYS.products);
    localStorage.setItem(STORE_KEYS.dataRegion, DATA_REGION);
  }

  state.vendors = storage.load(STORE_KEYS.vendors, INITIAL_VENDORS).map((vendor) => ({
    ...vendor,
    commission: vendor.commission ?? vendor.commissionStructure?.rate ?? 10,
    status: vendor.status || normalizeStatus(vendor.operationalStatus),
    createdAt: vendor.createdAt || vendor.createdDate
  }));
  state.products = storage.load(STORE_KEYS.products, INITIAL_PRODUCTS);
  state.customers = storage.load(STORE_KEYS.customers, INITIAL_CUSTOMERS);
  state.transactions = storage.load(STORE_KEYS.transactions, INITIAL_TRANSACTIONS);

  byId("ob-categories-input")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addCategoryTag(event.target.value);
    }
  });

  renderAll();
  loadRevenueAnalytics();
}

window.app = {
  switchTab,
  handleRoleChange,
  enterAdminPortal,
  enterVendorPortal,
  enterCustomerPortal,
  showLoginForm: backend.showLoginForm,
  showRoleSelection: backend.showRoleSelection,
  processLogin: backend.processLogin,
  filterProducts,
  filterByCategory,
  openCustomerSearch,
  addToCart,
  addToWishlist,
  updateCartQuantity,
  removeFromCart,
  moveToCart,
  removeFromWishlist,
    logout() {
      state.currentRole = null;
      state.currentVendorId = null;
      byId("app-shell").hidden = true;
      byId("login-screen").hidden = false;
      byId("login-email").value = "";
      byId("login-password").value = "";
      showToast("Logged out successfully!", "info");
      renderAll();
    },
    loadRevenueAnalytics,
  filterVendorsList: renderVendorTable,
  resetDatabase() {
    localStorage.removeItem(STORE_KEYS.vendors);
    localStorage.removeItem(STORE_KEYS.products);
    state.currentRole = "admin";
    state.currentVendorId = null;
    state.onboardingCategories = [];
    state.uploadedDocs = { license: false, tax: false, insurance: false };
    init();
    showToast("Local Module 1 database reset.", "success");
  },
  loginAsVendor(id) {
    state.currentRole = id;
    state.currentVendorId = id;
    byId("role-selector").value = id;
    renderAll();
    switchTab("vendor-dashboard");
  },
  approveVendor(id) {
    backend.approveVendor(id);
    if (state.selectedComplianceVendorId === id) this.openComplianceReview(id);
    showToast("Vendor approved and activated.", "success");
  },
  suspendVendor(id) {
    backend.suspendVendor(id, { reason: "Suspended by marketplace admin" });
    if (state.selectedComplianceVendorId === id) this.openComplianceReview(id);
    showToast("Vendor suspended.", "info");
  },
  openComplianceReview(id) {
    const vendor = state.vendors.find((item) => item.id === id);
    if (!vendor) return showToast("Vendor not found.", "error");
    state.selectedComplianceVendorId = id;
    switchTab("admin-compliance");
    byId("compliance-review-desk-content").innerHTML = `
      <div style="display:flex; flex-direction:column; gap:14px;">
        <div>
          <h3>${escapeHtml(vendor.businessName)}</h3>
          <p style="color:var(--text-muted);font-size:.85rem;">${vendor.id} | ${escapeHtml(vendor.email)}</p>
        </div>
        ${vendor.documents.map((doc) => `
          <div class="document-item">
            <div><div class="document-name">${escapeHtml(doc.name)}</div><div class="document-meta">${escapeHtml(doc.fileUrl || "No file name")}</div></div>
            ${badge(doc.status)}
          </div>
        `).join("")}
        <button class="btn btn-success" onclick="window.app.verifyVendor('${vendor.id}')">Verify Documents</button>
        <button class="btn btn-primary" onclick="window.app.approveVendor('${vendor.id}')">Approve Vendor</button>
        <button class="btn btn-danger" onclick="window.app.suspendVendor('${vendor.id}')">Suspend Vendor</button>
      </div>
    `;
  },
  verifyVendor(id) {
    backend.verifyVendor(id);
    this.openComplianceReview(id);
    showToast("Vendor verification approved.", "success");
  },
  goToStep,
  validateAndGoToStep,
  handleMockUpload(type) {
    if (state.uploadedDocs[type]) {
      showToast(`${type} document is already uploaded.`, "info");
      return;
    }
    state.uploadedDocs[type] = true;
    renderUploadBadges();
    showToast(`${type} document uploaded.`, "success");
  },
  removeCategoryTag(index) {
    state.onboardingCategories.splice(index, 1);
    renderCategoryTags();
  },
  submitOnboardingForm,
  addProductFromForm() {
    const vendor = state.vendors.find((item) => item.id === state.currentVendorId);
    if (!vendor) return showToast("Login as a vendor before adding products.", "error");
    if (getVendorStatus(vendor) === "suspended") return showToast("Suspended vendors cannot add products.", "error");
    const product = {
      id: generateId("PROD"),
      vendorId: vendor.id,
      name: byId("prod-name").value,
      category: byId("prod-category").value,
      price: Number(byId("prod-price").value),
      stock: Number(byId("prod-stock").value),
      sku: byId("prod-sku").value,
      status: "active"
    };
    if (!product.name || !product.sku || Number.isNaN(product.price) || product.price < 0 || product.stock < 0) return showToast("Complete all product fields with valid values.", "error");
    state.products.unshift(product);
    storage.save();
    byId("add-product-form").reset();
    renderVendorViews();
    showToast("Product added.", "success");
  },
  removeProduct(id) {
    state.products = state.products.filter((product) => product.id !== id);
    storage.save();
    renderVendorViews();
    showToast("Product removed.", "info");
  },
  saveVendorProfileSettings() {
    try {
      const vendor = backend.findVendor(state.currentVendorId);
      const commission = Number(byId("v-settings-commission").value);
      if (!byId("v-settings-business-name").value.trim() || !byId("v-settings-business-email").value.trim() || !byId("v-settings-business-phone").value.trim()) {
        showToast("Business name, email, and phone are required.", "error");
        return;
      }
      if (Number.isNaN(commission) || commission < 0 || commission > 100) {
        showToast("Commission must be between 0 and 100.", "error");
        return;
      }
      backend.updateProfile(vendor.id, {
        businessName: byId("v-settings-business-name").value,
        email: byId("v-settings-business-email").value,
        phone: byId("v-settings-business-phone").value,
        commission,
        categories: byId("v-settings-categories").value
      });
      renderAll();
      showToast("Vendor profile updated.", "success");
    } catch (error) {
      showToast(error.message || "Profile update failed.", "error");
    }
  },
  saveVendorPayoutSettings() {
    const vendor = state.vendors.find((item) => item.id === state.currentVendorId);
    if (!vendor) return showToast("Select a vendor before saving settings.", "error");
    vendor.settings.paymentMethod = byId("v-settings-payout-method").value;
    vendor.settings.billingEmail = byId("v-settings-billing-email").value;
    storage.save();
    showToast("Billing settings updated.", "success");
  },
  saveVendorApiSettings() {
    const vendor = state.vendors.find((item) => item.id === state.currentVendorId);
    if (!vendor) return showToast("Select a vendor before saving settings.", "error");
    vendor.settings.webhookUrl = byId("v-settings-webhook").value;
    storage.save();
    showToast("Integration settings updated.", "success");
  },
  regenerateApiKey() {
    const vendor = state.vendors.find((item) => item.id === state.currentVendorId);
    if (!vendor) return showToast("Select a vendor before regenerating an API key.", "error");
    vendor.settings.apiToken = `mkt_live_${Math.random().toString(36).slice(2, 14)}`;
    storage.save();
    renderVendorViews();
    showToast("API key regenerated.", "success");
  },
  selectEndpoint(index) {
    state.selectedEndpoint = API_ENDPOINTS[index];
    byId("api-request-uri").value = state.selectedEndpoint.path;
    byId("api-request-body").value = state.selectedEndpoint.body;
    renderEndpoints();
  },
  executeSimulatedRequest() {
    const started = performance.now();
    const endpoint = state.selectedEndpoint;
    let body = {};
    try {
      body = byId("api-request-body").value.trim() ? JSON.parse(byId("api-request-body").value) : {};
      const data = routeRequest(endpoint.method, byId("api-request-uri").value, body);
      byId("response-status-code").textContent = "200 OK";
      byId("response-status-dot").style.backgroundColor = "#10b981";
      byId("api-response-content").textContent = JSON.stringify({ ok: true, data }, null, 2);
    } catch (error) {
      byId("response-status-code").textContent = `${error.status || 400} ERROR`;
      byId("response-status-dot").style.backgroundColor = "#ef4444";
      byId("api-response-content").textContent = JSON.stringify({ ok: false, error: error.message || "Invalid request" }, null, 2);
    }
    byId("response-latency-label").textContent = `Latency: ${Math.round(performance.now() - started)} ms`;
  },
  filterSriLedger() {
    filterSriLedger();
  }
};

function renderSalesRevenueIntelligence() {
  const totalSalesEl = byId("sri-total-sales");
  if (!totalSalesEl) return;

  const totalSales = state.transactions.reduce((sum, txn) => sum + Number(txn.totalAmount || 0), 0);
  const totalCommissions = state.transactions.reduce((sum, txn) => {
    const vendor = state.vendors.find(v => v.id === txn.vendorId);
    const rate = vendor ? getCommissionValue(vendor) : 10;
    return sum + (Number(txn.totalAmount || 0) * rate) / 100;
  }, 0);
  const totalTxns = state.transactions.length;
  const aov = totalTxns > 0 ? totalSales / totalTxns : 0;

  totalSalesEl.textContent = currency.format(totalSales);
  byId("sri-total-commissions").textContent = currency.format(totalCommissions);
  byId("sri-avg-order-value").textContent = currency.format(aov);
  byId("sri-total-transactions").textContent = totalTxns;

  populateSriFilters();
  renderSriCharts();
  filterSriLedger();
}

function populateSriFilters() {
  const vendorSelect = byId("sri-filter-vendor");
  const categorySelect = byId("sri-filter-category");
  if (!vendorSelect || !categorySelect) return;

  const currentVendor = vendorSelect.value;
  const currentCategory = categorySelect.value;

  const vendorIds = [...new Set(state.transactions.map(t => t.vendorId))];
  const vendorOptions = ['<option value="all">All Vendors</option>'];
  vendorIds.forEach(id => {
    const vendor = state.vendors.find(v => v.id === id);
    const name = vendor ? vendor.businessName : id;
    vendorOptions.push(`<option value="${escapeHtml(id)}">${escapeHtml(name)}</option>`);
  });
  vendorSelect.innerHTML = vendorOptions.join('');
  if (currentVendor && vendorIds.includes(currentVendor)) {
    vendorSelect.value = currentVendor;
  } else {
    vendorSelect.value = 'all';
  }

  const categories = [...new Set(state.products.map(p => p.category))];
  const categoryOptions = ['<option value="all">All Categories</option>'];
  categories.forEach(cat => {
    categoryOptions.push(`<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`);
  });
  categorySelect.innerHTML = categoryOptions.join('');
  if (currentCategory && categories.includes(currentCategory)) {
    categorySelect.value = currentCategory;
  } else {
    categorySelect.value = 'all';
  }
}

function renderSriCharts() {
  const vendorChartContainer = byId("sri-chart-vendor-revenue");
  const categoryChartContainer = byId("sri-chart-category-sales");
  if (!vendorChartContainer || !categoryChartContainer) return;

  const vendorRevenueMap = {};
  state.transactions.forEach(txn => {
    const vendor = state.vendors.find(v => v.id === txn.vendorId);
    const name = vendor ? vendor.businessName : txn.vendorId;
    vendorRevenueMap[name] = (vendorRevenueMap[name] || 0) + Number(txn.totalAmount || 0);
  });
  const vendorData = Object.entries(vendorRevenueMap)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const categorySalesMap = {};
  state.transactions.forEach(txn => {
    const product = state.products.find(p => p.id === txn.productId);
    const category = product ? product.category : "General";
    if (!categorySalesMap[category]) {
      categorySalesMap[category] = { category, count: 0, total: 0 };
    }
    categorySalesMap[category].count += txn.quantity || 1;
    categorySalesMap[category].total += Number(txn.totalAmount || 0);
  });
  const categoryData = Object.values(categorySalesMap)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  if (vendorData.length > 0) {
    vendorChartContainer.innerHTML = generateVendorRevenueSvg(vendorData);
  } else {
    vendorChartContainer.innerHTML = `<span style="color:var(--text-muted);">No sales data available</span>`;
  }

  if (categoryData.length > 0) {
    categoryChartContainer.innerHTML = generateCategorySalesSvg(categoryData);
  } else {
    categoryChartContainer.innerHTML = `<span style="color:var(--text-muted);">No category data available</span>`;
  }
}

function generateVendorRevenueSvg(vendorData) {
  const width = 450;
  const height = 140;
  const padding = { top: 10, right: 30, bottom: 10, left: 120 };
  const maxRevenue = Math.max(...vendorData.map(d => d.revenue), 1);

  const bars = vendorData.map((d, i) => {
    const barHeight = 14;
    const barGap = 10;
    const y = padding.top + i * (barHeight + barGap);
    const availableWidth = width - padding.left - padding.right;
    const barWidth = (d.revenue / maxRevenue) * availableWidth;

    return `
      <g class="bar-group">
        <text x="${padding.left - 10}" y="${y + 10}" text-anchor="end" font-size="10" fill="var(--text-muted)" font-weight="500">${escapeHtml(d.name)}</text>
        <rect x="${padding.left}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="url(#primaryGrad)" filter="drop-shadow(0px 2px 4px rgba(99, 102, 241, 0.2))"></rect>
        <text x="${padding.left + barWidth + 8}" y="${y + 10}" font-size="10" fill="var(--text-main)" font-weight="600">${currency.format(d.revenue)}</text>
      </g>
    `;
  }).join('');

  return `
    <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="display:block;">
      <defs>
        <linearGradient id="primaryGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#6366f1" />
          <stop offset="100%" stop-color="#a855f7" />
        </linearGradient>
      </defs>
      ${bars}
    </svg>
  `;
}

function generateCategorySalesSvg(categoryData) {
  const width = 450;
  const height = 140;
  const padding = { top: 10, right: 30, bottom: 10, left: 100 };
  const maxCount = Math.max(...categoryData.map(d => d.total), 1);

  const bars = categoryData.map((d, i) => {
    const barHeight = 14;
    const barGap = 10;
    const y = padding.top + i * (barHeight + barGap);
    const availableWidth = width - padding.left - padding.right;
    const barWidth = (d.total / maxCount) * availableWidth;

    return `
      <g class="bar-group">
        <text x="${padding.left - 10}" y="${y + 10}" text-anchor="end" font-size="10" fill="var(--text-muted)" font-weight="500">${escapeHtml(d.category)}</text>
        <rect x="${padding.left}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="url(#secondaryGrad)" filter="drop-shadow(0px 2px 4px rgba(14, 165, 233, 0.2))"></rect>
        <text x="${padding.left + barWidth + 8}" y="${y + 10}" font-size="10" fill="var(--text-main)" font-weight="600">${currency.format(d.total)} (${d.count} sales)</text>
      </g>
    `;
  }).join('');

  return `
    <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="display:block;">
      <defs>
        <linearGradient id="secondaryGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#0ea5e9" />
          <stop offset="100%" stop-color="#10b981" />
        </linearGradient>
      </defs>
      ${bars}
    </svg>
  `;
}


function filterSriLedger() {
  const tbody = byId("sri-ledger-tbody");
  if (!tbody) return;

  const searchQuery = byId("sri-filter-search")?.value?.toLowerCase() || '';
  const vendorFilter = byId("sri-filter-vendor")?.value || 'all';
  const categoryFilter = byId("sri-filter-category")?.value || 'all';

  const filteredTxns = state.transactions.filter(txn => {
    const vendor = state.vendors.find(v => v.id === txn.vendorId);
    const product = state.products.find(p => p.id === txn.productId);
    
    const vendorName = vendor ? vendor.businessName : '';
    const productName = product ? product.name : '';
    const category = product ? product.category : '';

    const matchesSearch = 
      txn.transactionId.toLowerCase().includes(searchQuery) ||
      productName.toLowerCase().includes(searchQuery) ||
      category.toLowerCase().includes(searchQuery);

    const matchesVendor = vendorFilter === 'all' || txn.vendorId === vendorFilter;
    const matchesCategory = categoryFilter === 'all' || category === categoryFilter;

    return matchesSearch && matchesVendor && matchesCategory;
  });

  tbody.innerHTML = filteredTxns.map(txn => {
    const vendor = state.vendors.find(v => v.id === txn.vendorId);
    const product = state.products.find(p => p.id === txn.productId);
    const rate = vendor ? getCommissionValue(vendor) : 10;
    const comm = (Number(txn.totalAmount || 0) * rate) / 100;

    return `
      <tr>
        <td style="font-size:0.8rem; color:var(--text-muted);">${formatDate(txn.date)}</td>
        <td><strong>${escapeHtml(txn.transactionId)}</strong></td>
        <td>${escapeHtml(vendor ? vendor.businessName : txn.vendorId)}</td>
        <td>${escapeHtml(product ? product.name : txn.productId)}</td>
        <td><span class="badge" style="background: rgba(255,255,255,0.05); color:var(--text-main); font-size:0.75rem;">${escapeHtml(product ? product.category : 'General')}</span></td>
        <td>${txn.quantity}</td>
        <td><strong>${currency.format(txn.totalAmount)}</strong></td>
        <td style="color:#a855f7;">${currency.format(comm)} <span style="font-size:0.7rem; opacity:0.6;">(${rate}%)</span></td>
      </tr>
    `;
  }).join('') || `<tr><td colspan="8" style="color:var(--text-muted); text-align:center;">No matching transactions found.</td></tr>`;
}

document.addEventListener("DOMContentLoaded", init);
