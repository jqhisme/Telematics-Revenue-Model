// Interface for Telematics Pricing Model

let revenueChartInstance = null;

// Initialize the interface on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set default values
    document.getElementById('totalPolicy').value = 2500;
    document.getElementById('telematicsAdoptionRatio').value = 0.5;
    document.getElementById('baseYearlyPremium').value = 2750;
    document.getElementById('telematicsDiscount').value = 0.15;
    document.getElementById('baseLossRate').value = 0.71;
    document.getElementById('telematicsLossRateReduction').value = 0.2;
    document.getElementById('customerRetentionRate').value = 0.71;
    document.getElementById('customerRetentionRateMultiplierWithTelematics').value = 0.2;
    document.getElementById('customerAcquisitionCost').value = 300;
    document.getElementById('customerRetentionCostCoef').value = 0.2;

    // Update display values
    updateDisplayValues();

    // Add event listeners for all sliders
    ['totalPolicy', 'telematicsAdoptionRatio', 'baseYearlyPremium', 'telematicsDiscount', 'baseLossRate', 'telematicsLossRateReduction', 'customerRetentionRate', 'customerRetentionRateMultiplierWithTelematics', 'customerAcquisitionCost', 'customerRetentionCostCoef'].forEach(id => {
        document.getElementById(id).addEventListener('input', function() {
            updateDisplayValues();
            handleCalculate();
        });
    });

    // Add collapsible functionality
    document.getElementById('assumptionsHeader').addEventListener('click', function() {
        const content = document.getElementById('assumptionsContent');
        const icon = document.getElementById('assumptionsIcon');
        content.classList.toggle('open');
        icon.classList.toggle('open');
    });

    document.getElementById('customerAssumptionsHeader').addEventListener('click', function() {
        const content = document.getElementById('customerAssumptionsContent');
        const icon = document.getElementById('customerAssumptionsIcon');
        content.classList.toggle('open');
        icon.classList.toggle('open');
    });

    // Perform initial calculation
    handleCalculate();
});

function updateDisplayValues() {
    // Update total policies display
    const totalPolicy = parseFloat(document.getElementById('totalPolicy').value);
    document.getElementById('totalPolicyValue').textContent = totalPolicy.toLocaleString();

    // Update adoption ratio display as percentage
    const adoptionRatio = parseFloat(document.getElementById('telematicsAdoptionRatio').value);
    document.getElementById('telematicsAdoptionRatioValue').textContent = (adoptionRatio * 100).toFixed(0) + '%';

    // Update base yearly premium display with currency
    const baseYearlyPremium = parseFloat(document.getElementById('baseYearlyPremium').value);
    document.getElementById('baseYearlyPremiumValue').textContent = '$' + baseYearlyPremium.toLocaleString();

    // Update discount display as percentage
    const discount = parseFloat(document.getElementById('telematicsDiscount').value);
    document.getElementById('telematicsDiscountValue').textContent = (discount * 100).toFixed(0) + '%';

    // Update base loss rate display as percentage
    const baseLossRate = parseFloat(document.getElementById('baseLossRate').value);
    document.getElementById('baseLossRateValue').textContent = (baseLossRate * 100).toFixed(0) + '%';

    // Update telematics loss rate reduction display as percentage
    const lossRateReduction = parseFloat(document.getElementById('telematicsLossRateReduction').value);
    document.getElementById('telematicsLossRateReductionValue').textContent = (lossRateReduction * 100).toFixed(0) + '%';

    const customerRetentionRate = parseFloat(document.getElementById('customerRetentionRate').value);
    document.getElementById('customerRetentionRateValue').textContent = (customerRetentionRate * 100).toFixed(0) + '%';

    const retentionMultiplier = parseFloat(document.getElementById('customerRetentionRateMultiplierWithTelematics').value);
    document.getElementById('customerRetentionRateMultiplierWithTelematicsValue').textContent = (retentionMultiplier * 100).toFixed(0) + '%';

    const customerAcquisitionCost = parseFloat(document.getElementById('customerAcquisitionCost').value);
    document.getElementById('customerAcquisitionCostValue').textContent = '$' + customerAcquisitionCost.toLocaleString();

    const customerRetentionCostCoef = parseFloat(document.getElementById('customerRetentionCostCoef').value);
    document.getElementById('customerRetentionCostCoefValue').textContent = (customerRetentionCostCoef * 100).toFixed(0) + '%';
}

