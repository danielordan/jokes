# ARCHITECTURE — בדיחה בלחיצה

**תאריך מחקר:** 21 באוקטובר 2026  
**מסמך מקור:** `PRD.md`  
**סטטוס:** ארכיטקטורה נבחרת למימוש

## 1. Technology Stack שנבחר

| רכיב | טכנולוגיה | תפקיד |
|---|---|---|
| Frontend | React + TypeScript | מסך יחיד, ניהול מצב טעינה/שגיאה והצגת בדיחות |
| Build / Dev | Vite | כלי פיתוח ובניית Frontend סטטי |
| Styling | CSS רגיל | עיצוב צבעוני, קליל, רספונסיבי ו-RTL ללא ספריית UI כבדה |
| PWA | `vite-plugin-pwa` (מבוסס Workbox) | Web App Manifest, Service Worker ומטמון Offline לקובצי הממשק |
| Backend | TypeScript ב-Node.js, באמצעות Vercel Function | Endpoint מוגן ליצירת בדיחה וקריאה ל-OpenAI; ללא שרת Express קבוע |
| AI | OpenAI SDK הרשמי ל-Node.js, Responses API, מודל `gpt-5` (נקרא מ-`OPENAI_MODEL`) | יצירת טקסט הבדיחה |
| Hosting | Vercel | אירוח אתר סטטי ו-Serverless Function באותו Domain, HTTPS ו-Deployment |
| Source Control | Git + GitHub | Repository יחיד ותיעוד שינויים |
| גופנים | `@fontsource/heebo`, `@fontsource/assistant` | גופנים מאוחסנים בתוך האפליקציה (לא מ-Google Fonts), כדי שיופיעו גם ב-Offline |
| סודות | Vercel Environment Variables / קובץ `.env` מקומי | מפתח API ב-Backend בלבד |
| Database / Authentication | לא נדרשים | אין נתונים לשימור ואין חשבונות משתמשים |

### נימוקים לבחירה

- **React + Vite:** שילוב מוכר, מתועד ונוח לכלי AI. נבחנו גם Vue ו-Next.js; לפרויקט של מסך יחיד ללא SEO דינמי, ניהול משתמשים או Server-Side Rendering, React עם Vite פשוט יותר מ-Next.js, ונהנה מאקוסיסטם רחב. TypeScript מאפשר לשתף טיפוסים בין צד לקוח וצד שרת.
- **Vercel Function במקום Express Server:** נבחנה חלופה של Express בשרת מתמשך, וגם Functions במסגרת Next.js. Endpoint יחיד קל למימוש כ-Function ללא תחזוקת שרת או Framework נוסף. Vercel תומך ישירות בפרויקט Vite ובתיקיית `api/`.
- **Vercel במקום פיצול GitHub Pages + Backend חיצוני:** GitHub Pages מתאים ל-Frontend סטטי בלבד, אך כאן נדרש Backend ששומר סוד. פריסה מאוחדת ב-Vercel מקטינה מורכבות, מאפשרת Endpoint מאותו Origin ומבצעת פריסות אוטומטיות מ-GitHub. נבחנה גם חלופת Cloudflare Pages/Workers; Vercel נבחר בזכות נתיב הפריסה הישיר המועדף ובשל תמיכת Node.js.
- **PWA באמצעות vite-plugin-pwa:** נבחנו Service Worker ידני והפלגין; הפלגין מפחית תחזוקת Manifest ומדיניות caching. אין צורך בתוספות Offline לשמירת בדיחות.
- **OpenAI Responses API:** ממשק רשמי ליצירת טקסט ב-GPT-5; אין צורך ב-Agent, ב-RAG או בשירותי AI נוספים.
- **ללא Database, Redis, Supabase, Blob Storage, Authentication או ORM:** אין דרישה לשמירת משתמשים, בדיחות או קבצים.

### סיכונים ומגבלות חשובים

