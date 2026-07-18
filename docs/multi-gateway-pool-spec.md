# معماری استخر چند-دروازه‌ای
## HermesChi — اجرای عامل موازی-بر-پروفایل

### وضعیت: سند طراحی — پیشنهاد PR

---

## ۱. بیان مسئله

HermesChi در حال حاضر به‌عنوان یک **رابط کاربری تک‌دروازه‌ای، تک‌پروفایلی** عمل می‌کند. دروازه یک `HERMES_HOME` را در زمان شروع بارگذاری می‌کند و همهٔ سشن‌های گفتگو، عملیات و دسترسی memory از همان یک فرآیند عبور می‌کنند.

برای کاربران چندپروفایلی (مورد استفادهٔ اصلی Claude)، این یعنی:
- **بدون اجرای موازی عامل**: نمی‌توان با Nous ایده‌پردازی کرد در حالی که Jules، Architect و Sentinel را در Operations هماهنگ می‌کند
- **بدون هویت profile در گفتگو**: «عامل» همیشه همان کسی است که دروازهٔ تک‌PROFILE به‌عنوان او راه‌اندازی شده
- **تکه‌تکه شدن ترمینال**: کاربران باید برای دستیابی به جریان‌های کاری واقعی چندعاملی، پنجرهٔ ترمینال جداگانه‌ای به‌ازای هر profile باز کنند
- **آلودگی سشن**: همهٔ سشن‌ها فارغ از اینکه کدام شخصیت عامل آن‌ها را ایجاد کرده، در یک استخر انباشته می‌شوند

### داستان کاربر

> «من با Nous به‌طور راهبردی دربارهٔ ویژگی‌های Ascent Performance فکر می‌کنم در حالی که Jules ساختن با Architect و Sentinel را هماهنگ می‌کند. می‌خواهم در همان پنجرهٔ workspace به‌سرعت میان این گفتگوهای عامل تعویض کنم، با هر عامل که memory، skills و زمینهٔ سشن خود را حفظ می‌کند.»

---

## ۲. طراحی بر اساس اصول اولیه

**حقیقت بنیادی**: هر profile هرمس یک **عامل شناختی متمایز** است — SOUL.md متفاوت، skills متفاوت، memory متفاوت، هدف متفاوت. آن‌ها «حالت‌های» یک عامل نیستند. آن‌ها عامل‌های موازی هستند.

**نتیجه**: workspace باید یک **هماهنگ‌کنندهٔ عامل** باشد، نه فقط یک پوستهٔ رابط کاربری روی یک دروازه.

**محدودیت**: دروازهٔ Hermes Agent به‌عنوان یک فرآیند تک‌مستأجر طراحی شده است. نمی‌تواند profileها را به‌صورت پویا reload کند. هر profile به نمونهٔ دروازهٔ خود نیاز دارد.

**راه‌حل**: workspace یک **استخر دروازه** را نگه می‌دارد — یک فرآیند دروازه به‌ازای هر profile فعال، هر کدام روی پورت خود، همگی تحت نظارت سلامت، همگی قابل مسیریابی از رابط کاربری.

**اصول طراحی:**
۱. **مستقل از تعداد profile**: برای ۱ profile یا ۱۰۰ کار می‌کند. بدون محدودیت‌های hardcodeشده، آرایه‌ها، یا دستورات switch که profileهای خاص را برمی‌شمرند.
۲. **حریم خصوصی بر اساس طراحی**: بدون PII، کلید API، رمز عبور یا secret در کد، لاگ یا PR. تمام داده‌های حساس در فایل‌های `.env` محلی-پروفایل باقی می‌مانند.
۳. **سازگار به‌عقب**: کاربران تک‌پروفایلی تحت‌تأثیر قرار نمی‌گیرند. حالت استخر opt-in است.
۴. **fail-safe**: یک دروازهٔ مرده workspace را crash نمی‌کند. fallback ایمن همیشه در دسترس است.

---

## ۳. مرور کلی معماری

