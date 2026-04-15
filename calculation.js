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
    // source https://www.gpsinsight.com/blog/what-is-the-cost-of-telematics/#elementor-toc__heading-anchor-5
    const telematicsCostPerPersonPerMonth = parseFloat(document.getElementById("telematicsCostPerPersonPerMonth").value) || 15; // range 10 to 200
    const totalTelematicsCost = telematicsCostPerPersonPerMonth * 12 * totalPolicy * telematicsAdoptionRatio;

    // Assumptions for customer retention and acquisition costs
    // source https://docs.google.com/document/d/1fsV6LX3JA2KY1J9TD50rqab8i6Vv8R8C_lWFLoloBfQ/edit?tab=t.0
    const customerRetentionRate = parseFloat(document.getElementById("customerRetentionRate").value) || 0.71; // range 0.0 to 1.0
    // source https://www.insurancethoughtleadership.com/telematics/tech-secret-combined-ratio-below-100#:~:text=While%20large%20personal%20auto%20insurers,surface%20of%20the%20potential%20benefits.&text=KEY%20TAKEAWAY:,20%25%20compared%20with%20traditional%20portfolios.
    const customerRetentionRateMultiplierWithTelematics = parseFloat(document.getElementById("customerRetentionRateMultiplierWithTelematics").value) || 0.2; // interpreted as churn reduction rate, range 0.0 to 1.0
    // source https://www.simplesolve.com/blog/ai-and-insurtech-cutting-customer-acquisition-cost#:~:text=Auto%20insurance%20customer%20acquisition%20costs%20(CAC)%20typically,duration%20to%20manage%20their%20impact%20on%20profitability.
    const customerAcquisitionCost = parseFloat(document.getElementById("customerAcquisitionCost").value) || 0; // range 300 to 800
    // source https://www.marketsandmarkets.com/blog/AT/usage-based-insurance-market-size
    const customerRetentionCostMultiplier = parseFloat(document.getElementById("customerRetentionCostCoef").value) || 0; // range 0.1 to 0.3
    const customerRetentionCost = customerAcquisitionCost * customerRetentionCostMultiplier;
    

    // Apply telematics as a reduction to churn, then convert back to retention.
    const baselineChurnRate = 1 - customerRetentionRate;
    const reducedChurnRateWithTelematics = baselineChurnRate * (1 - customerRetentionRateMultiplierWithTelematics);
    const customerRetentionRateWithTelematics = 1 - reducedChurnRateWithTelematics;
    const telematicsCustomerAmount = totalPolicy * telematicsAdoptionRatio;
    const CustomersWithTelematicsCost = telematicsCustomerAmount * customerRetentionRateWithTelematics * customerRetentionCost + telematicsCustomerAmount * (1 - customerRetentionRateWithTelematics) * customerAcquisitionCost;

    const totalCustomerCostWithoutTelematics = totalPolicy * customerRetentionRate * customerRetentionCost + totalPolicy * (1 - customerRetentionRate) * customerAcquisitionCost;

    const customersWithoutTelematics = totalPolicy * (1 - telematicsAdoptionRatio);
    const CustomersWithoutTelematicsCost = customersWithoutTelematics * customerRetentionRate * customerRetentionCost + customersWithoutTelematics * (1 - customerRetentionRate) * customerAcquisitionCost;
    const totalCustomerCost = CustomersWithTelematicsCost + CustomersWithoutTelematicsCost;
    ; 
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
        totalTelematicsCost,
        savingsForInsured,
        savingsForInsurer,
        savingsForInsuredPerPerson,
        totalCustomerCost,
        totalCustomerCostWithoutTelematics,
        lossWithTelematics,
        lossWithoutTelematics
    };
}

function calculateReducedSpeedingBenefits(totalPolicy, telematicsAdoptionRatio){
    // --- EXTERNAL DATA (sourced) ---
    const P_speeding_baseline = 0.43;           // AAA/NHTSA survey https://www.nhtsa.gov/book/countermeasures-that-work/speeding-and-speed-management
    const totalVMT = 3_263_700_000_000;         // FHWA 2023
    const speedingFatalities = 11_775;          // NHTSA FARS 2023
    const speedingInjuries = 332_598;           // NHTSA FARS 2023
    const speedingVMT = totalVMT * 0.29;
    const speedingReductionRate = 0.75;          // Telematics can reduce speeding time by ~75%
    const P_fatality_given_speeding_perMile = speedingFatalities / speedingVMT;
    const P_injury_given_speeding_perMile = speedingInjuries / speedingVMT;
    const costOfSpeedingCrashes = 46_000_000_000; // https://www.nhtsa.gov/press-releases/traffic-crashes-cost-america-billions-2019#:~:text=The%20report's%20findings%20include:%20*%20The%20$340,to%20wear%20a%20seat%20belt%20*%20Speeding

    // --- YOUR FLEET INPUTS ---
    const totalPolicyHolders = totalPolicy;
    const telematicsAdoptionRate = telematicsAdoptionRatio;           // % who opted in
    const avgMilesPerDriver = 15_000;           // ~US average, adjust if known

    // --- MODEL ---
    const telematicsDrivers    = totalPolicyHolders * telematicsAdoptionRate;
    const nonTelematicsDrivers = totalPolicyHolders * (1 - telematicsAdoptionRate);

    // Counterfactual: ALL drivers at baseline speeding risk (no telematics program)
    const speedingMiles_baseline_all = totalPolicyHolders * avgMilesPerDriver * P_speeding_baseline;

    // Actual: non-tel drivers at baseline, tel drivers at reduced rate
    const speedingMiles_nonTel = nonTelematicsDrivers * avgMilesPerDriver * P_speeding_baseline;
    const speedingMiles_tel    = telematicsDrivers * avgMilesPerDriver * P_speeding_baseline * (1 - speedingReductionRate);
    const speedingMiles_actual = speedingMiles_nonTel + speedingMiles_tel;  // ← add these together

    // Expected fatalities
    const fatalities_counterfactual = speedingMiles_baseline_all * P_fatality_given_speeding_perMile;
    const fatalities_actual         = speedingMiles_actual * P_fatality_given_speeding_perMile;
    const livesSaved                = fatalities_counterfactual - fatalities_actual;  // ← this is the delta

    // Same pattern for injuries
    const injuries_counterfactual = speedingMiles_baseline_all * P_injury_given_speeding_perMile;
    const injuries_actual         = speedingMiles_actual * P_injury_given_speeding_perMile;
    const injuriesPrevented       = injuries_counterfactual - injuries_actual;

    // saved cost from reduced fatalities and injuries
    const costSaved = (livesSaved * costOfSpeedingCrashes / speedingFatalities);

    return {
        livesSaved,
        injuriesPrevented,
        costSaved
    };

}

