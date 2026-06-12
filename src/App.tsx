import { useState, useMemo, useEffect } from "react";
import {
  BookOpen,
  HelpCircle,
  Sliders,
  Search,
  CheckCircle,
  Bookmark,
  FileText,
  Sparkles,
  Calculator,
  ListFilter,
  Menu,
  X,
  ChevronDown,
  ClipboardList,
  XCircle
} from "lucide-react";
import { chaptersData, COURSE_TITLE, COURSE_SUBTITLE } from "./courseContent";
import { chapterSummaries } from "./chapterSummaries";

// Interactive simulators components
import Chapter1Simulator from "./components/Chapter1Simulator";
import Chapter2Waterfall from "./components/Chapter2Waterfall";
import Chapter3Comparison from "./components/Chapter3Comparison";
import Chapter6Leverage from "./components/Chapter6Leverage";
import Chapter8Residual from "./components/Chapter8Residual";
import Chapter9Portfolio from "./components/Chapter9Portfolio";
import QuizCard from "./components/QuizCard";
import TermsGlossary from "./components/TermsGlossary";
import FormulaSheet from "./components/FormulaSheet";

export default function App() {
  const [activeTab, setActiveTab] = useState<"read" | "sims" | "quiz" | "terms" | "formulas">("read");
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChaptersDropdownOpen, setIsChaptersDropdownOpen] = useState(false);
  const [isFontPopoverOpen, setIsFontPopoverOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  // Font Size selection state
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

  // Get bookmarked sections with their data for display
  const bookmarkedSectionData = useMemo(() => {
    return bookmarkedSections.map(key => {
      const [chId, secIdx] = key.split("-").map(Number);
      const ch = chaptersData.find(c => c.id === chId);
      if (!ch) return null;
      const sec = ch.sections[secIdx];
      if (!sec) return null;
      return { key, chapterId: chId, chapterTitle: ch.title, sectionTitle: sec.title };
    }).filter(Boolean) as { key: string; chapterId: number; chapterTitle: string; sectionTitle: string }[];
  }, [bookmarkedSections]);

  // Chapter summary for current chapter
  const activeChapterSummary = useMemo(() => {
    return chapterSummaries.find(s => s.chapterId === selectedChapterId);
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

  const navItems = [
    { id: "read" as const, label: "ספר לימוד", icon: <BookOpen className="w-3.5 h-3.5" />, hasDropdown: true },
    { id: "sims" as const, label: "סימולטורים", icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: "quiz" as const, label: "בחן את עצמך", icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { id: "formulas" as const, label: "נוסחאות", icon: <Calculator className="w-3.5 h-3.5" /> },
    { id: "terms" as const, label: "מילון מונחים", icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  const tabLabelMap: Record<string, string> = {
    read: "ספר לימוד",
    sims: "סימולטורים",
    quiz: "בחן את עצמך",
    formulas: "נוסחאות",
    terms: "מילון מונחים"
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
            <span>{tabLabelMap[activeTab]}</span>
          </div>

          {/* Nav Links - Desktop only */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Textbook with dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  if (activeTab !== "read") {
                    setActiveTab("read");
                    setSearchQuery("");
                  } else {
                    setIsChaptersDropdownOpen(!isChaptersDropdownOpen);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold transition-all shrink-0 cursor-pointer ${
                  activeTab === "read"
                    ? "bg-[#E21E26] text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>ספר לימוד</span>
                {activeTab === "read" && (
                  <span
                    onClick={e => { e.stopPropagation(); setIsChaptersDropdownOpen(!isChaptersDropdownOpen); }}
                    className="text-[8px] opacity-80 cursor-pointer hover:opacity-100"
                  >▼</span>
                )}
              </button>

              {isChaptersDropdownOpen && activeTab === "read" && (
                <div className="absolute right-0 top-full mt-2 w-80 max-h-[420px] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-2 text-right text-white">
                  <div className="px-3 py-1.5 text-[9px] font-black text-slate-400 border-b border-slate-800 uppercase tracking-widest mb-1.5">
                    בחר פרק:
                  </div>
                  <div className="space-y-0.5">
                    {chaptersData.map((ch) => {
                      const isSelected = selectedChapterId === ch.id;
                      const isCompleted = completedChapters.includes(ch.id);
                      return (
                        <button
                          key={ch.id}
                          onClick={() => {
                            setSelectedChapterId(ch.id);
                            setIsChaptersDropdownOpen(false);
                            setTocOpen(false);
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

            {navItems.slice(1).map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSearchQuery(""); setIsChaptersDropdownOpen(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold transition-all shrink-0 cursor-pointer ${
                  activeTab === item.id
                    ? "bg-[#E21E26] text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Progress Indicator (Desktop) */}
            <div className="hidden xs:flex items-center gap-2 text-[10px] font-black font-mono">
              <span className="text-white">{completionPercentage}%</span>
              <div className="w-12 md:w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-[#E21E26] transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[#E21E26] rounded-full transition-all active:scale-95 flex items-center justify-center cursor-pointer"
              aria-label={isMenuOpen ? "סגור תפריט" : "פתח תפריט"}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/98 backdrop-blur-lg border-b-2 border-[#E21E26] shadow-2xl z-45 flex flex-col p-3 gap-1">
            <div className="flex flex-col">
              <button
                onClick={() => {
                  setActiveTab("read");
                  setSearchQuery("");
                  setIsChaptersDropdownOpen(!isChaptersDropdownOpen);
                }}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-extrabold transition-all border border-slate-800 shrink-0 cursor-pointer ${
                  activeTab === "read" ? "bg-[#E21E26] text-white" : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>ספר הלימוד המלא ({chaptersData.length} פרקים)</span>
                </div>
                <span className="text-[10px]">{isChaptersDropdownOpen ? "▲" : "▼"}</span>
              </button>

              {isChaptersDropdownOpen && (
                <div className="flex flex-col gap-1 pr-4 pl-2 py-1.5 bg-slate-950/40 rounded-xl mt-1 max-h-[240px] overflow-y-auto border border-slate-800">
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
                          setTocOpen(false);
                        }}
                        className={`text-right px-3 py-2.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                          isSelected ? "bg-[#E21E26]/20 text-white border border-[#E21E26]/30" : "text-slate-300 hover:text-white hover:bg-slate-800"
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

            {[
              { id: "sims" as const, label: "מרכז סימולטורים", icon: <Sliders className="w-4 h-4 shrink-0 text-white" /> },
              { id: "quiz" as const, label: "בחן את עצמך (הכנה למבחן)", icon: <HelpCircle className="w-4 h-4 shrink-0 text-white" /> },
              { id: "formulas" as const, label: "דף נוסחאות מרוכז", icon: <Calculator className="w-4 h-4 shrink-0 text-white" /> },
              { id: "terms" as const, label: "מילון מונחי נדל\"ן", icon: <FileText className="w-4 h-4 shrink-0 text-white" /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSearchQuery(""); setIsMenuOpen(false); setIsChaptersDropdownOpen(false); }}
                className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl text-xs font-extrabold transition-all text-right shrink-0 cursor-pointer ${
                  activeTab === item.id ? "bg-[#E21E26] text-white" : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-slate-950 text-white border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-20"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#E21E26]/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#E21E26]/5 rounded-full blur-2xl"></div>

        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 relative pb-28">

        {/* Search bar */}
        <div className="mb-10 relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="חפש מונח, נוסחה או נושא מכל חומר הקורס..."
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

        {/* Search Results */}
        {searchQuery.trim() !== "" && (
          <div className="bg-white border-2 border-[#E21E26]/20 p-6 rounded-[2rem] shadow-xl mb-12 animate-fade-in">
            <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E21E26]" />
              <span>תוצאות חיפוש: {searchResults.length} התאמות</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-semibold">לחץ לניווט לפרק המתאים.</p>
            {searchResults.length === 0 ? (
              <p className="text-slate-400 text-xs font-bold text-center py-4">
                לא נמצאו תוצאות. נסה מילים כלליות יותר.
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
                      <span>פרק {match.chapterId}: {match.chapterTitle} › {match.sectionTitle}</span>
                      <span className="text-indigo-600 font-extrabold">ניווט ←</span>
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

        {/* ── TAB: READ ─────────────────────────────────────────────────── */}
        {activeTab === "read" && (
          <div className="max-w-4xl mx-auto w-full bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8 min-h-[600px] animate-fade-in">

            {/* Chapter Header */}
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
              <div className="flex items-center gap-3 shrink-0">
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

            {/* ── Table of Contents (collapsible) ── */}
            <div className="border border-slate-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-all text-right"
              >
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-extrabold text-slate-700">תוכן עניינים לפרק זה</span>
                  <span className="text-[10px] text-slate-400 font-semibold">({activeChapter.sections.length} סעיפים)</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${tocOpen ? "rotate-180" : ""}`} />
              </button>
              {tocOpen && (
                <div className="px-4 pb-3 pt-1 space-y-1 border-t border-slate-100 bg-white">
                  {activeChapter.sections.map((sec, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        document.querySelectorAll('.scrolling-section')[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        setTocOpen(false);
                      }}
                      className="w-full text-right flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-all"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#E21E26]/10 text-[#E21E26] flex items-center justify-center text-[8px] font-black shrink-0">{idx + 1}</span>
                      <span className="truncate">{sec.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sections content */}
            <div className="space-y-8">
              {activeChapter.sections.map((section, sidx) => {
                const sectionKey = `${activeChapter.id}-${sidx}`;
                const isBookmarked = bookmarkedSections.includes(sectionKey);

                return (
                  <div key={sidx} className="space-y-4 animate-fade-in scrolling-section scroll-mt-20">
                    <div className="flex justify-between items-center group">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-[#E21E26] rounded-full"></span>
                        <h3 className={`font-black text-slate-800 tracking-tight leading-snug transition-all ${fontSizeClasses.sectionTitle[fontSize]}`}>
                          {section.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => toggleBookmark(sectionKey)}
                        className={`p-1.5 rounded-full hover:bg-slate-100 transition-all cursor-pointer ${isBookmarked ? "text-[#E21E26] bg-red-50" : "text-slate-300 hover:text-slate-500"}`}
                        title={isBookmarked ? "הסר סימניה" : "סמן נושא זה"}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {section.accentText && (
                      <div className={`p-4 bg-red-50/70 border border-[#E21E26]/20 rounded-2xl font-extrabold text-[#E21E26] leading-relaxed shadow-sm transition-all ${fontSizeClasses.accent[fontSize]}`}>
                        {section.accentText}
                      </div>
                    )}

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

                    {section.keyTerms && section.keyTerms.length > 0 && (
                      <div className="mt-4 bg-slate-50/70 border border-slate-100 p-4 rounded-3xl space-y-2.5 shadow-sm">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">מונחי מפתח:</span>
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

                    {section.caseStudy && (
                      <div className="mt-6 bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-[2rem] shadow-xl text-white">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-6 h-6 bg-[#E21E26]/20 text-[#E21E26] rounded-lg flex items-center justify-center shrink-0">
                            <Calculator className="w-3.5 h-3.5" />
                          </span>
                          <h4 className="text-sm md:text-base font-black tracking-tight">{section.caseStudy.title}</h4>
                        </div>
                        
                        <div className="bg-slate-800/50 rounded-2xl p-4 mb-5 border border-slate-700/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            {section.caseStudy.tableRows.map((row, ridx) => (
                              <div key={ridx} className="flex justify-between items-center border-b border-slate-700/50 pb-2 last:border-0 last:pb-0">
                                <div className="flex flex-col text-right w-full">
                                  <span className="text-slate-300 text-[11px] font-bold">{row.label}</span>
                                  {row.hint && <span className="text-slate-500 text-[9px] font-semibold">{row.hint}</span>}
                                </div>
                                <span className="text-white text-xs font-black tracking-wider w-full text-left" dir="ltr">{row.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-1 text-right">{section.caseStudy.analysisTitle || "ממצאי ניתוח והחלטת הבנק:"}</span>
                          {section.caseStudy.analysis.map((item, aidx) => (
                            <div key={aidx} className="bg-slate-800 border border-slate-700 rounded-xl p-3.5 flex flex-col md:flex-row gap-3 md:items-center relative overflow-hidden text-right">
                              <div className={`absolute right-0 top-0 bottom-0 w-1 ${item.isGood ? "bg-emerald-500" : "bg-red-500"}`}></div>
                              
                              <div className="md:w-1/3 shrink-0 pr-3">
                                <div className="flex items-center gap-2">
                                  {item.isGood ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                                  <span className="text-xs font-extrabold text-white">{item.name}</span>
                                </div>
                                <div className="text-indigo-300 font-mono text-[11px] font-black mt-1.5 dir-ltr text-left md:text-right bg-slate-900/50 py-1 px-2 rounded-lg border border-slate-700/50 inline-block" dir="ltr">{item.calc}</div>
                              </div>
                              
                              <div className="md:w-2/3 md:border-r md:border-slate-700 pr-0 md:pr-3">
                                <p className="text-slate-300 text-[11px] font-semibold leading-relaxed">
                                  <span className="text-white font-bold mr-1">מסקנה:</span>
                                  {item.conclusion}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Chapter Summary: "מה חשוב לזכור" ── */}
            {activeChapterSummary && (
              <div className="border-t border-slate-100 pt-8">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 bg-[#E21E26] rounded-md flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </span>
                    <h4 className="text-sm font-extrabold text-white tracking-tight">מה חשוב לזכור — פרק {activeChapter.id}</h4>
                  </div>
                  <ul className="space-y-2">
                    {activeChapterSummary.takeaways.map((t, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 font-semibold leading-snug">
                        <span className="w-1 h-1 bg-[#E21E26] rounded-full mt-1.5 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* ── Bookmarks section (if any) ── */}
            {bookmarkedSectionData.length > 0 && (
              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Bookmark className="w-4 h-4 text-[#E21E26] fill-current" />
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">הסימניות שלך ({bookmarkedSectionData.length})</h4>
                </div>
                <div className="space-y-1.5">
                  {bookmarkedSectionData.map(bm => (
                    <button
                      key={bm.key}
                      onClick={() => {
                        setSelectedChapterId(bm.chapterId);
                        setTocOpen(false);
                      }}
                      className="w-full text-right flex items-center gap-2 p-2.5 bg-red-50/60 hover:bg-red-50 border border-[#E21E26]/10 rounded-xl text-xs font-semibold text-slate-700 transition-all"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-[#E21E26] fill-current shrink-0" />
                      <span className="text-[10px] text-[#E21E26] font-black shrink-0">פרק {bm.chapterId}</span>
                      <span className="truncate">{bm.sectionTitle}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation footer */}
            <div className="pt-8 border-t border-slate-100 flex justify-between items-center text-xs select-none">
              {selectedChapterId > 1 ? (
                <button
                  onClick={() => { setSelectedChapterId((id) => id - 1); setTocOpen(false); }}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 font-extrabold cursor-pointer"
                >
                  <span>→</span>
                  <span>לפרק הקודם ({selectedChapterId - 1})</span>
                </button>
              ) : <div />}

              {selectedChapterId < chaptersData.length ? (
                <button
                  onClick={() => { setSelectedChapterId((id) => id + 1); setTocOpen(false); }}
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

        {/* ── TAB: SIMULATORS ─────────────────────────────────────────── */}
        {activeTab === "sims" && (
          <div className="space-y-12">
            <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-md">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2.5 text-center">בחר סימולטור</span>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                {[
                  { id: 1, label: "1. תשואה נדרשת" },
                  { id: 2, label: "2. Waterfall GP/LP" },
                  { id: 3, label: "3. ברוטו/NNN" },
                  { id: 6, label: "6. מינוף וכיסוי חוב" },
                  { id: 8, label: "8. מודל חילוץ" },
                  { id: 9, label: "9. Pro-Forma" },
                ].map(sim => (
                  <button
                    key={sim.id}
                    onClick={() => setSelectedChapterId(sim.id)}
                    className={`py-2 px-3 rounded-xl text-center text-[11px] font-bold border transition-all ${
                      selectedChapterId === sim.id ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-700 border-slate-200/60 hover:bg-slate-100"
                    }`}
                  >
                    {sim.label}
                  </button>
                ))}
              </div>
            </div>

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
                  <p className="text-slate-500 text-sm font-bold">בחר סימולטור מהרשימה למעלה (1, 2, 3, 6, 8 או 9).</p>
                  <button onClick={() => setSelectedChapterId(1)} className="px-6 py-2 bg-indigo-600 text-white font-extrabold text-xs rounded-full">
                    עבור לסימולטור 1
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: QUIZ ───────────────────────────────────────────────── */}
        {activeTab === "quiz" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <QuizCard fontSize={fontSize} />
          </div>
        )}

        {/* ── TAB: FORMULAS ───────────────────────────────────────────── */}
        {activeTab === "formulas" && (
          <div className="max-w-4xl mx-auto">
            <FormulaSheet fontSize={fontSize} />
          </div>
        )}

        {/* ── TAB: TERMS ──────────────────────────────────────────────── */}
        {activeTab === "terms" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <TermsGlossary fontSize={fontSize} />
          </div>
        )}
      </div>

      {/* Floating Font Size Selector — fixed position, above bottom bar */}
      <div
        className="fixed bottom-20 left-4 md:left-6 z-40 flex flex-col items-center gap-2 select-none"
        dir="rtl"
      >
        {isFontPopoverOpen && (
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-1.5 rounded-2xl shadow-2xl flex flex-col items-center gap-1.5 mb-1">
            {(["xl", "lg", "base", "sm"] as const).map(size => {
              const labels: Record<string, string> = { xl: "א++", lg: "א+", base: "א", sm: "א-" };
              return (
                <button
                  key={size}
                  onClick={() => { setFontSize(size); setIsFontPopoverOpen(false); }}
                  className={`w-8 h-8 rounded-xl transition-all cursor-pointer flex items-center justify-center text-xs ${
                    fontSize === size ? "bg-amber-400 text-slate-900 font-black shadow-md" : "text-slate-600 hover:bg-slate-100 font-bold"
                  }`}
                >
                  {labels[size]}
                </button>
              );
            })}
          </div>
        )}

        <button
          onClick={() => setIsFontPopoverOpen(!isFontPopoverOpen)}
          className={`w-12 h-12 rounded-full shadow-2xl flex flex-col items-center justify-center border transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer select-none ${
            isFontPopoverOpen
              ? "bg-slate-900 text-amber-300 border-slate-800"
              : "bg-[#E21E26] text-white border-transparent hover:bg-red-700"
          }`}
          title="שינוי גודל גופן"
        >
          <span className="text-[9px] font-black uppercase tracking-wider leading-none mb-0.5">גופן</span>
          <span className="text-xs font-black leading-none">
            {{ sm: "א-", base: "א", lg: "א+", xl: "א++" }[fontSize]}
          </span>
        </button>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-[#E21E26]/40 py-2.5 px-4 text-center text-xs text-slate-300 shadow-2xl select-none">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 flex-wrap text-[11px] md:text-xs">
          <span className="w-1.5 h-1.5 bg-[#E21E26] rounded-full animate-pulse"></span>
          <span className="font-semibold">הצעות לשיפור? שלחו:</span>
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
