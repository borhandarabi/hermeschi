<div dir="rtl">

# ثبت کلید API و چک‌لیست چرخش

این ثبت‌نامه، کلیدهای محیطی پشتیبانی‌شده را گروه‌بندی می‌کند تا استقرارها بتوانند آن‌چه را پیکربندی کرده‌اند ممیزی کنند و کلیدها را قبل از پایان هر فاز بچرخانند.

## سیاست چرخش

- تمام کلیدهای نمونهٔ اولیه را به‌عنوان موقتی در نظر بگیرید.
- یک گروه را زمانی بچرخانید که یک ویژگی از نمونهٔ اولیه به production منتقل می‌شود، دسترسی با یک اپراتور جدید به اشتراک گذاشته می‌شود، یا پس از هر نشت مشکوک.
- برای ذخیره‌سازی، داشبوردهای ارائه‌دهنده یا Infisical را ترجیح دهید. مقادیر واقعی را در این مخزن commit نکنید.
- مقادیر `.env` را فقط در حداقل استقراری که به آن‌ها نیاز دارد، محدود نگه دارید.

## استنتاج LLM

- `ANTHROPIC_API_KEY`
- `NOUS_API_KEY`
- `OPENAI_API_KEY`
- `MINIMAX_API_KEY`
- `OPENROUTER_API_KEY`

## تولید تصویر

- `LEONARDO_API_KEY`
- `LEONARDO_SEED_BLOG`
- `LEONARDO_SEED_EDUCATIONAL`
- `LEONARDO_SEED_POAP`
- `LEONARDO_SEED_PROTOCOL`
- `LEONARDO_SEED_SERIES`
- `KREA_API_TOKEN`
- `FAL_KEY`

## Web3 و on-chain

- `LENS_PRIVATE_KEY`
- `LENS_WALLET_ADDRESS`
- `LENS_PROFILE_ID`
- `LENS_SERVER_API_KEY`
- `GUILD_WALLET_PRIVATE_KEY`
- `GUILD_ID`
- `GUILD_PUBLISHER_ROLE_ID`
- `POAP_API_KEY`
- `POAP_AUTH_TOKEN`
- `POAP_EMAIL`

## ذخیره‌سازی و زیرساخت

- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_ENDPOINT`
- `R2_BACKUP_BUCKET`

## ارتباطات

- `TELEGRAM_BOT_TOKEN`
- `SLACK_BOT_TOKEN`
- `SLACK_APP_TOKEN`
- `BLUEBUBBLES_PASSWORD`
- `EMAIL_PASSWORD`
- `HERMES_API_TOKEN`

## یکپارچه‌سازی‌ها و ابزارها

- `OPENCODE_ZEN_API_KEY`
- `SHOPIFY_ACCESS_TOKEN`
- `VAPI_PUBLIC_KEY`
- `VAPI_PRIVATE_KEY`
- `MCP_VAPI_API_KEY`
- `API_SERVER_KEY`
- `HERMESCHI_PASSWORD`

## پلتفرم‌ها و احراز هویت

- `INFISICAL_CLIENT_ID`
- `INFISICAL_CLIENT_SECRET`
- `GOOGLE_API_KEY`
- `GOOGLE_AI_STUDIO_API_KEY`

## تحویل به اپراتور

هنگام تحویل یک فاز:

۱. فهرست کلیدهای فعال را از مخزن secret استقرار export کنید.
۲. آن را با این ثبت‌نامه مقایسه کنید.
۳. کلیدها را در داشبورد ارائه‌دهنده بچرخانید.
۴. مخزن secret استقرار را به‌روزرسانی کنید.
۵. سرویس‌های Hermes Agent / Workspace را دوباره راه‌اندازی کنید.
۶. بررسی‌های provider/model را در تنظیمات Workspace دوباره اجرا کنید.

</div>
