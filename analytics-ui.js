function createChart(containerId, dataPoints, label) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const width = 320;
  const height = 120;
  const max = Math.max(...dataPoints.map((item) => item.value), 1);
  const svg = [`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="display:block;">`];
  const pointSpacing = width / (dataPoints.length + 1);

  svg.push(`<polyline fill="none" stroke="#8b5cf6" stroke-width="3" points="${dataPoints.map((item, index) => `${(index + 1) * pointSpacing},${height - (item.value / max) * (height - 30) - 20}`).join(' ')}"></polyline>`);
  dataPoints.forEach((item, index) => {
    const x = (index + 1) * pointSpacing;
    const y = height - (item.value / max) * (height - 30) - 20;
    svg.push(`<circle cx="${x}" cy="${y}" r="5" fill="#a855f7"></circle>`);
    svg.push(`<text x="${x}" y="${height - 5}" text-anchor="middle" font-size="10" fill="#94a3b8">${escapeHtml(item.label)}</text>`);
  });

  svg.push(`</svg>`);
  container.innerHTML = `<div style="font-size:0.95rem; color:var(--text-main); margin-bottom: 10px;">${escapeHtml(label)}</div>${svg.join('')}`;
}

function renderAnalyticsCharts() {
  const revenuePoints = state.analytics.slice(0, 5).map((item) => ({ label: item.vendorId, value: item.totalRevenue }));
  const cohortPoints = generateCustomerSegmentInsights().map((item) => ({ label: item.label.substring(0, 8), value: item.count }));
  const forecastPoints = state.products
    .filter((product) => product.stock < 30)
    .slice(0, 5)
    .map((product) => ({ label: product.sku, value: 30 - product.stock }));

  createChart('revenue-chart', revenuePoints.length ? revenuePoints : [{ label: 'None', value: 1 }], 'Revenue by Vendor');
  createChart('segmentation-chart', cohortPoints.length ? cohortPoints : [{ label: 'None', value: 1 }], 'Customer Cohorts');
  createChart('forecast-chart', forecastPoints.length ? forecastPoints : [{ label: 'None', value: 1 }], 'Low Stock Forecast');
}

window.analyticsUI = {
  renderAnalyticsCharts
};
