# Docker

HermesChi + Hermes Agent در containerها.

## خلاصه (تک‌میزبانی، فقط localhost)

```bash
git clone https://github.com/outsourc-e/hermeschi
cd hermeschi
cp .env.example .env
# حداقل یک کلید provider اضافه کنید (مثلاً OPENROUTER_API_KEY=...)
docker compose up -d
open http://localhost:3000
```

همین. `docker-compose.yml` مخزن اجرا می‌کند:

- `hermes-agent` (پورت `8642`، فقط داخلی)
- `hermeschi` (پورت `3000`، متصل به `127.0.0.1`)

workspace پیش از شروع، منتظر می‌ماند تا `/health` عامل `200` برگرداند (از طریق `depends_on: condition: service_healthy`). روی یک لپ‌تاپ تازه این حدود ۱۵ ثانیه طول می‌کشد.

## چندمیزبانی / NAS / VPS

اگر workspace و عامل روی **ماشین‌های متفاوتی** اجرا می‌شوند، یا می‌خواهید دسترسی LAN/Tailscale به workspace داشته باشید، سه چیز تغییر می‌کند:

### ۱. عامل به‌صورت عمومی bind می‌شود

در `.env`:

```bash
API_SERVER_HOST=0.0.0.0
API_SERVER_KEY=<a long random string>
```

این کار باعث می‌شود عامل روی همهٔ interfaceها گوش دهد، نه فقط loopback داکر. **`API_SERVER_KEY` الزامی است** زمانی که `API_SERVER_HOST` غیر loopback است — در غیر این صورت عامل از راه‌اندازی امتناع می‌کند.

### ۲. workspace می‌داند عامل کجاست

در `.env`:

```bash
HERMES_API_URL=http://<agent-host-or-service>:8642
HERMES_API_TOKEN=<the same value as API_SERVER_KEY>
HERMESCHI_DASHBOARD_URL=http://<agent-host-or-service>:9119
HERMESCHI_DASHBOARD_TOKEN=<same key, or set CLAUDE_DASHBOARD_TOKEN>
```

در داخل docker compose روی همان میزبان، `<agent-host-or-service>` نام سرویس از فایل compose شماست (مثلاً `hermes-agent`). روی یک NAS سینولوژی با یک stack جداگانهٔ workspace، این IP LAN است (مثلاً `192.168.1.78`).

### ۳. workspace یک رمز عبور می‌گیرد

اتصال workspace در Docker غیر loopback است (`0.0.0.0:3000`). این در حالت تولید بدون رمز عبور از راه‌اندازی امتناع می‌کند تا از در معرض قرار گرفتن تصادفی باز جلوگیری شود:

```bash
HERMESCHI_PASSWORD=<a long random string different from API_SERVER_KEY>
```

اگر workspace را پشت HTTPS منتشر می‌کنید (reverse proxy، Tailscale Funnel، Cloudflare Tunnel)، همچنین `COOKIE_SECURE=1` را تنظیم کنید تا cookieهای سشن فلگ `Secure` را دریافت کنند.

## شکست‌های اتصال — راهنمای تشخیص

اگر workspace "**Disconnected**" یا "**Missing Hermes APIs detected**" را نشان می‌دهد اما عامل به‌نظر می‌رسد در حال اجراست:

### گام ۱ — راستی‌آزمایی کنید که عامل از داخل container workspace قابل‌دسترس است

```bash
docker compose exec hermeschi sh
# داخل container workspace:
curl -fsS http://hermes-agent:8642/health
curl -fsS -H "Authorization: Bearer $HERMES_API_TOKEN" http://hermes-agent:8642/v1/models | head -c 200
exit
```

اگر `/health` یک JSON `{"status": "ok"}` برگرداند، عامل روی شبکهٔ docker زنده است.

### گام ۲ — محیط workspace را تأیید کنید

```bash
docker compose exec hermeschi env | grep -E "HERMES_API|API_SERVER"
```

باید ببینید:

- `HERMES_API_URL=http://hermes-agent:8642` (یا هر نام سرویس دیگر)
- `HERMES_API_TOKEN=<same value as agent's API_SERVER_KEY>`

### گام ۳ — reprobe اجباری

workspace نقشهٔ قابلیت دروازه را به‌مدت ۲ دقیقه کش می‌کند (۱۵ ثانیه در حالت disconnected، از نسخهٔ v2.2.1). اگر عامل پس از شروع probe کردن workspace راه‌اندازی شده باشد، آن کش stale است.

```bash
curl -X POST http://localhost:3000/api/gateway-reprobe
```

این کار probe را دوباره اجرا کرده و نقشهٔ قابلیت تازه را برمی‌گرداند. اگر اکنون `mode=zero-fork` را نشان داد، متصل شده‌اید.

### گام ۴ — لاگ قابلیت workspace را بخوانید

workspace خلاصهٔ کامل قابلیت را در هر probe لاگ می‌کند. به خط `[gateway]` نگاه کنید:

