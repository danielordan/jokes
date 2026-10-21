# תוכנית — Milestone 3: חוויית שימוש שלמה והפעלת PWA

**מקורות:** `MILESTONES.md` (Milestone 3), `PRD.md` (FR-04, FR-05, Edge Cases), `ARCHITECTURE.md` (2.3, 2.5, 2.6, 2.7), `DESIGN.md` (1.3, 1.4, 2.1, 2.4.1).

## 0. דרישות מוקדמות — מצב נוכחי

| דרישה | מצב | מה עושים |
|---|---|---|
| `spec/assets/app-icon.png` (1024×1024, שוליים בטוחים לחיתוך עגול) | **חסר** — בתיקייה יש רק `kitten.svg` | לפני תחילת הבנייה עוצרים ומבקשים את הקובץ מבעל המוצר. לא יוצרים אייקון בעצמנו ולא חותכים מה-Mockup (DESIGN 2.4.1). |
| טלפון Android ו/או iPhone עם Chrome | נדרש רק אחרי הדחיפה | בדיקות הטלפון מסומנות "ממתינות לבדיקה בטלפון" עד אחרי push מאושר. |

## 1. סקירת המצב הקיים (מהקוד)

- `src/App.tsx` — מצבים `idle/loading/success/error`; הכפתור מושבת ב-`loading`. שגיאת רשת (`NETWORK`) מציגה את טקסט ה-Offline אבל במצב `error`, ואין עיצוב שונה לשגיאה/טעינה.
- `src/api.ts` — `fetch` ל-`/api/joke` ללא Timeout בצד הלקוח וללא בדיקת `navigator.onLine`.
- `src/index.css` — שורת `.status` בצבע Cocoa לכל ההודעות; אין שקיפות לכרטיס בזמן טעינה.
- `api/joke.ts` — כבר מחזיר `Cache-Control: no-store` בכל התגובות. אין צורך לשנות את השרת ב-Milestone זה.
- `vite.config.ts` — React בלבד, ללא PWA. `index.html` — כבר כולל `lang="he"`, `dir="rtl"` ו-`theme-color`.
- הגופנים מגיעים מ-`@fontsource` (נארזים ב-Build), החתלתול הוא `src/assets/kitten.svg` (נארז ב-Build).

## 2. קבצים ליצור / לשנות

| קובץ | פעולה |
|---|---|
| `src/api.ts` | Timeout של 25 שניות, הבחנה בין Offline / Timeout / שגיאת שרת |
| `src/App.tsx` | מצב `offline` נפרד, מיפוי שגיאות להודעות, Class לפי מצב לשורת הסטטוס ולכרטיס, אייקון אזהרה |
| `src/decorations.tsx` | רכיב SVG קטן `Warning` (אייקון אזהרה) |
| `src/index.css` | צבעי סטטוס לפי מצב, שקיפות כרטיס בטעינה, אייקון אזהרה |
| `vite.config.ts` | הוספת `vite-plugin-pwa` עם Manifest ו-Workbox |
| `package.json` / `package-lock.json` | `vite-plugin-pwa` כ-devDependency |
| `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/apple-touch-icon.png` (180×180) | נגזרים מ-`spec/assets/app-icon.png` |
| `index.html` | `<link rel="apple-touch-icon">` עבור iPhone |
| `spec/ARCHITECTURE.md` | ADR-3 (אופן יצירת האייקונים) |
| `spec/MILESTONES.md` | סימון 🟡 בסיום הבנייה |

לא משנים: `api/joke.ts`, `vercel.json`, `texts.ts` (כל הטקסטים כבר קיימים ותואמים ל-DESIGN 1.3).

## 3. לוגיקת הבקשה — `src/api.ts`

סוגי תוצאה:

```ts
export type JokeError = 'INVALID_TOPIC' | 'TOPIC_NOT_ALLOWED' | 'GENERATION_FAILED' | 'TIMEOUT' | 'OFFLINE'
```

זרימה (לפי ARCHITECTURE 2.6 — כלל ההבחנה):

1. אם `navigator.onLine === false` — מחזירים מיד `OFFLINE`, **בלי** לשלוח בקשה.
2. `AbortController` + `setTimeout(25_000)`; מעבירים `signal` ל-`fetch`. מנקים את הטיימר ב-`finally`.
3. `fetch` נכשל:
   - בגלל ה-Abort של ה-Timeout → `TIMEOUT` (מוצג כשגיאה כללית).
   - כל כשל רשת אחר (אין תשובה מהשרת) → `OFFLINE`.
