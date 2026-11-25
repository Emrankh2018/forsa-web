/**
 * Sample data for the signed-in prototypes (participant, organisation, trainer, admin). Everything
 * is fictional and every screen that shows it says so. When the back end exists, these shapes are
 * replaced by real reads; the screens keep their structure.
 */
import type { Bilingual, SampleProject, SampleWorkshop } from './sample'

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
  sector: { ar: 'المطاعم والمقاهي', en: 'Restaurants and cafés' },
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

export const samplePendingWorkshop: SampleWorkshop = {
  slug: 'interview-practice',
  title: { ar: 'تدريب عملي على مقابلة العمل', en: 'Practise a job interview' },
  summary: { ar: 'جرّب مقابلة قصيرة وتعلّم كيف تربط إجاباتك بتجاربك ومشاريعك.', en: 'Try a short interview and learn how to connect your answers to your experience and projects.' },
  outcomes: [
    { ar: 'إجابتان تستندان إلى تجاربك', en: 'Two answers grounded in your experience' },
    { ar: 'ملاحظات تساعدك على تطوير إجاباتك', en: 'Feedback to improve your answers' },
  ],
  field: 'career',
  startsAt: '2026-12-22T17:00:00+03:00',
  minutes: 90,
  online: true,
  priceDirhams: 25_000,
  capacity: 20,
  booked: 0,
}

export const samplePendingProject: Pick<SampleProject, 'slug' | 'title' | 'company' | 'field'> = {
  slug: 'takeaway-order-campaign',
  title: { ar: 'حملة للطلبات الخارجية', en: 'A campaign for takeaway orders' },
  company: { ar: 'مقهى الرملة', en: 'Al Ramla Café' },
  field: 'marketing_media',
}

