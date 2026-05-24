import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface AssetClass {
  name: string;
  share: number;
  color: string;
  type: "סחיר" | "אלטרנטיבי";
  desc: string;
}

export default function Chapter9Portfolio() {
  // Pro-Forma States
  const [pgi, setPgi] = useState(1000000); // 1,000,000 ₪
  const [vacancyRate, setVacancyRate] = useState(5.0); // 5%
  const [opexRate, setOpexRate] = useState(30.0); // 30% of EGI
  const [escalationRate, setEscalationRate] = useState(3.0); // 3% CPI bump per year

  // UBS Portfolio Allocations
  const assetAllocation: AssetClass[] = [
    { name: 'מניות גלובליות', share: 28, color: '#4F46E5', type: 'סחיר', desc: 'צמיחת הון מהירה ונזילות גבוהה במדדי מניות ציבוריים.' },
    { name: 'אג"ח ממשלתי ומוסדי', share: 19, color: '#6366F1', type: 'סחיר', desc: 'תזרים בטוח וצמצום תנודתיות התיק.' },
    { name: 'מזומן וקרנות כספיות', share: 10, color: '#818CF8', type: 'סחיר', desc: 'מזומנים לעסקאות הזדמנותיות בטווח קצר.' },
    { name: 'Private Equity (קרנות)', share: 22, color: '#10B981', type: 'אלטרנטיבי', desc: 'חברות פרטיות ורכישות ממונפות לייצור רווחי-יתר.' },
    { name: 'נדל"ן פרטי מניב ישיר', share: 10, color: '#059669', type: 'אלטרנטיבי', desc: 'נכסים פיזיים משביחים המניבים NOI ואינפלציה קבועה.' },
    { name: 'קרנות גידור ומגינים', share: 5, color: '#34D399', type: 'אלטרנטיבי', desc: 'השקעות שונות לצמצום תוצאות שוק שליליות.' },
    { name: 'פרייבט דבט (חוב)', share: 2, color: '#A7F3D0', type: 'אלטרנטיבי', desc: 'מתן אשראי והלוואות בכירות בריבית קבועה.' },
    { name: 'תשתיות וסחורות', share: 2, color: '#FCD34D', type: 'אלטרנטיבי', desc: 'השקעות ריאליות בנכסים מובילים לאנרגיה ותחבורה.' },
  ];

  const selectedCategoryDescription = useMemo(() => {
    return assetAllocation.reduce((acc, current) => {
      acc[current.name] = current.desc;
      return acc;
    }, {} as Record<string, string>);
  }, [assetAllocation]);

  const [activeAsset, setActiveAsset] = useState<string>("Private Equity (קרנות)");

  // Pro-Forma 5 Year Forecast Calculations
  const proFormaLines = useMemo(() => {
    const lines = [];
    let currentPgi = pgi;
    const vDec = vacancyRate / 100;
    const oDec = opexRate / 100;
    const escDec = escalationRate / 100;

    for (let year = 1; year <= 5; year++) {
      const vacancyLoss = currentPgi * vDec;
      const egi = currentPgi - vacancyLoss;
      const opex = egi * oDec;
      const noi = egi - opex;

      lines.push({
        name: `שנה ${year}`,
        פוטנציאל_PGI: Math.round(currentPgi),
        אפקטיבי_EGI: Math.round(egi),
        תפעולי_NOI: Math.round(noi),
        הוצאות_Opex: Math.round(opex),
      });

      // Escalate PGI for next year
      currentPgi = currentPgi * (1 + escDec);
    }

    return lines;
  }, [pgi, vacancyRate, opexRate, escalationRate]);

  return (
    <div className="text-slate-900 space-y-8">
      {/* 5 Year Pro-Forma forecasting */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <span className="p-2 bg-indigo-100 text-indigo-800 rounded-full font-black text-xs uppercase">
            תחזית פיננסית
          </span>
          <h3 className="text-xl font-extrabold tracking-tight">כלי בניית פרו-פורמה (5-Year Pro-Forma Forecast)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">הכנסה פוטנציאלית (PGI לשנה 1):</label>
            <input
              type="number"
              value={pgi}
              step="50000"
              onChange={(e) => setPgi(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">הפרשת וקנסי ואי-גבייה (%):</label>
            <input
              type="number"
              value={vacancyRate}
              step="0.5"
              onChange={(e) => setVacancyRate(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">שיעור הוצאות תפעול OPEX (%):</label>
            <input
              type="number"
              value={opexRate}
              step="1"
              onChange={(e) => setOpexRate(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">שיעור גידול מדד ושכירות (Bumps %):</label>
            <input
              type="number"
              value={escalationRate}
              step="0.5"
              onChange={(e) => setEscalationRate(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500 font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[220px] bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={proFormaLines} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(val) => `₪${(val/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "#0F172A", border: "none", color: "white", borderRadius: "10px" }} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar dataKey="פוטנציאל_PGI" name="פוטנציאל (PGI)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="אפקטיבי_EGI" name="אפקטיבי (EGI)" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="תפעולי_NOI" name="רווח נקי (NOI)" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table display */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black tracking-wider text-slate-500 uppercase">תשומות רווח שנתיות מפתח</span>
              <div className="space-y-3 mt-4">
                {proFormaLines.map((line, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">{line.name}:</span>
                    <div className="text-left font-mono">
                      <span className="text-indigo-600 font-black">₪{line.תפעולי_NOI.toLocaleString()} NOI </span>
                      <span className="text-slate-400"> (EGI: ₪{line.אפקטיבי_EGI.toLocaleString()})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[9px] text-slate-400 mt-4 leading-relaxed">
              * כפי שרואים בקורס, ה-NOI הוא המפתח העליון להערכת שווי נדל"ן מניב. כל שקל של שיפור ב-NOI מתורגם למכפיל שווי נכסי מוגבר בהתאם ל-Cap Rate.
            </p>
          </div>
        </div>
      </div>

      {/* UBS Portfolio Allocator */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <span className="p-2 bg-amber-100 text-amber-800 rounded-full font-black text-xs uppercase">
            אסטרטגיית Family Office
          </span>
          <h3 className="text-xl font-extrabold tracking-tight">הקצאת נכסים לפי מודל ה-UBS המודרני</h3>
        </div>

        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          גופי Family Office שפועלים להגנה וצמיחה מולטי-דורשית משלבים 58% נכסים סחירים ו-42% נכסים אלטרנטיביים (לא סחירים). לחץ על הקלאסים כאן למטה כדי להבינם:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Pie Chart element */}
          <div className="flex flex-col items-center">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="share"
                    onClick={(data) => setActiveAsset(data.name)}
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke={entry.name === activeAsset ? "#0F172A" : "transparent"}
                        strokeWidth={2}
                        className="cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'שיעור בתיק']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Total balance notes */}
            <div className="flex gap-4 text-xs mt-3 font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
                <span>אפיקים סחירים: 58%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                <span>אפיקים אלטרנטיביים: 42%</span>
              </div>
            </div>
          </div>

          {/* Quick descriptions display */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {assetAllocation.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveAsset(item.name)}
                  className={`text-right px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${activeAsset === item.name ? "bg-slate-900 text-white border-slate-900 shadow-sm" : "bg-slate-50 text-slate-700 border-slate-200/60 hover:bg-slate-100"}`}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span>{item.name}</span>
                    <span className="font-mono text-[10px] opacity-70">{item.share}%</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase ${item.type === "סחיר" ? "text-indigo-400" : "text-emerald-400"}`}>{item.type}</span>
                </button>
              ))}
            </div>

            {activeAsset && (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl animate-fade-in text-xs">
                <div className="font-extrabold text-slate-800 text-sm mb-1">{activeAsset}</div>
                <p className="text-slate-600 leading-relaxed font-semibold">{selectedCategoryDescription[activeAsset]}</p>
                <div className="mt-2 text-[10px] font-black text-amber-600 tracking-wider uppercase">
                  הצדקה פיננסית: פרמיית חוסר הנזילות (Illiquidity Premium) המעניקה ביצועי יתר מוסדיים.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
