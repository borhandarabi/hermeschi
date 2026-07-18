# اجرای HermesChi به‌عنوان سرویس کاربر

HermesChi می‌تواند بدون باز نگه‌داشتن ترمینال اجرا شود. راهنمای زیر یک سرویس **در سطح کاربر** نصب می‌کند، نه یک سرویس root سراسری-سیستم.

## پیش‌نیازها

```bash
pnpm install
pnpm build
cp .env.example .env # اگر هنوز پیکربندی نکرده‌اید
```

حداقل همان محیطی را که برای `pnpm start` استفاده می‌کنید، تنظیم کنید، مثلاً:

```bash
export HERMES_API_URL=http://127.0.0.1:8642
export HERMESCHI_DASHBOARD_URL=http://127.0.0.1:9119
export HERMES_API_TOKEN=...
```

## نصب

```bash
chmod +x scripts/install-dashboard-service.sh
scripts/install-dashboard-service.sh
```

پیش‌فرض‌ها:

- `HOST=127.0.0.1`
- `PORT=3000`
- `NODE_ENV=production`
- دستور: `pnpm start`

در صورت نیاز، آن‌ها را به‌صورت inline override کنید:

```bash
PORT=3123 HOST=127.0.0.1 scripts/install-dashboard-service.sh
```

## macOS launchd

نصب‌کننده می‌نویسد:

```text
~/Library/LaunchAgents/com.hermeschi.workspace.plist
```

دستورات مفید:

```bash
launchctl print gui/$(id -u)/com.hermeschi.workspace
launchctl kickstart -k gui/$(id -u)/com.hermeschi.workspace
tail -f logs/hermeschi.out.log logs/hermeschi.err.log
```

## سرویس کاربر systemd لینوکس

نصب‌کننده می‌نویسد:

```text
~/.config/systemd/user/hermeschi.service
```

دستورات مفید:

```bash
systemctl --user status hermeschi
journalctl --user -u hermeschi -f
systemctl --user restart hermeschi
```

اگر پس از خروج در لینوکس به سرویس نیاز دارید، یک‌بار lingering را فعال کنید:

```bash
loginctl enable-linger "$USER"
```

## حذف نصب

```bash
scripts/install-dashboard-service.sh uninstall
```

## یادداشت امنیتی

به `0.0.0.0` متصل نشوید مگر آنکه `HERMESCHI_PASSWORD` و راه‌اندازی reverse-proxy/auth شما پیکربندی شده باشد. Workspace فایل‌ها، ترمینال‌ها و کنترل‌های عامل را در معرض قرار می‌دهد، بنابراین loopback پیش‌فرض امن است.
