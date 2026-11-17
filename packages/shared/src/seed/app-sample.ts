/**
 * Sample data for the signed-in prototypes (participant, organisation, trainer, admin). Everything
 * is fictional and every screen that shows it says so. When the back end exists, these shapes are
 * replaced by real reads; the screens keep their structure.
 */
import type { Bilingual } from './sample'

export type ProgressState = 'active' | 'submitted' | 'changes_requested' | 'accepted' | 'declined'

/** The participant (Reem) inside the café launch project. */
export const sampleWorkspace = {
  projectSlug: 'cafe-launch-campaign',
  stepsDone: 3,
  updates: [
    { at: '2026-12-09', text: { ar: 'أنهيت قراءة الموجز، وأرسلت سؤالًا عن ألوان الهوية.', en: 'Finished reading the brief and asked about the brand colours.' }, files: 0 },
    { at: '2026-12-12', text: { ar: 'رسمت خطة الأسبوعين: عشرة منشورات وقصتان كل أسبوع.', en: 'Drafted the two-week plan: ten posts and two stories a week.' }, files: 1 },
    { at: '2026-12-15', text: { ar: 'صمّمت المنشورات الثلاثة وأراجع النصوص.', en: 'Designed the three posts; now checking the captions.' }, files: 3 },
  ],
  questions: [
    { at: '2026-12-09', q: { ar: 'هل نستعمل ألوان الفرع الأول نفسها؟', en: 'Do we use the same colours as the first branch?' }, a: { ar: 'نعم، الألوان نفسها، مع صورة الواجهة الجديدة.', en: 'Yes, the same colours, with a photo of the new storefront.' } },
    { at: '2026-12-13', q: { ar: 'هل يمكن أن يكون المقطع بالإنجليزية أيضًا؟', en: 'Can the video also be in English?' }, a: null },
  ],
}

export type SampleApplication = { projectSlug: string; at: string; state: 'applied' | 'accepted' | 'declined' | 'waitlisted' }
export const sampleApplications: SampleApplication[] = [{ projectSlug: 'store-support-assistant', at: '2026-11-28', state: 'applied' }]

export const sampleInvitation = {
  company: { ar: 'متجر سدرة للإلكترونيات', en: 'Sidra Electronics Store' },
  at: '2026-12-16',
  message: {
    ar: 'أعجبنا عملك على مشروع الآراء. نود أن نتحدث معك عن تدريب صيفي في فريق خدمة العملاء.',
    en: 'We liked your work on the reviews project. We would like to talk to you about a summer internship in our customer service team.',
  },
}

export const sampleLearning = {
  workshop: { slug: 'linkedin-profile', state: 'reserved' as const },
  session: { title: { ar: 'عيادة السيرة الذاتية', en: 'CV clinic' }, at: '2026-12-10T16:30:00+03:00', minutes: 30, state: 'confirmed' as const },
  course: { slug: 'content-basics', lessonsDone: 2 },
}

/** The organisation (Al Ramla Café) and its people on the launch project. */
export const sampleOrg = {
  name: { ar: 'مقهى الرملة', en: 'Al Ramla Café' },
  contact: { ar: 'مريم', en: 'Maryam' },
}

export type SampleCohortMember = {
  id: string
  name: Bilingual
  stepsDone: number
  lastUpdate: string
  state: ProgressState
  version?: number
}

export const sampleProjectPeople: SampleCohortMember[] = [
  { id: 'p1', name: { ar: 'ريم', en: 'Reem' }, stepsDone: 3, lastUpdate: '2026-12-15', state: 'active' },
  { id: 'p2', name: { ar: 'سارة', en: 'Sara' }, stepsDone: 5, lastUpdate: '2026-12-16', state: 'submitted', version: 1 },
  { id: 'p3', name: { ar: 'يوسف', en: 'Yousef' }, stepsDone: 5, lastUpdate: '2026-12-16', state: 'submitted', version: 2 },
  { id: 'p4', name: { ar: 'نورة', en: 'Noora' }, stepsDone: 4, lastUpdate: '2026-12-14', state: 'changes_requested', version: 1 },
  { id: 'p5', name: { ar: 'عبدالله', en: 'Abdullah' }, stepsDone: 1, lastUpdate: '2026-12-08', state: 'active' },
  { id: 'p6', name: { ar: 'نوف', en: 'Nouf' }, stepsDone: 5, lastUpdate: '2026-12-13', state: 'accepted', version: 1 },
  { id: 'p7', name: { ar: 'خالد', en: 'Khaled' }, stepsDone: 2, lastUpdate: '2026-12-11', state: 'active' },
]

export const sampleHandIns: Record<string, { text: Bilingual; links: string[]; files: string[] }> = {
  p2: {
    text: {
      ar: 'الخطة مبنية على فكرة «فنجانك الأول في الوكرة»: منشور تشويق، ثم صور التجهيز، ثم دعوة ليوم الافتتاح. أرفقت المنشورات الثلاثة ونص المقطع.',
      en: 'The plan is built on “Your first cup in Al Wakra”: a teaser post, then set-up photos, then an invitation to opening day. The three posts and the video script are attached.',
    },
    links: ['https://example.com/sara-plan'],
    files: ['plan.pdf', 'posts.zip', 'script.docx'],
  },
  p3: {
    text: {
      ar: 'النسخة الثانية: غيّرت المنشور الثالث بعد ملاحظاتكم، وأضفت موعد الافتتاح في كل منشور.',
      en: 'Second version: I changed the third post after your notes and added the opening date to every post.',
    },
    links: ['https://example.com/yousef-v2'],
    files: ['plan-v2.pdf', 'posts-v2.zip'],
  },
}

