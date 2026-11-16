/**
 * Free career guides (plan V4: CV, LinkedIn, interview). Real advice, not sample data. In phase 7
 * the admin's guides editor takes over; these become its first entries.
 */
import type { Bilingual } from '../seed/sample'

export type GuideSection = {
  id: string
  heading: Bilingual
  paragraphs: Bilingual[]
  checklist?: Bilingual[]
}

export type Guide = {
  slug: 'cv' | 'linkedin' | 'interview'
  title: Bilingual
  summary: Bilingual
  minutes: number
  sections: GuideSection[]
  workshopSlug?: string
  sessionSlug: string
  tool?: 'star'
}

export const guides: Guide[] = [
  {
    slug: 'cv',
    title: { ar: 'السيرة الذاتية الأولى', en: 'Your first CV' },
    summary: {
      ar: 'كيف تكتب سيرة من صفحة واحدة حين تكون خبرتك قليلة، وما الذي يقرؤه صاحب العمل أولًا.',
      en: 'How to write a one-page CV when you have little experience, and what an employer reads first.',
    },
    minutes: 8,
    workshopSlug: 'cv-thirty-seconds',
    sessionSlug: 'cv-clinic',
    sections: [
      {
        id: 'first-look',
        heading: { ar: 'ماذا يرى القارئ في أول ثلاثين ثانية', en: 'What a reader sees in the first thirty seconds' },
        paragraphs: [
          {
            ar: 'يقرأ صاحب العمل الثلث الأعلى من الصفحة أولًا: اسمك، وسطرًا يقول ما تبحث عنه، وأقوى ما أنجزته. إن لم يجد سببًا ليكمل هناك، لن يكمل.',
            en: 'An employer reads the top third of the page first: your name, one line on what you are looking for, and the strongest thing you have done. If there is no reason to keep reading there, they stop.',
          },
          {
            ar: 'اجعل السطر الأول تحت اسمك محددًا: «خريج تسويق أبحث عن دور في صناعة المحتوى» أوضح من «شخص طموح يحب التعلم».',
            en: 'Make the line under your name specific: “Marketing graduate looking for a content role” says more than “ambitious person who loves to learn”.',
          },
        ],
      },
      {
        id: 'order',
        heading: { ar: 'الترتيب حين تكون خبرتك قليلة', en: 'The order when experience is thin' },
        paragraphs: [
          {
            ar: 'ضع ما يثبت قدرتك قبل ما يصف دراستك. إن أنجزت مشروعًا لشركة أو عملًا تطوعيًا أو مشروع تخرج حقيقيًا، فهو أهم من قائمة المواد.',
            en: 'Put what proves you can do the work before what describes your studies. A project for a company, volunteer work or a real graduation project matters more than a list of courses.',
          },
          {
            ar: 'ترتيب مقترح: السطر التعريفي، ثم المشاريع والخبرات، ثم المهارات، ثم التعليم، ثم الشهادات واللغات.',
            en: 'A suggested order: your one-line introduction, then projects and experience, then skills, then education, then certificates and languages.',
          },
        ],
      },
      {
        id: 'lines',
        heading: { ar: 'كيف تكتب سطر المشروع', en: 'How to write a project line' },
        paragraphs: [
          {
            ar: 'كل سطر يبدأ بفعل، ويذكر ما فعلته أنت، وينتهي بنتيجة. «صمّمت ثلاثة منشورات لحملة إطلاق مقهى، ونُشرت على حسابه» أقوى من «مسؤول عن التصميم».',
            en: 'Each line starts with a verb, says what you did yourself, and ends with a result. “Designed three posts for a café launch campaign, published on its account” is stronger than “responsible for design”.',
          },
          {
            ar: 'لا تكتب أرقامًا لا تعرفها. إن لم تقِس النتيجة، صف ما سلّمته وما قالته الجهة عنه.',
            en: 'Do not write numbers you do not know. If you did not measure the result, describe what you handed in and what the client said about it.',
          },
        ],
      },
      {
        id: 'check',
        heading: { ar: 'قبل أن ترسلها', en: 'Before you send it' },
        paragraphs: [{ ar: 'راجع هذه القائمة في كل مرة ترسل فيها السيرة.', en: 'Go through this list every time you send your CV.' }],
        checklist: [
          { ar: 'صفحة واحدة', en: 'One page' },
          { ar: 'سطر تحت الاسم يقول ما تبحث عنه', en: 'A line under your name that says what you are looking for' },
          { ar: 'كل سطر خبرة يبدأ بفعل وينتهي بنتيجة', en: 'Every experience line starts with a verb and ends with a result' },
          { ar: 'بريد إلكتروني باسمك ورقم يعمل', en: 'An email with your name and a working number' },
          { ar: 'الملف بصيغة PDF واسمه يحمل اسمك', en: 'Saved as a PDF named with your name' },
          { ar: 'قرأها شخص آخر بحثًا عن الأخطاء', en: 'Someone else read it looking for mistakes' },
        ],
      },
    ],
  },
  {
    slug: 'linkedin',
    title: { ar: 'ملف لينكدإن من الصفر', en: 'A LinkedIn profile from scratch' },
    summary: {
      ar: 'الأقسام التي تهم فعلًا في ملفك، وكيف تعرض مشاريعك حتى لو لم تعمل بعد.',
      en: 'The sections that actually matter on your profile, and how to show your projects even before your first job.',
    },
    minutes: 7,
    workshopSlug: 'linkedin-profile',
    sessionSlug: 'linkedin-review',
    sections: [
      {
        id: 'headline',
        heading: { ar: 'العنوان: السطر الذي يظهر في كل مكان', en: 'The headline: the line that appears everywhere' },
        paragraphs: [
          {
            ar: 'العنوان يظهر تحت اسمك في نتائج البحث والتعليقات والرسائل. اكتب فيه مجالك وما تريد أن تعمل فيه، لا «طالب» وحدها.',
            en: 'Your headline shows under your name in search results, comments and messages. Write your field and the work you want, not just “student”.',
          },
        ],
      },
      {
        id: 'about',
        heading: { ar: 'النبذة: ثلاث فقرات قصيرة', en: 'About: three short paragraphs' },
        paragraphs: [
          {
            ar: 'الأولى: من أنت وما مجالك. الثانية: ما الذي أنجزته وما تعلمته منه. الثالثة: ما الذي تبحث عنه الآن وكيف يتواصل معك من يقرأ.',
            en: 'First: who you are and your field. Second: what you have done and what you learned from it. Third: what you are looking for now and how a reader can reach you.',
          },
        ],
      },
      {
        id: 'projects',
        heading: { ar: 'اعرض مشاريعك', en: 'Show your projects' },
        paragraphs: [
          {
            ar: 'أضف مشاريع فرصة في قسم المشاريع أو الخبرات، مع اسم الشركة ورابط شهادتك. الرابط يتيح لأي شخص التحقق من أن الشهادة حقيقية.',
            en: 'Add your Forsa projects under projects or experience, with the company name and the link to your certificate. Anyone can use the link to check the certificate is real.',
          },
        ],
      },
      {
        id: 'check',
        heading: { ar: 'قائمة سريعة', en: 'A quick list' },
        paragraphs: [{ ar: 'ملف كامل يظهر في البحث أكثر من ملف ناقص.', en: 'A complete profile shows up in search more than an incomplete one.' }],
        checklist: [
          { ar: 'صورة واضحة لوجهك بخلفية هادئة', en: 'A clear photo of your face on a plain background' },
          { ar: 'عنوان يذكر مجالك', en: 'A headline that names your field' },
          { ar: 'نبذة من ثلاث فقرات', en: 'An about section in three paragraphs' },
          { ar: 'مشروع واحد على الأقل برابط', en: 'At least one project with a link' },
          { ar: 'خمس مهارات تخص مجالك', en: 'Five skills from your field' },
        ],
      },
    ],
  },
  {
    slug: 'interview',
    title: { ar: 'المقابلة الأولى', en: 'Your first interview' },
    summary: {
      ar: 'كيف تستعد للأسئلة المتوقعة، وكيف تجيب عن سؤال «حدثني عن موقف» بطريقة مرتبة.',
      en: 'How to prepare for the questions you can expect, and how to answer “tell me about a time” in a clear order.',
    },
    minutes: 9,
    sessionSlug: 'career-guidance',
    tool: 'star',
    sections: [
      {
        id: 'before',
        heading: { ar: 'قبل المقابلة', en: 'Before the interview' },
        paragraphs: [
          {
            ar: 'اقرأ عن الشركة: ماذا تبيع، ومن عملاؤها، وما آخر ما نشرته. جهّز سببًا واحدًا صادقًا لاهتمامك بها.',
            en: 'Read about the company: what it sells, who its customers are, and what it posted recently. Prepare one honest reason you are interested in it.',
          },
          {
            ar: 'اختر ثلاثة مواقف من مشاريعك أو دراستك تستطيع أن تحكيها: مشكلة حللتها، وعمل مع فريق، وخطأ تعلمت منه.',
            en: 'Pick three situations from your projects or studies you can tell: a problem you solved, work with a team, and a mistake you learned from.',
          },
        ],
      },
      {
        id: 'star',
        heading: { ar: 'الإجابة بطريقة «الموقف، المهمة، الفعل، النتيجة»', en: 'Answering with situation, task, action, result' },
        paragraphs: [
          {
            ar: 'حين يُطلب منك أن تحكي عن موقف، رتّب إجابتك: ما الموقف، وما المطلوب منك، وما الذي فعلته أنت تحديدًا، وما الذي حدث بعده. أطول جزء هو الفعل.',
            en: 'When you are asked to tell about a time, order your answer: the situation, what was asked of you, what you did yourself, and what happened after. The longest part is the action.',
          },
          {
            ar: 'جرّب الأداة أدناه: اكتب كل جزء في سطر أو سطرين، وستراها إجابة واحدة تستطيع أن تتدرب عليها بصوت عالٍ.',
            en: 'Try the tool below: write each part in a line or two, and see it as one answer you can practise out loud.',
          },
        ],
      },
      {
        id: 'questions',
        heading: { ar: 'أسئلتك أنت', en: 'Your own questions' },
        paragraphs: [
          {
            ar: 'في نهاية المقابلة اسأل سؤالًا أو سؤالين: كيف يبدو الأسبوع الأول في هذا الدور؟ ما الذي يجعل شخصًا ينجح فيه؟',
            en: 'At the end, ask one or two questions: what does the first week in this role look like? What makes someone do well in it?',
          },
        ],
        checklist: [
          { ar: 'قرأت عن الشركة وأعرف ماذا تفعل', en: 'I read about the company and know what it does' },
          { ar: 'جهزت ثلاثة مواقف أحكيها', en: 'I prepared three situations to tell' },
          { ar: 'تدربت على إجابة واحدة بصوت عالٍ', en: 'I practised one answer out loud' },
          { ar: 'عندي سؤالان أطرحهما', en: 'I have two questions to ask' },
          { ar: 'أعرف المكان أو جربت رابط الاجتماع', en: 'I know the place or tested the meeting link' },
        ],
      },
    ],
  },
]

export function guideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug)
}
