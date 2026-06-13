import { useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import { Calculator, CheckCircle, Info } from "lucide-react";

interface SubUse {
  name: string;
  area: number;
  rent: number;
  cap: number;
}

export default function Chapter8Residual() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [uses, setUses] = useState<SubUse[]>([
    { name: "מרכול (עוגן)", area: 3475, rent: 80, cap: 8.25 },
    { name: "שטחי מסחר קרקע", area: 4202, rent: 135, cap: 8.25 },
    { name: "מסחר קומה א'", area: 4150, rent: 110, cap: 8.25 },
    { name: "מסחר קומה ב'", area: 3906, rent: 90, cap: 8.25 },
    { name: "משרדים (קומות 3-6)", area: 8392, rent: 45, cap: 9.50 },
  ]);

  const [rentMultiplier, setRentMultiplier] = useState(1.0);
  const [constructionMultiplier, setConstructionMultiplier] = useState(1.0);

  const parkingArea = 20345;
  const parkingCostPerSqm = 2250;
  const upperArea = 24125;
  const upperCostPerSqm = 3500;
  const localFeesArea = 44470;
  const localFeesCostPerSqm = 250;
  
  const designAndLegalRate = 0.10;
  const marketingAndSalesFee = 2030950;
  const contingencyRate = 0.05;
  
  const financingRate = 32440996;
  const developerProfitRate = 0.20;
  const ramiFees = 6200000;
  
  const totalLandSqmAllowed = 19445;
  const physicalLandSizeDunams = 9.48;

  const calculations = useMemo(() => {
    let totalGDV = 0;
    let totalAnnualIncome = 0;
    const items = uses.map((u) => {
      const adjustedRent = u.rent * rentMultiplier;
      const annualIncome = u.area * adjustedRent * 12;
      const value = annualIncome / (u.cap / 100);
      totalAnnualIncome += annualIncome;
      totalGDV += value;
      return { ...u, adjustedRent, annualIncome, value };
    });

    const parkingHardCost = parkingArea * parkingCostPerSqm * constructionMultiplier;
    const upperHardCost = upperArea * upperCostPerSqm * constructionMultiplier;
    const localFeesCost = localFeesArea * localFeesCostPerSqm * constructionMultiplier;
    
    const totalHardCosts = parkingHardCost + upperHardCost + localFeesCost;
    const designAndLegalCost = totalHardCosts * designAndLegalRate;
    const withMarketing = totalHardCosts + designAndLegalCost + marketingAndSalesFee;
    const contingencyCost = withMarketing * contingencyRate;

    const totalBuildCostsNoFinance = withMarketing + contingencyCost;
    const developerProfitValue = totalGDV * developerProfitRate;

    const residualBeforeRami = totalGDV - totalBuildCostsNoFinance - financingRate - developerProfitValue;
    const finalLandValue = Math.max(0, residualBeforeRami - ramiFees);

    const landSqmValue = finalLandValue / totalLandSqmAllowed;
    const landDunamValue = finalLandValue / physicalLandSizeDunams;

    return {
      items, totalAnnualIncome, totalGDV,
      totalHardCosts, designAndLegalCost, contingencyCost, totalBuildCostsNoFinance,
      developerProfitValue, finalLandValue, landSqmValue, landDunamValue,
    };
  }, [uses, rentMultiplier, constructionMultiplier]);

  const handleValueChange = (index: number, key: "rent" | "cap", val: number) => {
    const updated = [...uses];
    updated[index] = { ...updated[index], [key]: val };
    setUses(updated);
  };

  const pieData = calculations.items.map(item => ({
    name: item.name,
    value: item.value,
  }));
  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const costsData = [
    {
      name: 'עלויות',
      'בנייה ישירה (Hard)': calculations.totalHardCosts,
      'תכנון ויועצים (Soft)': calculations.designAndLegalCost,
      'שיווק ותיווך': marketingAndSalesFee,
      'בצ"מ': calculations.contingencyCost
    }
  ];

  const waterfallData = [
    { name: 'GDV פרויקט', start: 0, end: calculations.totalGDV, fill: '#10b981', value: calculations.totalGDV, isTotal: true },
    { name: 'עלויות הקמה', start: calculations.totalGDV - calculations.totalBuildCostsNoFinance, end: calculations.totalGDV, fill: '#ef4444', value: -calculations.totalBuildCostsNoFinance, isTotal: false },
    { name: 'מימון', start: calculations.totalGDV - calculations.totalBuildCostsNoFinance - financingRate, end: calculations.totalGDV - calculations.totalBuildCostsNoFinance, fill: '#f97316', value: -financingRate, isTotal: false },
    { name: 'רווח יזמי (20%)', start: calculations.totalGDV - calculations.totalBuildCostsNoFinance - financingRate - calculations.developerProfitValue, end: calculations.totalGDV - calculations.totalBuildCostsNoFinance - financingRate, fill: '#f59e0b', value: -calculations.developerProfitValue, isTotal: false },
    { name: 'מסים והיטלים', start: calculations.finalLandValue, end: calculations.finalLandValue + ramiFees, fill: '#ef4444', value: -ramiFees, isTotal: false },
    { name: 'שווי קרקע גזור', start: 0, end: calculations.finalLandValue, fill: '#3b82f6', value: calculations.finalLandValue, isTotal: true },
  ];

  const formatCurrency = (val: number) => `₪${Math.round(val).toLocaleString()}`;
  const formatCompact = (val: number) => `₪${(val / 1000000).toFixed(1)}M`;

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl text-slate-900 w-full animate-fade-in" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">נדל"ן יזמי: מודל החילוץ (Residual)</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">כדאיות וגזירת שווי מגרש פנוי</h2>
          <p className="text-sm text-slate-500 font-semibold mt-1">חישוב השווי הריאלי של הקרקע לפי ייעוד מעורב.</p>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { step: 1, label: "שלב א': חישוב GDV", desc: "שווי פרויקט גמור" },
          { step: 2, label: "שלב ב': עלויות", desc: "הקמה, תכנון ובצ\"מ" },
          { step: 3, label: "שלב ג': חילוץ הקרקע", desc: "גרף מפל (Waterfall)" }
        ].map(s => (
          <button
            key={s.step}
            onClick={() => setActiveStep(s.step)}
            className={`flex-1 text-right p-4 rounded-2xl border-2 transition-all min-w-[200px] shrink-0 ${
              activeStep === s.step ? "border-[#E21E26] bg-red-50/50 shadow-md" : "border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-black uppercase tracking-wider ${activeStep === s.step ? "text-[#E21E26]" : "text-slate-400"}`}>שלב {s.step}</span>
              {activeStep === s.step && <div className="w-2 h-2 rounded-full bg-[#E21E26]" />}
            </div>
            <h3 className={`text-sm font-bold ${activeStep === s.step ? "text-slate-900" : "text-slate-600"}`}>{s.label}</h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{s.desc}</p>
          </button>
        ))}
      </div>

      {/* STEP 1: GDV */}
      {activeStep === 1 && (
        <div className="animate-fade-in space-y-6">
          <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl">
            <h4 className="text-sm font-black text-slate-800 mb-1">לחץ שכירות (הרחקת שוק)</h4>
            <div className="flex items-center gap-4">
              <input
                type="range" min="0.7" max="1.3" step="0.05" value={rentMultiplier}
                onChange={(e) => setRentMultiplier(parseFloat(e.target.value))}
                className="w-full accent-[#E21E26] h-1.5 bg-slate-200 rounded-full"
              />
              <span className="text-xs font-bold text-[#E21E26] min-w-[60px] text-left">{(rentMultiplier * 100).toFixed(0)}%</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3 overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 bg-slate-50">
                    <th className="p-3 text-right rounded-tr-xl">סוג שימוש</th>
                    <th className="p-3 text-center">שטח (מ"ר)</th>
                    <th className="p-3 text-center">שירות למ"ר (₪)</th>
                    <th className="p-3 text-center">היוון (Cap)</th>
                    <th className="p-3 text-left rounded-tl-xl">שווי חזוי</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.items.map((item, index) => (
                    <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="p-3 font-bold text-slate-800">{item.name}</td>
                      <td className="p-3 text-center font-mono">{item.area.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <input
                          type="number" value={Math.round(item.rent)}
                          onChange={(e) => handleValueChange(index, "rent", parseFloat(e.target.value) || 0)}
                          className="w-16 text-center text-xs bg-slate-100 border border-slate-200 rounded py-1 font-bold"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="number" step="0.05" value={item.cap}
                          onChange={(e) => handleValueChange(index, "cap", parseFloat(e.target.value) || 0)}
                          className="w-16 text-center text-xs bg-slate-100 border border-slate-200 rounded py-1 font-bold"
                        />%
                      </td>
                      <td className="p-3 text-left font-black text-indigo-700 font-mono">{formatCurrency(item.value)}</td>
                    </tr>
                  ))}
                  <tr className="bg-indigo-50/50 font-bold border-t-2 border-indigo-100">
                    <td className="p-3 font-black text-indigo-900">סה"כ (GDV)</td>
                    <td className="p-3 text-center font-mono">24,125</td>
                    <td colSpan={2}></td>
                    <td className="p-3 text-left font-black text-indigo-900 font-mono text-sm">{formatCurrency(calculations.totalGDV)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="w-full lg:w-1/3 h-64 bg-slate-50 rounded-2xl border border-slate-100 p-2 flex flex-col items-center justify-center relative">
              <span className="absolute top-4 right-4 text-[10px] font-black uppercase text-slate-400">התפלגות GDV</span>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} stroke="none">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip formatter={(val: number) => formatCurrency(val)} contentStyle={{ borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: COSTS */}
      {activeStep === 2 && (
        <div className="animate-fade-in space-y-6">
          <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl">
            <h4 className="text-sm font-black text-slate-800 mb-1">הוצאות בנייה (Hard Costs)</h4>
            <div className="flex items-center gap-4">
              <input
                type="range" min="0.8" max="1.5" step="0.05" value={constructionMultiplier}
                onChange={(e) => setConstructionMultiplier(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded-full"
              />
              <span className="text-xs font-bold text-amber-600 min-w-[60px] text-left">{(constructionMultiplier * 100).toFixed(0)}%</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2">
              <div className="space-y-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-xs">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500 font-bold">בנייה ישירה (Hard Costs):</span>
                  <span className="font-black text-slate-800">{formatCurrency(calculations.totalHardCosts)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500 font-bold">תכנון, פיקוח (Soft 10%):</span>
                  <span className="font-black text-slate-800">{formatCurrency(calculations.designAndLegalCost)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500 font-bold">בצ"מ (5%):</span>
                  <span className="font-black text-slate-800">{formatCurrency(calculations.contingencyCost)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500 font-bold">שיווק, פרסום ותיווך:</span>
                  <span className="font-black text-slate-800">{formatCurrency(marketingAndSalesFee)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-900 font-black">סה"כ עלויות מיועדות:</span>
                  <span className="font-black text-[#E21E26] text-sm">{formatCurrency(calculations.totalBuildCostsNoFinance)}</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costsData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" hide />
                  <RechartsTooltip formatter={(val: number) => formatCurrency(val)} contentStyle={{ borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  <Bar dataKey="בנייה ישירה (Hard)" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} barSize={40} />
                  <Bar dataKey="תכנון ויועצים (Soft)" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="שיווק ותיווך" stackId="a" fill="#3b82f6" />
                  <Bar dataKey='בצ"מ' stackId="a" fill="#10b981" radius={[8, 8, 8, 8]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: WATERFALL & RESIDUAL */}
      {activeStep === 3 && (
        <div className="animate-fade-in space-y-8">
          
          <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-4 pt-8 h-80 relative">
            <span className="absolute top-4 right-6 text-[10px] font-black uppercase text-slate-400">תרשים גזירה (Waterfall) - במיליוני ₪</span>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 20, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(val) => (val / 1000000).toFixed(0)} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  cursor={{fill: 'transparent'}}
                  formatter={(val: any, name: string, props: any) => [formatCurrency(props.payload.value), "סכום"]}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', textAlign: 'right' }} 
                />
                <Bar dataKey={(entry) => [entry.start, entry.end]} radius={[4, 4, 4, 4]}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-emerald-100 p-5 rounded-3xl flex flex-col items-center justify-center text-center shadow-md">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 block">הצעה מקסימלית במכרז</span>
              <span className="text-2xl font-black text-slate-900 font-mono">{formatCurrency(calculations.finalLandValue)}</span>
            </div>
            <div className="bg-white border border-slate-100 p-5 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">שווי קרקע למ"ר מבונה</span>
              <span className="text-xl font-black text-slate-700 font-mono">{formatCurrency(calculations.landSqmValue)}</span>
            </div>
            <div className="bg-white border border-slate-100 p-5 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">שווי קרקע לדונם פיזי</span>
              <span className="text-xl font-black text-slate-700 font-mono">{formatCompact(calculations.landDunamValue)}</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
