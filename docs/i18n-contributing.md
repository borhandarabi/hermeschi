# Contributing UI translations

Hermes Workspace uses a lightweight, dependency-free i18n module that supports English (`en`) and Persian (`fa`) locales. Persian renders right-to-left; English renders left-to-right. The document direction is coupled to the active locale, so switching language in Settings immediately flips the layout.

## Translation file

All translation state lives in:

```text
src/lib/i18n.ts
```

The important pieces are:

- `LocaleId`: the union type of supported locale ids (`'en' | 'fa'`).
- `EN`: the source-of-truth English keys. Every new key is added here first.
- `FA`: the Persian translation table, mirroring every key in `EN`.
- `RTL_LOCALES`: a `Set<LocaleId>` that marks which locales render RTL. Currently `{'fa'}`.
- `LOCALES`: maps locale id → translation table.
- `LOCALE_LABELS`: human-readable labels shown in the language selector.
- `getDir(locale)`: returns `'rtl'` for Persian, `'ltr'` for everything else.
- `applyDocumentDir(locale)`: writes `dir`, `lang`, and `data-dir` onto `<html>`.
- `setLocale(id)`: persists the locale to `localStorage`, calls `applyDocumentDir`, and dispatches the `'locale-change'` event so subscribers re-render.
- `t(key, params?)`: returns the translated string for the active locale, with optional `{placeholder}` interpolation.

## Supported locales

| Locale id | Label     | Direction | Status             |
| --------- | --------- | --------- | ------------------ |
| `en`      | English   | LTR       | Source of truth    |
| `fa`      | فارسی     | RTL       | Actively translated |

To add a new locale:

1. Add its id to the `LocaleId` union type.
2. If it renders right-to-left (Arabic, Hebrew, Urdu, etc.), add it to the `RTL_LOCALES` set.
3. Author a translation table that satisfies `LocaleTranslations` (every key in `EN` must be present).
4. Register it in `LOCALES` and `LOCALE_LABELS`.
5. Add a test case to `src/lib/i18n.test.ts` that asserts at least a few keys resolve correctly under the new locale.

## Adding or improving Persian translations

1. Open `src/lib/i18n.ts`.
2. Find the `FA` object.
3. Update the value on the right side of each key. Use the standard Iranian Persian register and proper zero-width non-joiners (e.g. `نمایه‌ها`, not `نمایه ها`).

Example:

```ts
const FA: LocaleTranslations = {
  'nav.dashboard': 'داشبورد',
  'nav.chat': 'گفتگو',
}
```

Keep the key names exactly the same. Only edit the translated text.

## Adding new translatable UI text

If you find hardcoded English UI text:

1. Add a new key to `EN` (the source of truth).
2. Add the same key to the `FA` table.
3. Replace the hardcoded text in the component with `t('your.newKey')`.

Example:

```ts
// src/lib/i18n.ts
const EN = {
  'common.retry': 'Retry',
} as const

const FA: LocaleTranslations = {
  'common.retry': 'تلاش دوباره',
}
```

Then in the component:

```tsx
import { t } from '@/lib/i18n'

;<button>{t('common.retry')}</button>
```

Because `LocaleTranslations = Record<TranslationKey, string>` and `TranslationKey = keyof typeof EN`, TypeScript will refuse to compile if the `FA` table is missing a key. This is intentional — it prevents the Persian table from drifting out of sync with `EN`.

## Interpolation

For strings that contain dynamic values, use `{placeholder}` tokens in the translation string and pass `params` as the second argument to `t()`:

```ts
// src/lib/i18n.ts
const EN = {
  'chat.messageList.unreadCount': '{count} unread',
} as const

const FA: LocaleTranslations = {
  'chat.messageList.unreadCount': '{count} خوانده‌نشده',
}
```

```tsx
import { t } from '@/lib/i18n'

;<span>{t('chat.messageList.unreadCount', { count: 5 })}</span>
// EN: '5 unread'
// FA: '5 خوانده‌نشده'
```

Multiple placeholders are supported:

```ts
t('chat.contextBar.tokens', { count: 500, max: 8000 })
// EN: '500 / 8000 tokens'
// FA: '500 / 8000 توکن'
```

Unmatched placeholders (no corresponding key in `params`) are left intact — translators can include literal `{braces}` in copy if needed.

Numbers are stringified via `String(value)`, not `Intl.NumberFormat`. This is deliberate so callers control digit rendering. Most technical UIs want ASCII digits even under Persian to avoid mixed Latin/Persian numerals in copy-pasted identifiers.

