/**
 * Lightweight i18n — UI string translations for Hermes Workspace.
 *
 * Supported locales:
 *   - en  (English)        — source of truth, LTR
 *   - fa  (Persian / فارسی) — RTL
 *
 * Adding a new locale:
 *   1. Add its id to `LocaleId`.
 *   2. Add it to `RTL_LOCALES` if it renders right-to-left.
 *   3. Author a translation table that satisfies `LocaleTranslations`
 *      (every key in `EN` must be present).
 *   4. Register it in `LOCALES` and `LOCALE_LABELS`.
 */

export type LocaleId = 'en' | 'fa'

const EN = {
  // ── Nav ──────────────────────────────────────────────────────────────
  'nav.dashboard': 'Dashboard',
  'nav.chat': 'Chat',
  'nav.files': 'Files',
  'nav.terminal': 'Terminal',
  'nav.jobs': 'Jobs',
  'nav.tasks': 'Tasks',
  'nav.memory': 'Memory',
  'nav.skills': 'Skills',
  'nav.profiles': 'Profiles',
  'nav.settings': 'Settings',
  'nav.agents': 'Agents',
  'nav.swarm': 'Swarm',
  'nav.gateway': 'Gateway',
  'nav.playground': 'Playground',
  'nav.agora': 'Agora',
  'nav.echoStudio': 'Echo Studio',
  'nav.mcp': 'MCP',
  'nav.crew': 'Crew',
  // ── Skills ───────────────────────────────────────────────────────────
  'skills.installed': 'Installed',
  'skills.marketplace': 'Marketplace',
  'skills.search': 'Search by name, tags, or description',
  'skills.noResults': 'No skills found',
  // ── Profiles ─────────────────────────────────────────────────────────
  'profiles.profiles': 'Profiles',
  'profiles.monitoring': 'Monitoring',
  // ── Tasks ────────────────────────────────────────────────────────────
  'tasks.title': 'Tasks',
  'tasks.newTask': 'New Task',
  'tasks.backlog': 'Backlog',
  'tasks.todo': 'Todo',
  'tasks.inProgress': 'In Progress',
  'tasks.review': 'Review',
  'tasks.done': 'Done',
  // ── Jobs ─────────────────────────────────────────────────────────────
  'jobs.title': 'Jobs',
  'jobs.newJob': 'New Job',
  // ── Settings ─────────────────────────────────────────────────────────
  'settings.title': 'Settings',
  'settings.language': 'Language',
  'settings.languageDesc': 'Choose the display language for the workspace UI.',
  // ── Common ───────────────────────────────────────────────────────────
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.search': 'Search',
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.noData': 'No data',
  'common.close': 'Close',
  'common.retry': 'Retry',
  'common.refresh': 'Refresh',
  'common.copy': 'Copy',
  'common.copied': 'Copied',
  'common.reset': 'Reset',
  'common.confirm': 'Confirm',
  'common.apply': 'Apply',
  'common.ok': 'OK',
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.done': 'Done',
  'common.edit': 'Edit',
  'common.rename': 'Rename',
  'common.share': 'Share',
  'common.export': 'Export',
  'common.import': 'Import',
  'common.download': 'Download',
  'common.upload': 'Upload',
  'common.add': 'Add',
  'common.remove': 'Remove',
  'common.clear': 'Clear',
  'common.selectAll': 'Select all',
  'common.deselectAll': 'Deselect all',
  'common.more': 'More',
  'common.less': 'Less',
  'common.expand': 'Expand',
  'common.collapse': 'Collapse',
  'common.enable': 'Enable',
  'common.disable': 'Disable',
  'common.required': 'Required',
  'common.optional': 'Optional',
  'common.unknown': 'Unknown',
  'common.continue': 'Continue',
  'common.skip': 'Skip',
  'common.finish': 'Finish',
  'common.disconnected': 'Disconnected',
  'common.reconnecting': 'Reconnecting...',
  'common.online': 'Online',
  'common.offline': 'Offline',
  'common.unsavedChanges': 'Unsaved changes',
  'common.saving': 'Saving...',
  'common.saved': 'Saved',
  // ── Chat — composer ──────────────────────────────────────────────────
  'chat.composer.placeholder': 'Type a message...',
  'chat.composer.placeholderWithAttachment': 'Add a message (optional)...',
  'chat.composer.send': 'Send',
  'chat.composer.stop': 'Stop',
  'chat.composer.attach': 'Attach file',
  'chat.composer.attachments': 'Attachments',
  'chat.composer.removeAttachment': 'Remove attachment',
  'chat.composer.contextControls': 'Context controls',
  'chat.composer.modelSwitch': 'Switch model',
  'chat.composer.settings': 'Composer settings',
  'chat.composer.mentionAgent': 'Mention an agent',
  'chat.composer.slashCommand': 'Slash command',
  'chat.composer.voiceInput': 'Voice input',
  'chat.composer.voiceInputStop': 'Stop voice input',
  'chat.composer.charCount': '{count} characters',
  'chat.composer.tokenCount': '{count} tokens',
  'chat.composer.pin': 'Pin',
  'chat.composer.unpin': 'Unpin',
  'chat.composer.pinned': 'Pinned',
  'chat.composer.clearContext': 'Clear context',
  'chat.composer.editMessage': 'Edit message',
  'chat.composer.regenerate': 'Regenerate response',
  // ── Chat — header ────────────────────────────────────────────────────
  'chat.header.newChat': 'New chat',
  'chat.header.sessions': 'Sessions',
  'chat.header.renameSession': 'Rename session',
  'chat.header.deleteSession': 'Delete session',
  'chat.header.shareSession': 'Share session',
  'chat.header.exportSession': 'Export session',
  'chat.header.clearAll': 'Clear all sessions',
  'chat.header.sessionMenu': 'Session menu',
  'chat.header.providers': 'Switch provider',
  'chat.header.connectionStatus': 'Connection status',
  // ── Chat — empty state ───────────────────────────────────────────────
  'chat.empty.title': 'Start a new conversation',
  'chat.empty.subtitle': 'Ask anything, or try one of these:',
  'chat.empty.suggestion1': 'Explain a concept',
  'chat.empty.suggestion2': 'Help me write code',
  'chat.empty.suggestion3': 'Brainstorm ideas',
  'chat.empty.suggestion4': 'Summarize a document',
  'chat.empty.beginSession': 'Begin a session',
  'chat.empty.tagline': 'Agent chat · live tools · memory · full observability',
  'chat.empty.suggestionAnalyze': 'Analyze workspace',
  'chat.empty.suggestionSave': 'Save a preference',
  'chat.empty.suggestionCreate': 'Create a file',
  'chat.empty.noSessions': 'No conversations yet',
  'chat.empty.noSessionsDesc': 'Start your first conversation to see it here.',
  // ── Chat — message list ──────────────────────────────────────────────
  'chat.messageList.scrollBottom': 'Scroll to bottom',
  'chat.messageList.newMessages': 'New messages',
  'chat.messageList.unreadCount': '{count} unread',
  'chat.messageList.loadingHistory': 'Loading conversation history...',
  'chat.messageList.noMoreMessages': 'No more messages',
  'chat.messageList.copyError': 'Failed to copy',
  'chat.messageList.thinking': 'Thinking...',
  'chat.messageList.streaming': 'Streaming...',
  'chat.messageList.stopped': 'Stopped',
  'chat.messageList.searchPlaceholder': 'Search messages...',
  'chat.messageList.searchNoMatches': 'No matches',
  'chat.messageList.searchMatchOf': '{current} of {total}',
  'chat.messageList.searchPrevious': 'Previous match',
  'chat.messageList.searchNext': 'Next match',
  'chat.messageList.searchClose': 'Close search',
  'chat.messageList.collapseTool': 'Collapse tool call',
  'chat.messageList.expandTool': 'Expand tool call',
  // ── Chat — message item ──────────────────────────────────────────────
  'chat.message.you': 'You',
  'chat.message.assistant': 'Assistant',
  'chat.message.copy': 'Copy',
  'chat.message.copySuccess': 'Copied to clipboard',
  'chat.message.copyError': 'Failed to copy',
  'chat.message.regenerate': 'Regenerate',
  'chat.message.edit': 'Edit',
  'chat.message.editSave': 'Save changes',
  'chat.message.editCancel': 'Cancel edit',
  'chat.message.share': 'Share',
  'chat.message.delete': 'Delete',
  'chat.message.retry': 'Retry',
  'chat.message.reportIssue': 'Report issue',
  'chat.message.viewSources': 'View sources',
  'chat.message.thinking': 'Thinking process',
  'chat.message.tokensUsed': '{count} tokens used',
  'chat.message.duration': 'Duration: {duration}',
  'chat.message.edited': 'edited',
  'chat.message.failedToSend': 'Failed to send',
  'chat.message.failedToRegenerate': 'Failed to regenerate',
  'chat.message.cancelled': 'Cancelled',
  // ── Chat — tool labels (used in message-item + chat-message-list) ────
  'chat.tool.read': 'Reading file',
  'chat.tool.write': 'Writing file',
  'chat.tool.edit': 'Editing file',
  'chat.tool.bash': 'Running command',
  'chat.tool.glob': 'Finding files',
  'chat.tool.grep': 'Searching content',
  'chat.tool.webFetch': 'Fetching web page',
  'chat.tool.webSearch': 'Searching the web',
  'chat.tool.task': 'Launching subtask',
  'chat.tool.todoWrite': 'Updating todos',
  'chat.tool.notebookEdit': 'Editing notebook',
  'chat.tool.exitPlanMode': 'Exiting plan mode',
  'chat.tool.askFollowup': 'Asking follow-up question',
  'chat.tool.compileResult': 'Compiling results',
  // Tool verbs (progressive form used in ToolCallPill)
  'chat.tool.verb.reading': 'Reading',
  'chat.tool.verb.writing': 'Writing',
  'chat.tool.verb.editing': 'Editing',
  'chat.tool.verb.searching': 'Searching',
  'chat.tool.verb.executing': 'Executing',
  'chat.tool.verb.remembering': 'Remembering',
  'chat.tool.verb.browsing': 'Browsing',
  'chat.tool.verb.analyzing': 'Analyzing',
  'chat.tool.verb.delegating': 'Delegating',
  'chat.tool.verb.speaking': 'Speaking',
  'chat.tool.verb.working': 'Working',
  // Tool display labels (compact form shown in collapsed pill)
  'chat.tool.label.click': 'Click Element',
  'chat.tool.label.type': 'Type Text',
  'chat.tool.label.press': 'Press Key',
  'chat.tool.label.scroll': 'Scroll',
  'chat.tool.label.back': 'Back',
  'chat.tool.label.getImages': 'Get Images',
  'chat.tool.label.vision': 'Vision Capture',
  'chat.tool.label.closeBrowser': 'Close Browser',
  'chat.tool.label.executeCode': 'Execute Code',
  'chat.tool.label.process': 'Process',
  'chat.tool.label.parallel': 'Parallel Tools',
  'chat.tool.label.todo': 'Todo',
  'chat.tool.label.cronjob': 'Cron Job',
  'chat.tool.label.delegate': 'Delegate Task',
  'chat.tool.label.mixture': 'Mixture of Agents',
  'chat.tool.label.sessionSearch': 'Search Sessions',
  'chat.tool.label.clarify': 'Clarify',
  'chat.tool.label.skillManage': 'Manage Skill',
  'chat.tool.label.visionAnalyze': 'Analyze Image',
  'chat.tool.label.imageGenerate': 'Generate Image',
  'chat.tool.label.sendMessage': 'Send Message',
  'chat.tool.label.tts': 'Text to Speech',
  'chat.tool.label.honchoProfile': 'Honcho Profile',
  'chat.tool.label.honchoSearch': 'Honcho Search',
  'chat.tool.label.honchoContext': 'Honcho Context',
  'chat.tool.label.haEntities': 'HA Entities',
  'chat.tool.label.haState': 'HA State',
  'chat.tool.label.haServices': 'HA Services',
  'chat.tool.label.webSearchShort': 'Web Search',
  'chat.tool.label.webExtract': 'Web Extract',
  'chat.tool.label.openPage': 'Open Page',
  'chat.tool.label.snapshot': 'Snapshot',
  // Tool display labels — file-context templates (use {file} interpolation)
  'chat.tool.template.read': 'read {file}',
  'chat.tool.template.edit': 'edit {file}',
  'chat.tool.template.write': 'write {file}',
  'chat.tool.template.search': 'search "{pattern}"',
  'chat.tool.template.browser': 'browser {action}',
  'chat.tool.template.exec': 'exec {command}',
  // Tool display labels — bare forms
  'chat.tool.bare.read': 'read file',
  'chat.tool.bare.edit': 'edit file',
  'chat.tool.bare.write': 'write file',
  'chat.tool.bare.search': 'search files',
  'chat.tool.bare.browser': 'browser',
  'chat.tool.bare.exec': 'exec',
  'chat.tool.bare.memorySearch': 'memory search',
  'chat.tool.bare.saveMemory': 'save memory',
  'chat.tool.bare.memoryGet': 'memory get',
  'chat.tool.bare.webFetch': 'web fetch',
  'chat.tool.bare.skillView': 'view skill',
  // ── Chat — connection status ────────────────────────────────────────
  'chat.connection.connected': 'Connected',
  'chat.connection.disconnected': 'Connection lost',
  'chat.connection.reconnecting': 'Reconnecting...',
  'chat.connection.reconnected': 'Reconnected',
  'chat.connection.failedReconnect': 'Failed to reconnect',
  'chat.connection.authExpired': 'Authentication expired',
  'chat.connection.authExpiredDesc': 'Please sign in again to continue.',
  'chat.connection.serverError': 'Server error',
  'chat.connection.serverErrorDesc': 'The server encountered an error. Please try again.',
  'chat.connection.rateLimited': 'Rate limited',
  'chat.connection.rateLimitedDesc': 'Too many requests. Please wait a moment.',
  'chat.connection.failedToSend': 'Failed to send message',
  'chat.connection.failedToSendDesc': 'The message could not be delivered. Tap retry to try again.',
  'chat.connection.retry': 'Retry',
  'chat.connection.dismiss': 'Dismiss',
  // ── Chat — sidebar ───────────────────────────────────────────────────
  'chat.sidebar.title': 'Conversations',
  'chat.sidebar.search': 'Search conversations',
  'chat.sidebar.noResults': 'No conversations found',
  'chat.sidebar.today': 'Today',
  'chat.sidebar.yesterday': 'Yesterday',
  'chat.sidebar.previous7Days': 'Previous 7 days',
  'chat.sidebar.previous30Days': 'Previous 30 days',
  'chat.sidebar.older': 'Older',
  'chat.sidebar.pinned': 'Pinned',
  'chat.sidebar.newChat': 'New chat',
  'chat.sidebar.deleteAll': 'Delete all',
  'chat.sidebar.deleteAllConfirm': 'Are you sure you want to delete all conversations? This cannot be undone.',
  'chat.sidebar.deleteAllConfirmCta': 'Delete all',
  'chat.sidebar.renameConfirm': 'Rename',
  'chat.sidebar.deleteConfirm': 'Delete',
  'chat.sidebar.deleteConfirmDesc': 'Are you sure you want to delete this conversation? This cannot be undone.',
  'chat.sidebar.collapse': 'Collapse sidebar',
  'chat.sidebar.expand': 'Expand sidebar',
  'chat.sidebar.startNew': 'Start a new conversation',
  // ── Chat — providers dialog ─────────────────────────────────────────
  'chat.providers.title': 'Switch provider',
  'chat.providers.subtitle': 'Choose a provider and model for this conversation',
  'chat.providers.current': 'Current',
  'chat.providers.available': 'Available providers',
  'chat.providers.connect': 'Connect',
  'chat.providers.disconnect': 'Disconnect',
  'chat.providers.configure': 'Configure',
  'chat.providers.notConfigured': 'Not configured',
  'chat.providers.models': 'Available models',
  'chat.providers.use': 'Use',
  'chat.providers.using': 'In use',
  'chat.providers.close': 'Close',
  // ── Chat — context bar ──────────────────────────────────────────────
  'chat.contextBar.title': 'Active context',
  'chat.contextBar.files': '{count} files',
  'chat.contextBar.clear': 'Clear context',
  'chat.contextBar.tokens': '{count} / {max} tokens',
  'chat.contextBar.overLimit': 'Over token limit',
  // ── Chat — session (rename/delete dialogs) ──────────────────────────
  'chat.session.renameTitle': 'Rename conversation',
  'chat.session.renamePlaceholder': 'Conversation name',
  'chat.session.renameSave': 'Save',
  'chat.session.deleteTitle': 'Delete conversation',
  'chat.session.deleteDesc': 'This action cannot be undone. All messages in this conversation will be permanently removed.',
  'chat.session.deleteCta': 'Delete',
} as const