1. **מודל `gpt-5` מסומן Deprecated** בתיעוד הרשמי נכון למועד המחקר. הוא ברירת המחדל לפי ה-PRD. שם המודל נקרא ממשתנה הסביבה `OPENAI_MODEL` (ברירת מחדל `gpt-5`), כך שהחלפת מודל היא שינוי הגדרה בלבד — אך מותרת **רק באישור מפורש של בעל המוצר**; אין מעבר אוטומטי (Fallback) למודל אחר. אם המודל אינו זמין לחשבון או מוסר מה-API, יש להציג כשל ולבקש החלטה. יש לוודא גישה מעשית למודל ב-Milestone 2.
2. **אין הגבלת מספר בדיחות או Rate Limiting של המוצר.** כל בקשה מוצלחת מחייבת תשלום לפי Tokens, ואף משתמש אנונימי (או סקריפט) יכול לצרוך תקציב. ההגנה המחייבת היא **תקרת הוצאה חודשית קשיחה בחשבון OpenAI**, שמוגדרת לפני חיבור המפתח (Milestone 2), בנוסף להתראות תקציב. זו הגנה תפעולית ולא מכסה למשתמש. אם מתגלה שימוש לרעה, אין להוסיף חסימת קצב ללא שינוי ב-PRD.
3. **התאמת iPhone/Chrome ל-PWA:** ב-iOS התקנה למסך הבית דרך Chrome תלויה ביכולות הדפדפן וגרסת iOS; תפריט שיתוף ו-Add to Home Screen עשויים להחליף את חלונית ההתקנה שקיימת ב-Android. נדרשת בדיקה במכשיר אמיתי. אין להבטיח חוויית התקנה זהה בשני המכשירים.
4. **Vercel Functions:** קיימים Timeout, תקרות שימוש ותנאי תוכנית. במקרה של עיכוב ארוך של OpenAI תוחזר שגיאה. Vercel Hobby מיועד לשימוש אישי לא מסחרי בלבד; שימוש מסחרי מחייב בחינה של תוכנית מתאימה.
5. **איכות הבדיחה ושפה:** זיהוי שפת הנושא והיענות המודל הן הסתברותיות. המשתמש יכול להזין טקסט בשפות מעורבות; ה-Prompt יורה למודל להשתמש בשפה הדומיננטית של הנושא.

## 2. ארכיטקטורת המערכת

### 2.1 מבנה כללי

```text
Android / iPhone Chrome (או PWA מותקנת)
      |
      | HTTPS: Static Assets + POST /api/joke
      v
Vercel (אותו Origin)
      |                         
      +-- Static React/Vite app  
      |    +-- מסך יחיד RTL
      |    +-- Service Worker + Cache למעטפת Offline
      |    +-- State זמני בזיכרון
      |
      +-- Node.js Serverless Function: /api/joke
               +-- אימות קלט / טיפול שגיאות
               +-- System instructions
               +-- OpenAI SDK (Secret בשרת)
                         |
                         v
                    OpenAI Responses API
                      model: gpt-5
```

ה-Frontend אינו שולח בקשות ישירות ל-OpenAI. רק ה-Backend מכיר את ה-API Key. כל רכיבי המערכת באותו Vercel Project ובאותו Origin. אין שרת מתמשך ואין בסיס נתונים.

### 2.2 חלוקה ל-Modules ולשכבות

| שכבה / Module | אחריות |
|---|---|
| Presentation | כותרת "בדיחה בלחיצה", קלט נושא עד 100 תווים, לחצן יצירה, אזור בדיחה, חיווי טעינה ושגיאה; פריסה למובייל ו-RTL |
| Client State | נושא נוכחי, בדיחה אחרונה, `idle/loading/success/error/offline` ונעילת לחצן בעת קריאה |
| Client API | `fetch('/api/joke')`, בדיקת תשובות, שגיאות תקשורת; ללא מפתח OpenAI |
| PWA Runtime | Manifest, Service Worker, מטמון לקובצי האפליקציה ועמוד הראשי לפתיחה Offline |
| API Boundary | `POST /api/joke`, בדיקת Method, JSON וגודל הקלט, תשובה בפורמט אחיד |
| Joke Generation | System Prompt מוגדר בשרת, בניית בקשה, שליחת בקשה חדשה ועצמאית ל-GPT-5 וחילוץ הבדיחה |
| Configuration | טעינת מפתח OpenAI בשרת בלבד וטיפול במקרה שהוא חסר |

