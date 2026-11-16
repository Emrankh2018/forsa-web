/**
 * Sample content for the design gate and, later, the seeded development database. Everything here
 * is fictional: the companies, people, projects and dates are invented and must be labelled as
 * sample data wherever they are shown (plan V4 section 8). No real organisation names.
 */

export type Bilingual = { ar: string; en: string }
export type FieldKey = 'marketing_media' | 'applied_ai'
export type JoinMode = 'open' | 'apply'

export type SampleProject = {
  slug: string
  company: Bilingual
  title: Bilingual
  summary: Bilingual
  field: FieldKey
  joinMode: JoinMode
  seats: number
  seatsTaken: number
  applyBy?: string
  startsAt: string
  dueAt: string
  brief: Bilingual[]
  deliverables: Bilingual[]
  acceptance: Bilingual[]
  steps: Bilingual[]
}

export type SampleWorkshop = {
  slug: string
  title: Bilingual
  field: FieldKey | 'career'
  startsAt: string
  minutes: number
  online: boolean
  priceDirhams: number
  capacity: number
  booked: number
}

export const fields: Record<FieldKey, Bilingual> = {
  marketing_media: { ar: 'التسويق والإعلام', en: 'Marketing and media' },
  applied_ai: { ar: 'الذكاء الاصطناعي التطبيقي', en: 'Applied AI' },
}

