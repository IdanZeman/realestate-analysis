import { useState, useMemo, useEffect, useCallback } from "react";
import {
  CheckCircle, XCircle, Clock, BarChart2, RefreshCcw,
  Filter, ChevronRight, ChevronLeft, Award, AlertCircle,
  BookOpen, Shuffle, Play, Settings
} from "lucide-react";

interface Question {
  id: number;
  chapterId: number;
  chapterTitle: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

const ALL_QUESTIONS: Question[] = [
  // ── פרק 1: פילוסופיית השקעות ──────────────────────────────────────────
  {
    id: 1, chapterId: 1, chapterTitle: "פילוסופיית השקעות וסיכון-תשואה",
    text: "מהם שיעורי התשואה השוטפת (Cap Rate) הממוצעים של דירת מגורים בישראל לפי החומר?",
    options: ["סביב 5.0% עד 6.5%", "סביב 2.0% עד 2.5%", "סביב 8.0% עד 9.5%", "סביב 4.0% עד 4.5%"],
    correct: 1,
    explanation: "שיעורי התשואה השוטפת (Cap Rate) מדירות בישראל נעים סביב 2.0% עד 2.5%, יוצרים 'מרווח שלילי' (Negative Spread) ביחס לריביות הבנקאיות."
  },
  {
    id: 2, chapterId: 1, chapterTitle: "פילוסופיית השקעות וסיכון-תשואה",
    text: "מהי הנוסחה הנכונה לחישוב ערך עתידי (FV) בריבית דריבית?",
    options: ["FV = PV + r × t", "FV = PV × (1 + r)^t", "FV = PV / (1 + r)^t", "FV = PV × r × t"],
    correct: 1,
    explanation: "FV = PV × (1+r)^t היא נוסחת הריבית דריבית. PV = הון תחילי, r = שיעור תשואה שנתי, t = מספר שנים."
  },
  {
    id: 3, chapterId: 1, chapterTitle: "פילוסופיית השקעות וסיכון-תשואה",
    text: "השקעה של מיליון ש\"ח בתשואה שנתית של 5% למשך 100 שנים תניב בקירוב כמה?",
    options: ["כ-5 מיליון ש\"ח", "כ-50 מיליון ש\"ח", "כ-131.5 מיליון ש\"ח", "כ-500 מיליון ש\"ח"],
    correct: 2,
    explanation: "בשל אפקט הריבית דריבית, 1M × (1.05)^100 ≈ 131.5 מיליון ש\"ח — מפגין את עוצמת ההשקעה לטווח ארוך."
  },
  {
    id: 4, chapterId: 1, chapterTitle: "פילוסופיית השקעות וסיכון-תשואה",
    text: "מה מייצג Rf (ריבית חסרת סיכון) בנוסחת התשואה הנדרשת מנכס?",
    options: ["תשואת מניות הנדל\"ן בבורסה", "ריבית בנק ישראל", "תשואת אגרות חוב ממשלתיות לטווח ארוך", "ריבית פריים בנקאית"],
    correct: 2,
    explanation: "Rf מיוצג על ידי אגרות חוב ממשלתיות לטווח ארוך — האלטרנטיבה חסרת הסיכון של אותה מדינה שבה מבוצעת ההשקעה."
  },
  {
    id: 5, chapterId: 1, chapterTitle: "פילוסופיית השקעות וסיכון-תשואה",
    text: "מהי RPliquidity בנוסחת התשואה הנדרשת?",
    options: ["פרמיית סיכון אשראי השוכרים", "פרמיית סיכון בגין חוסר נזילות הנכס", "פרמיית סיכון תפעולי", "פרמיית סיכון גאוגרפי"],
    correct: 1,
    explanation: "RPliquidity מפצה על כך שנדל\"ן אינו ניתן להנזלה בלחיצת כפתור בשונה ממניות ואג\"ח סחיר."
  },
  {
    id: 6, chapterId: 1, chapterTitle: "פילוסופיית השקעות וסיכון-תשואה",
    text: "מה גורם לאנומליה המבנית ('כשל שוק') בשוק הדיור בישראל?",
    options: ["מדיניות בנקאית המגבילה אשראי", "שיעורי Cap Rate נמוכים מריבית המקור — 'מרווח שלילי'", "היעדר ביקוש לדיור", "עודף היצע דירות חדשות"],
    correct: 1,
    explanation: "Cap Rate של 2%-2.5% מול ריבית בנקאית גבוהה יותר יוצר Negative Spread — המשקיע מוותר על יותר ממה שהנכס מייצר שוטפת."
  },
  {
    id: 7, chapterId: 1, chapterTitle: "פילוסופיית השקעות וסיכון-תשואה",
    text: "מה 'עיוות המינוף' בגין לוח שפיצר שמוזכר בחומר?",
    options: ["ריבית הלוואה שלא שולמה", "רכיב הריבית המצטבר מכפיל ואף משלש עלות הרכישה האמיתית לאורך 20-30 שנה", "הפחתת ערך הנכס בגין פחת", "עמלת הבנק לפירעון מוקדם"],
    correct: 1,
    explanation: "דירה שנרכשה ב-2 מיליון עשויה לעלות מעל 3.5 מיליון במונחים ריאליים בגין צבירת הריבית בלוח שפיצר — נתון שנשכח לרוב."
  },

  // ── פרק 2: GP/LP ──────────────────────────────────────────────────────
  {
    id: 8, chapterId: 2, chapterTitle: "קרנות השקעה GP/LP",
    text: "מתי השותף הכללי (GP) מתחיל לקבל דמי הצלחה (Promote / Carried Interest)?",
    options: [
      "מיד עם קבלת שקל ראשון של הכנסה",
      "לאחר החזר מסים בלבד",
      "רק לאחר שה-LPs קיבלו הון בחזרה + תשואה מועדפת (Preferred Return)",
      "רק בנקודת המכירה הסופית ללא קשר לתשואת המשקיעים"
    ],
    correct: 2,
    explanation: "Preferred Return מבטיח שה-GP לא מרוויח לפני שהמשקיעים השיגו לפחות את רף התשואה המועדפת (7%-8% IRR)."
  },
  {
    id: 9, chapterId: 2, chapterTitle: "קרנות השקעה GP/LP",
    text: "כמה אחוז מההון העצמי משקיע ה-GP מכספו בדרך כלל?",
    options: ["20%-30%", "50%-60%", "1%-10%", "70%-80%"],
    correct: 2,
    explanation: "ה-GP משקיע 1%-10% לצורך 'עור במשחק' (Skin in the game) — יצירת זהות אינטרסים עם המשקיעים."
  },
  {
    id: 10, chapterId: 2, chapterTitle: "קרנות השקעה GP/LP",
    text: "מה הצעד הראשון במנגנון חלוקת הרווחים (Waterfall)?",
    options: [
      "העברת דמי הצלחה (Promote) ל-GP",
      "חלוקת תשואה מועדפת ל-LPs",
      "החזר ההון המקורי שהושקע על ידי ה-LPs וה-GP",
      "חלוקה פרו-רטה לפי חלק יחסי"
    ],
    correct: 2,
    explanation: "הצעד הראשון תמיד: החזר ההון המקורי — לפני כל תשואה ולפני כל דמי הצלחה."
  },
  {
    id: 11, chapterId: 2, chapterTitle: "קרנות השקעה GP/LP",
    text: "מה מגבלת האחריות של ה-LP בשותפות המוגבלת?",
    options: [
      "אחריות בלתי מוגבלת על חובות הקרן",
      "אחריות מוגבלת לגובה ההון שהשקיעו בלבד",
      "אחריות על החלטות תפעוליות שוטפות",
      "אין להם כל אחריות"
    ],
    correct: 1,
    explanation: "ה-LP מסתכן רק בכספו שהשקיע — לא ניתן לתבוע ממנו מעבר לכך. זה מה שהופך את המבנה לאטרקטיבי."
  },
  {
    id: 12, chapterId: 2, chapterTitle: "קרנות השקעה GP/LP",
    text: "לפי מקרה הבוחן המספרי בחומר: כמה מכפיל (Multiple) השיג ה-GP לעומת ה-LP?",
    options: ["LP: 1.8x, GP: 3.0x", "LP: 1.8x, GP: 5.0x", "LP: 2.5x, GP: 5.0x", "LP: 3.0x, GP: 10.0x"],
    correct: 1,
    explanation: "ה-LP מייצר 1.8x, ה-GP מגיע ל-5.0x — כוחו של ה-Promote לצד תרומת הון קטנה."
  },
  {
    id: 13, chapterId: 2, chapterTitle: "קרנות השקעה GP/LP",
    text: "מה גובה ה-Promote הסטנדרטי שה-GP מקבל מהרווחים העודפים (מעל ה-Hurdle)?",
    options: ["5%", "10%", "20%", "50%"],
    correct: 2,
    explanation: "ה-20% Promoted Interest הוא סטנדרט התעשייה, מבוסס היסטורית על מודל Blackstone ו-KKR."
  },
  {
    id: 14, chapterId: 2, chapterTitle: "קרנות השקעה GP/LP",
    text: "מי הם ה-LPs בקרנות נדל\"ן פרטיות לרוב?",
    options: [
      "הבנקים המממנים בלבד",
      "חברות ביטוח, קרנות פנסיה ומשקיעים כשירים פרטיים (Family Office / HNWI)",
      "הרשויות המקומיות",
      "קבלני הביצוע"
    ],
    correct: 1,
    explanation: "ה-LPs הם המשקיעים הפאסיביים: גופים מוסדיים (ביטוח, פנסיה) ו-High-Net-Worth Individuals / Family Offices."
  },

  // ── פרק 3: חוזי שכירות מסחריים ────────────────────────────────────────
  {
    id: 15, chapterId: 3, chapterTitle: "חוזי שכירות מסחריים",
    text: "בחוזה שכירות נטו מלא (Triple Net - NNN), מי אינו נושא בהוצאות ארנונה, ביטוח ותחזוקת CAM?",
    options: ["השוכר (Tenant)", "המשכיר / הבעלים (Landlord)", "חברת הניהול", "אחריות משותפת בין שניהם"],
    correct: 1,
    explanation: "בחוזה NNN, השוכר משלם שכירות בסיס נקייה ונושא בעצמו בכל 3 קטגוריות ההוצאות. המשכיר מוגן מפני אינפלציה."
  },
  {
    id: 16, chapterId: 3, chapterTitle: "חוזי שכירות מסחריים",
    text: "ב-Gross Lease (חוזה ברוטו), מי נושא בהוצאות ארנונה, ביטוח ותחזוקה?",
    options: ["השוכר בלבד", "הבעלים (המשכיר)", "הוועדה המקומית", "חברת הניהול העצמאית"],
    correct: 1,
    explanation: "ב-Gross Lease הסיכון התפעולי המלא רובץ על הבעלים — עליית ארנונה, ביטוח או אנרגיה שוחקת ישירות את ה-NOI שלו."
  },
  {
    id: 17, chapterId: 3, chapterTitle: "חוזי שכירות מסחריים",
    text: "מה ה-TI (Tenant Improvements) בחוזי שכירות מסחריים?",
    options: [
      "Total Insurance — ביטוח מלא של הנכס",
      "עלויות התאמת המושכר לשוכר החדש שהמשכיר ממן",
      "Tax Included — מס הכלול בשכר הדירה",
      "Time Index — מדד לעדכון שכירות"
    ],
    correct: 1,
    explanation: "TI = Tenant Improvements — ריצוף, תאורה, חלוקת חדרים ושיפוצים שהמשכיר מממן לטובת הכנסת שוכר חדש."
  },
  {
    id: 18, chapterId: 3, chapterTitle: "חוזי שכירות מסחריים",
    text: "כמה שנים נמשכים בממוצע חוזי שכירות בסקטור המשרדים?",
    options: ["1-2 שנים", "3-4 שנים", "5-10 שנים", "15-20 שנים"],
    correct: 2,
    explanation: "חוזי משרדים: 5-10 שנים — מעניק יציבות תזרימית גבוהה אך דורש TI גדול ו-LC בעת החלפת שוכר."
  },
  {
    id: 19, chapterId: 3, chapterTitle: "חוזי שכירות מסחריים",
    text: "מה יתרון הסקטור הלוגיסטי (Industrial) על פני המשרדים מבחינת עלויות CapEx?",
    options: [
      "חוזים קצרים יותר",
      "עלויות התאמה (TI) נמוכות בהרבה — מבנה שלד פשוט",
      "תשואות שוטפות גבוהות יותר",
      "חוזים לפי אחוז פדיון בלבד"
    ],
    correct: 1,
    explanation: "מבני לוגיסטיקה הם שלד בטון פשוט. עלויות התאמה לשוכר חדש (CapEx+TI) נמוכות בהרבה מהמשרדים."
  },
  {
    id: 20, chapterId: 3, chapterTitle: "חוזי שכירות מסחריים",
    text: "מה הסיכון המרכזי בסקטור הקמעונאות (Retail)?",
    options: [
      "ריבית הלוואה גבוהה",
      "ביצועים תלויים באופן ישיר במיקום ובאיכות ניהול תמהיל השוכרים",
      "חוזים ארוכים מדי שאינם מאפשרים גמישות",
      "CapEx גבוה של בנייה"
    ],
    correct: 1,
    explanation: "ב-Retail, המיקום הפיזי ואיכות ה-Tenant Mix קובעים הכל — נכס מסחרי מעוצב רע יכול לאבד דיירים מהר."
  },

  // ── פרק 4: תכנון ורישוי ───────────────────────────────────────────────
  {
    id: 21, chapterId: 4, chapterTitle: "דיני תכנון ובנייה",
    text: "לפי הרפורמה ברישוי (תיקון 102), מהו הדין להקמת פרגולה עד שטח של 50 מ\"ר?",
    options: [
      "רישוי מלא בוועדה המחוזית",
      "רישוי מקוצר — תשובה תוך 45 ימים",
      "פטור מלא מהיתר בנייה (ערוץ ירוק)",
      "איסור מוחלט ללא אישור המועצה הארצית"
    ],
    correct: 2,
    explanation: "תיקון 102 מעניק פטור מלא מהיתר לפרגולה עד 50 מ\"ר, מחסן קל עד 6 מ\"ר, מזגנים, סוככים וגדרות עד 1.5 מ'."
  },
  {
    id: 22, chapterId: 4, chapterTitle: "דיני תכנון ובנייה",
    text: "כמה ועדות מחוזיות לתכנון ובנייה פועלות בישראל?",
    options: ["3", "4", "6", "9"],
    correct: 2,
    explanation: "6 ועדות מחוזיות: תל אביב, מרכז, ירושלים, צפון, דרום, חיפה."
  },
  {
    id: 23, chapterId: 4, chapterTitle: "דיני תכנון ובנייה",
    text: "מהו הבדל בין תמ\"א לתב\"ע?",
    options: [
      "תמ\"א היא תוכנית מחוזית ותב\"ע ארצית",
      "תמ\"א ארצית (כלל-מדינה), תב\"ע עירונית (ספציפית לאזור)",
      "שתיהן זהות — רק שם שונה",
      "תמ\"א לבנייה חדשה, תב\"ע לשיפוץ בלבד"
    ],
    correct: 1,
    explanation: "תמ\"א = תוכנית מתאר ארצית (קווי מדיניות לכל המדינה). תב\"ע = תוכנית בניין עיר (ספציפית לשכונה/אזור)."
  },
  {
    id: 24, chapterId: 4, chapterTitle: "דיני תכנון ובנייה",
    text: "ב'מסלול מוגבל בזמן' (רישוי מקוצר לפי תיקון 102), כמה ימים יש לוועדה המקומית לענות?",
    options: ["7 ימים", "21 ימים", "45 ימים", "90 ימים"],
    correct: 2,
    explanation: "במסלול הרישוי המקוצר, הוועדה המקומית מחויבת לתת תשובה תוך 45 ימים."
  },
  {
    id: 25, chapterId: 4, chapterTitle: "דיני תכנון ובנייה",
    text: "מה 'המסלול הירוק' בהגשת בקשה להיתר בנייה?",
    options: [
      "מסלול לנכסים ירוקים (LEED)",
      "בקשה להיתר התואמת במלואה את התב\"ע המאושרת — ללא צורך בחריגות",
      "מסלול המיועד לפרויקטים סביבתיים",
      "הגשה מקוונת ללא מסמכים פיזיים"
    ],
    correct: 1,
    explanation: "המסלול הירוק: בקשה לגיטימית לחלוטין על בסיס זכויות קיימות ב-תב\"ע — ללא שינויים, הקלות או שימוש חורג."
  },
  {
    id: 26, chapterId: 4, chapterTitle: "דיני תכנון ובנייה",
    text: "מה המסמכים המרכיבים תב\"ע?",
    options: [
      "בקשת בנייה ותשריט בלבד",
      "תקנון (מסמך מילולי) ותשריט (מפה גרפית)",
      "חוזה עם קבלן ואישור מהנדס",
      "דו\"ח שמאי ואישור עורך דין"
    ],
    correct: 1,
    explanation: "תב\"ע = תקנון (הוראות מילוליות) + תשריט (מפה גרפית צבעונית עם יעדי קרקע)."
  },

  // ── פרק 5: דיני קניין ────────────────────────────────────────────────
  {
    id: 27, chapterId: 5, chapterTitle: "דיני קניין והגנות בעלות",
    text: "סעיף 8 לחוק המקרקעין קובע חובת כתב. מהי מהות הדרישה הזו?",
    options: [
      "דרישה ראייתית בלבד — להוכחה בבית משפט",
      "דרישה חוקית לעסקאות בנאמנות משפחתית בלבד",
      "דרישה מהותית (קונסטיטוטיבית) — ללא כתב, העסקה אינה קיימת משפטית",
      "תקפה רק לשכירויות מתחת ל-5 שנים"
    ],
    correct: 2,
    explanation: "חובת הכתב היא מהותית. ללא מסמך כתוב עם רכיבי מסוימות מרכזיים, העסקה חסרת תוקף משפטי."
  },
  {
    id: 28, chapterId: 5, chapterTitle: "דיני קניין והגנות בעלות",
    text: "כמה זכויות קנייניות מוכרות בחוק המקרקעין?",
    options: ["5", "7", "9", "12"],
    correct: 1,
    explanation: "7 זכויות קנייניות: בעלות, שכירות, חכירה לדורות, שאילה, משכנתה, זיקת הנאה, זכות קדימה."
  },
  {
    id: 29, chapterId: 5, chapterTitle: "דיני קניין והגנות בעלות",
    text: "מהי 'חכירה לדורות' ומאיזו תקופה היא מוגדרת כך?",
    options: [
      "שכירות לכל החיים ללא תקופה מוגדרת",
      "חוזה שכירות לתקופה העולה על 25 שנים",
      "חוזה שכירות של 10-25 שנים",
      "כל חוזה שכירות מסחרי"
    ],
    correct: 1,
    explanation: "חכירה לדורות = שכירות מעל 25 שנה. שקולה מעשית לבעלות, נפוצה מול רמ\"י שמחזיקה כ-92% מקרקעות המדינה."
  },
  {
    id: 30, chapterId: 5, chapterTitle: "דיני קניין והגנות בעלות",
    text: "בעסקאות נוגדות (סעיף 9): אחד מהתנאים שקונה ב' חייב לעמוד בהם כדי לגבור על קונה א' הוא:",
    options: [
      "להיות ראשון לחתום על חוזה",
      "לשלם יותר מקונה א'",
      "להסתמך בתום לב, לשלם תמורה ריאלית, ולהשלים רישום בטאבו",
      "לקבל אישור ממוכר בנוכחות עד"
    ],
    correct: 2,
    explanation: "3 תנאים מצטברים: תום לב (לא ידע על קונה א'), תמורה ריאלית (מחיר שוק), רישום מלא בטאבו בעודו תם לב."
  },
  {
    id: 31, chapterId: 5, chapterTitle: "דיני קניין והגנות בעלות",
    text: "מה 'רישום במושע'?",
    options: [
      "רישום דירה בפנקס הזכויות הרגיל",
      "בעלות משותפת רשומה על כל החלקה ללא חלוקה תת-חלקתית מוגדרת",
      "רישום נכס חקלאי ממשלתי",
      "רישום נכס לא מוסדר"
    ],
    correct: 1,
    explanation: "מושע = כל הדיירים רשומים כבעלים במשותף של כל החלקה ללא חלוקה קניינית פיזית — מקשה על משכנתאות."
  },
  {
    id: 32, chapterId: 5, chapterTitle: "דיני קניין והגנות בעלות",
    text: "כמה אחוז מקרקעות ישראל רשומות בפנקס הזכויות (מוסדרות)?",
    options: ["כ-5%", "כ-50%", "כ-75%", "כ-95%"],
    correct: 3,
    explanation: "כ-95% רשום בפנקס הזכויות המוסדר (ראייה חותכת). רק כ-5% עדיין בפנקס השטרות (ראייה לכאורה)."
  },
  {
    id: 33, chapterId: 5, chapterTitle: "דיני קניין והגנות בעלות",
    text: "מה מגן 'תקנת השוק' (סעיף 10) עבור הרוכש?",
    options: [
      "מגן מפני חובות מס של המוכר",
      "מגן מפני רישום שגוי בטאבו מוסדר שהרוכש הסתמך עליו בתום לב ובתמורה",
      "מגן מפני כל מרמה גם מחוץ לטאבו",
      "מגן מפני שיעבוד לא רשום"
    ],
    correct: 1,
    explanation: "סעיף 10: מי שרכש, שילם ורשם בהסתמכות על פנקס מוסדר — מוגן, אפילו אם הרישום היה שגוי."
  },

  // ── פרק 6: מימון ────────────────────────────────────────────────────
  {
    id: 34, chapterId: 6, chapterTitle: "מימון והנדסה פיננסית",
    text: "כיצד מחושב יחס כיסוי שירות חוב (DSCR)?",
    options: [
      "DSCR = NOI / (תשלום קרן שנתי + ריבית שנתית)",
      "DSCR = Capital / Valuation",
      "DSCR = Price / Rent",
      "DSCR = Total Debt / Annual Income"
    ],
    correct: 0,
    explanation: "DSCR = NOI / (קרן + ריבית שנתיים). בנקים דורשים DSCR > 1.20. פחות מ-1.0 = הנכס לא מכסה את החוב."
  },
  {
    id: 35, chapterId: 6, chapterTitle: "מימון והנדסה פיננסית",
    text: "מהו ה-DSCR המינימלי שבנקים דורשים לרוב לנדל\"ן מניב מסחרי?",
    options: [">0.80", ">1.00", ">1.20", ">1.65"],
    correct: 2,
    explanation: "בנקים דורשים DSCR > 1.20. יחס מתחת ל-1.0 = הנכס לא מכסה את תשלומי החוב מתזרימו."
  },
  {
    id: 36, chapterId: 6, chapterTitle: "מימון והנדסה פיננסית",
    text: "מהי נוסחת ROE (תשואה על ההון העצמי) בנדל\"ן ממונף?",
    options: [
      "ROE = NOI / Debt Service",
      "ROE = (NOI - Debt Service) / Equity Value",
      "ROE = NOI / LTV",
      "ROE = Cap Rate × LTV"
    ],
    correct: 1,
    explanation: "ROE = (NOI פחות שירות החוב) / ההון העצמי. ממחיש כיצד מינוף מגביר הן רווח הן סיכון."
  },
  {
    id: 37, chapterId: 6, chapterTitle: "מימון והנדסה פיננסית",
    text: "בתרחיש הבוחן: משקיע ב-85% מינוף חוות ירידת ערך של 15% — מה קורה להון העצמי שלו?",
    options: ["הפסד של 15%", "הפסד של 37.5%", "הפסד של 50%", "מחיקה מוחלטת (100%) של ההון העצמי"],
    correct: 3,
    explanation: "85% מינוף = הון עצמי 1.5M. ירידת 15% = הפסד 1.5M = 100% מחיקה של ההון. זהו הסיכון של מינוף קיצוני."
  },
  {
    id: 38, chapterId: 6, chapterTitle: "מימון והנדסה פיננסית",
    text: "מה ה-ICR (Interest Coverage Ratio) המינימלי המקובל?",
    options: [">1.00", ">1.20", ">1.65", ">2.00"],
    correct: 2,
    explanation: "ICR = NOI / הוצאות ריבית שנתיות. מקובל לדרוש ICR > 1.65."
  },
  {
    id: 39, chapterId: 6, chapterTitle: "מימון והנדסה פיננסית",
    text: "מה ייחודו של חוב Non-Recourse?",
    options: [
      "ריבית נמוכה יותר מ-Recourse",
      "הבנק יכול לתבוע גם נכסים אישיים של היזם",
      "הבנק משועבד לנכס בלבד — לא יכול לתבוע נכסים אחרים של היזם",
      "פירעון מוקדם ללא עמלה"
    ],
    correct: 2,
    explanation: "Non-Recourse: הבנק יכול לממש רק את הנכס. היזם לא מסתכן אישית — אבל הריבית גבוהה יותר."
  },
  {
    id: 40, chapterId: 6, chapterTitle: "מימון והנדסה פיננסית",
    text: "מהו ה-LTV המקסימלי המקובל בנדל\"ן מסחרי מניב?",
    options: ["50%-60%", "70%-80%", "90%-95%", "100%"],
    correct: 1,
    explanation: "LTV מקסימלי לנדל\"ן מסחרי: 70%-80%. במקרים אגרסיביים עד 92.5% — מעבר לכך סיכון גבוה."
  },

  // ── פרק 7: שמאות ────────────────────────────────────────────────────
  {
    id: 41, chapterId: 7, chapterTitle: "מתודולוגיות שמאות",
    text: "איזו גישת שמאות היא הבלעדית להערכת נדל\"ן מניב (משרדים, לוגיסטיקה, מרכזי קניות)?",
    options: [
      "גישת העלות הפיזית",
      "גישת ההשוואה הישירה",
      "גישת היוון ההכנסות (Income Approach / Value = NOI / Cap Rate)",
      "גישת המיקום הגיאוגרפי"
    ],
    correct: 2,
    explanation: "בנכסים מניבים, השווי נגזר מיכולת הנכס לייצר הכנסות עתידיות — גישת ה-Income Approach / DCF."
  },
  {
    id: 42, chapterId: 7, chapterTitle: "מתודולוגיות שמאות",
    text: "מה ה-RICS?",
    options: [
      "Royal Institution of Chartered Surveyors — גוף בינלאומי לסטנדרטים שמאיים",
      "Real Investment Capital Service",
      "Reliable Income Calculation System",
      "גוף הבנקים הבינלאומי לנדל\"ן"
    ],
    correct: 0,
    explanation: "RICS הוא הגוף הבינלאומי המוביל לקביעת סטנדרטים מקצועיים בשמאות ונדל\"ן."
  },
  {
    id: 43, chapterId: 7, chapterTitle: "מתודולוגיות שמאות",
    text: "גישת ההשוואה (Comparison Approach) הכי מתאימה כאשר:",
    options: [
      "אין עסקאות השוואה בסביבה הקרובה",
      "קיים שוק פעיל וסחיר עם עסקאות דומות אחרונות",
      "מדובר בנכס מניב יחיד באזור",
      "הנכס בבנייה ואינו מוגמר"
    ],
    correct: 1,
    explanation: "גישת ההשוואה עובדת הכי טוב כשיש שוק פעיל ועסקאות השוואה אחרונות בנכסים דומים."
  },
  {
    id: 44, chapterId: 7, chapterTitle: "מתודולוגיות שמאות",
    text: "חישוב: NOI = 600,000 ₪, Cap Rate = 6%. מה שווי הנכס לפי Direct Capitalization?",
    options: ["3,600,000 ₪", "6,000,000 ₪", "10,000,000 ₪", "36,000 ₪"],
    correct: 2,
    explanation: "Value = NOI / Cap Rate = 600,000 / 0.06 = 10,000,000 ₪. ככל שה-Cap Rate נמוך — שווי גבוה יותר."
  },
  {
    id: 45, chapterId: 7, chapterTitle: "מתודולוגיות שמאות",
    text: "ניתוח DCF לנדל\"ן מניב מתבצע לרוב לכמה שנים?",
    options: ["2-3 שנים", "5 שנים", "10 שנים", "25 שנים"],
    correct: 2,
    explanation: "ניתוח DCF נדל\"ן מניב: 10 שנים, כולל Terminal Value / Exit Cap Rate בסוף התקופה."
  },

  // ── פרק 8: מודל חילוץ ───────────────────────────────────────────────
  {
    id: 46, chapterId: 8, chapterTitle: "מדדי כדאיות יזמית",
    text: "במכרזי קרקע פנויה, מדוע מודל החילוץ (Residual Value) קריטי?",
    options: [
      "כי הוא מחשב גובה מכירות מרכול",
      "כי הוא מציג את המחיר המקסימלי שניתן לשלם על הקרקע בלי לרדת מרף הרווח היזמי הנדרש (20%)",
      "כי הוא נדרש לפחת ארנונה",
      "כי הוא נדרש לפרויקטים של שונאי סיכון בלבד"
    ],
    correct: 1,
    explanation: "מחיר גבוה מהחילוץ → רווח יזמי מתחת ל-20% → לא ניתן לקבל ליווי בנקאי. הקרקע מתומחרת אחרון."
  },
  {
    id: 47, chapterId: 8, chapterTitle: "מדדי כדאיות יזמית",
    text: "מהו ה-GDV (Gross Development Value)?",
    options: [
      "עלות הבנייה הכוללת",
      "שווי הפרויקט כגמור ומיוצב כנכס מניב בשוק",
      "הרווח היזמי הנדרש",
      "שווי הקרקע בלבד"
    ],
    correct: 1,
    explanation: "GDV = שווי הפרויקט המוגמר כנכס מניב — מחושב מהיוון הכנסות שכירות חזויות."
  },
  {
    id: 48, chapterId: 8, chapterTitle: "מדדי כדאיות יזמית",
    text: "מה אחוז הרווח היזמי הנדרש במקרה הבוחן בפרק 8?",
    options: ["10% מה-GDV", "15% מה-GDV", "20% מה-GDV", "25% מה-GDV"],
    correct: 2,
    explanation: "הרווח היזמי = 20% מה-GDV. מתחת לכך הפרויקט לא כדאי ולא יקבל ליווי בנקאי."
  },
  {
    id: 49, chapterId: 8, chapterTitle: "מדדי כדאיות יזמית",
    text: "ריבית ליווי הבנייה (LTC) במקרה הבוחן עמדה על:",
    options: ["4% שנתי", "6% שנתי", "8% שנתי", "10% שנתי"],
    correct: 1,
    explanation: "ריבית ליווי הבנייה: 6% שנתי לא צמודה, עם LTC מקסימלי של 60% מעלות הפרויקט."
  },
  {
    id: 50, chapterId: 8, chapterTitle: "מדדי כדאיות יזמית",
    text: "ב-Cap Rate של פרק 8 — מי גבוה יותר: משרדים או מסחר?",
    options: [
      "מסחר גבוה יותר (9.5%) ממשרדים (8.25%)",
      "משרדים גבוה יותר (9.5%) ממסחר (8.25%)",
      "שניהם זהים ב-8.25%",
      "מגורים הגבוהים מכולם"
    ],
    correct: 1,
    explanation: "Cap Rate משרדים = 9.5% > מסחר = 8.25%. Cap Rate גבוה = סיכון גבוה = שווי נמוך למ\"ר."
  },

  // ── פרק 9: Pro-Forma ופורטפוליו ──────────────────────────────────────
  {
    id: 51, chapterId: 9, chapterTitle: "Family Office ופיזור סיכונים",
    text: "על פי מודל הקצאת הנכסים של UBS, מהו חלקם של נכסים אלטרנטיביים לא סחירים?",
    options: [
      "פחות מ-10%",
      "כ-100% מהעושר",
      "כ-42% מהתיק",
      "אפס — הכל בממשלתיים"
    ],
    correct: 2,
    explanation: "כ-42% מהתיק (PE 22%, נדל\"ן 10%, גידור 5%, חוב 2%, תשתיות 2%) — לנצל Illiquidity Premium."
  },
  {
    id: 52, chapterId: 9, chapterTitle: "Family Office ופיזור סיכונים",
    text: "מהי ה-PGI (Potential Gross Income) במודל Pro-Forma?",
    options: [
      "ההכנסה בפועל לאחר הפחתת ריקנות",
      "ההכנסות המקסימליות התיאורטיות בהנחת אפס ריקנות",
      "הרווח הנקי לאחר כל ההוצאות",
      "ההכנסה ברוטו בניכוי מיסים"
    ],
    correct: 1,
    explanation: "PGI = כל ההכנסות אם 100% מהנכס מושכר במחיר שוק — נקודת התחלה של מודל Pro-Forma לפני ניכויים."
  },
  {
    id: 53, chapterId: 9, chapterTitle: "Family Office ופיזור סיכונים",
    text: "מה ה-NOI ומה אינו כלול בו?",
    options: [
      "רווח לפני מיסים בלבד — שירות החוב כלול",
      "רווח תפעולי נקי לאחר הוצאות תפעוליות — לפני שירות חוב ומס הכנסה",
      "רווח לאחר מיסים ושירות חוב",
      "הכנסה גולמית לפני כל הוצאה"
    ],
    correct: 1,
    explanation: "NOI = EGI פחות הוצאות תפעוליות. לא כולל: שירות חוב (קרן+ריבית) ומס הכנסה — זהו המדד שממנו נגזר שווי."
  },
  {
    id: 54, chapterId: 9, chapterTitle: "Family Office ופיזור סיכונים",
    text: "כמה אחוז מהתיק מנותב למניות גלובליות לפי מודל UBS?",
    options: ["10%", "19%", "22%", "28%"],
    correct: 3,
    explanation: "לפי UBS: מניות גלובליות = 28% (מתוך 58% נכסים מסורתיים). אגרות חוב = 19%, מזומן = 10%."
  },
  {
    id: 55, chapterId: 9, chapterTitle: "Family Office ופיזור סיכונים",
    text: "מהו EGI ובמה שונה מ-PGI?",
    options: [
      "שניהם זהים לחלוטין",
      "EGI = PGI פחות אחוז ריקנות ואשראי חסר (Vacancy & Credit Loss)",
      "EGI = PGI פלוס הכנסות חניות",
      "EGI = PGI אחרי מס"
    ],
    correct: 1,
    explanation: "EGI (Effective Gross Income) = PGI פחות הניכוי בגין ריקנות ודיירים שלא משלמים."
  },

  // ── פרק 10: נדל\"ן מניב אסטרטגי ──────────────────────────────────────
  {
    id: 56, chapterId: 10, chapterTitle: "מנדל\"ן יזמי לנדל\"ן מניב",
    text: "מהי הסכנה המרכזית ב'פרגמנטציה' (פיצול בעלויות) של מרכז מסחרי?",
    options: [
      "עליית מחירי ארנונה",
      "הרס עיקרון הסינרגיה ותמהיל השוכרים, הידרדרות תחזוקה וחוסר ניהול מאוחד",
      "הימנעות מתווכים מלמסור מידע",
      "חוסר יכולת לרשום הערת אזהרה"
    ],
    correct: 1,
    explanation: "פיצול בעלויות: כל בעלים פועל לאינטרס אישי (שווארמה ליד סטימצקי), תחזוקה נפגעת, ערך המרכז יורד."
  },
  {
    id: 57, chapterId: 10, chapterTitle: "מנדל\"ן יזמי לנדל\"ן מניב",
    text: "מה הסקטור הנחשב לסיכון הגבוה ביותר בנדל\"ן מניב לפי החומר?",
    options: ["מגורים", "לוגיסטיקה", "משרדים", "מלונאות ופנאי"],
    correct: 3,
    explanation: "מלונאות ופנאי: הכי מסוכן — הוצאות נופש הראשונות להיחתך במשבר, תפוסה בלתי יציבה."
  },
  {
    id: 58, chapterId: 10, chapterTitle: "מנדל\"ן יזמי לנדל\"ן מניב",
    text: "מדוע קניון מסבסד חנות עוגן (Anchor) בשכירות נמוכה?",
    options: [
      "כי כך מחייב החוק",
      "כי העוגן מייצר תנועת קהל שממנה נהנות חנויות קטנות שמהן גובים שכר גבוה",
      "כי העוגן מנהל את החניון",
      "כי הביטוח של העוגן נמוך יותר"
    ],
    correct: 1,
    explanation: "עוגן (Zara, Apple) מייצר Foot Traffic. הקניון מפצה על ההנחה לעוגן ממכפיל שכר הדירה של חנויות קטנות."
  },
  {
    id: 59, chapterId: 10, chapterTitle: "מנדל\"ן יזמי לנדל\"ן מניב",
    text: "מה 'מלכודת הנזילות' בהשקעות חו\"ל בשוקי BBB?",
    options: [
      "ריבית גבוהה שמקשה על מימון",
      "מחיר על הנייר לא נזיל כשהשוק קופא וכוח הקנייה המקומי לא מספיק לשלם",
      "סיכון מטבע ואינפלציה",
      "בירוקרטיה ברישוי"
    ],
    correct: 1,
    explanation: "כשמשקיעים זרים רוצים לצאת במשבר, הקונה המקומי (קפריסאי/יווני) אינו מסוגל לשלם מחיר הבועה שנוצר."
  },
  {
    id: 60, chapterId: 10, chapterTitle: "מנדל\"ן יזמי לנדל\"ן מניב",
    text: "מה הפך את ציר יגאל אלון ל-CBD של תל אביב?",
    options: [
      "מחיר קרקע נמוך במקור",
      "מסה קריטית של משרדים A-Class ונגישות תחבורתית שמשכו חברות ענק",
      "תקנות עירייה שאסרו בנייה במקומות אחרים",
      "היה תמיד ה-CBD של תל אביב"
    ],
    correct: 1,
    explanation: "ציר יגאל אלון (ToHa, אלקטרה, עזריאלי טאון) הפך ל-CBD חרף ספקנות ראשונית, בזכות ריכוז A-Class ונגישות."
  }
];

const CHAPTER_NAMES: Record<number, string> = {
  0: "כל הפרקים",
  1: "פרק 1 — פילוסופיית השקעות",
  2: "פרק 2 — GP/LP",
  3: "פרק 3 — חוזי שכירות",
  4: "פרק 4 — תכנון ורישוי",
  5: "פרק 5 — דיני קניין",
  6: "פרק 6 — מימון",
  7: "פרק 7 — שמאות",
  8: "פרק 8 — מודל חילוץ",
  9: "פרק 9 — Pro-Forma",
  10: "פרק 10 — נדל\"ן מניב"
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

type Mode = "study" | "exam";
type Stage = "config" | "playing" | "results";

export default function QuizCard({ fontSize = "base" }: { fontSize?: "sm" | "base" | "lg" | "xl" }) {
  const fz = {
    question: { sm: "text-xs", base: "text-sm", lg: "text-base", xl: "text-lg" }[fontSize],
    option: { sm: "text-[11px]", base: "text-xs", lg: "text-sm", xl: "text-base" }[fontSize],
    explanation: { sm: "text-[11px]", base: "text-xs", lg: "text-sm", xl: "text-base" }[fontSize],
  };

  // ── Config state ─────────────────────────────────────────────────────
  const [stage, setStage] = useState<Stage>("config");
  const [mode, setMode] = useState<Mode>("study");
  const [chapterFilter, setChapterFilter] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(0); // 0 = all

  // ── Playing state ────────────────────────────────────────────────────
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [isAnswered, setIsAnswered] = useState(false);        // study mode
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Timer (exam mode)
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, timeLeft]);

