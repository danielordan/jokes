# תוכנית — Milestone 1: הקמת פרויקט, מסך ראשי ופריסה ראשונה

**מקורות:** `MILESTONES.md` (Milestone 1), `PRD.md`, `ARCHITECTURE.md` (סעיפים 1, 2.2, 2.6, 2.7, 3), `DESIGN.md` (כל המסמך) והתמונות `wireframes.png`, `mockups.png`, `style-guide.png`.

**מטרה:** מסך יחיד מעוצב ותקין ("בדיחה בלחיצה"), שרץ מקומית ומתפרסם ב-Vercel בכתובת HTTPS — **לפני** חיבור ל-AI. הכפתור מושבת; לא מוצגת שום בדיחה.

---

## 0. דרישות מוקדמות (לבדוק לפני תחילת הבנייה)

| # | דרישה | מצב בזמן התכנון | מי מטפל |
|---|---|---|---|
| 1 | **Node.js (גרסת LTS) מותקן במחשב** — נדרש כדי להתקין ולהריץ את הפרויקט | ❌ לא מותקן (`node` לא נמצא) | בעל המוצר (הדרכה: הורדת ה-Installer מ-nodejs.org והתקנה רגילה) |
| 2 | `spec/assets/kitten.png` — צילום החתלתול, רוחב 800px לפחות, עם זכות שימוש (DESIGN 2.4.1) | ❌ חסר (התיקייה `spec/assets/` לא קיימת) | בעל המוצר |
| 3 | כתובת Repository ריק ב-GitHub | — נדרש רק בשלב הדחיפה | בעל המוצר |
| 4 | חשבון Vercel (חינמי) מחובר ל-GitHub | — נדרש רק בשלב הפריסה, בהדרכה צעד אחר צעד | בעל המוצר |

אם 1 או 2 חסרים כשמתחילים "בנה" — עוצרים ומבקשים אותם. **אין** לחתוך את החתלתול מה-Mockup ואין להוריד תמונה מהאינטרנט.

---

## 1. החלטות למימוש ב-Milestone זה

- **הרצה מקומית ב-Milestone 1:** `npm run dev` (Vite בלבד). עדיין אין `api/`, ולכן אין צורך ב-`vercel dev` / `vercel link` — אלה נכנסים ב-Milestone 2 יחד עם ה-Function. תתועד כ-ADR-1 ב-ARCHITECTURE.md בזמן הבנייה.
- **ללא `api/`, ללא `.env.example`, ללא `vite-plugin-pwa`** ב-Milestone זה — אין עדיין משתנים או Backend, וה-PWA שייך ל-Milestone 3. אין `vercel.json` — Vercel מזהה Vite אוטומטית.
- **ללא ספריות נוספות** מעבר ל-React, TypeScript, Vite והגופנים. אין ספריית UI, אין Router, אין ספריית State.
- **ללא מסגרת בדיקות אוטומטיות** — הבדיקה ידנית בדפדפן + `npm run build` (שכולל בדיקת TypeScript). ב-CLAUDE.md: "בדיקות (test): אין".
- **טקסטים:** רק הטקסטים מ-DESIGN 1.3. לכן לתמונות ולקישוטים `alt=""` / `aria-hidden="true"` (לא מוסיפים טקסט חלופי שאינו ברשימה הסגורה). כותרת הלשונית (`<title>`) = "בדיחה בלחיצה".
- **סתירות בין התמונות שנפתרו לפי DESIGN:** תווית השדה היא "על מה תרצה בדיחה?" (לא "נושא הבדיחה" שב-Wireframe); אין כותרת "הבדיחה שלך" מעל הכרטיס; **אין** אייקון תפריט (☰) שמופיע ב-Mockup; Placeholder מלא "לדוגמה: חתולים, עבודה, טכנולוגיה...". גופן הכותרת: Heebo Bold (לפי ה-Style Guide), לא הגופן המעוגל שבתמונה.

---

## 2. קבצים ליצירה / שינוי

```text
/
├── package.json            # scripts: dev, build, preview; deps: react, react-dom, @fontsource/heebo, @fontsource/assistant
├── tsconfig.json           # strict TypeScript (תבנית Vite react-ts)
├── tsconfig.app.json / tsconfig.node.json   # כפי שתבנית Vite יוצרת
├── vite.config.ts          # @vitejs/plugin-react בלבד
├── index.html              # <html lang="he" dir="rtl">, viewport, theme-color, <title>בדיחה בלחיצה</title>
├── src/
│   ├── main.tsx            # טעינת React + ייבוא הגופנים וה-CSS
│   ├── App.tsx             # המסך היחיד (מבנה למטה)
│   ├── texts.ts            # כל טקסטי הממשק מ-DESIGN 1.3 במקום אחד
│   ├── decorations.tsx     # SVG קטנים: לב, ניצוץ, סמיילי, טביעת כף, קווי "התרגשות" (קישוט בלבד)
│   ├── index.css           # משתני צבע, טיפוגרפיה, פריסה וכל עיצוב הרכיבים
│   └── assets/kitten.png   # עותק של spec/assets/kitten.png (מוקטן אם צריך — ראה 4.3)
├── CLAUDE.md               # עדכון "פקודות הרצה": dev = npm run dev, test = אין
├── spec/ARCHITECTURE.md    # הוספת ADR-1 (הרצה מקומית ב-M1)
└── spec/MILESTONES.md      # 🟡 ליד כותרת Milestone 1 בסיום הבנייה
```

