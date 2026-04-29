import { useTranslation } from 'react-i18next'
import { calculateTaxSavings } from '../utils/pcbCalculator'

function formatRM(value) {
  return new Intl.NumberFormat('ms-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function SavingsSummary({ reliefs, chargeableIncome, annualIncome }) {
  const { t } = useTranslation()

  const checkedReliefs = reliefs.filter(r => r.checked && parseFloat(r.amount || 0) > 0)

  const totalRelief = checkedReliefs.reduce((sum, r) => {
    const val = r.effectiveAmount ?? parseFloat(r.amount || 0)
    return sum + Math.min(val, r.annualCap ?? Infinity)
  }, 0)

  const zakatRelief = checkedReliefs
    .filter(r => r.isZakat)
    .reduce((sum, r) => sum + (r.effectiveAmount ?? parseFloat(r.amount || 0)), 0)

  const { annualSaving, monthlySaving, marginalRate } = calculateTaxSavings(
    chargeableIncome,
    totalRelief,
    zakatRelief,
    annualIncome
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-5">{t('savings.title')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          label={t('savings.total_relief')}
          value={`RM ${formatRM(totalRelief)}`}
          secondary
        />
        <SummaryCard
          label={t('savings.annual_saving')}
          value={`RM ${formatRM(annualSaving)}`}
          highlight
        />
        <SummaryCard
          label={t('savings.monthly_saving')}
          value={`RM ${formatRM(monthlySaving)}`}
          secondary
        />
      </div>

      {marginalRate > 0 && (
        <div className="flex items-center gap-2 mb-5 text-sm text-gray-500">
          <span>{t('savings.marginal_rate')}:</span>
          <span className="font-bold text-green-700">{(marginalRate * 100).toFixed(1)}%</span>
        </div>
      )}

      <div className="border-t border-gray-100 pt-5">
        <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">
          {t('savings.breakdown')}
        </h3>
        {checkedReliefs.length === 0 ? (
          <p className="text-sm text-gray-400 italic">{t('savings.no_reliefs')}</p>
        ) : (
          <ul className="space-y-2">
            {checkedReliefs.map(r => {
              const effectiveVal = r.effectiveAmount ?? parseFloat(r.amount || 0)
              const capped = r.annualCap !== null ? Math.min(effectiveVal, r.annualCap) : effectiveVal
              return (
                <li key={r.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    {r.icon} {t(r.labelKey)}
                    {r.isZakat && (
                      <span className="ml-2 text-xs text-purple-600 font-semibold">(Rebat)</span>
                    )}
                  </span>
                  <span className="font-semibold text-gray-800">RM {formatRM(capped)}</span>
                </li>
              )
            })}
            <li className="flex items-center justify-between text-sm font-bold border-t border-dashed border-gray-200 pt-2 mt-2">
              <span className="text-gray-800">Total</span>
              <span className="text-green-700">RM {formatRM(totalRelief)}</span>
            </li>
          </ul>
        )}
      </div>

      <div className="mt-5 space-y-2">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
          📋 {t('savings.audit_notice')}
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-500">
          ⚠️ {t('savings.disclaimer')}
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, highlight, secondary }) {
  if (highlight) {
    return (
      <div className="rounded-xl bg-green-600 text-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-100 mb-1">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    )
  }
  return (
    <div className="rounded-xl bg-green-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  )
}
