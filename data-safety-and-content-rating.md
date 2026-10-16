# إجابات جاهزة لاستمارات Play Console — حصيلتي (Hasila)

ده ملف تلزقه منه إجابات على طول لحد ما تفتح حساب Play Developer. كل قسم بيمثل استمارة موجودة في Play Console.

---

## 1) Data Safety (أمان البيانات)

المسار: Play Console → App content → Data safety

### هل التطبيق بيجمع أو يشارك بيانات المستخدم؟
**Yes** (لازم تختار Yes لأن AdMob بيجمع بيانات للإعلانات، حتى لو التطبيق نفسه مش بيجمع حاجة)

### الأقسام اللي هتظهرلك وإجاباتها:

**Location**
- Approximate location: **Collected** ✅ (بواسطة AdMob، مش التطبيق)
  - Purpose: Advertising or marketing
  - Is this shared with third parties? **Yes** (Google AdMob)
  - Is this data processed ephemerally? No
  - Is this collection optional for the user? لأ، مرتبط بعرض الإعلانات
- Precise location: **Not collected**

**Personal info** (الاسم، الإيميل، رقم الهاتف، إلخ)
- **Not collected** — التطبيق مفيهوش تسجيل دخول أو حسابات خالص

**Financial info**
- **Not collected**

**Health and fitness**
- **Not collected**

**Messages**
- **Not collected**

**Photos and videos**
- **Not collected**

**Audio files**
- **Not collected**

**Files and docs**
- **Not collected**
- (ملحوظة: لو فيه خاصية "تصدير نسخة احتياطية" بتحفظ ملف على الجهاز، ده التطبيق مش بياخده منك، هو بس بيطلعلك ملف — فمش محتاج تتصرح كـ "collected")

**Calendar**
- **Not collected**

**Contacts**
- **Not collected**

**App activity**
- App interactions: **Collected** ✅ (بواسطة AdMob بس — بيانات التفاعل مع الإعلان)
  - Purpose: Advertising or marketing, Analytics
  - Shared with third parties? **Yes** (Google AdMob)
- In-app search history: Not collected
- Installed apps: Not collected
- Other user-generated content: Not collected
- Other actions: Not collected

**Web browsing**
- **Not collected**

**App info and performance**
- Crash logs: **Not collected** (التطبيق نفسه مفيهوش Crashlytics أو أي أداة تتبع أعطال)
- Diagnostics: **Not collected**
- Other app performance data: Not collected

**Device or other identifiers**
- Device or other IDs: **Collected** ✅ (بواسطة AdMob — Advertising ID)
  - Purpose: Advertising or marketing
  - Shared with third parties? **Yes** (Google AdMob)

### أسئلة عامة بعد الجدول:
- **Is all of the user data collected by your app encrypted in transit?** → Yes (كل حركة بيانات AdMob بتتبعت عبر HTTPS)
- **Do you provide a way for users to request that their data is deleted?** → بما إن مفيش حساب أو بيانات متخزنة على سيرفر، اختار: **"No data is collected"** مش متاحة هنا لأن فيه بيانات AdMob، فـ اختار **"Not applicable"** لو ظهرت، أو وضّح إن المستخدم يقدر يمسح بيانات التطبيق محليًا من إعدادات الأندرويد (Settings → Apps → Hasila → Clear data) وده بيمسح كل حاجة محليًا فورًا.
- **Data types your app collects are user-controlled (optional)?** → الموقع التقريبي وبيانات الإعلانات مرتبطة بعرض الإعلان نفسه مش اختيار منفصل، فـ اختار No إلا لو السؤال بيقصد حاجة تانية.

---

## 2) Content Rating Questionnaire (تصنيف المحتوى - IARC)

المسار: Play Console → App content → Content rating → ابدأ الاستبيان (هيبعتلك IARC إيميل تأكيد)

اختر فئة **"Reference, News, or Educational"** أو **"Utility, Productivity, Communication, or Other"** — الأقرب هو **Educational**.

الأسئلة النمطية وإجاباتها لحصيلتي:

