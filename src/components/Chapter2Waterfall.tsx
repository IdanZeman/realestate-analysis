import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Chapter2Waterfall() {
  const [totalEquity, setTotalEquity] = useState(100); // 100M NIS
  const [lpShare, setLpShare] = useState(90); // 90%
  const [exitValue, setExitValue] = useState(200); // 200M NIS
  const [prefReturn, setPrefReturn] = useState(8.0); // 8% Preferred return
  const [promoteRate, setPromoteRate] = useState(20.0); // 20% GP Promote (Carried Interest)
  const [years, setYears] = useState(2); // Holding period in years

  const calculations = useMemo(() => {
    const lpRatio = lpShare / 100;
    const gpRatio = (100 - lpShare) / 100;

    const lpPrincipal = totalEquity * lpRatio;
    const gpPrincipal = totalEquity * gpRatio;

    // 1. Return of Capital
    // We return totalEquity first:
    const lpReturnCap = Math.min(exitValue, lpPrincipal);
    const gpReturnCap = Math.min(exitValue - lpReturnCap, gpPrincipal);
    let remaining = Math.max(0, exitValue - totalEquity);

    // 2. Preferred Return (cumulative over years)
    // Note: LP and GP both get preferred return on their Capital according to their share
    const lpPrefTarget = lpPrincipal * (Math.pow(1 + prefReturn / 100, years) - 1);
    const gpPrefTarget = gpPrincipal * (Math.pow(1 + prefReturn / 100, years) - 1);

    const lpPrefPaid = Math.min(remaining * lpRatio, lpPrefTarget);
    const gpPrefPaid = Math.min(remaining * gpRatio, gpPrefTarget);
    remaining = Math.max(0, remaining - (lpPrefPaid + gpPrefPaid));

    // 3. GP Promote / Carried Interest
    // 20% of all excess profit goes to GP, 80% split pro-rata
    const promoteAmount = remaining * (promoteRate / 100);
    const remainingAfterPromote = remaining - promoteAmount;

    const lpFinalSplit = remainingAfterPromote * lpRatio;
    const gpFinalSplit = remainingAfterPromote * gpRatio;

    // Totals
    const lpTotalReceived = lpReturnCap + lpPrefPaid + lpFinalSplit;
    const gpTotalReceived = gpReturnCap + gpPrefPaid + promoteAmount + gpFinalSplit;

    const lpMultiple = lpTotalReceived / (lpPrincipal || 1);
    const gpMultiple = gpTotalReceived / (gpPrincipal || 1);

    return {
      lpPrincipal,
      gpPrincipal,
      lpReturnCap,
      gpReturnCap,
      lpPrefPaid,
      gpPrefPaid,
      promoteAmount,
      lpFinalSplit,
      gpFinalSplit,
      lpTotalReceived,
      gpTotalReceived,
      lpMultiple,
      gpMultiple,
      totalProfit: exitValue - totalEquity,
    };
  }, [totalEquity, lpShare, exitValue, prefReturn, promoteRate, years]);

  const chartData = [
    {
      name: "השקעה מקורית",
      משקיע: Math.round(calculations.lpPrincipal),
      יזם: Math.round(calculations.gpPrincipal),
    },
    {
      name: "חלוקה סופית",
      משקיע: Math.round(calculations.lpTotalReceived),
      יזם: Math.round(calculations.gpTotalReceived),
    },
  ];

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-md text-slate-900">
      <div className="flex items-center gap-3 mb-6">
        <span className="p-2 bg-amber-100 text-amber-800 rounded-full font-black text-xs uppercase">
          שותפות GP/LP
        </span>
        <h3 className="text-xl font-extrabold tracking-tight">מכניקת תזרים ומודל ה-Waterfall</h3>
      </div>

      <p className="text-slate-600 text-sm mb-6 leading-relaxed">
        גלה כיצד מנגנון חלוקת הרווחים וה-Promote (דמי ההצלחה) מאפשר לייצר מינוף תשואה עצום לשותף הכללי (GP) תוך הבטחת תשואה מועדפת (Preferred Return) לשותפים המוגבלים (LPs):
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Sliders Block */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">סך הון עצמי נדרש לעסקה (מיל' ₪):</label>
              <input
                type="number"
                value={totalEquity}
                onChange={(e) => setTotalEquity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">חלקם של ה-LPs (משקיעים) בהון:</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="50"
                  max="99"
                  step="1"
                  value={lpShare}
                  onChange={(e) => setLpShare(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-100 rounded-full"
                />
                <span className="text-xs font-extrabold text-slate-700 w-10 text-left">{lpShare}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">תקבולים נטו לאחר החזר משכנתה (מיל' ₪):</label>
              <input
                type="number"
                value={exitValue}
                onChange={(e) => setExitValue(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">משך תקופת ההחזקה (בשנים):</label>
              <input
                type="number"
                value={years}
                min="1"
                max="10"
                onChange={(e) => setYears(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-400 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">תשואה מועדפת שנתית (Hurdle Rate):</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="4"
                  max="15"
                  step="0.5"
                  value={prefReturn}
                  onChange={(e) => setPrefReturn(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-100 rounded-full"
                />
                <span className="text-xs font-extrabold text-slate-700 w-10 text-left">{prefReturn}%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">דמי הצלחה ליזם (GP Promote Rate):</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={promoteRate}
                  onChange={(e) => setPromoteRate(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-100 rounded-full"
                />
                <span className="text-xs font-extrabold text-slate-700 w-10 text-left">{promoteRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Multipliers Block */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">השוואת ביצועים ומכפילי הון</span>
            
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-bold text-slate-700">LP (משקיע פאסיבי):</span>
                  <span className="font-black text-indigo-700">{calculations.lpMultiple.toFixed(2)}x</span>
                </div>
                <div className="text-[10px] text-slate-400">השקיע {calculations.lpPrincipal.toFixed(1)}M ← קיבל {calculations.lpTotalReceived.toFixed(1)}M</div>
              </div>

              <div className="h-px bg-slate-200"></div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-bold text-slate-700">GP (היזם המנהל):</span>
                  <span className="font-black text-amber-600">{calculations.gpMultiple.toFixed(2)}x</span>
                </div>
                <div className="text-[10px] text-slate-400">השקיע {calculations.gpPrincipal.toFixed(1)}M ← קיבל {calculations.gpTotalReceived.toFixed(1)}M</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 mt-4 text-[10px] text-slate-500 leading-snug">
            * ה-GP מקבל Promote של {promoteRate}% מכל הרווחים העודפים שנוצרו לאחר חלוקת התשואה המועדפת ({prefReturn}% לשנה).
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waterfall steps */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">שלבי ה-Waterfall של העסקה</h4>
          
          <div className="p-3.5 bg-slate-50 border-r-4 border-indigo-600 rounded-l-xl text-xs">
            <div className="font-bold text-slate-800 flex justify-between">
              <span>שלב 1: החזר הון מקורי</span>
              <span className="text-indigo-600">₪{totalEquity.toFixed(1)}M</span>
            </div>
            <p className="text-slate-500 mt-1">החזרת הון תחילי של {calculations.lpPrincipal.toFixed(1)}M ₪ למשקיע ו-{calculations.gpPrincipal.toFixed(1)}M ₪ ליזם באופן מלא.</p>
          </div>

          <div className="p-3.5 bg-slate-50 border-r-4 border-indigo-400 rounded-l-xl text-xs">
            <div className="font-bold text-slate-800 flex justify-between">
              <span>שלב 2: תשואה מועדפת (Preferred Return)</span>
              <span className="text-indigo-500">₪{(calculations.lpPrefPaid + calculations.gpPrefPaid).toFixed(1)}M</span>
            </div>
            <p className="text-slate-500 mt-1">משולם {calculations.lpPrefPaid.toFixed(1)}M ₪ למשקעים ו-{calculations.gpPrefPaid.toFixed(1)}M ₪ ליזמים כדי לעמוד בשיעור {prefReturn}% IRR מצטבר.</p>
          </div>

          <div className="p-3.5 bg-slate-50 border-r-4 border-amber-400 rounded-l-xl text-xs">
            <div className="font-bold text-slate-800 flex justify-between">
              <span>שלב 3: חלוקת Promote ועודפים</span>
              <span className="text-amber-600">₪{calculations.promoteAmount.toFixed(1)}M (יזם) + ₪{(calculations.lpFinalSplit + calculations.gpFinalSplit).toFixed(1)}M (חלוקה נוספת)</span>
            </div>
            <p className="text-slate-500 mt-1">היזם מקבל דמי הצלחה (Promote) של {promoteRate}% בגובה {calculations.promoteAmount.toFixed(1)}M ₪ מרווח העודף. היתרה מתחלקת {lpShare}%/{100-lpShare}%.</p>
          </div>
        </div>

        {/* Bar chart representation */}
        <div className="h-[210px] w-full bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0F172A", border: "none", color: "white", borderRadius: "8px" }} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar dataKey="משקיע" name="LP (המשקיעים)" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="יזם" name="GP (היזם)" fill="#FCD34D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
