import { useState } from "react";

interface Question {
  id: number;
  chapterId: number;
  chapterTitle: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

export default function QuizCard() {
  const quizQuestions: Question[] = [
    {
      id: 1,
      chapterId: 1,
      chapterTitle: "פילוסופיית השקעות וסיכון-תשואה",
      text: "מהם שיעורי התשואה השוטפת (Cap Rate) הממוצעים של דירת מגורים בישראל לפי החומר?",
      options: [
        "סביב 5.0% עד 6.5%",
        "סביב 2.0% עד 2.5%",
        "סביב 8.0% עד 9.5%",
        "סביב 4.0% עד 4.5%"
      ],
      correct: 1,
      explanation: "שיעורי התשואה השוכנת מדירות בישראל נעים סביב 1.5% עד 2.5%, דבר המייצר לעיתים קרובות 'מרווח שלילי' (Negative Spread) בהשוואה לריביות הבנקאיות."
    },
    {
      id: 2,
      chapterId: 2,
      chapterTitle: "קרנות השקעה GP/LP",
      text: "מתי השותף הכללי (GP) מתחיל לקבל דמי הצלחה (Promote / Carried Interest) לפי מודל ה-Waterfall?",
      options: [
        "מיד ברגע קבלת שקל ראשון של הכנסה בפרויקט",
        "לאחר החזר המסים בלבד לשלטונות המדינה",
        "רק לאחר שהמשקיעים (LPs) קיבלו בחזרה את הונם פלוס התשואה המועדפת (Preferred Return) המוסכמת",
        "רק בנקודת המכירה הסופית ללא קשר לתשואת המשקיעים"
      ],
      correct: 2,
      explanation: "מנגנון ה-Preferred Return מבטיח שמנהל הקרן אינו מרוויח דמי הצלחה לפני שהמשקיעים השיגו לפחות את רף התשואה המועדפת המוסכם מראש (למשל, 7% או 8% IRR מורכב)."
    },
    {
      id: 3,
      chapterId: 3,
      chapterTitle: "חוזי שכירות מסחריים",
      text: "בחוזה שכירות נטו מלא (Triple Net - NNN), מי אינו נושא בהוצאות ארנונה, ביטוח עלויות ותחזוקת CAM?",
      options: [
        "השוכר (Tenant)",
        "המשכיר / הבעלים (Landlord)",
        "חברת הניהול המקומית",
        "אף אחד מהבאים לא משלם"
      ],
      correct: 1,
      explanation: "בחוזה NNN, השוכר משלם שכירות בסיס נקייה ונושא בעצמו בכל שלוש קטגוריות הוצאות התפעול. המשכיר (הבעלים) מוגן לחלוטין מאינפלציה והתייקרויות."
    },
    {
      id: 4,
      chapterId: 4,
      chapterTitle: "דיני תכנון ובנייה",
      text: "לפי הרפורמה ברישוי ובנייה (תיקון 102), מהו הדין להקמת פרגולה (מצללה) עד שטח של 50 מ\"ר?",
      options: [
        "רישוי מלא במסלול אגרסיבי של הוועדה המחוזית",
        "רישוי מקוצר המחויב בתשובה תוך 45 ימים",
        "פטור מלא מהיתר בנייה (ערוץ ירוק מהיר)",
        "איסור מלא לבנייה ללא אישור המועצה הארצית"
      ],
      correct: 2,
      explanation: "תיקון 102 מעניק פטור מלא מהיתר בנייה לעבודות קלות כגון פרגולה עד 50 מ\"ר, מחסן קל עד 6 מ\"ר, התקנת סוככים, מזגנים ועוד."
    },
    {
      id: 5,
      chapterId: 5,
      chapterTitle: "דיני קניין והגנות בעלות",
      text: "סעיף 8 לחוק המקרקעין קובע חובת כתב בעסקאות נדל\"ן. מהי מהות דרישה זו?",
      options: [
        "דרישה ראייתית בלבד כדי להוכיח את קיומו של ההסכם בבית המשפט",
        "דרישה חוקית הנדרשת רק להקצאת נאמנות משפחתית",
        "דרישה מהותית (קונסטיטוטיבית) - ללא הסכם בכתב מפורט, העסקה חסרת תוקף משפטי ואינה קיימת",
        "היא תקפה אך ורק לשכירויות קצרות מועד (מתחת ל-5 שנים)"
      ],
      correct: 2,
      explanation: "חובת הכתב לפי סעיף 8 היא דרישה מהותית. ללא מסמך כתוב המפרט את רכיבי המסוימות המרכזיים של העסקה, אין לה שום תוקף משפטי."
    },
    {
      id: 6,
      chapterId: 6,
      chapterTitle: "מימון והנדסה פיננסית",
      text: "כיצד מחושב יחס כיסוי שירות חוב (DSCR) הדרוש בבנקים?",
      options: [
        "DSCR = NOI / (תשלום קרן שנתי + תשלום ריבית שנתי)",
        "DSCR = Capital / Valuation",
        "DSCR = Price / Rent",
        "DSCR = Total Debt / Annual Income"
      ],
      correct: 0,
      explanation: "היחס בוחן את כיסוי שירות החוב מכל ההכנסות התפעוליות השוטפות של הנכס (NOI), והוא חייב להיות לרוב מעל 1.20."
    },
    {
      id: 7,
      chapterId: 7,
      chapterTitle: "מתודולוגיות שמאות",
      text: "איזה גישת שמאות היא הבלעדית והמועדפת להערכת שווי של נדל\"ן מניב כגון בנייני משרדים ומרכזים לוגיסטיים?",
      options: [
        "גישת העלות הפיזית ההנדסית",
        "גישת ההשוואה הישירה למחיר המגורים",
        "גישת היוון ההכנסות (Income Approach / Value = NOI / Cap Rate)",
        "גישת מועדי המיקום הגאוגרפי"
      ],
      correct: 2,
      explanation: "בנכסים מניבים, השווי נגזר באופן בלעדי וישיר מיכולת הנכס לייצר הכנסות עתידיות ומכונות ההיוון שלהן."
    },
    {
      id: 8,
      chapterId: 8,
      chapterTitle: "מדדי כדאיות יזמית",
      text: "במכרזי קרקע פנויה, מדוע מודל החילוץ (Residual Value) קריטי לחיי היזם?",
      options: [
        "כי הוא מסייע לחשב את גובה המכירות הריאלי של המרכול",
        "כי הוא מציג את המחיר המקסימלי שניתן לשלם על הקרקע כיום בלי לרדת מרף הרווח היזמי הנדרש (לרוב 20%)",
        "הוא משרת אך ורק להפחתת מיסוי הארנונה לוועדה המקומית",
        "הוא נדרש אך ורק לפרויקטים השונאים סיכון מקומי"
      ],
      correct: 1,
      explanation: "הצעת סכום גבוה מהחילוץ השמאי על הקרקע תרסק מיידית את הרווח היזמי מתחת ל-20%, ויקטין את הסיכויים לקבל ליווי בנקאי סגור."
    },
    {
      id: 9,
      chapterId: 9,
      chapterTitle: "Family Office ופיזור סיכונים",
      text: "על פי מודל הקצאת הנכסים של UBS למשקיעים כשירים ומשפחות עשירות, מהו חלקם של נכסים אלטרנטיביים ולא סחירים (PE, נדל\"ן פרטי, חוב)?",
      options: [
        "עומד על פחות מ-10% כדי להבטיח נזילות יומיומית",
        "מייצג כ-100% מסה\"כ העושר המשפחתי",
        "חוסך כ-42% מסך התיק בזכות פרמיית חוסר הנזילות (Illiquidity Premium)",
        "הוא מוגדר כאפס אחוז - קורס לחלוטין באפיקים ממשלתיים"
      ],
      correct: 2,
      explanation: "כמעט מחצית מההון (42%) מנותב לאפיקים אלטרנטיביים לא סחירים כדי למצות את פרמיית חוסר הנזילות המניבה ביצועי יתר משמעותיים לאורך זמן."
    },
    {
      id: 10,
      chapterId: 10,
      chapterTitle: "מנדל\"ן יזמי לנדל\"ן מניב",
      text: "מהי הסכנה המרכזית ב'פרגמנטציה' (פיצול בעלויות) של מרכז קניות מסחרי כמו 'מרכז שוסטר'?",
      options: [
        "עליית מחירי הארנונה בשל קונפליקטים מול הוועדה המחוזית",
        "הרס של עיקרון הסינרגיה ותמהיל השוכרים (Tenant Mix), הידרדרות תחזוקת המרכז וחוסר יכולת לנהל אסטרטגיה מאוחדת",
        "הימנעות מוחלטת של מתווכים חיצוניים מלמסור מידע על דיירים פוטנציאליים",
        "חוסר יכולת לרשום הערת אזהרה בטאבו עבור החנויות השונות"
      ],
      correct: 1,
      explanation: "פיצול בעלויות בין בעלים רבים וקטנים גורם לכך שכל אחד פועל לטובת אינטרס אישי צר ללא ראייה תמהילית (למשל, חנות שווארמה ליד סטימצקי), מה שמקשה על תחזוקה אחידה ומוריד את ערך המרכז כולו."
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResultCard, setShowResultCard] = useState(false);

  const currentQuestion = quizQuestions[currentIdx];

  const handleOptionClick = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    setIsAnswered(true);
    if (selectedOption === currentQuestion.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx((idx) => idx + 1);
    } else {
      setShowResultCard(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResultCard(false);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl text-slate-900">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-indigo-100 text-indigo-800 rounded-full font-black text-xs uppercase">
            תרגול ובדיקה
          </span>
          <h3 className="text-xl font-extrabold tracking-tight">בחון את עצמך: הכנה למבחן הנדל"ן</h3>
        </div>
        
        <div className="text-xs font-bold text-slate-500 font-mono">
          {!showResultCard && `שאלה ${currentIdx + 1} מתוך ${quizQuestions.length}`}
        </div>
      </div>

      {showResultCard ? (
        <div className="text-center py-8 space-y-4">
          <div className="text-5xl font-black text-emerald-500">
            {((score / quizQuestions.length) * 100).toFixed(0)}%
          </div>
          <h4 className="text-2xl font-extrabold text-slate-900">מבחן הקורס הושלם בהצלחה!</h4>
          <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
            ענית נכון על {score} שאלות מתוך {quizQuestions.length} שאלות המקיפות את כל התיאוריות, החוקים, והחישובים המפורטים.
          </p>
          <div className="pt-4">
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 bg-amber-400 font-extrabold rounded-full text-slate-900 hover:bg-amber-500 active:scale-95 transition-all text-xs"
            >
              התחל מבחן מחדש
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Question card */}
          <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
            <span className="text-[10px] text-indigo-600 font-black uppercase tracking-wider block mb-1">
              נושא: {currentQuestion.chapterTitle} (פרק {currentQuestion.chapterId})
            </span>
            <h4 className="text-base font-bold text-slate-800 leading-snug">{currentQuestion.text}</h4>
          </div>

          {/* Options grid */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((option, idx) => {
              let btnClass = "border-slate-200/60 bg-slate-50 hover:bg-slate-100 text-slate-800";
              
              if (selectedOption === idx) {
                btnClass = "border-indigo-600 bg-indigo-50 text-indigo-900 font-bold";
              }

              if (isAnswered) {
                if (idx === currentQuestion.correct) {
                  btnClass = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                } else if (selectedOption === idx) {
                  btnClass = "border-red-500 bg-red-50 text-red-900 font-bold";
                } else {
                  btnClass = "border-slate-100 bg-slate-50/50 text-slate-400 cursor-not-allowed";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                  className={`w-full text-right p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${btnClass}`}
                >
                  <span>{option}</span>
                  {isAnswered && idx === currentQuestion.correct && (
                    <span className="text-emerald-600 font-black">✓ תשובה נכונה</span>
                  )}
                  {isAnswered && selectedOption === idx && idx !== currentQuestion.correct && (
                    <span className="text-red-500 font-black">✗ שגוי</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation block */}
          {isAnswered && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs animate-fade-in">
              <span className="font-extrabold text-emerald-900 block mb-1">הסבר מורחב:</span>
              <p className="text-emerald-800 leading-relaxed font-semibold">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Controls button */}
          <div className="flex gap-3 justify-end pt-2">
            {!isAnswered ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 bg-indigo-600 font-extrabold text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all text-xs"
              >
                בדוק תשובה
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-slate-900 font-extrabold text-white rounded-full hover:bg-slate-800 active:scale-95 transition-all text-xs"
              >
                {currentIdx < quizQuestions.length - 1 ? "לשאלה הבאה" : "סיים מבחן וצפה בתוצאה"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
