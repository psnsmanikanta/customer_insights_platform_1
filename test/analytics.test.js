const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../server');

function requestJson(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on('error', reject);
  });
}

const http = require('http');

test('GET /api/analytics/revenue returns a vendor revenue report', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    const response = await requestJson(`http://127.0.0.1:${port}/api/analytics/revenue`);
    assert.equal(response.statusCode, 200);
    assert.ok(Array.isArray(response.body));
    assert.ok(response.body.some(item => item.vendorId === 'VND-8392' && item.totalRevenue > 0));
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test('GET /api/customers and /api/transactions return marketplace data', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    const customers = await requestJson(`http://127.0.0.1:${port}/api/customers`);
    const transactions = await requestJson(`http://127.0.0.1:${port}/api/transactions`);
    assert.equal(customers.statusCode, 200);
    assert.ok(Array.isArray(customers.body));
    assert.equal(transactions.statusCode, 200);
    assert.ok(Array.isArray(transactions.body));
    assert.ok(transactions.body.length > 0, 'Expected at least one transaction');
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test('GET /api/vendors/:id/dashboard returns database-backed inventory summaries', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    const response = await requestJson(`http://127.0.0.1:${port}/api/vendors/VND-8392/dashboard`);
    assert.equal(response.statusCode, 200);
    assert.equal(response.body.vendor.id, 'VND-8392');
    assert.equal(response.body.summary.totalProducts, 6);
    assert.ok(response.body.summary.inventoryUnits > 0);
    assert.ok(response.body.stockBreakdown['In stock'] > 0);
    assert.ok(Array.isArray(response.body.recentTransactions));
    assert.ok(Array.isArray(response.body.topProducts));
    assert.ok(response.body.benchmark.rankedVendors > 0);
    assert.equal(response.body.benchmark.vendorRevenueRank, 1);
    assert.equal(response.body.benchmark.revenueDistribution.length, response.body.benchmark.rankedVendors);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test('GET /api/admin/dashboard returns live marketplace and low-stock summaries', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    const response = await requestJson(`http://127.0.0.1:${port}/api/admin/dashboard`);
    assert.equal(response.statusCode, 200);
    assert.ok(response.body.summary.totalRevenue > 0);
    assert.ok(response.body.summary.totalOrders > 0);
    assert.ok(response.body.summary.totalProducts > 0);
    assert.ok(response.body.lowStockProducts.some((product) => product.stock === 0));
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test('GET /api/analytics/customer-behavior returns metrics and recommendations from stored data', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    const response = await requestJson(`http://127.0.0.1:${port}/api/analytics/customer-behavior`);
    assert.equal(response.statusCode, 200);
    assert.equal(response.body.metrics.totalCustomers, 8);
    assert.ok(Array.isArray(response.body.segments));
    assert.ok(response.body.recommendations.length > 0);
    assert.ok(response.body.recommendations[0].productName);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test('GET /api/admin/executive-report excludes cancelled orders from net revenue', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    const response = await requestJson(`http://127.0.0.1:${port}/api/admin/executive-report`);
    assert.equal(response.statusCode, 200);
    assert.ok(response.body.netRevenue > 0);
    assert.ok(response.body.completedOrders > 0);
    assert.ok(response.body.cancelledOrders > 0);
    assert.ok(response.body.cancellationRate > 0);
    assert.ok(response.body.topVendors.length > 0);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test('GET /api/admin/system-status validates historical order pricing', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    const response = await requestJson(`http://127.0.0.1:${port}/api/admin/system-status`);
    assert.equal(response.statusCode, 200);
    assert.equal(response.body.validation.complete, true);
    assert.equal(response.body.validation.invalidTransactionCount, 0);
    assert.ok(response.body.services.some((service) => service.name === 'Node application server'));
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test('core analytics APIs pass a local performance smoke check', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    const startedAt = Date.now();
    const responses = await Promise.all([
      requestJson(`http://127.0.0.1:${port}/api/admin/dashboard`),
      requestJson(`http://127.0.0.1:${port}/api/admin/executive-report`),
      requestJson(`http://127.0.0.1:${port}/api/admin/system-status`),
      requestJson(`http://127.0.0.1:${port}/api/analytics/customer-behavior`)
    ]);
    assert.ok(responses.every((response) => response.statusCode === 200));
    assert.ok(Date.now() - startedAt < 1000, 'Expected local analytics API smoke check to finish within one second');
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});
