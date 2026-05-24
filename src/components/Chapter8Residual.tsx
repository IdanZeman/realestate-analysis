import { useState, useMemo } from "react";

interface SubUse {
  name: string;
  area: number;
  rent: number;
  cap: number;
}

export default function Chapter8Residual() {
  // Preset values from Chapter 8 Case Study
  const [uses, setUses] = useState<SubUse[]>([
    { name: "מרכול (עוגן)", area: 3475, rent: 80, cap: 8.25 },
    { name: "שטחי מסחר קרקע", area: 4202, rent: 135, cap: 8.25 },
    { name: "מסחר קומה א'", area: 4150, rent: 110, cap: 8.25 },
    { name: "מסחר קומה ב'", area: 3906, rent: 90, cap: 8.25 },
    { name: "משרדים (קומות 3-6)", area: 8392, rent: 45, cap: 9.50 },
  ]);

  // Adjustments multipliers to let user perform quick "stress-test"
  const [rentMultiplier, setRentMultiplier] = useState(1.0); // 100% of standard rent
  const [constructionMultiplier, setConstructionMultiplier] = useState(1.0); // 100% of standard cost

  // Constants from Chapter 8 Case Study
  const parkingArea = 20345;
  const parkingCostPerSqm = 2250;
  const upperArea = 24125;
  const upperCostPerSqm = 3500;
  const localFeesArea = 44470;
  const localFeesCostPerSqm = 250;
  
  const designAndLegalRate = 0.10; // 10%
  const marketingAndSalesFee = 2030950;
  const contingencyRate = 0.05; // 5%
  
  const financingRate = 32440996; // original financing
  const developerProfitRate = 0.20; // 20% of GDV
  const ramiFees = 6200000;
  
  const totalLandSqmAllowed = 19445; // עיקרי מבונה מותר
  const physicalLandSizeDunams = 9.48; // גודל המגרש המאומד

  // Live Calculations
  const calculations = useMemo(() => {
    // 1. Calculate GDV
    let totalGDV = 0;
    let totalAnnualIncome = 0;
    const items = uses.map((u) => {
      const adjustedRent = u.rent * rentMultiplier;
      const annualIncome = u.area * adjustedRent * 12;
      const value = annualIncome / (u.cap / 100);
      totalAnnualIncome += annualIncome;
      totalGDV += value;
      return {
        ...u,
        adjustedRent,
        annualIncome,
        value,
      };
    });

    // 2. Calculate Costs (with construction stress testing)
    const parkingHardCost = parkingArea * parkingCostPerSqm * constructionMultiplier;
    const upperHardCost = upperArea * upperCostPerSqm * constructionMultiplier;
    const localFeesCost = localFeesArea * localFeesCostPerSqm * constructionMultiplier;
    
    const totalHardCosts = parkingHardCost + upperHardCost + localFeesCost;
    const designAndLegalCost = totalHardCosts * designAndLegalRate;
    const withMarketing = totalHardCosts + designAndLegalCost + marketingAndSalesFee;
    const contingencyCost = withMarketing * contingencyRate;

    const totalBuildCostsNoFinance = withMarketing + contingencyCost;

    // 3. Financing & Profit Covenants
    const developerProfitValue = totalGDV * developerProfitRate;

    // Remaining for Land (Residual Land Value)
    // GDV - Costs - Financing - Profit - Rami
    const residualBeforeRami = totalGDV - totalBuildCostsNoFinance - financingRate - developerProfitValue;
    const finalLandValue = Math.max(0, residualBeforeRami - ramiFees);

    const landSqmValue = finalLandValue / totalLandSqmAllowed;
    const landDunamValue = finalLandValue / physicalLandSizeDunams;

    return {
      items,
      totalAnnualIncome,
      totalGDV,
      parkingHardCost,
      upperHardCost,
      localFeesCost,
      totalHardCosts,
      designAndLegalCost,
      contingencyCost,
      totalBuildCostsNoFinance,
      developerProfitValue,
      finalLandValue,
      landSqmValue,
      landDunamValue,
    };
  }, [uses, rentMultiplier, constructionMultiplier]);

  const handleValueChange = (index: number, key: "rent" | "cap", val: number) => {
    const updated = [...uses];
    updated[index] = {
      ...updated[index],
      [key]: val,
    };
    setUses(updated);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-md text-slate-900">
      <div className="flex items-center gap-3 mb-6">
        <span className="p-2 bg-amber-100 text-amber-800 rounded-full font-black text-xs uppercase">
          נדל"ן יזמי
        </span>
        <h3 className="text-xl font-extrabold tracking-tight">כדאיות ומודל החילוץ (Residual Value) Live</h3>
      </div>

      <p className="text-slate-600 text-sm mb-6 leading-relaxed">
        הזן וכוונן את מחירי השכירות, שיעור היוון או הוצאות הבנייה מתחת. המערכת תבצע חילוץ מלא ויזמי בזמן אמת ותחשיב את <strong>שווי הקרקע הריאלי</strong> המקסימלי שניתן להציע במכרז:
      </p>

      {/* Stress Testing controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
            <span>לחץ שכירות (הרחקת שוק):</span>
            <span className="text-indigo-600">{(rentMultiplier * 100).toFixed(0)}% מהמקור</span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.3"
            step="0.05"
            value={rentMultiplier}
            onChange={(e) => setRentMultiplier(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 rounded-full"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
            <span>עלויות בנייה הנדסיות (Hard Costs):</span>
            <span className="text-indigo-600">{(constructionMultiplier * 100).toFixed(0)}% מהמקור</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.5"
            step="0.05"
            value={constructionMultiplier}
            onChange={(e) => setConstructionMultiplier(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 rounded-full"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-xs text-right border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400">
              <th className="pb-2 text-right">סוג שימוש / קומה</th>
              <th className="pb-2 text-center">שטח משווק (מ"ר)</th>
              <th className="pb-2 text-center">שירות למ"ר/חודש (₪)</th>
              <th className="pb-2 text-center">שיעור היוון (Cap)</th>
              <th className="pb-2 text-left">הכנסה שנתית מיוצבת</th>
              <th className="pb-2 text-left">שווי חזוי כגמור</th>
            </tr>
          </thead>
          <tbody>
            {calculations.items.map((item, index) => (
              <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/60">
                <td className="py-2.5 font-bold text-slate-800">{item.name}</td>
                <td className="py-2.5 text-center font-mono">{item.area.toLocaleString()}</td>
                <td className="py-2.5 text-center">
                  <input
                    type="number"
                    value={Math.round(item.rent)}
                    onChange={(e) => handleValueChange(index, "rent", parseFloat(e.target.value) || 0)}
                    className="w-16 text-center text-xs bg-slate-50 border border-slate-200 rounded py-0.5 font-bold"
                  />
                </td>
                <td className="py-2.5 text-center">
                  <input
                    type="number"
                    step="0.05"
                    value={item.cap}
                    onChange={(e) => handleValueChange(index, "cap", parseFloat(e.target.value) || 0)}
                    className="w-16 text-center text-xs bg-slate-50 border border-slate-200 rounded py-0.5 font-bold"
                  />
                  %
                </td>
                <td className="py-2.5 text-left font-mono">₪{Math.round(item.annualIncome).toLocaleString()}</td>
                <td className="py-2.5 text-left font-black text-indigo-700 font-mono">₪{Math.round(item.value).toLocaleString()}</td>
              </tr>
            ))}
            <tr className="bg-slate-50/80 font-bold border-t border-slate-200 text-slate-900">
              <td className="py-3 pr-2 font-black">סך הכל (GDV)</td>
              <td className="py-3 text-center font-mono">24,125</td>
              <td className="py-3"></td>
              <td className="py-3 text-center text-[10px] text-slate-400 font-bold">~8.5% ממוצע</td>
              <td className="py-3 text-left font-mono">₪{Math.round(calculations.totalAnnualIncome).toLocaleString()}</td>
              <td className="py-3 text-left font-black text-indigo-900 font-mono">₪{Math.round(calculations.totalGDV).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
        {/* Cost summary list */}
        <div>
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">סיכום עלויות והפחתות</h4>
          
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">בנייה ותגית הנדסית (Hard Costs):</span>
              <span className="font-bold text-slate-800 font-mono">₪{Math.round(calculations.totalHardCosts).toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">תכנון, פיקוח ומשפטי (Soft Costs 10%):</span>
              <span className="font-bold text-slate-800 font-mono">₪{Math.round(calculations.designAndLegalCost).toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">בצ"מ (בלתי צפוי מראש 5%):</span>
              <span className="font-bold text-slate-800 font-mono">₪{Math.round(calculations.contingencyCost).toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">שיווק, פרסום ותיווך:</span>
              <span className="font-bold text-slate-800 font-mono">₪{marketingAndSalesFee.toLocaleString()}</span>
            </div>

            <div className="flex justify-between font-bold border-t border-slate-100 pt-2 text-slate-900">
              <span>סך עלויות בנייה והקמה:</span>
              <span className="font-mono">₪{Math.round(calculations.totalBuildCostsNoFinance).toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-red-600 font-semibold">
              <span>עלויות מימון וליווי בנייה (ריבית):</span>
              <span className="font-mono">(₪{financingRate.toLocaleString()})</span>
            </div>

            <div className="flex justify-between text-red-600 font-semibold border-b border-slate-100 pb-2">
              <span>רווח יזמי נדרש לפרויקט (20%):</span>
              <span className="font-mono">(₪{Math.round(calculations.developerProfitValue).toLocaleString()})</span>
            </div>

            <div className="flex justify-between text-amber-600 font-bold">
              <span>דמי חכירה לרמ"י והיטלי השבחה:</span>
              <span className="font-mono">(₪{ramiFees.toLocaleString()})</span>
            </div>
          </div>
        </div>

        {/* Dynamic final land valuation */}
        <div className="bg-slate-900 text-white p-6 rounded-[1.8rem] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] bg-amber-400 text-slate-900 font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                תוצאת חילוץ הקרקע (Residual Value)
              </span>
              <span className="text-xs text-slate-400">חיתום שמאי</span>
            </div>

            <div className="text-center py-6">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">סך שווי הקרקע הריאלי לפרויקט</span>
              <span className="text-4xl font-black text-amber-300 block mt-1 font-mono">
                ₪{Math.round(calculations.finalLandValue).toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">מחיר למ"ר קרקע מבונה מותר:</span>
                <span className="font-bold text-amber-300 font-mono">₪{Math.round(calculations.landSqmValue).toLocaleString()} למ"ר</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">שווי ממוצע לדונם קרקע (פיזי):</span>
                <span className="font-bold text-amber-300 font-mono">₪{Math.round(calculations.landDunamValue).toLocaleString()} לדונם</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-4 leading-normal">
            * בהתאם לקורס, יציאה למכרז או הצעה מעבר לסכום החילוץ של <strong>₪{Math.round(calculations.finalLandValue).toLocaleString()}</strong> תביא בהכרח לשחיקת הרווח היזמי אל מתחת ל-20%, ויחשוף את היזם לחוסר יכולת לקבל ליווי בנקאי סגור!
          </p>
        </div>
      </div>
    </div>
  );
}
