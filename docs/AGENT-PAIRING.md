# راهنمای جفت‌سازی عامل — Workspace ↔ Hermes Agent

> **مخاطب:** عامل‌های هوش مصنوعی که به کاربران در راه‌اندازی HermesChi کمک می‌کنند.
> این مراحل را به‌ترتیب اجرا کنید. هر مرحله یک دستور راستی‌آزمایی دارد. جلو نپرید،
> و تا زمانی که دروازهٔ فعلی بررسی‌های زیر را شکست ندهد، دروازهٔ دومی شروع نکنید.

## معماری (نسخهٔ ۳۰ ثانیه‌ای)

```
┌─────────────────┐       HTTP :8642        ┌──────────────────┐
│  Claude Gateway  │◄──────────────────────►│ HermesChi │
│  (Python, FastAPI)│  /health, /v1/chat,   │  (Node, Vite)     │
│  hermes gateway   │  /api/sessions, etc.  │  pnpm dev         │
│  run              │                       │  port 3000        │
└─────────────────┘                        └──────────────────┘
```

Workspace از طریق HTTP با Hermes Agent صحبت می‌کند. بدون WebSocket. بدون جادو.

یک راه‌اندازی محلی کاملاً جفت‌شده دو سرویس دارد:

- `hermes gateway run` روی **:8642** برای گفتگو، مدل‌ها و استریم
- `hermes dashboard` روی **:9119** برای سشن‌ها، skills، پیکربندی و jobs

اگر `curl http://127.0.0.1:8642/health` و `curl http://127.0.0.1:9119/` هر دو
با موفقیت بازگردند، می‌توانند جفت شوند.

---

## مرحلهٔ ۱ — آیا hermes-agent نصب شده است؟

```bash
hermes --version
```

**گذر:** `Hermes Agent vX.Y.Z` را چاپ می‌کند.
**شکست:** `command not found`.

### رفع (اگر hermes-agent نصب نیست)

```bash
# نصب‌کنندهٔ رسمی Nous — روی macOS، Linux، WSL کار می‌کند
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

پس از نصب، shell خود را restart کنید یا اجرا کنید:
```bash
export PATH="$HOME/.local/bin:$PATH"
hermes --version
```

---

## مرحلهٔ ۲ — آیا سرور API فعال است؟

دروازه یک HTTP API روی پورت 8642 ارائه می‌دهد، اما فقط در صورتی که `API_SERVER_ENABLED=true`
در فایل env هرمس تنظیم شده باشد.

```bash
# یافتن فایل env
HERMES_ENV="$(hermes config env-path 2>/dev/null || echo "$HOME/.hermes/.env")"
echo "Hermes env file: $HERMES_ENV"

# بررسی کلید
grep -i "API_SERVER" "$HERMES_ENV" 2>/dev/null || echo "NO API_SERVER KEYS FOUND"
```

**گذر:** خروجی شامل `API_SERVER_ENABLED=true` (با underscore) است.

**شکست رایج — نام متغیرهای محیطی اشتباه:**
```
# ❌ اشتباه (بدون underscore — دروازه این‌ها را به‌صورت خاموش نادیده می‌گیرد)
APISERVERENABLED=true
APISERVERHOST=0.0.0.0

# ✅ درست
API_SERVER_ENABLED=true
API_SERVER_HOST=127.0.0.1
```

> **بحرانی:** نام متغیرهای محیطی باید underscore داشته باشند. `APISERVERENABLED` ≠
> `API_SERVER_ENABLED`. دروازه نام‌های دقیق را از طریق `os.getenv()` می‌خواند.
> اشتباهات تایپی به‌صورت خاموش نادیده گرفته می‌شوند — بدون هشدار، بدون خطا، فقط بدون سرور API.

### رفع

```bash
HERMES_ENV="$(hermes config env-path 2>/dev/null || echo "$HOME/.hermes/.env")"
mkdir -p "$(dirname "$HERMES_ENV")"

# ابتدا نسخه‌های دارای اشتباه تایپی را حذف کنید
sed -i.bak '/^APISERVERENABLED/d; /^APISERVERHOST/d; /^APISERVERKEY/d; /^APISERVERPORT/d' "$HERMES_ENV" 2>/dev/null || true

# نوشتن کلیدهای صحیح (idempotent — موجود را به‌روز می‌کند یا اضافه می‌کند)
grep -q '^API_SERVER_ENABLED=' "$HERMES_ENV" 2>/dev/null && \
  sed -i.bak 's/^API_SERVER_ENABLED=.*/API_SERVER_ENABLED=true/' "$HERMES_ENV" || \
  echo 'API_SERVER_ENABLED=true' >> "$HERMES_ENV"
