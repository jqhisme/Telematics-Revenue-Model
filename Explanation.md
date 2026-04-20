# Speeding Calculation
 const P_speeding_baseline = 0.43;           // AAA/NHTSA survey https://www.nhtsa.gov/book/countermeasures-that-work/speeding-and-speed-management

const totalVMT = 3_263_700_000_000;         // FHWA 2023
https://enotrans.org/article/vmt-back-to-pre-covid-level-in-2023-but-still-lags-per-capita/

const speedingFatalities = 11_775;          // NHTSA FARS 2023
https://trid.trb.org/View/2571871

const speedingInjuries = 332_598;           // NHTSA FARS 2023
https://trid.trb.org/View/2571871

const speedingVMT = totalVMT * 0.29; \
0.29 is estimated from  https://www.iihs.org/research-areas/fatality-statistics/detail/yearly-snapshot#speeding

average mile per driver  = 15000
https://www.fhwa.dot.gov/ohim/onh00/bar8.htm


## FAQ
Why the saved lives value is so small?
In 2023, there were approximately 284.6 to 285 million registered motor vehicles in the United States. If we assume each policy correspond to vehicle, it is a extremely small portion.

## Input Range and Source Notes

- Total Policies is modeled in millions, with range 1.0M to 10.0M and default 4.5M.
	- Calculated based on insurance companies' reported written premiums and average policy price:
		- https://www.cnbc.com/select/largest-car-insurance-companies/#_7-liberty-mutual
		- https://www.thezebra.com/resources/research/insurance-statistics/#state
- Telematics Adoption Rate default is 63%.
	- Source: https://newsroom.transunion.com/inflation-drives-33-surge-in-auto-telematics-adoption-in-first-quarter-of-2022/
- Base Yearly Premium range is $900 to $5,000.
	- Source: https://www.thezebra.com/resources/research/insurance-statistics/
- Telematics Discount range is 1% to 80%, with default 10%.
	- Initial discount is typically around 10% to 15% and can go as high as 30% upon renewal.
	- Source: https://advisorsinsuranceagency.com/blog/telematics-is-it-worth-it

## Scaling Notes

- Because policy volume is now in millions, insurer-side totals can reach very large values.
- Result displays and chart axis labels are formatted to compact values (for example, M and B) for readability.

