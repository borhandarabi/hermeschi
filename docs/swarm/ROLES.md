# Presetهای نقش Swarm

dialog افزودن Swarm با presetهای نقش عرضه می‌شود تا Hermes Agentهای جدید با یک قرارداد عملیاتی واقعی شروع کنند به‌جای یک textarea خالی و خوش‌بینی. نزدیک‌ترین preset را انتخاب کنید، mission را تنظیم کنید، سپس کارگر را شروع کنید.

هر role دارای:

- specialty
- default skills
- default model
- زمان استفاده از آن
- ارجاع spec canonical

specهای canonical پروژه در دایرکتوری swarm specs قرار دارند:

```text
/swarm-specs/projects/<worker>.md
```

از آن specها به‌عنوان منبع حقیقت برای standing missionها استفاده کنید. preset نقش شکل fast-start است؛ spec پروژه قرارداد پایدار است.

## خلاصهٔ presetها

| Preset | مدل پیش‌فرض | زمان استفاده |
| --- | --- | --- |
| Orchestrator | GPT-5.4 | وقتی به dispatch، routing، drift detection و escalation نیاز دارید. |
| Builder | GPT-5.5 | وقتی به کد محصول ship‌شده با proof تست/build نیاز دارید. |
| Reviewer | GPT-5.4 | وقتی به بازبینی byte-verified و merge readiness نیاز دارید. |
| Triage | GPT-5.5 | وقتی به score/reproduce/patch یا آماده‌سازی issue/PR نیاز دارید. |
| Lab | GPT-5.4 | وقتی به آزمایش‌های ایزوله یا benchmarking مدل محلی نیاز دارید. |
| Sage | GPT-5.5 | وقتی به research، synthesis، script یا launch copy نیاز دارید. |
| Scribe | GPT-5.5 | وقتی به docs، spec، handoff، skills hygiene، memory curation نیاز دارید. |
| Foundation | GPT-5.4 | وقتی به کار runtime، repair، infra، health یا lifecycle نیاز دارید. |
| QA | GPT-5.4 | وقتی به regression، smoke، تأیید expected-vs-actual نیاز دارید. |
| Mirror Integrations | GPT-5.4 | وقتی به upstream sync، integrations یا asset pack نیاز دارید. |
| Custom | انتخاب کاربر | وقتی در حال ساخت lane هستید که با preset موجود نمی‌سازد. |

## Orchestrator

Specialty: state صفحهٔ کنترل، dispatch، drift detection، escalation.

Default skills:

- `swarm-orchestrator`
- `swarm-worker-core`
- `swarm-review-learning-loop`
- `self-improvement`

مدل پیش‌فرض: GPT-5.4

زمان استفاده:

- routing missionهای multi-worker
- ترجمهٔ intent به SwarmBriefها
- تفسیر checkpointها
- تشخیص drift
- re-prompt کردن کارگرها
- escalate کردن blockerها
- مدیریت standing missionها

Spec canonical:

```text
/swarm-specs/projects/orchestrator.md
```

checkpoint خوب:

```text
STATE: HANDOFF
RESULT: Routed docs release to swarm7 and review gate to swarm6 after docs checkpoint.
NEXT_ACTION: Wait for swarm7 NEEDS_REVIEW checkpoint, then dispatch swarm6 byte-verified review.
```

## Builder

Specialty: پیاده‌سازی full-stack، حلقه‌های ship سریع.

Default skills:

- `swarm-worker-core`
- `byte-verified-code-review`

مدل پیش‌فرض: GPT-5.5

زمان استفاده:

- UI محصول
- backend endpointها
- integrations
- bug fixها
- feature sliceها
- refactorهای متمرکز

نمونه‌های spec canonical:

```text
/swarm-specs/projects/swarm5.md
/swarm-specs/projects/swarm10.md
```

Builder باید diffهای باریک ship کند، نه اینکه کلیسا را به‌خاطر یک دکمهٔ تنها به‌نظررسیده بازسازی کند.

## Reviewer

Specialty: بازبینی کد byte-verified، naming، تست، build gate.

Default skills:

- `swarm-worker-core`
- `byte-verified-code-review`
- `swarm-review-learning-loop`

مدل پیش‌فرض: GPT-5.4

زمان استفاده:

- آمادگی PR
- gateهای release branch
- sanity checkهای generated-file
- تغییرات naming شکننده
- بازبینی regression
- تأیید build/test

Spec canonical:

```text
/swarm-specs/projects/swarm6.md
```

verdictهای Reviewer باید یکی از موارد زیر باشد:

- APPROVED
- CHANGES_REQUESTED
- BLOCKED

## Triage

Specialty: processor خودمختار PR/issues.

Default skills:

- `swarm-worker-core`
- `byte-verified-code-review`
- `swarm-review-learning-loop`

مدل پیش‌فرض: GPT-5.5

زمان استفاده:

- scan backlog issue
- triage feedback PR
- یادداشت‌های بازتولید
- failing testهای مینیمال
- branchهای fix کوچک
- رتبه‌بندی issue

نمونه‌های spec canonical:

```text
/swarm-specs/projects/swarm12.md
/swarm-specs/projects/swarm1.md
```

Triage هرگز نباید به‌صورت خاموش merge یا close کند. کار را آماده می‌کند و درخواست gate می‌کند.

## Lab

Specialty: R&D مدل محلی، spec-dec، benchmarking.

Default skills:

- `swarm-worker-core`
- `pc1-ollama-gguf-bench`
- `swarm-bench-worker`

مدل پیش‌فرض: GPT-5.4

زمان استفاده:

- تست مدل محلی
- مقایسه‌های throughput
- بهبودهای speculative runtime
- prototypeهای ایزوله
- logهای آزمایش

Spec canonical:

