import { useTranslation } from 'react-i18next'
import { calculatePCB } from '../utils/pcbCalculator'

function formatRM(value) {
  return new Intl.NumberFormat('ms-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function SalaryPanel({ salary, onSalaryChange }) {
  const { t } = useTranslation()
  const pcb = calculatePCB(salary)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mb-6">
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          {t('salary.label')}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">RM</span>
          <input
            type="number"
            min="0"
            step="100"
            value={salary}
            onChange={e => onSalaryChange(e.target.value)}
            placeholder={t('salary.placeholder')}
            className="w-full pl-14 pr-4 py-3.5 rounded-xl border border-gray-200 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition placeholder-gray-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label={t('pcb.label')}
          value={pcb.belowThreshold ? '—' : `RM ${formatRM(pcb.monthlyPCB)}`}
          sub={pcb.belowThreshold ? t('pcb.below_threshold') : null}
          highlight
        />
        <StatCard
          label={t('epf.label')}
          value={pcb.epfDeduction > 0 ? `RM ${formatRM(pcb.epfDeduction / 12)}` : '—'}
          sub={pcb.epfDeduction > 0 ? `RM ${formatRM(pcb.epfDeduction)} / year` : null}
        />
        <StatCard
          label={t('pcb.chargeable')}
          value={pcb.chargeableIncome > 0 ? `RM ${formatRM(pcb.chargeableIncome)}` : '—'}
        />
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, highlight }) {
  return (
    <div className={`rounded-xl p-4 ${highlight ? 'bg-green-600 text-white' : 'bg-green-50 text-gray-700'}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${highlight ? 'text-green-100' : 'text-gray-500'}`}>
        {label}
      </p>
      <p className={`text-xl font-bold ${highlight ? 'text-white' : 'text-gray-800'}`}>{value}</p>
      {sub && (
        <p className={`text-xs mt-0.5 ${highlight ? 'text-green-200' : 'text-gray-400'}`}>{sub}</p>
      )}
    </div>
  )
}
