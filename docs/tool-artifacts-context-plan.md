# برنامهٔ artifactهای خروجی ابزار / پ‌رشدی زمینه

تاریخ: ۲۰۲۶-۰۴-۲۴

## مسئله

سشن‌های Hermes Agent در جریان کارهای معمول مبتنی بر ابزار، زمینه را به‌سرعت پر می‌کنند. در یک سشن Workspace (`cda915a9-fbf6-4bbf-9617-e7e9d26f40be`):

- مجموعاً ۲۵۶ پیام
- ۷ پیام کاربر
- ۱۱۷ پیام دستیار
- ۱۳۲ پیام ابزار
- ~۶۰۳k کاراکتر خروجی ابزار
- ~۱۵۲k token تقریبی

پ‌رشدی، گفتگوی کاربر/دستیار نیست. بیشتر رد اجرای ذخیره‌شده است:

- chunkهای بزرگ `read_file`
- لاگ‌های terminal/test
- مستندات کامل `skill_view`
- فهرست‌های issue/PR گیت‌هاب
- خروجی‌های patch/diff

این باعث می‌شود:

۱. پنجرهٔ زمینه با وجود رفتار عادی Claude به‌سرعت پر می‌شود.
۲. هشدارهای auto-compaction زود و مکرر ظاهر می‌شوند.
۳. رابط کاربری گفتگوی Workspace توسط کارت‌های ابزار تسلط می‌یابد و به‌نظر می‌رسد پیام‌های کاربر/دستیار ناپدید شده‌اند.
۴. مدل در هر نوبت خروجی‌های بزرگ ابزار را به‌اجبار دریافت می‌کند حتی وقتی فقط به pointers/خلاصه‌ها نیاز دارد.

## بینش کلیدی

Claude در حال حاضر دو مفهوم جداگانه را درهم می‌آمیزد:

۱. **زمینهٔ گفتگو/مدل** — آنچه LLM برای استدلال نیاز دارد.
۲. **رد اجرا/artifactها** — خروجی‌های کامل ابزار، لاگ‌ها، محتوای فایل، diffها، مستندات skill.

این‌ها باید جدا شوند.

## معماری مطلوب

استفاده از **خروجی‌های ابزار مبتنی بر artifact + پیش‌نگاشت زمینهٔ فشرده**.

### رونوشت گفتگو باید شامل باشد

- پیام‌های کاربر
- پیام‌های نهایی دستیار
- خلاصه‌های/pointerهای فشردهٔ ابزار

نمونه پیام فشرده ابزار:

```json
{
  "role": "tool",
  "content": {
    "tool": "read_file",
    "summary": "Read src/screens/chat/components/chat-message-list.tsx lines 680-1499",
    "chars": 36334,
    "artifact_id": "toolout_abc123",
    "truncated": true
  }
}
```

### artifactهای Inspector باید شامل باشند

خروجی‌های/لاگ‌ها/artifactهای کامل ابزار، با بارگذاری تنبل:

```ts
type InspectorArtifact = {
  id: string
  sessionId: string
  toolCallId?: string
  kind: 'tool_output' | 'file_read' | 'terminal_log' | 'diff' | 'skill_doc'
  title: string
  summary: string
  preview: string
  contentSize: number
  contentPath?: string
  createdAt: number
}
```

### زمینهٔ مدل باید دریافت کند

فقط خلاصه‌های فشرده به‌طور پیش‌فرض:

```txt
Tool read_file completed.
Summary: Read chat-message-list.tsx lines 680-1499.
Full output stored as artifact toolout_abc123.
Use artifact_read(toolout_abc123, offset, limit) if needed.
```

## وضعیت فعلی Inspector Workspace

کد بررسی‌شده:

- `src/components/inspector/activity-store.ts`
  - فقط Zustand in-memory store
  - `{ type, time, text }` را ذخیره می‌کند
  - دوام‌ندارد؛ با refresh از بین می‌رود
- `src/components/inspector/inspector-panel.tsx`
  - تب Artifacts، `events.filter(e => e.type === 'artifact')` را فیلتر می‌کند
  - فقط متن/زمان را نمایش می‌دهد
  - بدون محتوای کامل، ID، preview، یا بارگذاری تنبل

