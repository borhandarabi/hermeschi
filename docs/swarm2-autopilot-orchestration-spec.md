<div dir="rtl">

# مشخصات هماهنگی خودران Swarm2

تاریخ: 2026-04-28
وضعیت: مشخصات پیاده‌سازی، rollout مرحله‌بندی‌شده
مخزن کانونیک: `/Users/aurora/hermeschi`

## هدف

Swarm2 باید مانند یک تیم خودران پایدار رفتار کند، نه یک UI چند-چت زیباتر.

یک کاربر باید بتواند به هماهنگ‌کننده بگوید:

> چهار عامل راه‌اندازی کنید: یکی PRها را مدیریت می‌کند، یکی تحقیق می‌کند، یکی فیچر می‌سازد، یکی بازبینی می‌کند. این ماموریت را اجرا کن.

سپس Swarm2 باید:

۱. فهرست swarm را ایجاد یا به‌روزرسانی کند،
۲. نقش‌ها، مهارت‌ها و ماموریت‌ها را تخصیص دهد،
۳. کار را به نشست‌های کارگر Hermes پایدار درست مسیریابی کند،
۴. هر کارگر را در پروفایل/نشست tmux خود اجرا کند،
۵. چک‌پوینت‌ها را وقتی کارگران زیروظایف را کامل می‌کنند جمع‌آوری کند،
۶. وقتی کار بیشتری باقی است به‌طور خودکار کارگران را برای ادامه پرامپت کند،
۷. خروجی‌ها را قبل از کامل اعلام گردش کار بازبینی کند،
۸. کل حلقه را در `/swarm2` بدون نیاز به babysitting دستی نمایش دهد.

## اصول محصول

- **عامل‌های پایدار، نه کمک‌کننده‌های مصرفی.** هر کارگر هویت، حافظهٔ پروفایل، وضعیت runtime و یک نشست زنده دارد.
- **فهرست منبع حقیقت است.** اکتشاف‌های عدد کارگر فقط fallback هستند. مسیریابی `swarm.yaml` را می‌خواند.
- **اثبات براحساس.** کارگران چک‌پوینت می‌کنند: فایل‌های تغییر یافته، دستورات اجرا شده، نتایج، مانع‌ها، اقدام بعدی.
- **هماهنگ‌کننده حلقه را هدایت می‌کند.** کارگران اجرا می‌کنند. هماهنگ‌کننده تجزیه، توالی، پایش، دوباره‌پرامپت، بازبینی و تشدید را انجام می‌دهد.
- **خودران مرحله‌بندی‌شده است.** سیستم باید در حالت‌های دستی، نیمه‌خودکار، سپس تمام‌خودکار کار کند.
- **بومی tmux/Claude.** نشست‌های کارگر پروفایل‌های Hermes در نشست‌های tmux `swarm-<workerId>` هستند.

## زیربنای فعلی

قبلاً موجود:

- `swarm.yaml`، پیکربندی فهرست کانونیک.
- `/api/swarm-roster`، خواندن/نوشتن ورودی‌های فهرست.
- `/api/swarm-decompose`، مسیریابی ماموریت به تخصیص‌ها.
- `/api/swarm-dispatch`، ارسال پرامپت به نشست‌های زنده tmux/Claude و fallback به Claude یک‌بار.
- `/api/swarm-runtime`، خواندن `runtime.json` کارگر، وضعیت tmux، وظایف، artifactها، پیش‌نمایش‌ها.
- `/api/swarm-chat`، خواندن تاریخچه چت کارگر از `state.db` پروفایل.
- `/api/swarm-tmux-start/stop/scroll`، کنترل نشست‌های پایدار.
- skillهای swarm:
  - `swarm-worker-core`
  - `swarm-orchestrator`
  - `swarm-dev-runtime`
  - `swarm-ui-worker`
  - `swarm-pr-worker`
  - `swarm-bench-worker`

## معماری هدف

```text
User mission
  ↓
Orchestrator
  ↓ reads/writes
swarm.yaml roster + runtime state
  ↓
Decomposer/router
  ↓ produces
Assignment plan
  ↓
Dispatcher
  ↓ per-worker prompt into tmux/Claude
Persistent worker sessions
  ↓ workers checkpoint
runtime.json + state.db + artifacts/previews
  ↓
Orchestrator loop
  ↓
continue / reroute / review / complete / escalate
```

## قرارداد فهرست

`swarm.yaml` قابل خواندن توسط انسان و قابل حمل باقی می‌ماند. هر ورودی کارگر باید پشتیبانی کند:

```yaml
workers:
  - id: swarm5
    name: Swarm5
    role: Builder
    specialty: full-stack implementation and UI/system integration
    model: GPT-5.5
    mission: Ship focused product slices in HermesChi with tests.
    skills: [swarm-ui-worker, swarm-worker-core]
    capabilities:
      - code-editing
      - ui-implementation
      - build-verification
    defaultCwd: /Users/aurora/hermeschi
    preferredTaskTypes: [implementation, refactor, ui]
    maxConcurrentTasks: 1
    acceptsBroadcast: true
    reviewRequired: true
```

### فیلدهای الزامی فعلی

- `id`
- `name`
- `role`
- `specialty`
- `model`
- `mission`
- `skills`

### فیلدهای بعدی برای افزودن

- `capabilities`
- `defaultCwd`
- `preferredTaskTypes`
- `maxConcurrentTasks`
- `acceptsBroadcast`
- `reviewRequired`

## قرارداد runtime

هر پروفایل کارگر ممکن است `~/.hermes/profiles/<workerId>/runtime.json` را نمایش دهد.

هماهنگ‌کننده و کارگر باید این فیلدها را به‌روز نگه دارند:

- `workerId`
- `role`
- `state`: `idle | executing | thinking | writing | waiting | blocked | syncing | reviewing | offline`
- `phase`
- `currentTask`
- `activeTool`
- `cwd`
- `lastCheckIn`
- `lastSummary`
- `lastResult`
- `nextAction`
- `blockedReason`
- `checkpointStatus`: `none | in_progress | done | blocked | handoff | needs_input`
- `needsHuman`
- `lastDispatchAt`
- `lastDispatchMode`
- `lastDispatchResult`
- `tasks[]`
- `artifacts[]`
- `previews[]`

## قرارداد تخصیص

`/api/swarm-decompose` باید تخصیص‌هایی به این شکل برگرداند:

```json
{
  "assignments": [
    {
      "workerId": "swarm4",
      "task": "Research the options and produce a concise recommendation with sources.",
      "rationale": "Research lane owns technical synthesis.",
      "expectedOutput": "Recommendation with tradeoffs and next action.",
      "dependsOn": [],
      "reviewRequired": false
    }
  ],
  "unassigned": []
}
```

مرحلهٔ ۱ فقط به `workerId`، `task`، `rationale` نیاز دارد.

## قرارداد dispatch

`/api/swarm-dispatch` باید یا شکل legacy broadcast را بپذیرد:

```json
{ "workerIds": ["swarm1"], "prompt": "..." }
```

یا شکل تخصیص:

```json
{
  "assignments": [
    { "workerId": "swarm4", "task": "...", "rationale": "..." },
    { "workerId": "swarm5", "task": "...", "rationale": "..." }
  ]
}
```

dispatch تخصیص باید به هر کارگر فقط وظیفهٔ خودش را، به‌همراه زمینهٔ فشردهٔ هماهنگی، ارسال کند.

## پاکت پرامپت کارگر

هر وظیفه dispatch شده باید با این‌ها بسته‌بندی شود:

۱. زمینهٔ هماهنگ‌کننده،
۲. هویت کارگر از `swarm.yaml`،
۳. نام‌های skill stack،
۴. وظیفه جاری،
۵. قرارداد چک‌پوینت/گزارش‌دهی،
۶. دستور ادامه.

مثال:

```text
## Swarm Orchestrator Dispatch
Worker: swarm5 — Builder
Mission: Ship focused product slices in HermesChi with tests.
Skills: swarm-ui-worker, swarm-worker-core

## Assigned Task
...

## Required Checkpoint Format
Reply/check in with:
STATE: DONE | BLOCKED | NEEDS_INPUT | HANDOFF | IN_PROGRESS
FILES_CHANGED: ...
COMMANDS_RUN: ...
RESULT: ...
BLOCKER: ...
NEXT_ACTION: ...

If this is one task in a larger workflow, stop after the checkpoint and wait for orchestrator continuation.
```

## حلقهٔ هماهنگ‌کننده

حلقهٔ هماهنگ‌کننده روی وضعیت runtime اجرا می‌شود:

۱. جمع‌آوری وضعیت‌های کارگر از `/api/swarm-runtime`،
۲. بررسی چت اخیر از `/api/swarm-chat`،
۳. علامت‌گذاری کارگران stale اگر `lastCheckIn` خیلی قدیمی است،
۴. تشخیص مانع‌ها،
۵. تشخیص چک‌پوینت‌های تکمیل،
۶. تخصیص وظیفهٔ بعدی اگر کار بیشتری باقی است،
۷. مسیریابی وظایف بازبینی به laneهای بازبین،
۸. تشدید فقط وقتی ورودی انسانی نیاز است.

