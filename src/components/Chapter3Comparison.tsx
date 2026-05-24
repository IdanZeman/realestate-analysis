import { useState, useMemo } from "react";

export default function Chapter3Comparison() {
  const [baseRent, setBaseRent] = useState(80); // Base rent per sqm
  const [taxes, setTaxes] = useState(12); // Real estate taxes per sqm
  const [insurance, setInsurance] = useState(4); // Building insurance per sqm
  const [cam, setCam] = useState(16); // Common Area Maintenance per sqm
  const [sizeSqm, setSizeSqm] = useState(500); // 500 sqm shop/office
  const [expenseSurge, setExpenseSurge] = useState(25); // What if expenses go up by 25% due to inflation?

  const calculations = useMemo(() => {
    // Standard expenses
    const unitExpenses = taxes + insurance + cam;
    const monthlyBaseRentTotal = baseRent * sizeSqm;
    const monthlyExpensesTotal = unitExpenses * sizeSqm;

    // Surged expenses (e.g., due to inflation)
    const surgedExpensesTotal = monthlyExpensesTotal * (1 + expenseSurge / 100);
    const costDifference = surgedExpensesTotal - monthlyExpensesTotal;

    // NNN Scenario for Landlord & Tenant
    const nnnLandlordReceiptNormal = monthlyBaseRentTotal;
    const nnnLandlordReceiptSurged = monthlyBaseRentTotal; // NNN Landlord is immune
    const nnnTenantCostNormal = monthlyBaseRentTotal + monthlyExpensesTotal;
    const nnnTenantCostSurged = monthlyBaseRentTotal + surgedExpensesTotal;

    // Gross Scenario for Landlord & Tenant
    // In Gross Lease, Tenant pays a fixed monthly amount = BaseRent + normal expenses (usually baked in)
    const grossFixedPayment = monthlyBaseRentTotal + monthlyExpensesTotal;

    const grossTenantCostNormal = grossFixedPayment;
    const grossTenantCostSurged = grossFixedPayment; // Tenant is immune to expenses surge!

    const grossLandlordNoiNormal = monthlyBaseRentTotal; // grossFixedPayment - expenses (monthlyExpensesTotal)
    const grossLandlordNoiSurged = grossFixedPayment - surgedExpensesTotal; // landlord absorbs the increase!

    return {
      monthlyBaseRentTotal,
      monthlyExpensesTotal,
      surgedExpensesTotal,
      costDifference,
      nnnLandlordReceiptNormal,
      nnnLandlordReceiptSurged,
      nnnTenantCostNormal,
      nnnTenantCostSurged,
      grossTenantCostNormal,
      grossTenantCostSurged,
      grossLandlordNoiNormal,
      grossLandlordNoiSurged,
    };
  }, [baseRent, taxes, insurance, cam, sizeSqm, expenseSurge]);

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-md text-slate-900">
      <div className="flex items-center gap-3 mb-6">
        <span className="p-2 bg-amber-100 text-amber-800 rounded-full font-black text-xs uppercase">
          חוזי שכירות מסחריים
        </span>
        <h3 className="text-xl font-extrabold tracking-tight">Triple Net (NNN) מול Gross Lease</h3>
      </div>

      <p className="text-slate-600 text-sm mb-6 leading-relaxed">
        בצע סימולציה של עליית הוצאות תפעוליות כדי להבין מי באמת סופג את עליות המחירים והאינפלציה בחוזה ברוטו לעומת חוזה נטו מלא:
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Param Inputs */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">נתוני בסיס של הנכס</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">שכירות בסיס (למ"ר):</label>
              <input
                type="number"
                value={baseRent}
                onChange={(e) => setBaseRent(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">גודל השטח (מ"ר):</label>
              <input
                type="number"
                value={sizeSqm}
                onChange={(e) => setSizeSqm(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">פירוט הוצאות תפעול תקינות (למ"ר):</h5>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-600 mb-0.5">ארנונה ותגיות:</label>
                <input
                  type="number"
                  value={taxes}
                  onChange={(e) => setTaxes(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-center text-xs bg-slate-50 border border-slate-200 rounded-lg py-1 font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-600 mb-0.5">ביטוחי מבנה:</label>
                <input
                  type="number"
                  value={insurance}
                  onChange={(e) => setInsurance(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-center text-xs bg-slate-50 border border-slate-200 rounded-lg py-1 font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-600 mb-0.5">דמי ניהול (CAM):</label>
                <input
                  type="number"
                  value={cam}
                  onChange={(e) => setCam(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-center text-xs bg-slate-50 border border-slate-200 rounded-lg py-1 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>תרחיש התייקרות הוצאות:</span>
              <span className="text-red-600 font-extrabold flex items-center gap-1">+{expenseSurge}% עליה</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={expenseSurge}
              onChange={(e) => setExpenseSurge(parseInt(e.target.value))}
              className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-100 rounded-full"
            />
            <p className="text-[10px] text-slate-400 mt-1 leading-normal">
              בשל אינפלציה, שירותי הניקיון, חומרי הגלם והארנונה מתייקרים במועדים אלו.
            </p>
          </div>
        </div>

        {/* NNN Case Results */}
        <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-indigo-100/60 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs bg-indigo-100 text-indigo-800 font-black px-2.5 py-1 rounded-full uppercase">
                חוזה נטו: TRIPLE NET
              </span>
              <span className="text-[10px] text-slate-500 font-bold">השוכר משלם הכל</span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 font-bold">רווח תפעולי נקי למשכיר (NOI):</span>
                <div className="text-xl font-bold text-slate-800">
                  ₪{calculations.nnnLandlordReceiptNormal.toLocaleString()}{" "}
                  <span className="text-xs text-slate-500 font-semibold">(ללא שינוי במצב של עליית הוצאות)</span>
                </div>
              </div>

              <div className="h-px bg-slate-200/60"></div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold">עלות חודשית כוללת לשוכר:</span>
                <div className="text-xs font-bold text-slate-700">מחיר רגיל: ₪{calculations.nnnTenantCostNormal.toLocaleString()}</div>
                <div className="text-sm font-black text-red-600 mt-0.5">
                  מצב של התייקרות: ₪{calculations.nnnTenantCostSurged.toLocaleString()}
                </div>
                <div className="text-[10px] text-red-500 font-bold mt-1">
                  השוכר משתתף ישירות בתוספת של ₪{calculations.costDifference.toLocaleString()} בחודש!
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 border-t border-slate-200/60 pt-3 mt-4">
            * המשכיר מוגן מאינפלציה והתייקרויות. תזרים השכירות NOI יציב ואינו תלוי בהוצאות הבניין.
          </div>
        </div>

        {/* Gross Lease Case Results */}
        <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-amber-100 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs bg-amber-100 text-amber-800 font-black px-2.5 py-1 rounded-full uppercase">
                חוזה ברוטו: GROSS LEASE
              </span>
              <span className="text-[10px] text-slate-500 font-bold">המשכיר משלם הכל</span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 font-bold">עלות חודשית כוללת לשוכר:</span>
                <div className="text-xl font-bold text-slate-800">
                  ₪{calculations.grossTenantCostNormal.toLocaleString()}{" "}
                  <span className="text-xs text-slate-500 font-semibold">(קבועה לחלוטין - חסין מאינפלציה)</span>
                </div>
              </div>

              <div className="h-px bg-slate-200/60"></div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold">רווח תפעולי נקי למשכיר (NOI):</span>
                <div className="text-xs font-bold text-slate-700">מחיר רגיל: ₪{calculations.grossLandlordNoiNormal.toLocaleString()}</div>
                <div className="text-sm font-black text-red-600 mt-0.5">
                  מצב של התייקרות: ₪{calculations.grossLandlordNoiSurged.toLocaleString()}
                </div>
                <div className="text-[10px] text-red-500 font-bold mt-1">
                  הרווח של הבעלים נשחק ב-₪{calculations.costDifference.toLocaleString()} בחודש!
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 border-t border-slate-200/60 pt-3 mt-4">
            * כל הסיכונים התפעוליים רובצים על המשכיר. תזרים השכירות NOI נפגע ישירות ברגע שיש התייקרויות.
          </div>
        </div>
      </div>
    </div>
  );
}
