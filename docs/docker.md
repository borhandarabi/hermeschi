# Docker

اجرای HermesChi و Hermes Agent درون کانتینر.

## راه‌اندازی تک‌میزبانی (فقط روی localhost)

```bash
git clone https://github.com/outsourc-e/hermeschi
cd hermeschi
cp .env.example .env
# حداقل یک کلید ارائه‌دهنده اضافه کنید؛ مثلاً OPENROUTER_API_KEY=...
docker compose up -d
open http://localhost:3000
```

همین. فایل `docker-compose.yml` موجود در مخزن، این دو سرویس را اجرا می‌کند:

- `hermes-agent` (پورت `8642`، فقط داخلی)
- `hermeschi` (پورت `3000`، متصل به `127.0.0.1`)

فضای کار پیش از شروع، منتظر می‌ماند تا اندپوینت `/health` عامل کد `200` برگرداند (با `depends_on: condition: service_healthy`). روی یک لپ‌تاپ تازه، این کار حدود ۱۵ ثانیه طول می‌کشد.

## میزبانی چندگانه / NAS / VPS

اگر فضای کار و عامل روی **ماشین‌های متفاوتی** اجرا می‌شوند، یا می‌خواهید از طریق LAN/Tailscale به فضای کار دسترسی داشته باشید، باید سه چیز را تغییر دهید:

### ۱. عامل روی همهٔ رابط‌ها گوش می‌دهد

در فایل `.env`:

```bash
API_SERVER_HOST=0.0.0.0
API_SERVER_KEY=<یک رشتهٔ تصادفی طولانی>
```

با این کار، عامل روی همهٔ رابط‌ها (interface) گوش می‌دهد، نه فقط روی loopback داکر. **تنظیم `API_SERVER_KEY` الزامی است** هر زمان که `API_SERVER_HOST` روی چیزی جز loopback قرار گیرد؛ در غیر این صورت عامل راه‌اندازی نمی‌شود.

### ۲. فضای کار باید بداند عامل کجاست

در فایل `.env`:

```bash
HERMES_API_URL=http://<agent-host-or-service>:8642
HERMES_API_TOKEN=<همان مقدار API_SERVER_KEY>
HERMESCHI_DASHBOARD_URL=http://<agent-host-or-service>:9119
HERMESCHI_DASHBOARD_TOKEN=<همان کلید، یا CLAUDE_DASHBOARD_TOKEN را تنظیم کنید>
```

اگر هر دو سرویس داخل یک docker compose روی یک میزبان اجرا می‌شوند، `<agent-host-or-service>` همان نام سرویس از فایل compose شماست (مثلاً `hermes-agent`). روی یک NAS سینولوژی که فضای کار و عامل هر کدام در یک stack جداگانه هستند، این مقدار IP شبکهٔ محلی است (مثلاً `192.168.1.78`).

### ۳. فضای کار باید رمز عبور بگیرد

اتصال فضای کار در داکر روی چیزی جز loopback است (`0.0.0.0:3000`). در حالت production، فضای کار بدون رمز عبور راه‌اندازی نمی‌شود تا از در معرض دید عمومی قرار گرفتن تصادفی جلوگیری شود:

```bash
HERMESCHI_PASSWORD=<یک رشتهٔ تصادفی طولانی، متفاوت از API_SERVER_KEY>
```

اگر فضای کار را پشت HTTPS منتشر می‌کنید (reverse proxy، Tailscale Funnel، Cloudflare Tunnel)، علاوه بر آن `COOKIE_SECURE=1` را هم تنظیم کنید تا کوکی‌های نشست فلگ `Secure` بگیرند.

## عیب‌یابی اتصال

اگر فضای کار پیام «**Disconnected**» یا «**Missing Hermes APIs detected**» را نشان می‌دهد ولی عامل به‌نظر می‌رسد در حال اجراست:

### گام ۱ — مطمئن شوید عامل از داخل کانتینر فضای کار در دسترس است

```bash
docker compose exec hermeschi sh
# داخل کانتینر فضای کار:
curl -fsS http://hermes-agent:8642/health
curl -fsS -H "Authorization: Bearer $HERMES_API_TOKEN" http://hermes-agent:8642/v1/models | head -c 200
exit
```

اگر `/health` یک JSON با `{"status": "ok"}` برگرداند، عامل روی شبکهٔ داکر زنده است.

### گام ۲ — متغیرهای محیطی فضای کار را بررسی کنید

```bash
docker compose exec hermeschi env | grep -E "HERMES_API|API_SERVER"
```

باید این‌ها را ببینید:

- `HERMES_API_URL=http://hermes-agent:8642` (یا هر نام سرویس دیگری)
- `HERMES_API_TOKEN=<همان مقدار API_SERVER_KEY عامل>`

### گام ۳ — probe اجباری

فضای کار نقشهٔ قابلیت‌های دروازه را به‌مدت ۲ دقیقه کش می‌کند (در حالت disconnected از نسخهٔ v2.2.1 به ۱۵ ثانیه کاهش می‌یابد). اگر عامل بعد از شروع probe کردنِ فضای کار راه‌اندازی شده باشد، آن کش دیگر تازه نیست.

```bash
curl -X POST http://localhost:3000/api/gateway-reprobe
```

این دستور probe را دوباره اجرا می‌کند و نقشهٔ قابلیت‌های تازه را برمی‌گرداند. اگر حالا `mode=zero-fork` را دیدید، یعنی اتصال برقرار شده است.