מחיקה של קבצי הדוגמה של תבנית Vite (לוגו React/Vite, `App.css` לדוגמה, `public/vite.svg`) — הם נוצרים באותה פעולה ואינם חלק מהמוצר.
`.gitignore` כבר מכסה `node_modules/`, `dist/`, `.vercel/` — אין צורך בשינוי.

---

## 3. מבנה המסך (`App.tsx`)

מלמעלה למטה, עמודה אחת:

1. **`<header>` — אזור כותרת ורוד**
   - רקע Blush Pink עם קצה תחתון מעוגל/גלי (CSS או SVG).
   - `<h1>` "בדיחה בלחיצה" — Charcoal, ‏36px Bold, ממורכז, עם קווי "ניצוץ" קטנים משני הצדדים (קישוט).
   - תמונת החתלתול ממורכזת מתחת לכותרת; לבבות לבנים-ורדרדים פזורים סביב (SVG, `aria-hidden`).
2. **`<main>`**
   - **שדה נושא:** `<h2><label htmlFor="topic">על מה תרצה בדיחה?</label></h2>` (24px Bold, Charcoal, ממורכז כמו ב-Mockup).
     `<input id="topic" type="text" maxLength={100}>` — רקע לבן, מסגרת ורודה דקה, רדיוס ~20px, טקסט מיושר לימין, Placeholder בצבע Cocoa בהיר; אייקון טביעת כף ורוד בצד השמאלי (קישוט, `aria-hidden`, לא לחיץ).
   - **מונה תווים:** `{topic.length}/100`, ‏14px, Cocoa, מתחת לשדה בצד ימין (כמו ב-Mockup). מקושר לשדה ב-`aria-describedby`.
   - **כפתור:** `<button type="button" disabled>` עם אייקון ניצוצות + "צור בדיחה". רקע Raspberry, צורת קפסולה, טקסט לבן 18px Bold, צל רך; קווי ניצוץ קטנים משני צדי הכפתור (קישוט). במצב `disabled` — שקיפות מופחתת ו-`cursor: not-allowed`. **אין** `onClick` ב-Milestone זה.
   - **שורת סטטוס:** `<p role="status" aria-live="polite">` ריקה. גובה מינימלי קטן כך שלא תופסת מקום בולט.
   - **כרטיס בדיחה:** משטח Pale Pink, רדיוס ~24px, צל עדין, ללא כותרת. במצב ריק: סמיילי ורוד עם קווי חיוך + "הבדיחה תופיע כאן לאחר הלחיצה" (Cocoa/ורוד כהה, ממורכז), ולבבות קטנים בפינות (קישוט).
     מוכן כבר עכשיו לתוכן בדיחה: אלמנט טקסט עם `dir="auto"`, `white-space: pre-wrap`, `overflow-wrap: anywhere` — כדי שבדיחה באנגלית תוצג LTR ובדיחה ארוכה תשבר שורות בלי גלילה אופקית. ב-Milestone זה הכרטיס תמיד במצב ריק (אין בדיחות דמה).

**State:** `const [topic, setTopic] = useState('')` בלבד. `onChange` שומר `e.target.value.slice(0, 100)` (הגנה נוספת מעבר ל-`maxLength`, למשל בהדבקה). הספירה לפי `string.length` — כמו שמוגדר ב-ARCHITECTURE 2.4.

---

## 4. עיצוב (`index.css`)

### 4.1 משתנים
```css
--blush: #F7AEB8; --pale: #FBD6DC; --cream: #FFF4ED; --charcoal: #2E2424;
--cocoa: #8B5E4D; --white: #FFFFFF; --raspberry: #C23A62;
```
אין טקסט לבן על Blush Pink (ניגודיות נמוכה) — טקסט לבן רק על Raspberry.

### 4.2 טיפוגרפיה ופריסה
- גופנים מקומיים: `@fontsource/heebo` (400, 700) ו-`@fontsource/assistant` (400), מיובאים ב-`main.tsx`. אין קישור ל-Google Fonts.
- `font-family: 'Heebo', 'Assistant', sans-serif`. גדלים: H1 36px, H2 24px, Body 16px, Caption 14px, כפתור 18px.
- `body`: רקע Cream; `#root`: `max-width: 480px; margin: 0 auto` — במחשב עמודה ממורכזת, בטלפון רוחב מלא.
- `box-sizing: border-box` לכל האלמנטים; ריפוד צד ~20px; מרווחים נדיבים בין הרכיבים; `overflow-x` לא נוצר (כל הרכיבים `width: 100%` לכל היותר, הקישוטים בתוך גבולות האזור).
- רדיוסים 16–24px; הכפתור `border-radius: 999px`.
- `font-size` של השדה 16px לפחות (מונע זום אוטומטי בטלפון בעת לחיצה על השדה).

