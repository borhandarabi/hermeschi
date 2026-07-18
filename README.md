<div align="center">

<img src="./public/claude-avatar.webp" alt="HermesChi" width="80" style="border-radius: 16px" />
<!-- نام فایل آواتار برای پایداری کش حفظ شده است — بدون هماهنگی cache-bust نام آن را تغییر ندهید -->

# HermesChi

**فضای کار دسکتاپ عامل هوش مصنوعی شما — گفت‌وگو، فایل‌ها، حافظه، مهارت‌ها و ترمینال، همه در یک‌جا.**

[![Version](https://img.shields.io/badge/version-2.3.0-2557b7.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-6366F1.svg)](CONTRIBUTING.md)

> فقط یک پوستهٔ ساده برای چت نیست؛ یک فضای کاری کامل است — عامل‌ها را هماهنگ کنید، در حافظه جست‌وجو کنید، مهارت‌ها را مدیریت کنید و همه‌چیز را از یک رابط کنترل کنید.

> **نسخهٔ ۲ — بدون فورک.** فقط کلون کنید؛ نیازی به فورک نیست. این نسخه مستقیماً روی نسخهٔ خام [`NousResearch/hermes-agent`](https://github.com/NousResearch/hermes-agent) اجرا می‌شود و از طریق نصب‌کنندهٔ رسمی Nous راه‌اندازی می‌گردد. همه‌چیز — چت، نشست‌ها، حافظه، مهارت‌ها، کارها، MCP، ترمینال، داشبورد، نمایهٔ عامل و عملیات — با نسخهٔ خام هماهنگ است. **Conductor** در صورت موجود بودن از API مأموریتِ داشبورد استفاده می‌کند و اگر endpoint داشبورد در دسترس نباشد، به ارسال Swarm بومی فضای کاری (`mode: native-swarm`) برمی‌گردد تا رفتار بدون فورک حفظ شود ([#262](https://github.com/outsourc-e/hermeschi/issues/262)).

![HermesChi](./docs/screenshots/splash.png)

</div>

---

## حالت Swarm

Hermes Agent Swarm فضای کاری را به یک داشبورد زنده تبدیل می‌کند: هر تعداد Hermes Agent که بخواهید، یک هماهنگ‌کننده و هیچ انسانی که دستی چیزی ارسال کند.

کارگرهای پایدار tmux زمینه را میان وظایف حفظ می‌کنند، به‌صورت ایمن چرخش می‌یابند و ایست‌های بازرسی را همراه با مدرک گزارش می‌دهند.

ارسال مبتنی بر نقش، مسیر سازنده‌ها، بازبین‌ها، مستندسازها، پژوهش، عملیات، دسته‌بندی، QA و خط آزمایشگاه را هدایت می‌کند — بدون آنکه اریک را صرفاً به یک مسیریاب وظایف تبدیل کند.

یک دروازهٔ بازبینیِ تأییدشده در سطح بایت، شاخه‌های انتشار را پیش از رفتن PR محافظت می‌کند.

مسیرهای خودکار PR و issue، آزمایش‌های آزمایشگاهی و راهنمای تعمیر، ماشین را در حال حرکت نگه می‌دارند؛ در عین حال که تصمیم‌گیری به‌عهدهٔ انسان باقی می‌ماند.

نقطهٔ شروع: [docs/swarm/](./docs/swarm/)

- **چت هماهنگ‌کننده** — از داشبورد برای یک وظیفه، یک مأموریت تجزیه‌شده یا یک پخش کامل بخواهید.
- **داشبورد چندعاملی** — عامل‌های پایدار Hermes، نقش‌ها، وضعیت، زمان اجرا و سیم‌کشی مسیریابی را در یک نگاه ببینید.
- **تابلو وظایف Kanban** — ستون‌های backlog، آماده، در حال اجرا، بازبینی، مسدود و انجام‌شده را بدون خروج از فضای کاری برنامه‌ریزی کنید.
- **گزارش‌ها + صندوق ورودی** — ایست‌های بازبینی، مسدودکننده‌ها، تحویل‌ها و تصمیمات آماده برای انسان را مرور کنید.
- **نمای TUI داخلی** — به کارگرهای پشتیبان tmux متصل شوید یا به جریان زندهٔ پوسته و لاگ برگردید.

---

## ✨ چه چیزهایی درون است

- 💬 **چت** — استریم زندهٔ SSE، نمایش فراخوانی ابزار، چندنشسته، markdown و برجسته‌سازی نحو
- 🧠 **حافظه** — مرور، جست‌وجو و ویرایش حافظهٔ عامل؛ ویرایشگر زندهٔ markdown
- 🧩 **مهارت‌ها** — مرور بیش از ۲٬۰۰۰ مهارت با نشان منبع، فیلترها، مسیرهای منبع و بازارچه
- 🔌 **MCP** — صفحهٔ کامل /mcp (کاتالوگ + بازارچه + منابع)، یا بازگشت به CRUD پیکربندی محلی
- 📁 **فایل‌ها + ترمینال** — مرورگر کامل فایل فضای کاری با Monaco؛ ترمینال PTY چندسکویی
- 🎮 **عملیات** — داشبورد چندعاملی با نمایه‌های آماده (Sage/Trader/Builder/Scribe/Ops) و تشخیص «نیازمند راه‌اندازی»
- 📡 **Conductor** — ارسال و تجزیهٔ مأموریت با مأموریت‌های پشتیبان داشبورد در صورت موجود بودن، و در غیر این صورت بازگشت به Swarm بومی فضای کاری
- 👥 **نمایهٔ عامل** — پنل زندهٔ عامل در چت با آواتار، صف، تاریخچه و نشانگر مصرف
- 🐝 **حالت Swarm** — کارگرهای پشتیبان tmux عامل Hermes با ارسال مبتنی بر نقش
- 🗄️ **داشبورد** — نمای کلی تجمیعی: نشست‌ها، ترکیب مدل، دفتر هزینه، کارت توجه و نوار عملیات
- 🎨 **پوسته‌ها** — Hermes، Nous، Bronze، Slate، Mono (روشن + تاریک)
- 🔒 **امنیت** — middleware احراز هویت روی هر مسیر، CSP، محافظ از پیمایش مسیر، اتصال از راه دور fail-closed
- 📱 **PWA + Tailscale** — به‌عنوان اپلیکیشنی با حس بومی نصب کنید و از هر دستگاهی روی tailnet خود به آن دسترسی پیدا کنید
- ⚙️ **دروازه‌های قابلیت** — قابلیت‌هایی که به endpoint بالادستی (Conductor) نیاز دارند، به‌جای شکستن در میانهٔ کار، یک جایگزین تمیز نمایش می‌دهند

---

## 📸 اسکرین‌شات‌ها

|                 چت                 |                  Conductor                   |
| :----------------------------------: | :------------------------------------------: |
| ![Chat](./docs/screenshots/chat.png) | ![Conductor](./docs/screenshots/conductor.png) |

|                   داشبورد                  |                  حافظه                  |
| :------------------------------------------: | :--------------------------------------: |
| ![Dashboard](./docs/screenshots/dashboard.png) | ![Memory](./docs/screenshots/memory.png) |

|                   ترمینال                   |                   تنظیمات                   |
| :------------------------------------------: | :------------------------------------------: |
| ![Terminal](./docs/screenshots/terminal.png) | ![Settings](./docs/screenshots/settings.png) |

|                  وظایف                  |                 کارها                 |
| :--------------------------------------: | :----------------------------------: |
| ![Tasks](./docs/screenshots/tasks.png) | ![Jobs](./docs/screenshots/jobs.png) |

---

## 🚀 شروع سریع

سه مسیر پیش رو دارید — هر کدام که برایتان مناسب‌تر است را انتخاب کنید:

| مسیر | مناسب برای | زمان |
|---|---|---|
| **🐳 [Docker Compose](#-شروع-سریع-docker)** | خودمیزبان‌ها، آزمایشگاه‌های خانگی، «یک compose بزن و برو» | ~۲ دقیقه |
| **🌐 نصب یک‌خطی** | توسعهٔ محلی روی macOS/Linux | ~۳ دقیقه |
| **🔌 اتصال به `hermes-agent` موجود** | اگر Hermes Agent را از قبل اجرا می‌کنید | ~۱ دقیقه |

### نصب یک‌خطی

```bash
curl -fsSL https://raw.githubusercontent.com/outsourc-e/hermeschi/main/install.sh | bash
```

این دستور `hermes-agent` را از طریق نصب‌کنندهٔ رسمی Nous نصب می‌کند، این مخزن را کلون می‌کند، فایل `.env` را راه‌اندازی می‌کند و وابستگی‌ها را نصب می‌کند. سپس:

```bash
hermes gateway run                  # ترمینال ۱
cd ~/hermeschi && pnpm dev   # ترمینال ۲
```

آدرس http://localhost:3000 را در مرورگر باز کنید. کار تمام است.

---

### `hermes-agent` را از قبل اجرا می‌کنید؟ فضای کاری را به آن متصل کنید

اگر `hermes-agent` را از قبل نصب کرده‌اید (از طریق نصب‌کنندهٔ رسمی Nous، یک checkout از روی سورس، systemd، Docker یا هر راه‌اندازی موجود دیگر) و gateway را روی `http://<host>:8642` سرو می‌کند، نیازی به نصب مجدد چیزی نیست — فقط فضای کاری را به آن نشانه بگیرید.

```bash
git clone https://github.com/outsourc-e/hermeschi.git
cd hermeschi
pnpm install
cp .env.example .env

# به سرویس‌های Hermes Agent موجود خود نشانه بگیرید.
echo 'HERMES_API_URL=http://127.0.0.1:8642' >> .env
# نصب‌های بدون فورک همچنین به API داشبورد جداگانه برای پیکربندی/نشست‌ها/مهارت‌ها/کارها نیاز دارند.
echo 'HERMESCHI_DASHBOARD_URL=http://127.0.0.1:9119' >> .env

# اگر gateway شما با API_SERVER_KEY (احراز هویت فعال) آغاز شده، همان مقدار را تنظیم کنید:
# echo 'HERMES_API_TOKEN=***' >> .env

pnpm dev                            # http://localhost:3000 (با PORT=4000 pnpm dev بازنویسی کنید)
```

نیازمندی‌ها در سمت عامل:

- gateway به آدرسی متصل باشد که فضای کاری بتواند به آن برسد (معمولاً `API_SERVER_HOST=0.0.0.0` + پورت در معرض نمایش).
- `API_SERVER_ENABLED=true` در `~/.hermes/.env` (یا env عامل) تا gateway APIهای اصلی را روی `:8642` سرو کند.
- `hermes dashboard` در حال اجرا (پیش‌فرض `http://127.0.0.1:9119`) برای نصب‌های بدون فورک. داشبورد APIهای پیکربندی، نشست‌ها، مهارت‌ها و کارها را فراهم می‌کند.
- اگر `API_SERVER_KEY` تنظیم شده، فضای کاری باید همان مقدار را از طریق `HERMES_API_TOKEN` ارسال کند — در غیر این صورت هر دو را تنظیم‌نشده بگذارید.

پیش از باز کردن فضای کاری، هر دو سرویس را راستی‌آزمایی کنید:

- `curl http://127.0.0.1:8642/health` باید ok برگرداند.
- `curl http://127.0.0.1:9119/api/status` باید متادیتای داشبورد برگرداند.
- `curl http://127.0.0.1:3000/api/sessions` (پس از بوت شدن فضای کاری) باید یک payload نشست‌ها یا یک لیست خالی برگرداند.

اگر `/api/sessions` از قبل داده برمی‌گرداند، **فقط به این دلیل که UI هنوز «آفلاین» می‌گوید، یک gateway دیگر راه‌اندازی نکنید** — ابتدا UI فضای کاری را بازخوانی یا دوباره بررسی کنید.

اگر مدل پیش‌فرض شما `gpt-5.4` یا `openai-codex` است، پیش از آزمایش چت مطمئن شوید احراز هویت Codex CLI فعال است:

```bash
codex login
```

سپس فضای کاری را آغاز کنید و onboarding را تکمیل کنید — باید جفت gateway + داشبورد را تشخیص دهد و قابلیت‌های پیشرفته را به‌طور خودکار باز کند.

#### اجرا روی یک میزبان از راه دور (Tailscale / VPN / LAN)

اگر فضای کاری و مرورگر روی ماشین‌های متفاوتی هستند — مثلاً فضای کاری روی یک Pi/Mac/سرور خانگی اجرا می‌شود و شما از روی تلفن از طریق Tailscale به آن دسترسی دارید — `HERMES_API_URL` را به آدرس backend **قابل دسترس** نشانه بگیرید، نه `127.0.0.1`:

```bash
# روی سروری که فضای کاری + gateway را اجرا می‌کند:
echo 'HERMES_API_URL=http://100.x.y.z:8642' >> .env
echo 'HERMESCHI_DASHBOARD_URL=http://100.x.y.z:9119' >> .env

# همچنین به gateway بگویید روی همهٔ رابط‌ها گوش دهد تا همتایان Tailscale بتوانند به آن برسند.
# در ~/.hermes/.env (یا هر جایی که gateway پیکربندی را می‌خواند):
echo 'API_SERVER_HOST=0.0.0.0' >> ~/.hermes/.env
```

سپس gateway، داشبورد و فضای کاری را راه‌اندازی مجدد کنید. از دستگاه از راه دور به فضای کاری درخواست بزنید؛ بررسی اتصال به‌جای localhost از IP تیل‌اسکیل استفاده خواهد کرد. هم `HERMES_API_URL` و هم `HERMESCHI_DASHBOARD_URL` باید روی URLهای قابل دسترس از Tailscale/LAN تنظیم شوند — تنظیم فقط یکی باعث می‌شود دیگری همچنان `127.0.0.1` را بررسی کند و شکست بخورد.

**اگر فضای کاری را از قبل آغاز کرده‌اید**، می‌توانید بدون راه‌اندازی مجدد، هر دو URL را از `Settings → Connection` به‌روزرسانی کنید. مقادیر در `~/.hermes/workspace-overrides.json` ذخیره می‌شوند و بلافاصله اعمال می‌شوند (قابلیت‌های gateway هنگام ذخیره دوباره بررسی می‌شوند). ویرایش `.env` همچنان برای پیکربندی پیش از آغاز و برای CI/کانتینرها کار می‌کند.

---

### نصب دستی

HermesChi با هر backend سازگار با OpenAI کار می‌کند. اگر backend شما همچنین APIهای gateway عامل Hermes را ارائه می‌دهد، قابلیت‌های پیشرفته‌ای مانند نشست‌ها، حافظه، مهارت‌ها و کارها به‌طور خودکار باز می‌شوند.

#### پیش‌نیازها

- **Node.js 22+** — [nodejs.org](https://nodejs.org/)
- **یک backend سازگار با OpenAI** — محلی، خودمیزبان یا از راه دور
- **اختیاری:** Python 3.11+ اگر می‌خواهید یک gateway عامل Hermes را به‌صورت محلی اجرا کنید

#### گام ۱: backend خود را آغاز کنید

HermesChi را به هر backendی نشانه بگیرید که از این‌ها پشتیبانی می‌کند:

- `POST /v1/chat/completions`
- `GET /v1/models` توصیه می‌شود

نمونهٔ راه‌اندازی gateway عامل Hermes (از صفر):

```bash
# نصب hermes-agent از طریق نصب‌کنندهٔ رسمی Nous
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# پیکربندی یک provider + آغاز gateway
hermes setup
hermes gateway run
```

نصب‌کنندهٔ یک‌خطی ما (در ادامه) هر دو گام را به‌طور خودکار انجام می‌دهد. اگر از یک سرور سازگار با OpenAI دیگر استفاده می‌کنید، فقط URL پایهٔ آن را یادداشت کنید.

### گام ۲: نصب و اجرای HermesChi

```bash
# در یک ترمینال جدید
git clone https://github.com/outsourc-e/hermeschi.git
cd hermeschi
pnpm install
cp .env.example .env
printf '\nHERMES_API_URL=http://127.0.0.1:8642\n' >> .env
pnpm dev                   # روی http://localhost:3000 آغاز می‌شود
```

> **راستی‌آزمایی:** `http://localhost:3000` را باز کنید و جریان onboarding را تکمیل کنید. ابتدا backend را متصل کنید، سپس راستی‌آزمایی کنید که چت کار می‌کند. اگر gateway شما APIهای عامل Hermes را ارائه می‌دهد، قابلیت‌های پیشرفته به‌طور خودکار ظاهر می‌شوند.

#### اجرا بدون یک ترمینال باز

پس از `pnpm build`، فضای کاری را به‌عنوان یک سرویس launchd/systemd سطح کاربر نصب کنید:

```bash
chmod +x scripts/install-dashboard-service.sh
scripts/install-dashboard-service.sh
```

برای launchd مک، systemd لینوکس، لاگ‌ها، بازنویسی‌ها و مراحل حذف به [`docs/dashboard-service.md`](docs/dashboard-service.md) مراجعه کنید.

#### متغیرهای محیطی

```env
# URL backend سازگار با OpenAI
HERMES_API_URL=http://127.0.0.1:8642

# اختیاری: کلیدهای provider که gateway عامل Hermes می‌تواند در زمان اجرا بخواند.
# فقط به کلید(های) آن provider(هایی) نیاز دارید که واقعاً استفاده می‌کنید.
# OPENAI_API_KEY=sk-...                # GPT / o-series / سازگار با OpenAI
# OPENROUTER_API_KEY=sk-or-v1-...      # OpenRouter (شامل مدل‌های رایگان)
# GOOGLE_API_KEY=AIza...               # Gemini
# (Ollama / LM Studio / سرورهای محلی به کلید نیاز ندارند)

# اختیاری: محافظت با رمز عبور از رابط وب
# HERMESCHI_PASSWORD=your_password
```

---

## 🧠 مدل‌های محلی (Ollama، Atomic Chat، LM Studio، vLLM)

HermesChi از مدل‌های محلی در دو حالت پشتیبانی می‌کند:

### حالت قابل‌حمل (آسان‌ترین راه)

فضای کاری را مستقیماً به سرور محلی خود نشانه بگیرید — نیازی به gateway عامل Hermes نیست.

### Atomic Chat

```bash
# آغاز فضای کاری نشانه‌داده به Atomic Chat
HERMES_API_URL=http://127.0.0.1:1337/v1 pnpm dev
```

[Atomic Chat](https://atomic.chat/) را دانلود کنید، اپلیکیشن دسکتاپ را اجرا کنید و مطمئن شوید پیش از آغاز HermesChi یک مدل بارگذاری شده است.

### Ollama

```bash
# آغاز Ollama
OLLAMA_ORIGINS=* ollama serve

# آغاز فضای کاری نشانه‌داده به Ollama
HERMES_API_URL=http://127.0.0.1:11434 pnpm dev
```

چت بلافاصله کار می‌کند. نشست‌ها، حافظه و مهارت‌ها «در دسترس نیست» نشان می‌دهند — این در حالت قابل‌حمل طبیعی است.

### حالت پیشرفته (امکانات کامل)

از طریق gateway عامل Hermes به نشست‌ها، حافظه، مهارت‌ها، کارها و ابزارها دسترسی پیدا کنید.

در ادامه دو نمونهٔ صریح از `~/.hermes/config.yaml` برای providerهای محلی آورده شده که مستقیماً در فضای کاری پشتیبانی می‌شوند:

**Atomic Chat**

```yaml
provider: atomic-chat
model: your-model-name
custom_providers:
  - name: atomic-chat
    base_url: http://127.0.0.1:1337/v1
    api_key: atomic-chat
    api_mode: chat_completions
```

**Ollama**

```yaml
provider: ollama
model: qwen3:32b
custom_providers:
  - name: ollama
    base_url: http://127.0.0.1:11434/v1
    api_key: ollama
    api_mode: chat_completions
```

می‌توانید همین ساختار را برای سایر runnerهای محلی سازگار با OpenAI نیز تطبیق دهید، اما `Atomic Chat` و `Ollama` دو مسیر محلی داخلی هستند که در رابط فضای کاری مستندسازی شده‌اند.

**۲. فعال کردن API server در `~/.hermes/.env`:**

```env
API_SERVER_ENABLED=true
```

**۳. آغاز gateway، داشبورد و فضای کاری:**

```bash
hermes gateway run          # آغاز APIهای اصلی روی :8642
hermes dashboard            # آغاز APIهای داشبورد روی :9119
HERMES_API_URL=http://127.0.0.1:8642 \
HERMESCHI_DASHBOARD_URL=http://127.0.0.1:9119 \
pnpm dev
```

برای gatewayهای دارای احراز هویت، همچنین `HERMES_API_TOKEN` را در محیط فضای کاری به همان مقدار `API_SERVER_KEY` تنظیم کنید.

تمام قابلیت‌های فضای کاری به‌محض اینکه هر دو سرویس در دسترس قرار گیرند به‌طور خودکار باز می‌شوند — نشست‌ها ماندگار می‌شوند، حافظه میان چت‌ها ذخیره می‌شود، مهارت‌ها در دسترس هستند و داشبورد داده‌های مصرف واقعی را نمایش می‌دهد.

> **با هر سرور سازگار با OpenAI کار می‌کند** — Atomic Chat، Ollama، LM Studio، vLLM، llama.cpp، LocalAI و غیره. فقط `base_url` و `model` را در پیکربندی بالا تغییر دهید.

---

## 🤝 جفت‌کردن یک عامل با فضای کاری

فضای کاری رابط کاربری است. **Hermes Agent** مغز است. این دو روی localhost (یا هر شبکهٔ قابل دسترسی) از طریق دو سرویس HTTP با هم صحبت می‌کنند.

```
┌───────────────┐         :8642 gateway          ┌────────────────┐
│   Workspace    │ ─────────────────────▶ │  Hermes Agent  │
│   :3000 (UI)   │ ◀───────────────────── │  CLI / brain   │
└───────────────┘         :9119 dashboard        └────────────────┘
```

### دو سرویس، سه دستور

```bash
hermes gateway run     # ترمینال ۱ · :8642 · چت، مدل‌ها، استریم، کارها
hermes dashboard       # ترمینال ۲ · :9119 · نشست‌ها، مهارت‌ها، پیکربندی، MCP
cd ~/hermeschi && pnpm dev   # ترمینال ۳ · :3000 · رابط کاربری
```

> **نکته:** `pnpm start:all` در صورت نصب از طریق نصب‌کنندهٔ یک‌خطی، gateway + داشبورد + فضای کاری را در یک گام آغاز می‌کند.

### ویندوز (PowerShell + WSL) — آغاز یک‌دستوری

اگر HermesChi را از ویندوز استفاده می‌کنید و عامل در WSL در حال اجراست، از اسکریپت کمکی در این مخزن استفاده کنید:

```powershell
# از ریشهٔ مخزن
.\scripts\start-hermeschi.ps1
```

برای اعمال یک راه‌اندازی مجددِ تمیز نشست tmux:

```powershell
.\scripts\start-hermeschi.ps1 -Restart
```

پارامترهای اختیاری:
- `-Distro <name>` برای هدف قرار دادن یک توزیع WSL غیرپیش‌فرض
- `-WorkspacePath </path/in/wsl>` اگر کلون شما در `~/hermeschi` نیست
- `-SessionName <name>` برای استفاده از یک نام نشست tmux سفارشی

### راستی‌آزمایی جفت‌شدن

```bash
curl http://127.0.0.1:8642/health        # → {"status":"ok","platform":"hermes-agent"}
curl http://127.0.0.1:9119/api/status    # → {"status":"ok", ...}
```

هر دو باید `200` برگردانند. اگر هر کدام شکست بخورد، فضای کاری به **حالت قابل‌حمل** برمی‌گردد (چت کار می‌کند، نشست‌ها/مهارت‌ها/حافظه «در دسترس نیست» نشان می‌دهند).

### تنظیمات `.env` که برای فضای کاری اهمیت دارند

```env
# الزامی: gateway کجاست
HERMES_API_URL=http://127.0.0.1:8642

# توصیه‌شده: داشبورد کجاست (نشست‌ها/مهارت‌ها/پیکربندی/MCP/کارها را باز می‌کند)
HERMESCHI_DASHBOARD_URL=http://127.0.0.1:9119

# فقط اگر gateway شما با API_SERVER_KEY=... آغاز شده — همان مقدار را جای‌گذاری کنید:
# HERMES_API_TOKEN=***

# اختیاری: محافظت با رمز عبور از خود رابط وب
# HERMESCHI_PASSWORD=***
```

### سناریوهای رایج جفت‌شدن

| سناریو | این مورد را تنظیم کنید |
|---|---|
| فضای کاری + gateway روی همان ماشین | `HERMES_API_URL=http://127.0.0.1:8642`، `HERMESCHI_DASHBOARD_URL=http://127.0.0.1:9119` |
| gateway روی یک سرور از راه دور (Tailscale / VPN) | هر دو URL را روی IP قابل دسترس تنظیم کنید (مثلاً `http://100.x.y.z:8642`) و `API_SERVER_HOST=0.0.0.0` را به `~/.hermes/.env` gateway اضافه کنید |
| `hermes-agent` در حال اجرا از نصب‌کنندهٔ بالادستی | فقط `HERMES_API_URL` + `HERMESCHI_DASHBOARD_URL` را تنظیم کنید و از نصب‌کنندهٔ یک‌خطی صرف‌نظر کنید |
| چندین نمایهٔ عامل | نمایه‌ها در `~/.hermes/profiles/<name>` قرار دارند — داشبورد در زمان اجرا میان آن‌ها جابه‌جا می‌شود؛ فضای کاری به‌طور خودکار پیروی می‌کند |

### جفت‌شدن مجدد زنده (بدون راه‌اندازی مجدد)

اگر فضای کاری را از قبل آغاز کرده‌اید، بدون راه‌اندازی مجدد، هر یک از URLها را از **Settings → Connection** تغییر دهید. مقادیر در `~/.hermes/workspace-overrides.json` ذخیره می‌شوند و قابلیت‌های gateway هنگام ذخیره دوباره بررسی می‌شوند.

### عیب‌یابی

- **`Could not reach Hermes gateway on 8645, 8642, or 8643`** — gateway در حال اجرا نیست، یا `HERMES_API_URL` به جایی غیرقابل دسترس اشاره می‌کند. `hermes gateway run` را اجرا کنید و دوباره بررسی کنید.
- **فضای کاری «حالت قابل‌حمل» نشان می‌دهد / APIهای توسعه‌یافته غایب‌اند** — داشبورد در حال اجرا نیست. `hermes dashboard` را در یک ترمینال دیگر آغاز کنید و بازخوانی کنید.
- **بررسی نشست‌ها «غیرقابل دسترس» می‌گوید / رابط ادعای آفلاین می‌کند در حالی که جفت‌شدن باید زنده باشد** — پیش از آغاز gateway دیگر، `curl http://localhost:3000/api/sessions` را راستی‌آزمایی کنید. اگر نشست‌ها (یا یک آرایهٔ خالی) برگرداند، جفت‌شدن backend زنده است و رابط به بازخوانی/بررسی مجدد نیاز دارد.
- **ارسال چت روی `gpt-5.4` / Codex شکست می‌خورد** — احراز هویت Codex CLI منقضی شده. `codex login` را اجرا کنید، سپس بدون آغاز gateway دیگر چت را دوباره امتحان کنید.
- **`Unauthorized` روی هر فراخوانی API** — gateway `API_SERVER_KEY` تنظیم کرده اما فضای کاری `HERMES_API_TOKEN` ندارد. آن‌ها را مطابقت دهید.
- **`Could not connect` از تلفن از طریق Tailscale** — gateway به loopback متصل است. `API_SERVER_HOST=0.0.0.0` را در `~/.hermes/.env` تنظیم کنید و آن را راه‌اندازی مجدد کنید.

---

## 🐳 شروع سریع Docker

[![Open in GitHub Codespaces](https://img.shields.io/badge/GitHub%20Codespaces-Open-181717?logo=github)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=outsourc-e/hermeschi)

راه‌اندازی Docker هم **gateway عامل Hermes** و هم **HermesChi** را با هم اجرا می‌کند.

### پیش‌نیازها

- **Docker**
- **Docker Compose**
- **یک provider مدل عامل Hermes پیکربندی‌شده** — `hermes setup` / `hermes model` را اجرا کنید، یا کلیدی برای هر provider که استفاده می‌کنید ارائه دهید. این فضای کاری به Anthropic نیاز ندارد.

### گام ۱: پیکربندی محیط

```bash
git clone https://github.com/outsourc-e/hermeschi.git
cd hermeschi
cp .env.example .env
```

فایل `.env` را ویرایش کنید و **حداقل یک** کلید provider مدل زبان اضافه کنید — هر provider که می‌خواهید hermes-agent از آن استفاده کند:

```env
# یکی (یا چندتا) را انتخاب کنید. به همهٔ این‌ها نیاز ندارید.
# OPENAI_API_KEY=sk-...                # GPT / o-series / سازگار با OpenAI
# OPENROUTER_API_KEY=sk-or-v1-...      # OpenRouter (مدل‌های رایگان موجود)
# GOOGLE_API_KEY=AIza...               # Gemini
```

از **Ollama، LM Studio یا یک سرور محلی دیگر** استفاده می‌کنید؟ کلید لازم نیست — فقط از طریق جریان onboarding، hermes-agent را به endpoint محلی خود نشانه بگیرید.

> **توجه:** `hermes-agent` باید بتواند به _یک_ مدل برسد. اگر هیچ providerای (کلید API یا سرور محلی) پیکربندی نکنید، چت در اولین پیام شکست می‌خورد.

### گام ۲: آغاز سرویس‌ها

```bash
docker compose up
```

این دستور دو ایمیج پیش‌ساخته‌شده را می‌کشد و آغاز می‌کند:

- **hermes-agent** → `nousresearch/hermes-agent:latest` روی پورت **8642**
- **hermeschi** → `ghcr.io/outsourc-e/hermeschi:latest` روی پورت **3000**

بدون build محلی. اولین اجرا یک دقیقه برای کشیدن طول می‌کشد؛ آغازهای بعدی فوری هستند.
وضعیت عامل (پیکربندی، نشست‌ها، مهارت‌ها، حافظه، اعتبارنامه‌ها) در volume داکر با نام قدیمی `claude-data` ماندگار است، بنابراین کانتینرها می‌توانند بدون از دست رفتن داده بازسازی شوند.

### گام ۳: دسترسی به فضای کاری

`http://localhost:3000` را باز کنید و onboarding را تکمیل کنید.

> **راستی‌آزمایی:** لاگ‌های Docker را برای `[gateway] Connected to Hermes Agent` بررسی کنید — این تأیید می‌کند که فضای کاری با موفقیت به عامل متصل شده است.

### دسترسی از راه دور (LAN / Tailscale / VPN)

فایل compose پیش‌فرض پورت‌ها را به `127.0.0.1` (فقط localhost) متصل می‌کند. برای دسترسی به فضای کاری از دستگاه‌های دیگر روی شبکهٔ خود، باید:

**۱. پورت‌ها را بدون محدودیت loopback منتشر کنید.** یک `docker-compose.override.yml` بسازید:

```yaml
services:
  hermes-agent:
    ports:
      - '8642:8642'
  hermeschi:
    ports:
      - '3000:3000'
```

**۲. این متغیرهای env را به `.env` اضافه کنید:**

```env
# الزامی: رمز عبور نشست فضای کاری (فضای کاری روی 0.0.0.0 بدون آن از آغاز سر باز می‌زند)
HERMESCHI_PASSWORD=your-strong-secret-here

# الزامی برای دسترسی LAN با HTTP ساده (مرورگرها کوکی‌های Secure را روی http:// رد می‌کنند)
COOKIE_SECURE=0

# توصیه‌شده: توکن احراز هویت gateway (جلوگیری از دسترسی API بدون احراز هویت روی LAN شما)
API_SERVER_KEY=***

# اگر gateway با "No user allowlists configured" از آغاز سر باز می‌زند:
GATEWAY_ALLOW_ALL_USERS=true
```

**۳. استک را راه‌اندازی مجدد کنید:**

```bash
docker compose down && docker compose up -d
```

> **HTTPS پشت یک reverse proxy؟** اگر TLS را در یک reverse proxy (Traefik، Nginx، Caddy، Tailscale Funnel) خاتمه می‌دهید، به‌جای آن `COOKIE_SECURE=1` تنظیم کنید و `TRUST_PROXY=1` اضافه کنید تا طبقه‌بندی IP درست کار کند.

### عیب‌یابی Docker

| علامت | راه‌حل |
|---|---|
| `[workspace] refusing to start — HERMESCHI_PASSWORD is unset` | `HERMESCHI_PASSWORD=<secret>` را به `.env` اضافه کنید |
| ورود به‌طور خاموش شکست می‌خورد (بدون خطا، صفحه بازخوانی می‌شود) | برای HTTP `COOKIE_SECURE=0` اضافه کنید، یا `COOKIE_SECURE=1` + HTTPS |
| `[Api_Server] Refusing to start: binding to 0.0.0.0 requires API_SERVER_KEY` | `API_SERVER_KEY=***` را به `.env` اضافه کنید |
| `No user allowlists configured. All unauthorized users will be denied.` | `GATEWAY_ALLOW_ALL_USERS=true` را به `.env` اضافه کنید |
| هشدار `CLAUDE_DASHBOARD_TOKEN is not set` | `CLAUDE_DASHBOARD_TOKEN` را به همان مقدار `API_SERVER_KEY` تنظیم کنید |
| خطای 500 Internal Server Error هنگام ورود پس از تنظیم همهٔ موارد بالا | کوکی‌های مرورگر را برای دامنهٔ فضای کاری پاک کنید، سپس دوباره امتحان کنید |

### ساختن از سورس

می‌خواهید روی فضای کاری کار کنید و تغییرات محلی را به‌صورت hot-built درون کانتینر داشته باشید؟ از overlay توسعه‌ای استفاده کنید:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

`docker-compose.yml` پایه دست‌نخورده باقی می‌ماند — overlay یک بلوک `build:` برای سرویس `hermeschi` اضافه می‌کند تا مخزن محلی به‌جای کشیده شدن، کامپایل شود. سرویس Hermes Agent همچنان از ایمیج کانونیکال `nousresearch/hermes-agent:latest` استفاده می‌کند؛ اگر به یک build عامل سفارشی نیاز دارید، آن را به‌صورت محلی تگ کنید و `image:` را در `compose.override.yml` خود بازنویسی کنید.

### استفاده از یک ایمیج پیش‌ساخته‌شده (Coolify / Easypanel / Dokploy / Unraid)

HermesChi را روی یک PaaS یا استک آزمایشگاه خانگی مستقر می‌کنید؟ ایمیج را مستقیماً از GitHub Container Registry بکشید:

```
ghcr.io/outsourc-e/hermeschi:latest
```

تگ‌های موجود:

| تگ | چیست |
|---|---|
| `latest` | آخرین commit `main` (پایدار؛ توصیه‌شده) |
| `v2.0.0` | تگ semver پین‌شده |
| `main-<sha>` | commit خاص |

پیکربندی حداقلی Coolify / Easypanel:

```yaml
service: hermeschi
image: ghcr.io/outsourc-e/hermeschi:latest
port: 3000
env:
  HERMES_API_URL: http://hermes-agent:8642   # به gateway خود نشانه کنید
  HERMES_API_TOKEN: ${API_SERVER_KEY}        # اگر احراز هویت gateway فعال است
```

ایمیج برای `linux/amd64` و `linux/arm64` ساخته می‌شود. آن را با یک کانتینر `nousresearch/hermes-agent:latest` (کاری که `docker-compose.yml` ما به‌طور پیش‌فرض انجام می‌دهد) یا با یک gateway موجود روی میزبان دیگر جفت کنید.

---

## 📱 نصب به‌عنوان اپلیکیشن (توصیه‌شده)

HermesChi یک **Progressive Web App (PWA)** است — آن را برای تجربهٔ کامل اپلیکیشن بومی، بدون مرورگر chrome، با میان‌برهای صفحه‌کلید و پشتیبانی آفلاین نصب کنید.

### 🖥️ دسکتاپ (macOS / Windows / Linux)

1. HermesChi را در **Chrome** یا **Edge** روی `http://localhost:3000` باز کنید
2. روی **آیکون نصب** (⊕) در نوار آدرس کلیک کنید
3. روی **Install** کلیک کنید — HermesChi به‌عنوان یک اپلیکیشن دسکتاپ مستقل باز می‌شود
4. برای دسترسی سریع به Dock / Taskbar سنجاق کنید

> **کاربران macOS:** پس از نصب، می‌توانید آن را به Launchpad خود نیز اضافه کنید.

### 📱 iPhone / iPad (iOS Safari)

1. HermesChi را در **Safari** روی iPhone خود باز کنید
2. روی دکمهٔ **Share** (□↑) ضربه بزنید
3. پایین بیایید و روی **«Add to Home Screen»** ضربه بزنید
4. روی **Add** ضربه بزنید — آیکون HermesChi روی صفحهٔ اصلی شما ظاهر می‌شود
5. برای تجربهٔ کامل اپلیکیشن بومی از صفحهٔ اصلی اجرا کنید

### 🤖 اندروید

1. HermesChi را در **Chrome** روی دستگاه اندروید خود باز کنید
2. روی **منوی سه‌نقطه** (⋮) ضربه بزنید → **«Add to Home screen»**
3. روی **Add** ضربه بزنید — HermesChi اکنون یک اپلیکیشن با حس بومی روی دستگاه شماست

---

## 📡 دسترسی موبایل از طریق Tailscale

از هر جا و روی هر دستگاهی به HermesChi دسترسی پیدا کنید — بدون port forwarding، بدون پیچیدگی VPN.

### راه‌اندازی

1. **Tailscale را نصب کنید** روی Mac و دستگاه موبایل خود:
   - Mac: [tailscale.com/download](https://tailscale.com/download)
   - iPhone/Android: «Tailscale» را در App Store / Play Store جست‌وجو کنید

2. **وارد شوید** به همان حساب Tailscale روی هر دو دستگاه

3. **IP تیل‌اسکیل Mac خود را پیدا کنید:**

   ```bash
   tailscale ip -4
   # خروجی نمونه: 100.x.x.x
   ```

4. **HermesChi را روی تلفن خود باز کنید:**

   ```
   http://100.x.x.x:3000
   ```

5. **به صفحهٔ اصلی اضافه کنید** با استفاده از مراحل بالا برای تجربهٔ کامل اپلیکیشن

> 💡 Tailscale روی هر شبکه‌ای کار می‌کند — وای‌فای خانگی، دادهٔ موبایل، حتی میان کشورها. ترافیک شما سرتاسری رمزنگاری‌شده باقی می‌ماند.

---

## 🖥️ اپلیکیشن دسکتاپ بومی

> **وضعیت: در حال توسعه** — یک اپلیکیشن دسکتاپ بومی مبتنی بر Electron در حال توسعهٔ فعال است.

اپلیکیشن دسکتاپ این امکانات را خواهد داشت:

- مدیریت پنجرهٔ بومی و آیکون سینی
- اعلان‌های سیستمی برای رویدادهای عامل و تکمیل مأموریت
- راه‌اندازی خودکار هنگام شروع سیستم
- یکپارچه‌سازی عمیق با OS (نوار منوی macOS، نوار وظیفهٔ ویندوز)

**در این فاصله:** HermesChi را به‌عنوان PWA نصب کنید (در بالا) برای یک تجربهٔ دسکتاپ نزدیک به بومی — به‌خوبی کار می‌کند.

---

## ☁️ راه‌اندازی ابری و میزبانی‌شده

> **وضعیت: به‌زودی**

یک نسخهٔ ابری کاملاً مدیریت‌شده از HermesChi در حال توسعه است:

- **استقرار یک‌کلیکی** — نیازی به خودمیزبانی نیست
- **همگام‌سازی چنددستگاهی** — از هر دستگاهی به عامل‌های خود دسترسی پیدا کنید
- **همکاری تیمی** — کنترل مأموریت مشترک برای کل تیم شما
- **به‌روزرسانی‌های خودکار** — همیشه روی آخرین نسخه

قابلیت‌های در انتظار زیرساخت ابری:

- همگام‌سازی نشست میان‌دستگاهی
- حافظه و فضاهای کاری مشترک تیمی
- backend میزبانی‌شدهٔ ابری با uptime مدیریت‌شده
- یکپارچه‌سازی‌های webhook و triggerهای خارجی

---

## 🔒 امنیت و متغیرهای env استقرار

محافظت‌های کلیدی — بیشترشان به‌طور پیش‌فرض فعال هستند؛ env vars زیر برای استقرارهای از راه دور / Docker است که از پیش‌فرض loopback صرف‌نظر می‌کنید.

### محافظت‌های داخلی

- middleware احراز هویت روی هر مسیر API
- هدرهای CSP از طریق متا تگ‌ها
- جلوگیری از پیمایش مسیر روی مسیرهای فایل/حافظه (بررسی مرز مسیر واقعی، نه پیشوند رشته‌ای)
- محدودیت نرخ روی endpointها
- محافظ fail-closed هنگام آغاز: بدون `HERMESCHI_PASSWORD` از اتصال به غیر loopback سر باز می‌زند
- کوکی‌های نشست: `HttpOnly` + `SameSite=Strict` + `Secure` (در production)
- محافظت اختیاری با رمز عبور برای رابط وب

### متغیرهای env برای استقرارهای از راه دور / Docker

- `HERMESCHI_PASSWORD` — هر زمان که `HOST ≠ 127.0.0.1` باشد الزامی است (`CLAUDE_PASSWORD` قدیمی همچنان به‌عنوان fallback پذیرفته می‌شود)
- `COOKIE_SECURE=1` — پرچم کوکی `Secure` را هنگام خاتمهٔ HTTPS در یک proxy اجباری کنید
- `COOKIE_SECURE=0` — پرچم `Secure` را برای استقرارهای LAN با HTTP ساده غیرفعال کنید (`HOST=0.0.0.0` بدون HTTPS)؛ بدون این، مرورگرها به‌طور خاموش کوکی‌های نشست را رد می‌کنند و ورود شکست می‌خورد (#149)
- `TRUST_PROXY=1` — به `x-forwarded-for` / `x-real-ip` اعتماد کنید (فقط پشت یک reverse proxy پاک‌سازی‌کننده تنظیم کنید)
- `HERMESCHI_DASHBOARD_TOKEN` — bearer صریح برای API داشبورد (بر fallback scrape HTML قدیمی ترجیح داده می‌شود)
- `HERMES_API_TOKEN` — bearer برای gateway عامل Hermes هنگام آغاز با `API_SERVER_KEY` (`CLAUDE_API_TOKEN` قدیمی همچنان پذیرفته می‌شود)
- `HERMES_ALLOW_INSECURE_REMOTE=1` — دور زدن محافظ fail-closed (توصیه نمی‌شود)

برای لیست کامل به `.env.example` مراجعه کنید. اعتبار به [@kiosvantra](https://github.com/kiosvantra) برای ممیزی امنیتی که #121–#125 را آشکار کرد.

---

## 🔧 عیب‌یابی

### «فضای کاری بارگذاری می‌شود اما چت کار نمی‌کند»

فضای کاری قابلیت‌های gateway شما را هنگام آغاز به‌طور خودکار تشخیص می‌دهد. ترمینال خود را برای خطی مانند این بررسی کنید:

```
[gateway] http://127.0.0.1:8642 available: health, models; missing: sessions, skills, memory, config, jobs
[gateway] Missing Hermes Agent APIs detected. Update hermes-agent to the latest version.
```

**راه‌حل:** به آخرین نسخهٔ استاندارد `hermes-agent` ارتقا دهید، که endpointهای توسعه‌یافته را همراه دارد:

```bash
cd ~/hermes-agent && git pull && uv pip install -e .
hermes gateway run
```

(اگر از مسیر متفاوتی نصب کرده‌اید، دستورات ارتقای نصب‌کنندهٔ Nous خود را دنبال کنید.) اگر روی فورک قدیمی `outsourc-e/hermes-agent` بودید، از نسخهٔ ۲ به بعد دیگر نیازی به آن نیست — آن را حذف کنید و به‌جای آن از upstream استفاده کنید.

### «اتصال رد شد» یا فضای کاری هنگام بارگذاری می‌خوابد

gateway عامل Hermes شما در حال اجرا نیست. آن را آغاز کنید:

```bash
hermes gateway run
```

اولین اجرا؟ ابتدا `hermes setup` را انجام دهید تا یک provider و مدل انتخاب کنید.

### Ollama: چت خالی برمی‌گرداند یا مدل «آفلاین» نشان می‌دهد

مطمئن شوید `~/.hermes/config.yaml` شما بخش `custom_providers` را دارد و `API_SERVER_ENABLED=true` در `~/.hermes/.env` است. به [مدل‌های محلی](#-مدل‌های-محلی-ollama-lm-studio-vllm) در بالا مراجعه کنید.

همچنین مطمئن شوید Ollama با CORS فعال در حال اجراست:

```bash
OLLAMA_ORIGINS=* ollama serve
```

از `http://127.0.0.1:11434/v1` (نه `localhost`) به‌عنوان URL پایه استفاده کنید.

راستی‌آزمایی: `curl http://localhost:8642/health` باید `{"status": "ok"}` برگرداند.

### «استفاده از upstream NousResearch/hermes-agent»

نسخهٔ ۲+ روی `hermes-agent` خام اجرا می‌شود. **بدون نیاز به فورک.** upstream هر endpointی را که فضای کاری برای چت، نشست‌ها، حافظه، مهارت‌ها، پیکربندی، کارها، MCP، ترمینال و نمایهٔ عامل نیاز دارد، همراه دارد.

**نکتهٔ Conductor:** وقتی API مأموریت داشبورد موجود است، فضای کاری مستقیماً از آن استفاده می‌کند. وقتی آن endpoint غایب است، فضای کاری از fallback Swarm بومی خود استفاده می‌کند و `mode: native-swarm` برمی‌گرداند. fallback از طریق کارگران Workspace Swarm ارسال می‌کند، وضعیت را از طریق `/api/conductor-spawn?missionId=...` در دسترس نگه می‌دارد و از طریق `/api/conductor-stop` لغو می‌کند.

اگر به نسخهٔ قدیمی‌تر `hermes-agent` پین شده‌اید و endpointهای اصلی غایب‌اند، فضای کاری به‌خوبی به **حالت قابل‌حمل** با چت پایه تقلیل می‌یابد — برای بازگرداندن قابلیت‌های کامل، upstream را ارتقا دهید.

### Docker: «Unauthorized» یا «Connection refused» به hermes-agent

اگر از Docker Compose استفاده می‌کنید و خطاهای احراز هویت دریافت می‌کنید:

1. **بررسی کنید حداقل یک کلید provider تنظیم شده:**

   ```bash
   grep -E '_API_KEY' .env
   # باید یکی از این‌ها را نشان دهد: OPENAI_API_KEY، OPENROUTER_API_KEY، GOOGLE_API_KEY یا کلید provider دیگری که عمداً استفاده می‌کنید.
   ```

   (hermes-agent هر کلیدی را که با provider پیکربندی‌شده در `~/.hermes/config.yaml` مطابقت داشته باشد می‌خواند.)

2. **لاگ‌های کانتینر عامل را ببینید:**

   ```bash
   docker compose logs hermes-agent
   ```

   به دنبال خطاهای آغاز یا هشدارهای کلید API غایب بگردید.

3. **endpoint سلامت عامل را راستی‌آزمایی کنید:**

   ```bash
   curl http://localhost:8642/health
   # باید برگرداند: {"status": "ok"}
   ```

4. **با کانتینرهای تازه راه‌اندازی مجدد کنید:**

   ```bash
   docker compose down
   docker compose up --build
   ```

5. **لاگ‌های فضای کاری را برای وضعیت gateway بررسی کنید:**
   ```bash
   docker compose logs hermeschi
   ```
   به دنبال: `[gateway] http://hermes-agent:8642 mode=...` — اگر `mode=disconnected` نشان داد، عامل درست اجرا نمی‌شود.

### Docker: مستندات قدیمی `claude webapi` اشتباه هستند

دستور `claude webapi` که در برخی مستندات پیش از تغییر نام ارجاع داده شده وجود ندارد. دستورات درست این‌ها هستند:

```bash
hermes gateway run    # gateway FastAPI روی :8642
hermes dashboard      # افزونهٔ داشبورد روی :9119 (نشست‌ها/مهارت‌ها/کارها/پیکربندی)
```

راه‌اندازی Docker هر دو را به‌طور خودکار اجرا می‌کند — در صورت استفاده از `docker compose up` نیازی به اقدام نیست.

---

## 🗺️ نقشه راه

### تحویل‌شده ✅

| قابلیت | کاری که می‌کند |
|---|---|
| چت + استریم SSE | خروجی زندهٔ عامل با نمایش فراخوانی ابزار |
| فایل‌ها + ترمینال | مرورگر کامل فایل فضای کاری + PTY چندسکویی |
| مرورگرهای حافظه + مهارت‌ها | ویرایش حافظه، مرور بیش از ۲٬۰۰۰ مهارت با بازارچه |
| داشبورد | نشست‌ها، ترکیب مدل، دفتر هزینه، کارت توجه |
| عملیات | مدیریت چندعاملی با شخصیت‌های preset |
| نمایهٔ عامل | پنل زندهٔ عامل در چت |
| حالت Swarm | استخر کارگر پشتیبان tmux پایدار با ارسال نقش |
| صفحهٔ MCP | کاتالوگ کامل + بازارچه + منابع |
| PWA موبایل + Tailscale | نصب به‌عنوان اپلیکیشن با حس بومی روی هر دستگاه |
| پوسته‌ها | Hermes / Nous / Bronze / Slate / Mono (روشن + تاریک) |
| دروازه‌های قابلیت | جایگزین‌های مؤدبانه برای «upstream آماده نیست» |
| چند provider | OpenAI/سازگار با OpenAI، OpenRouter، Google، Ollama، LM Studio، vLLM، Atomic Chat و سایر providerهای پشتیبانی‌شده توسط Hermes |

### در حال انجام 🔨

| قابلیت | وضعیت |
|---|---|
| مأموریت‌های Conductor | رابط کاربری فضای کاری تحویل شده؛ در صورت موجود بودن از API مأموریت داشبورد و در غیر این صورت از fallback Swarm بومی فضای کاری استفاده می‌کند (به [#262](https://github.com/outsourc-e/hermeschi/issues/262) مراجعه کنید) |
| اپلیکیشن دسکتاپ بومی (Electron) | مشخص‌شده؛ مسیر نصب PWA امروز کار می‌کند |

### به‌زودی 🔜

| قابلیت | وضعیت |
|---|---|
| نسخهٔ ابری / میزبانی‌شده | در انتظار زیرساخت |
| همکاری تیمی | در انتظار کار ابری + چندمستاجره |

---

## ⭐ تاریخچه ستاره

## [![Star History Chart](https://api.star-history.com/svg?repos=outsourc-e/hermeschi&type=date&logscale&legend=top-left)](https://www.star-history.com/#outsourc-e/hermeschi&type=date&logscale&legend=top-left)

## 💛 پشتیبانی از پروژه

HermesChi رایگان و متن‌باز است. اگر در حال ذخیرهٔ زمان شما و تأمین نیروی جریان کاری‌تان است، از پشتیبانی توسعه حمایت کنید:

**ETH:** `0xB332D4C60f6FBd94913e3Fd40d77e3FE901FAe22`

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-%E2%9D%A4-pink?logo=github)](https://github.com/sponsors/outsourc-e)

هر کمکی کمک می‌کند این پروژه را به‌ حرکت درآورد. سپاسگزاریم 🙏

---

## 🤝 مشارکت

از PRها استقبال می‌کنیم! برای راهنمایی به [CONTRIBUTING.md](CONTRIBUTING.md) مراجعه کنید.

- رفع باگ → مستقیماً یک PR باز کنید
- قابلیت‌های جدید → ابتدا یک issue برای بحث باز کنید
- مسائل امنیتی → برای افشای مسئولانه به [SECURITY.md](SECURITY.md) مراجعه کنید

---

## 📄 مجوز

MIT — برای جزئیات به [LICENSE](LICENSE) مراجعه کنید.

---

<div align="center">
  <sub>ساخته‌شده با ⚡ توسط <a href="https://github.com/outsourc-e">@outsourc-e</a> و جامعهٔ HermesChi</sub>
</div>
