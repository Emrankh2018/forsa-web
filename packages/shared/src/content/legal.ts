/**
 * Privacy notice and terms, written 2026-11-20 against Qatar's Law No. 13 of 2016 on the Protection of
 * Personal Data Privacy. Launch draft: it describes the platform as it will run with accounts, and it
 * must be reviewed by a Qatari legal adviser before go-live (plan V4 section 13). In the server phase
 * these become rows of the `pages` table, edited by the admin.
 */
import type { Bilingual } from '../seed/sample'

export type LegalSection = {
  id: string
  heading: Bilingual
  /** Paragraphs shown before the list. */
  paragraphs?: Bilingual[]
  items?: Bilingual[]
  /** Paragraphs shown after the list. */
  after?: Bilingual[]
  /** Show the ways to reach Forsa (Instagram, contact page) under this section. */
  contactLinks?: boolean
}

export type LegalKind = 'privacy' | 'terms'

export type LegalDoc = { kind: LegalKind; sections: LegalSection[] }

const contactSection = (about: Bilingual): LegalSection => ({
  id: 'contact',
  heading: { ar: 'التواصل', en: 'Contact' },
  paragraphs: [about],
  contactLinks: true,
})

export const privacyDoc: LegalDoc = {
  kind: 'privacy',
  sections: [
    {
      id: 'who',
      heading: { ar: 'من نحن', en: 'Who we are' },
      paragraphs: [
        {
          ar: 'فرصة مبادرة مقرّها الدوحة في دولة قطر، تساعد الخريجين الجدد ومن هم على وشك التخرج وأصحاب المهارات الذين لا يحملون شهادة جامعية على اكتساب خبرة حقيقية، عبر مشاريع من شركات شريكة، وعبر الورش والجلسات الفردية والدورات والأدلة المجانية.',
          en: 'Forsa is an initiative based in Doha, Qatar. It helps new graduates, people about to graduate and skilled people without a university degree gain real experience, through projects from partner companies and through workshops, 1-to-1 sessions, courses and free guides.',
        },
        {
          ar: 'فرصة الآن في طور تأسيسها شركةً في قطر. وإلى أن يتم التسجيل، يتولى الفريق المؤسس لفرصة المسؤولية عن البيانات الشخصية الموصوفة في هذه الصفحة، بصفته المسؤول عن المعالجة وفق القانون رقم (١٣) لسنة ٢٠١٦ بشأن حماية خصوصية البيانات الشخصية. وحين تُسجَّل الشركة سنذكر اسمها هنا.',
          en: 'Forsa is being set up as a company in Qatar. Until it is registered, Forsa’s founding team is responsible for the personal data described on this page, as the controller under Qatar’s Law No. 13 of 2016 on the Protection of Personal Data Privacy. When the company is registered, this page will name it.',
        },
        {
          ar: 'توضح هذه الصفحة ما نجمعه حين تستعمل هذا الموقع ومنصة فرصة، ولماذا، ومن يطّلع عليه، وكم نحتفظ به، وما حقوقك. ولا تشمل المواقع الأخرى التي نضع روابط إليها، مثل إنستغرام، فلكلٍّ منها سياسته.',
          en: 'This page explains what we collect when you use this website and the Forsa platform, why, who sees it, how long we keep it, and what your rights are. It does not cover other sites we link to, such as Instagram, which have their own policies.',
        },
      ],
    },
    {
      id: 'collect',
      heading: { ar: 'ما نجمعه', en: 'What we collect' },
      paragraphs: [
        {
          ar: 'لا نجمع إلا ما تحتاجه الخدمة، ويختلف ذلك بحسب طريقة استعمالك لفرصة:',
          en: 'We collect only what the service needs. What that is depends on how you use Forsa:',
        },
      ],
      items: [
        {
          ar: 'لكل حساب: اسمك وبريدك الإلكتروني ورقم هاتفك إن أدخلته، ومدينتك ولغتك المفضلة. ولا نحفظ كلمة مرور: تدخل برمز يُرسل إلى بريدك لمرة واحدة، أو بحساب جوجل حين يُتاح هذا الخيار، وعندها يشاركنا جوجل اسمك وبريدك.',
          en: 'Every account: your name, email address, phone number if you give it, city and preferred language. We do not store a password: you sign in with a one-time code sent to your email, or with your Google account when that option is offered, in which case Google shares your name and email with us.',
        },
        {
          ar: 'للمشاركين: ملفك (المجالات والمهارات والدراسة ونبذة قصيرة والروابط التي تضيفها)، وطلباتك للمشاريع، والأعمال والملفات التي تسلّمها، وتحديثاتك وأسئلتك داخل المشروع، والملاحظات والتقييمات التي تكتبها الشركات عن عملك، وحجوزاتك، وتقدّمك في الدورات، وشهاداتك، وما تختار إظهاره في سجلك العام.',
          en: 'Participants: your profile (fields, skills, studies, a short introduction and the links you add), your applications to projects, the work and files you hand in, your updates and questions on a project, the feedback and ratings companies give your work, your bookings, your course progress, your certificates, and what you choose to show on your public record.',
        },
        {
          ar: 'للشركات والجهات: اسم الجهة وبيانات التحقق منها، واسم من يستعمل حسابها ودوره وبريده وهاتفه، والمشاريع التي تنشرها، والمراجعات التي تكتبها، والدعوات التي ترسلها.',
          en: 'Organisations: the organisation’s name and the details needed to verify it, the name, role, email and phone of the people who use its account, the projects it posts, the reviews it writes and the invitations it sends.',
        },
        {
          ar: 'للمدربين: مجالك وخبرتك ونبذتك، ومواعيدك المتاحة، والورش والجلسات والدورات التي تعدّها، وسجلات الحضور.',
          en: 'Trainers: your field, experience and short biography, your availability, the workshops, sessions and courses you prepare, and attendance records.',
        },
        {
          ar: 'النماذج دون حساب: ما تكتبه في نموذج الشركاء أو في سؤال ترسله إلينا، مثل اسمك وجهتك وبريدك وهاتفك ورسالتك.',
          en: 'Forms without an account: what you write in the partners form or in a question to us, such as your name, organisation, email, phone and message.',
        },
        {
          ar: 'المدفوعات: عند حجز ورشة أو جلسة مدفوعة نسجّل المبلغ والتاريخ وهل دُفع أو أُعفي منه. ويؤكد فريق فرصة الدفع بنفسه، ولا يطلب الموقع أرقام البطاقات ولا يحفظها.',
          en: 'Payments: when you book a paid workshop or session we record the amount, the date and whether it was paid or waived. The Forsa team confirms payment itself; the site does not ask for or store card numbers.',
        },
        {
          ar: 'السجلات التقنية: تحتفظ خوادمنا بسجلات قصيرة للطلبات (عنوان IP ونوع المتصفح والصفحة المطلوبة والوقت) لحماية الموقع وإصلاح الأخطاء. ولا نستعمل أدوات تتبّع إعلانية ولا أدوات تحليلات.',
          en: 'Technical records: our servers keep short logs of requests (IP address, browser type, the page asked for and the time) to keep the site secure and fix errors. We use no advertising trackers and no analytics tools.',
        },
      ],
    },
    {
      id: 'use',
      heading: { ar: 'لماذا نستعملها', en: 'Why we use it' },
      paragraphs: [{ ar: 'نستعمل بياناتك لهذه الأغراض فقط:', en: 'We use your data for these purposes only:' }],
      items: [
        { ar: 'إنشاء حسابك وتشغيله وتمكينك من الدخول.', en: 'To create and run your account and let you sign in.' },
        { ar: 'تمكين الشركة من مراجعة العمل الذي تسلّمه في مشروعها وكتابة ملاحظاتها لك.', en: 'To let a company review the work you hand in on its project and give you feedback.' },
        { ar: 'إدارة الحجوزات والمقاعد في الورش والجلسات، وتأكيد المدفوعات.', en: 'To run bookings and seats for workshops and sessions, and to confirm payments.' },
        { ar: 'إصدار الشهادات، وتمكين أي شخص من التحقق من صحتها.', en: 'To issue certificates and let anyone check that a certificate is genuine.' },
        { ar: 'إرسال ما تحتاجه الخدمة من رسائل: رموز الدخول وتأكيد الحجوزات ووصول المراجعات والتذكيرات.', en: 'To send the messages the service needs: sign-in codes, booking confirmations, reviews received and reminders.' },
        { ar: 'حماية المنصة: التحقق من الشركات والمدربين، ومنع إساءة الاستعمال، وتسجيل ما يقوم به المشرفون.', en: 'To keep the platform safe: verifying organisations and trainers, preventing misuse, and recording what administrators do.' },
        { ar: 'تحسين فرصة بأرقام إجمالية لا تدل على أحد.', en: 'To improve Forsa using totals that do not identify anyone.' },
        { ar: 'الوفاء بما يفرضه القانون.', en: 'To meet our obligations under the law.' },
      ],
      after: [
        {
          ar: 'نعالج بياناتك بموافقتك، التي تمنحها حين تنشئ حسابًا أو ترسل نموذجًا، أو حين تكون المعالجة لازمة لتقديم الخدمة التي طلبتها أو لتحقيق غرض مشروع وفق القانون القطري. ويمكنك سحب موافقتك في أي وقت، دون أن يمسّ ذلك ما تم قبل السحب.',
          en: 'We process your data with your consent, which you give when you create an account or send a form, or where processing is needed to provide the service you asked for or for a lawful purpose under Qatari law. You can withdraw your consent at any time; this does not affect what was done before.',
        },
        {
          ar: 'ولا نرسل الأخبار أو العروض بالبريد إلا إذا وافقت على تلقيها، وفي كل رسالة منها طريقة لإيقافها.',
          en: 'We send news or offers by email only if you agree to receive them, and every such email has a way to stop them.',
        },
      ],
    },
    {
      id: 'share',
      heading: { ar: 'من يطّلع على بياناتك', en: 'Who sees your data' },
      items: [
        {
          ar: 'الشركة صاحبة المشروع ترى ملخص ملفك حين تتقدم، والعمل الذي تسلّمه في مشروعها فقط. ولا ترى بريدك وهاتفك إلا إذا قبلت دعوتها للتواصل.',
          en: 'A company that posts a project sees your profile summary when you apply, and the work you hand in on that project only. It sees your email and phone only if you accept its invitation to talk.',
        },
        {
          ar: 'المدرب يرى أسماء من حجزوا ورشه وجلساته، وسجلات حضورهم.',
          en: 'A trainer sees the names of the people booked on their workshops and sessions, and their attendance.',
        },
        {
          ar: 'أي شخص يستطيع رؤية سجلك العام، ولا يظهر فيه إلا ما تختار إظهاره، ويستطيع التحقق من شهادة برمزها. ولا يُظهر التحقق إلا ما يثبت الشهادة: اسم حاملها ونوعها والمشروع أو الورشة والجهة المصدرة والتاريخ.',
          en: 'Anyone can see your public record, which shows only what you choose to show, and can check a certificate by its code. The check shows only what proves the certificate: the holder’s name, the type, the project or workshop, who issued it and the date.',
        },
        {
          ar: 'فريق فرصة يطّلع على ما يحتاجه لمراجعة التسجيلات والمشاريع والحجوزات والمدفوعات، وكل إجراء يقوم به المشرف مسجَّل.',
          en: 'The Forsa team sees what it needs to review registrations, projects, bookings and payments. Every administrator action is recorded.',
        },
        {
          ar: 'مزودو الخدمات الذين يشغّلون أجزاء من الخدمة لحسابنا، مثل الاستضافة وإرسال البريد وتسجيل الدخول، يعالجون البيانات بتعليماتنا فقط ولتقديم الخدمة فقط.',
          en: 'Service providers that run parts of the service for us, such as hosting, email sending and sign-in, process data only on our instructions and only to provide the service.',
        },
        { ar: 'الجهات الرسمية، حين يفرض القانون القطري ذلك.', en: 'Authorities, when Qatari law requires it.' },
      ],
      after: [{ ar: 'لا نبيع البيانات الشخصية أبدًا، ولا نشاركها لأغراض إعلانية.', en: 'We never sell personal data, and we never share it for advertising.' }],
    },
    {
      id: 'abroad',
      heading: { ar: 'أين تُحفظ بياناتك', en: 'Where your data is stored' },
      paragraphs: [
        {
          ar: 'تُحفظ بياناتك على خوادم نديرها ولدى مزودي استضافة نختارهم، وقد يقع بعض هذه الخوادم خارج قطر. وحين تُحفظ البيانات أو تُرسل خارج قطر، لا نتعامل إلا مع مزودين يحمونها بمستوى يناسب القانون القطري، ولا نستعملها إلا للأغراض المذكورة في هذه الصفحة.',
          en: 'Your data is stored on servers we run and with hosting providers we choose. Some of these servers may be outside Qatar. When data is stored or sent outside Qatar, we use only providers that protect it to a standard suitable under Qatari law, and only for the purposes on this page.',
        },
      ],
    },
    {
      id: 'keep',
      heading: { ar: 'مدة الاحتفاظ', en: 'How long we keep it' },
      items: [
        {
          ar: 'بيانات الحساب: ما دام حسابك قائمًا. وحين تحذف حسابك تُزال بياناتك الشخصية من المنصة خلال ٣٠ يومًا، ومن النسخ الاحتياطية عند استبدالها خلال ٩٠ يومًا.',
          en: 'Account data: while your account is open. When you delete your account, your personal data is removed from the platform within 30 days, and from backups as they are replaced, within 90 days.',
        },
        {
          ar: 'الشهادات: حين تحذف حسابك تُلغى شهاداتك ويُزال اسمك منها.',
          en: 'Certificates: when you delete your account, your certificates are revoked and your name is removed from them.',
        },
        {
          ar: 'نماذج الشركاء والأسئلة: حتى ١٢ شهرًا إن لم ينتج عنها تعاون أو متابعة.',
          en: 'Partner and question forms: up to 12 months if no partnership or follow-up comes of them.',
        },
        { ar: 'السجلات التقنية: حتى ٩٠ يومًا.', en: 'Technical logs: up to 90 days.' },
        {
          ar: 'سجلات الدفع: المدة التي يفرضها القانون، دون ما يدل عليك متى أمكن ذلك.',
          en: 'Payment records: as long as the law requires, without details that identify you where that is possible.',
        },
      ],
    },
    {
      id: 'rights',
      heading: { ar: 'حقوقك', en: 'Your rights' },
      paragraphs: [{ ar: 'يكفل لك القانون القطري الحق في:', en: 'Under Qatari law you have the right to:' }],
      items: [
        { ar: 'معرفة البيانات التي نحتفظ بها عنك والحصول على نسخة منها.', en: 'Know what data we hold about you and get a copy of it.' },
        { ar: 'تصحيح البيانات الخاطئة أو الناقصة.', en: 'Correct data that is wrong or incomplete.' },
        { ar: 'طلب حذف بياناتك.', en: 'Ask us to delete your data.' },
        { ar: 'سحب موافقتك في أي وقت.', en: 'Withdraw your consent at any time.' },
        { ar: 'الاعتراض على أي معالجة لا تلزم للأغراض المذكورة في هذه الصفحة.', en: 'Object to any processing that is not needed for the purposes on this page.' },
        { ar: 'إبلاغك إن كُشفت بياناتك بصورة غير صحيحة، أو تعرّضت لاختراق يمسّها.', en: 'Be told if your data was disclosed inaccurately, or if a breach affects it.' },
      ],
      after: [
        {
          ar: 'ويمكنك القيام بمعظم ذلك بنفسك من إعدادات حسابك: تعديل ملفك، واختيار ما يظهر في سجلك العام، وحذف حسابك. ولغير ذلك تواصل معنا كما هو موضح أدناه، وسنرد خلال ٣٠ يومًا. وإن لم يرضك ردنا فلك أن تتقدم بشكوى إلى الجهة المختصة في قطر، وهي حاليًا الوكالة الوطنية للأمن السيبراني.',
          en: 'You can do most of this yourself in your account settings: edit your profile, choose what your public record shows, and delete your account. For anything else, contact us as below; we reply within 30 days. If you are not satisfied with our answer, you can complain to the competent authority in Qatar, currently the National Cyber Security Agency.',
        },
      ],
    },
    {
      id: 'security',
      heading: { ar: 'كيف نحمي بياناتك', en: 'How we protect your data' },
      items: [
        { ar: 'كل اتصال بالموقع مشفَّر.', en: 'Every connection to the site is encrypted.' },
        { ar: 'لا يرى كل شخص إلا ما يسمح به دوره، وتفرض قاعدة البيانات نفسها ذلك.', en: 'Each person sees only what their role allows, and the database itself enforces this.' },
        { ar: 'يدخل المشرفون بخطوة تحقق ثانية، وتُسجَّل إجراءاتهم.', en: 'Administrators sign in with a second step, and their actions are recorded.' },
        { ar: 'نجمع أقل قدر ممكن، ونحذف ما لم تعد له حاجة.', en: 'We collect as little as possible and remove what is no longer needed.' },
      ],
      after: [
        {
          ar: 'وإن وقع اختراق يُحتمل أن يضرّك، فسنبلغك ونبلغ الجهة المختصة دون تأخير كما يفرض القانون.',
          en: 'If a breach is likely to harm you, we will tell you and the competent authority without delay, as the law requires.',
        },
      ],
    },
    {
      id: 'age',
      heading: { ar: 'السن', en: 'Age' },
      paragraphs: [
        {
          ar: 'فرصة لمن بلغ ١٨ سنة فأكثر، ولا نجمع عن قصد بيانات من هم أصغر سنًا، وإن علمنا بذلك حذفناها.',
          en: 'Forsa is for people aged 18 and over. We do not knowingly collect data about anyone younger, and if we learn that we have, we delete it.',
        },
      ],
    },
    {
      id: 'cookies',
      heading: { ar: 'ملفات تعريف الارتباط وتخزين المتصفح', en: 'Cookies and browser storage' },
      paragraphs: [
        {
          ar: 'لا يستعمل الموقع ملفات تعريف ارتباط إعلانية أو للتتبع. ويحفظ بعض الملاحظات الصغيرة في التخزين المؤقت لمتصفحك، مثل أنك شاهدت مشهد الباب في البداية حتى لا يتكرر، وتُحذف هذه الملاحظات حين تغلق التبويب.',
          en: 'The site uses no advertising or tracking cookies. It keeps a few small notes in your browser’s temporary storage, for example that you have already seen the opening door so it does not play again. These notes are deleted when you close the tab.',
        },
        {
          ar: 'وحين تُفتح الحسابات سيحفظ الموقع ملف ارتباط ضروريًا يُبقيك مسجّل الدخول. ولأن هذه ضرورية لعمل الموقع فلا نطلب موافقتك عليها. وإن أضفنا يومًا أدوات تحليلات أو أي شيء غير ضروري، فسنطلب موافقتك أولًا ونحدّث هذه الصفحة.',
          en: 'When accounts open, the site will set a necessary cookie that keeps you signed in. Because these are needed for the site to work, we do not ask for consent to them. If we ever add analytics or anything that is not necessary, we will ask you first and update this page.',
        },
      ],
    },
    {
      id: 'changes',
      heading: { ar: 'تغيير هذه الصفحة', en: 'Changes to this page' },
      paragraphs: [
        {
          ar: 'حين نغيّر هذه الصفحة نحدّث التاريخ في أعلاها. وإن كان التغيير مهمًا أبلغنا أصحاب الحسابات بالبريد أو على المنصة قبل أن يسري.',
          en: 'When we change this page we update the date at the top. If a change matters, we tell account holders by email or on the platform before it takes effect.',
        },
      ],
    },
    contactSection({
      ar: 'لأي سؤال عن بياناتك أو لممارسة أي من حقوقك، راسلنا على إنستغرام أو من صفحة التواصل. وسنضيف هنا بريدًا مخصصًا حين تُسجَّل فرصة.',
      en: 'For any question about your data, or to use any of your rights, send us a message on Instagram or use the contact page. A dedicated email address will be added here once Forsa is registered.',
    }),
  ],
}

