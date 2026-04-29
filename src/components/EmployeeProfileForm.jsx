import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function SectionHeader({ label }) {
  return (
    <div className="flex items-center gap-2 mt-5 mb-3">
      <div className="h-px flex-1 bg-gray-100" />
      <span className="text-xs font-bold uppercase tracking-widest text-green-700 px-1">{label}</span>
      <div className="h-px flex-1 bg-gray-100" />
    </div>
  )
}

function TogglePill({ value, onChange, optionA, optionB }) {
  return (
    <div className="flex rounded-full border border-gray-200 bg-gray-100 p-0.5 text-xs font-semibold w-fit">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`px-3 py-1.5 rounded-full transition-colors ${value ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400'}`}
      >
        {optionA}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`px-3 py-1.5 rounded-full transition-colors ${!value ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400'}`}
      >
        {optionB}
      </button>
    </div>
  )
}

function FieldLabel({ label, hint }) {
  return (
    <label className="block text-sm font-semibold text-gray-600 mb-1.5">
      {label}
      {hint && <span className="ml-1 text-xs text-gray-400 font-normal">{hint}</span>}
    </label>
  )
}

function RMInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">RM</span>
      <input
        type="number"
        min="0"
        step="100"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition placeholder-gray-300"
      />
    </div>
  )
}

export default function EmployeeProfileForm({ inputs, onChange }) {
  const { t } = useTranslation()
  const [showCustomEPF, setShowCustomEPF] = useState(inputs.epfRate !== 0.11 && inputs.epfRate !== 0.09)

  function set(field, value) {
    onChange({ ...inputs, [field]: value })
  }

  function handleEPFSelect(val) {
    if (val === 'custom') {
      setShowCustomEPF(true)
    } else {
      setShowCustomEPF(false)
      set('epfRate', parseFloat(val))
    }
  }

  function getEPFSelectValue() {
    if (showCustomEPF) return 'custom'
    if (inputs.epfRate === 0.09) return '0.09'
    return '0.11'
  }

  return (
    <div className="space-y-1">
      {/* INCOME */}
      <SectionHeader label={t('form.income_section')} />

      <div className="space-y-3">
        <div>
          <FieldLabel label={t('form.salary')} />
          <RMInput
            value={inputs.monthlySalary}
            onChange={v => set('monthlySalary', v)}
            placeholder={t('form.salary_placeholder')}
          />
        </div>
        <div>
          <FieldLabel label={t('form.allowance')} hint="(optional)" />
          <RMInput
            value={inputs.fixedAllowance}
            onChange={v => set('fixedAllowance', v)}
            placeholder={t('form.allowance_placeholder')}
          />
        </div>
        <div>
          <FieldLabel label={t('form.bonus')} hint="(optional)" />
          <RMInput
            value={inputs.bonus}
            onChange={v => set('bonus', v)}
            placeholder={t('form.bonus_placeholder')}
          />
        </div>
      </div>

      {/* PERSONAL */}
      <SectionHeader label={t('form.personal_section')} />

      <div className="space-y-3">
        <div>
          <FieldLabel label={t('form.tax_category')} />
          <select
            value={inputs.taxCategory}
            onChange={e => set('taxCategory', parseInt(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          >
            <option value={1}>{t('form.cat1')}</option>
            <option value={2}>{t('form.cat2')}</option>
            <option value={3}>{t('form.cat3')}</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <FieldLabel label={t('form.citizen')} />
            <TogglePill
              value={inputs.isMalaysianCitizen}
              onChange={v => set('isMalaysianCitizen', v)}
              optionA={t('form.yes')}
              optionB={t('form.no')}
            />
          </div>
          <div>
            <FieldLabel label={t('form.age_category')} />
            <TogglePill
              value={inputs.isBelow60}
              onChange={v => set('isBelow60', v)}
              optionA={t('form.age_below60')}
              optionB={t('form.age_above60')}
            />
          </div>
        </div>

        <div>
          <FieldLabel label={t('form.children')} />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set('numberOfChildren', Math.max(0, inputs.numberOfChildren - 1))}
              className="w-9 h-9 rounded-full border border-gray-200 text-gray-600 font-bold text-lg flex items-center justify-center hover:bg-gray-50 transition"
            >−</button>
            <span className="text-lg font-bold text-gray-800 w-6 text-center">{inputs.numberOfChildren}</span>
            <button
              type="button"
              onClick={() => set('numberOfChildren', Math.min(10, inputs.numberOfChildren + 1))}
              className="w-9 h-9 rounded-full border border-gray-200 text-gray-600 font-bold text-lg flex items-center justify-center hover:bg-gray-50 transition"
            >+</button>
            {inputs.numberOfChildren > 0 && (
              <span className="text-xs text-gray-400">× RM2,000 = RM{(inputs.numberOfChildren * 2000).toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>

      {/* DEDUCTIONS */}
      <SectionHeader label={t('form.deductions_section')} />

      <div className="space-y-3">
        <div>
          <FieldLabel label={t('form.epf_rate')} />
          <select
            value={getEPFSelectValue()}
            onChange={e => handleEPFSelect(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          >
            <option value="0.11">{t('form.epf_11')}</option>
            <option value="0.09">{t('form.epf_9')}</option>
            <option value="custom">{t('form.epf_custom')}</option>
          </select>
          {showCustomEPF && (
            <div className="mt-2 relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                placeholder={t('form.epf_custom_placeholder')}
                value={inputs.epfRate ? (inputs.epfRate * 100).toFixed(1) : ''}
                onChange={e => set('epfRate', parseFloat(e.target.value) / 100 || 0)}
                className="w-full pl-4 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
            </div>
          )}
        </div>

        <div>
          <FieldLabel label={t('form.socso_category')} />
          <select
            value={inputs.socsoCategory}
            onChange={e => {
              const val = parseInt(e.target.value)
              onChange({ ...inputs, socsoCategory: val, hasEIS: val === 1 })
            }}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          >
            <option value={1}>{t('form.socso1')}</option>
            <option value={2}>{t('form.socso2')}</option>
            <option value={0}>{t('form.socso_none')}</option>
          </select>
        </div>

        <div>
          <FieldLabel label={t('form.zakat_monthly')} hint="(optional)" />
          <RMInput
            value={inputs.zakatMonthly}
            onChange={v => set('zakatMonthly', v)}
            placeholder={t('form.zakat_placeholder')}
          />
        </div>

        <div>
          <FieldLabel label={t('form.tp1')} hint="(optional)" />
          <RMInput
            value={inputs.tp1Amount}
            onChange={v => set('tp1Amount', v)}
            placeholder={t('form.tp1_placeholder')}
          />
        </div>
      </div>
    </div>
  )
}
