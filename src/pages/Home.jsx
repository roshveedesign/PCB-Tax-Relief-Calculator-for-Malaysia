import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'
import TabNav from '../components/TabNav'
import PCBCalculatorTab from '../components/PCBCalculatorTab'
import TaxReliefTab from '../components/TaxReliefTab'
import taxReliefData from '../utils/taxReliefData'
import { calculatePCB } from '../utils/pcbCalculator'

const DEFAULT_INPUTS = {
  monthlySalary: '',
  fixedAllowance: '',
  bonus: '',
  taxCategory: 1,
  isMalaysianCitizen: true,
  isBelow60: true,
  numberOfChildren: 0,
  epfRate: 0.11,
  socsoCategory: 1,
  hasEIS: true,
  zakatMonthly: '',
  tp1Amount: '',
}

const initialReliefs = taxReliefData.map(r => ({
  ...r,
  checked: false,
  amount: '',
  exceeded: false,
  effectiveAmount: 0,
  inputMode: 'annual',
}))

export default function Home() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(0)
  const [pcbInputs, setPcbInputs] = useState(DEFAULT_INPUTS)
  const [reliefs, setReliefs] = useState(initialReliefs)

  const result = calculatePCB(pcbInputs)
  const annualIncome = (parseFloat(pcbInputs.monthlySalary) || 0) * 12

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
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

        {/* Tab Navigation */}
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 0 && (
          <PCBCalculatorTab
            inputs={pcbInputs}
            onInputChange={setPcbInputs}
            result={result}
          />
        )}
        {activeTab === 1 && (
          <TaxReliefTab
            reliefs={reliefs}
            onReliefsChange={setReliefs}
            chargeableIncome={result.chargeableIncome}
            annualIncome={annualIncome}
          />
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pt-8 pb-4">
          © {new Date().getFullYear()} PCB Relief Calculator · Malaysia &nbsp;|&nbsp; Powered by <span className="text-gray-500 font-medium">My Autumn Space Solutions</span> · Ros
        </p>
      </div>
    </div>
  )
}
