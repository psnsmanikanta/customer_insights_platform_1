document.addEventListener('DOMContentLoaded', () => {
    const vendorId = 'VND-8392'; // Hardcoded for this example
    const vendor = INITIAL_VENDORS.find(v => v.id === vendorId);

    if (vendor) {
        // Overview Chart
        const overviewCtx = document.getElementById('overview-chart').getContext('2d');
        new Chart(overviewCtx, {
            type: 'pie',
            data: {
                labels: ['Sales Volume', 'Commission Earned'],
                datasets: [{
                    label: 'Financials',
                    data: [vendor.metrics.salesVolume, vendor.metrics.commissionEarned],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
});