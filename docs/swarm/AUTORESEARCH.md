<div dir="rtl">

# حالت Autoresearch

Autoresearch یک harness bounded optimization برای Hermes Agentهاست. workflow پیش‌فرض research نیست.

فقط وقتی از آن استفاده کنید که سیستم بتواند به‌صورت مکانیکی تصمیم بگیرد آیا یک iteration بهبود یافته یا نه.

```text
normal research     = gather evidence -> synthesize -> recommend
autoresearch mode   = mutate one target -> verify metric -> keep/revert -> repeat
```

## الگوی منبع

الگوی مفید از autoresearch سبک Karpathy و portهای downstream Claude/Codex پایدار است:

۱. قفل کردن scope.
۲. قفل کردن سطح ارزیابی.
۳. انتخاب یک scalar metric.
۴. mutate کردن یک target باریک.
۵. اجرای یک verifier مکانیکی.
۶. نگه‌داشتن بهبودها.
۷. revert کردن تغییرات بدتر/crash/guard-fail.
۸. ثبت هر iteration.
۹. توقف در budget پیکربندی‌شده.

اگر نمی‌توانید آن را به‌صورت مکانیکی ارزیابی کنید، آن را autoresearch نکنید.

## زمان استفاده از `researcher:quick`

از حالت researcher معمولی برای موارد زیر استفاده کنید:

- جمع‌آوری web/GitHub/X/Reddit/Medium/YouTube/source
- scan market/model/library
- بازبینی literature
- synthesis کیفی
- یادداشت‌های tradeoff
- توصیه‌هایی که قضاوت اهمیت دارد

`researcher:quick` ممکن است یک config autoresearch تولید کند، ولی نباید حلقه را شروع کند مگر اینکه قرارداد زیر پر شده باشد.

## قرارداد ورود autoresearch

یک حلقه فقط زمانی می‌تواند شروع شود که این فیلدها صریح باشند:

```yaml
goal: <one sentence outcome>
scope: <files/directories/knobs the loop may edit>
mutable_target: <specific file, skill, prompt, or narrow directory>
locked_eval: <files/datasets/scoring scripts the loop may not edit>
metric: <scalar number and unit>
direction: higher|lower
verify: <command that emits or lets us parse the metric>
guard: <command(s) that must keep passing>
iterations: <bounded count; default pilot is 3-5>
time_budget: <optional wall-clock cap>
results_log: autoresearch-results/results.tsv
rollback: revert worse, crashing, unparsable, or guard-failing changes
greenlight: required for destructive, public, credential, account, push, deploy, merge, or bulk edits
```

فیلدهای گمشده را به‌صورت خاموش infer نکنید. اگر یک فیلد ناشناخته است، اول `autoresearch:plan` / حالت planning را اجرا کنید.

## discipline iteration

هر iteration باید این شکل را دنبال کند:

```text
1. Read current state, prior results log, and recent git history.
2. Pick one small, falsifiable change.
3. Edit only allowed mutable targets.
4. Commit or checkpoint the candidate.
5. Run verify and guard commands.
6. Parse metric.
7. If improved and guards pass: keep.
8. If worse, equal-with-more-complexity, crashed, or guards fail: revert.
9. Append results_log.
10. Continue until iteration/time budget is exhausted.
```

از سادگی به‌عنوان tie-breaker استفاده کنید: metric مساوی با کد/پیچیدگی کمتر می‌تواند نگه‌داشته شود؛ metric مساوی با پیچیدگی بیشتر باید revert شود.

## شکل log مورد نیاز

از TSV یا JSONL استفاده کنید. پیش‌فرض TSV:

```tsv
iteration       commit  metric  delta   status  summary verify  guard
0       baseline        42      0       baseline        initial metric  pass    pass
1       abc123  39      -3      keep    reduced failing lint count in parser    pass    pass
2       -       45      +6      revert  broadened change broke type guard       pass    fail
```

failureها را قابل‌مشاهده نگه دارید. revert کردن یک آزمایش fail‌شده بخشی از evidence trail است، نه مشکلی برای پنهان‌کردن.

## مالکیت role

- `orchestrator`: ورود به autoresearch را تأیید می‌کند، scope/eval/metric/budget را قفل می‌کند و تصمیم می‌گیرد آیا حلقه می‌تواند در حالت durable/background اجرا شود.
- `researcher:quick`: evidence خارجی/داخلی را جمع‌آوری می‌کند و ممکن است قرارداد را draft کند.
- `researcher:autoresearch`: پس از تکمیل قرارداد حلقه را اجرا می‌کند.
- `reviewer`: تغییرات نگه‌داشته‌شده را برای metric hacking، overfitting، regression امنیتی و گسترش پنهان scope بررسی می‌کند.
- `qa`: تأیید نهایی و هر smoke مرورگر/API را replay می‌کند.
- `km-agent`: درس‌ها/نتایج پایدار را پس از بازبینی در RAZSOC/GBrain ارتقا می‌دهد.

## targetهای خوب برای این stack

### ۱. بهینه‌سازی Hermes skill

بهبود یک skill در برابر پرامپت‌های ثابت و checkهای rubric باینری.

