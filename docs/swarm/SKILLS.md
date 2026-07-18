# Skillهای Swarm

skillها دانش عملیاتی قابل استفادهٔ مجدد پشت حالت Swarm هستند. یک preset نقش، نام skillهایی را که یک کارگر باید بارگذاری کند تعیین می‌کند؛ profile و مسیر skillها آن skillها را در زمان اجرا در دسترس قرار می‌دهند.

یک skill، یک vibe نیست. یک رویه است: چه زمانی استفاده شود، چه commandهایی اجرا شوند، چه فایل‌هایی مهم باشند، چه pitfallsهایی وجود دارند و چگونه نتیجه را تأیید کنید.

## skillهای swarm بسته‌بندی‌شده

| Skill | استفاده برای |
| --- | --- |
| `swarm-orchestrator` | حلقهٔ ارکستریتور، dispatch، drift detection، re-prompt، escalation، routing mission. |
| `swarm-worker-core` | قرارداد پایهٔ کارگر: phaseها، checkpointها، state زمان اجرا، blockerها، handoffها. |
| `swarm-review-learning-loop` | ضبط learningهای بازبینی، failureهای تکراری و بهبودهای skill پس از taskها. |
| `byte-verified-code-review` | بازبینی diffها با proof سطح byte برای تغییرات naming-sensitive و generated-file. |
| `swarm-bench-worker` | کار benchmark/lab برای مدل‌های محلی، آزمایش‌های runtime و ثبت نتایج. |
| `swarm-pr-worker` | workflow GitHub issue/PR، triage، patching، آماده‌سازی PR، feedback بازبینی. |
| `swarm-ui-worker` | lane پیاده‌سازی UI برای surfaceهای هرمزچی. |
| `swarm-dev-runtime` | قراردادهای runtime، APIهای backend، lifecycle، health و wiring تعمیر. |
| `swarm-memory` | انتظارات حافظهٔ file-backed برای کارگرها و تاریخچهٔ ارکستریتور. |
| `swarm-orchestration-loop` | حلقهٔ canonical orchestration/review برای ناوگان کارگر پایدار. |
| `swarm-review-learning-loop` | حلقهٔ مشترک برای تبدیل outcomeهای task به بهبودهای پایدار. |

برخی installationها ممکن است skill بازبینی byte را متفاوت نام‌گذاری کنند. اگر skill دقیق موجود نیست، از skill بازبینی موجودی استفاده کنید که byte check، diff review، تست، build، smoke و discipline verdict را اعمال می‌کند.

## نحوهٔ بارگذاری خودکار skillها

وقتی repo را کلون می‌کنید و فضای کار را اجرا می‌کنید، نشست‌های کارگر skillها را از profile پیکربندی‌شدهٔ Hermes Agent بارگذاری می‌کنند. در محیط release اریک، profileها به یک دایرکتوری skill مشترک اشاره می‌کنند، که معمولاً برای کارگرها به این شکل در دسترس است:

```text
~/.ocplatform/workspace/skills/
```

یک profile کارگر همچنین می‌تواند skillهای profile-local را در زیر داشته باشد:

```text
~/.hermes/profiles/<workerId>/skills/
```

قاعدهٔ مهم این است که runtime کارگر باید بتواند نام skill را از profile خود حل کند. UI می‌تواند default skillهای یک role را نمایش دهد، ولی کارگر همچنان به فایل‌های skill به‌صورت محلی نیاز دارد.

## defaultهای role-to-skill

| Role | default skillها |
| --- | --- |
| Orchestrator | `swarm-orchestrator`, `swarm-worker-core`, `swarm-review-learning-loop`, `self-improvement` |
| Builder | `swarm-worker-core`, `byte-verified-code-review` |
| Reviewer | `swarm-worker-core`, `byte-verified-code-review`, `swarm-review-learning-loop` |
| Triage | `swarm-worker-core`, `byte-verified-code-review`, `swarm-review-learning-loop` |
| Lab | `swarm-worker-core`, `pc1-ollama-gguf-bench`, `swarm-bench-worker` |
| Sage | `swarm-worker-core`, `last30days`, `pdf-and-paper-deep-reading` |
| Scribe | `swarm-worker-core`, `last30days`, `creative-writing` |
| Foundation | `swarm-worker-core` |
| QA | `swarm-worker-core`, `byte-verified-code-review` |
| Mirror Integrations | `swarm-worker-core`, `claude-promo`, `songwriting-and-ai-music` |
| Custom | بدون default skill |

## سهم هر skill core

### swarm-worker-core

قرارداد پایه برای هر Hermes Agent:

- فهمیدن task
- تنظیم phase
- اجرای next meaningful step
- تأیید
- checkpoint
- ادامه، escalation یا توقف تمیز