function calculateReducedDistractionBenefits(totalPolicy, telematicsAdoptionRatio){
    // external data
    const P_distracted_baseline = 0.327;          // https://pmc.ncbi.nlm.nih.gov/articles/PMC4391700/
    const totalVMT = 3_263_700_000_000;           // FHWA 2023
    const distractedFatalities = 3_142;           // NHTSA FARS 2023
    const distractedVMT = totalVMT * P_distracted_baseline;
    const P_fatality_given_distracted_perMile = distractedFatalities / distractedVMT;
    const distractedDrivingReductionRate = 0.20;  // telematics reduce distracted driving by 20%

    // --- YOUR FLEET INPUTS ---
    const totalPolicyHolders = totalPolicy;
    const telematicsAdoptionRate = telematicsAdoptionRatio;
    const avgMilesPerDriver = 15_000;

    // --- MODEL ---
    const telematicsDrivers    = totalPolicyHolders * telematicsAdoptionRate;
    const nonTelematicsDrivers = totalPolicyHolders * (1 - telematicsAdoptionRate);

    // counterfactual: all drivers at baseline distracted risk (no telematics)
    const distractedMiles_baseline_all = totalPolicyHolders * avgMilesPerDriver * P_distracted_baseline;

    // actual: non-tel at baseline, tel at reduced rate
    const distractedMiles_nonTel = nonTelematicsDrivers * avgMilesPerDriver * P_distracted_baseline;
    const distractedMiles_tel    = telematicsDrivers * avgMilesPerDriver * P_distracted_baseline * (1 - distractedDrivingReductionRate);
    const distractedMiles_actual = distractedMiles_nonTel + distractedMiles_tel;

    // lives saved = counterfactual fatalities − actual fatalities
    const livesSaved = (distractedMiles_baseline_all - distractedMiles_actual) * P_fatality_given_distracted_perMile;

    return { livesSaved };
}

function calculateFuelAndEmissionBenefits(totalPolicy, telematicsAdoptionRatio) {
    // --- EXTERNAL DATA (fill in with your research) ---
    const avgFuelEconomy_baseline_MPG = 27.1;    // car average MPG
    const fuelEconomyPenalty = 0.15;             // MIT: 0.15 (conservative) to 0.30 (upper bound) https://cabadvantage.com/how-telematics-boosts-safety-and-savings-for-motor-carriers-and-insurers/#:~:text=Enhancing%20Fleet%20Management-,1.,and%20reduce%20their%20insurance%20premiums
    const gasPricePerGallon = 4.00;              //
    const CO2_per_gallon_kg = 8.89;             // EPA constant, gasoline — https://www.epa.gov/energy/greenhouse-gases-equivalencies-calculator-calculations-and-references
    const P_aggressive_driver = 0.43;            // reused from speeding function (AAA/NHTSA)

    // --- YOUR FLEET INPUTS ---
    const totalPolicyHolders = totalPolicy;
    const telematicsAdoptionRate = telematicsAdoptionRatio;
    const avgMilesPerDriver = 15_000;            // US average

    // --- MODEL ---
    const telematicsDrivers = totalPolicyHolders * telematicsAdoptionRate;

    // fuel economy for aggressive drivers is penalized
    const avgFuelEconomy_aggressive_MPG = avgFuelEconomy_baseline_MPG * (1 - fuelEconomyPenalty);

    // gallons used per driver per year — normal vs aggressive
    const gallonsPerDriver_baseline   = avgMilesPerDriver / avgFuelEconomy_baseline_MPG;
    const gallonsPerDriver_aggressive = avgMilesPerDriver / avgFuelEconomy_aggressive_MPG;

    // extra gallons wasted per aggressive driver that telematics recovers
    const extraGallonsWasted = gallonsPerDriver_aggressive - gallonsPerDriver_baseline;

    // fuel saved = only the aggressive subset of telematics drivers benefit
    const fuelSaved_gallons = telematicsDrivers * P_aggressive_driver * extraGallonsWasted;

    // cost saved
    const costSaved = fuelSaved_gallons * gasPricePerGallon;

    // CO2 emissions reduced
    const CO2_saved_kg     = fuelSaved_gallons * CO2_per_gallon_kg;
    const CO2_saved_tonnes = CO2_saved_kg / 1000;

    return {
        fuelSaved_gallons,
        costSaved,
        CO2_saved_tonnes
    };
}
