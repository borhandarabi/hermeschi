# مشخصات چارچوب حافظه Swarm2

تاریخ: 2026-04-28
وضعیت: مشخصات پیاده‌سازی مرحله ۱
مخزن کانونیک: `/Users/aurora/hermeschi`

## هدف

کارگران Swarm2 به پیوستگی بین وظایف، فشرده‌سازی، ری‌استارت و ماموریت‌های چندجلسه‌ای نیاز دارند.

امروز هر کارگر یک پروفایل Hermes، یک `state.db`، یک `runtime.json` و یک جلسه tmux دارد. این هویت فرآیند را فراهم می‌کند، اما نه یک لایه حافظه ساختاریافته. چارچوب حافظه، حافظه مبتنی بر فایل قطعی را اضافه می‌کند که بعداً می‌تواند با ارائه‌دهندگان حافظه معنایی بومی Claude تقویت شود.

نسخه اول باید ساده، قابل بررسی و پایدار باشد:

- فایل‌های markdown برای حافظه قابل خواندن توسط انسان،
- فراداده JSON جایی که ساختار مهم است،
- نوشتن‌های اتمیک از hookهای سرور،
- یادآوری به سبک grep در ابتدا،
- یادآوری برداری/ارائه‌دهنده بعداً.

## مسیرهای کانونیک

این مسیرها قفل شده‌اند. مسیرهای پروفایل Claude/OpenClaw را برای حافظه محلی کارگر جایگزین نکنید.

| لایه | مسیر کانونیک |
| --- | --- |
| ریشه پروفایل کارگر | `~/.hermes/profiles/<workerId>/` |
| DB چت کارگر | `~/.hermes/profiles/<workerId>/state.db` |
| وضعیت اجرایی کارگر | `~/.hermes/profiles/<workerId>/runtime.json` |
| ریشه حافظه کارگر | `~/.hermes/profiles/<workerId>/memory/` |
| حافظه تازه‌سازی‌شده کارگر | `~/.hermes/profiles/<workerId>/memory/MEMORY.md` |
| فایل هویت کارگر | `~/.hermes/profiles/<workerId>/memory/IDENTITY.md` |
| فایل نقش/پرسونا کارگر | `~/.hermes/profiles/<workerId>/memory/SOUL.md` |
| حافظه ماموریت کارگر | `~/.hermes/profiles/<workerId>/memory/missions/<missionId>/` |
| خلاصه ماموریت کارگر | `~/.hermes/profiles/<workerId>/memory/missions/<missionId>/SUMMARY.md` |
| لاگ رویداد ماموریت کارگر | `~/.hermes/profiles/<workerId>/memory/missions/<missionId>/events.jsonl` |
| لاگ‌های اپیزودیک کارگر | `~/.hermes/profiles/<workerId>/memory/episodes/YYYY-MM-DD.md` |
| تحویل‌های کارگر | `~/.hermes/profiles/<workerId>/memory/handoffs/<missionId>.md` |
| runtime صفحه کنترل swarm | `/Users/aurora/hermeschi/.runtime/` |
| دفتر ماموریت swarm | `/Users/aurora/hermeschi/.runtime/swarm-missions.json` |
| فهرست swarm / منبع حقیقت | `/Users/aurora/hermeschi/swarm.yaml` |
| تحویل‌های مشترک swarm | `/Users/aurora/.openclaw/workspace/memory/handoffs/swarm/` |
| آرشیو/حافظه مشترک swarm | `/Users/aurora/.openclaw/workspace/memory/swarm/` |
| آرشیو ماموریت کامل‌شده | `/Users/aurora/.openclaw/workspace/memory/swarm/missions/<missionId>/` |

مسیرهای صریحاً اشتباه:

- `~/.hermes/profiles/...`
- `~/.openclaw/profiles/...`
- `/Users/aurora/hermeschi/.runtime/...`
- `/Users/aurora/.ocplatform/workspace/...` برای نوشتن‌های کانونیک جدید

