# مسیریابی نشست گفتگوی فضای کار

## هدف

HermesChi یک مسیر گفتگوی portable از طریق `/v1/chat/completions` سازگار با OpenAI پشتیبانی می‌کند. در این حالت، مسیر مرورگر به‌تنهایی برای حفظ زمینهٔ گفتگو کافی نیست: فضای کار باید یک شناسهٔ نشست پایدار سمت سرور را به دروازهٔ Hermes Agent ارسال کند.

این سند، قرارداد مسیریابی و حالت شکستی را که باعث می‌شد نوبت‌های مرتبط و ضمائم به‌عنوان نشست‌های `api-*` جداگانه ذخیره شوند، ثبت می‌کند.

## قرارداد مسیریابی

دو لایهٔ header متمایز وجود دارد:

| لایه | Headerها | هدف |
| --- | --- | --- |
| تفکیک مسیر رابط کاربری فضای کار | `X-Hermes-Session-Key`، `X-Hermes-Friendly-Id` | به مرورگر می‌گوید کدام مسیر گفتگو/ID دوستانهٔ فضای کار برای گفتگوی قابل‌مشاهده تفکیک شده است. |
| ادامه دروازهٔ Hermes Agent | `X-Hermes-Session-Id`، `X-Claude-Session-Id` | به دروازه می‌گوید کدام نشست سمت سرور Hermes باید درخواست تکمیل گفتگوی بعدی را دریافت کند. |

این‌ها را با هم اشتباه نگیرید. یک پاسخ می‌تواند به‌درستی یک مسیر فضای کار را تفکیک کند، در حالی که درخواست بعدی دروازه همچنان زمینهٔ سمت سرور را از دست می‌دهد اگر `X-Hermes-Session-Id` غایب باشد.

## جریان portable سازگار با OpenAI

۱. `src/routes/api/send-stream.ts` مقادیر `sessionKey`، `friendlyId`، `message`، `history` و `attachments` اختیاری را از رابط کاربری دریافت می‌کند.
۲. یک `sessionKey` پایدار فضای کار را تفکیک می‌کند.
۳. پیام‌های سازگار با OpenAI را می‌سازد، از جمله بخش‌های تصویر چندوجهی هنگام وجود ضمائم.
۴. `openaiChat(..., { sessionId: portableSessionKey })` را صدا می‌زند.
۵. `src/server/openai-compat-api.ts` آن شناسهٔ نشست را از طریق موارد زیر به دروازه ارسال می‌کند:
   - `X-Hermes-Session-Id`
   - `X-Claude-Session-Id` به‌عنوان نام مستعار legacy/back-compat.
۶. Hermes Agent به‌جای استخراج یک نشست `api-*` قطعی جدید از payload درخواست، از شناسهٔ نشست ارائه‌شده برای پیوستگی استفاده می‌کند.

## حالت شکست

باگ، گره زدن headerهای پیوستگی نشست به حضور bearer-token بود:

```ts
if (options.sessionId && bearer) {
  headers['X-Hermes-Session-Id'] = options.sessionId
  headers['X-Claude-Session-Id'] = options.sessionId
}
```

این کار مسیریابی را وابسته به پیکربندی احراز هویت می‌کرد. اگر bearer token در دسترس نبود یا استفاده نمی‌شد، فضای کار همچنان یک کلید نشست محلی داشت، ولی دروازه هرگز آن را دریافت نمی‌کرد. سپس دروازه نشست‌هایی مانند `api-*` را از محتوای درخواست استخراج می‌کرد، که می‌توانست نوبت‌های مرتبط و درخواست‌های فقط-ضمیمه/تصویر را در نشست‌های API جداگانه تقسیم کند.

## رفتار صحیح

مسیریابی نشست مستقل از این است که آیا bearer token پیکربندی شده یا خیر. اگر دروازه نیازمند احراز هویت باشد، بررسی احراز هویت آن bearer token را جداگانه اعمال می‌کند.

```ts
const bearer = getBearerToken()
if (bearer) {
  headers['Authorization'] = `Bearer ${bearer}`
}

if (options.sessionId) {
  headers['X-Hermes-Session-Id'] = options.sessionId
  headers['X-Claude-Session-Id'] = options.sessionId
}
```

## پوشش regression

`src/server/openai-compat-api.test.ts` باید هر دو مورد را پوشش دهد:

- headerهای نشست هنگام وجود bearer token ارسال می‌شوند
- headerهای نشست همچنان هنگام عدم وجود bearer token ارسال می‌شوند

`src/server/chat-backends.ts` باید `options.sessionId` را برای هر دو فراخوانی streaming و non-streaming سازگار با OpenAI به `openaiChat(...)` ارسال کند.

## دستورالعمل راستی‌آزمایی دستی

۱. آزمون هدفمند را اجرا کنید:

   ```bash
   pnpm vitest run src/server/openai-compat-api.test.ts
   ```

۲. assetهای production را build کنید:

   ```bash
   pnpm build
   ```

۳. فضای کار را در محل استقرار دوباره راه‌اندازی کنید:

   ```bash
   systemctl --user restart hermeschi.service
   systemctl --user is-active hermeschi.service
   ```

۴. دو نوبت `/api/send-stream` با همان `sessionKey` و یک token منحصربه‌فرد در پرامپت اول ارسال کنید.
۵. تاریخچهٔ نشست را برای آن token جستجو کنید. هر دو نوبت باید تحت همان `session_id` برابر با کلید نشست فضای کار عرضه‌شده ظاهر شوند، نه نشست‌های `api-*` جداگانه.
۶. یک ضمیمه تصویر با همان `sessionKey` ارسال کنید؛ تاریخچهٔ نشست باید `[screenshot]` را در همان نشست نشان دهد.

## یادداشت‌های عملیاتی

- هنگام بازرسی `.env`، فایل‌های سرویس یا bundleهای buildشده، اعتبارنامه‌ها را redact نگه دارید.
- در استقرارهای zero-fork، فضای کار معمولاً با دروازهٔ Hermes Agent روی `127.0.0.1:8642` و داشبورد روی `127.0.0.1:9119` صحبت می‌کند.
- یک probe موفق `/health` به‌معنای قابل‌دسترس بودن دروازه است؛ این اثبات نمی‌کند که پیوستگی نشست به‌درستی سیم‌کشی شده است. مسیر گفتگوی واقعی را راستی‌آزمایی کنید.
