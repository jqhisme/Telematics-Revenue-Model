// a model for calculating the savings for both the insured and insurer 
// in a Car Telematics insurance policy/Usage based insurance model

function compute(){
    
    // Main Values for Model Input
    const totalPolicy = parseFloat(document.getElementById("totalPolicy").value) || 0; //range 1 - 5,000
    const telematicsAdoptionRatio = parseFloat(document.getElementById("telematicsAdoptionRatio").value) || 0; // range 0.0 to 1.0
    const baseYearlyPremium = parseFloat(document.getElementById("baseYearlyPremium").value) || 0; // range 500 to 5000
    const telematicsDiscount = parseFloat(document.getElementById("telematicsDiscount").value) || 0; // range 0.05 to 0.5

    // Values from Assumptions
    const baseLossRate = parseFloat(document.getElementById("baseLossRate").value) || 0.71;
    const telematicsLossRateReduction = parseFloat(document.getElementById("telematicsLossRateReduction").value) || 0.2;

    // Assumptions for customer retention and acquisition costs
    // source https://docs.google.com/document/d/1fsV6LX3JA2KY1J9TD50rqab8i6Vv8R8C_lWFLoloBfQ/edit?tab=t.0
    const customerRetentionRate = parseFloat(document.getElementById("customerRetentionRate").value) || 0.71; // range 0.0 to 1.0
    // source https://www.insurancethoughtleadership.com/telematics/tech-secret-combined-ratio-below-100#:~:text=While%20large%20personal%20auto%20insurers,surface%20of%20the%20potential%20benefits.&text=KEY%20TAKEAWAY:,20%25%20compared%20with%20traditional%20portfolios.
    const customerRetentionRateMultiplierWithTelematics = parseFloat(document.getElementById("customerRetentionRateMultiplierWithTelematics").value) || 0.2; // range 0.0 to 1.0
    // source https://www.simplesolve.com/blog/ai-and-insurtech-cutting-customer-acquisition-cost#:~:text=Auto%20insurance%20customer%20acquisition%20costs%20(CAC)%20typically,duration%20to%20manage%20their%20impact%20on%20profitability.
    const customerAcquisitionCost = parseFloat(document.getElementById("customerAcquisitionCost").value) || 0; // range 300 to 800
    // source https://www.marketsandmarkets.com/blog/AT/usage-based-insurance-market-size
    const customerRetentionCostMultiplier = parseFloat(document.getElementById("customerRetentionCostCoef").value) || 0; // range 0.1 to 0.3
    const customerRetentionCost = customerAcquisitionCost * customerRetentionCostMultiplier;

    // for the customers who adopted telematics, we assume they follow the reduced churn rate. 
    const customerRetentionRateWithTelematics = customerRetentionRate * customerRetentionRateMultiplierWithTelematics;
    const telematicsCustomerAmount = totalPolicy * telematicsAdoptionRatio;
    const CustomersWithTelematicsCost = telematicsCustomerAmount * customerRetentionRateWithTelematics * customerRetentionCost + telematicsCustomerAmount * (1 - customerRetentionRateWithTelematics) * customerAcquisitionCost;

    const totalCustomerCostWithoutTelematics = totalPolicy * customerRetentionRate * customerRetentionCost + totalPolicy * (1 - customerRetentionRate) * customerAcquisitionCost;

    const customersWithoutTelematics = totalPolicy * (1 - telematicsAdoptionRatio);
    const CustomersWithoutTelematicsCost = customersWithoutTelematics * customerRetentionRate * customerRetentionCost + customersWithoutTelematics * (1 - customerRetentionRate) * customerAcquisitionCost;
    const totalCustomerCost = CustomersWithTelematicsCost + CustomersWithoutTelematicsCost;

    // Calculate the loss and revenue if not using telematics
    const totalLossWithoutTelematics = totalPolicy * baseYearlyPremium * baseLossRate;
    const totalRevenueWithoutTelematics = totalPolicy * baseYearlyPremium;

    // Calculate the loss and revenue if using telematics
    const lossWithTelematics = totalPolicy * telematicsAdoptionRatio * baseYearlyPremium * (1 - telematicsDiscount) * (baseLossRate - telematicsLossRateReduction);
    const lossWithoutTelematics = totalPolicy * (1 - telematicsAdoptionRatio) * baseYearlyPremium * baseLossRate;
    const totalLoss = lossWithTelematics + lossWithoutTelematics;
    const totalRevenue = totalPolicy * telematicsAdoptionRatio * baseYearlyPremium * (1 - telematicsDiscount) + totalPolicy * (1 - telematicsAdoptionRatio) * baseYearlyPremium;

    // Calculate the savings for both the insured and insurer
    const savingsForInsured = totalRevenueWithoutTelematics - totalRevenue;
    const savingsForInsurer = totalLossWithoutTelematics - totalLoss;
    const savingsForInsuredPerPerson = totalPolicy > 0 ? savingsForInsured / totalPolicy : 0;

    // Return results object
    return {
        totalRevenueWithoutTelematics,
        totalLossWithoutTelematics,
        totalRevenue,
        totalLoss,
        savingsForInsured,
        savingsForInsurer,
        savingsForInsuredPerPerson,
        totalCustomerCost,
        totalCustomerCostWithoutTelematics,
        lossWithTelematics,
        lossWithoutTelematics
    };
}