### گام ۴ — لاگ قابلیت‌های فضای کار را بخوانید

فضای کار در هر probe، خلاصهٔ کامل قابلیت‌ها را لاگ می‌کند. به خط `[gateway]` نگاه کنید:

```bash
docker compose logs hermeschi 2>&1 | grep '\[gateway\]' | tail -3
```

یک لاگ سالم به این شکل است:

```
[gateway] gateway=http://hermes-agent:8642 dashboard=http://hermes-agent:9119 mode=zero-fork core=[health,chatCompletions,models,streaming] enhanced=[sessions,skills,memory,config,jobs,enhancedChat,conductor,kanban] missing=[mcp]
```

یک لاگ ناموفق معمولاً `core=[]` و `missing=[health,...]` را نشان می‌دهد، یعنی هر probe یک پاسخ غیر-2xx گرفته است. لاگ‌های عامل (`docker compose logs hermes-agent`) را برای خطاهای 401/404/timeout منطبق بررسی کنید.

### علل رایج

| علامت | علت | راه‌حل |
|---|---|---|
| `core=[]` و `missing=[health,...]` | فضای کار قبل از آماده‌شدن عامل probe کرده است | ۳۰ ثانیه صبر کنید و صفحه را رفرش کنید، یا `POST /api/gateway-reprobe` بزنید. در حالت disconnected، TTL کش به ۱۵ ثانیه کاهش می‌یابد. |
| `core=[health,chatCompletions]` ولی `models` نیست | image عامل قدیمی است (قبل از وجود `/v1/models`) | به‌روزرسانی کنید: `docker compose pull && docker compose up -d` |
| همهٔ probeها 401 می‌گیرند | `HERMES_API_TOKEN` با `API_SERVER_KEY` عامل همخوانی ندارد | بررسی کنید مقدار `.env` در هر دو دقیقاً یکسان باشد. |
| رابط کاربری فضای کار «Connection refused» نشان می‌دهد | فضای کار به‌جای نام سرویس از `127.0.0.1` استفاده می‌کند | `HERMES_API_URL=http://hermes-agent:8642` را تنظیم کنید (یا هر نام سرویس دیگر). |
| عامل با حلقهٔ restart و خطای `API_SERVER_KEY required` | عامل روی `0.0.0.0` بدون کلید bind شده | `API_SERVER_KEY` را در `.env` تنظیم کنید (برای bind غیر loopback الزامی است). |

## NAS سینولوژی / میزبان خارجی

اگر فضای کار و عامل شما روی **stackهای متفاوتی** روی یک NAS هستند (یا کلاً روی میزبان‌های متفاوت)، شبکهٔ داکر مشترک ندارند. باید:

۱. هر کدام پورت‌های خود را منتشر کنند (عامل روی `8642`، فضای کار روی `3000`).
۲. فضای کار به **IP میزبان** عامل اشاره کند، نه به نام سرویس. نمونه برای سینولوژی با NAS روی `192.168.1.78`:

```bash
HERMES_API_URL=http://192.168.1.78:8642
HERMES_API_TOKEN=<API_SERVER_KEY>
HERMESCHI_DASHBOARD_URL=http://192.168.1.78:9119
```

۳. عامل روی `0.0.0.0` bind شود:

```bash
API_SERVER_HOST=0.0.0.0
API_SERVER_KEY=<رشتهٔ تصادفی طولانی>
```

۴. افزونهٔ داشبورد (kanban چندبوردی، ماموریت‌های conductor) هم نیاز دارد سرویس داشبورد روی میزبان عامل در حال اجرا باشد؛ برای آن سرویس به docker-compose عامل مراجعه کنید.

اگر عامل را روی `0.0.0.0` روی یک NAS بدون `API_SERVER_KEY` bind کنید، عامل راه‌اندازی نمی‌شود. این رفتار عمدی است: قرار دادن اندپوینت گفتگوی عامل روی اینترنتِ بدون احراز هویت، یک تلهٔ خطرناک است.

## HermesChi + Hermes Agent: چرا دو کانتینر؟

فضای کار **رابط کاربری** است. عامل **موتور** است. جدا نگه‌داشتن این دو به شما امکان می‌دهد:

- هر کدام را مستقل به‌روزرسانی کنید (`docker compose pull hermeschi` و غیره)
- چندین فضای کار را در برابر یک عامل اجرا کنید (با پورت‌های متفاوت)
- فضای کار را روی تبلت/گوشی اجرا کنید در حالی که عامل روی یک ماشین قدرتمند باقی می‌ماند

compose پیش‌فرض برای سادگی، این دو را در کنار هم قرار می‌دهد. راه‌اندازی split-host بالا، مسیر صریح «می‌دانید چه می‌کنید» است.

## ثبت باگ

اگر راه‌اندازی شما با راهنمای بالا همخوانی دارد ولی باز هم می‌شکند، یک issue در <https://github.com/outsourc-e/hermeschi/issues> ثبت کنید و این موارد را ضمیمه کنید:

۱. `docker-compose.yml` شما (با redact کردن secretها)
۲. خروجی `docker compose logs hermeschi 2>&1 | grep '\[gateway\]' | tail -5`
۳. خروجی `curl -fsS http://<workspace-host>:3000/api/gateway-reprobe -X POST` (باز هم با redact)

این اطلاعات ما را در چند نگاه به علت واقعی می‌رساند، به‌جای یک رفت‌وبرگشت طولانی.
