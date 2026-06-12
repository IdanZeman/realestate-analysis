import { useState } from "react";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";

interface FormulaEntry {
  name: string;
  formula: string;
  variables: { symbol: string; meaning: string }[];
  note?: string;
}

interface ChapterFormulas {
  chapterId: number;
  chapterTitle: string;
  formulas: FormulaEntry[];
}

const FORMULA_DATA: ChapterFormulas[] = [
  {
    chapterId: 1,
    chapterTitle: "פילוסופיית השקעות — תשואה נדרשת וריבית דריבית",
    formulas: [
      {
        name: "תשואה נדרשת מנכס מקרקעין",
        formula: "R = Rf + RPliquidity + RPoperational + RPcredit + RPgeographic",
        variables: [
          { symbol: "R", meaning: "התשואה השנתית הכוללת הנדרשת מהנכס" },
          { symbol: "Rf", meaning: "ריבית חסרת סיכון — אגרות חוב ממשלתיות לטווח ארוך" },
          { symbol: "RPliquidity", meaning: "פרמיית חוסר נזילות — נדל\"ן אינו ניתן למימוש מהיר" },
          { symbol: "RPoperational", meaning: "פרמיית סיכון תפעולי — ניהול דיירים, בלאי, CapEx" },
          { symbol: "RPcredit", meaning: "פרמיית אשראי שוכרים — דייר AAA נמוך, דייר חלש גבוה" },
          { symbol: "RPgeographic", meaning: "פרמיית סיכון מדינה/אזור — לפי דירוג אשראי המדינה" },
        ],
        note: "Cap Rate של דירות ישראליות: ~2.0%–2.5% (מתחת לריבית בנקאית = Negative Spread)"
      },
      {
        name: "ערך עתידי — ריבית דריבית",
        formula: "FV = PV × (1 + r)^t",
        variables: [
          { symbol: "FV", meaning: "ערך עתידי (Future Value)" },
          { symbol: "PV", meaning: "ערך נוכחי / הון תחילי (Present Value)" },
          { symbol: "r", meaning: "שיעור תשואה שנתי (כשבר, למשל 5% = 0.05)" },
          { symbol: "t", meaning: "מספר תקופות (שנים)" },
        ],
        note: "דוגמה: 1M ₪ × (1.05)^100 ≈ 131.5M ₪"
      }
    ]
  },
  {
    chapterId: 3,
    chapterTitle: "חוזי שכירות מסחריים — מבנה NOI",
    formulas: [
      {
        name: "חישוב NOI בסיסי",
        formula: "NOI = Gross Rent − Operating Expenses",
        variables: [
          { symbol: "NOI", meaning: "Net Operating Income — רווח תפעולי נקי (לפני חוב ומס)" },
          { symbol: "Gross Rent", meaning: "שכר דירה שנתי ברוטו מכלל השוכרים" },
          { symbol: "Operating Expenses", meaning: "הוצאות תפעוליות (ארנונה, ביטוח, CAM, ניהול)" },
        ],
        note: "בחוזה NNN: השוכר נושא בהוצאות → NOI של הבעלים גבוה יותר. ב-Gross: הבעלים נושא → NOI נשחק."
      }
    ]
  },
  {
    chapterId: 6,
    chapterTitle: "מימון והנדסה פיננסית — מינוף ואמות מידה",
    formulas: [
      {
        name: "תשואה על ההון העצמי (ROE)",
        formula: "ROE = (NOI − Debt Service) / Equity Value",
        variables: [
          { symbol: "ROE", meaning: "Return on Equity — תשואה שנתית על ההון העצמי" },
          { symbol: "NOI", meaning: "Net Operating Income — רווח תפעולי נקי שנתי" },
          { symbol: "Debt Service", meaning: "תשלומי קרן + ריבית שנתיים לבנק" },
          { symbol: "Equity Value", meaning: "ההון העצמי שהמשקיע הביא (מחיר הנכס פחות ההלוואה)" },
        ],
        note: "מינוף 85% + ירידת ערך 15% = מחיקת ההון העצמי ב-100%"
      },
      {
        name: "יחס כיסוי שירות חוב (DSCR)",
        formula: "DSCR = NOI / (Annual Principal + Annual Interest)",
        variables: [
          { symbol: "DSCR", meaning: "Debt Service Coverage Ratio — כיסוי שירות חוב" },
          { symbol: "NOI", meaning: "Net Operating Income — רווח תפעולי נקי שנתי" },
          { symbol: "Annual Principal", meaning: "תשלום קרן שנתי" },
          { symbol: "Annual Interest", meaning: "תשלום ריבית שנתי" },
        ],
        note: "בנקים דורשים DSCR > 1.20. מתחת ל-1.0 = הנכס לא מכסה את החוב → קש-פלו שלילי"
      },
      {
        name: "יחס כיסוי ריבית (ICR)",
        formula: "ICR = NOI / Annual Interest Expenses",
        variables: [
          { symbol: "ICR", meaning: "Interest Coverage Ratio — כיסוי הריבית בלבד" },
          { symbol: "NOI", meaning: "Net Operating Income" },
          { symbol: "Annual Interest Expenses", meaning: "רכיב הריבית בלבד (ללא קרן)" },
        ],
        note: "מקובל לדרוש ICR > 1.65"
      },
      {
        name: "יחס הלוואה לשווי (LTV)",
        formula: "LTV = Loan Amount / Property Value",
        variables: [
          { symbol: "LTV", meaning: "Loan to Value — יחס חוב לשווי" },
          { symbol: "Loan Amount", meaning: "יתרת החוב הבנקאי" },
          { symbol: "Property Value", meaning: "שווי השוק הנוכחי (לפי שמאי)" },
        ],
        note: "מקסימום מקובל: 70%–80% בנדל\"ן מסחרי. עד 92.5% במקרים אגרסיביים."
      }
    ]
  },
  {
    chapterId: 7,
    chapterTitle: "מתודולוגיות שמאות — שלוש הגישות",
    formulas: [
      {
        name: "היוון ישיר (Direct Capitalization)",
        formula: "Value = NOI / Cap Rate",
        variables: [
          { symbol: "Value", meaning: "שווי הנכס" },
          { symbol: "NOI", meaning: "Net Operating Income — רווח תפעולי נקי שנתי מיוצב" },
          { symbol: "Cap Rate", meaning: "שיעור היוון (שיעור תשואה שנתי הנדרש מנכס דומה בשוק)" },
        ],
        note: "Cap Rate ↑ → שווי ↓. Cap Rate ↓ → שווי ↑. למשל: NOI=500K, Cap=5% → Value=10M ₪"
      }
    ]
  },
  {
    chapterId: 8,
    chapterTitle: "מודל החילוץ (Residual Value) — שלבי החישוב",
    formulas: [
      {
        name: "חישוב GDV (Gross Development Value)",
        formula: "GDV = Σ (NOI per use / Cap Rate per use)",
        variables: [
          { symbol: "GDV", meaning: "שווי הפרויקט כגמור ומיוצב (Gross Development Value)" },
          { symbol: "NOI per use", meaning: "הכנסת שכירות שנתית חזויה לכל ייעוד (מסחר, משרדים, מרכול)" },
          { symbol: "Cap Rate per use", meaning: "שיעור ההיוון הספציפי לכל ייעוד" },
        ],
        note: "במקרה הבוחן: GDV = 288,183,349 ₪. Cap Rate מסחר = 8.25%, משרדים = 9.5%"
      },
      {
        name: "חילוץ שווי הקרקע (Residual Land Value)",
        formula: "Land Value = GDV − Construction Costs − Financing Costs − Developer Profit",
        variables: [
          { symbol: "GDV", meaning: "שווי הפרויקט כגמור" },
          { symbol: "Construction Costs", meaning: "עלויות הקמה ישירות ועקיפות (Hard + Soft Costs)" },
          { symbol: "Financing Costs", meaning: "ריבית ליווי בנייה (LTC × Rate × Period)" },
          { symbol: "Developer Profit", meaning: "20% מה-GDV — רף רווח יזמי מינימלי" },
        ],
        note: "במקרה הבוחן: 288.2M − 162.2M − 32.4M − 57.6M = 78.3M ₪ לקרקע (לפני היטלים)"
      },
      {
        name: "עלות בנייה ישירה (Hard Costs)",
        formula: "Construction Cost = Area (m²) × Cost per m²",
        variables: [
          { symbol: "Area", meaning: "שטח הבנייה במ\"ר" },
          { symbol: "Cost per m²", meaning: "עלות בנייה למ\"ר (חניון תת-קרקעי: ~2,250 ₪/מ\"ר, עיל: ~3,500 ₪/מ\"ר)" },
        ]
      }
    ]
  },
  {
    chapterId: 9,
    chapterTitle: "Pro-Forma — מודל תזרים מזומנים",
    formulas: [
      {
        name: "סדר חישוב Pro-Forma (NOI)",
        formula: "PGI → (−Vacancy & Credit Loss) → EGI → (−Operating Expenses) → NOI",
        variables: [
          { symbol: "PGI", meaning: "Potential Gross Income — הכנסה ברוטו תיאורטית בהנחת אפס ריקנות" },
          { symbol: "Vacancy & Credit Loss", meaning: "ניכוי אחוז ריקנות חזויה ואשראי חסר (למשל 5%)" },
          { symbol: "EGI", meaning: "Effective Gross Income — הכנסה ריאלית בפועל" },
          { symbol: "Operating Expenses", meaning: "ארנונה, ביטוחים, ניהול, אנרגיה, תחזוקה, CapEx Reserve" },
          { symbol: "NOI", meaning: "Net Operating Income — הרווח התפעולי הנקי (בסיס לשמאות)" },
        ],
        note: "NOI הוא המדד הקריטי: ממנו נגזר שווי הנכס (Value = NOI / Cap Rate)"
      }
    ]
  }
];