export const termsDoc: LegalDoc = {
  kind: 'terms',
  sections: [
    {
      id: 'about',
      heading: { ar: 'عن هذه الشروط', en: 'About these terms' },
      paragraphs: [
        {
          ar: 'هذه الشروط اتفاق بينك وبين فرصة، وهي مبادرة مقرّها الدوحة في دولة قطر، في طور تأسيسها شركةً. وتسري على هذا الموقع ومنصة فرصة، وبإنشائك حسابًا أو استعمالك المنصة فإنك تقبلها.',
          en: 'These terms are the agreement between you and Forsa, an initiative based in Doha, Qatar, that is being set up as a company. They apply to this website and the Forsa platform. By creating an account or using the platform, you accept them.',
        },
        {
          ar: 'وإن كنت تستعمل فرصة نيابة عن شركة أو جهة، فإنك تؤكد أن لك صلاحية قبول هذه الشروط باسمها.',
          en: 'If you use Forsa on behalf of a company or another organisation, you confirm that you may accept these terms for it.',
        },
        {
          ar: 'وطريقة تعاملنا مع البيانات الشخصية موضحة في صفحة الخصوصية.',
          en: 'How we handle personal data is explained on the privacy page.',
        },
      ],
    },
    {
      id: 'accounts',
      heading: { ar: 'الحسابات', en: 'Accounts' },
      items: [
        { ar: 'يجب أن تكون قد بلغت ١٨ سنة.', en: 'You must be 18 or over.' },
        { ar: 'حساب واحد لكل شخص، ببيانات صحيحة.', en: 'One account per person, with true details.' },
        {
          ar: 'احفظ بريدك الإلكتروني من وصول غيرك إليه، فرموز الدخول تُرسل إليه، وأنت مسؤول عما يجري في حسابك.',
          en: 'Keep your email safe from others, because sign-in codes are sent there. You are responsible for what happens in your account.',
        },
        {
          ar: 'يراجع فريق فرصة الشركات والجهات قبل أن تنشر مشاريعها، والمدربين قبل نشر ورشهم وجلساتهم ودوراتهم.',
          en: 'The Forsa team reviews organisations before they can post projects, and trainers before their workshops, sessions or courses are published.',
        },
      ],
    },
    {
      id: 'conduct',
      heading: { ar: 'حسن الاستعمال', en: 'Using the platform properly' },
      paragraphs: [{ ar: 'تتعهد بألا:', en: 'You agree not to:' }],
      items: [
        { ar: 'تنشر ما يسيء أو يميّز أو يضلّل أو يخالف القانون.', en: 'Post anything offensive, discriminatory, misleading or unlawful.' },
        { ar: 'تنتهك حقوق أحد، ومن ذلك نسخ عمل غيرك وتسليمه على أنه عملك.', en: 'Infringe anyone’s rights, including copying someone else’s work and handing it in as yours.' },
        { ar: 'تنشر عمل مشارك آخر أو بياناته دون إذنه.', en: 'Share another participant’s work or details without their permission.' },
        { ar: 'تطلب من المشاركين مالًا، أو عملًا يتجاوز ما يصفه المشروع.', en: 'Ask participants for money, or for work beyond what a project describes.' },
        { ar: 'تحاول اختراق المنصة أو إثقالها أو نسخها، أو تستعمل أدوات آلية لجمع محتواها.', en: 'Try to break into, overload or copy the platform, or use automated tools to collect its content.' },
      ],
    },
    {
      id: 'projects',
      heading: { ar: 'المشاريع', en: 'Projects' },
      paragraphs: [
        {
          ar: 'المشاريع تدريب على عمل حقيقي؛ لا يتقاضى المشارك عنها مقابلًا ماليًا، ولا تدفع الشركة رسومًا لنشرها.',
          en: 'Projects are training on real work. Participants are not paid for them, and companies pay no fee to post them.',
        },
        {
          ar: 'وتختار الشركة لكل مشروع إحدى طريقتين: تحدٍّ مفتوح ينضم إليه كل من تنطبق عليه الشروط، أو تقديم أولًا تختار فيه الشركة المشاركين بعدد المقاعد.',
          en: 'For each project the company chooses one of two ways: an open challenge that anyone eligible may join, or apply first, where the company selects participants up to the number of seats.',
        },
        {
          ar: 'وتلتزم الشركة بمراجعة كل عمل يُسلَّم خلال المدة المذكورة في المشروع وكتابة ملاحظاتها، ولا يحق لها أن تطلب من المشاركين عملًا يتجاوز وصف المشروع.',
          en: 'The company commits to reviewing every piece of work handed in within the time stated on the project, and to writing feedback. It may not ask participants for work beyond the project’s description.',
        },
        {
          ar: 'ويراجع فريق فرصة كل مشروع قبل نشره ليتأكد أنه مشروع تدريبي محدد، وليس عملًا إنتاجيًا مستعجلًا.',
          en: 'The Forsa team reviews each project before it goes live, to make sure it is a defined training brief and not rushed production work.',
        },
      ],
    },
    {
      id: 'work',
      heading: { ar: 'ملكية العمل', en: 'Who owns the work' },
      items: [
        {
          ar: 'يحتفظ المشارك بملكية العمل الذي ينجزه ويسلّمه، وله أن يعرضه في ملف أعماله وسجله العام.',
          en: 'The participant keeps ownership of the work they create and hand in, and may show it in their portfolio and on their public record.',
        },
        {
          ar: 'حين تقبل الشركة عملًا، يحق لها استعماله وتعديله ونشره لأغراضها دون مقابل ودون حدّ زمني، مع ذكر اسم المشارك متى سمح الاستعمال بذلك. وهذا الحق غير حصري، فيبقى للمشارك حقه.',
          en: 'When a company accepts a piece of work, it may use, change and publish it for its own purposes, free of charge and without time limit, crediting the participant where the use allows. This right is not exclusive: the participant keeps theirs.',
        },
        { ar: 'لا يحق للشركة استعمال عمل لم تقبله.', en: 'A company may not use work it has not accepted.' },
        {
          ar: 'ما تقدمه الشركة من مواد في وصف المشروع يبقى ملكًا لها، وإن وصفت شيئًا منه بأنه سري فللمشارك أن يصف عمله دون أن ينشر تلك المواد.',
          en: 'Material the company provides in a project’s description stays the company’s. If it marks something as confidential, the participant may describe their work but not publish that material.',
        },
        {
          ar: 'ولا يجوز اتفاق مختلف إلا إذا نصّ عليه المشروع قبل أن ينضم إليه أحد، ووافق عليه كل مشارك عند انضمامه.',
          en: 'A different arrangement is allowed only if the project states it before anyone joins, and each participant agrees to it when joining.',
        },
        {
          ar: 'ولا تعرض فرصة أي عمل على المنصة أو في التعريف بنفسها إلا بموافقة المشارك والشركة.',
          en: 'Forsa shows a piece of work on the platform or when presenting itself only with the agreement of the participant and the company.',
        },
      ],
    },
    {
      id: 'hiring',
      heading: { ar: 'التواصل والتوظيف', en: 'Contact and hiring' },
      paragraphs: [
        {
          ar: 'لا ترى الشركة بيانات تواصل المشارك إلا بعد أن يقبل دعوتها للتواصل.',
          en: 'A company sees a participant’s contact details only after the participant accepts its invitation to talk.',
        },
        {
          ar: 'وأي عرض عمل أو عقد أو أجر يُتفق عليه بين الشركة والمشارك مباشرة، وليست فرصة طرفًا فيه، ولا تأخذ من المشارك أي رسوم.',
          en: 'Any job offer, contract or pay is agreed directly between the company and the participant. Forsa is not a party to it and never takes a fee from a participant.',
        },
      ],
    },
    {
      id: 'training',
      heading: { ar: 'الورش والجلسات والدورات', en: 'Workshops, sessions and courses' },
      items: [
        {
          ar: 'سعر الورشة ٢٥٠ ريالًا قطريًا ما لم تذكر صفحتها غير ذلك، وتُظهر الجلسات والدورات سعرها قبل الحجز.',
          en: 'A workshop costs QAR 250 unless its page says otherwise. Sessions and courses show their price before you book.',
        },
        {
          ar: 'الحجز يثبّت مقعدك، ويؤكد فريق فرصة الدفع، ويُلغى المقعد المحجوز إن لم يُدفع خلال المدة الظاهرة.',
          en: 'Booking holds your seat. The Forsa team confirms your payment, and a held seat that is not paid within the time shown is released.',
        },
        {
          ar: 'يُسترد المبلغ كاملًا إذا ألغيت الحجز قبل الموعد بثمانٍ وأربعين ساعة على الأقل. وبعد ذلك لا يُسترد المبلغ، لكننا ننقلك إلى موعد لاحق إن توفر مقعد.',
          en: 'You get a full refund if you cancel at least 48 hours before the start. After that there is no refund, but we will move you to a later date if a seat is free.',
        },
        {
          ar: 'وإن ألغت فرصة ورشة أو جلسة أو غيّرت موعدها، فلك أن تختار استرداد المبلغ كاملًا أو الموعد الجديد.',
          en: 'If Forsa cancels or moves a workshop or session, you choose between a full refund and the new date.',
        },
        {
          ar: 'لا تسجّل ورشة أو جلسة ولا تنشرها دون موافقة المدرب والحاضرين.',
          en: 'Do not record or share a workshop or session without the consent of the trainer and the people attending.',
        },
      ],
    },
    {
      id: 'certificates',
      heading: { ar: 'الشهادات', en: 'Certificates' },
      paragraphs: [
        {
          ar: 'تصدر شهادة المشروع عن الشركة وفرصة معًا حين تقبل الشركة العمل، وتصدر شهادات الورش والدورات عن فرصة عند الحضور أو الإتمام. ولكل شهادة رمز يستطيع أي شخص التحقق منه على الموقع.',
          en: 'A project certificate is issued jointly by the company and Forsa when the company accepts the work. Workshop and course certificates are issued by Forsa on attendance or completion. Each certificate has a code that anyone can check on the site.',
        },
        {
          ar: 'ولفرصة أن تلغي شهادة صدرت خطأً أو نيلت بغير حق، كأن يُسلَّم عمل شخص آخر.',
          en: 'Forsa may revoke a certificate issued by mistake or obtained dishonestly, for example by handing in someone else’s work.',
        },
      ],
    },
    {
      id: 'no-job',
      heading: { ar: 'لا وعد بوظيفة', en: 'No promise of a job' },
      paragraphs: [
        {
          ar: 'إنجاز مشروع أو ورشة أو دورة لا يضمن وظيفة ولا مقابلة ولا نتيجة بعينها، لكنه يمنحك خبرة حقيقية ودليلًا على عملك.',
          en: 'Finishing a project, a workshop or a course does not guarantee a job, an interview or any particular result. It gives you real experience and evidence of your work.',
        },
      ],
    },
    {
      id: 'content',
      heading: { ar: 'محتوى فرصة', en: 'Forsa’s content' },
      paragraphs: [
        {
          ar: 'تصميم الموقع واسم فرصة وشعارها والأدلة ملك لفرصة. ولك أن تقرأ الأدلة وتشاركها مع ذكر فرصة مصدرًا، دون أن تبيعها أو تنسبها إلى نفسك.',
          en: 'The site’s design, the Forsa name and logo, and the guides belong to Forsa. You may read and share the guides with credit to Forsa, but not sell them or present them as your own.',
        },
      ],
    },
    {
      id: 'liability',
      heading: { ar: 'المسؤولية', en: 'Responsibility' },
      paragraphs: [
        {
          ar: 'نعمل على أن تبقى المنصة متاحة ودقيقة وآمنة، لكننا نقدمها على حالها، ولا نستطيع أن نعد بخلوّها دائمًا من الأخطاء أو الانقطاع.',
          en: 'We work to keep the platform available, accurate and safe, but we provide it as it is and cannot promise it will always be free of errors or interruptions.',
        },
        {
          ar: 'والشركات والمدربون والمشاركون مسؤولون عما ينشرونه ويفعلونه، ولا تتحمل فرصة مسؤولية أفعالهم الخارجة عن سيطرتها. ولا يحدّ شيء في هذه الشروط من مسؤولية لا يجيز القانون القطري الحدّ منها.',
          en: 'Companies, trainers and participants are responsible for what they post and do, and Forsa is not responsible for their actions beyond its control. Nothing in these terms limits a responsibility that Qatari law does not allow to be limited.',
        },
      ],
    },
    {
      id: 'ending',
      heading: { ar: 'إنهاء الحساب أو إيقافه', en: 'Ending or suspending an account' },
      paragraphs: [
        {
          ar: 'يمكنك حذف حسابك في أي وقت من إعداداتك. ويحق لنا إيقاف أي حساب يخالف هذه الشروط بعد تنبيهه، أو فورًا في الحالات الخطيرة كالاحتيال أو المضايقة، ولك أن تطلب منا مراجعة الإيقاف.',
          en: 'You can delete your account at any time from your settings. We may suspend an account that breaks these terms after a warning, or at once in serious cases such as fraud or harassment. You can ask us to review a suspension.',
        },
      ],
    },
    {
      id: 'changes',
      heading: { ar: 'تغيير هذه الشروط', en: 'Changes to these terms' },
      paragraphs: [
        {
          ar: 'حين نغيّر هذه الشروط نحدّث التاريخ في أعلاها، وإن كان التغيير مهمًا أبلغنا أصحاب الحسابات قبل أن يسري. واستمرارك في استعمال فرصة بعد ذلك يعني قبولك التغيير.',
          en: 'When we change these terms we update the date at the top. If a change matters, we tell account holders before it takes effect. Continuing to use Forsa after that means you accept the change.',
        },
      ],
    },
    {
      id: 'law',
      heading: { ar: 'القانون واللغة', en: 'Law and language' },
      paragraphs: [
        {
          ar: 'تخضع هذه الشروط لقوانين دولة قطر، وتختص محاكم قطر بالنظر في أي نزاع. وهي مكتوبة بالعربية والإنجليزية، وعند الاختلاف يُعتمد النص العربي.',
          en: 'These terms are governed by the laws of the State of Qatar, and the courts of Qatar decide any dispute. They are written in Arabic and English; if the two differ, the Arabic text prevails.',
        },
      ],
    },
    contactSection({
      ar: 'لأي سؤال عن هذه الشروط، راسلنا على إنستغرام أو من صفحة التواصل.',
      en: 'For any question about these terms, send us a message on Instagram or use the contact page.',
    }),
  ],
}

export const legalDocs: Record<LegalKind, LegalDoc> = { privacy: privacyDoc, terms: termsDoc }
