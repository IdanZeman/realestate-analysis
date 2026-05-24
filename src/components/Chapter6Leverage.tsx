import { useState, useMemo } from "react";

export default function Chapter6Leverage() {
  const [purchasePrice, setPurchasePrice] = useState(10000000); // 10,000,000 ₪
  const [noi, setNoi] = useState(800000); // 800,000 ₪ (8% Yield)
  const [ltv, setLtv] = useState(60); // 60% Leverage (Default: Shimon)
  const [interestRate, setInterestRate] = useState(5.0); // 5%
  const [principalRate, setPrincipalRate] = useState(2.5); // 2.5% per year
  const [marketChange, setMarketChange] = useState(-15); // Default: -15% market slump

  const calculations = useMemo(() => {
    const ltvRatio = ltv / 100;
    const debtAmount = purchasePrice * ltvRatio;
    const equityAmount = purchasePrice - debtAmount;

    // Debt Service
    const annualInterest = debtAmount * (interestRate / 100);
    const annualPrincipal = debtAmount * (principalRate / 100);
    const totalDebtService = annualInterest + annualPrincipal;

    // Cash flow
    const cashFlowAfterDebt = noi - totalDebtService;
    const cashOnCash = equityAmount > 0 ? (cashFlowAfterDebt / equityAmount) * 100 : 0;

    // Financial indicators
    const dscr = totalDebtService > 0 ? noi / totalDebtService : 99.9;
    const icr = annualInterest > 0 ? noi / annualInterest : 99.9;

    // Market change scenario
    const rawProfitValue = purchasePrice * (marketChange / 100);
    // Leveraged return on equity:
    // positive or negative shift divided by the original equity
    const leveragedRoi = equityAmount > 0 ? (rawProfitValue / equityAmount) * 100 : -100;

    return {
      debtAmount,
      equityAmount,
      totalDebtService,
      cashFlowAfterDebt,
      cashOnCash,
      dscr,
      icr,
      rawProfitValue,
      leveragedRoi: Math.max(-100, leveragedRoi), // cannot lose more than 100% of equity (technically, unless recourse)
    };
  }, [purchasePrice, noi, ltv, interestRate, principalRate, marketChange]);

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-md text-slate-900">
      <div className="flex items-center gap-3 mb-6">
        <span className="p-2 bg-amber-100 text-amber-800 rounded-full font-black text-xs uppercase">
          הנדסה פיננסית
        </span>
        <h3 className="text-xl font-extrabold tracking-tight">סימולטור מינוף ושירות חוב (Covenants)</h3>
      </div>

      <p className="text-slate-600 text-sm mb-6 leading-relaxed">
        שנה את יחס המינוף (LTV) ואת שינוי השוק כדי לראות את האסטרטגיה של ראובן (0% מינוף), שמעון (60% מינוף) ובנימין (85% מינוף). ראה כיצד מינוף גבוה מכפיל רווחים מחד, אך מוחק לחלוטין את ההון העצמי בירידות שוק:
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Loan Config */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">מאפייני הרכישה והמימון</h4>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">מחיר הרכישה של הנכס:</label>
            <input
              type="number"
              value={purchasePrice}
              step="500000"
              onChange={(e) => setPurchasePrice(Math.max(100000, parseInt(e.target.value) || 100000))}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">רווח תפעולי נקי (NOI) שנתי:</label>
            <input
              type="number"
              value={noi}
              step="50000"
              onChange={(e) => setNoi(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500 font-bold"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>שיעור המינוף (LTV):</span>
              <span className="text-indigo-600 font-extrabold">{ltv}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={ltv}
              onChange={(e) => setLtv(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 rounded-full"
            />
            <div className="flex justify-between text-[9px] text-slate-500 mt-1">
              <span>0% (ראובן)</span>
              <span>60% (שמעון)</span>
              <span>85% (בנימין)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div>
              <label className="block text-[10px] text-slate-600 mb-0.5">ריבית שנתית (%):</label>
              <input
                type="number"
                value={interestRate}
                step="0.1"
                onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full text-xs text-center bg-white border border-slate-200 rounded-lg py-1 font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-600 mb-0.5">פירעון קרן שנתי (%):</label>
              <input
                type="number"
                value={principalRate}
                step="0.1"
                onChange={(e) => setPrincipalRate(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full text-xs text-center bg-white border border-slate-200 rounded-lg py-1 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Coverage results & Covenants */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">חלוקת הון ואמות מידה (Covenants)</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">חוב בכיר (Senior Debt):</span>
                <span className="font-bold text-slate-800">₪{calculations.debtAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">הון עצמי (Equity):</span>
                <span className="font-bold text-slate-800">₪{calculations.equityAmount.toLocaleString()}</span>
              </div>
              <div className="h-px bg-slate-200"></div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-500">יחס כיסוי שירות חוב (DSCR):</span>
                  <span className={`font-black px-2 py-0.5 rounded text-[11px] ${calculations.dscr < 1.0 ? "bg-red-100 text-red-700" : calculations.dscr < 1.2 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                    {calculations.dscr.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">בנקים דורשים לרוב יחס DSCR גבה מ-1.20 לפחות.</p>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-500">יחס כיסוי ריבית (ICR):</span>
                  <span className={`font-black px-2 py-0.5 rounded text-[11px] ${calculations.icr < 1.65 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {calculations.icr.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">דרישת הסף הנפוצה בשוק היא ICR &gt; 1.65.</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-center">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">תשואת תזרים שוטפת (Cash-on-Cash)</span>
            <span className={`text-xl font-black block mt-0.5 ${calculations.cashFlowAfterDebt < 0 ? "text-red-600" : "text-emerald-600"}`}>
              {calculations.cashOnCash.toFixed(2)}%
            </span>
            <span className="text-[10px] text-slate-400">תזרים פנוי שנתי: ₪{calculations.cashFlowAfterDebt.toLocaleString()}</span>
          </div>
        </div>

        {/* Market Shift Scenario Simulation */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase text-amber-400 font-extrabold tracking-widest block">סימולציית תרחיש שוק קיצוני</span>
            
            <div className="mt-4">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>שינוי במחיר הנכס בשוק:</span>
                <span className={marketChange < 0 ? "text-red-400" : "text-emerald-400"}>
                  {marketChange > 0 ? `+${marketChange}` : marketChange}%
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={marketChange}
                onChange={(e) => setMarketChange(parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-full"
              />
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 mt-5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">שינוי פיזי בשווי הנכס:</span>
                <span className={`font-bold ${calculations.rawProfitValue < 0 ? "text-red-300" : "text-emerald-300"}`}>
                  ₪{calculations.rawProfitValue.toLocaleString()}
                </span>
              </div>

              <div className="h-px bg-slate-700"></div>

              <div className="flex justify-between text-xs items-center">
                <span className="text-slate-400">החזר על ההון העצמי (ROI):</span>
                <span className={`font-black text-sm px-2 py-0.5 rounded ${calculations.leveragedRoi === -100 ? "bg-red-950 text-red-400 animate-pulse border border-red-800" : calculations.leveragedRoi < 0 ? "text-red-300" : "text-emerald-300"}`}>
                  {calculations.leveragedRoi.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-3 mt-4 leading-relaxed">
            {calculations.leveragedRoi === -100 ? (
              <span className="text-red-400 font-bold block">🚨 אזהרה! נוצר מצב של מחיקת הון מוחלטת (100%- הפסד). ירידת הערך עולה על סך ההון העצמי שהשקעת!</span>
            ) : ltv > 75 && marketChange < -10 ? (
              <span className="text-amber-400 block">* שים לב לרמת המינוף הגבוהה שלוקחת אותך לסיכון חמור מאוד של הפסד הון.</span>
            ) : (
              <span>* מציג את השילוב הפיננסי של קניית נכס ממונף. ככל שהמינוף מנופח יותר, כן חדות השינויים.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