/** The trainer (Hala). */
export const sampleTrainer = {
  name: { ar: 'هالة', en: 'Hala' },
  workshops: [
    { slug: 'cv-thirty-seconds', state: 'published' as const },
    { slug: 'linkedin-profile', state: 'published' as const },
    { slug: samplePendingWorkshop.slug, state: 'awaiting_approval' as const },
  ],
  attendees: [
    { name: { ar: 'ريم', en: 'Reem' }, state: 'confirmed' as const },
    { name: { ar: 'سارة', en: 'Sara' }, state: 'confirmed' as const },
    { name: { ar: 'يوسف', en: 'Yousef' }, state: 'reserved' as const },
    { name: { ar: 'نوف', en: 'Nouf' }, state: 'confirmed' as const },
    { name: { ar: 'ليلى', en: 'Layla' }, state: 'confirmed' as const },
    { name: { ar: 'حمد', en: 'Hamad' }, state: 'reserved' as const },
  ],
  /** Open slots in the sample week: day index (0 = Sunday) and hour. */
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
  projects: [{ title: samplePendingProject.title, org: samplePendingProject.company, at: '2026-12-14' }],
  trainers: [{ name: { ar: 'طارق', en: 'Tariq' }, expertise: { ar: 'تحليل البيانات للتسويق', en: 'Data analysis for marketing' }, at: '2026-12-13' }],
  training: [{ title: samplePendingWorkshop.title, trainer: sampleTrainer.name, at: samplePendingWorkshop.startsAt }],
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

/** Reem's public record at /p/reem: only accepted work and attended workshops. */
export const sampleRecord = {
  handle: 'reem',
  name: { ar: 'ريم', en: 'Reem' },
  city: { ar: 'الدوحة', en: 'Doha' },
  headline: { ar: 'خريجة تسويق أبحث عن دور في صناعة المحتوى', en: 'Marketing graduate looking for a content role' },
  fields: ['marketing_media'] as const,
  skills: [
    { ar: 'كتابة المحتوى', en: 'Copywriting' },
    { ar: 'تخطيط المنشورات', en: 'Content planning' },
    { ar: 'كانفا', en: 'Canva' },
  ],
  accepted: [
    {
      title: { ar: 'خطة محتوى لمكتبة حيّ', en: 'A content plan for a neighbourhood bookshop' },
      company: { ar: 'مكتبة الفنار', en: 'Al Fanar Bookshop' },
      at: '2026-10-28',
      feedback: {
        ar: 'خطة واضحة وواقعية لفريق صغير مثلنا. بدأنا تنفيذ الأسبوعين الأولين كما هما.',
        en: 'A clear, realistic plan for a small team like ours. We started the first two weeks exactly as written.',
      },
      strengths: [
        { ar: 'تكتب بلغة قريبة من زبائننا', en: 'Writes in our customers’ language' },
        { ar: 'تسلّم في الموعد', en: 'Delivers on time' },
      ],
    },
  ],
  workshops: ['cv-thirty-seconds'],
}

/** The café's team. */
export const sampleOrgTeam = [
  { id: 'm1', name: { ar: 'مريم', en: 'Maryam' }, role: 'owner' as const, pending: false },
  { id: 'm2', name: { ar: 'جاسم', en: 'Jassim' }, role: 'reviewer' as const, pending: false },
  { id: 'm3', name: { ar: 'دانة', en: 'Dana' }, role: 'member' as const, pending: true },
]

/** Hala's 1-to-1 session types and bookings. */
export const sampleSessionTypes = [
  { id: 's1', name: { ar: 'عيادة السيرة الذاتية', en: 'CV clinic' }, minutes: 30 },
  { id: 's2', name: { ar: 'مراجعة ملف لينكدإن', en: 'LinkedIn profile review' }, minutes: 45 },
]
export const sampleSessionBookings = [
  { id: 'b1', who: { ar: 'ريم', en: 'Reem' }, type: 's1', at: '2026-12-10T16:30:00+03:00', state: 'confirmed' as const },
  { id: 'b2', who: { ar: 'حمد', en: 'Hamad' }, type: 's2', at: '2026-12-11T18:00:00+03:00', state: 'awaiting' as const },
  { id: 'b3', who: { ar: 'جود', en: 'Joud' }, type: 's1', at: '2026-11-30T17:00:00+03:00', state: 'done' as const },
]

/** Accounts as the admin sees them. */
export const samplePeople = [
  { id: 'u1', name: { ar: 'ريم', en: 'Reem' }, kind: 'participant' as const, joined: '2026-10-02', state: 'active' as const },
  { id: 'u2', name: { ar: 'يوسف', en: 'Yousef' }, kind: 'participant' as const, joined: '2026-11-20', state: 'active' as const },
  { id: 'u3', name: { ar: 'مقهى الرملة', en: 'Al Ramla Café' }, kind: 'organisation' as const, joined: '2026-09-14', state: 'active' as const },
  { id: 'u4', name: { ar: 'شركة مدار للحلول', en: 'Madar Solutions' }, kind: 'organisation' as const, joined: '2026-12-16', state: 'pending' as const },
  { id: 'u5', name: { ar: 'هالة', en: 'Hala' }, kind: 'trainer' as const, joined: '2026-09-30', state: 'active' as const },
  { id: 'u6', name: { ar: 'طارق', en: 'Tariq' }, kind: 'trainer' as const, joined: '2026-12-13', state: 'pending' as const },
  { id: 'u7', name: { ar: 'فهد', en: 'Fahad' }, kind: 'participant' as const, joined: '2026-11-05', state: 'suspended' as const },
]

/** The audit log: who changed what. */
export const sampleAudit = [
  { at: '2026-12-16T10:12:00+03:00', who: { ar: 'المشرف', en: 'Admin' }, action: { ar: 'تحقق من جهة: مقهى الرملة', en: 'Verified organisation: Al Ramla Café' } },
  { at: '2026-12-16T11:40:00+03:00', who: { ar: 'المشرف', en: 'Admin' }, action: { ar: 'وافق على مشروع: برنامج نقاط لزبائن المقهى', en: 'Approved project: A points programme for café customers' } },
  { at: '2026-12-16T15:05:00+03:00', who: { ar: 'المشرف', en: 'Admin' }, action: { ar: 'سجّل حجزًا مدفوعًا: يوسف', en: 'Marked booking paid: Yousef' } },
  { at: '2026-12-17T09:30:00+03:00', who: { ar: 'المشرف', en: 'Admin' }, action: { ar: 'غيّر إعدادًا: مدة حجز المقعد', en: 'Changed a setting: seat hold time' } },
]

/** Hala's profile as participants read it. */
export const sampleTrainerProfile = {
  expertise: { ar: 'السير الذاتية والتقديم على الوظائف', en: 'CVs and job applications' },
  bio: {
    ar: 'عملت في التوظيف لدى شركات في الدوحة، وراجعت مئات السير الذاتية. أساعد الخريجين على كتابة سيرة تُقرأ بسرعة وتقول ما أنجزوه.',
    en: 'I worked in recruitment for companies in Doha and have reviewed hundreds of CVs. I help graduates write a CV that reads quickly and says what they achieved.',
  },
}

/** Organisations as the admin sees them. */
export const sampleOrganisations = [
  { id: 'o1', name: { ar: 'مقهى الرملة', en: 'Al Ramla Café' }, sector: { ar: 'المطاعم والمقاهي', en: 'Restaurants and cafés' }, joined: '2026-09-14', state: 'verified' as const, projects: 2 },
  { id: 'o2', name: { ar: 'متجر سدرة للإلكترونيات', en: 'Sidra Electronics Store' }, sector: { ar: 'التجزئة', en: 'Retail' }, joined: '2026-09-20', state: 'verified' as const, projects: 1 },
  { id: 'o3', name: { ar: 'معرض بيت الطين', en: 'Bait Al Teen Gallery' }, sector: { ar: 'الفنون', en: 'Arts' }, joined: '2026-10-03', state: 'verified' as const, projects: 1 },
  { id: 'o4', name: { ar: 'مطعم ساحل', en: 'Sahel Restaurant' }, sector: { ar: 'المطاعم والمقاهي', en: 'Restaurants and cafés' }, joined: '2026-10-11', state: 'verified' as const, projects: 1 },
  { id: 'o5', name: { ar: 'استوديو نخيل للتصميم', en: 'Nakheel Design Studio' }, sector: { ar: 'التصميم', en: 'Design' }, joined: '2026-12-15', state: 'pending' as const, projects: 0 },
  { id: 'o6', name: { ar: 'شركة مدار للحلول', en: 'Madar Solutions' }, sector: { ar: 'التقنية', en: 'Technology' }, joined: '2026-12-16', state: 'pending' as const, projects: 0 },
]

/** Project states the admin sees (public projects are open; one waits for approval). */
export const sampleProjectStates: Record<string, 'awaiting_approval' | 'open' | 'in_progress' | 'closed'> = {
  'cafe-launch-campaign': 'in_progress',
  'store-support-assistant': 'open',
  'gallery-visual-identity': 'open',
  'review-sorting': 'open',
  'loyalty-programme': 'open',
  [samplePendingProject.slug]: 'awaiting_approval',
}

/** Orders: workshop seats paid by hand (bank transfer or cash), confirmed by the team. */
export const sampleOrders = [
  { id: 'r1', who: { ar: 'يوسف', en: 'Yousef' }, item: { ar: 'سيرة ذاتية تُقرأ في ثلاثين ثانية', en: 'A CV that reads in thirty seconds' }, dirhams: 25_000, at: '2026-12-15', state: 'reserved' as const },
  { id: 'r2', who: { ar: 'حمد', en: 'Hamad' }, item: { ar: 'سيرة ذاتية تُقرأ في ثلاثين ثانية', en: 'A CV that reads in thirty seconds' }, dirhams: 25_000, at: '2026-12-16', state: 'reserved' as const },
  { id: 'r3', who: { ar: 'ريم', en: 'Reem' }, item: { ar: 'ملف لينكدإن يعرّف بك', en: 'A LinkedIn profile that introduces you' }, dirhams: 25_000, at: '2026-12-02', state: 'paid' as const },
  { id: 'r4', who: { ar: 'نوف', en: 'Nouf' }, item: { ar: 'سيرة ذاتية تُقرأ في ثلاثين ثانية', en: 'A CV that reads in thirty seconds' }, dirhams: 25_000, at: '2026-12-01', state: 'waived' as const },
  { id: 'r5', who: { ar: 'خالد', en: 'Khaled' }, item: { ar: 'ملف لينكدإن يعرّف بك', en: 'A LinkedIn profile that introduces you' }, dirhams: 25_000, at: '2026-11-28', state: 'cancelled' as const },
]

/** Skills participants can pick, per field. */
export const sampleSkills = {
  marketing_media: [
    { ar: 'كتابة المحتوى', en: 'Copywriting' },
    { ar: 'تخطيط المنشورات', en: 'Content planning' },
    { ar: 'التصوير', en: 'Photography' },
    { ar: 'تحرير الفيديو', en: 'Video editing' },
  ],
  applied_ai: [
    { ar: 'كتابة التعليمات للنماذج', en: 'Prompt writing' },
    { ar: 'تحليل البيانات', en: 'Data analysis' },
    { ar: 'أتمتة المهام', en: 'Task automation' },
  ],
}