```bash
docker compose logs hermeschi 2>&1 | grep '\[gateway\]' | tail -3
```

یک لاگ سالم به‌این شکل است:

```
[gateway] gateway=http://hermes-agent:8642 dashboard=http://hermes-agent:9119 mode=zero-fork core=[health,chatCompletions,models,streaming] enhanced=[sessions,skills,memory,config,jobs,enhancedChat,conductor,kanban] missing=[mcp]
```

یک لاگ ناموفق معمولاً `core=[]` و `missing=[health,...]` را نشان می‌دهد — یعنی هر probe یک پاسخ غیر-2xx دریافت کرده است. لاگ‌های عامل (`docker compose logs hermes-agent`) را برای ورودی‌های 401/404/timeout منطبق بررسی کنید.

### علل رایج

| علامت | علت | رفع |
|---|---|---|
| `core=[]` و `missing=[health,...]` | workspace پیش از آماده‌شدن عامل probe کرده است | ۳۰s صبر کنید و reload کنید، یا `POST /api/gateway-reprobe`. کش TTL در حالت disconnected به ۱۵s کاهش می‌یابد. |
| `core=[health,chatCompletions]` اما بدون `models` | image عامل قدیمی‌تر (پیش از `/v1/models`) | به‌روزرسانی: `docker compose pull && docker compose up -d` |
| همهٔ probeها 401 | `HERMES_API_TOKEN` با `API_SERVER_KEY` عامل همخوانی ندارد | بررسی کنید هر دو مقدار `.env` یکسان باشند. باید دقیقاً همخوانی داشته باشند. |
| رابط کاربری workspace "Connection refused" را نشان می‌دهد | workspace از `127.0.0.1` به‌جای نام سرویس استفاده می‌کند | `HERMES_API_URL=http://hermes-agent:8642` را تنظیم کنید (یا هر نام سرویس دیگر). |
| عامل با حلقهٔ restart `API_SERVER_KEY required` | عامل به 0.0.0.0 بدون کلید bind شده | `API_SERVER_KEY` را در `.env` تنظیم کنید (برای bind غیر loopback الزامی است). |

## NAS سینولوژی / راه‌اندازی میزبان خارجی

اگر workspace و عامل شما روی **stackهای متفاوتی** روی همان NAS هستند (یا کاملاً روی میزبان‌های متفاوت)، آن‌ها یک شبکهٔ docker مشترک ندارند. لازم است:

۱. هر دو پورت‌های خود را منتشر کنند (عامل روی `8642`، workspace روی `3000`).
۲. workspace به **host IP** عامل اشاره کند، نه نام سرویس. نمونه برای سینولوژی با NAS در `192.168.1.78`:

```bash
HERMES_API_URL=http://192.168.1.78:8642
HERMES_API_TOKEN=<API_SERVER_KEY>
HERMESCHI_DASHBOARD_URL=http://192.168.1.78:9119
```

۳. عامل روی `0.0.0.0` bind شود:

```bash
API_SERVER_HOST=0.0.0.0
API_SERVER_KEY=<long random>
```

۴. پلاگین داشبورد (kanban چندبوردی، ماموریت‌های conductor) نیز نیازمند اجرای سرویس داشبورد روی میزبان عامل است — به docker-compose عامل برای آن سرویس مراجعه کنید.

اگر عامل را به `0.0.0.0` روی یک NAS بدون `API_SERVER_KEY` bind کنید، عامل از راه‌اندازی امتناع می‌کند. این عمدی است — در معرض قرار دادن endpoint گفتگوی عامل در اینترنت باز بدون auth، یک footgun است.

## HermesChi + Hermes Agent: چرا دو container؟

workspace **رابط کاربری** است. عامل **موتور** است. جدا کردن آن‌ها به شما اجازه می‌دهد:

- هر کدام را مستقل به‌روزرسانی کنید (`docker compose pull hermeschi` و غیره)
- چندین workspace را در برابر یک عامل اجرا کنید (پورت‌های متفاوت)
- workspace را روی تبلت/گوشی اجرا کنید در حالی که عامل روی یک ماشین قدرتمند باقی می‌ماند

compose پیش‌فرض برای سادگی آن‌ها را colocate می‌کند. راه‌اندازی split-host بالا، مسیر صریح «می‌دانید چه می‌کنید» است.

## ثبت باگ

اگر راه‌اندازی شما با راهنمای بالا همخوانی دارد اما همچنان می‌شکند، یک issue در <https://github.com/outsourc-e/hermeschi/issues> ثبت کنید با:

۱. `docker-compose.yml` شما (secretها را redact کنید)
۲. خروجی `docker compose logs hermeschi 2>&1 | grep '\[gateway\]' | tail -5`
۳. خروجی `curl -fsS http://<workspace-host>:3000/api/gateway-reprobe -X POST` (همچنین redact کنید)

این کار ما را در عرض چند نظر به علت واقعی می‌رساند، به‌جای یک رفت‌وبرگشت طولانی.