export type TranslationKey = keyof typeof EN
type LocaleTranslations = Record<TranslationKey, string>

/**
 * Persian (Farsi) translation table.
 *
 * Covers all keys defined in `EN`. Strings are written in the standard
 * Iranian Persian register, with Persian digits used only where a
 * locale-aware number formatter would render the same way (we keep
 * ASCII digits inside technical/code-style strings to avoid breaking
 * copy-paste of identifiers).
 *
 * Note: Persian is right-to-left; the layout engine relies on
 * `getDir('fa') === 'rtl'` to flip the document direction.
 */
const FA: LocaleTranslations = {
  // ── Nav ──────────────────────────────────────────────────────────────
  'nav.dashboard': 'داشبورد',
  'nav.chat': 'گفتگو',
  'nav.files': 'پرونده‌ها',
  'nav.terminal': 'ترمینال',
  'nav.jobs': 'کارها',
  'nav.tasks': 'وظایف',
  'nav.memory': 'حافظه',
  'nav.skills': 'مهارت‌ها',
  'nav.profiles': 'نمایه‌ها',
  'nav.settings': 'تنظیمات',
  'nav.agents': 'عامل‌ها',
  'nav.swarm': 'گردان',
  'nav.gateway': 'دروازه',
  'nav.playground': 'زمین بازی',
  'nav.agora': 'آگورا',
  'nav.echoStudio': 'استودیو اکو',
  'nav.mcp': 'MCP',
  'nav.crew': 'تیم',
  // ── Skills ───────────────────────────────────────────────────────────
  'skills.installed': 'نصب‌شده',
  'skills.marketplace': 'بازار',
  'skills.search': 'جستجو بر اساس نام، برچسب یا توضیح',
  'skills.noResults': 'مهارتی یافت نشد',
  // ── Profiles ─────────────────────────────────────────────────────────
  'profiles.profiles': 'نمایه‌ها',
  'profiles.monitoring':'پایش',
  // ── Tasks ────────────────────────────────────────────────────────────
  'tasks.title': 'وظایف',
  'tasks.newTask': 'وظیفهٔ تازه',
  'tasks.backlog': 'انباشته',
  'tasks.todo': 'در انتظار',
  'tasks.inProgress': 'در حال انجام',
  'tasks.review': 'بازبینی',
  'tasks.done': 'انجام‌شده',
  // ── Jobs ─────────────────────────────────────────────────────────────
  'jobs.title': 'کارها',
  'jobs.newJob': 'کارِ تازه',
  // ── Settings ─────────────────────────────────────────────────────────
  'settings.title': 'تنظیمات',
  'settings.language': 'زبان',
  'settings.languageDesc': 'زبان نمایش رابط کاربری فضای کار را انتخاب کنید.',
  // ── Common ───────────────────────────────────────────────────────────
  'common.save': 'ذخیره',
  'common.cancel': 'لغو',
  'common.delete': 'حذف',
  'common.search': 'جستجو',
  'common.loading': 'در حال بارگذاری…',
  'common.error': 'خطا',
  'common.noData': 'داده‌ای موجود نیست',
  'common.close': 'بستن',
  'common.retry': 'تلاش دوباره',
  'common.refresh': 'بازه‌گذاری',
  'common.copy': 'رونوشت',
  'common.copied': 'رونوشت شد',
  'common.reset': 'بازنشانی',
  'common.confirm': 'تأیید',
  'common.apply': 'اعمال',
  'common.ok': 'تأیید',
  'common.yes': 'بله',
  'common.no': 'خیر',
  'common.back': 'بازگشت',
  'common.next': 'بعدی',
  'common.previous': 'قبلی',
  'common.done': 'انجام شد',
  'common.edit': 'ویرایش',
  'common.rename': 'تغییر نام',
  'common.share': 'هم‌رسانی',
  'common.export': 'برون‌ریزی',
  'common.import': 'درون‌ریزی',
  'common.download': 'دانلود',
  'common.upload': 'بارگذاری',
  'common.add': 'افزودن',
  'common.remove': 'حذف',
  'common.clear': 'پاک‌سازی',
  'common.selectAll': 'گزینش همه',
  'common.deselectAll': 'لغو گزینش همه',
  'common.more': 'بیشتر',
  'common.less': 'کمتر',
  'common.expand': 'گسترش',
  'common.collapse': 'جمع‌کردن',
  'common.enable': 'فعال‌سازی',
  'common.disable': 'غیرفعال‌سازی',
  'common.required': 'الزامی',
  'common.optional': 'اختیاری',
  'common.unknown': 'نامشخص',
  'common.continue': 'ادامه',
  'common.skip': 'رد شدن',
  'common.finish': 'پایان',
  'common.disconnected': 'قطع ارتباط',
  'common.reconnecting': 'در حال اتصال مجدد…',
  'common.online': 'برخط',
  'common.offline': 'برون‌خط',
  'common.unsavedChanges': 'تغییرات ذخیره‌نشده',
  'common.saving': 'در حال ذخیره…',
  'common.saved': 'ذخیره شد',
  // ── Chat — composer ──────────────────────────────────────────────────
  'chat.composer.placeholder': 'پیام بنویسید…',
  'chat.composer.placeholderWithAttachment': 'پیام اضافه کنید (اختیاری)…',
  'chat.composer.send': 'ارسال',
  'chat.composer.stop': 'توقف',
  'chat.composer.attach': 'پیوست فایل',
  'chat.composer.attachments': 'پیوست‌ها',
  'chat.composer.removeAttachment': 'حذف پیوست',
  'chat.composer.contextControls': 'کنترل‌های زمینه',
  'chat.composer.modelSwitch': 'تعویض مدل',
  'chat.composer.settings': 'تنظیمات کامپوزر',
  'chat.composer.mentionAgent': 'اشاره به یک عامل',
  'chat.composer.slashCommand': 'فرمان اسلش',
  'chat.composer.voiceInput': 'ورودی صوتی',
  'chat.composer.voiceInputStop': 'توقف ورودی صوتی',
  'chat.composer.charCount': '{count} نویسه',
  'chat.composer.tokenCount': '{count} توکن',
  'chat.composer.pin': 'سنجاق',
  'chat.composer.unpin': 'حذف سنجاق',
  'chat.composer.pinned': 'سنجاق‌شده',
  'chat.composer.clearContext': 'پاک‌سازی زمینه',
  'chat.composer.editMessage': 'ویرایش پیام',
  'chat.composer.regenerate': 'بازتولید پاسخ',
  // ── Chat — header ────────────────────────────────────────────────────
  'chat.header.newChat': 'گفتگوی جدید',
  'chat.header.sessions': 'نشست‌ها',
  'chat.header.renameSession': 'تغییر نام نشست',
  'chat.header.deleteSession': 'حذف نشست',
  'chat.header.shareSession': 'هم‌رسانی نشست',
  'chat.header.exportSession': 'برون‌ریزی نشست',
  'chat.header.clearAll': 'پاک‌سازی همه نشست‌ها',
  'chat.header.sessionMenu': 'منوی نشست',
  'chat.header.providers': 'تعویض ارائه‌دهنده',
  'chat.header.connectionStatus': 'وضعیت اتصال',
  // ── Chat — empty state ───────────────────────────────────────────────
  'chat.empty.title': 'گفتگوی جدیدی را آغاز کنید',
  'chat.empty.subtitle': 'هرچیزی بپرسید، یا یکی از این پیشنهادها را امتحان کنید:',
  'chat.empty.suggestion1': 'توضیح یک مفهوم',
  'chat.empty.suggestion2': 'کمک در نوشتن کد',
  'chat.empty.suggestion3': 'ایده‌پردازی',
  'chat.empty.suggestion4': 'خلاصه‌کردن یک سند',
  'chat.empty.beginSession': 'نشست را آغاز کنید',
  'chat.empty.tagline': 'گفتگوی عامل · ابزارهای زنده · حافظه · مشاهدهٔ کامل',
  'chat.empty.suggestionAnalyze': 'تحلیل فضای کار',
  'chat.empty.suggestionSave': 'ذخیرهٔ یک ترجیح',
  'chat.empty.suggestionCreate': 'ایجاد یک فایل',
  'chat.empty.noSessions': 'هنوز گفتگویی وجود ندارد',
  'chat.empty.noSessionsDesc': 'برای دیدن گفتگوهایتان، نخستین گفتگو را آغاز کنید.',
  // ── Chat — message list ──────────────────────────────────────────────
  'chat.messageList.scrollBottom': 'رفتن به انتها',
  'chat.messageList.newMessages': 'پیام‌های جدید',
  'chat.messageList.unreadCount': '{count} خوانده‌نشده',
  'chat.messageList.loadingHistory': 'در حال بارگذاری تاریخچه گفتگو…',
  'chat.messageList.noMoreMessages': 'پیام دیگری موجود نیست',
  'chat.messageList.copyError': 'رونوشت ناموفق بود',
  'chat.messageList.thinking': 'در حال تفکر…',
  'chat.messageList.streaming': 'در حال پخش…',
  'chat.messageList.stopped': 'متوقف شد',
  'chat.messageList.searchPlaceholder': 'جستجوی پیام‌ها…',
  'chat.messageList.searchNoMatches': 'موردی یافت نشد',
  'chat.messageList.searchMatchOf': '{current} از {total}',
  'chat.messageList.searchPrevious': 'مورد قبلی',
  'chat.messageList.searchNext': 'مورد بعدی',
  'chat.messageList.searchClose': 'بستن جستجو',
  'chat.messageList.collapseTool': 'جمع‌کردن فراخوانی ابزار',
  'chat.messageList.expandTool': 'گسترش فراخوانی ابزار',
  // ── Chat — message item ──────────────────────────────────────────────
  'chat.message.you': 'شما',
  'chat.message.assistant': 'دستیار',
  'chat.message.copy': 'رونوشت',
  'chat.message.copySuccess': 'در بریده‌دان رونوشت شد',
  'chat.message.copyError': 'رونوشت ناموفق بود',
  'chat.message.regenerate': 'بازتولید',
  'chat.message.edit': 'ویرایش',
  'chat.message.editSave': 'ذخیره تغییرات',
  'chat.message.editCancel': 'لغو ویرایش',
  'chat.message.share': 'هم‌رسانی',
  'chat.message.delete': 'حذف',
  'chat.message.retry': 'تلاش دوباره',
  'chat.message.reportIssue': 'گزارش مشکل',
  'chat.message.viewSources': 'نمایش منابع',
  'chat.message.thinking': 'فرایند تفکر',
  'chat.message.tokensUsed': '{count} توکن استفاده شد',
  'chat.message.duration': 'مدت: {duration}',
  'chat.message.edited': 'ویرایش‌شده',
  'chat.message.failedToSend': 'ارسال ناموفق بود',
  'chat.message.failedToRegenerate': 'بازتولید ناموفق بود',
  'chat.message.cancelled': 'لغو شد',
  // ── Chat — tool labels ───────────────────────────────────────────────
  'chat.tool.read': 'در حال خواندن فایل',
  'chat.tool.write': 'در حال نوشتن فایل',
  'chat.tool.edit': 'در حال ویرایش فایل',
  'chat.tool.bash': 'در حال اجرای فرمان',
  'chat.tool.glob': 'در حال یافتن فایل‌ها',
  'chat.tool.grep': 'در حال جستجوی محتوا',
  'chat.tool.webFetch': 'در حال دریافت صفحه وب',
  'chat.tool.webSearch': 'در حال جستجوی وب',
  'chat.tool.task': 'در حال اجرای زیرکار',
  'chat.tool.todoWrite': 'در حال به‌روزرسانی کارها',
  'chat.tool.notebookEdit': 'در حال ویرایش دفترچه',
  'chat.tool.exitPlanMode': 'در حال خروج از حالت برنامه',
  'chat.tool.askFollowup': 'در حال پرسیدن پرسش پیگیری',
  'chat.tool.compileResult': 'در حال تدوین نتایج',
  // Tool verbs
  'chat.tool.verb.reading': 'در حال خواندن',
  'chat.tool.verb.writing': 'در حال نوشتن',
  'chat.tool.verb.editing': 'در حال ویرایش',
  'chat.tool.verb.searching': 'در حال جستجو',
  'chat.tool.verb.executing': 'در حال اجرا',
  'chat.tool.verb.remembering': 'در حال یادآوری',
  'chat.tool.verb.browsing': 'در حال مرور',
  'chat.tool.verb.analyzing': 'در حال تحلیل',
  'chat.tool.verb.delegating': 'در حال تفویض',
  'chat.tool.verb.speaking': 'در حال گفتن',
  'chat.tool.verb.working': 'در حال کار',
  // Tool display labels (compact form)
  'chat.tool.label.click': 'کلیک عنصر',
  'chat.tool.label.type': 'تایپ متن',
  'chat.tool.label.press': 'فشردن کلید',
  'chat.tool.label.scroll': 'پیمایش',
  'chat.tool.label.back': 'بازگشت',
  'chat.tool.label.getImages': 'دریافت تصاویر',
  'chat.tool.label.vision': 'ضبط دیداری',
  'chat.tool.label.closeBrowser': 'بستن مرورگر',
  'chat.tool.label.executeCode': 'اجرای کد',
  'chat.tool.label.process': 'فرایند',
  'chat.tool.label.parallel': 'ابزارهای موازی',
  'chat.tool.label.todo': 'کارها',
  'chat.tool.label.cronjob': 'کار زمان‌بندی‌شده',
  'chat.tool.label.delegate': 'تفویض کار',
  'chat.tool.label.mixture': 'ترکیب عامل‌ها',
  'chat.tool.label.sessionSearch': 'جستجوی نشست‌ها',
  'chat.tool.label.clarify': 'توضیح',
  'chat.tool.label.skillManage': 'مدیریت مهارت',
  'chat.tool.label.visionAnalyze': 'تحلیل تصویر',
  'chat.tool.label.imageGenerate': 'تولید تصویر',
  'chat.tool.label.sendMessage': 'ارسال پیام',
  'chat.tool.label.tts': 'متن به گفتار',
  'chat.tool.label.honchoProfile': 'نمایه Honcho',
  'chat.tool.label.honchoSearch': 'جستجوی Honcho',
  'chat.tool.label.honchoContext': 'زمینه Honcho',
  'chat.tool.label.haEntities': 'موجودهای HA',
  'chat.tool.label.haState': 'وضعیت HA',
  'chat.tool.label.haServices': 'سرویس‌های HA',
  'chat.tool.label.webSearchShort': 'جستجوی وب',
  'chat.tool.label.webExtract': 'استخراج وب',
  'chat.tool.label.openPage': 'باز کردن صفحه',
  'chat.tool.label.snapshot': 'تصویر لحظه‌ای',
  // Tool display labels — file-context templates
  'chat.tool.template.read': 'خواندن {file}',
  'chat.tool.template.edit': 'ویرایش {file}',
  'chat.tool.template.write': 'نوشتن {file}',
  'chat.tool.template.search': 'جستجوی «{pattern}»',
  'chat.tool.template.browser': 'مرورگر {action}',
  'chat.tool.template.exec': 'اجرای {command}',
  // Tool display labels — bare forms
  'chat.tool.bare.read': 'خواندن فایل',
  'chat.tool.bare.edit': 'ویرایش فایل',
  'chat.tool.bare.write': 'نوشتن فایل',
  'chat.tool.bare.search': 'جستجوی فایل‌ها',
  'chat.tool.bare.browser': 'مرورگر',
  'chat.tool.bare.exec': 'اجرا',
  'chat.tool.bare.memorySearch': 'جستجوی حافظه',
  'chat.tool.bare.saveMemory': 'ذخیره حافظه',
  'chat.tool.bare.memoryGet': 'دریافت حافظه',
  'chat.tool.bare.webFetch': 'دریافت وب',
  'chat.tool.bare.skillView': 'نمایش مهارت',
  // ── Chat — connection status ────────────────────────────────────────
  'chat.connection.connected': 'متصل',
  'chat.connection.disconnected': 'ارتباط قطع شد',
  'chat.connection.reconnecting': 'در حال اتصال مجدد…',
  'chat.connection.reconnected': 'اتصال مجدد برقرار شد',
  'chat.connection.failedReconnect': 'اتصال مجدد ناموفق بود',
  'chat.connection.authExpired': 'احراز هویت منقضی شده',
  'chat.connection.authExpiredDesc': 'لطفاً دوباره وارد شوید تا ادامه دهید.',
  'chat.connection.serverError': 'خطای سرور',
  'chat.connection.serverErrorDesc': 'سرور با خطا مواجه شد. لطفاً دوباره تلاش کنید.',
  'chat.connection.rateLimited': 'محدودیت نرخ درخواست',
  'chat.connection.rateLimitedDesc': 'درخواست‌های بیش از حد. لطفاً کمی صبر کنید.',
  'chat.connection.failedToSend': 'ارسال پیام ناموفق بود',
  'chat.connection.failedToSendDesc': 'پیام قابل تحویل نبود. برای تلاش دوباره، روی «تلاش مجدد» بزنید.',
  'chat.connection.retry': 'تلاش دوباره',
  'chat.connection.dismiss': 'بستن',
  // ── Chat — sidebar ───────────────────────────────────────────────────
  'chat.sidebar.title': 'گفتگوها',
  'chat.sidebar.search': 'جستجوی گفتگوها',
  'chat.sidebar.noResults': 'گفتگویی یافت نشد',
  'chat.sidebar.today': 'امروز',
  'chat.sidebar.yesterday': 'دیروز',
  'chat.sidebar.previous7Days': '۷ روز گذشته',
  'chat.sidebar.previous30Days': '۳۰ روز گذشته',
  'chat.sidebar.older': 'قدیمی‌تر',
  'chat.sidebar.pinned': 'سنجاق‌شده',
  'chat.sidebar.newChat': 'گفتگوی جدید',
  'chat.sidebar.deleteAll': 'حذف همه',
  'chat.sidebar.deleteAllConfirm': 'مطمئنید می‌خواهید همه گفتگوها را حذف کنید؟ این عمل قابل بازگشت نیست.',
  'chat.sidebar.deleteAllConfirmCta': 'حذف همه',
  'chat.sidebar.renameConfirm': 'تغییر نام',
  'chat.sidebar.deleteConfirm': 'حذف',
  'chat.sidebar.deleteConfirmDesc': 'مطمئنید می‌خواهید این گفتگو را حذف کنید؟ این عمل قابل بازگشت نیست.',
  'chat.sidebar.collapse': 'جمع‌کردن نوار کناری',
  'chat.sidebar.expand': 'گسترش نوار کناری',
  'chat.sidebar.startNew': 'گفتگوی جدیدی را آغاز کنید',
  // ── Chat — providers dialog ─────────────────────────────────────────
  'chat.providers.title': 'تعویض ارائه‌دهنده',
  'chat.providers.subtitle': 'یک ارائه‌دهنده و مدل برای این گفتگو انتخاب کنید',
  'chat.providers.current': 'فعلی',
  'chat.providers.available': 'ارائه‌دهنده‌های موجود',
  'chat.providers.connect': 'اتصال',
  'chat.providers.disconnect': 'قطع اتصال',
  'chat.providers.configure': 'پیکربندی',
  'chat.providers.notConfigured': 'پیکربندی نشده',
  'chat.providers.models': 'مدل‌های موجود',
  'chat.providers.use': 'استفاده',
  'chat.providers.using': 'در حال استفاده',
  'chat.providers.close': 'بستن',
  // ── Chat — context bar ──────────────────────────────────────────────
  'chat.contextBar.title': 'زمینه فعال',
  'chat.contextBar.files': '{count} فایل',
  'chat.contextBar.clear': 'پاک‌سازی زمینه',
  'chat.contextBar.tokens': '{count} / {max} توکن',
  'chat.contextBar.overLimit': 'بیش از حد مجاز توکن',
  // ── Chat — session ───────────────────────────────────────────────────
  'chat.session.renameTitle': 'تغییر نام گفتگو',
  'chat.session.renamePlaceholder': 'نام گفتگو',
  'chat.session.renameSave': 'ذخیره',
  'chat.session.deleteTitle': 'حذف گفتگو',
  'chat.session.deleteDesc': 'این عمل قابل بازگشت نیست. همه پیام‌های این گفتگو برای همیشه حذف خواهند شد.',
  'chat.session.deleteCta': 'حذف',
}

