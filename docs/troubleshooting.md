<div dir="rtl">

# عیب‌یابی — HermesChi

مشکل‌های رایج راه‌اندازی و راه‌حل آن‌ها.

---

## ۱. دروازه شروع می‌شود ولی سرور API هرگز bind نمی‌شود (پورت 8642 در حال گوش‌دادن نیست)

**علامت:** به‌نظر می‌رسد `hermes gateway run` شروع می‌شود، ولی `curl http://127.0.0.1:8642/health` شکست می‌خورد و `ss -tlnp | grep 8642` هیچ چیزی نشان نمی‌دهد.

**علت:** `API_SERVER_ENABLED` تنظیم نشده، یا با نام اشتباهِ متغیر محیطی تنظیم شده.

**راه‌حل:**

```bash
# پیدا کردن فایل env هرمس
hermes config env-path
# معمولاً: ~/.hermes/.env

# بررسی کلید
grep -i API_SERVER ~/.hermes/.env
```

نام متغیر محیطی باید **دقیقاً** `API_SERVER_ENABLED=true` باشد (با underscore). اشتباه‌های رایج:

| اشتباه | درست |
|---|---|
| `APISERVERENABLED=true` | `API_SERVER_ENABLED=true` |
| `APISERVERHOST=0.0.0.0` | `API_SERVER_HOST=127.0.0.1` |
| `ApiServerEnabled=true` | `API_SERVER_ENABLED=true` |

بعد از رفع، دروازه را دوباره راه‌اندازی کنید: `hermes gateway run --replace`

**نکتهٔ دیگر:** تنظیم `API_SERVER_HOST=0.0.0.0` بدون `API_SERVER_KEY` باعث می‌شود دروازه بی‌صدا شکست بخورد. برای دسترسی محلی از `127.0.0.1` استفاده کنید، یا برای دسترسی شبکه‌ای یک کلید تنظیم کنید.

---

## ۲. فضای کار صفحهٔ «Connect Backend» / «Skip setup» را نشان می‌دهد (mode=disconnected)

**علامت:** مرورگر به‌جای رابط گفتگو، صفحهٔ onboarding را نشان می‌دهد. لاگ‌های dev server مقدار `mode=disconnected` را گزارش می‌کنند.

**علت:** فضای کار نمی‌تواند به HTTP API دروازه برسد.

**چک‌لیست (به‌ترتیب):**

۱. آیا دروازه در حال اجراست؟ `hermes gateway status` یا `pgrep -af "hermes.*gateway"`
۲. آیا پورت 8642 bind شده؟ `curl -sf http://127.0.0.1:8642/health`
۳. آیا `.env` فضای کار درست تنظیم شده؟ `grep HERMES_API_URL ~/hermeschi/.env`
   - باید این باشد: `HERMES_API_URL=http://127.0.0.1:8642`
۴. فضای کار را دوباره راه‌اندازی کنید: `pnpm dev`

اگر دروازه در حال اجرا و سالم است ولی فضای کار هنوز قطع است، تداخل پورت (فرآیند دیگری روی 8642) یا قوانین firewall را بررسی کنید.

قبل از راه‌اندازی یک دروازهٔ دوم، probe مستقیم فضای کار را راستی‌آزمایی کنید:

```bash
curl http://127.0.0.1:3000/api/sessions
```

اگر نشست‌ها (یا یک آرایهٔ خالی) برگرداند، یعنی اتصال بک‌اند همین حالا هم زنده است و رابط کاربری فقط نیاز به refresh/reprobe دارد — **دروازهٔ دیگری راه‌اندازی نکنید**.

---

## ۳. پورت 8642 در حال حاضر در استفاده است

**علامت:** دروازه با خطای «Address already in use» شکست می‌خورد یا بی‌صدا خارج می‌شود.

**راه‌حل:**

```bash
# پیدا کردن فرآیندی که پورت را اشغال کرده
lsof -i :8642    # macOS
ss -tlnp | grep 8642   # Linux

# بستن فرآیند stale
kill <PID>

# راه‌اندازی مجدد
hermes gateway run --replace
```

---

