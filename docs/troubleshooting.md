# عیب‌یابی — HermesChi

مسائل رایج راه‌اندازی و نحوهٔ رفع آن‌ها.

---

## ۱. دروازه شروع می‌شود اما سرور API هرگز bind نمی‌شود (پورت 8642 در حال گوش‌دادن نیست)

**علامت:** به‌نظر می‌رسد `hermes gateway run` شروع می‌شود، اما `curl http://127.0.0.1:8642/health` شکست می‌خورد. `ss -tlnp | grep 8642` چیزی نشان نمی‌دهد.

**علت:** `API_SERVER_ENABLED` تنظیم نشده است — یا با نام متغیر محیطی اشتباه تنظیم شده است.

**رفع:**

```bash
# یافتن فایل env هرمس شما
hermes config env-path
# معمولاً: ~/.hermes/.env

# بررسی کلید
grep -i API_SERVER ~/.hermes/.env
```

متغیر محیطی باید **دقیقاً** `API_SERVER_ENABLED=true` باشد — با underscore. اشتباهات رایج:

| اشتباه | درست |
|---|---|
| `APISERVERENABLED=true` | `API_SERVER_ENABLED=true` |
| `APISERVERHOST=0.0.0.0` | `API_SERVER_HOST=127.0.0.1` |
| `ApiServerEnabled=true` | `API_SERVER_ENABLED=true` |

پس از رفع، دروازه را راه‌اندازی مجدد کنید: `hermes gateway run --replace`

**همچنین:** تنظیم `API_SERVER_HOST=0.0.0.0` بدون `API_SERVER_KEY` باعث امتناع خاموش می‌شود. برای دسترسی محلی از `127.0.0.1` استفاده کنید، یا برای دسترسی شبکه‌ای یک کلید تنظیم کنید.

---

## ۲. workspace «Connect Backend» / «Skip setup» را نشان می‌دهد (mode=disconnected)

**علامت:** مرورگر به‌جای رابط کاربری گفتگو، صفحهٔ خوش‌آمدگویی onboarding را نشان می‌دهد. لاگ‌های dev server `mode=disconnected` را نشان می‌دهند.

**علت:** workspace نمی‌تواند به HTTP API دروازه برسد.

**چک‌لیست (به‌ترتیب):**

۱. آیا دروازه در حال اجراست؟ `hermes gateway status` یا `pgrep -af "hermes.*gateway"`
۲. آیا پورت 8642 bind شده است؟ `curl -sf http://127.0.0.1:8642/health`
۳. آیا `.env` workspace درست است؟ `grep HERMES_API_URL ~/hermeschi/.env`
   - باید باشد: `HERMES_API_URL=http://127.0.0.1:8642`
۴. workspace را راه‌اندازی مجدد کنید: `pnpm dev`

اگر دروازه در حال اجرا و سالم است اما workspace همچنان قطع است، تعارض پورت (فرآیند دیگری روی 8642) یا قوانین firewall را بررسی کنید.

پیش از شروع یک دروازهٔ دوم، probe مستقیم workspace را راستی‌آزمایی کنید:

```bash
curl http://127.0.0.1:3000/api/sessions
```

اگر این سشن‌ها را (یا یک فهرست خالی) برمی‌گرداند، pairing بک‌اند هم‌اکنون زنده است و رابط کاربری به refresh/reprobe نیاز دارد — **دروازهٔ دیگری شروع نکنید**.

---

## ۳. پورت 8642 هم‌اکنون در حال استفاده است

**علامت:** دروازه با «Address already in use» شکست می‌خورد یا به‌صورت خاموش خارج می‌شود.

**رفع:**

```bash
# یافتن آنچه پورت را در دست دارد
lsof -i :8642    # macOS
ss -tlnp | grep 8642   # Linux

# پایان دادن به فرآیند stale
kill <PID>

# راه‌اندازی مجدد
hermes gateway run --replace
```

---

## ۴. داشبورد در حال اجرا نیست (سشن‌ها / skills / jobs غایب)

**علامت:** گفتگو کار می‌کند، اما Sessions/Skills/Jobs آفلاین می‌مانند یا `/api/sessions` می‌گوید بک‌اند از API سشن‌ها پشتیبانی نمی‌کند.

**علت:** `hermes dashboard` روی پورت 9119 اجرا نمی‌شود.

**رفع:**

```bash
hermes dashboard
curl -sf http://127.0.0.1:9119/ && echo "dashboard ok"
```