  useEffect(() => {
    if (timerActive && timeLeft === 0) finishExam();
  }, [timeLeft, timerActive]);

  // ── Derived ──────────────────────────────────────────────────────────
  const currentQ = questions[currentIdx];

  const availableQuestions = useMemo(() => {
    return chapterFilter === 0
      ? ALL_QUESTIONS
      : ALL_QUESTIONS.filter(q => q.chapterId === chapterFilter);
  }, [chapterFilter]);

  // ── Handlers ─────────────────────────────────────────────────────────
  const startQuiz = () => {
    let pool = shuffle(availableQuestions);
    if (questionCount > 0 && questionCount < pool.length) pool = pool.slice(0, questionCount);
    const initAnswers: Record<number, number | null> = {};
    pool.forEach(q => { initAnswers[q.id] = null; });
    setQuestions(pool);
    setAnswers(initAnswers);
    setCurrentIdx(0);
    setIsAnswered(false);
    setSelectedOption(null);
    if (mode === "exam") {
      const secs = Math.max(pool.length * 90, 600); // 1.5 min/question, min 10 min
      setTimeLeft(secs);
      setTimerActive(true);
    }
    setStage("playing");
  };

  const handleOptionClick = (idx: number) => {
    if (mode === "study" && isAnswered) return;
    setSelectedOption(idx);
    if (mode === "exam") {
      setAnswers(prev => ({ ...prev, [currentQ.id]: idx }));
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setAnswers(prev => ({ ...prev, [currentQ.id]: selectedOption }));
    setIsAnswered(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setSelectedOption(answers[questions[nextIdx].id] ?? null);
    } else {
      finishExam();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      setSelectedOption(answers[questions[prevIdx].id] ?? null);
      setIsAnswered(false);
    }
  };

  const finishExam = useCallback(() => {
    setTimerActive(false);
    setStage("results");
  }, []);

  const restart = () => {
    setStage("config");
    setQuestions([]);
    setAnswers({});
    setCurrentIdx(0);
    setIsAnswered(false);
    setSelectedOption(null);
    setTimerActive(false);
  };

  // ── Results calculation ───────────────────────────────────────────────
  const results = useMemo(() => {
    if (stage !== "results") return null;
    let correct = 0;
    const byChapter: Record<number, { correct: number; total: number; title: string }> = {};
    const wrongQuestions: Question[] = [];

    questions.forEach(q => {
      const ans = answers[q.id];
      const isCorrect = ans === q.correct;
      if (isCorrect) correct++;
      else wrongQuestions.push(q);
      if (!byChapter[q.chapterId]) byChapter[q.chapterId] = { correct: 0, total: 0, title: q.chapterTitle };
      byChapter[q.chapterId].total++;
      if (isCorrect) byChapter[q.chapterId].correct++;
    });

    return { correct, total: questions.length, byChapter, wrongQuestions };
  }, [stage, questions, answers]);

  // ════════════════════════════════════════════════════════════════════
  // RENDER: CONFIG
  // ════════════════════════════════════════════════════════════════════
  if (stage === "config") {
    return (
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl text-right" dir="rtl">
        <div className="flex items-center gap-3 mb-6">
          <span className="p-2 bg-indigo-100 text-indigo-800 rounded-full font-black text-xs uppercase">תרגול ובדיקה</span>
          <h3 className="text-xl font-extrabold tracking-tight">בחן את עצמך — הכנה למבחן נדל"ן</h3>
        </div>

        <div className="text-xs text-slate-500 font-semibold mb-6 bg-indigo-50 p-3 rounded-xl border border-indigo-100">
          {ALL_QUESTIONS.length} שאלות מכסות את כל 10 הפרקים. בחר מצב ופרק להתחלה.
        </div>

        {/* Mode selector */}
        <div className="mb-5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">מצב למידה:</label>
          <div className="grid grid-cols-2 gap-3">
            {(["study", "exam"] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  mode === m ? "border-[#E21E26] bg-red-50 text-[#E21E26]" : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="font-extrabold text-sm">{m === "study" ? "📖 מצב לימוד" : "⏱ מבחן מדומה"}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {m === "study" ? "תשובה מיידית + הסבר" : "שעון עצר + תוצאות בסוף"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chapter filter */}
        <div className="mb-5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
            <Filter className="w-3 h-3 inline ml-1" />סנן לפי פרק:
          </label>
          <select
            value={chapterFilter}
            onChange={e => setChapterFilter(Number(e.target.value))}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 bg-white focus:border-[#E21E26] focus:outline-none focus:ring-2 focus:ring-[#E21E26]/10"
          >
            {Object.entries(CHAPTER_NAMES).map(([id, name]) => (
              <option key={id} value={id}>
                {name} {id !== "0" ? `(${ALL_QUESTIONS.filter(q => q.chapterId === Number(id)).length} שאלות)` : `(${ALL_QUESTIONS.length} שאלות)`}
              </option>
            ))}
          </select>
        </div>

        {/* Question count (exam only) */}
        {mode === "exam" && (
          <div className="mb-5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">מספר שאלות:</label>
            <div className="flex gap-2 flex-wrap">
              {[0, 10, 20, 30].map(n => {
                const max = availableQuestions.length;
                const label = n === 0 ? `כולן (${max})` : n > max ? null : `${n} שאלות`;
                if (!label) return null;
                return (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`px-3 py-1.5 rounded-full text-xs font-extrabold border transition-all ${
                      questionCount === n ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={startQuiz}
          className="w-full py-3 bg-[#E21E26] hover:bg-red-700 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
        >
          <Play className="w-4 h-4" />
          <span>התחל {mode === "exam" ? "מבחן מדומה" : "סשן לימוד"}</span>
        </button>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // RENDER: PLAYING
  // ════════════════════════════════════════════════════════════════════
  if (stage === "playing" && currentQ) {
    const answered = answers[currentQ.id];

    return (
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl text-right" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              שאלה {currentIdx + 1} / {questions.length}
            </span>
            {mode === "study" && (
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-black px-2 py-0.5 rounded-full">מצב לימוד</span>
            )}
            {mode === "exam" && (
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                timeLeft < 120 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
              }`}>
                <Clock className="w-2.5 h-2.5" />
                {formatTime(timeLeft)}
              </span>
            )}
          </div>
          <button onClick={restart} className="text-[10px] text-slate-400 hover:text-slate-600 font-bold flex items-center gap-1">
            <RefreshCcw className="w-3 h-3" />חזור להגדרות
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-[#E21E26] transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-4">
          <span className="text-[10px] text-indigo-600 font-black uppercase tracking-wider block mb-1">
            {currentQ.chapterTitle} (פרק {currentQ.chapterId})
          </span>
          <h4 className={`font-bold text-slate-800 leading-snug ${fz.question}`}>{currentQ.text}</h4>
        </div>

        {/* Options */}
        <div className="space-y-2 mb-4">
          {currentQ.options.map((opt, idx) => {
            let cls = "border-slate-200/60 bg-slate-50 hover:bg-slate-100 text-slate-800 cursor-pointer";

            if (mode === "study") {
              if (selectedOption === idx && !isAnswered) cls = "border-indigo-500 bg-indigo-50 text-indigo-900 font-bold cursor-pointer";
              if (isAnswered) {
                if (idx === currentQ.correct) cls = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold cursor-default";
                else if (selectedOption === idx) cls = "border-red-500 bg-red-50 text-red-900 font-bold cursor-default";
                else cls = "border-slate-100 bg-slate-50/50 text-slate-400 cursor-default";
              }
            } else {
              // exam mode
              if (answered === idx) cls = "border-indigo-500 bg-indigo-50 text-indigo-900 font-bold cursor-pointer";
              else cls = "border-slate-200/60 bg-slate-50 hover:bg-slate-100 text-slate-800 cursor-pointer";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={mode === "study" && isAnswered}
                className={`w-full text-right p-3 rounded-xl border transition-all flex items-center justify-between ${fz.option} ${cls}`}
              >
                <span className="leading-snug">{opt}</span>
                <div className="shrink-0 mr-2">
                  {mode === "study" && isAnswered && idx === currentQ.correct && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                  {mode === "study" && isAnswered && selectedOption === idx && idx !== currentQ.correct && <XCircle className="w-4 h-4 text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation (study mode only) */}
        {mode === "study" && isAnswered && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-4">
            <span className="font-extrabold text-emerald-900 block mb-1 text-xs">הסבר מורחב:</span>
            <p className={`leading-relaxed font-semibold text-emerald-800 ${fz.explanation}`}>{currentQ.explanation}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2 justify-between items-center pt-1">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-1 px-3 py-2 text-xs font-extrabold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-3.5 h-3.5" />
            <span>הקודם</span>
          </button>

          <div className="flex gap-2">
            {mode === "study" && !isAnswered && (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="px-5 py-2 bg-indigo-600 text-white font-extrabold text-xs rounded-full hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                בדוק תשובה
              </button>
            )}
            {(mode === "exam" || isAnswered) && (
              <button
                onClick={currentIdx < questions.length - 1 ? handleNext : finishExam}
                className="px-5 py-2 bg-slate-900 text-white font-extrabold text-xs rounded-full hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-1"
              >
                <span>{currentIdx < questions.length - 1 ? "הבא" : mode === "exam" ? "סיים מבחן" : "סיים"}</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
            {mode === "exam" && currentIdx === questions.length - 1 && (
              <button
                onClick={finishExam}
                className="px-5 py-2 bg-[#E21E26] text-white font-extrabold text-xs rounded-full hover:bg-red-700 active:scale-95 transition-all"
              >
                סיים וקבל תוצאות
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // RENDER: RESULTS
  // ════════════════════════════════════════════════════════════════════
  if (stage === "results" && results) {
    const pct = Math.round((results.correct / results.total) * 100);
    const grade = pct >= 85 ? "מצוין" : pct >= 70 ? "טוב" : pct >= 55 ? "עובר" : "יש מה לשפר";
    const gradeColor = pct >= 85 ? "text-emerald-600" : pct >= 70 ? "text-indigo-600" : pct >= 55 ? "text-amber-600" : "text-red-600";

    return (
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl text-right space-y-6" dir="rtl">
        {/* Score hero */}
        <div className="text-center py-4 space-y-2">
          <Award className={`w-10 h-10 mx-auto ${gradeColor}`} />
          <div className={`text-5xl font-black ${gradeColor}`}>{pct}%</div>
          <h4 className="text-xl font-extrabold text-slate-900">{grade}!</h4>
          <p className="text-slate-500 text-xs font-semibold">
            ענית נכון על {results.correct} מתוך {results.total} שאלות
          </p>
        </div>

        {/* Breakdown by chapter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">ביצועים לפי פרק</span>
          </div>
          <div className="space-y-2">
            {Object.entries(results.byChapter).sort((a,b) => Number(a[0]) - Number(b[0])).map(([chId, data]) => {
              const p = Math.round((data.correct / data.total) * 100);
              return (
                <div key={chId} className="flex items-center gap-3">
                  <div className="text-[10px] font-black text-slate-500 w-6 shrink-0">פ{chId}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-700 mb-0.5">
                      <span className="truncate">{data.title}</span>
                      <span className={p >= 70 ? "text-emerald-600" : "text-red-500"}>{data.correct}/{data.total}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${p >= 70 ? "bg-emerald-400" : p >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                        style={{ width: `${p}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wrong questions review */}
        {results.wrongQuestions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">שאלות לחזרה ({results.wrongQuestions.length})</span>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pl-1">
              {results.wrongQuestions.map(q => (
                <div key={q.id} className="p-3 bg-red-50/60 border border-red-100 rounded-xl text-xs">
                  <p className="font-bold text-slate-800 mb-1.5">{q.text}</p>
                  <p className="text-emerald-700 font-extrabold mb-0.5">✓ {q.options[q.correct]}</p>
                  <p className="text-slate-500 font-semibold leading-snug">{q.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={restart}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 text-sm transition-all active:scale-95"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>מבחן חדש</span>
        </button>
      </div>
    );
  }

  return null;
}
