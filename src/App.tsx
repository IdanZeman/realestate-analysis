import { useState, useMemo, useEffect } from "react";
import { 
  BookOpen, 
  HelpCircle, 
  Sliders, 
  Search, 
  CheckCircle, 
  Bookmark, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Scale, 
  Calculator, 
  ShieldAlert,
  Percent,
  ListFilter,
  Menu,
  X
} from "lucide-react";
import { chaptersData, COURSE_TITLE, COURSE_SUBTITLE } from "./courseContent";

// Interactive simulators components
import Chapter1Simulator from "./components/Chapter1Simulator";
import Chapter2Waterfall from "./components/Chapter2Waterfall";
import Chapter3Comparison from "./components/Chapter3Comparison";
import Chapter6Leverage from "./components/Chapter6Leverage";
import Chapter8Residual from "./components/Chapter8Residual";
import Chapter9Portfolio from "./components/Chapter9Portfolio";
import QuizCard from "./components/QuizCard";
import TermsGlossary from "./components/TermsGlossary";

export default function App() {
  const [activeTab, setActiveTab] = useState<"read" | "sims" | "quiz" | "terms">("read");
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChaptersDropdownOpen, setIsChaptersDropdownOpen] = useState(false);
  const [isFontPopoverOpen, setIsFontPopoverOpen] = useState(false);

  // Font Size selection state ("sm" | "base" | "lg" | "xl")
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">(() => {
    try {
      const saved = localStorage.getItem("shiftly_font_size");
      return (saved as "sm" | "base" | "lg" | "xl") || "base";
    } catch {
      return "base";
    }
  });

  useEffect(() => {
    localStorage.setItem("shiftly_font_size", fontSize);
  }, [fontSize]);

  const fontSizeClasses = {
    paragraph: {
      sm: "text-[11px] md:text-xs",
      base: "text-xs md:text-sm",
      lg: "text-sm md:text-base",
      xl: "text-base md:text-lg"
    },
    intro: {
      sm: "text-[11px] md:text-xs font-semibold",
      base: "text-xs font-semibold",
      lg: "text-xs md:text-sm font-semibold",
      xl: "text-sm md:text-base font-semibold"
    },
    sectionTitle: {
      sm: "text-sm md:text-base",
      base: "text-base md:text-lg",
      lg: "text-lg md:text-xl",
      xl: "text-xl md:text-2xl"
    },
    keyTermDef: {
      sm: "text-[10px]",
      base: "text-[11px]",
      lg: "text-xs",
      xl: "text-sm"
    },
    accent: {
      sm: "text-[11px]",
      base: "text-xs",
      lg: "text-sm",
      xl: "text-base"
    }
  };
  
  // Interactive student progress (saved in localStorage)
  const [completedChapters, setCompletedChapters] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("shiftly_completed_chapters");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarkedSections, setBookmarkedSections] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("shiftly_bookmarked_sections");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("shiftly_completed_chapters", JSON.stringify(completedChapters));
  }, [completedChapters]);

  useEffect(() => {
    localStorage.setItem("shiftly_bookmarked_sections", JSON.stringify(bookmarkedSections));
  }, [bookmarkedSections]);

  const toggleChapterComplete = (id: number) => {
    setCompletedChapters((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleBookmark = (sectionKey: string) => {
    setBookmarkedSections((prev) =>
      prev.includes(sectionKey) ? prev.filter((item) => item !== sectionKey) : [...prev, sectionKey]
    );
  };

  // Completion stats
  const completionPercentage = useMemo(() => {
    return Math.round((completedChapters.length / chaptersData.length) * 100);
  }, [completedChapters]);

  // Search filter across all chapters & sections
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    interface SearchMatch {
      chapterId: number;
      chapterTitle: string;
      sectionTitle: string;
      matchedText: string;
    }

    const matches: SearchMatch[] = [];
    chaptersData.forEach((ch) => {
      ch.sections.forEach((sec) => {
        sec.paragraphs.forEach((p) => {
          if (p.toLowerCase().includes(searchQuery.toLowerCase()) || sec.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            matches.push({
              chapterId: ch.id,
              chapterTitle: ch.title,
              sectionTitle: sec.title,
              matchedText: p,
            });
          }
        });
      });
    });
    return matches;
  }, [searchQuery]);

  // Get current active chapter object
  const activeChapter = useMemo(() => {
    return chaptersData.find((ch) => ch.id === selectedChapterId) || chaptersData[0];
  }, [selectedChapterId]);

  // Highlighting matched text in paragraph helper
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;
    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 text-slate-900 font-bold rounded px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC]">
      
      {/* Premium Corporate Sticky Navbar */}
      <header className="sticky top-0 z-50 w-full bg-slate-900 border-b-2 border-[#E21E26] text-white shadow-md select-none">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Brand & Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 bg-[#E21E26] rounded-sm transform rotate-45"></span>
            <span className="font-extrabold text-xs md:text-sm tracking-wide text-white font-sans">
              ניתוח השקעות נדל"ן
            </span>
          </div>

          {/* Current Location Badge (Mobile only) */}
          <div className="flex md:hidden items-center gap-1.5 bg-slate-800/90 border border-slate-700/60 px-2.5 py-1 rounded-full text-[10px] font-black text-[#E21E26] shrink-0">
            <span className="w-1.5 h-1.5 bg-[#E21E26] rounded-full"></span>
            <span>
              {activeTab === "read" && "ספר לימוד"}
              {activeTab === "sims" && "סימולטורים"}
              {activeTab === "quiz" && "בחן את עצמך"}
              {activeTab === "terms" && "מילון מונחים"}
            </span>
          </div>

          {/* Nav Links - Desktop only */}
          <nav className="hidden md:flex items-center gap-1">
            <div className="relative">
              <button
                onClick={() => {
                  setActiveTab("read");
                  setSearchQuery("");
                  setIsChaptersDropdownOpen(!isChaptersDropdownOpen);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold transition-all shrink-0 cursor-pointer ${
                  activeTab === "read"
                    ? "bg-[#E21E26] text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>ספר לימוד</span>
                <span className="text-[8px] opacity-70">▼</span>
              </button>

              {isChaptersDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 max-h-[420px] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-2 text-right text-white">
                  <div className="px-3 py-1.5 text-[9px] font-black text-slate-400 border-b border-slate-800 uppercase tracking-widest mb-1.5">
                    בחר פרק לקריאה מהירה:
                  </div>
                  <div className="space-y-0.5">
                    {chaptersData.map((ch) => {
                      const isSelected = selectedChapterId === ch.id && activeTab === "read";
                      const isCompleted = completedChapters.includes(ch.id);
                      return (
                        <button
                          key={ch.id}
                          onClick={() => {
                            setSelectedChapterId(ch.id);
                            setActiveTab("read");
                            setIsChaptersDropdownOpen(false);
                          }}
                          className={`w-full text-right px-3 py-2 rounded-xl text-[11px] font-extrabold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? "bg-[#E21E26] text-white"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <span className="truncate pl-2">פרק {ch.id}: {ch.title}</span>
                          {isCompleted && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => { setActiveTab("sims"); setSearchQuery(""); setIsChaptersDropdownOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold transition-all shrink-0 cursor-pointer ${
                activeTab === "sims"
                  ? "bg-[#E21E26] text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>סימולטורים</span>
            </button>

            <button
              onClick={() => { setActiveTab("quiz"); setSearchQuery(""); setIsChaptersDropdownOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold transition-all shrink-0 cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-[#E21E26] text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>בחן את עצמך</span>
            </button>

            <button
              onClick={() => { setActiveTab("terms"); setSearchQuery(""); setIsChaptersDropdownOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold transition-all shrink-0 cursor-pointer ${
                activeTab === "terms"
                  ? "bg-[#E21E26] text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>מילון מונחים</span>
            </button>
          </nav>

          {/* Right side controls: mobile hamburger or desktop progress */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Interactive Progress Indicator widget (Desktop/Tablet) */}
            <div className="hidden xs:flex items-center gap-2 text-[10px] font-black font-mono">
              <span className="text-white">{completionPercentage}%</span>
              <div className="w-12 md:w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-[#E21E26] transition-all duration-500" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Mobile Hamburger toggle button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[#E21E26] rounded-full transition-all active:scale-95 flex items-center justify-center cursor-pointer"
              aria-label={isMenuOpen ? "סגור תפריט" : "פתח תפריט"}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile menu dropdown layout overlay (only when isMenuOpen is true on mobile) */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/98 backdrop-blur-lg border-b-2 border-[#E21E26] shadow-2xl animate-fade-in z-45 flex flex-col p-3 gap-1">
            <div className="flex flex-col">
              <button
                onClick={() => {
                  setActiveTab("read");
                  setSearchQuery("");
                  setIsChaptersDropdownOpen(!isChaptersDropdownOpen);
                }}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-extrabold transition-all border border-slate-800 shrink-0 cursor-pointer ${
                  activeTab === "read"
                    ? "bg-[#E21E26] text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>ספר הלימוד המלא ({chaptersData.length} פרקים)</span>
                </div>
                <span className="text-[10px]">{isChaptersDropdownOpen ? "▲" : "▼"}</span>
              </button>

              {isChaptersDropdownOpen && (
                <div className="flex flex-col gap-1 pr-4 pl-2 py-1.5 bg-slate-950/40 rounded-xl mt-1 max-h-[240px] overflow-y-auto border border-row-800">
                  {chaptersData.map((ch) => {
                    const isSelected = selectedChapterId === ch.id && activeTab === "read";
                    const isCompleted = completedChapters.includes(ch.id);
                    return (
                      <button
                        key={ch.id}
                        onClick={() => {
                          setSelectedChapterId(ch.id);
                          setActiveTab("read");
                          setIsChaptersDropdownOpen(false);
                          setIsMenuOpen(false);
                        }}
                        className={`text-right px-3 py-2.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-[#E21E26]/20 text-white border border-[#E21E26]/30"
                            : "text-slate-300 hover:text-white hover:bg-slate-800"
                        }`}
                      >
                        <span className="truncate pr-1">פרק {ch.id}: {ch.title}</span>
                        {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => { setActiveTab("sims"); setSearchQuery(""); setIsMenuOpen(false); setIsChaptersDropdownOpen(false); }}
              className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl text-xs font-extrabold transition-all text-right shrink-0 cursor-pointer ${
                activeTab === "sims"
                  ? "bg-[#E21E26] text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0 text-white" />
              <span>מרכז סימולטורים וארגז חול</span>
            </button>

            <button
              onClick={() => { setActiveTab("quiz"); setSearchQuery(""); setIsMenuOpen(false); setIsChaptersDropdownOpen(false); }}
              className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl text-xs font-extrabold transition-all text-right shrink-0 cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-[#E21E26] text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0 text-white" />
              <span>בחן את עצמך (הכנה למבחן)</span>
            </button>

            <button
              onClick={() => { setActiveTab("terms"); setSearchQuery(""); setIsMenuOpen(false); setIsChaptersDropdownOpen(false); }}
              className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl text-xs font-extrabold transition-all text-right shrink-0 cursor-pointer ${
                activeTab === "terms"
                  ? "bg-[#E21E26] text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <FileText className="w-4 h-4 shrink-0 text-white" />
              <span>מילון מונחי נדל"ן מפתח</span>
            </button>
          </div>
        )}
      </header>

      {/* Premium Elegant Corporate Header Banner */}
      <div className="relative overflow-hidden bg-slate-950 text-white border-b border-slate-800">
        
        {/* Crisp grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-20"></div>
        
        {/* Side professional ambient light */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#E21E26]/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#E21E26]/5 rounded-full blur-2xl"></div>

        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            
            {/* Title Block */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-slate-800 text-slate-200 border border-slate-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  תכנית הכשרה מקיפה
                </span>
                <span className="bg-[#E21E26]/10 text-[#E21E26] border border-[#E21E26]/30 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  פיננסים ויזמות נדל"ן
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                {COURSE_TITLE}
              </h1>
              
              <p className="text-slate-400 text-xs md:text-sm font-semibold max-w-2xl leading-relaxed">
                {COURSE_SUBTITLE}
              </p>
            </div>

            {/* Quick stats board */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 min-w-[220px] shadow-xl">
              <div className="relative">
                {/* SVG circular progress indicator */}
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="#1e293b" strokeWidth="4" fill="transparent" />
                  <circle cx="24" cy="24" r="20" stroke="#E21E26" strokeWidth="4" fill="transparent"
                    strokeDasharray={2 * Math.PI * 20}
                    strokeDashoffset={2 * Math.PI * 20 * (1 - completionPercentage / 100)}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-xs text-[#E21E26] font-mono">
                  {completionPercentage}%
                </div>
              </div>
              
              <div>
                <span className="text-[9px] text-slate-400 font-black tracking-wider uppercase block">התקדמות הלמידה</span>
                <span className="text-xs font-bold text-white block mt-0.5">הושלמו {completedChapters.length} מתוך {chaptersData.length} פרקים</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Main Content Workspace Layout */}
      <div className="max-w-6xl mx-auto px-4 py-8 relative pb-24">
        
        {/* Universal instant search bar */}
        <div className="mb-10 relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="חפש מונח, פסיקה, נוסחה או כלי מכל חומר הקורס..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl py-4 pr-11 pl-4 shadow-md hover:border-[#E21E26] focus:border-[#E21E26] focus:ring-4 focus:ring-[#E21E26]/10 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 left-4 text-xs font-bold text-slate-400 hover:text-slate-600 my-auto h-fit"
            >
              נקה
            </button>
          )}
        </div>

        {/* Search Results Drawer */}
        {searchQuery.trim() !== "" && (
          <div className="bg-white border-2 border-[#E21E26]/20 p-6 rounded-[2rem] shadow-xl mb-12 animate-fade-in">
            <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E21E26]" />
              <span>תוצאות חיפוש מהירות: {searchResults.length} התאמות שנמצאו</span>
            </h3>
            
            <p className="text-xs text-slate-500 mb-4 font-semibold">
              לחץ על כל התאמה כדי לנווט לפרק המתאים בספר הלימוד.
            </p>

            {searchResults.length === 0 ? (
              <p className="text-slate-400 text-xs font-bold text-center py-4">
                לא נמצאו מונחים או נושאים תחת המילים האלו. נסה מילים כלליות יותר (למשל: דייר, ארנונה, שווי, רווח...).
              </p>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {searchResults.map((match, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedChapterId(match.chapterId);
                      setActiveTab("read");
                      setSearchQuery("");
                    }}
                    className="w-full text-right p-3.5 bg-slate-50 hover:bg-[#E21E26]/5 rounded-xl border border-slate-200/50 transition-all text-xs flex flex-col gap-1.5"
                  >
                    <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-wider text-slate-500">
                      <span>{match.chapterTitle} &gt; {match.sectionTitle}</span>
                      <span className="text-indigo-600 font-extrabold">ניווט מהיר ←</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-semibold">
                      {highlightText(match.matchedText, searchQuery)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MAIN TAB SWITCHING ENGINE */}
        {activeTab === "read" && (
          <div className="max-w-4xl mx-auto w-full bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8 min-h-[600px] animate-fade-in">
              
              {/* Header inside the chapter reader */}
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100 pb-6">
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-50 text-[#E21E26] border border-[#E21E26]/20 font-black text-[9px] uppercase px-2.5 py-1 rounded-full">
                      פרק {activeChapter.id} מתוך {chaptersData.length}
                    </span>
                    <span className="text-slate-400 text-xs font-bold font-mono">• {activeChapter.sections.length} נושאי עומק</span>
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-2 pb-1 leading-snug">
                     {activeChapter.title}
                  </h2>
                  <p className={`text-slate-500 leading-relaxed mt-1 transition-all ${fontSizeClasses.intro[fontSize]}`}>{activeChapter.intro}</p>
                </div>

                {/* Controls container (Only completed mark) */}
                <div className="flex items-center gap-3 shrink-0">
                  
                  {/* Chapter Completed Button toggle */}
                  <button
                    onClick={() => toggleChapterComplete(activeChapter.id)}
                    className={`px-4 py-2 rounded-full font-extrabold text-[11px] transition-all flex items-center gap-1.5 shrink-0 select-none cursor-pointer ${
                      completedChapters.includes(activeChapter.id)
                        ? "bg-emerald-100 text-emerald-800 border-transparent shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{completedChapters.includes(activeChapter.id) ? "מסומן כנקרא" : "סמן כנקרא"}</span>
                  </button>

                </div>

              </div>

              {/* RENDER SECTIONS INDEX WORD FOR WORD WITHOUT OMITTING A SINGLE WORD */}
              <div className="space-y-8">
                {activeChapter.sections.map((section, sidx) => {
                  const sectionKey = `${activeChapter.id}-${sidx}`;
                  const isBookmarked = bookmarkedSections.includes(sectionKey);

                  return (
                    <div key={sidx} className="space-y-4 animate-fade-in scrolling-section">
                      
                      {/* Section heading */}
                      <div className="flex justify-between items-center group">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-[#E21E26] rounded-full"></span>
                          <h3 className={`font-black text-slate-800 tracking-tight leading-snug transition-all ${fontSizeClasses.sectionTitle[fontSize]}`}>
                            {section.title}
                          </h3>
                        </div>

                        {/* Toggle bookmark */}
                        <button
                          onClick={() => toggleBookmark(sectionKey)}
                          className={`p-1.5 rounded-full hover:bg-slate-100 transition-all cursor-pointer ${isBookmarked ? "text-[#E21E26] bg-red-50" : "text-slate-300 hover:text-slate-500"}`}
                          title={isBookmarked ? "הסר סימניה" : "סמן נושא זה"}
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      {/* Accent text highlight if exists */}
                      {section.accentText && (
                        <div className={`p-4 bg-red-50/70 border border-[#E21E26]/20 rounded-2xl font-extrabold text-[#E21E26] leading-relaxed shadow-sm transition-all ${fontSizeClasses.accent[fontSize]}`}>
                          {section.accentText}
                        </div>
                      )}

                      {/* Paragraphs of text */}
                      <div className="space-y-3.5 pl-2">
                        {section.paragraphs.map((p, pidx) => {
                          const isFormula = p.includes("=") || p.includes("*") || p.includes("+");
                          
                          return (
                            <p
                              key={pidx}
                              className={`text-slate-700 leading-relaxed font-semibold transition-all ${
                                isFormula
                                  ? "p-4 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-center text-indigo-700 overflow-x-auto shadow-inner " + (fontSize === "sm" ? "text-xs" : fontSize === "base" ? "text-sm" : fontSize === "lg" ? "text-base" : "text-lg")
                                  : fontSizeClasses.paragraph[fontSize]
                              }`}
                            >
                              {p}
                            </p>
                          );
                        })}
                      </div>

                      {/* Key definitions in the section */}
                      {section.keyTerms && section.keyTerms.length > 0 && (
                        <div className="mt-4 bg-slate-50/70 border border-slate-100 p-4 rounded-3xl space-y-2.5 shadow-sm">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">מונחי מפתח לפסקה:</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {section.keyTerms.map((kt, ktidx) => (
                              <div key={ktidx} className="bg-white p-3 rounded-2xl border border-slate-100 text-xs shadow-sm">
                                <span className="font-extrabold text-indigo-600 block mb-0.5">{kt.term}</span>
                                <p className={`text-slate-500 leading-normal font-semibold transition-all ${fontSizeClasses.keyTermDef[fontSize]}`}>{kt.definition}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              {/* Sidebar Next Chapter Control Footer bottom */}
              <div className="pt-8 border-t border-slate-100 flex justify-between items-center text-xs select-none">
                {selectedChapterId > 1 ? (
                  <button
                    onClick={() => setSelectedChapterId((id) => id - 1)}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 font-extrabold cursor-pointer"
                  >
                    <span>→</span>
                    <span>לפרק הקודם ({selectedChapterId - 1})</span>
                  </button>
                ) : (
                  <div></div>
                )}

                {selectedChapterId < chaptersData.length ? (
                  <button
                    onClick={() => setSelectedChapterId((id) => id + 1)}
                    className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-900 font-extrabold cursor-pointer"
                  >
                    <span>לפרק הבא ({selectedChapterId + 1})</span>
                    <span>←</span>
                  </button>
                ) : (
                  <div className="text-[10px] text-emerald-600 font-black uppercase">
                    הגעת לסוף ספר הלימוד! מומלץ לגשת לסימולטורים.
                  </div>
                )}
              </div>

          </div>
        )}

        {/* SIMULATORS AND SANDBOX ZONE */}
        {activeTab === "sims" && (
          <div className="space-y-12">
            
            {/* Navigation selector for different simulators */}
            <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-md">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2.5 text-center">בחר איזה סימולטור ברצונך לבחון מתוך חומר הקורס</span>
              
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                <button
                  onClick={() => setSelectedChapterId(1)}
                  className={`py-2 px-3 rounded-xl text-center text-[11px] font-bold border transition-all ${selectedChapterId === 1 ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-700 border-slate-200/60 hover:bg-slate-100"}`}
                >
                  <span>1. תשואה נדרשת</span>
                </button>
                <button
                  onClick={() => setSelectedChapterId(2)}
                  className={`py-2 px-3 rounded-xl text-center text-[11px] font-bold border transition-all ${selectedChapterId === 2 ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-700 border-slate-200/60 hover:bg-slate-100"}`}
                >
                  <span>2. Waterfall GP/LP</span>
                </button>
                <button
                  onClick={() => setSelectedChapterId(3)}
                  className={`py-2 px-3 rounded-xl text-center text-[11px] font-bold border transition-all ${selectedChapterId === 3 ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-700 border-slate-200/60 hover:bg-slate-100"}`}
                >
                  <span>3. ברוטו מול נטו-NNN</span>
                </button>
                <button
                  onClick={() => setSelectedChapterId(6)}
                  className={`py-2 px-3 rounded-xl text-center text-[11px] font-bold border transition-all ${selectedChapterId === 6 ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-700 border-slate-200/60 hover:bg-slate-100"}`}
                >
                  <span>6. מינוף וכיסוי חוב</span>
                </button>
                <button
                  onClick={() => setSelectedChapterId(8)}
                  className={`py-2 px-3 rounded-xl text-center text-[11px] font-bold border transition-all ${selectedChapterId === 8 ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-700 border-slate-200/60 hover:bg-slate-100"}`}
                >
                  <span>8. מודל חילוץ קרקע</span>
                </button>
                <button
                  onClick={() => setSelectedChapterId(9)}
                  className={`py-2 px-3 rounded-xl text-center text-[11px] font-bold border transition-all ${selectedChapterId === 9 ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-700 border-slate-200/60 hover:bg-slate-100"}`}
                >
                  <span>9. פרו-פורמה ופורטפוליו</span>
                </button>
              </div>
            </div>

            {/* Simulated calculator blocks */}
            <div className="animate-fade-in">
              {selectedChapterId === 1 && <Chapter1Simulator />}
              {selectedChapterId === 2 && <Chapter2Waterfall />}
              {selectedChapterId === 3 && <Chapter3Comparison />}
              {selectedChapterId === 6 && <Chapter6Leverage />}
              {selectedChapterId === 8 && <Chapter8Residual />}
              {selectedChapterId === 9 && <Chapter9Portfolio />}

              {![1, 2, 3, 6, 8, 9].includes(selectedChapterId) && (
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 text-center shadow-md space-y-3">
                  <Calculator className="w-12 h-12 text-slate-400 mx-auto" />
                  <p className="text-slate-500 text-sm font-bold">לא מופו סימולציות ייעודיות לפרק זה. אנא בחר פרק אחר (1, 2, 3, 6, 8, או 9).</p>
                  <button
                    onClick={() => setSelectedChapterId(1)}
                    className="px-6 py-2 bg-indigo-600 text-white font-extrabold text-xs rounded-full"
                  >
                    עבור לסימולטור 1
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* SELF TESTING ASSESSMENT ZONE */}
        {activeTab === "quiz" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <QuizCard fontSize={fontSize} />
          </div>
        )}

        {/* GENERAL TERMS SEARCH INTERX */}
        {activeTab === "terms" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <TermsGlossary fontSize={fontSize} />
          </div>
        )}

      </div>

      {/* Floating Sticky Font Size Selector - Bottom Left Corner */}
      <div 
        className="fixed bottom-16 left-4 md:left-6 z-[100] flex flex-col items-center gap-2 select-none"
        dir="rtl"
        id="font-size-sticky-container"
      >
        {/* Expanded Options Menu */}
        {isFontPopoverOpen && (
          <div 
            className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-1.5 rounded-2xl shadow-2xl flex flex-col items-center gap-1.5 animate-fade-in mb-1"
            id="font-size-options-panel"
          >
            <button
              onClick={() => { setFontSize("xl"); setIsFontPopoverOpen(false); }}
              className={`w-8 h-8 rounded-xl text-base transition-all cursor-pointer flex items-center justify-center ${
                fontSize === "xl" ? "bg-amber-400 text-slate-900 font-black shadow-md" : "text-slate-600 hover:bg-slate-100 font-extrabold"
              }`}
              title="גופן ענק (א++)"
            >
              א++
            </button>
            <button
              onClick={() => { setFontSize("lg"); setIsFontPopoverOpen(false); }}
              className={`w-8 h-8 rounded-xl text-sm transition-all cursor-pointer flex items-center justify-center ${
                fontSize === "lg" ? "bg-amber-400 text-slate-900 font-black shadow-md" : "text-slate-600 hover:bg-slate-100 font-bold"
              }`}
              title="גופן גדול (א+)"
            >
              א+
            </button>
            <button
              onClick={() => { setFontSize("base"); setIsFontPopoverOpen(false); }}
              className={`w-8 h-8 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center ${
                fontSize === "base" ? "bg-amber-400 text-slate-900 font-black shadow-md" : "text-slate-600 hover:bg-slate-100 font-semibold"
              }`}
              title="גופן רגיל (א)"
            >
              א
            </button>
            <button
              onClick={() => { setFontSize("sm"); setIsFontPopoverOpen(false); }}
              className={`w-8 h-8 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center ${
                fontSize === "sm" ? "bg-amber-400 text-slate-900 font-black shadow-md" : "text-slate-600 hover:bg-slate-100 font-semibold"
              }`}
              title="גופן קטן (א-)"
            >
              א-
            </button>
          </div>
        )}

        {/* Main Circular Button representing the current font size */}
        <button
          onClick={() => setIsFontPopoverOpen(!isFontPopoverOpen)}
          className={`w-12 h-12 rounded-full shadow-2xl flex flex-col items-center justify-center border transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer select-none ${
            isFontPopoverOpen 
              ? "bg-slate-900 text-amber-300 border-slate-800"
              : "bg-[#E21E26] text-white border-transparent hover:bg-red-700"
          }`}
          title="שינוי גודל גופן"
          id="btn-font-size-trigger"
        >
          <span className="text-[9px] font-black uppercase tracking-wider leading-none mb-0.5">גופן</span>
          <span className="text-xs font-black leading-none">
            {fontSize === "sm" && "א-"}
            {fontSize === "base" && "א"}
            {fontSize === "lg" && "א+"}
            {fontSize === "xl" && "א++"}
          </span>
        </button>
      </div>

      {/* Thin Sticky Bottom Bar for suggestions & feedback */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-[#E21E26]/40 py-2.5 px-4 text-center text-xs text-slate-300 shadow-2xl select-none">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 flex-wrap text-[11px] md:text-xs">
          <span className="w-1.5 h-1.5 bg-[#E21E26] rounded-full animate-pulse"></span>
          <span className="font-semibold">יש לכם הצעות לשיפור או תיקון? מוזמנים לשלוח למייל:</span>
          <a 
            href="mailto:idanzeman@mail.tau.ac.il" 
            className="text-white hover:text-[#E21E26] font-extrabold underline decoration-1 underline-offset-2 transition-colors duration-200"
          >
            idanzeman@mail.tau.ac.il
          </a>
        </div>
      </div>

    </div>
  );
}
