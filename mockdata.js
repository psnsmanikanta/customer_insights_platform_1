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
  { id: "PROD-701", vendorId: "VND-5517", name: "Precision Ceramic Knife Set", category: "Home & Kitchen", price: 79.99, sku: "UK-CK-SET", stock: 30, status: "active", imageUrl: "https://images.pexels.com/photos/33545/sunrise-phu-quoc-island-ocean.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
  { id: "PROD-104", vendorId: "VND-8392", name: "Orbit Wireless Mechanical Keyboard", category: "Accessories", price: 89.99, sku: "NT-OW-MK87", stock: 18, status: "active", imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80" },
  { id: "PROD-105", vendorId: "VND-8392", name: "ViewMax 27-inch QHD Monitor", category: "Computers", price: 329.00, sku: "NT-VM-27QHD", stock: 7, status: "active", imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80" },
  { id: "PROD-106", vendorId: "VND-8392", name: "PocketCharge 20K Power Bank", category: "Electronics", price: 39.99, sku: "NT-PC-20K", stock: 0, status: "out_of_stock", imageUrl: "https://images.unsplash.com/photo-1609592424824-7f13b95d5c93?auto=format&fit=crop&w=800&q=80" },
  { id: "PROD-204", vendorId: "VND-4721", name: "Woven Cotton Storage Basket", category: "Home & Kitchen", price: 28.00, sku: "ES-WC-BASKET", stock: 44, status: "active", imageUrl: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=800&q=80" },
  { id: "PROD-205", vendorId: "VND-4721", name: "Minimalist Floor Lamp", category: "Furniture", price: 110.00, sku: "ES-MF-LAMP", stock: 14, status: "active", imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80" },
  { id: "PROD-502", vendorId: "VND-7324", name: "Smart Fitness Watch", category: "Electronics", price: 149.99, sku: "BB-SF-WATCH", stock: 35, status: "active", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" },
  { id: "PROD-602", vendorId: "VND-8843", name: "Flex Training Shorts", category: "Apparel", price: 34.99, sku: "SN-FT-SHORT", stock: 16, status: "active", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80" },
  { id: "PROD-702", vendorId: "VND-5517", name: "Acacia Wood Serving Tray", category: "Home & Kitchen", price: 42.00, sku: "UK-AW-TRAY", stock: 52, status: "active", imageUrl: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80" }
];
const INITIAL_TRANSACTIONS = [
  { transactionId: "TRN-001", vendorId: "VND-8392", productId: "PROD-101", quantity: 2, totalAmount: 379.98, date: "2026-07-10T10:00:00Z" },
  { transactionId: "TRN-002", vendorId: "VND-4721", productId: "PROD-201", quantity: 1, totalAmount: 34.50, date: "2026-07-10T11:30:00Z" },
  { transactionId: "TRN-003", vendorId: "VND-8392", productId: "PROD-102", quantity: 1, totalAmount: 1299.00, date: "2026-07-11T14:00:00Z" },
  { transactionId: "TRN-004", vendorId: "VND-4721", productId: "PROD-202", quantity: 3, totalAmount: 360.00, date: "2026-07-12T09:00:00Z" },
  { transactionId: "TRN-005", vendorId: "VND-7324", productId: "PROD-501", quantity: 4, totalAmount: 279.96, date: "2026-07-12T12:00:00Z" },
  { transactionId: "TRN-006", vendorId: "VND-8843", productId: "PROD-601", quantity: 2, totalAmount: 79.98, date: "2026-07-13T10:15:00Z" },
  { transactionId: "TRN-007", vendorId: "VND-5517", productId: "PROD-701", quantity: 1, totalAmount: 79.99, date: "2026-07-13T14:45:00Z" },
  { transactionId: "TRN-008", vendorId: "VND-8392", productId: "PROD-103", quantity: 5, totalAmount: 249.95, date: "2026-07-15T09:20:00Z" },
  { transactionId: "TRN-009", vendorId: "VND-8392", productId: "PROD-104", quantity: 2, totalAmount: 179.98, date: "2026-07-16T12:10:00Z" },
  { transactionId: "TRN-010", vendorId: "VND-4721", productId: "PROD-203", quantity: 1, totalAmount: 450.00, date: "2026-07-16T15:40:00Z" },
  { transactionId: "TRN-011", vendorId: "VND-7324", productId: "PROD-502", quantity: 3, totalAmount: 449.97, date: "2026-07-17T10:05:00Z" },
  { transactionId: "TRN-012", vendorId: "VND-8843", productId: "PROD-602", quantity: 4, totalAmount: 139.96, date: "2026-07-17T13:25:00Z" },
  { transactionId: "TRN-013", vendorId: "VND-5517", productId: "PROD-702", quantity: 2, totalAmount: 84.00, date: "2026-07-18T08:45:00Z" },
  { transactionId: "TRN-014", vendorId: "VND-8392", productId: "PROD-105", quantity: 1, totalAmount: 329.00, date: "2026-07-18T11:30:00Z" },
  { transactionId: "TRN-015", vendorId: "VND-4721", productId: "PROD-204", quantity: 6, totalAmount: 168.00, date: "2026-07-18T16:20:00Z" },
  { transactionId: "TRN-016", vendorId: "VND-8392", productId: "PROD-101", quantity: 1, totalAmount: 189.99, date: "2026-07-19T09:15:00Z" },
  { transactionId: "TRN-017", vendorId: "VND-7324", productId: "PROD-501", quantity: 2, totalAmount: 139.98, date: "2026-07-19T11:55:00Z" },
  { transactionId: "TRN-018", vendorId: "VND-8843", productId: "PROD-601", quantity: 5, totalAmount: 199.95, date: "2026-07-20T10:20:00Z" },
  { transactionId: "TRN-019", vendorId: "VND-4721", productId: "PROD-205", quantity: 2, totalAmount: 220.00, date: "2026-07-20T14:10:00Z" },
  { transactionId: "TRN-020", vendorId: "VND-8392", productId: "PROD-104", quantity: 3, totalAmount: 269.97, date: "2026-07-21T09:40:00Z" },
  { transactionId: "TRN-021", vendorId: "VND-5517", productId: "PROD-701", quantity: 2, totalAmount: 159.98, date: "2026-07-21T16:35:00Z" },
  { transactionId: "TRN-022", vendorId: "VND-8392", productId: "PROD-102", quantity: 1, totalAmount: 1299.00, date: "2026-07-22T11:05:00Z" },
  { transactionId: "TRN-023", vendorId: "VND-8392", productId: "PROD-104", quantity: 2, totalAmount: 179.98, date: "2026-07-23T09:20:00Z", customerId: "CUST-001", status: "delivered" },
  { transactionId: "TRN-024", vendorId: "VND-8392", productId: "PROD-106", quantity: 1, totalAmount: 39.99, date: "2026-07-23T14:10:00Z", customerId: "CUST-002", status: "cancelled" },
  { transactionId: "TRN-025", vendorId: "VND-4721", productId: "PROD-204", quantity: 2, totalAmount: 56.00, date: "2026-07-24T10:05:00Z", customerId: "CUST-003", status: "delivered" },
  { transactionId: "TRN-026", vendorId: "VND-4721", productId: "PROD-205", quantity: 1, totalAmount: 110.00, date: "2026-07-24T16:25:00Z", customerId: "CUST-004", status: "cancelled" },
  { transactionId: "TRN-027", vendorId: "VND-7324", productId: "PROD-502", quantity: 1, totalAmount: 149.99, date: "2026-07-25T11:40:00Z", customerId: "CUST-005", status: "delivered" },
  { transactionId: "TRN-028", vendorId: "VND-8843", productId: "PROD-602", quantity: 2, totalAmount: 69.98, date: "2026-07-25T15:15:00Z", customerId: "CUST-006", status: "shipped" },
  { transactionId: "TRN-029", vendorId: "VND-5517", productId: "PROD-702", quantity: 3, totalAmount: 126.00, date: "2026-07-26T08:50:00Z", customerId: "CUST-001", status: "delivered" },
  { transactionId: "TRN-030", vendorId: "VND-8392", productId: "PROD-101", quantity: 1, totalAmount: 189.99, date: "2026-07-26T13:05:00Z", customerId: "CUST-007", status: "cancelled" },
  { transactionId: "TRN-031", vendorId: "VND-8392", productId: "PROD-104", quantity: 1, totalAmount: 89.99, date: "2026-07-27T10:10:00Z", customerId: "CUST-008", status: "delivered" },
  { transactionId: "TRN-032", vendorId: "VND-6209", productId: "PROD-401", quantity: 1, totalAmount: 24.00, date: "2026-07-27T17:30:00Z", customerId: "CUST-003", status: "cancelled" }
];

const INITIAL_CUSTOMERS = [
  { id: "CUST-001", name: "Maya Kaur", firstPurchaseDate: "2026-03-22T11:30:00Z", lastPurchaseDate: "2026-07-15T15:45:00Z", lifetimeValue: 3120, orderCount: 14 },
  { id: "CUST-002", name: "Noah Patel", firstPurchaseDate: "2026-07-05T09:10:00Z", lastPurchaseDate: "2026-07-05T09:10:00Z", lifetimeValue: 89, orderCount: 1 },
  { id: "CUST-003", name: "Priya Jain", firstPurchaseDate: "2025-11-18T13:25:00Z", lastPurchaseDate: "2026-07-12T18:20:00Z", lifetimeValue: 670, orderCount: 8 },
  { id: "CUST-004", name: "Arjun Mehta", firstPurchaseDate: "2026-07-12T17:40:00Z", lastPurchaseDate: "2026-07-12T17:40:00Z", lifetimeValue: 54, orderCount: 1 },
  { id: "CUST-005", name: "Sara Mukherjee", firstPurchaseDate: "2026-02-14T14:00:00Z", lastPurchaseDate: "2026-06-28T10:35:00Z", lifetimeValue: 1420, orderCount: 11 },
  { id: "CUST-006", name: "Karan Verma", firstPurchaseDate: "2026-04-08T08:20:00Z", lastPurchaseDate: "2026-07-18T12:30:00Z", lifetimeValue: 820, orderCount: 6 },
  { id: "CUST-007", name: "Aisha Khan", firstPurchaseDate: "2025-12-05T12:50:00Z", lastPurchaseDate: "2026-02-25T14:15:00Z", lifetimeValue: 190, orderCount: 3 },
  { id: "CUST-008", name: "Riya Sharma", firstPurchaseDate: "2026-07-16T10:50:00Z", lastPurchaseDate: "2026-07-16T10:50:00Z", lifetimeValue: 38, orderCount: 1 }
];
