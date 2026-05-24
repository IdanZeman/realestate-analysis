import { useState, useMemo } from "react";
import { GLOSSARY } from "../courseContent";

export default function TermsGlossary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("הכל");

  const categories = useMemo(() => {
    const list = new Set<string>();
    GLOSSARY.forEach((g) => list.add(g.category));
    return ["הכל", ...Array.from(list)];
  }, []);

  const filteredGlossary = useMemo(() => {
    return GLOSSARY.filter((g) => {
      const matchSearch =
        g.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === "הכל" || g.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl text-slate-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-amber-100 text-amber-800 rounded-full font-black text-xs uppercase">
            אנציקלופדיה
          </span>
          <h3 className="text-xl font-extrabold tracking-tight">מילון מונחי נדל"ן מפתח (מדריך מהיר)</h3>
        </div>

        {/* Categories filters tabs */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="חפש מונח או פירוש (לדוגמה: DSCR, שמאות, חכירה...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 hover:bg-white hover:border-indigo-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 placeholder-slate-400"
        />
      </div>

      {filteredGlossary.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm font-semibold">
          לא נמצאו מונחים התואמים את החיפוש. נסה חיפוש אחר!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGlossary.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md hover:border-indigo-100/60 hover:translate-y-[-2px] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-extrabold text-slate-900 text-sm">{item.term}</span>
                  <span className="text-[9px] bg-slate-200/60 text-slate-500 font-extrabold px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>
                <p className="text-slate-600 text-xs font-semibold leading-relaxed">{item.definition}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
