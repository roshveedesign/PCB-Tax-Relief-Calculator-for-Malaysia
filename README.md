# PCB Tax Relief Calculator 🇲🇾

A fully client-side web app that helps Malaysian employees estimate their monthly **PCB (Potongan Cukai Bulanan)** deduction and calculate potential tax savings through eligible annual reliefs under **YA2026 LHDN rules**.

> Kalkulator pelepasan cukai PCB untuk pekerja Malaysia — anggaran potongan cukai bulanan dan penjimatan melalui pelepasan yang layak (YA2026).

---

## Features

- **Real-time PCB calculation** using 2026 LHDN income tax brackets
- **17 relief categories** — lifestyle, medical, insurance, education, family, zakat/donations
- **New YA2026 reliefs** — Home CCTV, domestic tourism (Visit Malaysia 2026), first home loan interest
- **Monthly / Annual input toggle** for recurring bills (internet, insurance premiums, childcare fees)
- **NEW / UPDATED badges** on reliefs changed or added in YA2026
- **Zakat handled correctly** as a 1:1 tax rebate off tax payable (not an income deduction)
- **Bilingual** — Bahasa Melayu (default) and English, toggle anytime
- **Mobile-first** — responsive on Samsung Galaxy A31 and all screen sizes
- **No backend, no login** — fully offline-capable, all computation in the browser

---

## YA2026 Relief Coverage

| Relief | Cap (RM) | Notes |
|---|---|---|
| Lifestyle (internet, devices, books, gym) | 2,500 | Monthly toggle |
| Sports Activities | 1,000 | Raised from RM500 in YA2026 |
| EV Charger / Food Composter / Food Waste Grinder | 2,500 | Combined cap |
| **Home CCTV System** *(NEW)* | 2,500 | Once every 2 years (YA2026–2027) |
| **Domestic Tourism & Attractions** *(NEW)* | 1,000 | Visit Malaysia Year 2026 |
| Medical & Health Insurance | 4,000 | Monthly toggle |
| Medical Expenses | 1,000 | Expanded to all MOH-approved vaccines |
| Parents' Medical Treatment | 8,000 | |
| Life Insurance & EPF Top-up | 3,000 | Monthly toggle; includes children's policies |
| Private Retirement Scheme (PRS) | 3,000 | Valid until YA2030 |
| Education Fees (Self) | 7,000 | |
| SSPN Net Savings | 8,000 | Valid YA2025–2027 |
| **First Home Loan Interest** *(NEW)* | 7,000 | SPA signed Jan 2025–Dec 2027 |
| Childcare & Kindergarten Fees | 3,000 | Expanded to age 12 in YA2026; monthly toggle |
| Breastfeeding Equipment | 1,000 | Female taxpayer, once every 2 years |
| Zakat / Fitrah | Unlimited | 1:1 tax rebate |
| Donations to Approved Institutions | 10% of income | |

---

## Tech Stack

- **Vite + React 18**
- **Tailwind CSS** (no external UI library)
- **i18next + react-i18next** (BM / EN)
- **No backend** — fully client-side

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/pcb-tax-relief-calculator.git
cd pcb-tax-relief-calculator/pcbrelief

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Production build
npm run build
```

---

## Project Structure

```
src/
├── i18n/
│   ├── config.js         # i18next setup
│   ├── en.json           # English translations
│   └── ms.json           # Malay translations
├── utils/
│   ├── pcbCalculator.js  # PCB & tax savings logic
│   └── taxReliefData.js  # Relief categories & caps
├── components/
│   ├── LanguageSwitcher.jsx
│   ├── SalaryPanel.jsx
│   ├── ReliefChecklist.jsx
│   └── SavingsSummary.jsx
└── pages/
    └── Home.jsx
```

---

## How PCB is Calculated

```
Annual Salary       = Monthly Salary × 12
EPF Deduction       = min(Annual Salary × 11%, RM88,000 × 11%)
Personal Relief     = RM9,000
Chargeable Income   = Annual Salary − EPF − Personal Relief
Annual Tax          = Apply 2026 LHDN brackets to Chargeable Income
Monthly PCB         = Annual Tax ÷ 12
```

Tax savings from reliefs are computed by re-running the brackets on the reduced chargeable income. Zakat is applied as a direct 1:1 deduction off the final tax payable.

---

## Disclaimer

This calculator is for **estimation purposes only**. It does not account for all individual circumstances (e.g. spouse relief, child relief, rebates). Refer to [LHDN's official e-PCB calculator](https://www.hasil.gov.my) for official figures. Keep receipts for all claimed reliefs — LHDN may audit up to 7 years.

---

## License

MIT
