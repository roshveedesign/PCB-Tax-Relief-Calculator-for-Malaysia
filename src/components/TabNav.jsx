import { useTranslation } from 'react-i18next'

const TABS = [
  { key: 'tab.calculator', icon: '🧮' },
  { key: 'tab.relief', icon: '🎁' },
]

export default function TabNav({ activeTab, onTabChange }) {
  const { t } = useTranslation()

  return (
    <div className="flex rounded-xl bg-gray-100 p-1 mb-6 gap-1">
      {TABS.map((tab, idx) => (
        <button
          key={idx}
          onClick={() => onTabChange(idx)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
            activeTab === idx
              ? 'bg-white text-green-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>{tab.icon}</span>
          <span>{t(tab.key)}</span>
        </button>
      ))}
    </div>
  )
}
