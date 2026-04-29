import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'
import SalaryPanel from '../components/SalaryPanel'
import ReliefChecklist from '../components/ReliefChecklist'
import SavingsSummary from '../components/SavingsSummary'
import taxReliefData from '../utils/taxReliefData'
import { calculatePCB } from '../utils/pcbCalculator'

const initialReliefs = taxReliefData.map(r => ({
  ...r,
  checked: false,
  amount: '',
  exceeded: false,
  effectiveAmount: 0,
}))

export default function Home() {
  const { t } = useTranslation()
  const [salary, setSalary] = useState('')
  const [reliefs, setReliefs] = useState(initialReliefs)

  const pcb = calculatePCB(salary)
  const annualIncome = (parseFloat(salary) || 0) * 12

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {t('app.title')}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{t('app.subtitle')}</p>
          </div>
          <div className="ml-4 mt-1 shrink-0">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Salary */}
        <SalaryPanel salary={salary} onSalaryChange={setSalary} />

        {/* Reliefs */}
        <ReliefChecklist reliefs={reliefs} onReliefsChange={setReliefs} />

        {/* Savings */}
        <SavingsSummary
          reliefs={reliefs}
          chargeableIncome={pcb.chargeableIncome}
          annualIncome={annualIncome}
        />

        <p className="text-center text-xs text-gray-400 pb-8">
          © {new Date().getFullYear()} PCB Relief Calculator · Malaysia &nbsp;|&nbsp; Powered by <span className="text-gray-500 font-medium">My Autumn Space Solutions</span> · Ros
        </p>
      </div>
    </div>
  )
}