```

**`API_SERVER_HOST=0.0.0.0` را تنظیم نکنید** مگر آنکه کاربر صریحاً دسترسی شبکه‌ای بخواهد
و `API_SERVER_KEY=<some-secret>` را تنظیم کند. دروازه بدون کلید از bind غیر loopback
امتناع می‌کند (شکست خاموش). پیش‌فرض `127.0.0.1` برای Workspace محلی درست است.

---

## مرحلهٔ ۳ — آیا فرآیند دروازه در حال اجراست؟

```bash
pgrep -af "hermes.*gateway" || echo "NOT RUNNING"
```

**گذر:** یک فرآیند `hermes gateway run` (یا مشابه) را نشان می‌دهد.
**شکست:** هیچ‌چیز.

### رفع

```bash
# شروع در foreground (برای debug توصیه می‌شود — همهٔ خروجی را می‌بینید)
hermes gateway run

# یا اگر از systemd استفاده می‌کنید
hermes gateway install   # سرویس را ایجاد می‌کند
systemctl --user start claude-gateway
```

**اجرای نخست:** هرمس ممکن است برای راه‌اندازی اولیه (provider، model) درخواست کند. راه‌اندازی
تعاملی را پیش از ادامه تکمیل کنید.

---

## مرحلهٔ ۴ — آیا پورت 8642 bind شده است؟

```bash
# Linux / WSL
ss -tlnp | grep 8642 || echo "PORT NOT BOUND"

# macOS
lsof -iTCP:8642 -sTCP:LISTEN || echo "PORT NOT BOUND"

# fallback عمومی
curl -sf http://127.0.0.1:8642/health && echo "OK" || echo "NOT REACHABLE"
```

**گذر:** پورت bind شده است و `curl /health` برمی‌گرداند `{"status": "ok", "platform": "hermes-agent"}`.

**شکست — دروازه در حال اجرا اما پورت bind نشده:** سرور API شروع نشده است.
به مرحلهٔ ۲ برگردید و راستی‌آزمایی کنید متغیرهای محیطی underscore دارند.

**شکست — پورت توسط چیز دیگری bind شده:**
```bash
# یافتن آنچه روی پورت است
lsof -i :8642   # macOS
ss -tlnp | grep 8642   # Linux
# فرآیند stale را ببندید، سپس دروازه را restart کنید
```

## مرحلهٔ ۴b — آیا داشبورد روی 9119 اجرا می‌شود؟

```bash
curl -sf http://127.0.0.1:9119/ && echo "DASHBOARD OK" || echo "DASHBOARD NOT REACHABLE"
```

**گذر:** HTTP 200 برمی‌گرداند (HTML یا JSON قابل‌قبول است).

### رفع

```bash
hermes dashboard
```

---

## مرحلهٔ ۵ — آیا Workspace به دروازه اشاره می‌کند؟

```bash
# در دایرکتوری hermeschi
cat .env | grep HERMES_API_URL
```

**گذر:** `HERMES_API_URL=http://127.0.0.1:8642`

همچنین URL داشبورد را تنظیم کنید:

```bash
grep HERMESCHI_DASHBOARD_URL .env
```

**گذر:** `HERMESCHI_DASHBOARD_URL=http://127.0.0.1:9119`

**شکست یا غایب:**
```bash
# در دایرکتوری hermeschi
echo 'HERMES_API_URL=http://127.0.0.1:8642' >> .env
echo 'HERMESCHI_DASHBOARD_URL=http://127.0.0.1:9119' >> .env
```

اگر `.env` وجود ندارد:
```bash
cp .env.example .env
# سپس HERMES_API_URL را به‌صورت بالا تنظیم کنید
```

---

## مرحلهٔ ۶ — شروع Workspace و راستی‌آزمایی جفت‌سازی

```bash
cd ~/hermeschi   # یا هر کجا نصب شده است
pnpm dev
```

**در خروجی راه‌اندازی به دنبال این باشید:**
```
[claude-api] Configured API: http://127.0.0.1:8642
[gateway] gateway=http://127.0.0.1:8642 ... mode=enhanced-fork core=[health, chatCompletions, models, streaming]
```

**`mode=enhanced-fork`** = جفت‌سازی موفق. سشن‌ها، memory، skills همگی
در دسترس هستند.

### راستی‌آزمایی بحرانی پیش از شروع یک دروازهٔ دیگر

```bash
curl -sf http://127.0.0.1:8642/health
curl -sf http://127.0.0.1:3000/api/sessions | jq '.sessions | length' 2>/dev/null || curl -sf http://127.0.0.1:3000/api/sessions
```

اگر `/api/sessions` سشن‌ها (یا یک آرایهٔ خالی) را برمی‌گرداند، جفت‌سازی زنده است.
**صرفاً به‌خاطر اینکه رابط کاربری همچنان Offline می‌گوید، دروازهٔ دیگری شروع نکنید** —
ابتدا رابط کاربری workspace را refresh یا reprobe کنید.

**`mode=disconnected`** = جفت‌سازی شکست خورد. به مرحلهٔ ۴ برگردید.

---

## مرحلهٔ ۷ — راستی‌آزمایی در مرورگر

`http://localhost:3000` را باز کنید (یا هر پورتی که Vite گزارش می‌کند).

