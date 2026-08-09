# Architecture and API Reference

ShopSense is a single-page HTML/CSS/JavaScript frontend served by a Node.js HTTP API. `mockdata.js` supplies the current vendors, products, customers, and orders. `server.js` calculates analytics from those records.

## Main API endpoints

- `GET /api/admin/dashboard` — admin KPIs, pending vendors, low stock, vendor revenue.
- `GET /api/admin/benchmark` — vendor and category comparison.
- `GET /api/admin/executive-report` — executive KPIs and commercial highlights.
- `GET /api/admin/system-status` — application/data validation state.
- `GET /api/vendors/:id/dashboard` — vendor catalog, sales analytics, and benchmark.
- `GET /api/customers/:id/dashboard` — customer profile and recommendations.
- `GET /api/analytics/revenue` and `GET /api/analytics/customer-behavior` — analytical datasets.

Cancelled orders are retained for audit/history but excluded from revenue and product-sales calculations.