export const sampleProjects: SampleProject[] = [
  {
    slug: 'cafe-launch-campaign',
    company: { ar: 'مقهى الرملة', en: 'Al Ramla Café' },
    title: { ar: 'حملة إطلاق لفرع جديد على إنستغرام', en: 'An Instagram launch campaign for a new branch' },
    summary: {
      ar: 'خطة محتوى لأسبوعين، وثلاثة منشورات جاهزة، ونص لمقطع قصير.',
      en: 'A two-week content plan, three finished posts and a script for one short video.',
    },
    field: 'marketing_media',
    joinMode: 'open',
    seats: 12,
    seatsTaken: 7,
    startsAt: '2026-12-06',
    dueAt: '2026-12-24',
    brief: [
      {
        ar: 'نفتتح فرعًا ثانيًا في الوكرة الشهر القادم، ونريد أن يعرف أهل المنطقة به قبل يوم الافتتاح.',
        en: 'We open a second branch in Al Wakra next month and want people nearby to know about it before opening day.',
      },
      {
        ar: 'جمهورنا من الطلاب والعائلات الشابة. نحب نبرة دافئة وبسيطة، بلا مبالغة.',
        en: 'Our customers are students and young families. We like a warm, simple tone, nothing loud.',
      },
    ],
    deliverables: [
      { ar: 'خطة محتوى لأسبوعين بالتواريخ', en: 'A dated two-week content plan' },
      { ar: 'ثلاثة منشورات بتصميمها ونصها', en: 'Three posts, designed and written' },
      { ar: 'نص مقطع قصير مدته أقل من ثلاثين ثانية', en: 'A script for a video under thirty seconds' },
    ],
    acceptance: [
      { ar: 'المحتوى بالعربية الواضحة ويناسب الجمهور', en: 'Clear Arabic that suits the audience' },
      { ar: 'كل منشور يذكر موعد الافتتاح والموقع', en: 'Every post gives the opening date and location' },
    ],
    steps: [
      { ar: 'اقرأ الموجز واطرح أسئلتك', en: 'Read the brief and ask your questions' },
      { ar: 'ارسم خطة الأسبوعين', en: 'Draft the two-week plan' },
      { ar: 'صمّم المنشورات الثلاثة', en: 'Design the three posts' },
      { ar: 'اكتب نص المقطع', en: 'Write the video script' },
      { ar: 'سلّم العمل', en: 'Hand in your work' },
    ],
  },
  {
    slug: 'store-support-assistant',
    company: { ar: 'متجر سدرة للإلكترونيات', en: 'Sidra Electronics Store' },
    title: { ar: 'مساعد يجيب عن أسئلة العملاء المتكررة', en: 'An assistant that answers common customer questions' },
    summary: {
      ar: 'نموذج أولي يجيب من صفحة الأسئلة الشائعة، مع تقرير قصير عن حدوده.',
      en: 'A prototype that answers from the FAQ page, with a short report on where it falls short.',
    },
    field: 'applied_ai',
    joinMode: 'apply',
    seats: 4,
    seatsTaken: 1,
    applyBy: '2026-12-03',
    startsAt: '2026-12-08',
    dueAt: '2026-12-29',
    brief: [
      {
        ar: 'يصلنا كل يوم السؤال نفسه عن الضمان والتوصيل والاستبدال. نريد أن نرى هل يستطيع مساعد بسيط أن يجيب عنه بدقة.',
        en: 'Every day we get the same questions about warranty, delivery and returns. We want to see whether a simple assistant can answer them accurately.',
      },
      {
        ar: 'لا نحتاج منتجًا جاهزًا. نحتاج تجربة صادقة تخبرنا بما ينجح وما لا ينجح.',
        en: 'We do not need a finished product. We need an honest trial that tells us what works and what does not.',
      },
    ],
    deliverables: [
      { ar: 'نموذج أولي يعمل على صفحة الأسئلة الشائعة', en: 'A working prototype on the FAQ page' },
      { ar: 'عشرون سؤالًا للاختبار مع النتائج', en: 'Twenty test questions with results' },
      { ar: 'تقرير من صفحة واحدة', en: 'A one-page report' },
    ],
    acceptance: [
      { ar: 'يرفض الإجابة حين لا يجد المعلومة', en: 'Says it does not know when the answer is missing' },
      { ar: 'لا يُرسل بيانات العملاء إلى أي مكان', en: 'Sends no customer data anywhere' },
    ],
    steps: [
      { ar: 'قدّم طلبك', en: 'Apply' },
      { ar: 'اجمع الأسئلة والإجابات', en: 'Collect the questions and answers' },
      { ar: 'ابنِ النموذج الأولي', en: 'Build the prototype' },
      { ar: 'اختبره وسجّل النتائج', en: 'Test it and record the results' },
      { ar: 'سلّم العمل والتقرير', en: 'Hand in the work and the report' },
    ],
  },
  {
    slug: 'gallery-visual-identity',
    company: { ar: 'معرض بيت الطين', en: 'Bait Al Teen Gallery' },
    title: { ar: 'هوية بصرية لمعرض فني صغير', en: 'A visual identity for a small art gallery' },
    summary: {
      ar: 'شعار، وألوان، وقالب لملصق المعرض القادم.',
      en: 'A logo, a colour set and a poster template for the next show.',
    },
    field: 'marketing_media',
    joinMode: 'apply',
    seats: 3,
    seatsTaken: 3,
    applyBy: '2026-11-30',
    startsAt: '2026-12-02',
    dueAt: '2026-12-20',
    brief: [{ ar: 'معرض يعرض أعمال فنانين شباب من قطر ويريد هوية تشبه المكان.', en: 'A gallery showing young artists from Qatar wants an identity that feels like the place.' }],
    deliverables: [
      { ar: 'شعار بنسختين', en: 'A logo in two versions' },
      { ar: 'مجموعة ألوان وخطوط', en: 'A colour and type set' },
      { ar: 'قالب ملصق', en: 'A poster template' },
    ],
    acceptance: [{ ar: 'يعمل الشعار بالأبيض والأسود', en: 'The logo works in black and white' }],
    steps: [
      { ar: 'قدّم طلبك', en: 'Apply' },
      { ar: 'زر المعرض أو شاهد صوره', en: 'Visit the gallery or study its photos' },
      { ar: 'اقترح ثلاثة اتجاهات', en: 'Propose three directions' },
      { ar: 'طوّر الاتجاه المختار', en: 'Develop the chosen one' },
      { ar: 'سلّم العمل', en: 'Hand in your work' },
    ],
  },
  {
    slug: 'review-sorting',
    company: { ar: 'مطعم ساحل', en: 'Sahel Restaurant' },
    title: { ar: 'فرز آراء الزبائن بالذكاء الاصطناعي', en: 'Sorting customer reviews with AI' },
    summary: {
      ar: 'تصنيف مئتي رأي حسب الموضوع، وملخص بما يتكرر.',
      en: 'Group two hundred reviews by topic and summarise what keeps coming up.',
    },
    field: 'applied_ai',
    joinMode: 'open',
    seats: 20,
    seatsTaken: 5,
    startsAt: '2026-12-10',
    dueAt: '2026-12-31',
    brief: [{ ar: 'لدينا مئتا رأي من الزبائن ولا وقت لقراءتها كلها. نريد أن نعرف ما الذي يتكرر.', en: 'We have two hundred customer reviews and no time to read them all. We want to know what keeps coming up.' }],
    deliverables: [
      { ar: 'جدول بالآراء وتصنيفها', en: 'A sheet of the reviews and their topics' },
      { ar: 'ملخص من صفحة واحدة', en: 'A one-page summary' },
    ],
    acceptance: [{ ar: 'يشرح الطريقة بحيث نكررها بأنفسنا', en: 'Explains the method so we can repeat it ourselves' }],
    steps: [
      { ar: 'نزّل الآراء', en: 'Download the reviews' },
      { ar: 'اختر طريقة التصنيف', en: 'Choose how to group them' },
      { ar: 'صنّف وراجع', en: 'Group and check' },
      { ar: 'اكتب الملخص', en: 'Write the summary' },
      { ar: 'سلّم العمل', en: 'Hand in your work' },
    ],
  },
]