| السؤال | الإجابة |
|---|---|
| Violence (عنف بأي شكل) | None |
| Blood / gore | None |
| Sexual content / nudity | None |
| Profanity / crude humor | None |
| Controlled substances (كحول، مخدرات، تدخين) | None |
| Gambling (مقامرة حقيقية أو محاكاة) | None |
| User-generated content يشوفه مستخدمين تانيين (شات، مشاركة عامة) | No — مفيش ميزة اجتماعية أو مشاركة محتوى بين المستخدمين |
| مشاركة الموقع الجغرافي مع مستخدمين تانيين | No |
| مشاركة معلومات شخصية مع مستخدمين/أطراف تالتة (غير الإعلانات) | No |
| يحتوي على إعلانات (Advertising) | **Yes** — بانر + فيديو مكافأة عبر Google AdMob |
| Digital purchases / in-app purchases | No (إلا لو ضفت Premium حقيقي بمدفوعات، لو لسه مفيش اختار No) |
| Shares user's location | Yes, بس فقط بشكل تقريبي ولأغراض الإعلانات (مش ميزة بالتطبيق) — بعض نسخ الاستبيان بتسأل عن كده منفصل تحت "Ads" |

**النتيجة المتوقعة:** التصنيف هيطلع **"Everyone" / "3+"** في أغلب الأنظمة (PEGI 3, ESRB Everyone, USK 0) لأن مفيش محتوى حساس خالص، والسبب الوحيد اللي بيوصل التصنيف لحاجة زي "Everyone" بدل الأقل هو وجود الإعلانات نفسها.

---

## 3) Target Audience and Content (الفئة المستهدفة)

المسار: Play Console → App content → Target audience and content

- **Target age group:** اختار الفئات العمرية اللي التطبيق موجّه لها فعليًا. حصيلتي مناسب لطلاب ومتعلمين، الأنسب: **18 وما فوق + 13-17** (مش موجه للأطفال تحت 13). لو حابب تضيف 13-17 ضيفها لأن طلاب الثانوي بيستخدموا تطبيقات زي ده، بس **متختارش أي فئة تحت 13** عشان كده هيفعّل قواعد Google الخاصة بمحتوى الأطفال (Families Policy) واللي بتطلب منك قيود إضافية على الإعلانات ومعالجة بيانات مختلفة تمامًا.
- **Appeals to children?** → **No**
- بعد كده هيسألك عن **Ads**: "Does your app contain ads?" → **Yes**, وبعدين هيسألك هل الإعلانات متوافقة مع سياسة الأطفال (Google Play Families Policy) — بما إنك مش مستهدف تحت 13، معظم الأسئلة دي هتتخطى.

---

## 4) News app declaration
مش محتاج — حصيلتي مش تطبيق أخبار.

## 5) COVID-19 contact tracing / status apps
مش محتاج — مينفعش ينطبق.

## 6) Data safety ↔ AdMob linking
بعد ما تفتح حساب AdMob وتربطه بـ Play Console (Play Console → Monetization setup)، جوجل أحيانًا بتساعد تملي جزء من Data Safety تلقائيًا بناءً على الـ SDKs المستخدمة (AdMob SDK هيظهر تلقائيًا كـ "detected SDK"). راجع إنه متوافق مع الإجابات فوق.

---

## ملاحظات مهمة
1. الإجابات دي مبنية على إن AdMob هو الـ SDK الوحيد اللي بيجمع بيانات، ومفيش Firebase Analytics أو Crashlytics مُفعّل. لو ضفت أي SDK جديد بعدين (تحليلات، إشعارات بوش من سيرفر، إلخ) لازم تعدّل الإجابات دي قبل الرفع.
2. لازم إيميل تواصل حقيقي يكون متاح في Play Console نفسه (مش بس في الـ Privacy Policy) — هتحطه وانت بتعمل الـ Store listing.
3. اطبع أو احتفظ بالملف ده، ولما تفتح الحساب هتابع كل قسم وتلزق منه مباشرة.