- **رابط کاربری کامل با گفتگو** = موفقیت.
- **صفحهٔ onboarding «Connect Backend» / «Skip setup»** = دروازه از سرور SSR Vite
  قابل‌دسترس نیست. مراحل ۴–۵ را دوباره بررسی کنید.
- **خطای ۵۰۰ / صفحهٔ خالی** = مسئلهٔ build Vite، نه مسئلهٔ جفت‌سازی.
  ترمینال را برای خطاهای build بررسی کنید.

---

## برگه تقلب رفع سریع (بلاک copy-paste)

برای کاربرانی که فقط می‌خواهند کار کند — این بلاک کامل را اجرا کنید:

```bash
# 1. یافتن env هرمس
HERMES_ENV="$(hermes config env-path 2>/dev/null || echo "$HOME/.hermes/.env")"
mkdir -p "$(dirname "$HERMES_ENV")"

# 2. فعال‌سازی سرور API (idempotent)
grep -q '^API_SERVER_ENABLED=' "$HERMES_ENV" 2>/dev/null && \
  sed -i.bak 's/^API_SERVER_ENABLED=.*/API_SERVER_ENABLED=true/' "$HERMES_ENV" || \
  echo 'API_SERVER_ENABLED=true' >> "$HERMES_ENV"

# 3. پاک‌سازی اشتباهات تایپی رایج
sed -i.bak '/^APISERVERENABLED/d; /^APISERVERHOST/d' "$CLAUDE_ENV" 2>/dev/null || true

# 4. restart دروازه
hermes gateway stop 2>/dev/null; sleep 2; hermes gateway run &
sleep 8

# 5. راستی‌آزمایی
curl -sf http://127.0.0.1:8642/health && echo "✅ Gateway API is up" || echo "❌ Gateway API not reachable"

# 6. تنظیم env workspace
cd ~/hermeschi 2>/dev/null || cd "$(find ~ -maxdepth 2 -name hermeschi -type d | head -1)"
grep -q '^HERMES_API_URL=' .env 2>/dev/null && \
  sed -i.bak 's|^HERMES_API_URL=.*|HERMES_API_URL=http://127.0.0.1:8642|' .env || \
  echo 'HERMES_API_URL=http://127.0.0.1:8642' >> .env

echo "✅ Done. Run: pnpm dev"
```

---

## یادداشت‌های خاص پلتفرم

### WSL (Windows Subsystem for Linux)

- cold-start Python روی WSL به‌دلیل overhead I/O فایل‌سیستم کندتر است.
  ممکن است دروازه ۱۰–۱۵ ثانیه طول بکشد تا پورت 8642 را bind کند.
- اگر بررسی سلامت Workspace پیش از آماده‌شدن دروازه timeout شود،
  ابتدا دروازه را جداگانه شروع کنید (`hermes gateway run`)، منتظر بمانید تا
  پورت bind شود، سپس Workspace را در یک ترمینال دوم شروع کنید.
- از `127.0.0.1` استفاده کنید، نه `localhost` — WSL2 گاهی `localhost` را
  به‌جای VM کنونی WSL، به host ویندوز تفکیک می‌کند.

### macOS

- ملاحظات خاصی ندارد. راه‌اندازی پیش‌فرض کار می‌کند.
- اگر از Python هوم‌برو استفاده می‌کنید، مطمئن شوید `claude` روی PATH است:
  `export PATH="$HOME/.local/bin:$PATH"`

### Linux (بومی)

- کاربران systemd: `hermes gateway install` یک سرویس کاربر ایجاد می‌کند.
  وضعیت را با `systemctl --user status claude-gateway` بررسی کنید.
- اگر از `$HOME` متفاوتی برای سرویس systemd استفاده می‌کنید (مثلاً اجرا به‌عنوان
  کاربر متفاوت)، مکان فایل `.env` تغییر می‌کند. از
  `claude config env-path` برای یافتن آن استفاده کنید.

---

## هنوز خراب است؟

این بستهٔ تشخیصی را جمع‌آوری و به اشتراک بگذارید:

```bash
echo "=== claude version ===" && claude --version 2>&1
echo "=== claude env path ===" && claude config env-path 2>&1
echo "=== claude env (redacted) ===" && grep -E "^(API_SERVER|CLAUDE_)" "$(claude config env-path 2>/dev/null || echo ~/.hermes/.env)" 2>&1
echo "=== gateway process ===" && pgrep -af "claude.*gateway" 2>&1 || echo "not running"
echo "=== port 8642 ===" && (ss -tlnp 2>/dev/null || lsof -iTCP:8642 -sTCP:LISTEN 2>/dev/null) | grep 8642 || echo "not bound"
echo "=== health check ===" && curl -sf http://127.0.0.1:8642/health 2>&1 || echo "not reachable"
echo "=== workspace .env ===" && grep CLAUDE ~/hermeschi/.env 2>&1 || echo "no .env"
echo "=== OS ===" && uname -a
echo "=== Node ===" && node --version
echo "=== Python ===" && python3 --version 2>&1
```

این به هر انسان یا عاملی زمینهٔ کافی می‌دهد تا مسئله را در یک خواندن تشخیص دهد.
