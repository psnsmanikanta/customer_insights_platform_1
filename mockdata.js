const INITIAL_VENDORS = [
  {
    id: "VND-8392",
    businessName: "NovaTech Solutions",
    registrationNumber: "IND-9837482-B",
    address: "100 Innovation Way,mumbai,india",
    contactPerson: "Sarah Jenkins",
    email: "sarah.j@novatech.io",
    phone: "+91 987654320",
    categories: ["Electronics", "Computers", "Accessories"],
    commissionStructure: {
      type: "percentage",
      rate: 8.5,
      details: "Flat 8.5% fee on all electronics category sales"
    },
    operationalStatus: "active",
    verificationStatus: "approved",
    documents: [
      { id: "doc-1", name: "Business Registration Certificate", status: "approved", fileUrl: "business_cert_novatech.pdf" },
      { id: "doc-2", name: "Tax Identification Document (W-9)", status: "approved", fileUrl: "w9_novatech.pdf" },
      { id: "doc-3", name: "Corporate Banking Details", status: "approved", fileUrl: "bank_details_novatech.pdf" }
    ],
    metrics: {
      fulfillmentRate: 98.4,
      avgRating: 4.8,
      salesVolume: 124500,
      commissionEarned: 10582.5
    },
    createdDate: "2026-02-14T08:30:00Z",
    settings: {
      paymentMethod: "ACH Direct Deposit",
      billingEmail: "finance@novatech.io",
      webhookUrl: "https://api.novatech.io/webhooks/marketplace",
      apiToken: "mkt_live_51P89aF2kX9z"
    }
  },
  {
    id: "VND-4721",
    businessName: "EcoStyle Living",
    registrationNumber: "IND-4721839-D",
    address: "45 Green street,delhi 666898",
    contactPerson: "Ravi Singh",
    email: "m.chen@ecostyle.com",
    phone: "+91 9876546548",
    categories: ["Home & Kitchen", "Furniture", "Eco-Friendly"],
    commissionStructure: {
      type: "tiered",
      rate: 10.0,
      details: "10% for monthly sales <  10k, 7.5% for monthly sales >= $10k"
    },
    operationalStatus: "active",
    verificationStatus: "approved",
    documents: [
      { id: "doc-4", name: "Business Registration Certificate", status: "approved", fileUrl: "biz_reg_ecostyle.pdf" },
      { id: "doc-5", name: "Tax Identification Document (W-9)", status: "approved", fileUrl: "tax_id_ecostyle.pdf" },
      { id: "doc-6", name: "Liability Insurance Policy", status: "approved", fileUrl: "insurance_ecostyle.pdf" }
    ],
    metrics: {
      fulfillmentRate: 94.2,
      avgRating: 4.5,
      salesVolume: 42100,
      commissionEarned: 3850.0
    },
    createdDate: "2026-04-01T10:15:00Z",
    settings: {
      paymentMethod: "Wire Transfer",
      billingEmail: "accounts@ecostyle.com",
      webhookUrl: "https://ecostyle.com/callbacks/orders",
      apiToken: "mkt_live_92A82fC71bX"
    }
  },
  {
    id: "VND-1054",
    businessName: "Apex Athletics",
    registrationNumber: "US-1054921-A",
    address: "700 Performance Nagpur, India, TX 78701",
    contactPerson: "Damian Lopez",
    email: "vendor@apexathletics.net",
    phone: "+91 7876556760",
    categories: ["Sports & Outdoors", "Apparel"],
    commissionStructure: {
      type: "percentage",
      rate: 12.0,
      details: "Standard 12% category rate on apparel and sports gear"
    },
    operationalStatus: "pending",
    verificationStatus: "under_review",
    documents: [
      { id: "doc-7", name: "Business Registration Certificate", status: "approved", fileUrl: "apex_registration.pdf" },
      { id: "doc-8", name: "Tax Identification Document (W-9)", status: "pending", fileUrl: "apex_w9.pdf" },
      { id: "doc-9", name: "Liability Insurance Policy", status: "rejected", fileUrl: "apex_insurance_expired.pdf" }
    ],
    metrics: {
      fulfillmentRate: 0.0,
      avgRating: 0.0,
      salesVolume: 0,
      commissionEarned: 0.0
    },
    createdDate: "2026-07-01T14:22:00Z",
    settings: {
      paymentMethod: "ACH Direct Deposit",
      billingEmail: "billing@apexathletics.net",
      webhookUrl: "",
      apiToken: "mkt_live_1054_pending"
    }
  },
  {
    id: "VND-6209",
    businessName: "Velvet Bloom Cosmetics",
    registrationNumber: "IND-6209384-C",
    address: "88 Luxury Lane, Mumbai, India, NY 10001",
    contactPerson: "Elena Rostova",
    email: "elena@velvetbloom.co",
    phone: "+91 9876546548",
    categories: ["Beauty & Personal Care", "Health"],
    commissionStructure: {
      type: "flat",
      rate: 5.0,
      details: "Flat rate of 5.00 per item sold regardless of price"
    },
    operationalStatus: "suspended",
    verificationStatus: "approved",
    documents: [
      { id: "doc-10", name: "Business Registration Certificate", status: "approved", fileUrl: "velvet_bloom_reg.pdf" },
      { id: "doc-11", name: "FDA Compliance Certificate", status: "approved", fileUrl: "fda_compliance_bloom.pdf" }
    ],
    metrics: {
      fulfillmentRate: 81.5,
      avgRating: 3.2,
      salesVolume: 18900,
      commissionEarned: 945.0
    },
    createdDate: "2026-01-20T09:00:00Z",
    settings: {
      paymentMethod: "PayPal Corporate",
      billingEmail: "pay@velvetbloom.co",
      webhookUrl: "https://velvetbloom.co/api/mkt-updates",
      apiToken: "mkt_live_6209vB_revoked"
    }
  }
];
const INITIAL_PRODUCTS = [
  { id: "PROD-101", vendorId: "VND-8392", name: "SuperDrive Extreme 2TB SSD", category: "Electronics", price: 189.99, sku: "NT-SD-2TB-SSD", stock: 45, status: "active" },
  { id: "PROD-102", vendorId: "VND-8392", name: "ZenBook Pro 15.6 Inch", category: "Computers", price: 1299.00, sku: "NT-ZB-PRO15", stock: 12, status: "active" },
  { id: "PROD-103", vendorId: "VND-8392", name: "USB-C Multi-Port Hub (8-in-1)", category: "Accessories", price: 49.99, sku: "NT-UC-HUB8", stock: 150, status: "active" },
  { id: "PROD-201", vendorId: "VND-4721", name: "Handcrafted Bamboo Cutting Board Set", category: "Home & Kitchen", price: 34.50, sku: "ES-BB-CBSET", stock: 85, status: "active" },
  { id: "PROD-202", vendorId: "VND-4721", name: "Organic Linen Bed Sheet Set (Queen)", category: "Home & Kitchen", price: 120.00, sku: "ES-OL-SHEETQ", stock: 22, status: "active" },
  { id: "PROD-203", vendorId: "VND-4721", name: "Ergonomic Reclaimed Wood Desk", category: "Furniture", price: 450.00, sku: "ES-ER-RWDESK", stock: 5, status: "active" },
  { id: "PROD-301", vendorId: "VND-1054", name: "Pro-Series Compression Socks", category: "Apparel", price: 19.99, sku: "AA-PS-CSOCK", stock: 500, status: "draft" },
  { id: "PROD-401", vendorId: "VND-6209", name: "Hydrating Rosewater Facial Mist", category: "Beauty & Personal Care", price: 24.00, sku: "VB-HR-MIST", stock: 0, status: "out_of_stock" }
];
const INITIAL_TRANSACTIONS = [
  { transactionId: "TRN-001", vendorId: "VND-8392", productId: "PROD-101", quantity: 2, totalAmount: 379.98, date: "2026-07-10T10:00:00Z" },
  { transactionId: "TRN-002", vendorId: "VND-4721", productId: "PROD-201", quantity: 1, totalAmount: 34.50, date: "2026-07-10T11:30:00Z" },
  { transactionId: "TRN-003", vendorId: "VND-8392", productId: "PROD-102", quantity: 1, totalAmount: 1299.00, date: "2026-07-11T14:00:00Z" },
  { transactionId: "TRN-004", vendorId: "VND-4721", productId: "PROD-202", quantity: 3, totalAmount: 360.00, date: "2026-07-12T09:00:00Z" }
];