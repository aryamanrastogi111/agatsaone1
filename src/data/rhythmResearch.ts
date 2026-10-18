export const RHYTHM_PAPERS = [
  { author: "Zeevi et al.", year: "2015", journal: "Cell", topic: "Personalised nutrition", finding: "800 participants. 46,898 meals.", takeaway: "The same food does not affect everyone in exactly the same way.", detail: "Researchers observed considerable differences in people's sugar responses to meals.", url: "https://pubmed.ncbi.nlm.nih.gov/26590418/" },
  { author: "Berry et al.", year: "2020", journal: "Nature Medicine", topic: "Individual food responses", finding: "1,002 participants.", takeaway: "Your body's response to food is personal.", detail: "Identical meals produced different metabolic responses in different people.", url: "https://www.nature.com/articles/s41591-020-0934-0" },
  { author: "Reynolds et al.", year: "2016", journal: "Diabetologia", topic: "Movement after meals", finding: "Studied adults with type 2 diabetes.", takeaway: "A short walk after meals can be a useful habit.", detail: "Post-meal walking improved sugar control in this specific clinical population; results are not a promise for every wearer.", url: "https://pubmed.ncbi.nlm.nih.gov/27747394/" },
  { author: "Gardner et al.", year: "2018", journal: "JAMA", topic: "Food quality and diet", finding: "609 participants.", takeaway: "Neither tested diet was clearly better on average.", detail: "The healthy low-fat and healthy low-carbohydrate groups did not differ significantly in average weight loss at 12 months.", url: "https://pubmed.ncbi.nlm.nih.gov/29466592/" },
  { author: "Bannuru et al.", year: "2025", journal: "Journal of Diabetes Science and Technology", topic: "Feedback and lifestyle education", finding: "21 trials. 2,734 adults with type 2 diabetes.", takeaway: "Useful feedback can support daily decisions.", detail: "This review studied CGM combined with nutrition or lifestyle education, not non-invasive wearables or Rhythm Band.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12536011/" },
] as const;

export const RHYTHM_COHORTS = [
  { device: "Apple Watch", users: 145, observations: 19379 },
  { device: "EasyTouch Rhythm Band", users: 128, observations: 83090 },
  { device: "Samsung Galaxy Watch", users: 28, observations: 2939 },
] as const;