### 4.3 תמונת החתלתול
- מעתיקים את `spec/assets/kitten.png` ל-`src/assets/kitten.png`. אם הקובץ כבד (מעל ~400KB), יוצרים עותק מוקטן לרוחב 800px בעזרת `sips` (כלי מובנה ב-Mac) — המקור ב-`spec/assets/` לא משתנה.
- מוצגת ברוחב ~200px, ממורכזת, `display: block`. אם לתמונה רקע (לא שקוף) — ממזגים אותה עם רקע הכותרת הוורוד כמה שאפשר (למשל רקע הכותרת בגוון הקרוב לתמונה); אם התוצאה לא נראית טוב — מדווחים בסיום ולא מנסים לערוך את התמונה.

---

## 5. בדיקות שה-Claude מריץ בעצמו (בסוף הבנייה)

1. `npm install` ו-`npm run build` — ללא שגיאות TypeScript או Build.
2. `npm run dev` ופתיחה בדפדפן המובנה:
   - **מובייל (375×812):** צילום מסך והשוואה ל-Mockup/Wireframe — סדר הרכיבים, צבעים, פינות, אין תפריט.
   - בדיקה ש-`document.documentElement.scrollWidth <= window.innerWidth` (אין גלילה אופקית), גם ב-320px רוחב.
   - הזנת 100 תווים → מתקבלים, המונה מציג `100/100`; תו 101 → לא נוסף; הדבקה של 150 תווים → נחתך ל-100.
   - `dir="rtl"` ו-`lang="he"` על המסמך; כל הטקסטים זהים לטבלה ב-DESIGN 1.3.
   - הכפתור מושבת ולחיצה עליו לא עושה דבר; הכרטיס במצב ריק.
   - **מחשב (רוחב מלא):** עמודה ממורכזת ברוחב ≤480px על רקע Cream.
   - הגופנים נטענים מהשרת המקומי ולא מ-`fonts.googleapis.com` (בדיקת בקשות רשת).
3. חיפוש בקוד וב-`dist/` אחר `sk-`, `OPENAI`, `API_KEY` — אין תוצאות.
4. סגירת שרת הפיתוח בסיום (ההרצה היא לבדיקות שלי בלבד).
5. סימון 🟡 ליד כותרת Milestone 1 ב-MILESTONES.md; עדכון פקודות ההרצה ב-CLAUDE.md; ADR-1.

---

## 6. פריסה ל-Vercel (אחרי הבדיקה והאישור שלך — דורש push)

לפי CLAUDE.md וכלל 5 ב-MILESTONES.md: הפריסה דורשת push, ולכן **לא** מבצעים אותה בזמן "בנה". כשתבקש "דחוף שינויים לגיטהאב":

1. אתה יוצר Repository ריק ב-GitHub ונותן לי את הכתובת (בהדרכה, אם צריך).
2. אני מחבר את ה-repo המקומי (`git remote add origin ...`), מבצע commit ו-push ל-`main`.
3. הדרכה צעד אחר צעד ב-Vercel: הרשמה עם GitHub → Add New → Project → Import ל-Repository → Framework Preset: **Vite** (Build: `npm run build`, Output: `dist`) → Deploy. אין Environment Variables ב-Milestone זה.
4. אתה פותח את הכתובת `*.vercel.app` ב-Chrome בטלפון ובודק שמוצג אותו מסך.
5. רק אחרי בדיקת הטלפון — 🟡 מתחלף ב-✅ (לפי כלל 5: עד אז סעיף "הכתובת הציבורית נפתחת בטלפון" מסומן "ממתין לבדיקה בטלפון"). שינוי הסימון ייכנס ל-commit של הדחיפה הבאה.

---

## 7. מיפוי ל-Definition of Done

| תנאי DoD | איך נבדק |
|---|---|
| מותקן, נבנה ללא שגיאות TypeScript ונטען מקומית | סעיף 5.1–5.2 |
| כל הרכיבים במסך יחיד, דומה לעיצוב, טקסטים מ-DESIGN 1.3, ללא תפריט | צילומי מסך + השוואת טקסטים (5.2) |
| עברית RTL; 100 תווים מתקבלים, תו 101 לא, המונה מתעדכן | 5.2 |
| ללא גלילה אופקית במובייל; עמודה ממורכזת במחשב | 5.2 (בדיקת `scrollWidth` + רוחב מחשב) |
| הכתובת ב-Vercel נפתחת ב-Chrome בטלפון | סעיף 6 — בדיקה שלך אחרי ה-push |
| אין מפתחות/סודות בקוד או ב-Repository | 5.3 |
