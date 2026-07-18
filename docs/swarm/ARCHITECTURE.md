# معماری Swarm

حالت Swarm حول یک حلقهٔ پایدار ساخته شده است: intent از طریق Aurora وارد می‌شود، dispatch از ارکستریتور عبور می‌کند، کارگرها در نشست‌های پایدار اجرا می‌شوند، checkpointها به صفحهٔ کنترل برمی‌گردند، و فقط تصمیمات قابل قضاوت به اریک می‌رسند.

## حلقه

```text
┌────────┐
│ Eric   │
└───┬────┘
    │ intent, judgment, approval
    ▼
┌────────────┐
│ Aurora     │
│ main agent │
└───┬────────┘
    │ translates intent into SwarmBrief
    ▼
┌────────────────────────────┐
│ Orchestrator                │
│ routing, drift, escalation │
└───┬────────────────────────┘
    │ dispatches by role + standing mission
    ▼
┌────────────────────────────────────────────────────┐
│ Hermes Agents                                      │
│ swarm4 research  swarm5 build  swarm6 review        │
│ swarm7 docs      swarm8 ops    swarm9 lab           │
│ swarm10 patches  swarm11 QA    swarm12 triage       │
└───┬────────────────────────────────────────────────┘
    │ proof-bearing checkpoint
    ▼
┌────────────────────────────┐
│ Reports / Inbox / runtime  │
└───┬────────────────────────┘
    │ orchestrator decides next route
    ▼
┌─────────────────────────────────────┐
│ continue / repair / review / input  │
└─────────────────────────────────────┘
```

قاعدهٔ کلیدی: کارگرها به اریک پیام free-style نمی‌فرستند. آن‌ها checkpoint می‌گیرند. ارکستریتور route می‌کند. Aurora قضاوت را مدیریت می‌کند. اریک چیزهای معدودی که اهمیت دارند را تأیید می‌کند.

## جریان canonical

۱. اریک یک outcome بیان می‌کند.
۲. Aurora نام کار را تعیین کرده و آن را در یک SwarmBrief قالب‌بندی می‌کند.
۳. ارکستریتور کارگر درست را انتخاب می‌کند یا کار را تجزیه می‌کند.
۴. کارگر در profile پایدار خود و runtime tmux اجرا می‌کند.
۵. کارگر یک checkpoint canonical برمی‌گرداند.
۶. notification router به‌طور پیش‌فرض checkpoint را به ارکستریتور می‌فرستد.
۷. ارکستریتور تصمیم می‌گیرد ادامه دهد، repair کند، hand off دهد، review کند یا escalate کند.
۸. Reports و Inbox state را قابل بررسی می‌کنند.

## شکل SwarmBrief

YAML canonical در بخش ۳ `SWARM_SPEC.md` قرار دارد. این شکل عمومی است:

```yaml
brief_id: brief-<timestamp>-<slug>
worker: swarm<N>
project: <project-name>
goal: <one-sentence end state>
why_now: <trigger>
scope:
  - bounded item
deliverables:
  - exact artifact path
test_or_proof:
  - command, review, screenshot, artifact, or byte check
constraints:
  - hard limits
checkpoint_contract:
  state: DONE|HANDOFF|BLOCKED|NEEDS_REVIEW|NEEDS_INPUT
  files_changed: list
  commands_run: list
  proof: tests/build/smoke/review evidence
  next_action: exact handoff
  blockers: exact blocker
escalation:
  on_blocked: route
  on_done: route
budget:
  wall_clock_hours: 2
```

یک brief، یک prompt dump نیست. کوچک‌ترین قرارداد عملیاتی است که به کارگر اجازه می‌دهد بدون اختراع scope اجرا شود.

## قرارداد checkpoint

کارگرها این بلوک را برمی‌گردانند:

```text
STATE: DONE | BLOCKED | NEEDS_INPUT | HANDOFF | IN_PROGRESS | NEEDS_REVIEW
FILES_CHANGED: exact paths or none
COMMANDS_RUN: exact commands or none
RESULT: concrete result/proof
BLOCKER: blocker or none
NEXT_ACTION: exact recommended next action
```