اگر یک کارگر فقط یک skill داشته باشد، باید این را داشته باشد.

### swarm-orchestrator

توسط lane ارکستریتور استفاده می‌شود. مالک:

- تجزیهٔ mission
- routing بر اساس role
- drift detection
- تفسیر checkpoint
- re-prompt
- escalation
- اولویت lane
- hygiene handoff

ارکستریتور نباید بهترین coder در اتاق باشد. باید کارگری باشد که هر کارگر دیگر را مفید می‌کند.

### swarm-review-learning-loop

پس از کارهای تکمیل‌شده و بازبینی‌ها برای تبدیل outcome به حافظه یا بهبودهای skill استفاده می‌شود. این مانع می‌شود swarm بارها و بارها روی همان بیل بپرد و آن را research بنامد.

### byte-verified-code-review

برای gateهای بازبینی استفاده می‌شود. به‌جای «خوب به‌نظر می‌رسد»، proof را الزامی می‌کند:

- بررسی diff دقیق
- byte-check naming شکننده یا خروجی generated
- اجرای tests/build/smoke
- بیان verdict
- مستندسازی دقیق blockerها

### swarm-bench-worker

توسط Lab برای آزمایش‌های مدل محلی و runtime استفاده می‌شود:

- plan benchmark
- اجرای کنترل‌شده
- ضبط نتیجه
- یادداشت‌های reproducibility
- آستانهٔ escalation

### swarm-pr-worker

توسط laneهای PR/issues استفاده می‌شود:

- scan issue
- scoring
- بازتولید
- discipline branch
- آماده‌سازی fix/test/PR
- مدیریت feedback بازبینی

### swarm-ui-worker

توسط UI builderها استفاده می‌شود:

- بررسی route
- مرزهای component
- visual state
- smoke checkها
- تأیید build

### swarm-dev-runtime

توسط laneهای Foundation/runtime استفاده می‌شود:

- قراردادهای API
- state profile/runtime
- health checkها
- تعمیر lifecycle
- ادغام tmux/gateway

## افزودن skillهای سفارشی

یک دایرکتوری skill با فایل `SKILL.md` بسازید:

```text
skills/my-skill/
  SKILL.md
  references/
  templates/
  scripts/
```

frontmatter پیشنهادی:

```yaml
---
name: my-skill
description: One sentence explaining when a worker must load this skill.
---
```

بخش‌های پیشنهادی:

```markdown
# My Skill

## Trigger
When to use it.

## Steps
1. Exact first step.
2. Exact second step.
3. Verification.

## Pitfalls
- Known failure mode.
- Exact unblock action.

## Output contract
What the worker must return.
```

## افزودن یک skill سفارشی به کارگر

۱. پوشهٔ skill را به دایرکتوری skill مشترک یا دایرکتوری `skills/` profile کارگر اضافه کنید.
۲. نام skill را به preset نقش یا ورودی roster کارگر اضافه کنید.
۳. نشست کارگر را restart یا rotate کنید تا profile بارگذاری مجدد شود.
۴. یک task کوچک که نیاز به skill دارد dispatch کنید.
۵. تأیید کنید checkpoint نام skill را می‌آورد و proof برمی‌گرداند.

## قواعد hygiene skill

یک skill باید patch شود وقتی:

- یک command stale شده
- یک مسیر تغییر کرده
- یک فرض setup اشتباه است
- یک کارگر با یک error تکراری مواجه شده که آنجا مستند نشده
- workflow ترجیحی کاربر تغییر کرده
- یک مرحلهٔ تأیید بهتر وجود دارد

برای رویه‌ای که در skill قرار دارد، memory note نسازید. memory factهای پایدار را ذخیره می‌کند؛ skill workflowهای قابل تکرار را ذخیره می‌کند.

## چک‌لیست بارگذاری skill

قبل از مقصر دانستن یک کارگر:

- آیا skill با نام دقیق وجود دارد؟
- آیا profile کارگر به دایرکتوری skillها دسترسی دارد؟
- آیا نشست پس از اضافه‌شدن skill شروع شد؟
- آیا preset نقش شامل skill است؟
- آیا task نیازمند بارگذاری skill توسط کارگر بود؟
- آیا checkpoint evidence نشان داد که رویه دنبال شده؟

## skill حداقل viable برای Swarm v1

برای یک کارگر مفید:

```text
swarm-worker-core
```

برای یک ارکستریتور مفید:

```text
swarm-orchestrator
swarm-worker-core
swarm-review-learning-loop
```

برای یک reviewer مفید:

```text
swarm-worker-core
byte-verified-code-review
swarm-review-learning-loop
```

هر چیز دیگری تخصص‌گرایی است.