### وضعیت‌های حلقه

- `planning`: تجزیه ماموریت در حال ساخت است.
- `dispatching`: تخصیص‌های اولیه در حال ارسال هستند.
- `executing`: کارگران فعال هستند.
- `checkpointing`: کارگران در حال بازگرداندن اثبات هستند.
- `reviewing`: بازبین/هماهنگ‌کننده خروجی‌ها را اعتبارسنجی می‌کند.
- `continuing`: وظایف بعدی ارسال می‌شوند.
- `blocked`: مداخلهٔ انسانی یا محیطی الزامی است.
- `complete`: تحویل نهایی آماده است.

## مراحل خودران

### مرحلهٔ ۱، در حال فرود

- مسیریاب از فرادادهٔ واقعی فهرست به‌جای نقش‌های hardcoded worker-number استفاده می‌کند.
- تجزیه‌کنندهٔ زمینهٔ کامل فهرست را دریافت می‌کند.
- dispatch تخصیص‌های per-worker را می‌پذیرد.
- dispatch چک‌پوینت اولیهٔ runtime را می‌نویسد.
- پرامپت‌های کارگر شامل قرارداد skill/checkpoint هستند.

### مرحلهٔ ۲

- افزودن `/api/swarm-checkpoint` برای نوشتن امن چک‌پوینت‌های ساختاریافتهٔ کارگر.
- parse پیام‌های چک‌پوینت کارگر از چت و به‌روزرسانی وضعیت runtime.
- افزودن IDهای تخصیص و IDهای ماموریت والد.

### مرحلهٔ ۳

- افزودن `/api/swarm-orchestrator-loop`.
- حلقهٔ runtime/chat را تماشا می‌کند و کارگران را auto-continue می‌کند.
- افزودن تشخیص stale/drift.
- افزودن مسیریابی lane بازبین.

### مرحلهٔ ۴

- افزودن تاریخچهٔ ماموریت کاربر-پسند.
- افزودن گردش‌کار/قالب‌های ذخیره‌شده.
- افزودن bootstrapping چندکاربره تا نصب‌های تازه بتوانند به‌طور یکپارچه عامل و نقش ایجاد کنند.

## تست smoke مرحلهٔ ۱

ماموریت:

> Test Swarm2 autopilot. Research one improvement, implement one tiny safe artifact, review the result.

مسیر مورد انتظار:

- کارگر تحقیق وظیفه research/checkpoint دریافت می‌کند.
- Builder وظیفه implementation/checkpoint دریافت می‌کند.
- بازبین وظیفه review/checkpoint دریافت می‌کند.

معیارهای قبولی:

- `/api/swarm-decompose` JSON تخصیص با استفاده از نقش‌های فهرست برمی‌گرداند.
- `/api/swarm-dispatch` برای کارگران زنده `delivery: tmux` برمی‌گرداند.
- `runtime.json` برای هر هدف `state: executing`، وظیفه جاری، `checkpointStatus: in_progress` را نشان می‌دهد.
- چت کارت کارگر در نهایت پیام dispatch شده را نشان می‌دهد.
- حداقل یک کارگر با وضعیت حامل اثبات پاسخ می‌دهد.

## سؤالات باز

- آیا عامل‌های فقط-فهرست جدید باید پروفایل‌ها و wrapperهای Hermes را خودکار ایجاد کنند، یا Add Swarm تا اولین شروع فقط پیکربندی بماند؟
- آیا حلقهٔ هماهنگ‌کننده باید در نشست مرورگر، interval سرور، cron job یا کارگر هماهنگ‌کنندهٔ Claude پایدار اجرا شود؟
- auto-continue قبل از پرسیدن از Eric چقدر تهاجمی باشد؟
- آیا بازبینی‌ها فقط برای وظایف تغییر-کد الزامی باشند، یا برای همهٔ گردش‌کارها؟

## ترتیب پیاده‌سازی بعدی توصیه‌شده

۱. patch مسیریابی/dispatch/checkpoint مرحلهٔ ۱.
۲. تست smoke از طریق API مستقیم و UI.
۳. افزودن `/api/swarm-checkpoint`.
۴. افزودن IDهای ماموریت و IDهای تخصیص.
۵. افزودن اندپوینت حلقهٔ هماهنگ‌کننده.
۶. افزودن bootstrapping برای swarmهای ایجادشده توسط کاربر.

</div>