## مدل مالکیت

### حافظه محلی کارگر

ذخیره‌شده در `~/.hermes/profiles/<workerId>/memory/`.

متعلق به کارگر. استفاده برای:

- هویت پایدار کارگر،
- قراردادهای خاص نقش،
- تصمیمات محلی ماموریت،
- تاریخچه اپیزودیک وظایف،
- تحویل‌های فشرده‌سازی/ری‌استارت.

### وضعیت صفحه کنترل swarm

ذخیره‌شده در `/Users/aurora/hermeschi/.runtime/`.

متعلق به کد سرور Swarm2. استفاده برای:

- دفتر ماموریت،
- وضعیت‌های تخصیص،
- وضعیت هماهنگی تولیدشده توسط runtime،
- artifacts گذرای سرور.

### حافظه مشترک swarm

ذخیره‌شده در `/Users/aurora/.openclaw/workspace/memory/swarm/` و `/Users/aurora/.openclaw/workspace/memory/handoffs/swarm/`.

متعلق به هماهنگ‌کننده/جلسه اصلی. استفاده برای:

- تحویل‌های بین‌کارگری،
- آرشیو ماموریت،
- درس‌های swarm-wide،
- زمینه هماهنگی که باید طولانی‌تر از یک پروفایل کارگر عمر کند.

## قراردادهای فایل

### `MEMORY.md`

حافظه بلندمدت تازه‌سازی‌شده برای یک کارگر.

هدف:

- حقایق و ترجیحات که باید از ماموریت‌ها جان سالم به در ببرند،
- محدودیت‌های نقش پایدار،
- درس‌های پایدار،
- gotchaهای تکرارشونده.

قوانین:

- مختصر، تازه‌سازی‌شده، نه یک لاگ خام،
- ترفیع از حافظه ماموریت/اپیزودیک فقط وقتی به‌طور گسترده مفید باشد،
- بارگذاری در startup کارگر توسط skill آینده `swarm-memory`.

قالب اولیه:

```markdown
# Memory — <workerId>

## Role

<role and specialty from swarm.yaml>

## Durable operating notes

- ...

## Project conventions

- ...

## Lessons learned

- ...
```

### `IDENTITY.md`

فراداده هویت پایدار.

```markdown
# IDENTITY.md — <workerId>

- Name: <display name>
- Worker ID: <workerId>
- Role: <role>
- Specialty: <specialty>
- Model: <model>
```

### `SOUL.md`

دستورالعمل‌های نقش/پرسونا برای کارگر.

هدف:

- رفتار خاص نقش،
- لحن و سبک تصمیم،
- قوانین تشدید،
- میزان کیفیت.

### حافظه ماموریت

مسیر:

`~/.hermes/profiles/<workerId>/memory/missions/<missionId>/`

فایل‌ها:

- `SUMMARY.md` — زمینه ماموریت قابل خواندن توسط انسان و وضعیت جاری
- `events.jsonl` — جریان رویداد ساختاریافته append-only
- `handoff.md` — آخرین تحویل خاص ماموریت، در صورت وجود

قالب `SUMMARY.md`:

```markdown
# Mission <missionId> — <title>

## Current state

- Status: planning | executing | blocked | review | complete
- Current assignment: <assignmentId or none>
- Last updated: <ISO timestamp>

## Objective

<mission objective>

## Decisions

- ...

## Files touched

- ...

## Checkpoints

- ...

## Blockers

- ...

## Next action

...
```

شکل رویداد `events.jsonl`:

```json
{"at":"2026-04-28T00:00:00.000Z","type":"dispatch","workerId":"swarm5","missionId":"mission-...","assignmentId":"assign-...","summary":"Dispatched builder task"}
```

انواع رویداد:

- `mission-start`
- `dispatch`
- `checkpoint`
- `handoff-requested`
- `handoff-written`
- `resume`
- `blocked`
- `complete`
- `note`