/** Applicants on the café's apply-first project. */
export const sampleApplicants = [
  { id: 'a1', name: { ar: 'ليلى', en: 'Layla' }, note: { ar: 'درست التسويق وأدير حساب نادي الجامعة.', en: 'I studied marketing and run my university club’s account.' }, state: 'applied' as const },
  { id: 'a2', name: { ar: 'حمد', en: 'Hamad' }, note: { ar: 'أعمل بدوام جزئي في مقهى وأعرف الزبائن جيدًا.', en: 'I work part time in a café and know the customers well.' }, state: 'applied' as const },
  { id: 'a3', name: { ar: 'جود', en: 'Joud' }, note: { ar: 'صممت برنامج نقاط لمشروع التخرج.', en: 'I designed a points programme for my graduation project.' }, state: 'applied' as const },
  { id: 'a4', name: { ar: 'فهد', en: 'Fahad' }, note: { ar: 'مهتم بتحليل بيانات المبيعات.', en: 'Interested in analysing sales data.' }, state: 'applied' as const },
]

export const sampleTalent = [
  { id: 'p6', name: { ar: 'نوف', en: 'Nouf' }, project: { ar: 'حملة إطلاق لفرع جديد على إنستغرام', en: 'An Instagram launch campaign for a new branch' }, state: 'accepted' as const, email: 'nouf.sample@example.com' },
  { id: 'p2', name: { ar: 'سارة', en: 'Sara' }, project: { ar: 'حملة إطلاق لفرع جديد على إنستغرام', en: 'An Instagram launch campaign for a new branch' }, state: 'shortlisted' as const },
  { id: 'p3', name: { ar: 'يوسف', en: 'Yousef' }, project: { ar: 'حملة إطلاق لفرع جديد على إنستغرام', en: 'An Instagram launch campaign for a new branch' }, state: 'sent' as const },
]

/** The trainer (Hala). */
export const sampleTrainer = {
  name: { ar: 'هالة', en: 'Hala' },
  workshops: [
    { slug: 'cv-thirty-seconds', state: 'published' as const },
    { slug: 'linkedin-profile', state: 'awaiting_approval' as const },
  ],
  attendees: [
    { name: { ar: 'ريم', en: 'Reem' }, state: 'confirmed' as const },
    { name: { ar: 'سارة', en: 'Sara' }, state: 'confirmed' as const },
    { name: { ar: 'يوسف', en: 'Yousef' }, state: 'reserved' as const },
    { name: { ar: 'نوف', en: 'Nouf' }, state: 'confirmed' as const },
    { name: { ar: 'ليلى', en: 'Layla' }, state: 'confirmed' as const },
    { name: { ar: 'حمد', en: 'Hamad' }, state: 'reserved' as const },
  ],
  /** Open slots this week: day index (0 = Sunday) and hour. */
  slots: [
    { day: 0, hour: 16 }, { day: 0, hour: 17 }, { day: 1, hour: 18 }, { day: 2, hour: 16 }, { day: 3, hour: 17 }, { day: 3, hour: 18 },
  ],
  booked: [{ day: 1, hour: 18, name: { ar: 'ريم', en: 'Reem' } }],
}

/** What waits for the admin. */
export const sampleQueues = {
  organisations: [
    { name: { ar: 'استوديو نخيل للتصميم', en: 'Nakheel Design Studio' }, at: '2026-12-15', sector: { ar: 'التصميم', en: 'Design' } },
    { name: { ar: 'شركة مدار للحلول', en: 'Madar Solutions' }, at: '2026-12-16', sector: { ar: 'التقنية', en: 'Technology' } },
  ],
  projects: [{ title: { ar: 'برنامج نقاط لزبائن المقهى', en: 'A points programme for café customers' }, org: { ar: 'مقهى الرملة', en: 'Al Ramla Café' }, at: '2026-12-14' }],
  trainers: [{ name: { ar: 'طارق', en: 'Tariq' }, expertise: { ar: 'تحليل البيانات للتسويق', en: 'Data analysis for marketing' }, at: '2026-12-13' }],
  training: [{ title: { ar: 'ملف لينكدإن يعرّف بك', en: 'A LinkedIn profile that introduces you' }, trainer: { ar: 'هالة', en: 'Hala' }, at: '2026-12-12' }],
  bookings: [
    { name: { ar: 'يوسف', en: 'Yousef' }, item: { ar: 'سيرة ذاتية تُقرأ في ثلاثين ثانية', en: 'A CV that reads in thirty seconds' }, dirhams: 25_000, at: '2026-12-15' },
    { name: { ar: 'حمد', en: 'Hamad' }, item: { ar: 'سيرة ذاتية تُقرأ في ثلاثين ثانية', en: 'A CV that reads in thirty seconds' }, dirhams: 25_000, at: '2026-12-16' },
    { name: { ar: 'ريم', en: 'Reem' }, item: { ar: 'ملف لينكدإن يعرّف بك', en: 'A LinkedIn profile that introduces you' }, dirhams: 25_000, at: '2026-12-16' },
  ],
  leads: [
    { org: { ar: 'مؤسسة الغد للتدريب', en: 'Al Ghad Training Foundation' }, ways: ['train_batch'], at: '2026-12-16' },
    { org: { ar: 'مكتبة الفنار', en: 'Al Fanar Bookshop' }, ways: ['post_project', 'sponsor'], at: '2026-12-17' },
  ],
}
