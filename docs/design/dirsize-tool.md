# طراحی فنی: ابزار آمار اندازهٔ فایل‌های دایرکتوری (dirsize-tool)

## ۱. مرور کلی

ابزار CLI سبک Python که مجموع اندازهٔ تمام فایل‌های زیر یک دایرکتوری مشخص را به‌صورت بازگشتی محاسبه می‌کند. اهداف طراحی: فقط خواندن، سریع، خروجی ساختاریافته، می‌تواند به‌عنوان ابزار اعتبارسنجی برای آزمون اصلاح @mention استفاده شود.

## ۲. رابط CLI

```bash
python scripts/dirsize.py <path> [options]
```

### پارامترها

| پارامتر | نوع | پیش‌فرض | توضیح |
|------|------|--------|------|
| `path` | آرگومان موقعیتی | الزامی | مسیر دایرکتوری هدف |
| `--unit`, `-u` | رشته | `auto` | واحد نمایش: `auto`, `B`, `KB`, `MB`, `GB` |
| `--exclude` | فهرست رشته | ندارد | الگوهای مستثنی‌شده (قابل استفاده چندباره)، مانند `--exclude node_modules --exclude .git` |
| `--json` | flag | `false` | خروجی با فرمت JSON برای استفادهٔ خودکار |
| `--max-depth` | عدد صحیح | بدون محدودیت | حداکثر عمق بازگشت |
| `--ignore-permission-denied` | flag | `false` | پرش از دایرکتوری‌های با دسترسی ناکافی |
| `--disk-usage` | flag | `false` | استفاده از `stat.st_blocks` برای محاسبهٔ اشغال دیسک، به‌جای اندازهٔ ظاهری |

### کدهای خروج

| کد خروج | معنا |
|--------|------|
| ۰ | موفق |
| ۱ | خطای پارامتر |
| ۲ | مسیر وجود ندارد |
| ۳ | دسترسی ناکافی (بدون استفاده از `--ignore-permission-denied`) |

### نمونه‌های استفاده

```bash
# خروجی پیش‌فرض
python scripts/dirsize.py /some/dir
# Total: 117.7 MB (42 files)

# فرمت JSON برای استفادهٔ خودکار
python scripts/dirsize.py /some/dir --json
# {"path":"/some/dir","total_bytes":123456789,"human_size":"117.7 MB",...}

# مستثنی کردن node_modules و .git
python scripts/dirsize.py . --exclude node_modules --exclude .git

# محدود کردن عمق
python scripts/dirsize.py /deep/tree --max-depth 3

# اشغال دیسک (به‌جای اندازهٔ ظاهری)
python scripts/dirsize.py /some/dir --disk-usage
```

### قالب خروجی

**پیش‌فرض (انسانی-خوانا)**:
```
Total: 117.7 MB (42 files)
```

**حالت JSON**:
```json
{
  "path": "/path/to/dir",
  "total_bytes": 123456789,
  "human_size": "117.7 MB",
  "file_count": 42,
  "elapsed_ms": 15,
  "errors": []
}
```

## ۳. الگوریتم اصلی

```python
import os

def get_dir_size(path, follow_symlinks=False, disk_usage=False):
    total = 0
    count = 0
    for dirpath, dirnames, filenames in os.walk(path, followlinks=follow_symlinks):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            try:
                st = os.lstat(fp) if not follow_symlinks else os.stat(fp)
                if not stat.S_ISREG(st.st_mode):
                    continue
                total += st.st_blocks * 512 if disk_usage else st.st_size
                count += 1
            except PermissionError:
                if not ignore_permission_denied:
                    raise
    return total, count
```

**بهینه‌سازی عملکرد**:
- برای دایرکتوری‌های بزرگ می‌توان از `os.scandir` + بازگشت به‌جای `os.walk` استفاده کرد تا فراخوانی‌های stat کاهش یابد
- `--max-depth` تعداد سطوح بازگشت را محدود می‌کند تا از پیمایش بیش‌ازحد عمیق جلوگیری شود

## ۴. انتظارات عملکرد

| تعداد فایل | زمان |
|--------|------|
| ۱٬۰۰۰ | < ۱۰ms |
| ۱۰۰٬۰۰۰ | ~۲۰۰ms |
| ۱٬۰۰۰٬۰۰۰ | ~۲s |
| ۱۰٬۰۰۰٬۰۰۰ | ~۲۰s (پیشنهاد: افزودن `--max-depth`) |

## ۵. مکان فایل

```bash
scripts/dirsize.py
```

مسیر مالکیت باید توسط Carlo تأیید شود (`~/hermeschi/scripts/` یا سراسری `~/.hermes/scripts/`).

## ۶. برنامهٔ پیاده‌سازی

۱. ایجاد فایل `scripts/dirsize.py`
۲. پیاده‌سازی قابلیت پایهٔ `os.walk` + `argparse`
۳. افزودن خروجی `--json`
۴. افزودن ویژگی‌هایی مانند `--exclude`، `--max-depth`، `--ignore-permission-denied`
۵. افزودن گزینهٔ `--disk-usage`
۶. ارسال PR / merge مستقیم (بسته به مسیر مالکیت)

تخمین تلاش: ۱۵-۳۰ دقیقه.
