export const RHYTHM_PAPERS = [
  { author: "Zeevi et al.", year: "2015", journal: "Cell", topic: "Personalised nutrition", finding: "800 participants. 46,898 meals.", takeaway: "The same food does not affect everyone in exactly the same way.", detail: "Researchers observed considerable differences in people's sugar responses to meals.", url: "https://pubmed.ncbi.nlm.nih.gov/26590418/" },
  { author: "Berry et al.", year: "2020", journal: "Nature Medicine", topic: "Individual food responses", finding: "1,002 participants.", takeaway: "Your body's response to food is personal.", detail: "Identical meals produced different metabolic responses in different people.", url: "https://www.nature.com/articles/s41591-020-0934-0" },
  { author: "Reynolds et al.", year: "2016", journal: "Diabetologia", topic: "Movement after meals", finding: "Studied adults with type 2 diabetes.", takeaway: "A short walk after meals can be a useful habit.", detail: "Post-meal walking improved sugar control in this specific clinical population; results are not a promise for every wearer.", url: "https://pubmed.ncbi.nlm.nih.gov/27747394/" },
  { author: "Gardner et al.", year: "2018", journal: "JAMA", topic: "Food quality and diet", finding: "609 participants.", takeaway: "Neither tested diet was clearly better on average.", detail: "The healthy low-fat and healthy low-carbohydrate groups did not differ significantly in average weight loss at 12 months.", url: "https://pubmed.ncbi.nlm.nih.gov/29466592/" },
  { author: "Bannuru et al.", year: "2025", journal: "Journal of Diabetes Science and Technology", topic: "Feedback and lifestyle education", finding: "21 trials. 2,734 adults with type 2 diabetes.", takeaway: "Useful feedback can support daily decisions.", detail: "This review studied CGM combined with nutrition or lifestyle education, not non-invasive wearables or Rhythm Band.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12536011/" },
] as const;

export const RHYTHM_COHORTS = [
  {
    device: "Apple Watch", users: 145, observations: 19379, meals: 3401,
    period: "30 May – 3 September 2026",
    source: "Apple Watch manuscript · Structured Abstract, Results and Discussion",
    mealRise: { positive: 206, total: 333, percent: 61.9 },
    recovery: { positive: 272, total: 298, percent: 91.3 },
    shiftedMealRise: { positive: 200, total: 323, percent: 61.9 },
    transitions: { rise: 5747, fall: 5715, stable: 5694, total: 17156 },
    carbohydrateCorrelation: -0.18,
    interpretation: "The meal-rise proportion stayed at 61.9% when alignment was shifted by 30 minutes.",
  },
  {
    device: "EasyTouch Rhythm Band", users: 128, observations: 83090, meals: 3190,
    period: "31 May – 4 September 2026",
    source: "Rhythm Band manuscript · Structured Abstract, Results and Discussion",
    mealRise: { positive: 1395, total: 2108, percent: 66.2 },
    recovery: { positive: 1596, total: 2046, percent: 78.0 },
    shiftedMealRise: { positive: 1349, total: 2124, percent: 63.5 },
    transitions: { rise: 23539, fall: 23864, stable: 31072, total: 78475 },
    carbohydrateCorrelation: 0.03,
    interpretation: "A majority of evaluable meals showed an upward trend in both alignments: 66.2% initially and 63.5% after a 30-minute shift.",
  },
] as const;