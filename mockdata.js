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
  },
  {
    id: "VND-7324",
    businessName: "Byte Bazaar India",
    registrationNumber: "IND-7324153-X",
    address: "12 Cyber Tower, Bangalore, India",
    contactPerson: "Priya Nair",
    email: "priya@bytebazaar.in",
    phone: "+91 9876512345",
    categories: ["Electronics", "Gadgets"],
    commissionStructure: {
      type: "percentage",
      rate: 9.0,
      details: "9% commission on electronics and gadgets"
    },
    operationalStatus: "active",
    verificationStatus: "approved",
    documents: [
      { id: "doc-12", name: "Business Registration Certificate", status: "approved", fileUrl: "bytebazaar_reg.pdf" },
      { id: "doc-13", name: "Tax Identification Document (W-9)", status: "approved", fileUrl: "bytebazaar_tax.pdf" }
    ],
    metrics: {
      fulfillmentRate: 96.0,
      avgRating: 4.7,
      salesVolume: 65200,
      commissionEarned: 5868.0
    },
    createdDate: "2026-03-25T09:40:00Z",
    settings: {
      paymentMethod: "ACH Direct Deposit",
      billingEmail: "billing@bytebazaar.in",
      webhookUrl: "https://bytebazaar.in/webhooks/orders",
      apiToken: "mkt_live_7324BB4z"
    }
  },
  {
    id: "VND-8843",
    businessName: "StyleNest Apparel",
    registrationNumber: "IND-8843772-F",
    address: "99 Fashion Avenue, Chennai, India",
    contactPerson: "Meera Kapoor",
    email: "meera@stylenest.in",
    phone: "+91 9876578901",
    categories: ["Apparel", "Lifestyle"],
    commissionStructure: {
      type: "percentage",
      rate: 11.0,
      details: "11% commission on apparel and lifestyle categories"
    },
    operationalStatus: "active",
    verificationStatus: "approved",
    documents: [
      { id: "doc-14", name: "Business Registration Certificate", status: "approved", fileUrl: "stylenest_reg.pdf" },
      { id: "doc-15", name: "Tax Identification Document (W-9)", status: "approved", fileUrl: "stylenest_tax.pdf" }
    ],
    metrics: {
      fulfillmentRate: 92.5,
      avgRating: 4.3,
      salesVolume: 37800,
      commissionEarned: 4158.0
    },
    createdDate: "2026-05-08T11:20:00Z",
    settings: {
      paymentMethod: "Wire Transfer",
      billingEmail: "finance@stylenest.in",
      webhookUrl: "https://stylenest.in/api/order-notify",
      apiToken: "mkt_live_8843SN7k"
    }
  },
  {
    id: "VND-5517",
    businessName: "Urban Kitchen Co.",
    registrationNumber: "IND-5517541-K",
    address: "21 Market Street, Pune, India",
    contactPerson: "Arjun Patel",
    email: "arjun@urbankitchen.co",
    phone: "+91 9876594321",
    categories: ["Home & Kitchen", "Cookware"],
    commissionStructure: {
      type: "tiered",
      rate: 10.0,
      details: "10% commission for home & kitchen products"
    },
    operationalStatus: "active",
    verificationStatus: "approved",
    documents: [
      { id: "doc-16", name: "Business Registration Certificate", status: "approved", fileUrl: "urbankitchen_reg.pdf" },
      { id: "doc-17", name: "Tax Identification Document (W-9)", status: "approved", fileUrl: "urbankitchen_tax.pdf" }
    ],
    metrics: {
      fulfillmentRate: 95.8,
      avgRating: 4.6,
      salesVolume: 51400,
      commissionEarned: 5140.0
    },
    createdDate: "2026-06-12T08:50:00Z",
    settings: {
      paymentMethod: "ACH Direct Deposit",
      billingEmail: "accounts@urbankitchen.co",
      webhookUrl: "https://urbankitchen.co/api/mkt-webhooks",
      apiToken: "mkt_live_5517UK3z"
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
  { id: "PROD-401", vendorId: "VND-6209", name: "Hydrating Rosewater Facial Mist", category: "Beauty & Personal Care", price: 24.00, sku: "VB-HR-MIST", stock: 0, status: "out_of_stock" },
  { id: "PROD-501", vendorId: "VND-7324", name: "Wireless Noise-Canceling Earbuds", category: "Electronics", price: 69.99, sku: "BB-WN-EARBUD", stock: 60, status: "active" },
  { id: "PROD-601", vendorId: "VND-8843", name: "Active Performance Tee", category: "Apparel", price: 39.99, sku: "SN-AP-TEE", stock: 120, status: "active" },
  { id: "PROD-701", vendorId: "VND-5517", name: "Precision Ceramic Knife Set", category: "Home & Kitchen", price: 79.99, sku: "UK-CK-SET", stock: 30, status: "active" }
];
const INITIAL_TRANSACTIONS = [
  { transactionId: "TRN-001", vendorId: "VND-8392", productId: "PROD-101", quantity: 2, totalAmount: 379.98, date: "2026-07-10T10:00:00Z" },
  { transactionId: "TRN-002", vendorId: "VND-4721", productId: "PROD-201", quantity: 1, totalAmount: 34.50, date: "2026-07-10T11:30:00Z" },
  { transactionId: "TRN-003", vendorId: "VND-8392", productId: "PROD-102", quantity: 1, totalAmount: 1299.00, date: "2026-07-11T14:00:00Z" },
  { transactionId: "TRN-004", vendorId: "VND-4721", productId: "PROD-202", quantity: 3, totalAmount: 360.00, date: "2026-07-12T09:00:00Z" },
  { transactionId: "TRN-005", vendorId: "VND-7324", productId: "PROD-501", quantity: 4, totalAmount: 279.96, date: "2026-07-12T12:00:00Z" },
  { transactionId: "TRN-006", vendorId: "VND-8843", productId: "PROD-601", quantity: 2, totalAmount: 79.98, date: "2026-07-13T10:15:00Z" },
  { transactionId: "TRN-007", vendorId: "VND-5517", productId: "PROD-701", quantity: 1, totalAmount: 24.99, date: "2026-07-13T14:45:00Z" }
];