```
┌─────────────────────────────────────────────────────────────┐
│                     HermesChi UI                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌───────────────┐  │
│  │ Chat    │  │ Ops     │  │ Memory  │  │ Profile       │  │
│  │ (Nous)  │  │ (Jules) │  │ (all)   │  │ Selector      │  │
│  └────┬────┘  └────┬────┘  └────┬────┘  └───────┬───────┘  │
└───────┼────────────┼────────────┼────────────────┼──────────┘
        │            │            │                │
        └────────────┴────────────┘                │
                   │                               │
        ┌──────────┴──────────┐                    │
        │  Gateway Router     │                    │
        │  (workspace server) │                    │
        └──────────┬──────────┘                    │
                   │                               │
    ┌──────────────┼──────────────┐                │
    │              │              │                │
┌───┴───┐    ┌────┴────┐   ┌─────┴─────┐   ┌─────┴─────┐
│Gateway│    │ Gateway │   │  Gateway  │   │  Gateway  │
│:8642  │    │ :8643   │   │  :8644    │   │  :8645    │
│(nous) │    │ (jules) │   │ (architect│   │ (sentinel)│
└───┬───┘    └────┬────┘   └─────┬─────┘   └─────┬─────┘
    │             │              │               │
┌───┴───┐    ┌────┴────┐   ┌─────┴─────┐   ┌─────┴─────┐
│nous/  │    │jules/   │   │architect/ │   │sentinel/  │
│config │    │config   │   │config     │   │config     │
│memory │    │memory   │   │memory     │   │memory     │
│skills │    │skills   │   │skills     │   │skills     │
│sessions│   │sessions │   │sessions   │   │sessions   │
└───────┘    └─────────┘   └───────────┘   └───────────┘
```

---

## ۴. مدیر استخر دروازه

### ۴.۱ قرارداد تخصیص پورت

```typescript
const BASE_PORT = 8642
function getGatewayPort(profileName: string, profiles: string[]): number {
  const index = profiles.indexOf(profileName)
  return BASE_PORT + Math.max(0, index)
}
```

profileها به‌ترتیب الفبایی مرتب می‌شوند تا تخصیص پورت پایدار تضمین شود. یک فایل persistence (`gateway-pool.json`) تخصیص‌ها را در طول restart به یاد می‌سپارد.

**مستقل از تعداد profile**: مدیر استخر profileها را به‌صورت پویا از فایل‌سیستم (`~/.hermes/profiles/*`) کشف می‌کند. هیچ فهرست hardcodeشده‌ای، هیچ تعداد حداکثری، و هیچ special-casing نام profile خاصی وجود ندارد. کاربری با ۲ profile و کاربری با ۵۰ profile از دقیقاً همان مسیر کد استفاده می‌کنند.

### ۴.۲ وضعیت‌های چرخهٔ حیات دروازه

```typescript
type GatewayState = 
  | 'spawning'      // فرآیند در حال شروع
  | 'healthy'       // در ۵s به /health پاسخ داد
  | 'degraded'      // پاسخ‌های کند (>۲s)
  | 'dead'          // شکست ۳ باره در بررسی سلامت
  | 'stopped'       // کاربر صریحاً متوقف کرد
```

### ۴.۳ پروتکل spawn

```typescript
function spawnGateway(profileName: string, port: number): ChildProcess {
  const profilePath = path.join(getClaudeRoot(), 'profiles', profileName)
  const env = {
    ...process.env,
    HERMES_HOME: profilePath,
    CLAUDE_GATEWAY_PORT: String(port),
    CLAUDE_PROFILE_NAME: profileName,
  }
  return spawn('claude', ['gateway', '--port', String(port)], { env })
}
```

**یادداشت**: دروازه باید از طریق `hermes gateway` spawn شود، نه از طریق gateway.ts داخلی workspace. workspace به یک هماهنگ‌کننده تبدیل می‌شود، نه یک میزبان دروازه.

### ۴.۴ ناظر سلامت

- هر دروازه `GET /health` را هر ۳۰s poll کنید
- ۳ شکست متوالی → علامت‌گذاری به‌عنوان `dead`، restart خودکار (با backoff)
- پاسخ کند (>۲s) → علامت‌گذاری به‌عنوان `degraded`، لاگ هشدار
- بازیابی → علامت‌گذاری به‌عنوان `healthy`

### ۴.۵ پروتکل خاموشی

هنگام خروج workspace (SIGTERM):
۱. ارسال خاموشی ایمن به همهٔ دروازه‌ها (`POST /shutdown`)
۲. ۱۰s منتظر بمانید
۳. SIGKILL هر چیزی که باقی مانده
۴. persist کردن وضعیت gateway-pool.json

