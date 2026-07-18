<div dir="rtl">

# Quickstart حالت Swarm

این quickstart یک checkout محلی هرمزچی را اجرا می‌کند، تشخیص خودکار profile را تأیید می‌کند، یک Hermes Agent با tmux-backed شروع می‌کند، اولین task را dispatch می‌کند و نشان می‌دهد کجا نتیجه را بازبینی کنید.

## ۰. پیش‌نیازها

نیاز دارید به:

- Node.js 22+
- pnpm
- git
- tmux برای کارگرهای پایدار TUI-backed
- یک profile پیکربندی‌شدهٔ Hermes Agent در `~/.hermes/profiles/`

فضای کار همچنان می‌تواند بدون tmux render شود، ولی tmux است که نشست‌های کارگر را به‌جای یک‌بارمصرف و دورریختنی، زنده نگه می‌دارد.

## ۱. کلون کردن فضای کار

```bash
git clone https://github.com/borhandarabi/hermeschi.git
cd hermeschi
```

## ۲. نصب وابستگی‌ها

```bash
pnpm install
```

## ۳. شروع فضای کار

```bash
pnpm dev
```

URL محلی چاپ‌شده توسط Vite/TanStack Start را باز کنید. در اکثر راه‌اندازی‌های محلی این است:

```text
http://localhost:3000
```

برخی laneهای release روی `:3002` اجرا می‌شوند؛ به خروجی terminal اعتماد کنید اگر متفاوت بود.

## ۴. تشخیص profile در اولین اجرا

در اولین اجرا، فضای کار به دنبال profileهای Hermes Agent در این مسیر می‌گردد:

```text
~/.hermes/profiles/
```

هر profile کارگر می‌تواند شامل موارد زیر باشد:

```text
~/.hermes/profiles/<workerId>/
  MEMORY.md
  SOUL.md
  USER.md
  memory/IDENTITY.md
  runtime.json
  skills/
```

APIهای roster و runtime از آن شکل profile برای پر کردن کارت‌های کارگر، state زمان اجرا، برچسب‌های مدل، نام‌های نشست tmux، وضعیت checkpoint و خلاصه‌های اخیر استفاده می‌کنند.

اگر یک کارگر در roster وجود دارد ولی profile محلی ندارد، همچنان می‌تواند به‌صورت roster-only ظاهر شود. قبل از انتظار به حافظهٔ پایدار، بارگذاری skill یا راه‌اندازی tmux، profile را بسازید یا import کنید.

## ۵. spawn کردن یک کارگر tmux-backed

### دیالوگ افزودن Swarm

در فضای کار:

۱. حالت Swarm را باز کنید.
۲. Add Swarm را انتخاب کنید.
۳. یک preset نقش انتخاب کنید.
۴. worker ID، display name، model، specialty، mission و skillها را تنظیم کنید.
۵. ذخیره کنید.
۶. نشست کارگر را از کارت یا نمای Runtime شروع کنید.

presetهای نقش defaultهای مهم را پر می‌کنند: role، specialty، mission، system prompt، skillها و default model. می‌توانید قبل از ذخیره آن‌ها را ویرایش کنید.

## ۶. dispatch اولین task

API dispatch این است:

```text
POST /api/swarm-dispatch
```

نمونهٔ مینیمال تک‌کارگری:

```bash
curl -X POST http://localhost:3000/api/swarm-dispatch   -H 'Content-Type: application/json'   -d '{
    "workerIds": ["swarm7"],
    "prompt": "Write a short checkpoint explaining what you can see in your current workspace. Do not modify files.",
    "timeoutSeconds": 240,
    "waitForCheckpoint": true
  }'
```

نمونهٔ فرم assignment:

```bash
curl -X POST http://localhost:3000/api/swarm-dispatch   -H 'Content-Type: application/json'   -d '{
    "missionTitle": "Docs smoke test",
    "assignments": [
      {
        "workerId": "swarm7",
        "task": "Review docs/swarm/README.md and return a checkpoint with one improvement suggestion.",
        "rationale": "Scribe owns docs and handoff quality."
      }
    ],
    "waitForCheckpoint": true,
    "checkpointPollSeconds": 90
  }'
```

شکل پاسخ مورد انتظار:

```json
{
  "missionId": "mission-...",
  "assignments": [
    { "workerId": "swarm7", "task": "..." }
  ],
  "results": [
    {
      "workerId": "swarm7",
      "ok": true,
      "delivery": "tmux",
      "checkpointStatus": "checkpointed"
    }
  ]
}
```