## ۴. داشبورد در حال اجرا نیست (نشست‌ها / skills / jobs غایب‌اند)

**علامت:** گفتگو کار می‌کند، ولی Sessions/Skills/Jobs آفلاین می‌مانند یا `/api/sessions` می‌گوید بک‌اند از API نشست‌ها پشتیبانی نمی‌کند.

**علت:** `hermes dashboard` روی پورت 9119 در حال اجرا نیست.

**راه‌حل:**

```bash
hermes dashboard
curl -sf http://127.0.0.1:9119/ && echo "dashboard ok"
```

فضای کار به هر دو نیاز دارد:

- `hermes gateway run` روی `:8642`
- `hermes dashboard` روی `:9119`

---

## ۵. شکست گفتگوی Codex / GPT-5.4 به‌خاطر access token گمشده

**علامت:** ارسال گفتگو از طریق فضای کار با خطایی مثل `Codex auth is missing access_token` شکست می‌خورد.

**علت:** مدل پیش‌فرض `gpt-5.4` / `openai-codex` است، ولی login محلی Codex CLI یا قدیمی شده یا اصلاً وجود ندارد.

**راه‌حل:**

```bash
codex login
```

بعد دوباره گفتگو را امتحان کنید. دروازه را فقط زمانی restart کنید که احراز هویت پس از login مجدد باز هم شکست بخورد.

---

## ۶. WSL: بررسی سلامت دروازه در بوت اول timeout می‌شود

**علامت:** فضای کار شروع می‌شود، دروازه را بررسی می‌کند، و «disconnected» گزارش می‌دهد. ولی اگر ۱۵ ثانیه صبر کنید و صفحه را رفرش کنید، درست کار می‌کند.

**علت:** cold-start پایتون روی WSL به‌خاطر overhead فایل‌سیستم کندتر است (۸ تا ۱۵ ثانیه). بررسی سلامت فضای کار قبل از آماده‌شدن دروازه timeout می‌شود.

**راه‌حل:** در دو ترمینال جداگانه شروع کنید:

```bash
# ترمینال ۱ — اول دروازه را شروع کنید و منتظر بمانید
hermes gateway run
# صبر کنید تا پیام "Uvicorn running on http://127.0.0.1:8642" را ببینید

# ترمینال ۲ — بعد فضای کار را شروع کنید
cd ~/hermeschi && pnpm dev
```

---

## ۷. dev server بلافاصله پس از بوت crash می‌کند

**علامت:** `pnpm dev` شروع می‌شود، بنر Vite را نشان می‌دهد، بعد با ELIFECYCLE یا یک stack trace از کار می‌افتد.

**علل رایج:**

- **علامت‌های تداخل merge در فایل‌های سورس:** `grep -r "<<<<<<" src/` — اگر چیزی پیدا کردید، رفعشان کنید یا `git checkout -- <file>` بزنید.
- **`node_modules` گمشده:** `pnpm install`
- **نسخهٔ Node خیلی قدیمی:** `node --version` — به Node 22+ نیاز دارید.
- **پورت در حال حاضر در استفاده است:** `lsof -i :3000` (macOS) یا `ss -tlnp | grep 3000` (Linux) — فرآیند stale را ببندید.

---

## ۸. پیام «No compatible backend detected» در onboarding

**علامت:** روی «Connect Backend» کلیک شده، بررسی سلامت اجرا می‌شود و خطا را نشان می‌دهد.

این یعنی سرور SSR Vite `GET /api/gateway-status` را امتحان کرده که به‌صورت داخلی دروازه را probe می‌کند. probe شکست خورده است.

**محتمل‌ترین علت:** سرور API دروازه در حال اجرا نیست. به مسئلهٔ #۱ بالا مراجعه کنید.

**کمتر محتمل:** `.env` مقدار `HERMES_API_URL` اشتباهی دارد (مثلاً پورت اشتباه، `https` به‌جای `http`، یا `localhost` به‌جای `127.0.0.1` روی WSL).

---

## بستهٔ تشخیصی

اگر هیچ‌کدام از موارد بالا کمک نکرد، این دستور را اجرا کنید و خروجی را به اشتراک بگذارید:

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

</div>