function handleCalculate() {
    // Get the results from the calculate function
    const results = compute();

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Format percentage
    const formatPercent = (value) => {
        return (value * 100).toFixed(2) + '%';
    };

    // === FOR INSURER - Pay Out Section ===
    document.getElementById('insurerLoss').innerHTML = `
        <div class="result-row">
            <span class="result-label">Without Telematics:</span>
            <span class="result-value">${formatCurrency(results.totalLossWithoutTelematics)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">With Telematics:</span>
            <span class="result-value">${formatCurrency(results.totalLoss)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Savings for Insurer:</span>
            <span class="result-value highlight">${formatCurrency(results.savingsForInsurer)}</span>
        </div>
    `;

    // === Pay Out Rate Metrics - Column 1 ===
    const lossRateWithout = (results.totalLossWithoutTelematics / results.totalRevenueWithoutTelematics);
    const lossRateWith = (results.totalLoss / results.totalRevenue) || 0;
    const lossRateImprovement = lossRateWithout - lossRateWith;

    document.getElementById('insurerLossRates').innerHTML = `
        <div class="result-row">
            <span class="result-label">Pay Out Rate Without Telematics:</span>
            <span class="result-value">${formatPercent(lossRateWithout)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Overall Pay Out Rate:</span>
            <span class="result-value">${formatPercent(lossRateWith)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Reduced Pay Out Rate:</span>
            <span class="result-value highlight-blue">${formatPercent(lossRateImprovement)}</span>
        </div>
    `;

    // === Pay Out Breakdown - Column 2 ===
    document.getElementById('insurerLossBreakdown').innerHTML = `
        <div class="result-row">
            <span class="result-label">Pay Out - Telematics Users:</span>
            <span class="result-value">${formatCurrency(results.lossWithTelematics)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Pay Out - Non-Telematics Users:</span>
            <span class="result-value">${formatCurrency(results.lossWithoutTelematics)}</span>
        </div>
    `;

    // === For Insurer - Revenue Section ===
    document.getElementById('insurerRevenue').innerHTML = `
        <div class="result-row">
            <span class="result-label">Without Telematics:</span>
            <span class="result-value">${formatCurrency(results.totalRevenueWithoutTelematics)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">With Telematics:</span>
            <span class="result-value">${formatCurrency(results.totalRevenue)}</span>
        </div>
    `;

    // Create the stacked bar chart
    createRevenueChart(results, formatCurrency);

    // === FOR INSURED ===
    document.getElementById('insuredResults').innerHTML = `
        <div class="result-row">
            <span class="result-label">Savings for Insured:</span>
            <span class="result-value highlight">${formatCurrency(results.savingsForInsured)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Savings per Person:</span>
            <span class="result-value highlight">${formatCurrency(results.savingsForInsuredPerPerson)} / person</span>
        </div>
    `;
}

function createRevenueChart(results, formatCurrency) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    // Calculate profit and pay out for each scenario, including customer retention/acquisition costs.
    const customerCostWithout = results.totalCustomerCostWithoutTelematics || 0;
    const customerCostWith = results.totalCustomerCost || 0;
    const profitWithout = results.totalRevenueWithoutTelematics - results.totalLossWithoutTelematics - customerCostWithout;
    const lossWithout = results.totalLossWithoutTelematics;
    
    const profitWith = results.totalRevenue - results.totalLoss - customerCostWith;
    const lossWith = results.totalLoss;

    // Destroy existing chart if it exists
    if (revenueChartInstance) {
        revenueChartInstance.destroy();
    }

    revenueChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Without Telematics', 'With Telematics'],
            datasets: [
                {
                    label: 'Pay Out',
                    data: [lossWithout, lossWith],
                    backgroundColor: '#161875',
                    borderRadius: 0,
                    order: 2
                },
                {
                    label: 'Customer Cost',
                    data: [customerCostWithout, customerCostWith],
                    backgroundColor: '#00838f',
                    borderRadius: 0,
                    order: 2
                },
                {
                    label: 'Profit',
                    data: [profitWithout, profitWith],
                    backgroundColor: '#4d50f7',
                    borderRadius: 0,
                    order: 1
                }
            ]
        },
        options: {
            indexAxis: 'y',
            animation: false,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    max: 14000000,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000).toFixed(0) + 'K';
                        }
                    }
                },
                y: {
                    stacked: true
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.x);
                        }
                    }
                }
            }
        }
    });
}
