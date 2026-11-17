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
  slug: 'cv' | 'linkedin' | 'interview' | 'networking' | 'first-week' | 'portfolio'
  title: Bilingual
  summary: Bilingual
  minutes: number
  sections: GuideSection[]
  workshopSlug?: string
  sessionSlug: string
  /** A small tool shown after the section with the same id as `toolAfter`. */
  tool?: 'star' | 'pitch' | 'cvcheck'
  toolAfter?: string
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
    tool: 'cvcheck',
    toolAfter: 'lines',
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
    toolAfter: 'star',
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
  {
    slug: 'networking',
    title: { ar: 'التعارف المهني دون إحراج', en: 'Networking without the awkwardness' },
    summary: {
      ar: 'كيف تعرّف بنفسك في ثلاثين ثانية، وكيف تبدأ حديثًا مع شخص في مجالك وتتابعه بعد ذلك.',
      en: 'How to introduce yourself in thirty seconds, start a conversation with someone in your field, and follow up afterwards.',
    },
    minutes: 7,
    sessionSlug: 'career-guidance',
    tool: 'pitch',
    toolAfter: 'pitch',
    sections: [
      {
        id: 'why',
        heading: { ar: 'لماذا يهم التعارف', en: 'Why it matters' },
        paragraphs: [
          {
            ar: 'كثير من الفرص لا تُعلن. يسمع بها من يعرفه أحد في الشركة. التعارف ليس مجاملة؛ هو أن يعرف الناس ما تجيده وما تبحث عنه.',
            en: 'Many openings are never advertised. People hear about them because someone at the company knows them. Networking is not flattery; it is letting people know what you are good at and what you are looking for.',
          },
        ],
      },
      {
        id: 'pitch',
        heading: { ar: 'تعريفك في ثلاثين ثانية', en: 'Your thirty-second introduction' },
        paragraphs: [
          {
            ar: 'ثلاثة أجزاء: من أنت ومجالك، وشيء واحد أنجزته، وما تبحث عنه الآن. قلها بصوت عالٍ حتى تخرج طبيعية، لا محفوظة.',
            en: 'Three parts: who you are and your field, one thing you have done, and what you are looking for now. Say it out loud until it sounds natural, not memorised.',
          },
        ],
      },
      {
        id: 'start',
        heading: { ar: 'كيف تبدأ الحديث', en: 'How to start the conversation' },
        paragraphs: [
          {
            ar: 'ابدأ بسؤال عن عملهم لا بطلب: «كيف بدأت في هذا المجال؟» يفتح حديثًا أطول من «هل عندكم وظائف؟».',
            en: 'Start with a question about their work, not a request: “How did you get into this field?” opens a longer conversation than “Do you have any jobs?”.',
          },
        ],
      },
      {
        id: 'follow',
        heading: { ar: 'المتابعة بعد اللقاء', en: 'Following up' },
        paragraphs: [
          {
            ar: 'أرسل رسالة قصيرة خلال يومين: اذكر أين التقيتما، وشيئًا قاله وأفادك، وشكرًا. لا تطلب شيئًا في الرسالة الأولى.',
            en: 'Send a short message within two days: where you met, one thing they said that helped you, and thanks. Do not ask for anything in the first message.',
          },
        ],
        checklist: [
          { ar: 'جهزت تعريفي في ثلاثين ثانية', en: 'I prepared my thirty-second introduction' },
          { ar: 'عندي سؤالان أبدأ بهما الحديث', en: 'I have two questions to open a conversation' },
          { ar: 'ملفي على لينكدإن محدّث', en: 'My LinkedIn profile is up to date' },
          { ar: 'أتابع خلال يومين', en: 'I follow up within two days' },
        ],
      },
    ],
  },
  {
    slug: 'first-week',
    title: { ar: 'أسبوعك الأول في العمل', en: 'Your first week at work' },
    summary: {
      ar: 'ما الذي يُنتظر منك في الأيام الأولى، وكيف تسأل دون أن تتردد، وكيف تترك انطباعًا يبقى.',
      en: 'What is expected of you in the first days, how to ask questions without hesitating, and how to leave an impression that lasts.',
    },
    minutes: 6,
    sessionSlug: 'career-guidance',
    sections: [
      {
        id: 'expect',
        heading: { ar: 'ما الذي يُنتظر منك فعلًا', en: 'What is really expected of you' },
        paragraphs: [
          {
            ar: 'لا أحد ينتظر منك أن تعرف كل شيء في الأسبوع الأول. المطلوب أن تفهم كيف يسير العمل، ومن تسأل عن ماذا، وأن تُنجز أول مهمة صغيرة بعناية.',
            en: 'Nobody expects you to know everything in the first week. What matters is understanding how the work runs, who to ask about what, and finishing your first small task with care.',
          },
          {
            ar: 'اسأل مديرك في اليوم الأول: «كيف أعرف بعد شهر أنني أؤدي جيدًا؟» الجواب يخبرك بما يهمه حقًا.',
            en: 'Ask your manager on day one: “How will I know in a month that I am doing well?” The answer tells you what they really care about.',
          },
        ],
      },
      {
        id: 'questions',
        heading: { ar: 'كيف تسأل دون أن تتردد', en: 'Asking without hesitating' },
        paragraphs: [
          {
            ar: 'جرّب وحدك ربع ساعة، ثم اسأل. وحين تسأل، قل ما جربته: «بحثت في الملف المشترك ولم أجد النموذج، أين أجده؟» هذا سؤال يحترم وقت من تسأله.',
            en: 'Try on your own for fifteen minutes, then ask. When you do, say what you tried: “I looked in the shared folder and could not find the template, where is it?” That kind of question respects the other person’s time.',
          },
          {
            ar: 'اجمع الأسئلة غير العاجلة واطرحها مرة واحدة في اليوم بدل أن تقاطع كل ساعة.',
            en: 'Collect the questions that can wait and ask them together once a day instead of interrupting every hour.',
          },
        ],
      },
      {
        id: 'notes',
        heading: { ar: 'دفتر الأسبوع الأول', en: 'A first-week notebook' },
        paragraphs: [
          {
            ar: 'دوّن أسماء الناس وأدوارهم، والأدوات وكلمات الفريق الخاصة، وكل خطوة شُرحت لك. لن تحتاج أن تسأل السؤال نفسه مرتين.',
            en: 'Write down people’s names and roles, the tools and the team’s own words, and every process someone explains to you. You will never need to ask the same question twice.',
          },
        ],
      },
      {
        id: 'impression',
        heading: { ar: 'الانطباع الذي يبقى', en: 'The impression that lasts' },
        paragraphs: [
          {
            ar: 'الالتزام بالمواعيد، والرد على الرسائل، وإخبار مديرك مبكرًا حين تتأخر مهمة: هذه الأشياء الصغيرة يتذكرها الناس أكثر من أي إنجاز كبير في الأسبوع الأول.',
            en: 'Being on time, answering messages, and telling your manager early when a task will be late: people remember these small things more than any big achievement in your first week.',
          },
          {
            ar: 'في نهاية الأسبوع، أرسل لمديرك ثلاثة أسطر: ما تعلمته، وما أنجزته، وما ستعمل عليه في الأسبوع القادم.',
            en: 'At the end of the week, send your manager three lines: what you learned, what you finished, and what you will work on next week.',
          },
        ],
        checklist: [
          { ar: 'سألت كيف يبدو الأداء الجيد بعد شهر', en: 'I asked what doing well looks like in a month' },
          { ar: 'أعرف من أسأل عن ماذا', en: 'I know who to ask about what' },
          { ar: 'بدأت دفتر الأسبوع الأول', en: 'I started a first-week notebook' },
          { ar: 'أرسلت ملخص الأسبوع لمديري', en: 'I sent my manager a summary of the week' },
        ],
      },
    ],
  },
  {
    slug: 'portfolio',
    title: { ar: 'ملف أعمالك من الصفر', en: 'Building a portfolio from scratch' },
    summary: {
      ar: 'كيف تختار ما تعرضه حين تكون أعمالك قليلة، وكيف تكتب عن كل عمل بحيث يفهم القارئ ما فعلته أنت.',
      en: 'How to choose what to show when you have little work yet, and how to write about each piece so a reader understands what you did.',
    },
    minutes: 7,
    sessionSlug: 'career-guidance',
    sections: [
      {
        id: 'what',
        heading: { ar: 'ما الذي يدخل الملف', en: 'What goes in' },
        paragraphs: [
          {
            ar: 'ثلاثة أعمال جيدة أفضل من عشرة متوسطة. اختر ما يقترب من العمل الذي تريده: مشروع لشركة، أو مشروع تخرج، أو عمل صنعته لنفسك وحللت فيه مشكلة حقيقية.',
            en: 'Three good pieces beat ten average ones. Choose what is closest to the work you want: a project for a company, a graduation project, or something you made for yourself that solved a real problem.',
          },
          {
            ar: 'المشاريع التي تنهيها في فرصة وتقبلها الشركة تُحفظ في سجلك مع ملاحظاتها، ويمكنك أن تضعها في ملفك مباشرة.',
            en: 'Projects you finish on Forsa that the company accepts are kept on your record with their feedback, and you can put them in your portfolio straight away.',
          },
        ],
      },
      {
        id: 'story',
        heading: { ar: 'اكتب القصة لا القائمة', en: 'Tell the story, not the list' },
        paragraphs: [
          {
            ar: 'لكل عمل أربعة أسطر: المشكلة، وما فعلته أنت تحديدًا، والنتيجة، وما تعلمته. وإن كان العمل جماعيًا فقل بوضوح ما كان دورك.',
            en: 'Give each piece four lines: the problem, what you did yourself, the result, and what you learned. If it was group work, say clearly what your part was.',
          },
          {
            ar: 'اعرض المراحل لا النتيجة وحدها: مسودة أولى، وما تغير بعد الملاحظات، والنسخة النهائية. صاحب العمل يريد أن يرى كيف تفكر.',
            en: 'Show the stages, not only the result: a first draft, what changed after feedback, and the final version. An employer wants to see how you think.',
          },
        ],
      },
      {
        id: 'where',
        heading: { ar: 'أين تضعه', en: 'Where to put it' },
        paragraphs: [
          {
            ar: 'رابط واحد يفتح بسرعة على الهاتف أهم من تصميم معقد. ملف مرتب أو صفحة بسيطة يكفي، وضع الرابط في سيرتك وفي ملفك على لينكدإن.',
            en: 'One link that opens quickly on a phone matters more than a complex design. A tidy file or a simple page is enough; put the link in your CV and on your LinkedIn profile.',
          },
          {
            ar: 'لا تنشر عملًا لشركة دون إذنها. اسأل أولًا، وإن رفضت فاعرض وصفًا للعمل دون بياناتها.',
            en: 'Do not publish work for a company without its permission. Ask first; if it says no, describe the work without its data.',
          },
        ],
        checklist: [
          { ar: 'اخترت ثلاثة أعمال قريبة من الدور الذي أريده', en: 'I chose three pieces close to the role I want' },
          { ar: 'لكل عمل مشكلة ودور ونتيجة', en: 'Each piece has a problem, my part and a result' },
          { ar: 'الرابط يفتح على الهاتف', en: 'The link opens on a phone' },
          { ar: 'أخذت إذن الشركات قبل النشر', en: 'I asked companies before publishing their work' },
        ],
      },
    ],
  },
]

export function guideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug)
}