checkpointهای خوب حاوی evidence هستند. checkpointهای بد حاوی صفت‌ها هستند. swarm برای evidence بهینه می‌شود.

## مسیریابی اعلان‌ها

notification router در `src/server/swarm-notifications.ts` قرار دارد.

رفتار فعلی:

- checkpointها به‌طور پیش‌فرض به کارگر ارکستریتور route می‌شوند.
- کارگر ارکستریتور پیش‌فرض `orchestrator` است.
- target tmux برابر `swarm-orchestrator` است.
- checkpointهای raw تکراری از طریق `runtime.json` سرکوب می‌شوند.
- `NEEDS_INPUT` به نشست اصلی escalate می‌شود.
- اگر نشست tmux ارکستریتور در دسترس نباشد، checkpoint به نشست اصلی escalate می‌شود.
- `DONE`، `HANDOFF` و `BLOCKED` اول به ارکستریتور می‌روند.
- نشست اصلی فقط وقتی input انسانی لازم باشد یا ارکستریتور در دسترس نباشد، escalation مستقیم دریافت می‌کند.

این تفکیک مهم است. بدون آن، chat اصلی به یک آتش‌زباله‌ای از trivia کارگر تبدیل می‌شود. اصطلاح فنی.

## standing missionها در مقابل ad-hoc dispatchها

### standing missionها

یک standing mission مسئولیت دائمی کارگر است. نمونه‌ها:

- Scribe نگهداری docs و handoffها.
- Reviewer مالک دروازهٔ بازبینی byte-verified است.
- Triage روی lane PR/issues کار می‌کند.
- Lab آزمایش‌های model/runtime را اجرا می‌کند.
- Foundation نگهداری health و infrastructure تعمیر.

standing missionها چیزهایی هستند که کارگرهای idle بدون منتظر ماندن برای اینکه اریک busywork اختراع کند، مفید می‌مانند.

### ad-hoc dispatchها

یک ad-hoc dispatch یک task bounded است. همچنان از همان profile، همان role، همان فرمت checkpoint و همان Greenlight Gate استفاده می‌کند.

نمونه‌ها:

- «docs/swarm/QUICKSTART.md را برای دیالوگ جدید Add Swarm به‌روزرسانی کن.»
- «PR #42 را بازبینی کن و APPROVED/CHANGES_REQUESTED با byte evidence برگردان.»
- «issue #17 را بازتولید کن و یک failing test مینیمال بنویس.»

سیستم باید ad-hoc dispatchها را به‌عنوان missionهایی با blast radius کوچک‌تر در نظر بگیرد، نه درخواست‌های chat غیررسمی.

## سه lane دائمی

### Lane A — lane راه‌اندازی / demo / build خلاقانه

هدف: ship کردن artifactهای راه‌اندازی هماهنگ، demo، media و assetهای روبه‌release.

مالک‌های معمول:

- Builder برای پیاده‌سازی
- Mirror Integrations برای assetها
- Sage برای narrative و research
- QA برای smoke checkها
- Scribe برای کپی README/showcase

### Lane B — issues + PR autopilot

هدف: حفظ حرکت GitHub issueها و PRهای باز.

مالک‌های معمول:

- Triage به‌عنوان processor اصلی
- Overflow به‌عنوان پشتیبان
- Reviewer برای gatekeeping
- QA برای regression proof

حلقهٔ اصلی:

```text
scan -> score -> reproduce -> patch -> test -> PR -> review -> human approval
```

### Lane C — Lab / آزمایش‌ها

هدف: اجرای آزمایش‌ها بدون بی‌ثبات‌کردن product lane.

مالک معمول:

- Lab

نمونه‌ها:

- اجرای benchmark مدل محلی
- مقایسه‌های runtime
- آزمایش‌های speculative performance
- حلقه‌های prototype

Lab خودمختاری می‌گیرد زیرا isolation ریسک را کاهش می‌دهد. product lane evidence می‌گیرد وقتی Lab چیزی واقعی پیدا می‌کند.

## Greenlight Gate

swarm می‌تواند اقدامات پرخطر را آماده کند. نمی‌تواند آن‌ها را به‌صورت خاموش انجام دهد.

قبل از موارد زیر به تأیید صریح انسانی نیاز است:

- `git push --force`
- merge یا close کردن PR
- close کردن issue بدون دستور صریح
- ایجاد release
- publish کردن npm/pnpm
- پست‌های عمومی X/Discord/blog
- تراکنش‌های مالی
- عملیات مخرب فایل
- restart سرویس‌های core

docs و فایل‌های محلی می‌توانند به‌طور تهاجمی draft شوند. اقدامات خارجاً قابل‌مشاهده gated می‌مانند.

## playbook auto-repair

playbook تعمیر، failure modeهای شناخته‌شده را به fixهای امن نگاشت می‌کند. ارکستریتور باید قبل از escalation به آن مراجعه کند.

نمونه‌ای از classهای تعمیر:

- tmux session گمشده
- runtime کارگر stale
- عدم تطابق مسیر profile
- failure build/test با command شناخته‌شده
- timeout checkpoint
- در دسترس نبودن auth/token
- branch drift

تعمیر bounded است. اگر یک fix مخرب، خارجاً قابل‌مشاهده یا speculative شود، escalate کنید.

## state زمان اجرا

هر کارگر یک رکورد runtime با فیلدهایی مثل زیر دارد:

- worker ID
- role
- state
- phase
- current task
- cwd
- last output time
- last check-in
- last summary/result
- next action
- blocked reason
- checkpoint status
- task counts
- cron counts

UI از این برای render کردن کارت‌ها، Reports، Inbox و targetهای attach runtime استفاده می‌کند.

## اندپوینت‌های صفحهٔ کنترل

اندپوینت‌های مهم:

| Endpoint | هدف |
| --- | --- |
| `GET /api/swarm-roster` | بازگرداندن Hermes Agentهای پیکربندی‌شده و متادیتای role. |
| `GET /api/swarm-runtime` | بازگرداندن state زمان اجرا و tmux attachability. |
| `GET /api/swarm-missions` | بازگرداندن تاریخچهٔ mission و assignment. |
| `POST /api/swarm-dispatch` | ارسال کار به یک یا چند Hermes Agent. |
| `POST /api/swarm-tmux-start` | شروع نشست کارگر tmux-backed. |
| `POST /api/swarm-tmux-stop` | توقف نشست tmux کارگر. |
| `POST /api/swarm-tmux-scroll` | scroll کردن یک نشست tmux از UI. |
| `GET /api/swarm-health` | خلاصه‌ای از health swarm محلی. |

## فلسفهٔ failure

سیستم باید به روش‌هایی fail شود که به actor بعدی دقیقاً بگوید چه کاری انجام دهد.

blocker خوب:

```text
BLOCKER: gh auth status failed with missing token; cannot create PR.
NEXT_ACTION: Provide a GitHub token or run gh auth login, then re-run PR creation.
```

blocker بد:

```text
BLOCKER: sandbox issue.
```

نه. مطلقاً نه. ماشین یا ابزار را دارد، یا token را، یا فایل را، یا process را، یا ندارد. قطعهٔ گمشدهٔ دقیق را نام ببرید.

## دروازهٔ بازبینی

lane بازبینی وجود دارد زیرا کار خودمختار بدون بازبینی فقط entropy در یک کت زیباست.

انتظارات Reviewer:

- diff را بخواند
- tests/build/smoke را اجرا کند
- در صورت لزوم تغییرات naming-sensitive را byte-check کند
- بررسی کند فایل‌های generated عمدی هستند
- یک verdict تولید کند
- هرگز بدون تأیید merge نکند

## چک‌لیست معماری release

قبل از اینکه یک release Swarm v1 را credible بنامید:

- ارکستریتور می‌تواند کارگرها را dispatch کند.
- کارگرها در نشست‌های tmux پایدار می‌مانند.
- کارگرها متادیتای role و profile دارند.
- نمای runtime می‌تواند attach یا fallback کند.
- Reports checkpointها را نشان می‌دهد.
- Inbox موارد review/input را نمایش می‌دهد.
- `NEEDS_INPUT` به نشست اصلی escalate می‌شود.
- Greenlight Gate مستند و رعایت شده است.
- docs توضیح می‌دهند چگونه بدون tribal knowledge آن را اجرا کنند.