4. התקבלה תשובה עם קוד שגיאה → הקוד מהגוף (`TOPIC_NOT_ALLOWED` / `INVALID_TOPIC` / `GENERATION_FAILED`), וכל דבר לא מוכר → `GENERATION_FAILED`.
5. גם קריאת הגוף (`response.json()`) נמצאת תחת אותו Timeout.

אין Retry אוטומטי — בקשה אחת לכל לחיצה.

## 4. מצבי המסך — `src/App.tsx`

```ts
type Status = 'idle' | 'loading' | 'success' | 'error' | 'offline'
```

מיפוי תוצאה → מצב והודעה:

| תוצאה | `status` | הודעה (מ-`TEXTS`) |
|---|---|---|
| בדיחה | `success` | — (שורה ריקה) |
| `TOPIC_NOT_ALLOWED` | `error` | `errorNotAllowed` |
| `GENERATION_FAILED`, `INVALID_TOPIC`, `TIMEOUT` | `error` | `errorGeneral` |
| `OFFLINE` | `offline` | `offline` |

התנהגות לפי DESIGN 1.4:

- **טעינה:** שורת סטטוס "מכין לך בדיחה..." בצבע Cocoa; הכפתור מושבת (`disabled`, כמו היום) והטקסט שלו לא משתנה; הכרטיס (ריק או עם בדיחה) מקבל Class `is-loading` עם שקיפות מופחתת. הודעת שגיאה קודמת נעלמת.
- **בדיחה:** הבדיחה החדשה מחליפה את הקודמת; שורת הסטטוס ריקה.
- **שגיאה / נושא לא מתאים:** ההודעה עם אייקון אזהרה קטן, בצבע Raspberry; הכרטיס נשאר כפי שהיה; הכפתור פעיל (ניסיון חוזר = לחיצה רגילה).
- **Offline:** הודעת ה-Offline בצבע Raspberry (ללא אייקון — לפי הטבלה האייקון מוגדר רק לשגיאה/נושא לא מתאים); הכרטיס נשאר; הכפתור פעיל.
- הנושא לעולם לא נמחק. אין מודאלים, Toasts או חלונות קופצים.
- הגנה כפולה מלחיצה מקבילה: בנוסף ל-`disabled`, `handleCreate` יוצא מיד אם `status === 'loading'`.
- נגישות: שורת הסטטוס נשארת `role="status"` + `aria-live="polite"`; אייקון האזהרה `aria-hidden`.

שורת הסטטוס תקבל Class לפי המצב: `status--loading` / `status--error` / `status--offline`.

## 5. עיצוב — `src/index.css`, `src/decorations.tsx`

- `.status--loading` — `color: var(--cocoa)`.
- `.status--error`, `.status--offline` — `color: var(--raspberry)`.
- אייקון אזהרה: SVG פשוט ומעוגל (משולש עם סימן קריאה), כ-18px, `currentColor`, ליד הטקסט (`display: inline-flex; gap`), מותאם ל-RTL.
- `.joke-card.is-loading` — `opacity: 0.5` עם `transition` קצרה.
- גלילה לבדיחות ארוכות: הכרטיס כבר גדל לגובה (`min-height`, ללא גובה קבוע) והעמוד גולל. לוודא שאין חיתוך של הטקסט (`overflow: hidden` בכרטיס חותך רק את הלבבות הדקורטיביים, לא את הטקסט) ושאין גלילה אופקית גם עם מילה/URL ארוכים (`overflow-wrap: anywhere` קיים).

## 6. PWA — `vite.config.ts`

התקנה: `npm install -D vite-plugin-pwa` (לוודא תאימות לגרסת Vite הנוכחית; אם הגרסה האחרונה אינה תומכת ב-Vite 8 — עוצרים ומדווחים).

```ts
VitePWA({
  registerType: 'autoUpdate',
  injectRegister: 'auto',
  includeAssets: ['apple-touch-icon.png'],
  manifest: {
    name: 'בדיחה בלחיצה',
    short_name: 'בדיחה בלחיצה',
    lang: 'he',
    dir: 'rtl',
    display: 'standalone',
    start_url: '/',
    scope: '/',
    theme_color: '#F7AEB8',
    background_color: '#FFF4ED',
    icons: [
      { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{html,js,css,svg,png,woff,woff2}'],
    navigateFallback: '/index.html',
    navigateFallbackDenylist: [/^\/api\//],
    // No runtimeCaching: /api/* is never cached.
  },
})
```

