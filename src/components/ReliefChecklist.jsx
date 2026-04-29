import { useTranslation } from 'react-i18next'

const GROUP_ORDER = ['lifestyle', 'medical', 'insurance', 'education', 'family', 'zakat']

export default function ReliefChecklist({ reliefs, onReliefsChange }) {
  const { t } = useTranslation()

  const grouped = GROUP_ORDER.reduce((acc, group) => {
    const items = reliefs.filter(r => r.group === group)
    if (items.length > 0) acc[group] = items
    return acc
  }, {})

  function handleCheck(id, checked) {
    onReliefsChange(reliefs.map(r =>
      r.id === id ? { ...r, checked, amount: checked ? r.amount : '', inputMode: r.inputMode ?? 'annual' } : r
    ))
  }

  function handleAmount(id, rawValue, annualCap) {
    const value = rawValue.replace(/[^0-9.]/g, '')
    onReliefsChange(reliefs.map(r => {
      if (r.id !== id) return r
      const numVal = parseFloat(value) || 0
      const mode = r.inputMode ?? 'annual'
      const computedAnnual = mode === 'monthly' ? numVal * 12 : numVal
      const effectiveCap = annualCap ?? Infinity
      const exceeded = computedAnnual > effectiveCap
      return {
        ...r,
        amount: value,
        exceeded,
        effectiveAmount: Math.min(computedAnnual, effectiveCap),
      }
    }))
  }

  function handleToggleMode(id, mode) {
    onReliefsChange(reliefs.map(r => {
      if (r.id !== id) return r
      const numVal = parseFloat(r.amount) || 0
      const computedAnnual = mode === 'monthly' ? numVal * 12 : numVal
      const effectiveCap = r.annualCap ?? Infinity
      const exceeded = computedAnnual > effectiveCap
      return {
        ...r,
        inputMode: mode,
        exceeded,
        effectiveAmount: Math.min(computedAnnual, effectiveCap),
      }
    }))
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-1">{t('relief.title')}</h2>
      <p className="text-sm text-gray-500 mb-6">{t('relief.instruction')}</p>

      <div className="space-y-6">
        {GROUP_ORDER.map(group => {
          const items = grouped[group]
          if (!items) return null
          const firstItem = items[0]

          return (
            <div key={group}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{firstItem.icon}</span>
                <h3 className="text-xs font-bold uppercase tracking-widest text-green-700">
                  {t(firstItem.groupKey)}
                </h3>
              </div>
              <div className="space-y-3">
                {items.map(relief => (
                  <ReliefItem
                    key={relief.id}
                    relief={relief}
                    onCheck={handleCheck}
                    onAmount={handleAmount}
                    onToggleMode={handleToggleMode}
                    t={t}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Badge({ type }) {
  if (type === 'new') {
    return (
      <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200 leading-none">
        NEW 2026
      </span>
    )
  }
  if (type === 'updated') {
    return (
      <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200 leading-none">
        UPDATED
      </span>
    )
  }
  return null
}

function MonthlyToggle({ mode, onChange }) {
  return (
    <div className="flex items-center rounded-full border border-gray-200 bg-gray-100 p-0.5 text-xs font-semibold shrink-0">
      <button
        type="button"
        onClick={() => onChange('monthly')}
        className={`px-2.5 py-1 rounded-full transition-colors ${
          mode === 'monthly' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400'
        }`}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange('annual')}
        className={`px-2.5 py-1 rounded-full transition-colors ${
          mode === 'annual' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400'
        }`}
      >
        Annual
      </button>
    </div>
  )
}

function ReliefItem({ relief, onCheck, onAmount, onToggleMode, t }) {
  const capLabel = relief.annualCap === null
    ? t('relief.cap_unlimited')
    : t('relief.cap_label', { cap: relief.annualCap.toLocaleString() })

  const inputMode = relief.inputMode ?? 'annual'
  const numVal = parseFloat(relief.amount) || 0
  const computedAnnual = inputMode === 'monthly' ? numVal * 12 : numVal
  const cappedAnnual = relief.annualCap !== null ? Math.min(computedAnnual, relief.annualCap) : computedAnnual

  return (
    <div className={`rounded-xl border transition-colors ${relief.checked ? 'border-green-300 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
      <label className="flex items-start gap-3 p-4 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={relief.checked}
          onChange={e => onCheck(relief.id, e.target.checked)}
          className="mt-0.5 w-5 h-5 accent-green-600 rounded flex-shrink-0 cursor-pointer"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="font-semibold text-gray-800 text-sm">
              {relief.icon} {t(relief.labelKey)}
            </span>
            {relief.badge && <Badge type={relief.badge} />}
            <span className="ml-auto text-xs text-gray-400 shrink-0">{capLabel}</span>
          </div>
          <p className="text-xs text-gray-500">{t(relief.descKey)}</p>
          {relief.noteKey && (
            <p className="text-xs text-amber-600 mt-0.5 italic">{t(relief.noteKey)}</p>
          )}
        </div>
      </label>

      <div className={`relief-input ${relief.checked ? 'open' : ''}`}>
        <div className="px-4 pb-4 pt-0">
          <div className="flex items-center gap-2 mb-2">
            {relief.allowMonthly && (
              <MonthlyToggle
                mode={inputMode}
                onChange={mode => onToggleMode(relief.id, mode)}
              />
            )}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">RM</span>
            <input
              type="number"
              min="0"
              step="1"
              value={relief.amount}
              onChange={e => onAmount(relief.id, e.target.value, relief.annualCap)}
              placeholder={t('relief.amount_placeholder')}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 transition ${
                relief.exceeded
                  ? 'border-red-300 bg-red-50 text-red-700 focus:ring-red-300'
                  : 'border-gray-200 bg-white text-gray-800 focus:ring-green-400'
              }`}
            />
            {inputMode === 'monthly' && relief.allowMonthly && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">/month</span>
            )}
          </div>

          {inputMode === 'monthly' && relief.allowMonthly && numVal > 0 && (
            <p className={`text-xs mt-1.5 font-medium ${relief.exceeded ? 'text-red-500' : 'text-green-600'}`}>
              = RM {cappedAnnual.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / year
              {relief.exceeded && ' (capped)'}
            </p>
          )}

          {relief.exceeded && (
            <p className="text-xs text-red-500 mt-1">
              {t('relief.cap_exceeded', { cap: relief.annualCap.toLocaleString() })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