پس پنل سمت راست مقصد UX درست است، اما به یک backing store دوام‌دار نیاز دارد.

## گزینه‌های پیاده‌سازی

### گزینهٔ A — artifact store رسمی Hermes Agent

بهترین بلندمدت زیرا همهٔ کلاینت‌ها سود می‌برند: CLI، دروازه، Workspace، WebUI آینده.

افزودن یک table/store به Hermes Agent:

```sql
tool_artifacts (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  message_id INTEGER,
  tool_name TEXT,
  kind TEXT,
  title TEXT,
  content_path TEXT,
  content_preview TEXT,
  content_size INTEGER,
  created_at REAL
)
```

محتوای بزرگ روی دیسک:

```txt
~/.hermes/sessions/artifacts/<session_id>/<artifact_id>.json
```

endpointهای API:

```txt
GET /api/sessions/:sessionId/artifacts
GET /api/artifacts/:artifactId
```

### گزینهٔ B — cache artifact MVP فقط Workspace

patch سریع‌تر فقط Workspace.

ذخیرهٔ artifactها زیر:

```txt
~/hermeschi/.runtime/artifacts/<session_id>/<artifact_id>.json
```

یا یک DB/JSON index محلی کوچک.

Workspace `/api/history` یا `/api/send-stream` خروجی‌های ابزار بیش‌ازحد بزرگ را پیش از رندر/ارسال به React بیرونی می‌کند.

MVP خوبی است، اما برای پ‌رشدی زمینهٔ مدل رسمی کافی نیست مگر آنکه context builder Hermes Agent نیز تزریق مجدد payload کامل ابزار را متوقف کند.

## پیشنهاد سیاست

استفاده از آستانهٔ اندازه:

```ts
const INLINE_TOOL_OUTPUT_LIMIT = 4_000
```

اگر خروجی ابزار <= ۴k کاراکتر:

- inline نگه داشته شود

اگر > ۴k کاراکتر:

- ذخیرهٔ خروجی کامل به‌عنوان artifact
- جایگزینی محتوای chat/session با خلاصه + pointer artifact
- نمایش کارت فشرده در گفتگو
- محتوای کامل از Inspector قابل‌دسترس

## پیش‌فرض‌های هر ابزار

| نوع ابزار | سیاست زمینه |
|---|---|
| `read_file` | ذخیرهٔ کامل به‌عنوان artifact؛ زمینه مسیر فایل، بازهٔ خط، preview/گزیده‌ها را دریافت می‌کند |
| `search_files` | تطابق‌های فشرده را inline نگه دارید |
| `terminal` موفق | ذخیرهٔ لاگ کامل؛ زمینه دستور، کد خروج، ~۲۰ خط آخر را دریافت می‌کند |
| `terminal` ناموفق | ذخیرهٔ لاگ کامل؛ زمینه دستور، کد خروج، خطای مرتبط/دم را دریافت می‌کند |
| `skill_view` | ذخیره/ارجاع مستند skill؛ زمینه نام/نسخه/خلاصه/hash skill را دریافت می‌کند |
| `browser_snapshot` | ذخیرهٔ snapshot/artifact کامل؛ زمینه خلاصهٔ صفحه را دریافت می‌کند |
| `patch` | نگه‌داری خلاصه/diff کامل اگر کوچک است؛ diffهای بزرگ را بیرونی کنید |
| `todo` | فقط وضعیت فشرده |
| فهرست‌های issue/PR گیت‌هاب | ذخیرهٔ فهرست کامل؛ زمینه تعدادها/top N را دریافت می‌کند |

## رفع‌های رابط کاربری Workspace آغازشده

فایل‌های دست‌خورده در worktree فعلی:

- `src/stores/chat-store.ts`
  - ترتیب ذخیره‌شده اصلاح شد: در صورت تساوی timestampها، ترجیح `__historyIndex` بر role-rank
- `src/stores/chat-store.test.ts`
  - regression برای ترتیب user → assistant → user با timestampهای مساوی