- **Precache של המעטפת בלבד:** HTML, JS, CSS, האייקונים, קובצי הגופנים (`woff2` מ-`@fontsource`) ותמונת החתלתול. אין `runtimeCaching` — ולכן `/api/joke` לא נשמר במטמון (וממילא זו בקשת `POST`).
- `navigateFallbackDenylist` מבטיח שה-Service Worker לא יחזיר את ה-HTML במקום נתיבי API.
- `autoUpdate` — עדכון שקט, בלי חלון "יש גרסה חדשה".
- לא מפעילים PWA במצב פיתוח (`devOptions` כבוי); הבדיקה נעשית על Build.
- אין שימוש ב-`localStorage`, IndexedDB או Cookies.

## 7. אייקונים

- מקור: `spec/assets/app-icon.png` בלבד.
- יצירה חד-פעמית בעזרת `sips` (כלי מובנה ב-macOS, בלי תלות נוספת בפרויקט): 192×192, 512×512 ו-180×180 (`apple-touch-icon.png`) לתוך `public/`. הקבצים נשמרים ב-Repository.
- אותו 512×512 משמש גם כ-`maskable`, כי ב-DESIGN 2.4.1 האייקון מוגדר עם שוליים בטוחים לחיתוך עגול. אם בבדיקה האייקון נחתך באופן לא טוב — מדווחים לבעל המוצר.
- `index.html`: `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`.
- תיעוד כ-ADR-3 ב-ARCHITECTURE.md: "אייקונים נגזרים פעם אחת מ-`app-icon.png` ונשמרים ב-`public/`".

## 8. בדיקות עצמיות (בסוף הבנייה)

הרצה: `npm run build` (ללא שגיאות TypeScript). בדיקות ממשק/שגיאות ב-`npm run dev:full`; בדיקות PWA ו-Offline על Build מקומי (`vite preview` ב-`localhost`, שנחשב Secure Context). בסיום — סוגרים את כל ההרצות.

| בדיקה | איך |
|---|---|
| טעינה | לחיצה → "מכין לך בדיחה..." גלוי, כפתור מושבת, כרטיס בשקיפות; בסיום הכפתור חוזר |
| לחיצה כפולה | לחיצות מהירות בזמן טעינה → בקשת רשת אחת בלבד |
| שגיאת שרת | הרצה בלי מפתח / תגובת `5xx` → שגיאה כללית באדום עם אייקון; הנושא והבדיחה הקודמת נשארים |
| נושא לא מתאים | נושא בעייתי → הודעת "נושא לא מתאים" |
| Timeout | החלפה זמנית של `fetch` בדפדפן (דרך כלי הבדיקה) בבקשה שלא מסתיימת → אחרי 25 שניות שגיאה כללית |
| ניסיון חוזר | אחרי שגיאה, לחיצה נוספת כשהשירות תקין → בדיחה מוצגת |
| Offline לפני שליחה | הדמיית Offline בדפדפן → הודעת Offline, ואין בקשה ל-`/api/joke` |
| Offline באמצע (כשל רשת) | כשל `fetch` ללא תשובה → הודעת Offline |
| פתיחה Offline | טעינה ראשונה ברשת → מעבר ל-Offline → רענון: המסך עולה עם הגופנים והחתלתול |
| Manifest ו-Service Worker | ב-Build: Manifest תקין (שם, RTL, אייקונים), SW רשום ופעיל |
| אין Cache של בדיחות | רשימת המטמון של ה-SW לא כוללת `/api/*`; אין נתונים ב-`localStorage` |
| בדיחה ארוכה | הזרקת טקסט ארוך לכרטיס (דרך כלי הבדיקה) → גלילה אנכית, ללא גלילה אופקית ברוחב מובייל |
| מסך יחיד | כל המצבים בתוך אותו מסך, ללא מודאלים/דפים |

בדיקות שדורשות טלפון אמיתי (אפשרות התקנה ב-Android, התקנה דרך Share ב-iPhone, פתיחה Offline מהאפליקציה המותקנת) — מסומנות "ממתינות לבדיקה בטלפון".

## 9. סיום

- סימון 🟡 ליד הכותרת של Milestone 3 ב-`MILESTONES.md`. ללא commit.
- לפי כלל 5 ב-MILESTONES: אחרי הבדיקה המקומית של בעל המוצר מבקשים אישור ל-push, כדי לבדוק התקנה בטלפון בכתובת הציבורית — ורק אחר כך ✅.
- אין משתני סביבה חדשים ואין שינוי ב-`.env.example`.
