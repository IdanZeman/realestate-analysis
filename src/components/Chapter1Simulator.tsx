import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Chapter1Simulator() {
  // Required Yield inputs
  const [rf, setRf] = useState(4.0); // Gov bonds risk free rate
  const [rpLiquidity, setRpLiquidity] = useState(1.5);
  const [rpOperational, setRpOperational] = useState(1.0);
  const [rpCredit, setRpCredit] = useState(0.5);
  const [rpGeographic, setRpGeographic] = useState(0.5);

  // Compound Interest inputs
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(5.0);
  const [years, setYears] = useState(30);

  // Required Yield Math
  const requiredYield = useMemo(() => {
    return (rf + rpLiquidity + rpOperational + rpCredit + rpGeographic).toFixed(2);
  }, [rf, rpLiquidity, rpOperational, rpCredit, rpGeographic]);

  // Compound Interest calculations
  const chartData = useMemo(() => {
    const data = [];
    let current = principal;
    const rDecimal = rate / 100;
    
    // push starting year
    data.push({
      year: 0,
      value: Math.round(current),
    });

    for (let i = 1; i <= years; i++) {
      current = current * (1 + rDecimal);
      data.push({
        year: i,
        value: Math.round(current),
      });
    }
    return data;
  }, [principal, rate, years]);

  const finalValue = chartData[chartData.length - 1]?.value || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-slate-900">
      {/* Required Yield Simulator */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <span className="p-2 bg-amber-100 text-amber-800 rounded-full font-black text-xs uppercase">
            נוסחאות יסוד
          </span>
          <h3 className="text-xl font-extrabold tracking-tight">משוואת התשואה הנדרשת</h3>
        </div>
        
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          כוונן את מרכיבי הסיכון למטה כדי לראות כיצד הם משפיעים על התשואה הנדרשת מנכס מקרקעין לפי תיאוריית השוק:
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>ריבית חסרת סיכון (Rf):</span>
              <span className="text-amber-600">{rf.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={rf}
              onChange={(e) => setRf(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-100 rounded-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>פרמיית אי-נזילות (RP liquidity):</span>
              <span className="text-amber-600">{rpLiquidity.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={rpLiquidity}
              onChange={(e) => setRpLiquidity(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-100 rounded-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>פרמיית סיכון תפעולי (RP operational):</span>
              <span className="text-amber-600">{rpOperational.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={rpOperational}
              onChange={(e) => setRpOperational(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-100 rounded-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>סיכון אשראי שוכרים (RP credit):</span>
              <span className="text-amber-600">{rpCredit.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={rpCredit}
              onChange={(e) => setRpCredit(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-100 rounded-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>סיכון גאוגרפי/מדינתי (RP geographic):</span>
              <span className="text-amber-600">{rpGeographic.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={rpGeographic}
              onChange={(e) => setRpGeographic(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-100 rounded-full"
            />
          </div>
        </div>

        <div className="mt-8 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">תשואה נדרשת סופית (Required Yield)</span>
          <div className="text-4xl font-black text-indigo-600 mt-1">{requiredYield}%</div>
          <p className="text-xs text-slate-500 mt-2">
            Rf ({rf}%) + RP_liq ({rpLiquidity}%) + RP_ope ({rpOperational}%) + RP_cred ({rpCredit}%) + RP_geo ({rpGeographic}%)
          </p>
        </div>
      </div>

      {/* Compound Interest Simulator */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <span className="p-2 bg-indigo-100 text-indigo-800 rounded-full font-black text-xs uppercase">
            מתמטיקה של הון
          </span>
          <h3 className="text-xl font-extrabold tracking-tight">כוחה של ריבית דריבית</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">הון תחילי (PV):</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">תשואה שנתית (r):</label>
            <input
              type="number"
              value={rate}
              step="0.1"
              onChange={(e) => setRate(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">שנים (t):</label>
            <input
              type="number"
              value={years}
              min="1"
              max="100"
              onChange={(e) => setYears(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500 font-bold"
            />
          </div>
        </div>

        <div className="h-[180px] w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                tickFormatter={(val) => `₪${(val / 1000).toFixed(0)}k`} 
              />
              <Tooltip 
                formatter={(val: any) => [`₪${val.toLocaleString()}`, "ערך הון"]} 
                labelFormatter={(label) => `שנה: ${label}`}
                contentStyle={{ background: "#0F172A", border: "none", borderRadius: "12px", color: "white" }}
              />
              <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">ערך עתידי חזוי (FV)</span>
            <div className="text-2xl font-black text-indigo-950 mt-0.5">₪{finalValue.toLocaleString()}</div>
          </div>
          <div className="text-left">
            <span className="text-xs bg-indigo-200 text-indigo-900 font-bold px-2.5 py-1 rounded-full">
              צמיחה של {((finalValue / (principal || 1) - 1) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
