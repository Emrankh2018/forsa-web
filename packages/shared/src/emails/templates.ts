/**
 * Every email Forsa sends (roadmap step 6), ready for a sender on the VPS. Each template has a
 * subject, a title, a body and at most one action, in Arabic and English, with named placeholders
 * in braces. `renderEmail` fills them (escaping every value in the HTML) and returns the subject,
 * an HTML version with inline styles (email clients ignore stylesheets) and a plain-text version.
 * Nothing here sends anything. Callers pass values already formatted for the language (dates,
 * money, Arabic-Indic numerals).
 */
import type { Locale } from '../locale'

type Text = { ar: string; en: string }
export type EmailTemplate = {
  /** Who receives it, for the contract. */
  to: 'participant' | 'organisation' | 'trainer' | 'admin' | 'anyone'
  /** What triggers it, for the contract. */
  when: string
  placeholders: readonly string[]
  subject: Text
  title: Text
  body: Text
  cta?: { label: Text; path: string }
  note?: Text
}

const footer: Text = {
  ar: 'وصلتك هذه الرسالة لأن لديك حسابًا في فرصة. يمكنك تغيير ما يصلك من الإعدادات.',
  en: 'You received this because you have a Forsa account. You can change what you receive in settings.',
}
const brand: Text = { ar: 'فرصة', en: 'Forsa' }

