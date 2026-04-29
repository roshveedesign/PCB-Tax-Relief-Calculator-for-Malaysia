import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const isBM = i18n.language === 'ms'

  return (
    <button
      onClick={() => i18n.changeLanguage(isBM ? 'en' : 'ms')}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold border border-green-300 bg-white text-green-700 hover:bg-green-50 transition-colors shadow-sm"
    >
      <span className={isBM ? 'text-green-800 font-bold' : 'text-gray-400'}>BM</span>
      <span className="text-gray-300">/</span>
      <span className={!isBM ? 'text-green-800 font-bold' : 'text-gray-400'}>EN</span>
    </button>
  )
}