---

## ۵. لایه مسیریابی درخواست

### ۵.۱ تغییرات مسیر API

تمام مسیرهای API workspace به **زمینهٔ profile** مجهز می‌شوند:

```typescript
// فعلی: /api/chat/completions
// جدید:    /api/chat/completions?profile=nous
//         یا header: X-Claude-Profile: nous

// مسیرهای proxy دروازه:
// /api/gateway/{profile}/chat/completions
// /api/gateway/{profile}/sessions
// /api/gateway/{profile}/memory
// و غیره.
```

### ۵.۲ پیاده‌سازی روتر

```typescript
// src/server/gateway-router.ts
export async function proxyToGateway(
  profileName: string,
  path: string,
  init?: RequestInit
): Promise<Response> {
  const gateway = gatewayPool.get(profileName)
  if (!gateway || gateway.state !== 'healthy') {
    throw new Error(`Gateway for profile "${profileName}" is unavailable`)
  }
  const url = `http://127.0.0.1:${gateway.port}${path}`
  return fetch(url, init)
}
```

### ۵.۳ سازگاری به‌عقب

هنگامی که هیچ profile مشخص نشده:
- پیش‌فرض به `activeProfile` (از فایل `~/.hermes/active_profile`)
- اگر آن فایل وجود نداشت، پیش‌فرض به نخستین profile موجود
- کاربران تک‌پروفایلی **هیچ تغییر رفتاری نمی‌بینند**

---

## ۶. مدل جداسازی سشن

### ۶.۱ ذخیره‌سازی سشن

در حال حاضر: همهٔ سشن‌ها در `~/.hermes/sessions/` (یا دایرکتوری سشن‌های profile)

با چند-دروازه: هر دروازه سشن‌های خود را در دایرکتوری profile خود مدیریت می‌کند. workspace آن‌ها را برای نمایش **تجمیع** می‌کند اما به‌ازای هر profile **مسیریابی** می‌کند.

```typescript
// src/server/sessions-aggregator.ts
export async function listAllSessions(): Promise<SessionMeta[]> {
  const profiles = listProfiles()
  const allSessions = await Promise.all(
    profiles.map(async (profile) => {
      const gateway = gatewayPool.get(profile.name)
      if (!gateway) return []
      const res = await fetch(`http://127.0.0.1:${gateway.port}/api/sessions`)
      const sessions = await res.json()
      return sessions.map((s: SessionMeta) => ({
        ...s,
        profile: profile.name,
        profileColor: getProfileColor(profile.name),
      }))
    })
  )
  return allSessions.flat().sort((a, b) => b.updatedAt - a.updatedAt)
}
```

### ۶.۲ نمایش سشن

سشن‌ها در sidebar **بر اساس profile گروه‌بندی** می‌شوند با تمایز بصری:

```
SESSIONS
▼ nous (نقطهٔ سبز)
  ├─ Hello from workspace test · 3:05 PM
  └─ Email triage architecture · Apr 22
▼ jules (نقطهٔ آبی)
  ├─ Ascent build orchestration · 2:30 PM
  └─ PR #118 coordination · Apr 21
▼ architect (نقطهٔ بنفش)
  └─ Gateway pool refactor · Apr 20