export const emailTemplates = {
  signInCode: {
    to: 'anyone', when: 'requestSignInCode', placeholders: ['code'],
    subject: { ar: 'رمز الدخول إلى فرصة', en: 'Your Forsa sign-in code' },
    title: { ar: 'رمز الدخول: {code}', en: 'Your sign-in code: {code}' },
    body: { ar: 'اكتب هذا الرمز في صفحة الدخول. ينتهي بعد عشر دقائق، فلا تشاركه مع أحد.', en: 'Type this code on the sign-in page. It expires in ten minutes; do not share it with anyone.' },
    note: { ar: 'لم تطلب الدخول؟ تجاهل هذه الرسالة.', en: 'Did not ask to sign in? Ignore this email.' },
  },
  seatHeld: {
    to: 'participant', when: 'reserveWorkshopSeat', placeholders: ['workshop', 'amount', 'hours'],
    subject: { ar: 'حجزنا مقعدك: {workshop}', en: 'Your seat is held: {workshop}' },
    title: { ar: 'مقعدك محجوز', en: 'Your seat is held' },
    body: { ar: 'حجزنا لك مقعدًا في «{workshop}» لمدة {hours} ساعة. المبلغ {amount}، ويتواصل معك فريق فرصة لترتيب الدفع ثم يؤكد الحجز.', en: 'We are holding a seat for you in “{workshop}” for {hours} hours. The amount is {amount}; the Forsa team contacts you to arrange payment, then confirms the booking.' },
    cta: { label: { ar: 'افتح تعلّمي', en: 'Open my learning' }, path: '/me/learning' },
  },
  bookingConfirmed: {
    to: 'participant', when: 'markOrderPaid or waiveOrder', placeholders: ['workshop', 'date'],
    subject: { ar: 'تأكد حجزك: {workshop}', en: 'Booking confirmed: {workshop}' },
    title: { ar: 'تأكد مقعدك', en: 'Your seat is confirmed' },
    body: { ar: 'أكد فريق فرصة حجزك في «{workshop}» يوم {date}. رابط الورشة في صفحتك، ونذكّرك قبلها بيوم.', en: 'The Forsa team confirmed your booking in “{workshop}” on {date}. The workshop link is on your page, and we remind you the day before.' },
    cta: { label: { ar: 'افتح تعلّمي', en: 'Open my learning' }, path: '/me/learning' },
  },
  workshopReminder: {
    to: 'participant', when: 'one day before a confirmed workshop or session', placeholders: ['workshop', 'date'],
    subject: { ar: 'غدًا: {workshop}', en: 'Tomorrow: {workshop}' },
    title: { ar: 'موعدك غدًا', en: 'See you tomorrow' },
    body: { ar: '«{workshop}» يبدأ {date}. الرابط أو العنوان في صفحتك.', en: '“{workshop}” starts {date}. The link or the address is on your page.' },
    cta: { label: { ar: 'افتح تعلّمي', en: 'Open my learning' }, path: '/me/learning' },
  },
  dueReminder: {
    to: 'participant', when: 'two days before a project due date', placeholders: ['project', 'date'],
    subject: { ar: 'يقترب موعد التسليم: {project}', en: 'Hand-in date is close: {project}' },
    title: { ar: 'بقي يومان على التسليم', en: 'Two days to hand in' },
    body: { ar: 'موعد تسليم «{project}» هو {date}. سلّم ما أنجزته حتى لو لم يكتمل، واكتب ما ينقصه.', en: '“{project}” is due on {date}. Hand in what you have even if it is not finished, and say what is missing.' },
    cta: { label: { ar: 'افتح المشروع', en: 'Open the project' }, path: '/me/projects' },
  },
  handInReceived: {
    to: 'organisation', when: 'handIn', placeholders: ['participant', 'project'],
    subject: { ar: 'عمل جديد للمراجعة: {project}', en: 'New work to review: {project}' },
    title: { ar: 'سلّم {participant} عمله', en: '{participant} handed in their work' },
    body: { ar: 'وصل عمل جديد على «{project}». راجعه واكتب ملاحظاتك؛ المشارك يقرؤها كما كتبتها.', en: 'New work arrived on “{project}”. Review it and write your notes; the participant reads them as you wrote them.' },
    cta: { label: { ar: 'راجع العمل', en: 'Review the work' }, path: '/org/projects' },
  },
  reviewAccepted: {
    to: 'participant', when: 'reviewHandIn (accepted)', placeholders: ['company', 'project'],
    subject: { ar: 'قبلت {company} عملك', en: '{company} accepted your work' },
    title: { ar: 'قُبل عملك', en: 'Your work was accepted' },
    body: { ar: 'قبلت {company} عملك على «{project}». أصبح في سجلك مع ملاحظاتها ونقاط القوة التي سجلتها.', en: '{company} accepted your work on “{project}”. It is now on your record with their notes and the strengths they noted.' },
    cta: { label: { ar: 'اقرأ المراجعة', en: 'Read the review' }, path: '/me/projects' },
  },
  reviewChanges: {
    to: 'participant', when: 'reviewHandIn (changes requested)', placeholders: ['company', 'project'],
    subject: { ar: 'راجعت {company} عملك', en: '{company} reviewed your work' },
    title: { ar: 'طلبت {company} تعديلات', en: '{company} asked for changes' },
    body: { ar: 'اقرأ ملاحظات {company} على «{project}»، وسلّم النسخة التالية حين تجهز.', en: 'Read {company}’s notes on “{project}” and hand in the next version when you are ready.' },
    cta: { label: { ar: 'اقرأ المراجعة', en: 'Read the review' }, path: '/me/projects' },
  },
  reviewDeclined: {
    to: 'participant', when: 'reviewHandIn (declined)', placeholders: ['company', 'project'],
    subject: { ar: 'راجعت {company} عملك', en: '{company} reviewed your work' },
    title: { ar: 'لم يُقبل العمل هذه المرة', en: 'Not accepted this time' },
    body: { ar: 'لم تقبل {company} عملك على «{project}». ملاحظاتها تساعدك في المشروع القادم، وهناك مشاريع مفتوحة في مجالك.', en: '{company} did not accept your work on “{project}”. Their notes help with your next project, and there are open projects in your field.' },
    cta: { label: { ar: 'اقرأ المراجعة', en: 'Read the review' }, path: '/me/projects' },
  },
  companyInvitation: {
    to: 'participant', when: 'inviteTalent', placeholders: ['company'],
    subject: { ar: 'تود {company} التحدث معك', en: '{company} would like to talk to you' },
    title: { ar: 'شركة تريد التحدث معك', en: 'A company wants to talk to you' },
    body: { ar: 'أعجب {company} عملك. لا تصل بيانات تواصلك إليها إلا إذا قبلت الدعوة.', en: '{company} liked your work. Your contact details reach them only if you accept the invitation.' },
    cta: { label: { ar: 'اقرأ الدعوة', en: 'Read the invitation' }, path: '/me/invitations' },
  },
  organisationVerified: {
    to: 'organisation', when: 'verifyOrganisation', placeholders: ['organisation'],
    subject: { ar: 'تم التحقق من {organisation}', en: '{organisation} is verified' },
    title: { ar: 'أصبح بإمكانك نشر المشاريع', en: 'You can now post projects' },
    body: { ar: 'تحقق فريق فرصة من {organisation}. انشر مشروعك الأول، ويراجعه الفريق قبل أن يُفتح للمشاركين.', en: 'The Forsa team verified {organisation}. Post your first project; the team checks it before it opens to participants.' },
    cta: { label: { ar: 'انشر مشروعًا', en: 'Post a project' }, path: '/org/new-project' },
  },
  projectApproved: {
    to: 'organisation', when: 'approveProject', placeholders: ['project'],
    subject: { ar: 'فُتح مشروعك: {project}', en: 'Your project is open: {project}' },
    title: { ar: 'مشروعك مفتوح الآن', en: 'Your project is open' },
    body: { ar: 'وافق فريق فرصة على «{project}»، وأصبح يظهر للمشاركين.', en: 'The Forsa team approved “{project}”; participants can see it now.' },
    cta: { label: { ar: 'افتح المشروع', en: 'Open the project' }, path: '/org/projects' },
  },
  trainerApproved: {
    to: 'trainer', when: 'decideQueueItem (trainer approved)', placeholders: ['name'],
    subject: { ar: 'مرحبًا بك مدربًا في فرصة', en: 'Welcome to Forsa as a trainer' },
    title: { ar: 'تمت الموافقة على طلبك يا {name}', en: 'Your application is approved, {name}' },
    body: { ar: 'يمكنك الآن إنشاء ورشة أو جلسة فردية وإرسالها للنشر.', en: 'You can now create a workshop or a 1-to-1 session and send it for publishing.' },
    cta: { label: { ar: 'افتح صفحتك', en: 'Open your page' }, path: '/trainer' },
  },
  adminDigest: {
    to: 'admin', when: 'weekly', placeholders: ['count'],
    subject: { ar: 'ملخص الأسبوع: {count} أعمال بلا مراجعة', en: 'Weekly summary: {count} hand-ins without a review' },
    title: { ar: 'أعمال تنتظر مراجعة الشركات', en: 'Work waiting for company reviews' },
    body: { ar: 'هناك {count} أعمال مسلّمة لم تراجعها الشركات بعد. ذكّرها حتى لا ينتظر المشاركون طويلًا.', en: 'There are {count} hand-ins companies have not reviewed yet. Remind them so participants do not wait long.' },
    cta: { label: { ar: 'افتح الطوابير', en: 'Open the queues' }, path: '/admin/queues' },
  },
} satisfies Record<string, EmailTemplate>

