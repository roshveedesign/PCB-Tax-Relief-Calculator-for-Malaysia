import { useTranslation } from 'react-i18next'
import ReliefChecklist from './ReliefChecklist'
import SavingsSummary from './SavingsSummary'

export default function TaxReliefTab({ reliefs, onReliefsChange, chargeableIncome, annualIncome }) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
        <p className="text-sm text-green-800">{t('relief.tab_intro')}</p>
      </div>
      <ReliefChecklist reliefs={reliefs} onReliefsChange={onReliefsChange} />
      <SavingsSummary
        reliefs={reliefs}
        chargeableIncome={chargeableIncome}
        annualIncome={annualIncome}
      />
    </div>
  )
}