```

---

## ۷. تغییرات رابط کاربری

### ۷.۱ انتخابگر profile (سراسری header)

یک pill/button پایدار در بالا-چپ (کنار toggle sidebar):

```
[☰] [ nous ▼ ]              HermesChi
```

- dropdown همهٔ profileها را با نشانگرهای وضعیت فهرست می‌کند
- نقطهٔ سبز = دروازهٔ سالم
- نقطهٔ زرد = degraded
- نقطهٔ قرمز = dead/stopped
- کلیک، profile فعال را برای **پنل فعلی** تعویض می‌کند
- میانبرهای کیبورد `Cmd+Shift+1..6` برای تعویض سریع

### ۷.۲ صفحهٔ گفتگو

- حالت خالی نام profile فعال + مدل را نشان می‌دهد (هم‌اکنون در PR #118 پیاده‌سازی شده)
- فهرست سشن نقطه‌های رنگی profile را به‌ازای هر سشن نشان می‌دهد
- composer به دروازهٔ profile فعال ارسال می‌کند
- «New Session» سشن معکوب به profile فعال ایجاد می‌کند

### ۷.۳ Operations / Conductor

- کارت‌های وظیفه نشان می‌دهند روی کدام profile در حال اجرا هستند
- dropdown «Run on» هنگام ایجاد وظایف
- داشبورد Operations وظایف را در همهٔ profileها تجمیع می‌کند

### ۷.۴ مرورگر memory

- ورودی‌های memory با profile برچسب‌گذاری می‌شوند
- فیلتر بر اساس profile
- جستجوی memory بین‌پروفایلی (اختیاری، قابل پیکربندی توسط کاربر)

---

## ۸. تغییرات فایل مورد نیاز

### فایل‌های جدید
```
src/server/gateway-pool.ts          # مدیر استخر هسته
src/server/gateway-pool.test.ts     # آزمون‌های استخر
src/server/gateway-router.ts        # لایه مسیریابی درخواست
src/server/sessions-aggregator.ts   # تجمیع سشن چندپروفایلی
src/components/profile-selector.tsx # انتخابگر سراسری profile
src/components/profile-badge.tsx    # نشانگر کوچک profile
src/hooks/use-gateway-pool.ts       # hook ری‌اکت برای وضعیت استخر
src/routes/api/gateway-pool.ts      # API وضعیت استخر
```

### فایل‌های تغییر یافته
```
src/server/profiles-browser.ts      # افزودن فیلد پورت دروازه
src/routes/api/profiles/list.ts     # شامل وضعیت دروازه
src/routes/api/chat.ts              # مسیریابی به دروازهٔ صحیح
src/routes/api/sessions.ts          # تجمیع در طول دروازه‌ها
src/screens/chat/chat-screen.tsx    # ارسال زمینهٔ profile
src/screens/chat/components/chat-header.tsx  # نمایش badge profile
src/screens/chat/components/chat-empty-state.tsx  # هم‌اکنون انجام شده
src/components/workspace-shell.tsx  # افزودن انتخابگر profile
src/server/local-provider-discovery.ts  # کشف provider چند-دروازه‌ای
```

---

## ۹. پیکربندی

### متغیرهای محیطی
```bash
CLAUDE_GATEWAY_POOL_ENABLED=true   # فعال‌سازی حالت چند-دروازه‌ای
CLAUDE_GATEWAY_BASE_PORT=8642      # پورت شروع
CLAUDE_GATEWAY_POOL_MAX=10         # حداکثر دروازه‌های همزمان
CLAUDE_GATEWAY_HEALTH_INTERVAL=30  # ثانیه‌های بررسی سلامت
```

### workspace-overrides.json
```json
{
  "gatewayPool": {
    "enabled": true,
    "autoSpawn": ["nous", "jules"],
    "portOverrides": {
      "nous": 8642,
      "jules": 9000
    }
  }
}
```

---

## ۱۰. مدیریت خطا و موارد مرزی

| سناریو | رفتار |
|----------|----------|
| شکست در spawn دروازه | نمایش toast خطا، اجازه retry، fallback به profile فعال |
| پورت هم‌اکنون در حال استفاده | افزایش خودکار پورت، لاگ هشدار |
| حذف profile در حین اجرای دروازه | توقف دروازه، حذف از استخر |
| crash شدن workspace | در restart، بررسی دروازه‌های orphan، adopt یا kill |
| کاربر تک‌پروفایلی | حالت استخر به‌طور پیش‌فرض خاموش، بدون تأثیر |
| ناهماهنگی نسخهٔ دروازه | لاگ هشدار، تلاش spawn به‌هر حال |
| فشار memory | اجازه به کاربر برای توقف دروازه‌های idle، نگه‌داری دروازه‌های فعال |

---

## ۱۱. ملاحظات امنیتی و حریم خصوصی

- دروازه‌ها فقط به `127.0.0.1` bind می‌شوند (هم‌اکنون پیش‌فرض)
- بدون نشت memory بین‌پروفایلی (هر دروازه `HERMES_HOME` خود را دارد)
- انتخابگر profile به middleware auth احترام می‌گذارد
- فقط ادمین: قابلیت spawn/stop دروازه‌ها
- **بدون secret در کد یا PR**: کلیدهای API، رمزهای عبور، tokenها و PII هرگز نباید در کد منبع، fixtureهای آزمون، خروجی لاگ یا توصیف PR ظاهر شوند. تمام پیکربندی حساس در فایل‌های `.env` محلی-پروفایل قرار دارد که `.gitignore` شده‌اند.
- **نمونه‌های sanitizeشده**: نمودارهای معماری و نمونه‌ها از نام‌های profile خیالی (مثلاً `agent-alpha`، `agent-beta`) یا placeholder عمومی استفاده می‌کنند، هرگز نام profile کاربر واقعی، مسیرها یا اعتبارنامه‌ها.
- **بدون مسیرهای hardcodeشده**: تخصیص پورت، دایرکتوری‌های profile و URLهای دروازه به‌صورت پویا resolve می‌شوند. هیچ مسیر `/Users/...` یا `C:\Users\...` در کد نیست.
- **ایمنی لاگ**: لاگ‌های استخر دروازه باید هر متغیر محیطی حاوی `KEY`، `TOKEN`، `SECRET` یا `PASSWORD` را redact کنند.

---

## ۱۲. عملکرد

| معیار | هدف |
|--------|--------|
| زمان spawn دروازه | < ۳s |
| تأخیر تعویض profile | < ۲۰۰ms (بدون نیاز به spawn) |
| overhead بررسی سلامت | < ۱۰ms به‌ازای هر دروازه |
| memory به‌ازای هر دروازه | ~۱۰۰-۲۰۰MB |
| حداکثر profileهای پیشنهادی | ۱۰ (قابل پیکربندی) |

---

## ۱۳. سازگاری به‌عقب

- **کاربران تک‌پروفایلی**: کاملاً تحت‌تأثیر قرار نمی‌گیرند. حالت استخر به‌طور پیش‌فرض خاموش است.
- **کاربران چندپروفایلی (فعلی)**: حالت استخر می‌تواند در تنظیمات toggle شود. هنگامی که خاموش است، رفتار با حالت تک‌دروازهٔ فعلی مطابقت دارد.
- **سشن‌های موجود**: حفظ می‌شوند. هر سشن هم‌اکنون در دایرکتوری profile خود زندگی می‌کند. workspace فقط آن‌ها را به‌درستی تجمیع می‌کند.
- **قراردادهای API**: تمام مسیرهای `/api/*` موجود هنگامی که هیچ profile مشخص نشده، بدون تغییر کار می‌کنند.

---

## ۱۴. مسیر مهاجرت

۱. **فاز ۱ (این PR)**: مدیر استخر + لایه مسیریابی + انتخابگر profile در گفتگو
۲. **فاز ۲ (پیگیری)**: تجمیع سشن با گروه‌بندی profile
۳. **فاز ۳ (پیگیری)**: پشتیبانی چندپروفایلی Operations/Conductor
۴. **فاز ۴ (پیگیری)**: جستجوی بین‌پروفایلی مرورگر memory

---

## ۱۵. کارهای مرتبط

- PR #118: پیکربندی آگاه از profile (merge شده) — `HERMES_HOME` resolution و فهرست‌کردن profile را فراهم می‌کند
- Issue #?: مدیریت سشن چندپروفایلی (برای ایجاد)
- Issue #?: hookهای چرخهٔ حیات دروازه (برای ایجاد)

---

## ۱۶. سوالات باز برای بحث

۱. آیا workspace باید همهٔ دروازه‌های profile را در startup به‌صورت خودکار spawn کند، یا فقط در نخستین استفاده؟
۲. آیا باید یک profile «پیش‌فرض workspace» همیشه فعال باشد، یا هر پنل باید آخرین profile خود را به یاد بیاورد؟
۳. صفحهٔ Conductor چگونه باید با وظایفی که چندین profile را در بر می‌گیرند رفتار کند (مثلاً Jules به Architect delegate می‌کند)؟
۴. آیا profileها باید یک جریان اعلان متحد داشته باشند، یا هر profile باید badge اعلان خود را داشته باشد؟

---

*تألیف شده توسط Nous (Vivere Vitalis) برای پروژهٔ HermesChi.*
*معماری بر اساس اصول اولیه: اگر هر profile یک عامل متمایز است، workspace باید یک هماهنگ‌کنندهٔ عامل باشد.*
