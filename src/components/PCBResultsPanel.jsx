import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getNonTaxableThreshold } from '../utils/pcbCalculator'

function fmt(value) {
  return new Intl.NumberFormat('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

function ResultCard({ icon, label, value, highlight, warn }) {
  const base = highlight
    ? 'bg-green-600 text-white'
    : warn
    ? 'bg-amber-50 border border-amber-200 text-gray-800'
    : 'bg-green-50 text-gray-800'
  return (
    <div className={`rounded-xl p-4 ${base}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${highlight ? 'text-green-100' : 'text-gray-500'}`}>
        {icon} {label}
      </p>
      <p className={`text-xl font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>
        RM {fmt(value)}
      </p>
    </div>
  )
}

function BreakdownRow({ item, t }) {
  const label = item.n !== undefined
    ? t(item.key, { n: item.n })
    : t(item.key)

  return (
    <div className={`flex items-center justify-between py-1.5 text-sm ${item.isSeparator ? 'border-t border-gray-200 mt-1 pt-2.5' : ''}`}>
      <span className={`${item.isBold ? 'font-bold text-gray-900' : 'text-gray-600'} ${item.isDeduction ? 'pl-4' : ''}`}>
        {label}
      </span>
      <span className={`font-semibold tabular-nums ${item.isBold ? 'text-green-700' : item.isDeduction ? 'text-red-500' : 'text-gray-700'}`}>
        {item.isDeduction ? '−' : ''} RM {fmt(item.value)}
      </span>
    </div>
  )
}

export default function PCBResultsPanel({ result, inputs }) {
  const { t } = useTranslation()
  const [showBreakdown, setShowBreakdown] = useState(false)

  const threshold = getNonTaxableThreshold(inputs.taxCategory, inputs.numberOfChildren)
  const salary = parseFloat(inputs.monthlySalary) || 0
  const monthlyGross = salary + (parseFloat(inputs.fixedAllowance) || 0)
  const isBelow = result.belowThreshold || result.monthlyPCB === 0

  return (
    <div className="space-y-4">

      {/* Non-resident notice */}
      {!inputs.isMalaysianCitizen && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-800 font-medium">
          ⚠️ {t('result.nonresident_note')}
        </div>
      )}

      {/* Threshold notice */}
      {isBelow && inputs.isMalaysianCitizen && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <p className="text-sm font-semibold text-green-700">✅ {t('result.below_threshold')}</p>
          <p className="text-xs text-green-600 mt-0.5">
            {t('result.threshold_notice')}: RM {fmt(threshold.monthly)} /month (RM {fmt(threshold.annual)} /year)
          </p>
        </div>
      )}

      {/* Result cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <ResultCard icon="💰" label={t('result.monthly_pcb')} value={result.monthlyPCB} highlight />
        <ResultCard icon="🏦" label={t('result.epf')} value={result.epfMonthly} />
        <ResultCard icon="🛡️" label={t('result.socso')} value={result.socso} />
        <ResultCard icon="📋" label={t('result.eis')} value={result.eis} />
        <ResultCard icon="📊" label={t('result.chargeable')} value={result.chargeableIncome} />
        <ResultCard icon="🏠" label={t('result.net_salary')} value={result.netSalary} warn />
      </div>

      {result.monthlyPCB === 0 && !isBelow && (
        <p className="text-xs text-gray-400 text-center">{t('result.pcb_min_rule')}</p>
      )}

      {/* Collapsible breakdown */}
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowBreakdown(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
        >
          <span>📐 {t('result.breakdown_title')}</span>
          <span className="text-gray-400 text-xs">{showBreakdown ? '▲ ' + t('result.hide_breakdown') : '▼ ' + t('result.show_breakdown')}</span>
        </button>
        {showBreakdown && (
          <div className="px-4 pb-4 pt-1 divide-y divide-gray-50">
            {result.breakdown.map((item, i) => (
              <BreakdownRow key={i} item={item} t={t} />
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        ⚠️ {t('savings.disclaimer')}
      </p>
    </div>
  )
}
