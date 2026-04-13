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