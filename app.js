const STORE_KEYS = {
  vendors: "shopsense.module1.vendors",
  products: "shopsense.module1.products",
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
  selectedComplianceVendorId: null
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

  byId("ob-categories-input")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addCategoryTag(event.target.value);
    }
  });

  renderAll();
  switchTab("admin-dashboard");
}

window.app = {
  switchTab,
  handleRoleChange,
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
  }
};

document.addEventListener("DOMContentLoaded", init);
