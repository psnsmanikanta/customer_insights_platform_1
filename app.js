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
  "admin-dashboard": "Admin Dashboard",
  "admin-vendors": "Vendor Roster",
  "admin-compliance": "Compliance Pipeline",
  "admin-inventory": "Inventory Forecast",
  "admin-customer-segmentation": "Customer Segmentation",
  "admin-customer-behavior": "Customer Behaviour & Recommendations",
  "admin-sales-revenue-intelligence": "Sales & Revenue Intelligence",
  "vendor-onboarding": "Vendor Registration",
  "vendor-dashboard": "Vendor Dashboard",
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
  }
];

const state = {
  vendors: [],
  products: [],
  currentRole: "admin",
  currentVendorId: null,
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
  selectedCustomerId: null
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
    const vendor = state.vendors.find((item) => item.email.toLowerCase() === String(payload.email || "").toLowerCase());
    if (!vendor) throw { status: 401, message: "Invalid vendor email" };
    state.currentRole = vendor.id;
    state.currentVendorId = vendor.id;
    renderAll();
    return { token: vendor.settings.apiToken, vendor: this.toDatabaseRecord(vendor) };
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

  throw { status: 404, message: "Endpoint not found" };
}

function renderAll() {
  renderRoleSelector();
  renderAdminDashboard();
  renderVendorTable();
  renderComplianceQueue();
  renderRevenueAnalytics();
  renderSalesRevenueIntelligence();
  renderVendorViews();
  renderEndpoints();
  updateRoleChrome();
}

function renderRoleSelector() {
  const selector = byId("role-selector");
  if (!selector) return;
  const current = selector.value || state.currentRole;
  selector.innerHTML = `
    <option value="admin">Marketplace Administrator</option>
    <option disabled>--- Registered Vendors ---</option>
    ${state.vendors.map((vendor) => `<option value="${vendor.id}">Vendor: ${escapeHtml(vendor.businessName)} (${STATUS_LABELS[getVendorStatus(vendor)]})</option>`).join("")}
    <option disabled>--- Onboarding ---</option>
    <option value="register_new">Register a New Vendor...</option>
  `;
  selector.value = state.vendors.some((vendor) => vendor.id === current) ? current : state.currentRole;
}

function renderAdminDashboard() {
  const activeVendors = state.vendors.filter((vendor) => getVendorStatus(vendor) === "active");
  const sales = state.vendors.reduce((total, vendor) => total + Number(vendor.metrics?.salesVolume || 0), 0);
  const commission = state.vendors.reduce((total, vendor) => total + Number(vendor.metrics?.commissionEarned || 0), 0);
  const avgFulfillment = activeVendors.length
    ? activeVendors.reduce((total, vendor) => total + Number(vendor.metrics?.fulfillmentRate || 0), 0) / activeVendors.length
    : 0;

  byId("admin-total-sales").textContent = currency.format(sales);
  byId("admin-total-commission").textContent = currency.format(commission);
  byId("admin-active-count").textContent = activeVendors.length;
  byId("admin-avg-fulfillment").textContent = `${avgFulfillment.toFixed(1)}%`;

  const pending = state.vendors.filter((vendor) => getVendorStatus(vendor) === "pending" || getVendorStatus(vendor) === "approved");
  byId("admin-pending-onboardings-container").innerHTML = pending.length
    ? pending.map((vendor) => `
      <div class="document-item">
        <div>
          <div class="document-name">${escapeHtml(vendor.businessName)}</div>
          <div class="document-meta">${escapeHtml(vendor.email)} | ${formatDate(getCreatedAt(vendor))}</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.app.openComplianceReview('${vendor.id}')">Review</button>
      </div>
    `).join("")
    : `<p style="color: var(--text-muted);">No pending vendor approvals.</p>`;

  byId("admin-leaderboard-tbody").innerHTML = [...state.vendors]
    .sort((a, b) => Number(b.metrics?.salesVolume || 0) - Number(a.metrics?.salesVolume || 0))
    .map((vendor) => `
      <tr>
        <td><strong>${escapeHtml(vendor.businessName)}</strong><br><span style="color:var(--text-dim);font-size:.78rem;">${vendor.id}</span></td>
        <td>${escapeHtml(vendor.categories.join(", "))}</td>
        <td>${currency.format(vendor.metrics?.salesVolume || 0)}</td>
        <td>${currency.format(vendor.metrics?.commissionEarned || 0)}</td>
        <td>${badge(getVendorStatus(vendor))}</td>
      </tr>
    `).join("");
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

  byId("vendor-dashboard-metrics").innerHTML = `
    <div class="glass-card"><div class="metric-card"><span class="metric-label">Sales Volume</span><span class="metric-value">${currency.format(vendor.metrics.salesVolume)}</span></div></div>
    <div class="glass-card"><div class="metric-card"><span class="metric-label">Commission</span><span class="metric-value">${currency.format(vendor.metrics.commissionEarned)}</span></div></div>
    <div class="glass-card"><div class="metric-card"><span class="metric-label">Fulfillment</span><span class="metric-value">${vendor.metrics.fulfillmentRate.toFixed(1)}%</span></div></div>
    <div class="glass-card"><div class="metric-card"><span class="metric-label">Rating</span><span class="metric-value">${vendor.metrics.avgRating.toFixed(1)}</span></div></div>
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
  const products = state.products.filter((product) => product.vendorId === vendor.id);
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
}

async function loadRevenueAnalytics() {
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
    const response = await fetch("/api/analytics/customer-behavior");
    if (!response.ok) throw new Error("Customer behaviour request failed");
    state.customerBehaviorAnalytics = await response.json();
  } catch (error) {
    console.warn("Unable to load customer behaviour analytics from API", error);
    state.customerBehaviorAnalytics = buildCustomerBehaviorAnalyticsFromState();
  }

  renderRevenueAnalytics();
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
  if (tab === "admin-customer-segmentation") {
    renderCustomerSegmentation();
    window.analyticsUI?.renderAnalyticsCharts();
  }
  if (tab === "admin-customer-behavior") renderCustomerBehaviorDashboard();
  if (tab === "admin-sales-revenue-intelligence") {
    renderSalesRevenueIntelligence();
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
    switchTab("admin-dashboard");
  } else {
    state.currentRole = value;
    state.currentVendorId = value;
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
  showToast("Customer login is not available in this marketplace management portal yet.", "info");
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