אין הצדקה להוספת שכבת Repository, CQRS, Queue, Event Bus או Microservices.

### 2.3 Data Model ושמירת נתונים

אין אחסון מתמשך של מידע עסקי. כל נתוני המשתמש קיימים בזיכרון Frontend כל עוד המסך פתוח:

- `topic: string` — נושא נוכחי (0–100 תווים; `""` = בדיחה כללית).
- `joke: string | null` — הבדיחה המוצגת האחרונה בלבד.
- `status: 'idle' | 'loading' | 'success' | 'error' | 'offline'` — מצב הממשק.
- `errorMessage: string | null` — הודעה בעברית, אם יש.

אין `localStorage` לבדיקות היסטוריה או להתמדה של בדיחות, ואין Cookies ל-Session. Cache של Service Worker מיועד **לקובצי המעטפת בלבד**, לא לתגובות AI, נושאים או בדיחות. רענון רגיל יכול לאפס את הנושא והבדיחה; לא נדרשת המשכיות בין ביקורים.

### 2.4 API ציבורי של האפליקציה

**Endpoint:** `POST /api/joke`  
**Content-Type:** `application/json`  
**Body:**

```json
{ "topic": "חתולים" }
```

`topic` הוא string אופציונלי (אפשר גם מחרוזת ריקה או שדה חסר). השרת יבצע `trim`; רווחים בלבד שקולים לנושא ריק. התוכן חייב להיות באורך עד 100 תווים לאחר ניקוי רווחי קצה; השרת יאמת גם ללא הסתמכות על הגבלת ה-UI. אין להרחיב אורך קלט דרך API ישיר.

