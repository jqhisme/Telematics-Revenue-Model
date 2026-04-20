I want to edit my range for the following items
```
const totalPolicy = parseFloat(document.getElementById("totalPolicy").value) || 0; //range 1 - 5,000
const telematicsAdoptionRatio = parseFloat(document.getElementById("telematicsAdoptionRatio").value) || 0; // range 0.0 to 1.0
const baseYearlyPremium = parseFloat(document.getElementById("baseYearlyPremium").value) || 0; // range 500 to 5000
const telematicsDiscount = parseFloat(document.getElementById("telematicsDiscount").value) || 0; // range 0.05 to 0.5
```

For total policy, I want the range to be from 1-10 but the unit should be in million. The default should be 4.5. Write the following as sources. *calcuated based on insurance companies' reported written premiums [source](https://www.cnbc.com/select/largest-car-insurance-companies/#_7-liberty-mutual), and average policy price [source](https://www.thezebra.com/resources/research/insurance-statistics/#state)*

for baseYearlyPremium, use range 900 to 5000, also use this as source
 [source](https://www.thezebra.com/resources/research/insurance-statistics/)

for telematics adoption ratio, make the default 0.63 and cite this as source https://newsroom.transunion.com/inflation-drives-33-surge-in-auto-telematics-adoption-in-first-quarter-of-2022/

for telematics discount, make 0.1 as default, make range from 0.01 to 0.8. cite this as source https://advisorsinsuranceagency.com/blog/telematics-is-it-worth-it
In the explanation, mention that the the initial discount is typical from 10% to 15%, and the discount can go up as high as 30% upon renewal


Since the totalPolicy is being increased a lot . please revisit the rest of the data to see if some of them may grow to big thus use million/billion instead of using raw numbers. Also, the range of the y axis in the graph will definitely change.