اگر `waitForCheckpoint` درست باشد، API برای یک checkpoint تازه از state زمان اجرا یا chat کارگر منتظر می‌ماند. اگر timeout شود، کارگر ممکن است همچنان در حال اجرا باشد؛ قبل از فرض fail بودن، نمای Runtime را بررسی کنید.

## ۷. مشاهدهٔ Reports + Inbox

حالت Swarm را باز کنید، سپس view را به Reports تغییر دهید.

Reports به شما می‌دهد:

- تاریخچهٔ mission
- state assignment
- checkpointهای کارگر
- blockerها
- موارد `NEEDS_REVIEW`
- کارت‌های Inbox آماده برای انسان
- اقدامات route-to-reviewer

Inbox جایی است که swarm به‌جای شجاع‌بودن در انظار، درخواست قضاوت می‌کند. خوب است.

## ۸. استفاده از Kanban TaskBoard

برای برنامه‌ریزی به view Kanban تغییر دهید. board زمانی مفید است که یک صف بصری می‌خواهید ولی همچنان می‌خواهید dispatch از طریق ارکستریتور انجام شود.

معانی پیشنهادی laneها:

| Lane | معنی |
| --- | --- |
| Backlog | مفید ولی آماده نیست. |
| Ready | به‌اندازهٔ کافی واضح برای dispatch. |
| Running | کارگر آن را در اختیار دارد. |
| Review | نیاز به reviewer یا اریک دارد. |
| Blocked | نیاز به repair، input، auth یا کاهش scope. |
| Done | checkpoint تأییدشده رسیده. |

## ۹. افزودن کارگر با presetهای نقش

دیالوگ افزودن Swarm شامل این presetهاست:

- Orchestrator
- Builder
- Reviewer
- Triage
- Lab
- Sage
- Scribe
- Foundation
- QA
- Mirror Integrations
- Custom

اول نزدیک‌ترین role را انتخاب کنید، سپس تنظیم کنید. از شروع با Custom پرهیز کنید مگر اینکه عمداً در حال ساخت یک lane جدید باشید. presetها قرارداد عملیاتی را رمزگذاری می‌کنند تا کارگر بداند آیا مجاز است build کند، بازبینی کند، triage کند، research کند یا فقط گزارش دهد.

## ۱۰. چک‌لیست اولین task

قبل از اعتماد به یک کارگر جدید:

- در roster ظاهر می‌شود.
- profile آن در `~/.hermes/profiles/<workerId>/` وجود دارد.
- نمای runtime می‌تواند به tmux متصل شود یا یک shell/log stream باز کند.
- `/api/swarm-dispatch` می‌تواند یک task تحویل دهد.
- کارگر فرمت canonical checkpoint را برمی‌گرداند.
- Reports checkpoint را نشان می‌دهد.
- ارکستریتور می‌تواند اقدام بعدی را route کند.

## ۱۱. رفع‌های رایج

### کارت کارگر وجود دارد ولی TUI متصل نمی‌شود

tmux را بررسی کنید:

```bash
tmux ls
```

نام نشست مورد انتظار:

```text
swarm-<workerId>
```

اگر نشست گمشده است، کارگر را شروع یا rotate کنید.

### dispatch برمی‌گرداند timeout

یک timeout به این معنی است که API در زمان مشخص checkpoint تازه‌ای ندید. همیشه به این معنی نیست که کارگر fail کرده.

بررسی کنید:

- نمای Runtime
- `runtime.json` کارگر
- transcript chat کارگر
- tab Reports پس از refresh

### کارگر role/model/skill اشتباه دارد

Add Swarm را باز کنید یا config roster را ویرایش کنید، سپس نشست کارگر را restart کنید. role، model و skillها بخشی از هویت کارگرند؛ تغییر آن‌ها در میانهٔ task ghostهای عجیب می‌سازد. ghostهای عجیب گران هستند.

## ۱۲. مرز عملیاتی امن

swarm می‌تواند commit، branch، PR body، review verdict، issue و release note را آماده کند. نباید بدون تأیید صریح انسانی merge کند، force-push کند، publish کند، به‌صورت عمومی announce کند، issue را close کند یا عملیات مخرب فایل انجام دهد.

آن مرز Greenlight Gate است. خسته‌کننده نگهش دارید.

</div>