**ספירת תווים:** "תו" נספר כמו `string.length` ב-JavaScript — זו גם הספירה של `maxLength` בשדה הקלט ושל מונה `0/100`. כך הממשק והשרת סופרים זהה (אימוג'י עשוי להיספר כ-2).

**הצלחה — `200`:**

```json
{ "joke": "למה החתול התיישב ליד המחשב? כי הוא רצה לתפוס את העכבר!" }
```

**כשל קלט — `400`:**

```json
{ "error": "INVALID_TOPIC", "message": "יש להזין נושא באורך של עד 100 תווים" }
```

**כשל יצירה — `502` (או `503` לשירות שאינו זמין):**

```json
{ "error": "GENERATION_FAILED", "message": "לא הצלחנו ליצור בדיחה כרגע. אפשר לנסות שוב." }
```

**נושא לא מתאים — `422`:**

```json
{ "error": "TOPIC_NOT_ALLOWED", "message": "על הנושא הזה לא נצליח להצחיק. אפשר לנסות נושא אחר?" }
```

- הטקסטים בשדה `message` זהים לטקסטים שב-DESIGN.md (סעיף "טקסטים בממשק"); ה-Frontend מציג את הטקסט לפי קוד השגיאה, כך שמקור הניסוח הוא אחד.
- בקשה בשיטה שאינה `POST`: `405` עם שגיאה אחידה.
- JSON לא תקין, טיפוס לא נכון או קלט גדול מדי: `400` / `413` בהתאמה; הגדרת גבול גודל גוף בקשה קטן התואם 100 תווים, בנוסף לאימות שדה.
- `Cache-Control: no-store` לתשובות `/api/joke`, כולל הצלחות וכשלים.
- אין Retry אוטומטי בשרת, כדי להימנע מחיובי AI כפולים; ניסיון חוזר מתבצע ביוזמת המשתמש.
- אין צורך ב-CORS: ה-Frontend פונה ל-API מאותו Origin, ולא מוסיפים כותרות CORS. **לא** מממשים בדיקת `Origin` — היא אינה מגינה מפני סקריפטים ומוסיפה מורכבות; ההגנה מפני ניצול היא תקרת ההוצאה (ראה סיכון 2).
- בהיעדר Authentication ה-Endpoint פומבי. אין להסתמך על הסתרת כתובת ה-Endpoint כעל אבטחה.

### 2.5 יצירת בדיחה ב-OpenAI

- להשתמש ב-OpenAI SDK הרשמי ב-Backend וב-`client.responses.create` עם `model: process.env.OPENAI_MODEL ?? 'gpt-5'`, `store: false` ובקשת Text בלבד.
- **מהירות:** להגדיר `reasoning: { effort: 'minimal' }` (או הערך הנמוך ביותר שהמודל תומך בו) ו-`text: { verbosity: 'low' }`, כדי לעמוד ביעד של כ-5 שניות ולצמצם עלות Tokens של "חשיבה".
- להשתמש ב-`instructions` קבועים ומבודדים מהקלט: לייצר בדיחה חדשה המתייחסת לנושא; כשאין נושא, בדיחה כללית בעברית; עם נושא — בשפה הדומיננטית של הנושא; אין סגנון או אורך קבועים.
- **כללי תוכן** בתוך ה-`instructions`: בדיחה המתאימה לכל הגילאים, ללא תוכן מיני/אלים/גס וללא לעג לקבוצות או לאנשים אמיתיים מסוימים (לפי PRD FR-02). אם הנושא אינו מאפשר בדיחה כזו, המודל מחזיר את המחרוזת הקבועה `[[NOT_ALLOWED]]` בלבד; השרת מזהה אותה ומחזיר `422 TOPIC_NOT_ALLOWED`. גם סירוב מובנה של המודל (refusal) ממופה ל-`422`.
- להעביר את הנושא בתור **נתון משתמש** ולא כהוראות מערכת; להבהיר ל-AI שאין לבצע הוראות מוטמעות בנושא המשנות את תפקידו או דורשות לחשוף סודות.
- כל לחיצה מייצרת קריאה עצמאית ללא Conversation ID וללא צבירת היסטוריה. בקשה חוזרת עשויה להפיק בדיחה דומה, אך יש לבקש גיוון; לא ניתן להבטיח ייחוד מוחלט ללא היסטוריה.
- לבדוק ש-`output_text` הוא string שאינו ריק; אם חסר או אם ה-API מחזיר שגיאה, להחזיר שגיאה אחידה ללקוח.
- להגדיר Timeout של **20 שניות** לבקשה ל-OpenAI (לפי PRD), ו-`maxDuration` של **30 שניות** ל-Function ב-Vercel. גם ה-Frontend מבטל את הבקשה אחרי 25 שניות ומציג את הודעת השגיאה הכללית. אין להציב מגבלה קשיחה על אורך הטקסט של הבדיחה ברמת המוצר. מגבלות טכניות של המודל והספק עדיין חלות.
- לא לשמור נושא, בדיחה או תגובת מודל בלוגים. ניתן לרשום מטא-נתונים לא-רגישים (קוד שגיאה, משך פעולה) לצורך אבחון.

### 2.6 Data Flow ו-UX

1. המשתמש פותח את האתר או את ה-PWA; רכיבי ה-UI נטענים מהשרת או מ-Cache מקומי.
2. הנושא מוקלד (עד 100 תווים), או נשאר ריק.
3. לחיצה על לחצן יצירת הבדיחה משנה את המצב ל-`loading`, מציגה **"מכין לך בדיחה..."** ומשביתה את הלחצן.
4. Frontend שולח בקשת `POST /api/joke` ללא API Key.
5. Backend מאמת קלט, מכין הוראות ופונה ל-OpenAI עם הסוד הסביבתי.
6. בהצלחה מתקבלת הבדיחה; Frontend מחליף את הבדיחה הקודמת, מסתיר את הודעת הטעינה ומאפשר לחיצה חדשה.
7. בכשל נשמרת היכולת לנסות שוב ומוצגת הודעת שגיאה בעברית. אין למחוק את הנושא שהמשתמש הזין. בדיחה קודמת, אם קיימת, תישאר מוצגת עד להחלפה מוצלחת.
8. בהיעדר אינטרנט האפליקציה עדיין נפתחת מתוך Cache; ניסיון לייצר מציג **"נדרש חיבור לאינטרנט כדי ליצור בדיחה"**, ללא ניסיון לייצר תשובה מזויפת Offline.

**כלל ההבחנה בין Offline לשגיאה:**
- אם `navigator.onLine === false` בזמן הלחיצה — לא נשלחת בקשה; המצב הוא `offline`.
- אם הבקשה נכשלה בלי לקבל תשובה מהשרת (שגיאת רשת של `fetch`) — המצב הוא `offline`.
- אם התקבלה תשובה מהשרת עם קוד שגיאה, או שהבקשה בוטלה בגלל Timeout — המצב הוא `error` (או הודעת "נושא לא מתאים" עבור `422`).

מיקום ההודעות במסך מוגדר בטבלת המצבים ב-DESIGN.md.

**נגישות בסיסית:** תווית נושא מקושרת לשדה; כפתור ניתן לשימוש במגע ובמקלדת; `aria-live` מתון לחיווי טעינה/שגיאה ותוכן בדיחה; ניגודיות וטקסט קריא; שימוש ב-`dir="rtl"` לאתר והצגת בדיחה בהתאם לשפה שזוהתה, באמצעות `dir="auto"` על אזור הבדיחה. הטקסט מוצג כטקסט פשוט, לא כ-HTML שמיוצר על ידי AI.

### 2.7 PWA, תמיכה במכשירים ו-Offline

- Web App Manifest כולל `name` ו-`short_name`: **"בדיחה בלחיצה"**, `lang: "he"`, `dir: "rtl"`, `display: "standalone"`, `start_url: "/"`, `scope: "/"`, צבעי Theme ואייקוני PNG 192×192 ו-512×512 (לרבות Maskable במידת האפשר).
- Service Worker דרך `vite-plugin-pwa` יקבע Precache ל-HTML, JS, CSS, אייקונים, **קובצי הגופנים ותמונת החתלתול**. אין טעינת משאבים מדומיינים חיצוניים (כמו Google Fonts). יש לתמוך בטעינת `/` במצב Offline גם לאחר התקנה/טעינה מקוונת ראשונה מוצלחת.
- **לא** לבצע caching ל-`/api/*` או לקריאות OpenAI; כל יצירת בדיחה מחייבת בקשה חיה.
- שימוש ב-HTTPS של Vercel; ב-Development, `localhost` נחשב Secure Context בהקשרים רלוונטיים.
- עדכון גרסה: `registerType: 'autoUpdate'` — הגרסה החדשה נטענת בשקט בפתיחה הבאה של האפליקציה, **ללא** חלון "יש גרסה חדשה" (רכיב כזה אינו קיים בעיצוב).
- הבדיקה הנדרשת היא Chrome ב-Android וב-iPhone, במכשירים וגרסאות iOS נתמכים. תמיכה ב-iPhone אינה מבטיחה Prompt התקנה אוטומטי: התקנה דרך תפריט Share / Add to Home Screen כאשר נתמכת.
- ללא דרישה להתאמה ל-Desktop או ל-Firefox/Safari כממשק גלישה נתמך, אף שמנגנוני iOS עשויים להשתמש בתשתית מערכת משותפת. במחשב שולחני מוצגת עמודת המובייל במרכז (רוחב מרבי של כ-480px); בדפדפנים אחרים אין חסימה ואין הודעה.

### 2.8 Authentication, אבטחה ופרטיות

- אין מערכת Login, Cookies של Authentication או הרשאות משתמש.
- `OPENAI_API_KEY` הוא Server-only Environment Variable. אין להוסיף אותו ל-`VITE_*`, ל-HTML, ל-Repository, ל-Manifest או לתגובות API.
- בכל סביבת Vercel יש להגדיר Secret מתאים. מקומית המפתח נשמר בקובץ `.env` (לפי הנוהל ב-CLAUDE.md: `.env.example` עם שמות המשתנים בלבד, והערכים ממולאים על ידי המשתמש). `.env` ו-`.env.*` כבר מוחרגים ב-`.gitignore` ואין להעלותם ל-GitHub.
- כל התקשורת של המשתמש מול Vercel וכל הקריאות החיצוניות מבוצעות ב-HTTPS.
- השרת בודק שוב את תקינות הקלט ואינו מריץ קוד, פקודות או HTML המגיעים מהמשתמש או מהמודל.
- להציג את הבדיחה כ-Plain Text כדי למנוע XSS. להשתמש בכותרות אבטחה מקובלות כגון `X-Content-Type-Options: nosniff`, `Referrer-Policy` ו-CSP המתאימה ל-Build; להימנע מ-CSP שמונעת Service Worker.
- לא לשמור בדיחות, כתובות דוא"ל או פרטי משתמשים באפליקציה. נתוני בקשה עדיין עוברים לשירות OpenAI לצורך יצירה, וספקי התשתית עשויים להחזיק Logs בהתאם למדיניות שלהם. `store: false` מצמצם שמירת Responses במסגרת יכולות ה-API אך אינו התחייבות לאפס עיבוד/לוגים מצד כל ספק.
- ללא Rate Limiting במוצר, בהתאם ל-PRD. חובה להגדיר תקרת הוצאה קשיחה והתראות תקציב בחשבון OpenAI; מומלץ ניטור שימוש ב-Vercel. לא להבטיח חסינות מוחלטת להצפת בקשות.

## 3. תשתיות, Hosting ו-Deployment

### 3.1 Repository וסביבות

- **Repository אחד ב-GitHub** כולל Frontend (`src/`), Backend (`api/`), תצורת Vite/PWA ומסמכי PRD ו-ARCHITECTURE.
- Branch `main` מייצג Production. **תהליך העבודה:** כל Milestone שאושר נדחף ישירות ל-`main` (לפי CLAUDE.md), ולכן כל דחיפה מעדכנת מיד את האתר הציבורי. שימוש בענפים ו-Preview הוא אופציונלי ואינו חלק מתהליך העבודה הרגיל.
- **חיבור ל-Vercel מוקדם:** הפרויקט מחובר ל-Vercel כבר בסוף Milestone 1 (לפני שיש מפתח OpenAI, ולכן ללא עלויות AI), כדי שכל Milestone ייבדק בטלפון אמיתי בכתובת HTTPS.
- **Development מקומי:** `vercel dev` (מריץ את Vite ואת `api/` יחד), לאחר `vercel link` לפרויקט שנוצר ב-Milestone 1, עם מפתח OpenAI בקובץ `.env` המקומי. אין צורך ב-Docker או במסד נתונים. בדיקות על מכשירי מובייל נעשות בכתובת ה-Production (`*.vercel.app`) לאחר דחיפה מאושרת.
- **Preview (אופציונלי):** נפרס אוטומטית מענף שאינו `main`, אם משתמשים בכזה. הגנת Preview אינה משנה את הגישה החופשית ל-Production.
- **Production:** `main` עם Secret נפרד ב-Vercel Production.

### 3.2 Build ופריסה אוטומטית

1. לחבר את GitHub Repository ל-Vercel Project אחד.
2. לבחור Framework Preset של **Vite**; Build Command: `npm run build`; Output Directory: `dist`.
3. Vercel מגיש את Build הסטטי ואת ה-Node.js Function שתחת `api/joke.ts` באותו Domain. להגביל את Function ל-Node.js Runtime ולא ל-Edge בלי צורך.
4. עבור כל Push לענף שאינו Production, Vercel יוצר Preview Deployment; Merge/Push ל-`main` יוצר Production Deployment אוטומטי.
5. חיבור HTTPS מובנה ב-Vercel. אפשר להשתמש בכתובת `*.vercel.app`; Domain מותאם אישית אופציונלי בלבד.
6. הפריסה אינה כוללת Database Migrations או Provisioning של תשתיות שאינן קיימות.

### 3.3 Environment Variables

| משתנה | היכן נדרש | סוד? | הערה |
|---|---|---|---|
| `OPENAI_API_KEY` | Backend Development / Preview / Production | כן | מפתח נפרד לכל סביבה אם אפשר; לעולם לא לחשוף ל-Frontend |
| `OPENAI_MODEL` | Backend Development / Preview / Production | לא | אופציונלי; ברירת מחדל `gpt-5`. שינוי הערך רק באישור מפורש של בעל המוצר |

### 3.4 עלויות ותפעול

- **OpenAI GPT-5:** לפי עמוד המודל הרשמי שנבדק ב-21.10.2026, מחירי Text מוצגים כ-$1.25 למיליון Input Tokens, $0.125 למיליון Cached Input Tokens ו-$10 למיליון Output Tokens. המחיר בפועל נגזר מהיקף הקלט, פלט הבדיחה, Tokens פנימיים אם מחויבים ומהתעריף במועד השימוש. אין מכסה ברמת המוצר.
- **Vercel:** קיימת תוכנית Hobby לשימוש אישי לא מסחרי עם מכסות משאבים; Production מסחרי מצריך תוכנית מתאימה לפי תנאי השירות. Function משלם/צורך משאבים בהתאם למודל החיוב של התוכנית, ועשוי להיות כפוף למגבלות זמן וקריאות.
- **GitHub:** Repository ופעילות Git רגילה; לבדוק את תנאי התוכנית בהתאם לבעלות ולצרכים.
- **אין עלות Database, Storage או Authentication** כי שירותים אלה לא נדרשים.
- אין להבטיח עלות חודשית קבועה כשהשימוש פתוח וללא מכסות. מומלץ להשתמש בהתראות עלויות של שירותי הספקים.

## 4. החלטות טכניות מחייבות וגבולות הפתרון

- מסך Web יחיד, בעברית RTL, מותאם לנייד; ללא תפריטים ודפים נוספים.
- GPT-5 כברירת מחדל; אין Fallback אוטומטי למודל אחר. החלפת מודל — רק בשינוי `OPENAI_MODEL` באישור בעל המוצר.
- כל לחיצה יוצרת בקשה חדשה, גם באותו נושא; כפתור מושבת רק כל עוד בקשה קיימת בתהליך.
- ניתן לפתוח את מעטפת האפליקציה ב-Offline, אך לא להפיק בדיחה חדשה Offline.
- אין Backend מתמשך, Database, Sessions, Accounts, שמירת היסטוריית בדיחות, Analytics אישי, Queue או Storage חיצוני.
- אין הגבלה על מספר הבדיחות ולא מוסיפים Rate Limiting של מוצר.
- אין צורך ב-SSR, Next.js, Supabase, GitHub Pages או שרת Express נפרד.

## 5. מקורות רשמיים למחקר (נבדקו ב-21.10.2026)

1. [OpenAI — GPT-5 Model (יכולות, סטטוס, תמחור, Endpoints)](https://developers.openai.com/api/docs/models/gpt-5)
2. [OpenAI — Text Generation / Responses API](https://developers.openai.com/api/docs/guides/text)
3. [OpenAI — Production Best Practices](https://developers.openai.com/api/docs/guides/production-best-practices)
4. [Vercel — Vite](https://vercel.com/docs/frameworks/frontend/vite)
5. [Vercel — Vercel Functions Limits](https://vercel.com/docs/functions/limitations)
6. [Vercel — Configuring Maximum Duration](https://vercel.com/docs/functions/configuring-functions/duration)
7. [Vercel — Git Integration](https://vercel.com/docs/git)
8. [Vercel — Environment Variables](https://vercel.com/docs/environment-variables)
9. [Vercel — Hobby Plan / תנאי תוכנית](https://vercel.com/docs/plans/hobby)
10. [Vite PWA — Getting Started](https://vite-pwa-org.netlify.app/guide/)
11. [WebKit — Add to Home Screen through third-party browsers on iOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)

> **הערת עדכניות:** מגבלות תכניות, תמחור ומדיניות זמינות מודלים משתנים. לפני Deployment יש לאמת שהמודל `gpt-5` נגיש בחשבון, שהוא תומך בהגדרות ה-`reasoning` וה-`verbosity` שבסעיף 2.5, ושזמן ההרצה והתוכנית ב-Vercel מתאימים לשימוש המתוכנן. כל שינוי במודל שנדרש כתוצאה מ-Deprecation יחייב החלטת מוצר מפורשת.

## החלטות מרכזיות (ADRs)

### ADR-1: הרצה מקומית ב-Milestone 1 באמצעות Vite בלבד
**הקשר:** סעיף 3.1 מגדיר Development מקומי ב-`vercel dev` לאחר `vercel link`. ב-Milestone 1 עדיין אין תיקיית `api/`, אין Function ואין משתני סביבה.
**החלטה:** ב-Milestone 1 ההרצה המקומית היא `npm run dev` (Vite בלבד). המעבר ל-`vercel dev` ול-`vercel link` נעשה ב-Milestone 2, יחד עם הוספת `api/joke.ts`.
**השלכות:** אין צורך ב-Vercel CLI או בחיבור לחשבון Vercel כדי להריץ את Milestone 1 מקומית. ב-Milestone 2 פקודת ההרצה ב-CLAUDE.md תעודכן.

### ADR-2: הרצה מקומית ב-`vercel dev` ופורמט ה-Function
**הקשר:** ADR-1 דחה את `vercel dev` ל-Milestone 2. עכשיו קיים `api/joke.ts`, שדורש סביבת Vercel מקומית ומפתח OpenAI. Vercel CLI מסרב להריץ `vercel dev` אם סקריפט `dev` ב-`package.json` מפעיל אותו (הפעלה רקורסיבית), וב-`vercel dev` המפתח מ-`.env` לא הגיע ל-Function.
**החלטה:** `npm run dev` נשאר Vite בלבד (וכך Vercel משתמש בו כפקודת הפיתוח של הממשק). `npm run dev:full` טוען את `.env` לסביבת התהליך ומריץ `vercel dev` (Vercel CLI כ-devDependency). ה-Function כתובה בפורמט Web standard (`export function POST(request: Request)`, ו-`405` מפורש לשאר השיטות), `maxDuration: 30` מוגדר ב-`vercel.json`, ול-OpenAI SDK מוגדר `timeout: 20000` ו-`maxRetries: 0` (ברירת המחדל של ה-SDK היא 2 ניסיונות חוזרים, שהיו עלולים לגרום לחיוב כפול).
**השלכות:** הרצה מקומית מלאה דורשת `vercel login` + `vercel link` חד-פעמיים ומפתח ב-`.env`. `vercel link` יוצר `.env.local` (מוחרג מ-Git). בלי מפתח, הממשק עולה והבקשה מחזירה `503 GENERATION_FAILED`.

### ADR-3: אייקון האפליקציה ואייקוני ה-PWA
**הקשר:** Milestone 3 דורש את `spec/assets/app-icon.png` (DESIGN 2.4.1). הקובץ שסופק היה העתק של `kitten.svg` ולא PNG ריבועי. בעל המוצר אישר ליצור את האייקון מאיור החתלתול.
**החלטה:** `app-icon.png` נוצר פעם אחת: איור החתלתול על רקע Blush Pink (`#F7AEB8`), 1024×1024, צמוד לתחתית ובתוך האזור הבטוח לחיתוך עגול. ממנו נגזרו בעזרת `sips` (כלי מובנה ב-macOS, בלי תלות נוספת בפרויקט) הקבצים `public/pwa-192x192.png`, `public/pwa-512x512.png` (משמש גם כ-`maskable`) ו-`public/apple-touch-icon.png` (180×180), והם נשמרים ב-Repository. `vite-plugin-pwa` מוגדר עם Precache למעטפת בלבד (`html/js/css/svg/png/woff/woff2`), `navigateFallbackDenylist` ל-`/api/`, וללא `runtimeCaching`.
**השלכות:** החלפת אייקון בעתיד = החלפת `app-icon.png` והרצה חוזרת של שלוש פקודות `sips -z`. ה-Service Worker פעיל רק ב-Build (`npm run build` + `vite preview` או Vercel), לא ב-`npm run dev`.
