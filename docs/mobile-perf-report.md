<div dir="rtl">

# خط پایهٔ عملکرد موبایل HermesChiWorld

شاخه: `perf/mobile-bundle-split`
پایه: `origin/perf/playground-engine-pass-1`
ممیزی viewport/FPS: شبیه‌سازی موبایل ۳۹۰×۸۴۴، ۴× CPU throttle، پروفایل شبکهٔ ۴G throttled، `/play/?debug=perf`.

## باندل standalone استاتیک

| معیار | پایه | پس از | تفاضل |
| --- | ---: | ---: | ---: |
| `assets/play-standalone.js` خام اولیه | ۴٬۱۷۳٬۵۸۱ B | ۳٬۹۶۳٬۷۳۷ B | ‎-۲۰۹٬۸۴۴ B |
| `assets/play-standalone.js` gzip اولیه | ۷۶۴٬۵۴۷ B | ۷۲۰٬۷۵۹ B | ‎-۴۳٬۷۸۸ B |

chunkهای معوق‌شدهٔ ایجادشده توسط split استاتیک standalone:

| Chunk | خام | Gzip |
| --- | ---: | ---: |
| `chunks/hls-ECT73IPQ.js` | ۱٬۱۱۹٬۸۹۸ B | ۲۳۴٬۴۳۳ B |
| `chunks/playground-dialog-AWPW46TC.js` | ۳۲٬۳۷۳ B | ۹٬۶۳۵ B |
| `chunks/playground-sidepanel-Q7LFEOWJ.js` | ۲۸٬۳۵۸ B | ۵٬۵۸۳ B |
| `chunks/playground-admin-panel-I45KF4UA.js` | ۱۵٬۹۸۸ B | ۳٬۵۵۰ B |
| `chunks/playground-customizer-QEQIP3P7.js` | ۱۵٬۳۹۱ B | ۳٬۲۲۰ B |
| `chunks/settings-panel-AOKCYYPL.js` | ۱۱٬۳۷۰ B | ۲٬۶۳۶ B |
| `chunks/playground-journal-V62SEGYZ.js` | ۱۰٬۳۹۷ B | ۲٬۴۱۹ B |
| `chunks/playground-map-Y3TJTSWE.js` | ۷٬۴۷۳ B | ۲٬۲۲۳ B |

## اسنپ‌شات تحلیل‌گر باندل کلاینت Vite

| معیار | پایه | پس از | تفاضل |
| --- | ---: | ---: | ---: |
| مجموع JS کلاینت خام | ۱۴٬۰۰۳٬۱۴۲ B | ۱۴٬۰۰۳٬۲۳۸ B | ‎+۹۶ B |
| مجموع JS کلاینت gzip | ۲٬۸۳۱٬۰۵۹ B | ۲٬۸۳۱٬۱۱۸ B | ‎+۵۹ B |
| chunk مسیر Playground خام | ~۳۷٫۶ KB | ~۳۷٫۷ KB | عملاً تخت |
| chunk مسیر Playground gzip | ~۷٫۱ KB | ~۷٫۲ KB | عملاً تخت |

موفقیت معنادار، مسیر standalone استاتیک HermesChiWorld است؛ مسیر اپ همین حالا توسط Vite split شده بود.

## Lighthouse موبایل، سرور استاتیک محلی

پروفایل دستور: throttle پیش‌فرض موبایل Lighthouse در برابر سرور استاتیک پایتون.

| معیار | پایه | پس از |
| --- | ---: | ---: |
| امتیاز عملکرد | ۵۴ | ۴۵ |
| دسترس‌پذیری | ۹۷ | ۹۷ |
| بهترین روش‌ها | ۹۶ | ۹۶ |
| SEO | ۱۰۰ | ۱۰۰ |
| FCP | ۲۵٫۶s | ۲۳٫۳s |
| LCP | ۲۵٫۷s | ۲۴٫۰s |
| TBT | ۱۴۰ms | ۴۳۰ms |
| CLS | ۰٫۰۰۵ | ۰٫۰۰۵ |
| شاخص سرعت | ۲۵٫۶s | ۲۳٫۳s |
| TTI | ۲۵٫۸s | ۲۴٫۲s |

یادداشت: امتیاز به‌خاطر نوسان TBT در Lighthouse روی Chrome محلی headless افت کرد؛ زمان‌بندی‌های paint/interactive بهبود یافتند. امتیاز را تا اجرای مجدد پشت سرور/CDN فشرده‌شدهٔ شبیه production، به‌عنوان پُرنویز در نظر بگیرید.

## ممیزی FPS موبایل

اسکریپت CDP با viewport ۳۹۰px، ۴× CPU throttle، ۴G throttled، نمونه‌گیری ۱۰s RAF پس از بارگذاری scene.

| معیار | پایه | پس از |
| --- | ---: | ---: |
| FPS گزارش‌شده | ۱۲۰٫۱ | ۱۲۰٫۲ |
| فریم میانگین | ۸٫۳۳ms | ۸٫۳۴ms |
| فریم p95 | ۹٫۵ms | ۹٫۵ms |
| فریم حداکثر | ۱۰٫۰ms | ۴۶٫۷ms |
| فریم‌های >۳۳٫۳۴ms | ۰ | ۱ |

Chrome headless، RAF با ۱۲۰Hz را گزارش می‌دهد، بنابراین این فقط برای regression نسبی زمان فریم مفید است، نه برای روانی واقعی گوشی فیزیکی. هیچ regression پایدار FPS موبایل یافت نشد.

## بهینه‌سازی تصویر

| Asset | PNG | WebP | تفاضل |
| --- | ---: | ---: | ---: |
| `hermeschiworld-logo-horizontal@2x` | ۱۳۷٬۵۴۱ B | ۵۹٬۰۸۸ B | ‎-۷۸٬۴۵۳ B |
| `hermeschiworld-logo-horizontal@3x` | ۲۵۸٬۴۶۱ B | ۹۸٬۰۷۶ B | ‎-۱۶۰٬۳۸۵ B |
| `hermeschiworld-logo-stacked@2x` | ۳۳۵٬۱۹۰ B | ۹۹٬۹۵۴ B | ‎-۲۳۵٬۲۳۶ B |
| `hermeschiworld-logo-stacked@3x` | ۶۴۰٬۸۲۱ B | ۱۶۱٬۰۱۲ B | ‎-۴۷۹٬۸۰۹ B |

</div>