export default function FormulaSheet({ fontSize = "base" }: { fontSize?: "sm" | "base" | "lg" | "xl" }) {
  const [openChapters, setOpenChapters] = useState<Record<number, boolean>>(
    Object.fromEntries(FORMULA_DATA.map(c => [c.chapterId, true]))
  );

  const toggle = (id: number) => setOpenChapters(prev => ({ ...prev, [id]: !prev[id] }));

  const formulaTextSize = { sm: "text-xs md:text-sm", base: "text-sm md:text-base", lg: "text-base md:text-lg", xl: "text-lg md:text-xl" }[fontSize];
  const varTextSize = { sm: "text-[10px]", base: "text-[11px]", lg: "text-xs", xl: "text-sm" }[fontSize];

  return (
    <div className="space-y-4" dir="rtl">
      {/* Header */}
      <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-100 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
            <Calculator className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">דף נוסחאות — ניתוח השקעות נדל"ן</h2>
        </div>
        <p className="text-xs text-slate-500 font-semibold">
          כל הנוסחאות נגזרות מחומר הקורס. לחץ על כותרת פרק לפתיחה/סגירה.
        </p>
      </div>

      {FORMULA_DATA.map(chapter => (
        <div key={chapter.chapterId} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-md overflow-hidden">
          {/* Chapter header */}
          <button
            onClick={() => toggle(chapter.chapterId)}
            className="w-full flex items-center justify-between px-5 py-4 text-right hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#E21E26] text-white text-xs font-black flex items-center justify-center shrink-0">
                {chapter.chapterId}
              </span>
              <span className="font-extrabold text-slate-900 text-sm md:text-base">{chapter.chapterTitle}</span>
            </div>
            {openChapters[chapter.chapterId]
              ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
              : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            }
          </button>

          {openChapters[chapter.chapterId] && (
            <div className="px-5 pb-5 space-y-5 border-t border-slate-100 pt-4">
              {chapter.formulas.map((f, fidx) => (
                <div key={fidx} className="space-y-3">
                  {/* Formula name */}
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-[#E21E26] rounded-full shrink-0" />
                    <h4 className="font-extrabold text-slate-800 text-sm">{f.name}</h4>
                  </div>

                  {/* Formula box */}
                  <div className={`bg-slate-950 text-emerald-300 font-mono px-4 py-3 rounded-xl text-center font-bold tracking-wide overflow-x-auto ${formulaTextSize}`}>
                    {f.formula}
                  </div>

                  {/* Variables */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">פירוש משתנים:</span>
                    {f.variables.map((v, vidx) => (
                      <div key={vidx} className={`flex gap-2 items-start ${varTextSize}`}>
                        <span className="font-black text-indigo-600 shrink-0 font-mono min-w-[80px]">{v.symbol}</span>
                        <span className="text-slate-600 font-semibold leading-snug">{v.meaning}</span>
                      </div>
                    ))}
                  </div>

                  {/* Note */}
                  {f.note && (
                    <div className={`bg-amber-50 border border-amber-100 text-amber-800 font-semibold px-3 py-2 rounded-xl leading-relaxed ${varTextSize}`}>
                      <span className="font-black">💡 </span>{f.note}
                    </div>
                  )}

                  {fidx < chapter.formulas.length - 1 && (
                    <div className="border-b border-slate-100 pt-1" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Quick reference card */}
      <div className="bg-slate-900 text-white p-5 rounded-[1.5rem] shadow-xl">
        <h4 className="font-extrabold text-sm mb-3 text-white">📌 ערכי ייחוס מהירים מהחומר</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {[
            { label: "Cap Rate דירות ישראל", value: "~2.0%–2.5%", color: "text-red-300" },
            { label: "DSCR מינימלי (בנקים)", value: "> 1.20", color: "text-emerald-300" },
            { label: "ICR מינימלי", value: "> 1.65", color: "text-emerald-300" },
            { label: "LTV מקס' מסחרי", value: "70%–80%", color: "text-amber-300" },
            { label: "Promote/Carried Interest", value: "20% מרווחים עודפים", color: "text-indigo-300" },
            { label: "רווח יזמי נדרש", value: "20% מה-GDV", color: "text-indigo-300" },
            { label: "Preferred Return מקובל", value: "7%–8% IRR", color: "text-indigo-300" },
            { label: "תקופת DCF נדל\"ן מניב", value: "10 שנים", color: "text-slate-300" },
            { label: "חכירה לדורות", value: "מעל 25 שנה", color: "text-slate-300" },
            { label: "נכסים אלטרנטיביים (UBS)", value: "~42% מהתיק", color: "text-emerald-300" },
            { label: "ריבית ליווי בנייה (מקרה 8)", value: "6% שנתי", color: "text-amber-300" },
            { label: "Cap Rate משרדים (מקרה 8)", value: "9.5%", color: "text-red-300" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-800 last:border-0">
              <span className="text-slate-400 font-semibold">{item.label}</span>
              <span className={`font-extrabold font-mono ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