### لاگ‌های اپیزودیک

مسیر:

`~/.hermes/profiles/<workerId>/memory/episodes/YYYY-MM-DD.md`

هدف:

- فعالیت زمان‌مند کارگر،
- grep آسان،
- خام-مانند اما همچنان قابل خواندن.

قالب:

```markdown
# Episodes — <workerId> — YYYY-MM-DD

## HH:MM UTC — <event type>

- Mission: <missionId>
- Assignment: <assignmentId>
- Summary: ...
- Result: ...
- Next action: ...
```

### تحویل‌ها

تحویل محلی کارگر:

`~/.hermes/profiles/<workerId>/memory/handoffs/<missionId>.md`

آخرین تحویل مشترک:

`/Users/aurora/.openclaw/workspace/memory/handoffs/swarm/<workerId>-latest.md`

قالب:

```markdown
# Handoff — <workerId> — <missionId>

Generated: <ISO timestamp>

## Current state

...

## Objective

...

## Completed

...

## In progress

...

## Files touched

...

## Commands run

...

## Blockers

...

## Next exact action

...

## Resume prompt

When this worker restarts, load this handoff, inspect runtime.json, then continue from "Next exact action".
```

## قراردادهای API

### `GET /api/swarm-memory`

پارامترهای query:

- `workerId` الزامی مگر اینکه حافظه مشترک خوانده شود
- `kind`: `profile | mission | episodic | handoff | shared`
- `missionId` اختیاری/الزامی برای حافظه ماموریت
- `date` اختیاری برای لاگ‌های اپیزودیک

برمی‌گرداند:

```json
{
  "ok": true,
  "workerId": "swarm5",
  "kind": "mission",
  "path": "...",
  "files": [
    { "name": "SUMMARY.md", "path": "...", "content": "..." }
  ]
}
```

### `POST /api/swarm-memory`

بدنه:

```json
{
  "workerId": "swarm5",
  "kind": "mission",
  "missionId": "mission-...",
  "eventType": "checkpoint",
  "content": "markdown or summary text",
  "event": { "state": "DONE", "result": "..." }
}
```

قوانین:

- اعتبارسنجی `workerId`، `missionId` و path traversal،
- ایجاد دایرکتوری‌ها در صورت تقاضا،
- نوشتن اتمیک markdown،
- append اتمیک رویدادهای JSONL،
- آینه‌سازی اختیاری تحویل‌ها به مسیر تحویل مشترک.

### `GET /api/swarm-memory/search`

پارامترهای query:

- `workerId` اختیاری،
- `query` الزامی،
- `scope`: `worker | shared | all`، پیش‌فرض `worker`،
- `limit`، پیش‌فرض ۱۰.

پیاده‌سازی مرحله ۱:

- جستجوی متنی شبیه grep روی فایل‌های markdown/jsonl،
- رتبه‌بندی ساده: عبارت دقیق > همپوشانی توکن > قدمت،
- بازگرداندن snippetها با مسیرها و شماره خطوط.

بعداً:

- استفاده از ارائه‌دهنده حافظه بومی Claude یا ارائه‌دهنده خارجی برای یادآوری معنایی.

## یکپارچه‌سازی با skillهای موجود

### `swarm-worker-core`

قبلاً انضباط چک‌پوینت و گزارش‌دهی runtime را تعریف کرده است.

چارچوب حافظه اضافه می‌کند:

- هر چک‌پوینت می‌تواند به یک رویداد ماموریت تبدیل شود،
- هر چک‌پوینت می‌تواند به حافظه اپیزودیک append شود،
- درس‌های پایدار می‌توانند به `MEMORY.md` ترفیع یابند.

### `swarm-dev-runtime`

قبلاً ناوراری‌های پروفایل/tmux بومی Claude را تعریف کرده است.

چارچوب حافظه باید رعایت کند:

- ریشه پروفایل `~/.hermes/profiles/<workerId>`،
- `HERMES_HOME` برای هر کارگر،
- جلسات tmux با نام `swarm-<workerId>`،
- wrapperها در `~/.local/bin/swarmN`.

### `swarm-orchestrator`

از حافظه استفاده می‌کند برای:

- جستجوی تاریخچه کارگر قبل از تخصیص،
- پیوست زمینه ماموریت مرتبط به پرامپت‌ها،
- یافتن تحویل‌های قبلی،
- آرشیو ماموریت‌های کامل‌شده.

### skillهای نقش

`swarm-pr-worker`، `swarm-ui-worker`، `swarm-bench-worker` و skillهای نقش آینده از `swarm-memory` برای یادآوری خاص نقش استفاده می‌کنند.

### `self-improving-agent`

قراردادهای یادگیری/ترفیع را فراهم می‌کند.

چارچوب حافظه اتخاذ می‌کند:

- الگوی لاگ روزانه،
- `MEMORY.md` به‌عنوان حافظه بلندمدت تازه‌سازی‌شده،
- ترفیع یادگیری‌های به‌طور گسترده مفید.

## رفتار startup/resume

skill آینده `swarm-memory` باید به کارگران دستور دهد بارگذاری کنند:

۱. `IDENTITY.md`، `SOUL.md` و `MEMORY.md`،
۲. `runtime.json` برای تشخیص `currentMissionId`،
۳. `SUMMARY.md` ماموریت فعال، در صورت وجود،
۴. آخرین تحویل محلی/مشترک برای ماموریت جاری، در صورت وجود،
۵. ورودی‌های اپیزودیک اخیر مرتبط با ماموریت فعال.

پرامپت resume باید فشرده باشد:

```text
Load your worker memory from ~/.hermes/profiles/<workerId>/memory/.
If runtime.json has currentMissionId, read that mission SUMMARY.md and latest handoff.
Continue from the handoff's Next exact action.
```

## hookهای نوشتن خودکار

hookهای مرحله ۱:

- شروع dispatch → رویداد ماموریت + ورودی اپیزودیک،
- parse چک‌پوینت → رویداد ماموریت + ورودی اپیزودیک + به‌روزرسانی SUMMARY.md،
- تحویل lifecycle درخواست شد → رویداد handoff-requested،
- نوشته شدن تحویل → تحویل محلی + آخرین تحویل مشترک.

## امنیت و حریم خصوصی

- `MEMORY.md` جلسه اصلی خصوصی را در پروفایل‌های کارگر کپی نکنید.
- کارگران فقط حافظه پروفایل خود به همراه حافظه ماموریت/swarm مشترک را دریافت می‌کنند.
- حافظه مشترک swarm باید شامل دانش پروژه/فرآیند باشد، نه زمینه Eric-خصوصی مگر اینکه صریحاً در نظر گرفته شده باشد.
- تمام نوشتن‌ها باید داخل ریشه‌های کانونیک باقی بمانند.

## تحویل‌دادنی‌های مرحله ۱

۱. `src/server/swarm-memory.ts`
۲. `src/routes/api/swarm-memory.ts`
۳. `src/routes/api/swarm-memory/search.ts` یا مسیر معادل
۴. hookهای نوشتن خودکار در dispatch/checkpoint/lifecycle
۵. `skills/swarm-memory/SKILL.md`
۶. تست‌های حداقلی برای resolution مسیر، نوشتن‌ها و جستجو

## تحویل‌دادنی‌های مرحله ۲

۱. یکپارچه‌سازی auto-renew در lifecycle،
۲. یکپارچه‌سازی پرامپت loader startup/resume کارگر،
۳. export آرشیو ماموریت،
۴. پنل حافظه کارت کارگر.

## تحویل‌دادنی‌های مرحله ۳

۱. bridge اختیاری ارائه‌دهنده حافظه Claude،
۲. یادآوری برداری/معنایی،
۳. توصیه حافظه بین‌کارگری در decompose/routing.
