# راهنمای راه‌اندازی ویندوز — HermesChi

آخرین به‌روزرسانی: ۲۰۲۶-۰۵-۲۸

## معماری

سه سرویس، سه فایل پیکربندی:

| سرویس | پورت | فایل پیکربندی |
|---|---|---|
| دروازهٔ Hermes Agent | ۸۶۴۲ | `C:\Users\<you>\AppData\Local\hermes\.env` |
| ابزارهای CLI Hermes | — | `C:\Users\<you>\.hermes\.env` |
| داشبورد Workspace | ۳۰۰۰ | `C:\Users\<you>\hermeschi\.env` |

## محتوای مورد نیاز .env

### `AppData\Local\hermes\.env` (دروازه)
```
OPENROUTER_API_KEY=<your-key>
OPENROUTER_API_KEY_1=<your-key-2>
OPENROUTER_API_KEY_2=<your-key-3>
API_SERVER_ENABLED=true
API_SERVER_HOST=0.0.0.0
API_SERVER_KEY=<generate-a-random-hex-string>
```

### `~/.hermes\.env` (ابزارهای CLI)
مانند بالا — همان کلیدها، همان API_SERVER_KEY.

### `hermeschi\.env` (داشبورد)
```
OPENROUTER_API_KEY=<your-key>
HERMES_API_URL=http://127.0.0.1:8642
HERMESCHI_DASHBOARD_URL=http://127.0.0.1:9119
HERMES_API_TOKEN=<must-match-API_SERVER_KEY-above>
PORT=3000
HOST=127.0.0.1
```

**بحرانی:** `HERMES_API_TOKEN` باید دقیقاً با `API_SERVER_KEY` برابر باشد.

## پیش‌نیازها (ویندوز)

```powershell
# 1. sqlite3 CLI (برای kanban/tasks)
winget install SQLite.SQLite --accept-package-agreements --accept-source-agreements
# سپس sqlite3.exe را در یک دایرکتوری PATH از Git Bash کپی کنید:
# منبع: C:\Users\<you>\AppData\Local\Microsoft\WinGet\Packages\SQLite.SQLite_...\sqlite3.exe
# مقصد:   C:\Users\<you>\bin\sqlite3.exe

# 2. Claude CLI (برای Claude Tasks / Conductor)
npm install -g @anthropic-ai/claude-code

# 3. pnpm (اگر نصب نیست)
npm install -g pnpm
```

## توالی راه‌اندازی

```bash
# ترمینال ۱ — دروازه
hermes gateway run

# منتظر بمانید تا: "Uvicorn running on http://127.0.0.1:8642"

# ترمینال ۲ — داشبورد
cd C:\Users\<you>\hermeschi
pnpm dev

# باز کنید http://127.0.0.1:3000
```

## رفع تعارض پورت

```powershell
# یافتن آنچه پورت را در دست دارد
netstat -ano | findstr :8642
netstat -ano | findstr :3000

# پایان دادن به آن
Stop-Process -Id <PID> -Force
```

## نصب PWA

۱. `http://127.0.0.1:3000` را در Chrome یا Edge باز کنید
۲. آیکون نصب (⊕) را در نوار آدرس کلیک کنید
۳. پنجرهٔ اختصاصی + آیکون taskbar دریافت می‌کند

**یادداشت:** PWA فقط زمانی کار می‌کند که `pnpm dev` در حال اجرا باشد.

## خطاهای رایج

| خطا | رفع |
|---|---|
| `API_SERVER_KEY is required` | `API_SERVER_KEY=<value>` را به `AppData\Local\hermes\.env` اضافه کنید |
| `spawnSync sqlite3 ENOENT` | sqlite3 را از طریق winget نصب کنید، exe را در PATH کپی کنید |
| `which: no claude in` | `npm install -g @anthropic-ai/claude-code` |
| `Port 3000 already in use` | فرآیند stale را از طریق `netstat -ano` + `Stop-Process` ببندید |
| `Slack invalid_auth` | در صورت عدم پیکربندی Slack مورد انتظار است — نادیده بگیرید |
| داشبورد "not available on this backend" را نشان می‌دهد | سرور API دروازه اجرا نمی‌شود یا HERMES_API_TOKEN ناهماهنگ است |

## مرجع مکان فایل‌ها

| چیست | مسیر |
|---|---|
| env دروازه | `C:\Users\<you>\AppData\Local\hermes\.env` |
| env CLI | `C:\Users\<you>\.hermes\.env` |
| env Workspace | `C:\Users\<you>\hermeschi\.env` |
| DB Kanban | `C:\Users\<you>\AppData\Local\hermes\kanban.db` |
| کد دروازه | `C:\Users\<you>\AppData\Local\hermes\hermes-agent\` |
| کد Workspace | `C:\Users\<you>\hermeschi\` |
| skillهای سفارشی | `C:\Users\<you>\AppData\Local\hermes\skills\` |
| پیکربندی Hermes | `C:\Users\<you>\.hermes\config.yaml` |