```text
/swarm-specs/projects/swarm9.md
```

به Lab اجازه داده می‌شود عجیب باشد زیرا ایزوله است. product laneها عجیب نیستند.

## Sage

Specialty: research، script، محتوای X، creative brief.

Default skills:

- `swarm-worker-core`
- `last30days`
- `pdf-and-paper-deep-reading`

مدل پیش‌فرض: GPT-5.5

زمان استفاده:

- research فنی
- scan market/model
- زاویه‌های launch
- thread draft
- creative brief
- citationها

Spec canonical:

```text
/swarm-specs/projects/swarm4.md
```

Sage draft می‌کند؛ انسان‌ها پست عمومی را تأیید می‌کنند. از research معمولی برای جمع‌آوری evidence و synthesis استفاده کنید. از autoresearch فقط برای حلقه‌های bounded optimization با قرارداد صریح Goal/Scope/Metric/Verify/Guard/Iterations استفاده کنید؛ به [AUTORESEARCH.md](./AUTORESEARCH.md) مراجعه کنید.

## Scribe

Specialty: docs، skills hygiene، memory curation.

Default skills:

- `swarm-worker-core`
- `last30days`
- `creative-writing`

مدل پیش‌فرض: GPT-5.5

زمان استفاده:

- به‌روزرسانی README
- درخت docs
- release note
- handoffها
- specها
- runbookها
- مستندسازی skill
- گزارش‌های memory hygiene

Spec canonical:

```text
/swarm-specs/projects/swarm7.md
```

Scribe سیستم را legible می‌کند. این کم‌جلوه‌تر از build کردن سیستم است و معمولاً بیشتر مسئول است که آیا کسی می‌تواند از آن استفاده کند یا نه.

## Foundation

Specialty: infra، repair playbook، wiring autopilot.

Default skills:

- `swarm-worker-core`

مدل پیش‌فرض: GPT-5.4

زمان استفاده:

- APIهای runtime
- health checkها
- lifecycle tmux
- تشخیص profile
- به‌روزرسانی repair playbook
- wiring حلقهٔ ارکستریتور
- قراردادهای backend

نمونه‌های spec canonical:

```text
/swarm-specs/projects/swarm8.md
/swarm-specs/projects/swarm2.md
```

Foundation مانع می‌شود کف به سوپ تبدیل شود.

## QA

Specialty: QA regression، تأیید render، checkهای expected-vs-actual.

Default skills:

- `swarm-worker-core`
- `byte-verified-code-review`

مدل پیش‌فرض: GPT-5.4

زمان استفاده:

- smoke test
- checkهای regression
- passهای UI expected-vs-actual
- تأیید artifact
- اطمینان post-build
- sanity release

Spec canonical:

```text
/swarm-specs/projects/swarm11.md
```

QA باید دقیقاً بگوید چه چیزی بررسی شد، دقیقاً چه چیزی fail شد، و دقیقاً چگونه بازتولید شود.

## Mirror Integrations

Specialty: asset pack، upstream sync، integrations.

Default skills:

- `swarm-worker-core`
- `claude-promo`
- `songwriting-and-ai-music`

مدل پیش‌فرض: GPT-5.4

زمان استفاده:

- watch upstream diff
- بسته‌بندی integration
- جمع‌آوری asset
- تولید creative asset
- پشتیبانی cross-lane

Spec canonical:

```text
/swarm-specs/projects/swarm10.md
```

Mirror Integrations lane چیزهای مفید قابل‌حمل است، نه حواس‌پرتی‌های درخشان تصادفی. حواس‌پرتی‌های درخشان تصادفی وجود خواهند داشت. آن‌ها sneaky هستند.

## Custom

Specialty: تعریف‌شده توسط کاربر.

Default skills: هیچ‌کدام.

مدل پیش‌فرض: انتخاب کاربر.

زمان استفاده:

- کارگر در یک role موجود نمی‌گنجد
- در حال تست یک lane جدید هستید
- به تخصص موقت نیاز دارید
- یک preset آینده در حال prototype است

Spec canonical:

```text
/swarm-specs/projects/<new-worker>.md
```

کارگرهای Custom همچنان باید داشته باشند:

- `swarm-worker-core`
- یک توصیف role
- یک specialty
- یک mission
- یک قرارداد checkpoint
- یک مرز تأیید واضح

کارگرهای Custom خالی به autocomplete گران‌قیمت تبدیل می‌شوند. اول structure اضافه کنید.

## انتخاب role درست

از این قاعدهٔ routing استفاده کنید:

| اگر کار عمدتاً... | ارسال به... |
| --- | --- |
| تصمیم درباره اینکه چه کسی چه کاری انجام دهد | Orchestrator |
| تغییر کد محصول | Builder |
| اثبات امن بودن یک branch | Reviewer |
| جویدن issue/PRها | Triage |
| آزمایش به‌دور از release | Lab |
| research یا draft کردن narrative | Sage |
| توضیح، مستندسازی، حفظ context | Scribe |
| infrastructure runtime/health/repair | Foundation |
| بررسی رفتار و regressionها | QA |
| upstream/integration/assets | Mirror Integrations |
| هیچ‌کدام از موارد بالا | Custom |

## افزودن preset نقش جدید

1. نقش را در فهرست preset UI تعریف کنید.
2. یک specialty یک‌خطی به آن بدهید.
3. یک standing mission به آن بدهید.
4. default skillها را انتخاب کنید.
5. default model را انتخاب کنید.
6. یک spec canonical پروژه بسازید.
7. آن را به این سند اضافه کنید.
8. یک task کوچک smoke dispatch کنید و یک checkpoint را تأیید کنید.

اگر مرحلهٔ ۶ زیاد کار به‌نظر می‌رسد، نقش احتمالاً هنوز واقعی نیست.