- `src/screens/chat/components/chat-message-list.tsx`
  - نوبت‌های دستیار فقط-ابزار انتهایی از پیوست به آخرین پاسخ متنی متوقف شدند
  - یک کارت وضعیت دستیار fallback ترمینالی هنگامی که تاریخچهٔ ذخیره‌شده با ورودی‌های فقط-ابزار خاتمه می‌یابد و هیچ پاسخ نهایی دستیار ذخیره نشده بود، افزوده شد
- `src/screens/chat/components/chat-message-list.test.tsx`
  - regression برای عدم تسلط پیام‌های فقط-ابزار انتهایی بر آخرین پاسخ متنی
  - regression برای شناسایی دم فقط-ابزار پنهان تا Workspace بتواند یک وضعیت پایانی قابل‌فهم برای انسان رندر کند

## artifact store MVP Workspace پیاده‌سازی شد

افزوده شده در pass ادامه:

- `src/server/tool-artifacts-store.ts`
  - index artifact محلی دوام‌دار زیر `.runtime/tool-artifacts/index.json`
  - خروجی‌های کامل ابزار زیر `.runtime/tool-artifacts/<session_id>/<artifact_id>.json` ذخیره می‌شوند
  - IDهای artifact پایدار از hash session/message/tool/content برای جلوگیری از تکرار در fetchهای مکرر تاریخچه
  - `INLINE_TOOL_OUTPUT_LIMIT = 4_000`
  - `externalizeLargeToolOutput(sessionId, message)` نتایج ابزار بیش‌ازحد بزرگ را با خلاصه‌های فشرده و pointerهای artifact جایگزین می‌کند
- `src/routes/api/artifacts.ts`
  - metadata artifact را فهرست می‌کند، با فیلتر `?sessionId=` اختیاری
- `src/routes/api/artifacts.$artifactId.ts`
  - محتوای artifact کامل را بر اساس ID بارگذاری تنبل می‌کند
- `src/routes/api/history.ts`
  - پیام‌های tool/toolResult بیش‌ازحد بزرگ را در طول نرمال‌سازی تاریخچه بیرونی می‌کند
  - همان مسیر بیرونی‌سازی را به پیام‌های fallback سشن portable محلی اعمال می‌کند
- `src/server/claude-api.ts`
  - `role: "tool"` بک‌اند را به `role: "toolResult"` فرانت‌اند نرمال می‌کند
  - `toolCallId` / `toolName` را بالا می‌کشد تا نقشهٔ نتایج و کارت‌های ابزار بتوانند خروجی‌ها را پیدا کنند
- `src/components/inspector/inspector-panel.tsx`
  - تب Artifacts اکنون artifactهای دوام‌دار را از `/api/artifacts` می‌خواند
  - کلیک روی یک artifact، محتوای کامل را از `/api/artifacts/:artifactId` بارگذاری تنبل می‌کند
- `src/server/tool-artifacts-store.test.ts`
  - regression برای جایگزینی pointer فشرده و IDهای artifact پایدار

راستی‌آزمایی‌شده:

```bash
pnpm vitest run src/server/tool-artifacts-store.test.ts src/screens/chat/components/chat-message-list.test.tsx src/stores/chat-store.test.ts src/screens/chat/components/message-item.test.ts
pnpm exec tsc --noEmit --pretty false
pnpm build
```

همه گذر کردند. build فقط هشدارهای موجود chunk-size / sourcemap را منتشر کرد.

## تشخیص فعلی: Workspace در مقابل Hermes Agent

کارت انتهایی «Tool work completed» یک guardrail Workspace است، نه وضعیت مطلوب پایدار.

تقسیم مسئولیت احتمالی:

۱. **Hermes Agent / persisting سشن منبع ریشه‌ای است** زمانی که تاریخچهٔ ذخیره‌شده با پیام‌های ابزار و بدون متن نهایی دستیار خاتمه می‌یابد. یک رونوشت عامل سالم باید هر نوبت مبتنی بر ابزار را با یک نتیجهٔ دستیار قابل‌مشاهده برای کاربر خاتمه دهد: پاسخ نهایی، خطا، interrupted/cancelled، no-op، یا خلاصهٔ فشردهٔ کار ابزار.
۲. **Workspace باگ‌های UI/رندر داشت** که مشکل منبع را بدتر می‌کرد:
   - `role: "tool"` بک‌اند به `toolResult` فرانت‌اند نرمال نمی‌شد
   - `toolCallId` / `toolName` به‌طور یکدست بالا کشیده نمی‌شدند
   - ردیف‌های فقط-ابزار انتهایی می‌توانستند به‌صورت بصری بر گفتگو تسلط یابند
   - خروجی‌های بزرگ ابزار به‌جای مبتنی بر artifact، inline رندر می‌شدند
۳. **راه‌اندازی/سشن فعلی ما آن را تقویت می‌کند** زیرا این گفتگو به‌شدت مبتنی بر ابزار است و نزدیک حداکثر زمینه است؛ اقدامات dev/ابزار پس از یک پاسخ دستیار قابل‌فهم برای انسان می‌توانند ردیف‌های ابزار ذخیره‌شده در دم به‌جا بگذارند.

نتیجه: Workspace باید این وضعیت را به‌صورت دفاعی جمع/خلاصه-ابزار کند، اما رفع رسمی در stream/session writer Hermes Agent تعلق دارد: هرگز یک نوبت گفتگوی تکمیل‌شده را که فقط با خروجی ابزار خاتمه می‌یابد، ذخیره نکنید.

## رفع Hermes Agent پیاده‌سازی شد

`/Users/aurora/hermes-agent` وصله شد:

- `run_agent.py`
  - `_persist_session()` اکنون پیش از نوشتن JSON/SQLite، `_ensure_terminal_assistant_message()` را فراخوانی می‌کند.
  - اگر یک مسیر خروج، رونوشت را با خاتمهٔ `role: "tool"` باقی بگذارد، Claude به‌جای persist کردن یک دم خاموش ابزار، یک پیام دستیار مصنوعی فشرده ضمیمه می‌کند.
  - `_handle_max_iterations()` اکنون پیام‌های خلاصه/شکست fallback را در همهٔ شاخه‌های fallback به history اضافه می‌کند، نه فقط در مسیر خلاصهٔ خوش‌بینانه.
- `tests/run_agent/test_860_dedup.py`
  - regression افزوده شد: فراخوانی‌های مکرر `_persist_session()` روی یک رونوشت tool-tail دقیقاً یک پیام دستیار ترمینال ضمیمه می‌کنند و ردیف‌ها را تکرار نمی‌کنند.

راستی‌آزمایی‌شده:

```bash
./.venv/bin/python -m pytest tests/run_agent/test_860_dedup.py -o 'addopts=' -q
./.venv/bin/python -m pytest tests/run_agent/test_860_dedup.py tests/run_agent/test_compression_persistence.py -o 'addopts=' -q
./.venv/bin/python -m py_compile run_agent.py
```

نتیجه: همهٔ آزمون‌های هدفمند گذر کردند.

## گام‌های بعدی پیشنهادی

۱. fallback Workspace را نگه دارید، اما آن را به‌عنوان مدیریت وضعیت لبه در نظر بگیرید.
۲. کار artifact رسمی را در Hermes Agent ادامه دهید: خروجی‌های ابزار بیش‌ازحد بزرگ را پیش از آنکه وارد زمینهٔ ذخیره‌شده/مدل شوند، بیرونی کنید، نه فقط پیش از آنکه Workspace تاریخچه را رندر کند.
۳. ادامهٔ پولیش Workspace:
   - اکشن صریح «Open artifact» روی کارت‌های فشردهٔ tool-result
   - deep-link به تب Inspector Artifacts
   - سیاست cleanup/retention برای artifact

## اصل کلیدی

خروجی کامل ابزار متعلق به artifactها/لاگ‌هاست؛ زمینهٔ مدل باید فقط خلاصه‌ها، pointerها و گزیده‌های بارگذاری‌شدهٔ تنبل را دریافت کند.
