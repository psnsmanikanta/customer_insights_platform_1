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