const LOCALES: Record<LocaleId, LocaleTranslations> = {
  en: EN,
  fa: FA,
}

export const LOCALE_LABELS: Record<LocaleId, string> = {
  en: 'English',
  fa: 'فارسی',
}

const STORAGE_KEY = 'hermes-workspace-locale'

/**
 * Set of locale IDs that render right-to-left.
 * Currently only Persian (fa) is RTL in this app.
 */
const RTL_LOCALES: ReadonlySet<LocaleId> = new Set<LocaleId>(['fa'])

/**
 * Returns the text direction ('rtl' or 'ltr') for a given locale.
 * Used by `applyDocumentDir` and any component that needs to know the
 * active direction without touching the DOM.
 */
export function getDir(locale: LocaleId): 'rtl' | 'ltr' {
  return RTL_LOCALES.has(locale) ? 'rtl' : 'ltr'
}

/**
 * Returns the BCP-47 language tag to use on <html lang="..."> for a
 * given locale ID. Persian maps to 'fa' (covers both Iran and Dari);
 * all other locales map to their own ID directly.
 */
export function getHtmlLang(locale: LocaleId): string {
  return locale
}

export function getLocale(): LocaleId {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && stored in LOCALES) return stored as LocaleId
  const full = navigator.language
  if (full in LOCALES) return full as LocaleId
  const lang = full.split('-')[0]
  if (lang in LOCALES) return lang as LocaleId
  return 'en'
}