export type EmailKind = keyof typeof emailTemplates

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

function fill(text: string, values: Record<string, string>, html: boolean) {
  return text.replace(/\{(\w+)\}/g, (_, k: string) => {
    if (!(k in values)) throw new Error(`Missing email placeholder: ${k}`)
    return html ? escape(values[k]!) : values[k]!
  })
}

/** Fills a template. `baseUrl` is the site address, without a trailing slash. */
export function renderEmail(kind: EmailKind, locale: Locale, values: Record<string, string>, baseUrl: string) {
  const t: EmailTemplate = emailTemplates[kind]
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const align = locale === 'ar' ? 'right' : 'left'
  const subject = fill(t.subject[locale], values, false)
  const title = fill(t.title[locale], values, true)
  const body = fill(t.body[locale], values, true)
  const note = t.note ? fill(t.note[locale], values, true) : ''
  const url = t.cta ? `${baseUrl}/${locale}${t.cta.path}` : ''
  const cta = t.cta ? escape(t.cta.label[locale]) : ''
  const html = `<!doctype html><html lang="${locale}" dir="${dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escape(subject)}</title></head>
<body style="margin:0;padding:24px 12px;background:#E9E1D3;font-family:'IBM Plex Sans Arabic','IBM Plex Sans',Tahoma,Arial,sans-serif;color:#17221F">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#F4EFE6;border-radius:8px"><tr><td dir="${dir}" style="padding:28px 24px;text-align:${align}">
<p style="margin:0;font-family:Amiri,Georgia,serif;font-weight:700;font-size:22px">${brand[locale]}</p>
<div style="margin:18px 0 22px;height:4px;width:28px;background:#8A1F3B"></div>
<h1 style="margin:0;font-family:Amiri,Georgia,serif;font-size:28px;line-height:1.25">${title}</h1>
<p style="margin:14px 0 0;font-size:16px;line-height:1.7">${body}</p>
${note ? `<p style="margin:14px 0 0;font-size:14px;line-height:1.6;color:#55615D">${note}</p>` : ''}
${t.cta ? `<p style="margin:24px 0 0"><a href="${escape(url)}" style="display:inline-block;background:#8A1F3B;color:#F4EFE6;padding:12px 22px 10px;border-radius:999px 999px 6px 6px;text-decoration:none;font-weight:500">${cta}</a></p>` : ''}
<p style="margin:28px 0 0;padding-top:14px;border-top:1px solid #CDBFA8;font-size:12px;line-height:1.6;color:#55615D">${footer[locale]}</p>
</td></tr></table></body></html>`
  const text = [fill(t.title[locale], values, false), '', fill(t.body[locale], values, false), t.note ? '\n' + fill(t.note[locale], values, false) : '', t.cta ? `\n${t.cta.label[locale]}: ${url}` : '', '', '--', footer[locale]]
    .filter((l, i, a) => !(l === '' && a[i - 1] === ''))
    .join('\n')
  return { subject, html, text }
}

/** Fictional values for previewing every email (the design page and tests); never sent. */
export const emailSamples: Record<Locale, Record<string, string>> = {
  ar: { code: '٤٨٢٩١٦', workshop: 'سيرة ذاتية تُقرأ في ثلاثين ثانية', amount: '٢٥٠ ريال قطري', hours: '٤٨', date: 'الأحد ٦ ديسمبر، الخامسة مساءً', project: 'حملة إطلاق لفرع جديد على إنستغرام', participant: 'ريم', company: 'مقهى الرملة', organisation: 'شركة مدار للحلول', name: 'هالة', count: '٣' },
  en: { code: '482916', workshop: 'A CV that reads in thirty seconds', amount: 'QAR 250', hours: '48', date: 'Sunday 6 December, 5:00 pm', project: 'An Instagram launch campaign for a new branch', participant: 'Reem', company: 'Al Ramla Café', organisation: 'Madar Solutions', name: 'Hala', count: '3' },
}
