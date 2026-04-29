const TAX_BRACKETS = [
  { min: 0,      max: 5000,    rate: 0,     base: 0 },
  { min: 5001,   max: 20000,   rate: 0.01,  base: 0 },
  { min: 20001,  max: 35000,   rate: 0.03,  base: 150 },
  { min: 35001,  max: 50000,   rate: 0.06,  base: 600 },
  { min: 50001,  max: 70000,   rate: 0.11,  base: 1500 },
  { min: 70001,  max: 100000,  rate: 0.19,  base: 3700 },
  { min: 100001, max: 250000,  rate: 0.24,  base: 9400 },
  { min: 250001, max: 400000,  rate: 0.245, base: 45400 },
  { min: 400001, max: Infinity, rate: 0.28, base: 82150 },
]

// LHDN non-taxable thresholds by [taxCategory][children]
const THRESHOLDS = {
  1: { 0: { annual: 37333, monthly: 3111 }, 1: { annual: 39333, monthly: 3278 }, 2: { annual: 41333, monthly: 3444 } },
  2: { 0: { annual: 37333, monthly: 3111 }, 1: { annual: 39333, monthly: 3278 }, 2: { annual: 41333, monthly: 3444 } },
  3: { 0: { annual: 48000, monthly: 4000 }, 1: { annual: 50000, monthly: 4167 }, 2: { annual: 52000, monthly: 4333 } },
}

function applyBrackets(income) {
  if (income <= 0) return 0
  for (const b of TAX_BRACKETS) {
    if (income <= b.max) {
      return b.base + (income - b.min + 1) * b.rate
    }
  }
  return 0
}

export function getMarginalRate(chargeableIncome) {
  if (chargeableIncome <= 0) return 0
  for (const b of TAX_BRACKETS) {
    if (chargeableIncome <= b.max) return b.rate
  }
  return TAX_BRACKETS[TAX_BRACKETS.length - 1].rate
}

export function getNonTaxableThreshold(taxCategory, children) {
  const cat = THRESHOLDS[taxCategory] ?? THRESHOLDS[1]
  const clampedChildren = Math.min(children, 2)
  return cat[clampedChildren] ?? cat[0]
}