/**
 * Apply the locale's text direction and BCP-47 language tag to the
 * document root. Safe to call during the inline bootstrap script that
 * runs before React hydrates — `typeof document !== 'undefined'`
 * guards against SSR.
 *
 * This is the single source of truth for `dir` and `lang` on <html>.
 * Components should NOT set `dir` themselves; they should rely on the
 * value propagated from here.
 */
export function applyDocumentDir(locale: LocaleId): void {
  if (typeof document === 'undefined') return
  const dir = getDir(locale)
  const lang = getHtmlLang(locale)
  const html = document.documentElement
  html.dir = dir
  html.lang = lang
  // Tag the root with a data attribute so CSS can target RTL/LTR
  // contexts even when Tailwind's rtl:/ltr: variants are not enough
  // (e.g. for @keyframes animations that need to flip).
  html.dataset.dir = dir
}

export function setLocale(id: LocaleId): void {
  localStorage.setItem(STORAGE_KEY, id)
  applyDocumentDir(id)
  window.dispatchEvent(new CustomEvent('locale-change', { detail: id }))
}

/**
 * Returns true when the active locale renders right-to-left.
 * Convenience wrapper for components that need a boolean.
 */
export function isRtl(): boolean {
  return getDir(getLocale()) === 'rtl'
}

