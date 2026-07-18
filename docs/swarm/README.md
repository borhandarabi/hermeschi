<div dir="rtl">

# حالت Swarm

حالت Swarm، صفحهٔ کنترل هرمزچی برای Hermes Agentهاست: کارگرهای پایدار، یک ارکستریتور دائمی، یک دروازهٔ بازبینی، و آن‌قدر دیدگاه زمان اجرا که سیستم قابل فهم باشد، نه عرفانی.

قول نسخه ساده است:

- تعداد نامحدودی Hermes Agent می‌توانند وجود داشته باشند.
- یک ارکستریتور intent را به dispatch ترجمه می‌کند.
- هیچ انسانی مجبور نیست هر task را به‌صورت دستی route کند.
- هر کارگر یک role، یک profile، یک mission و یک قرارداد checkpoint دارد.
- هر اقدام پرخطر همچنان از دروازهٔ Greenlight عبور می‌کند.

این یک chat wrapper با تب نیست. این صفحهٔ عملیاتی برای یک swarm از عامل‌های محلی است.

## از اینجا شروع کنید

- [QUICKSTART.md](./QUICKSTART.md) — کلون، اجرا، شناسایی profileها، spawn کردن کارگرها، dispatch اولین task.
- [ARCHITECTURE.md](./ARCHITECTURE.md) — حلقه، ساختار SwarmBrief، مسیریابی اعلان‌ها، laneها، بازبینی، repair.
- [AUTORESEARCH.md](./AUTORESEARCH.md) — قرارداد bounded optimization-loop برای `researcher:autoresearch`.
- [SKILLS.md](./SKILLS.md) — skillهای swarm بسته‌بندی‌شده، بارگذاری خودکار، و قراردادهای skill سفارشی.
- [ROLES.md](./ROLES.md) — presetهای نقش که در دیالوگ افزودن Swarm و specهای canonical پروژه استفاده می‌شوند.

## مدل ۳۰ ثانیه‌ای

اریک با Aurora صحبت می‌کند. Aurora intent را به یک brief تبدیل می‌کند. ارکستریتور آن brief را به Hermes Agent درست route می‌کند. کارگرها در نشست‌های tmux پایدار اجرا می‌شوند، با proof checkpoint می‌گیرند، و ارکستریتور تصمیم می‌گیرد که ادامه دهد، repair کند، escalate کند یا یک کارت در Inbox قرار دهد.

```text
Eric -> Aurora -> orchestrator -> role workers -> checkpoints -> reports/inbox -> review/escalation
```

نکتهٔ کلیدی این است که dispatch به یک سیستم تبدیل می‌شود، نه یک حس و حدس. کارگر فقط «یک فراخوانی مدل دیگر» نیست. یک lane نام‌گذاری‌شده با حافظه، state زمان اجرا، skillهای پیش‌فرض، یک profile و یک job است.

## آنچه در v1 عرضه می‌شود

### Orchestrator Chat

ارکستریتور chat، سطح فرمان اصلی است. از آن برای درخواست یک اقدام، یک plan تجزیه‌شده، یا یک broadcast استفاده کنید. می‌تواند به کارگرهای خاص route کند، mission بسازد، منتظر checkpoint بماند و follow-up prompt بفرستد وقتی یک کارگر drift می‌کند.

### صفحهٔ کنترل چندعاملی

سطح Swarm کارگرها را به‌صورت کارت‌های عملیاتی نشان می‌دهد: role، state، task فعلی، مدل، سیگنال اخیر، membership اتاق و affordanceهای اقدام. می‌توانید topology را بررسی کنید به‌جای اینکه حدس بزنید کدام عامل زنده است.

### Kanban TaskBoard

TaskBoard یک سطح برنامه‌ریزی به swarm می‌دهد: backlog، ready، running، review، blocked، done. عمداً ساده نگه‌داشته شده است. state سادهٔ task بهتر از یک گورستان زیبای chatهای نیمه‌تمام است.

### Reports + Inbox

