function createPieChart(containerId, data, label) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const width = 320;
  const height = 220;
  const radius = Math.min(width, height) / 2 - 20;
  const centerX = width / 2;
  const centerY = height / 2;
  const colors = [
    '#4f46e5', '#0ea5e9', '#f97316', '#14b8a6', '#facc15', '#ec4899', '#22c55e', '#e11d48'
  ];

  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0) || 1;

  container.innerHTML = '';
  const title = document.createElement('div');
  title.style.fontSize = '0.95rem';
  title.style.color = 'var(--text-main)';
  title.style.marginBottom = '10px';
  title.textContent = label;
  container.appendChild(title);

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.style.display = 'block';
  container.appendChild(svg);

  let startAngle = 0;
  data.forEach((item, index) => {
    const value = Number(item.value || 0);
    const sliceAngle = (value / total) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', colors[index % colors.length]);
    svg.appendChild(path);

    startAngle = endAngle;
  });

  const legend = document.createElement('div');
  legend.style.display = 'flex';
  legend.style.flexWrap = 'wrap';
  legend.style.justifyContent = 'center';
  legend.style.gap = '8px';
  legend.style.marginTop = '10px';

  data.forEach((item, index) => {
    const labelRow = document.createElement('div');
    labelRow.style.display = 'flex';
    labelRow.style.alignItems = 'center';
    labelRow.style.gap = '6px';
    labelRow.style.fontSize = '0.78rem';
    labelRow.style.color = 'var(--text-muted)';

    const colorSwatch = document.createElement('span');
    colorSwatch.style.width = '12px';
    colorSwatch.style.height = '12px';
    colorSwatch.style.background = colors[index % colors.length];
    colorSwatch.style.borderRadius = '2px';
    labelRow.appendChild(colorSwatch);

    const labelText = document.createElement('span');
    labelText.textContent = `${item.label}: ${Math.round((Number(item.value || 0) / total) * 100)}%`;
    labelRow.appendChild(labelText);
    legend.appendChild(labelRow);
  });

  container.appendChild(legend);
}




function renderAnalyticsCharts() {
  const revenuePoints = state.analytics.slice(0, 5).map((item) => ({ label: item.vendorId, value: item.totalRevenue }));
  const cohortPoints = generateCustomerSegmentInsights().map((item) => ({ label: item.label.substring(0, 8), value: item.count }));
  const forecastPoints = state.products
    .filter((product) => product.stock < 30)
    .slice(0, 5)
    .map((product) => ({ label: product.sku, value: 30 - product.stock }));

  createPieChart('revenue-chart', revenuePoints.length ? revenuePoints : [{ label: 'None', value: 1 }], 'Revenue by Vendor');
  createPieChart('segmentation-chart', cohortPoints.length ? cohortPoints : [{ label: 'None', value: 1 }], 'Customer Cohorts');
  createPieChart('forecast-chart', forecastPoints.length ? forecastPoints : [{ label: 'None', value: 1 }], 'Low Stock Forecast');
}


window.analyticsUI = {
  renderAnalyticsCharts
};