export const sampleWorkshops: SampleWorkshop[] = [
  {
    slug: 'cv-thirty-seconds',
    title: { ar: 'سيرة ذاتية تُقرأ في ثلاثين ثانية', en: 'A CV that reads in thirty seconds' },
    field: 'career',
    startsAt: '2026-12-05T17:00:00+03:00',
    minutes: 120,
    online: true,
    priceDirhams: 25_000,
    capacity: 25,
    booked: 14,
  },
  {
    slug: 'linkedin-profile',
    title: { ar: 'ملف لينكدإن يعرّف بك', en: 'A LinkedIn profile that introduces you' },
    field: 'career',
    startsAt: '2026-12-12T17:00:00+03:00',
    minutes: 90,
    online: true,
    priceDirhams: 25_000,
    capacity: 25,
    booked: 6,
  },
  {
    slug: 'ai-for-marketing',
    title: { ar: 'الذكاء الاصطناعي في عمل التسويق اليومي', en: 'AI in everyday marketing work' },
    field: 'applied_ai',
    startsAt: '2026-12-19T10:00:00+03:00',
    minutes: 180,
    online: false,
    priceDirhams: 25_000,
    capacity: 18,
    booked: 18,
  },
]

/** The fictional participant shown on the participant home. */
export const sampleParticipant = {
  firstName: { ar: 'ريم', en: 'Reem' },
  activeProjectSlug: 'cafe-launch-campaign',
  stepsDone: 3,
  nextStepDue: '2026-12-18',
  bookedWorkshopSlug: 'linkedin-profile',
  savedProjectSlugs: ['store-support-assistant', 'review-sorting'],
  finished: [{ title: { ar: 'خطة محتوى لمكتبة حيّ', en: 'A content plan for a neighbourhood bookshop' }, company: { ar: 'مكتبة الفنار', en: 'Al Fanar Bookshop' }, at: '2026-10-28' }],
}

export function seatsLeft(p: SampleProject): number {
  return Math.max(0, p.seats - p.seatsTaken)
}

export function projectBySlug(slug: string): SampleProject | undefined {
  return sampleProjects.find((p) => p.slug === slug)
}