Reports و Inbox جایی هستند که swarm قابل بازبینی می‌شود. checkpointهای با `NEEDS_REVIEW`، blockerها، handoffها و خلاصه‌های قابل escalation در اینجا قرار می‌گیرند تا اریک بتواند موارد معدودی که نیاز به قضاوت دارند را تأیید کند.

### نمای TUI داخلی

نمای زمان اجرا به کارگرهای tmux-backed متصل می‌شود وقتی در دسترس باشند. اگر tmux در دسترس نباشد، فضای کار به shell یا log tail برمی‌گردد. هدف observability مستقیم است: اگر یک Hermes Agent کاری انجام می‌دهد، می‌توانید lane را ببینید.

## اصطلاحات اصلی

| اصطلاح | معنی |
| --- | --- |
| Hermes Agent | یک کارگر پایدار و نام‌گذاری‌شده با role، profile، skillها و state زمان اجرا. |
| Orchestrator | Hermes Agent مسئول dispatch، drift detection، routing و escalation. |
| SwarmBrief | شکل canonical task که از ارکستریتور به کارگر ارسال می‌شود. |
| Standing mission | یک مسئولیت دائمی که کارگر در زمان idle از سر می‌گیرد. |
| Ad-hoc dispatch | یک task یک‌بارمصرف که از همان قرارداد checkpoint عبور می‌کند. |
| Checkpoint | بلوک وضعیتی همراه با proof که کارگر برمی‌گرداند. |
| Greenlight Gate | مرز تأیید انسانی برای اقدامات غیرقابل‌بازگشت یا خارجاً قابل‌مشاهده. |
| Repair playbook | failureهای شناخته‌شده که به repairهای امن قبل از escalation نگاشت شده‌اند. |

## مدل ذهنی برای کاربران

فضای کار سه سطح کنترل به شما می‌دهد:

۱. از ارکستریتور یک outcome درخواست کنید.
۲. mission را از صفحهٔ کنترل بررسی و هدایت کنید.
۳. فقط زمانی که به evidence دقیق نیاز دارید، وارد runtime کارگر شوید.

نباید مجبور باشید هر مرحله را babysit کنید. باید بتوانید یک pass روی release doc درخواست کنید، ببینید docs worker آن را می‌گیرد، تماشا کنید که checkpoint می‌رسد، reviewer lane را بعد بفرستید، و PR را فقط وقتی تأیید کنید که بازبینی می‌گوید واقعی است.

## آنچه حالت Swarm در آن خوب است

- release trainها با مراحل docs، build، review، QA و PR.
- triage خودکار issueها با laneهای bounded repair.
- حلقه‌های research + build که در آن یک کارگر scout می‌کند و دیگری ship می‌کند.
- آزمایش‌های lab طولانی‌مدت که نباید product lane را آلوده کنند.
- handoffهایی که حفظ context مهم‌تر از هوش خام مدل است.

## آنچه حالت Swarm عمداً انجام نمی‌دهد

- تأیید انسانی برای اقدامات خارجی غیرقابل‌بازگشت را حذف نمی‌کند.
- کارگرها را مستقیماً با اریک صحبت نمی‌کند.
- نیازی ندارد هر کارگر برای همیشه روی یک ماشین اجرا شود.
- وانمود نمی‌کند که chat history یک سیستم مدیریت پروژه است.
- specهای بد را حل نمی‌کند. specهای بد را سریع‌تر قابل‌مشاهده می‌کند. کمتر رمانتیک است، ولی مفیدتر.

## اسناد مسیر release

اگر در حال تست نسخه v1 هستید، این‌ها را به‌ترتیب بخوانید:

۱. [QUICKSTART.md](./QUICKSTART.md)
۲. [ARCHITECTURE.md](./ARCHITECTURE.md)
۳. [AUTORESEARCH.md](./AUTORESEARCH.md)
۴. [ROLES.md](./ROLES.md)
۵. [SKILLS.md](./SKILLS.md)

## spec canonical

قرارداد canonical runtime، فایل `SWARM_SPEC.md` در دایرکتوری swarm specs است. این مجموعه docs سطح عمومی را توضیح می‌دهد؛ spec پیروز می‌شود وقتی جزئیات پیاده‌سازی تعارض دارند.

</div>
