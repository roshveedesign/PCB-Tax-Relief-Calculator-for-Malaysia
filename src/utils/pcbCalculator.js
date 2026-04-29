const TAX_BRACKETS = [
  { min: 0,       max: 5000,    rate: 0,     base: 0 },
  { min: 5001,    max: 20000,   rate: 0.01,  base: 0 },
  { min: 20001,   max: 35000,   rate: 0.03,  base: 150 },
  { min: 35001,   max: 50000,   rate: 0.06,  base: 600 },
  { min: 50001,   max: 70000,   rate: 0.11,  base: 1500 },
  { min: 70001,   max: 100000,  rate: 0.19,  base: 3700 },
  { min: 100001,  max: 250000,  rate: 0.24,  base: 9400 },
  { min: 250001,  max: 400000,  rate: 0.245, base: 45400 },
  { min: 400001,  max: Infinity, rate: 0.28, base: 82150 },
]

const PERSONAL_RELIEF = 9000
const EPF_RATE = 0.11
const EPF_WAGE_CEILING = 88000
const TAXABLE_THRESHOLD_MONTHLY = 3111

function applyBrackets(chargeableIncome) {
  if (chargeableIncome <= 0) return 0
  for (const bracket of TAX_BRACKETS) {
    if (chargeableIncome <= bracket.max) {
      return bracket.base + (chargeableIncome - bracket.min + 1) * bracket.rate
    }
  }
  return 0
}

export function getMarginalRate(chargeableIncome) {
  if (chargeableIncome <= 0) return 0
  for (const bracket of TAX_BRACKETS) {
    if (chargeableIncome <= bracket.max) return bracket.rate
  }
  return TAX_BRACKETS[TAX_BRACKETS.length - 1].rate
}

export function calculatePCB(monthlySalary) {
  const salary = parseFloat(monthlySalary) || 0

  if (salary < TAXABLE_THRESHOLD_MONTHLY) {
    return {
      annualTax: 0,
      monthlyPCB: 0,
      chargeableIncome: 0,
      epfDeduction: 0,
      belowThreshold: true,
    }
  }

  const annualSalary = salary * 12
  const epfDeduction = Math.min(annualSalary * EPF_RATE, EPF_WAGE_CEILING * EPF_RATE)
  const chargeableIncome = Math.max(0, annualSalary - epfDeduction - PERSONAL_RELIEF)
  const annualTax = applyBrackets(chargeableIncome)
  const monthlyPCB = annualTax / 12

  return {
    annualTax,
    monthlyPCB,
    chargeableIncome,
    epfDeduction,
    belowThreshold: false,
  }
}

export function calculateTaxSavings(chargeableIncome, totalRelief, zakatAmount, annualIncome) {
  const marginalRate = getMarginalRate(chargeableIncome)

  // Zakat is a 1:1 rebate off tax payable, others reduce chargeable income
  const incomeRelief = totalRelief - zakatAmount
  const donationsCap = annualIncome * 0.1
  const cappedIncomeRelief = Math.min(incomeRelief, chargeableIncome)

  const reducedChargeable = Math.max(0, chargeableIncome - cappedIncomeRelief)
  const taxAfterRelief = applyBrackets(reducedChargeable)
  const taxBefore = applyBrackets(chargeableIncome)

  const savingFromRelief = taxBefore - taxAfterRelief
  const savingFromZakat = Math.min(zakatAmount, taxAfterRelief)
  const annualSaving = savingFromRelief + savingFromZakat

  return {
    annualSaving,
    monthlySaving: annualSaving / 12,
    marginalRate,
  }
}
