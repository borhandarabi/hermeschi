# حالت Swarm

حالت Swarm صفحهٔ کنترلی هرمزچی برای Hermes Agentهاست: کارگرهای پایدار، یک ارکستریتور دائمی، یک دروازهٔ بازبینی، و آن‌قدر دیدگاه زمان‌اجرایی که سیستم قابل فهم باشد، نه عرفانی.

قول نسخه ساده است:

- تعداد نامحدودی Hermes Agent می‌توانند وجود داشته باشند.
- یک ارکستریتور intent را به dispatch ترجمه می‌کند.
- هیچ انسانی مجبور نیست هر task را به‌صورت دستی route کند.
- هر کارگر یک role، یک profile، یک mission و یک قرارداد checkpoint دارد.
- هر اقدام پرخطر همچنان از دروازهٔ Greenlight عبور می‌کند.

این یک chat wrapper با تب نیست. این صفحهٔ عملیاتی برای یک swarm از agentهای محلی است.

## از اینجا شروع کنید

- [QUICKSTART.md](./QUICKSTART.md) — کلون، اجرا، شناسایی profileها، spawn کردن کارگرها، dispatch اولین task.
- [ARCHITECTURE.md](./ARCHITECTURE.md) — حلقه، ساختار SwarmBrief، مسیریابی اعلان‌ها، laneها، بازبینی، repair.
- [AUTORESEARCH.md](./AUTORESEARCH.md) — قرارداد bounded optimization-loop برای `researcher:autoresearch`.
- [SKILLS.md](./SKILLS.md) — skillهای swarm بسته‌بندی‌شده، بارگذاری خودکار، و قراردادهای skill سفارشی.
- [ROLES.md](./ROLES.md) — presetهای نقش که در dialog افزودن Swarm و specهای canonical پروژه استفاده می‌شوند.

## مدل ۳۰ ثانیه‌ای

اریک با Aurora صحبت می‌کند. Aurora intent را به یک brief تبدیل می‌کند. ارکستریتور آن brief را به Hermes Agent درست route می‌کند. کارگرها در sessionهای tmux پایدار اجرا می‌شوند، با proof checkpoint می‌گیرند، و ارکستریتور تصمیم می‌گیرد که ادامه دهد، repair کند، escalate کند یا یک کارت در Inbox قرار دهد.

```text
Eric -> Aurora -> orchestrator -> role workers -> checkpoints -> reports/inbox -> review/escalation
```

حرکت مهم این است که dispatch به یک سیستم تبدیل می‌شود، نه یک vibe. کارگر فقط «یک فراخوانی مدل دیگر» نیست. یک lane نام‌گذاری‌شده با حافظه، state زمان‌اجرایی، skillهای پیش‌فرض، یک profile و یک job است.

## آنچه در v1 عرضه می‌شود

### Orchestrator Chat

ارکستریتور chat سطح فرمان اصلی است. از آن برای درخواست یک اقدام، یک plan تجزیه‌شده، یا یک broadcast استفاده کنید. می‌تواند به کارگرهای خاص route کند، mission بسازد، منتظر checkpoint بماند و follow-up prompt بفرستد وقتی یک کارگر drift می‌کند.

### صفحهٔ کنترل چند‌Agentی

سطح Swarm کارگرها را به‌صورت کارت‌های عملیاتی نشان می‌دهد: role، state، task فعلی، مدل، سیگنال اخیر، membership اتاق و affordanceهای اقدام. می‌توانید topology را بررسی کنید به‌جای اینکه حدس بزنید کدام agent زنده است.

### Kanban TaskBoard

TaskBoard یک سطح برنامه‌ریزی به swarm می‌دهد: backlog، ready، running، review، blocked، done. عمداً خسته‌کننده است. state خسته‌کنندهٔ task بهتر از یک گورستان زیبای chatهای نیمه‌تمام است.

### Reports + Inbox

Reports و Inbox جایی هستند که swarm قابل بازبینی می‌شود. checkpointهای با `NEEDS_REVIEW`، blockerها، handoffها و خلاصه‌های قابل escalation در اینجا قرار می‌گیرند تا اریک بتواند موارد معدودی که نیاز به قضاوت دارند را تأیید کند.

### نمای TUI داخلی

نمای زمان‌اجرایی به کارگرهای tmux-backed متصل می‌شود وقتی در دسترس باشند. اگر tmux در دسترس نباشد، workspace به shell یا log tail برمی‌گردد. هدف observability مستقیم است: اگر یک Hermes Agent کاری انجام می‌دهد، می‌توانید lane را ببینید.

## اصطلاحات اصلی

| اصطلاح | معنی |
| --- | --- |
| Hermes Agent | یک کارگر پایدار و نام‌گذاری‌شده با role، profile، skillها و state زمان‌اجرایی. |
| Orchestrator | Hermes Agent مسئول dispatch، drift detection، routing و escalation. |
| SwarmBrief | شکل canonical task که از ارکستریتور به کارگر ارسال می‌شود. |
| Standing mission | یک مسئولیت دائمی که کارگر در زمان idle از سر می‌گیرد. |
| Ad-hoc dispatch | یک task یک‌بارمصرف که از همان قرارداد checkpoint عبور می‌کند. |
| Checkpoint | بلوک وضعیتی همراه با proof که کارگر برمی‌گرداند. |
| Greenlight Gate | مرز تأیید انسانی برای اقدامات غیرقابل‌بازگشت یا خارجاً قابل‌مشاهده. |
| Repair playbook | failureهای شناخته‌شده که به repairهای امن قبل از escalation نگاشت شده‌اند. |

## مدل ذهنی برای کاربران

workspace سه سطح کنترل به شما می‌دهد:

1. از ارکستریتور یک outcome درخواست کنید.
2. mission را از صفحهٔ کنترل بررسی و هدایت کنید.
3. فقط زمانی که به evidence دقیق نیاز دارید، وارد runtime کارگر شوید.

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
- specهای بد را حل نمی‌کند. specهای بد را سریع‌تر قابل‌مشاهده می‌کند. کمتر رمانتیک است، اما مفیدتر.

## اسناد مسیر release

اگر در حال تست نسخه v1 هستید، این‌ها را به ترتیب بخوانید:

1. [QUICKSTART.md](./QUICKSTART.md)
2. [ARCHITECTURE.md](./ARCHITECTURE.md)
3. [AUTORESEARCH.md](./AUTORESEARCH.md)
4. [ROLES.md](./ROLES.md)
5. [SKILLS.md](./SKILLS.md)

## spec canonical

قرارداد canonical runtime فایل `SWARM_SPEC.md` در دایرکتوری swarm specs است. این مجموعه docs سطح عمومی را توضیح می‌دهد؛ spec پیروز می‌شود وقتی جزئیات پیاده‌سازی تعارض دارند.