/**
 * Parameters that can be substituted into a translation string.
 *
 * Values may be strings or numbers. Numbers are stringified via
 * `String(value)` (NOT `Intl.NumberFormat`) so callers control locale-
 * aware digit rendering — most call sites want ASCII digits even under
 * Persian, since mixed Latin/Persian numerals look inconsistent.
 *
 * Example:
 *   t('chat.unreadCount', { count: 5 })
 *   // EN: '{count} unread messages' → '5 unread messages'
 *   // FA: '{count} پیام خوانده‌نشده' → '5 پیام خوانده‌نشده'
 */
export type TranslationParams = Record<string, string | number>

/**
 * Replace {placeholder} tokens in a translation string with the
 * corresponding values from `params`. Tokens that have no matching
 * key in `params` are left untouched so translators can include
 * literal curly braces in copy if needed.
 *
 * This is intentionally a minimal interpolation engine — no conditionals,
 * no pluralization, no ICU MessageFormat. Plurals are handled at the
 * call site by choosing a different key based on the count (e.g.
 * 'chat.unreadCount.one' vs 'chat.unreadCount.many'); this keeps the
 * i18n module small and avoids pulling in a runtime dependency.
 */
function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = params[key]
    return value === undefined || value === null ? match : String(value)
  })
}

export function t(key: TranslationKey, params?: TranslationParams): string {
  const locale = getLocale()
  const raw = LOCALES[locale]?.[key] ?? LOCALES.en[key] ?? key
  return interpolate(raw, params)
}
