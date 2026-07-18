# مسیریابی سشن گفتگوی Workspace

## هدف

HermesChi یک مسیر گفتگوی portable از طریق `/v1/chat/completions` سازگار با OpenAI پشتیبانی می‌کند. در این حالت، مسیر مرورگر به‌تنهایی برای حفظ زمینهٔ گفتگو کافی نیست: Workspace باید یک شناسهٔ سشن پایدار سمت سرور را به دروازهٔ Hermes Agent ارسال کند.

این سند، قرارداد مسیریابی و حالت شکستی را که باعث می‌شد نوبت‌های مرتبط و ضمائم به‌عنوان سشن‌های `api-*` جداگانه ذخیره شوند، ثبت می‌کند.

## قرارداد مسیریابی

دو لایهٔ header متمایز وجود دارد:

| لایه | Headerها | هدف |
| --- | --- | --- |
| تفکیک مسیر رابط کاربری Workspace | `X-Hermes-Session-Key`، `X-Hermes-Friendly-Id` | به مرورگر می‌گوید کدام مسیر گفتگو/ID دوستانه Workspace برای گفتگوی قابل‌مشاهده تفکیک شده است. |
| ادامه دروازهٔ Hermes Agent | `X-Hermes-Session-Id`، `X-Claude-Session-Id` | به دروازه می‌گوید کدام سشن سمت سرور Hermes باید درخواست تکمیل گفتگوی بعدی را دریافت کند. |

این‌ها را با هم اشتباه نگیرید. یک پاسخ می‌تواند به‌درستی یک مسیر Workspace را تفکیک کند، در حالی که درخواست بعدی دروازه همچنان زمینهٔ سمت سرور را از دست می‌دهد اگر `X-Hermes-Session-Id` غایب باشد.

## جریان portable سازگار با OpenAI

۱. `src/routes/api/send-stream.ts` مقادیر `sessionKey`، `friendlyId`، `message`، `history` و `attachments` اختیاری را از رابط کاربری دریافت می‌کند.
۲. یک `sessionKey` پایدار Workspace را تفکیک می‌کند.
۳. پیام‌های سازگار با OpenAI را می‌سازد، از جمله بخش‌های تصویر چندوجهی هنگام وجود ضمائم.
۴. `openaiChat(..., { sessionId: portableSessionKey })` را فراخوانی می‌کند.
۵. `src/server/openai-compat-api.ts` آن شناسهٔ سشن را از طریق موارد زیر به دروازه ارسال می‌کند:
   - `X-Hermes-Session-Id`
   - `X-Claude-Session-Id` به‌عنوان نام مستعار legacy/back-compat.
۶. Hermes Agent به‌جای استخراج یک سشن `api-*` قطعی جدید از payload درخواست، از شناسهٔ سشن ارائه‌شده برای پیوستگی استفاده می‌کند.

## حالت شکست

باگ، گره زدن headerهای پیوستگی سشن به حضور bearer-token بود:

```ts
if (options.sessionId && bearer) {
  headers['X-Hermes-Session-Id'] = options.sessionId
  headers['X-Claude-Session-Id'] = options.sessionId
}
```

این کار مسیریابی را وابسته به پیکربندی auth می‌کرد. اگر bearer token در دسترس نبود یا استفاده نمی‌شد، Workspace همچنان یک کلید سشن محلی داشت، اما دروازه هرگز آن را دریافت نمی‌کرد. سپس دروازه سشن‌هایی مانند `api-*` را از محتوای درخواست استخراج می‌کرد، که می‌توانست نوبت‌های مرتبط و درخواست‌های فقط-ضمیمه/تصویر را در سشن‌های API جداگانه تقسیم کند.

## رفتار صحیح

مسیریابی سشن مستقل از این است که آیا bearer token پیکربندی شده یا خیر. اگر دروازه نیازمند auth باشد، بررسی auth آن bearer token را جداگانه اعمال می‌کند.

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

- headerهای سشن هنگام وجود bearer token ارسال می‌شوند
- headerهای سشن همچنان هنگام عدم وجود bearer token ارسال می‌شوند

`src/server/chat-backends.ts` باید `options.sessionId` را برای هر دو فراخوانی streaming و non-streaming سازگار با OpenAI به `openaiChat(...)` ارسال کند.

## دستورالعمل راستی‌آزمایی دستی

۱. آزمون هدفمند را اجرا کنید:

   ```bash
   pnpm vitest run src/server/openai-compat-api.test.ts
   ```

۲. assetهای تولید را build کنید:

   ```bash
   pnpm build
   ```

۳. Workspace را در محل استقرار راه‌اندازی مجدد کنید:

   ```bash
   systemctl --user restart hermeschi.service
   systemctl --user is-active hermeschi.service
   ```

۴. دو نوبت `/api/send-stream` با همان `sessionKey` و یک token منحصربه‌فرد در پرامپت اول ارسال کنید.
۵. تاریخچهٔ سشن را برای آن token جستجو کنید. هر دو نوبت باید تحت همان `session_id` برابر با کلید سشن Workspace عرضه‌شده ظاهر شوند، نه سشن‌های `api-*` جداگانه.
۶. یک ضمیمه تصویر با همان `sessionKey` ارسال کنید؛ تاریخچهٔ سشن باید `[screenshot]` را در همان سشن نشان دهد.

## یادداشت‌های عملیاتی

- هنگام بازرسی `.env`، فایل‌های سرویس یا bundleهای buildشده، اعتبارنامه‌ها را redact نگه دارید.
- در استقرارهای zero-fork، Workspace معمولاً با دروازهٔ Hermes Agent روی `127.0.0.1:8642` و داشبورد روی `127.0.0.1:9119` صحبت می‌کند.
- یک probe موفق `/health` به‌معنای قابل‌دسترس بودن دروازه است؛ این اثبات نمی‌کند که پیوستگی سشن به‌درستی سیم‌کشی شده است. مسیر گفتگوی واقعی را راستی‌آزمایی کنید.