```yaml
goal: Improve reviewer-core bug catching without increasing false positives.
scope:
  - /home/aleks/.hermes/skills/**/reviewer-core/SKILL.md
mutable_target: reviewer-core/SKILL.md
locked_eval:
  - evals/reviewer-core/cases/*.md
  - evals/reviewer-core/rubric.json
metric: rubric score out of 100
direction: higher
verify: python evals/reviewer-core/run_eval.py --json
guard: hermes chat -Q -t reviewer:gate -q 'load reviewer-core and summarize readiness' | grep -q reviewer
iterations: 3
```

### ۲. بهینه‌سازی پرامپت profile

تنظیم یک profile در برابر briefهای ثابت.

```yaml
goal: Make researcher choose GBrain-first lookup reliably before web search.
scope:
  - /home/aleks/.hermes/profiles/researcher/SOUL.md
  - /home/aleks/.hermes/profiles/researcher/skills/researcher-quick/SKILL.md
mutable_target: researcher profile guidance
locked_eval:
  - evals/researcher-routing/cases.jsonl
metric: pass rate across routing cases
direction: higher
verify: python evals/researcher-routing/run_eval.py
guard: hermes chat -Q -t researcher:quick -q 'respond with mode readiness only'
iterations: 3
```

### ۳. مسیریابی بازیابی GBrain

بهینه‌سازی rule/پرامپت‌های route در برابر fixtureهای known-answer. corpus و answer key قفل‌شده‌اند.

```yaml
goal: Improve citation-correct answers for RAZSOC/GBrain architecture questions.
scope:
  - skills/note-taking/gbrain/SKILL.md
  - profiles/km-agent/SOUL.md
mutable_target: retrieval/routing guidance only
locked_eval:
  - evals/gbrain-routing/questions.jsonl
  - evals/gbrain-routing/answers.jsonl
metric: exact-or-cited-correct score
direction: higher
verify: python evals/gbrain-routing/run_eval.py --max-cases 12
guard: gbrain stats >/dev/null
iterations: 3
```

### ۴. حلقهٔ پاک‌سازی repo

کاهش یک class failure با guardهای متمرکز.

```yaml
goal: Reduce no-explicit-any count in changed TypeScript files.
scope:
  - src/**/*.ts
  - src/**/*.tsx
mutable_target: one module or route family per iteration
locked_eval:
  - package.json
  - eslint config
metric: eslint no-explicit-any violation count
direction: lower
verify: pnpm exec eslint src --format json | python scripts/count-eslint-rule.py @typescript-eslint/no-explicit-any
guard: pnpm exec vitest run <focused-tests>
iterations: 5
```

### ۵. بهبود harness مرورگر/QA

فقط از checkهای deterministic استفاده کنید.

```yaml
goal: Increase deterministic /swarm smoke coverage.
scope:
  - tests/browser/swarm-smoke.*
  - src/routes/**/swarm*
mutable_target: smoke test file first; product code only with explicit approval
locked_eval:
  - expected role list
  - API response assertions
metric: passing smoke assertions count
direction: higher
verify: pnpm exec playwright test tests/browser/swarm-smoke.spec.ts --reporter=json
guard: pnpm exec vitest run src/server/swarm-health.test.ts
iterations: 3
```

## targetهای بد / red flagها

autoresearch را اجرا نکنید وقتی:

- حلقه می‌تواند eval، dataset، scorer یا answer key را ویرایش کند
- metric یک proxy است که به‌راحتی قابل بازی است
- بهبود مطلوب عمدتاً taste یا strategy است
- کار با secretها، تنظیمات account، پست عمومی، deploy، merge یا پاک‌سازی مخرب سر و کار دارد
- scope آن‌قدر وسیع است که vault/repo را بازنویسی کند
- command تأیید کندن، flaky یا دستی قضاوت می‌شود
- عامل نمی‌تواند metric را به‌صورت deterministic parse کند

نمونه‌های رایج reward-hacking:

- حذف testهای سخت برای بهبود pass rate
- تغییر rubric/answer key به‌جای رفتار
- cache کردن خروجی fixture به‌جای حل task
- سرکوب error به‌جای رفع cause
- تنگ‌کردن search به نمونه‌های شناخته‌شده فقط
- افزودن sleep/retry شکننده برای پنهان‌کردن flake

## pilot قبل از background

wedge پیش‌فرض:

۱. `researcher:quick` را برای draft قرارداد اجرا کنید.
۲. `reviewer` را روی قرارداد برای ریسک metric-hacking اجرا کنید.
۳. `researcher:autoresearch` را برای ۳ iteration فقط foreground/durable-session اجرا کنید.
۴. `reviewer` را روی diffهای نگه‌داشته‌شده اجرا کنید.
۵. `qa` یا تأیید متمرکز را اجرا کنید.
۶. اجازه دهید `km-agent` فقط درس‌های پایدار را ضبط کند.

فقط پس از یک pilot تمیز باید یک ارکستریتور حلقهٔ طولانی‌تر یا background را تأیید کند.

## گزارش خروج

هر اجرا باید با موارد زیر تمام شود:

```text
Goal:
Scope:
Metric baseline -> final:
Iterations attempted:
Kept changes:
Reverted changes:
Verification:
Guard result:
Reward-hacking review:
Remaining risks:
Next recommended loop or stop condition:
```

</div>