## RTL conventions

The app is RTL-aware by construction. Follow these rules when writing components:

### DO use logical CSS properties

Tailwind v4 ships logical-property utilities that automatically flip based on the `dir` attribute. Always prefer these over their physical counterparts:

| Physical (avoid) | Logical (use)  | CSS property            |
| ---------------- | -------------- | ----------------------- |
| `ml-`            | `ms-`          | margin-inline-start     |
| `mr-`            | `me-`          | margin-inline-end       |
| `pl-`            | `ps-`          | padding-inline-start    |
| `pr-`            | `pe-`          | padding-inline-end      |
| `left-`          | `start-`       | inset-inline-start      |
| `right-`         | `end-`         | inset-inline-end        |
| `text-left`      | `text-start`   | text-align: start       |
| `text-right`     | `text-end`     | text-align: end         |
| `border-l`       | `border-s`     | border-inline-start     |
| `border-r`       | `border-e`     | border-inline-end       |
| `rounded-l-*`    | `rounded-s-*`  | border-start-radius     |
| `rounded-r-*`    | `rounded-e-*`  | border-end-radius       |

### DO use `rtl:` / `ltr:` variants for one-off overrides

When a logical property isn't enough (e.g. an animation that needs to flip direction, or a transform that should only apply in one direction), use Tailwind's built-in `rtl:` and `ltr:` variants:

```tsx
<div className="animate-in slide-in-from-right-5 rtl:slide-in-from-left-5">
```

The `@variant rtl` and `@variant ltr` declarations in `src/styles.css` document this intent explicitly.

### DO use `useLocaleDirection()` for reactive direction-aware logic

For components that need to know the active direction at runtime (e.g. to pick between two different layouts, or to compute a position), use the reactive hook:

```tsx
import { useLocaleDirection } from '@/hooks/use-locale-direction'

function MyComponent() {
  const { isRtl, dir } = useLocaleDirection()
  return <div style={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}>...</div>
}
```

The hook subscribes to the `'locale-change'` event and re-renders automatically when the user switches language. It also re-syncs on cross-tab `storage` events.

### DON'T set `dir` yourself

The `dir` attribute on `<html>` is the single source of truth. It is set:

1. By the inline `themeScript` in `src/routes/__root.tsx` before React hydrates (so first paint is already in the right direction).
2. By `setLocale()` → `applyDocumentDir()` when the user switches language.
3. By a `useEffect` in `RootLayout` that re-applies it whenever `useLocaleDirection()` reports a change.

Never write `<div dir="rtl">` or `element.dir = 'rtl'` in component code. If you need a direction-aware container, rely on the inherited `dir` from `<html>`.

### DON'T use `Intl.DateTimeFormat('en-US', ...)` or `toLocaleDateString('en-US', ...)`

Hardcoding `'en-US'` makes dates render in US English format regardless of the active locale. Either:

- Pass `undefined` as the locale so the browser uses `navigator.language`: `new Intl.DateTimeFormat(undefined, { ... })`
- Or pass the active locale explicitly: `new Intl.DateTimeFormat(getLocale(), { ... })`

The second approach is preferred when you want the date to follow the user's app-locale choice (which may differ from their browser locale).

### DON'T use physical-property Tailwind classes in new code

A future ESLint rule will warn on `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left`, `text-right` in new code. Until that rule ships, please self-review your diff for these classes before opening a PR. You can grep your changes:

```bash
git diff main...HEAD -- '*.tsx' '*.ts' | grep -E '^\+.*\b(ml-|mr-|pl-|pr-|left-|right-|text-left|text-right)\b'
```

If the grep returns anything, prefer the logical-property equivalent unless you have a specific reason (and document it in the code comment).

## Persian-specific guidance

### Numerals

Keep ASCII digits (`0123456789`) in:

- Code blocks and inline code
- Identifiers, paths, file names
- Token counts and other technical UI strings that users might copy-paste
- Interpolation parameters (they get stringified via `String(value)`)

Use Persian digits (`۰۱۲۳۴۵۶۷۸۹`) only in:

- Prose body text where the number is part of a sentence (and only if the team decides to adopt Persian digits — currently we keep ASCII for consistency)

### Punctuation

- Use the Persian comma `،` (U+060C) instead of the ASCII comma `,` inside Persian text.
- Use `؛` (U+061B) instead of `;` for semicolons in Persian text.
- Use «» (Persian guillemets) instead of `""` for quotes around Persian text.
- Use `…` (U+2026) for ellipsis — it renders correctly in both LTR and RTL.
- The colon `:` is fine to use as-is in Persian.