export function calculatePCB(inputs = {}) {
  const {
    monthlySalary = 0,
    fixedAllowance = 0,
    bonus = 0,
    taxCategory = 1,
    isMalaysianCitizen = true,
    isBelow60 = true,
    numberOfChildren = 0,
    epfRate = 0.11,
    socsoCategory = 1,
    hasEIS = true,
    zakatMonthly = 0,
    tp1Amount = 0,
  } = inputs

  const salary = parseFloat(monthlySalary) || 0
  const allowance = parseFloat(fixedAllowance) || 0
  const bonusAmt = parseFloat(bonus) || 0
  const children = parseInt(numberOfChildren) || 0
  const zakat = parseFloat(zakatMonthly) || 0
  const tp1 = parseFloat(tp1Amount) || 0
  const rate = parseFloat(epfRate) || 0.11

  const monthlyGross = salary + allowance
  const annualGross = monthlyGross * 12 + bonusAmt

  // SOCSO & EIS (estimate per PERKESO)
  const socsoCappedWage = Math.min(salary, 6000)
  const socso = socsoCategory === 1 ? socsoCappedWage * 0.0175 : 0
  const eis = (hasEIS && socsoCategory === 1) ? socsoCappedWage * 0.004 : 0

  // EPF (on basic salary only, not allowances)
  const epfMonthly = salary * rate
  const epfAnnual = epfMonthly * 12

  // Non-resident: flat 30%, no reliefs
  if (!isMalaysianCitizen) {
    const monthlyPCB = monthlyGross * 0.3
    const netSalary = monthlyGross - monthlyPCB - socso - eis
    return {
      monthlyPCB,
      annualTax: annualGross * 0.3,
      chargeableIncome: annualGross,
      epfMonthly: 0,
      socso,
      eis,
      netSalary,
      belowThreshold: false,
      breakdown: [
        { key: 'breakdown.annual_gross', value: annualGross },
        { key: 'breakdown.flat_rate', value: annualGross * 0.3, isBold: true },
        { key: 'breakdown.monthly_pcb', value: monthlyPCB, isBold: true },
      ],
    }
  }

  // Standard reliefs
  const personalRelief = 9000
  const spouseRelief = taxCategory === 3 ? 4000 : 0
  const childRelief = children * 2000
  const tp1Annual = tp1 * 12
  const zakatAnnual = zakat * 12

  const chargeableIncome = Math.max(0,
    annualGross - epfAnnual - personalRelief - spouseRelief - childRelief - tp1Annual
  )

  const taxBeforeRebate = applyBrackets(chargeableIncome)

  // Rebates (only if chargeable income ≤ RM35,000)
  const selfRebate = chargeableIncome <= 35000 ? 400 : 0
  const spouseRebate = (taxCategory === 3 && chargeableIncome <= 35000) ? 400 : 0
  const zakatRebate = Math.min(zakatAnnual, Math.max(0, taxBeforeRebate - selfRebate - spouseRebate))

  const annualTax = Math.max(0, taxBeforeRebate - selfRebate - spouseRebate - zakatRebate)

  let monthlyPCB = annualTax / 12
  if (monthlyPCB < 10) monthlyPCB = 0

  const netSalary = monthlyGross - monthlyPCB - epfMonthly - socso - eis

  // Threshold check
  const threshold = getNonTaxableThreshold(taxCategory, children)
  const belowThreshold = salary < threshold.monthly

  // Step-by-step breakdown (labels are i18n keys, data is passed separately)
  const breakdown = [
    { key: 'breakdown.annual_gross', value: annualGross },
    { key: 'breakdown.less_epf', value: epfAnnual, isDeduction: true },
    { key: 'breakdown.less_personal', value: personalRelief, isDeduction: true },
    spouseRelief > 0 && { key: 'breakdown.less_spouse', value: spouseRelief, isDeduction: true },
    childRelief > 0 && { key: 'breakdown.less_child', value: childRelief, isDeduction: true, n: children },
    tp1Annual > 0 && { key: 'breakdown.less_tp1', value: tp1Annual, isDeduction: true },
    { key: 'breakdown.chargeable', value: chargeableIncome, isBold: true, isSeparator: true },
    { key: 'breakdown.tax_on_income', value: taxBeforeRebate },
    selfRebate > 0 && { key: 'breakdown.less_self_rebate', value: selfRebate, isDeduction: true },
    spouseRebate > 0 && { key: 'breakdown.less_spouse_rebate', value: spouseRebate, isDeduction: true },
    zakatRebate > 0 && { key: 'breakdown.less_zakat', value: zakatRebate, isDeduction: true },
    { key: 'breakdown.annual_tax', value: annualTax, isBold: true, isSeparator: true },
    { key: 'breakdown.monthly_pcb', value: monthlyPCB, isBold: true },
  ].filter(Boolean)

  return {
    monthlyPCB,
    annualTax,
    chargeableIncome,
    epfMonthly,
    socso,
    eis,
    netSalary,
    belowThreshold,
    breakdown,
  }
}

export function calculateTaxSavings(chargeableIncome, totalRelief, zakatAmount, annualIncome) {
  const marginalRate = getMarginalRate(chargeableIncome)
  const incomeRelief = totalRelief - zakatAmount
  const cappedIncomeRelief = Math.min(incomeRelief, chargeableIncome)
  const reducedChargeable = Math.max(0, chargeableIncome - cappedIncomeRelief)
  const taxAfterRelief = applyBrackets(reducedChargeable)
  const taxBefore = applyBrackets(chargeableIncome)
  const savingFromRelief = taxBefore - taxAfterRelief
  const savingFromZakat = Math.min(zakatAmount, taxAfterRelief)
  const annualSaving = savingFromRelief + savingFromZakat
  return { annualSaving, monthlySaving: annualSaving / 12, marginalRate }
}