workspace به هر دو نیاز دارد:

- `hermes gateway run` روی `:8642`
- `hermes dashboard` روی `:9119`

---

## ۵. شکست گفتگوی Codex / GPT-5.4 با access token گمشده

**علامت:** ارسال گفتگو از طریق workspace با خطایی مانند `Codex auth is missing access_token` شکست می‌خورد.

**علت:** مدل پیش‌فرض `gpt-5.4` / `openai-codex` است، اما login محلی Codex CLI stale یا غایب است.

**رفع:**

```bash
codex login
```

سپس گفتگو را دوباره امتحان کنید. دروازه را راه‌اندازی مجدد نکنید مگر آنکه auth پس از login مجدد همچنان شکست بخورد.

---

## ۶. WSL: بررسی سلامت دروازه در بوت نخست timeout می‌شود

**علامت:** workspace شروع می‌شود، دروازه را بررسی می‌کند، «disconnected» را گزارش می‌دهد. اما اگر ۱۵ ثانیه صبر کنید و refresh کنید، کار می‌کند.

**علت:** cold-start Python روی WSL به‌دلیل overhead فایل‌سیستم کندتر است (۸-۱۵s). بررسی سلامت workspace پیش از آماده‌شدن دروازه timeout می‌شود.

**رفع:** در دو ترمینال جداگانه شروع کنید:

```bash
# ترمینال ۱ — ابتدا دروازه را شروع کنید، منتظر بمانید
hermes gateway run
# منتظر بمانید تا "Uvicorn running on http://127.0.0.1:8642" را ببینید

# ترمینال ۲ — سپس workspace را شروع کنید
cd ~/hermeschi && pnpm dev
```

---

## ۷. dev server بلافاصله پس از بوت crash می‌شود

**علامت:** `pnpm dev` شروع می‌شود، بنر Vite را نشان می‌دهد، سپس با ELIFECYCLE یا یک stack trace crash می‌کند.

**علل رایج:**

- **علامگرهای تعارض merge در فایل‌های سورس:** `grep -r "<<<<<<" src/` — اگر چیزی یافتید، آن‌ها را رفع کنید یا `git checkout -- <file>`.
- **node_modules گمشده:** `pnpm install`
- **نسخهٔ Node خیلی قدیمی:** `node --version` — به Node 22+ نیاز دارد.
- **پورت هم‌اکنون در حال استفاده:** `lsof -i :3000` (macOS) یا `ss -tlnp | grep 3000` (Linux) — فرآیند stale را ببندید.

---

## ۸. «No compatible backend detected» در onboarding

**علامت:** روی «Connect Backend» کلیک شده، بررسی سلامت اجرا می‌شود، خطا را نشان می‌دهد.

این یعنی سرور SSR Vite `GET /api/gateway-status` را امتحان کرده که به‌طور داخلی دروازه را probe می‌کند. probe شکست خورده است.

**محتمل‌ترین:** سرور API دروازه در حال اجرا نیست. به مسئلهٔ #۱ بالا مراجعه کنید.

**کم‌تر محتمل:** `.env` دارای `HERMES_API_URL` اشتباه است (مثلاً پورت اشتباه، `https` به‌جای `http`، `localhost` به‌جای `127.0.0.1` روی WSL).

---

## بستهٔ تشخیصی

اگر هیچ‌کدام از موارد بالا کمکی نکرد، این را اجرا کنید و خروجی را به اشتراک بگذارید:

```bash
echo "=== hermes version ===" && hermes --version 2>&1
echo "=== hermes env path ===" && hermes config env-path 2>&1
echo "=== hermes env (redacted) ===" && grep -E "^(API_SERVER|HERMES_|CLAUDE_)" "$(hermes config env-path 2>/dev/null || echo ~/.hermes/.env)" 2>&1
echo "=== gateway process ===" && pgrep -af "hermes.*gateway" 2>&1 || echo "not running"
echo "=== port 8642 ===" && (ss -tlnp 2>/dev/null || lsof -iTCP:8642 -sTCP:LISTEN 2>/dev/null) | grep 8642 || echo "not bound"
echo "=== health check ===" && curl -sf http://127.0.0.1:8642/health 2>&1 || echo "not reachable"
echo "=== workspace .env ===" && grep CLAUDE ~/hermeschi/.env 2>&1 || echo "no .env"
echo "=== OS ===" && uname -a
echo "=== Node ===" && node --version
echo "=== Python ===" && python3 --version 2>&1
```