### Zero-width non-joiner (ZWNJ)

Persian uses ZWNJ (`\u200c`, rendered invisibly) to separate words that should not be joined. Always include it where it belongs:

- ✅ `نمایه‌ها` (correct)
- ❌ `نمایه ها` (wrong — the two words appear stuck together)
- ✅ `می‌خواهم` (correct)
- ❌ `میخواهم` (wrong)

Most Persian IMEs insert ZWNJ automatically. If you're typing translations in a non-Persian keyboard layout, be careful to include them.

## Testing locally

Run:

```bash
pnpm exec vitest run src/lib/i18n.test.ts
pnpm exec tsc --noEmit
pnpm build
```

Then open Settings → Language and switch to فارسی. Verify:

1. The `<html>` element has `dir="rtl"` and `lang="fa"` (check via DevTools).
2. The sidebar appears on the right side of the screen.
3. Text alignment is right-justified where appropriate.
4. Vazirmatn font is loaded (check the Fonts tab in DevTools).
5. No LTR flash on initial page load (the `themeScript` should have set `dir` before hydration).

For component-specific RTL testing, look at `src/lib/i18n.test.ts` for patterns. Tests that exercise `setLocale()` are safe to run in Node (no DOM required) — DOM assertions are guarded with `typeof document !== 'undefined'`.

## Architecture notes

### Why no ICU MessageFormat?

We deliberately do not use `Intl.MessageFormat` or any other ICU-style message syntax. Plurals are handled at the call site by choosing a different key:

```ts
// EN
'messages.unread.one': '1 unread message',
'messages.unread.many': '{count} unread messages',

// Call site
const key = count === 1 ? 'messages.unread.one' : 'messages.unread.many'
return t(key, { count })
```

This keeps the i18n module small and dependency-free. The trade-off is that translators must author multiple keys for plural forms, but in practice this is rare in our UI.

### Why not react-i18next?

The app's i18n needs are simple: ~250 keys, two locales, no lazy-loading, no namespace splitting. `react-i18next` would add ~30KB to the bundle for features we don't use. The current `t()` function is a one-liner that reads from a pre-built in-memory map; it's impossible to make it meaningfully faster.

If the locale count grows beyond ~5, or if we need lazy-loaded namespace splitting, revisit this decision.

### Why does the `themeScript` duplicate the RTL_LOCALES list?

The `themeScript` in `src/routes/__root.tsx` runs as an inline `<script>` tag before React hydrates. It has no access to the module graph, so it can't import `RTL_LOCALES` from `src/lib/i18n.ts`. The list is duplicated (with a comment explaining why) so that the document direction is set before first paint, avoiding an LTR flash for Persian-locale users.

If you add a new RTL locale, you MUST update both:
1. `RTL_LOCALES` in `src/lib/i18n.ts`
2. The `RTL_LOCALES` array in the `themeScript` string in `src/routes/__root.tsx`

The pre-existing test suite does not catch drift between these two lists. A follow-up TODO is to extract the script body into a separate `.ts` file that the build inlines, so the same source serves both contexts.

## Current status

The following screen groups have been migrated to `t()`:

- ✅ Chat screen (composer, header, empty state, message list, message item, sidebar, providers dialog, session dialogs, tool labels)
- ✅ Settings screen (section titles, language selector)
- ✅ Shared components (mobile tab bar, workspace shell)
- ✅ Tasks/Profiles screen titles
- ✅ RTL infrastructure (themeScript, useLocaleDirection, @variant rtl, Vazirmatn font)
- ✅ i18n module (interpolation, getDir, applyDocumentDir)

The following screen groups still have hardcoded English strings (planned for follow-up work):

- ⚠️ Settings screen individual row labels and form inputs (~250 strings)
- ⚠️ Dashboard card components (~200 strings)
- ⚠️ Agents / Swarm2 / Gateway screens (~560 strings combined)
- ⚠️ MCP / Memory / Skills / Files screens (~385 strings combined)
- ⚠️ Playground / Agora / Echo-Studio screens (~240 strings combined)
- ⚠️ Toast messages in chat-composer.tsx and other action handlers
- ⚠️ Form input placeholders across all screens

If text remains in English after switching languages, it likely means that component still has hardcoded text and needs to be wired to `t(...)`. The namespaces (`chat.*`, `common.*`, `dashboard.*`, `agents.*`, etc.) are already in place — only the call-site wiring remains.
