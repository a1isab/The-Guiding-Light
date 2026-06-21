import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type CourseData = {
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  level: "beginner" | "intermediate" | "advanced";
  slug: string;
  order_index: number;
  sections: {
    title: string;
    title_ar: string;
    slug: string;
    order_index: number;
    lessons: {
      title: string;
      title_ar: string;
      slug: string;
      content: string;
      arabic_text: string | null;
      video_url?: string;
      questions?: { question: string; options: string[]; correct: number }[];
      order_index: number;
    }[];
  }[];
};

const courses: CourseData[] = [
  // ─── 1. Aqeedah ──────────────────────────────────────────────────────
  {
    title: "Aqeedah",
    title_ar: "العقيدة",
    description:
      "Understand the core beliefs of Ahlus-Sunnah wal-Jama'ah. Study Tawheed, the pillars of faith, and the salvation theology of Islam.",
    description_ar:
      "افهم عقائد أهل السنة والجماعة. دراسة التوحيد وأركان الإيمان وعلم الكلام.",
    level: "beginner",
    slug: "aqeedah",
    order_index: 1,
    sections: [
      {
        title: "The Six Pillars of Faith",
        title_ar: "أركان الإيمان الستة",
        slug: "pillars-of-faith",
        order_index: 1,
        lessons: [
          {
            title: "Belief in Allah",
            title_ar: "الإيمان بالله",
            slug: "belief-in-allah",
            video_url: "https://www.youtube.com/embed/rmo4UblVEKg?si=h7fpO6Da34JNBggt&start=0&end=115",
            arabic_text: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ",
            content:
              "Belief in Allah is the first and most fundamental pillar of Iman. It encompasses belief in His existence, His Lordship (Rububiyyah), His exclusive right to worship (Uluhiyyah), and His beautiful Names and Attributes (Asma was-Sifat).\n\nAllah is Al-Khaliq (The Creator), Ar-Razzaq (The Provider), Al-Malik (The Sovereign), and Ar-Rahman (The Most Merciful). He is eternal, all-powerful, and knows all things.\n\nThe Quran says: 'Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding.' (3:190)",
            questions: [
              { question: "What is the first and most fundamental pillar of Iman?", options: ["Belief in Allah", "Belief in the Angels", "Belief in the Books", "Belief in the Prophets"], correct: 0 },
              { question: "Which category of Tawheed means singling out Allah for worship?", options: ["Tawhid ar-Rububiyyah", "Tawhid al-Uluhiyyah", "Tawhid al-Asma was-Sifat", "All of the above"], correct: 1 },
              { question: "What does Allah's name 'Ar-Razzaq' mean?", options: ["The Creator", "The Sovereign", "The Provider", "The Most Merciful"], correct: 2 },
              { question: "According to the lesson, where are signs for those of understanding found?", options: ["In books of philosophy", "In creation of heavens and earth", "In the stars only", "In dreams"], correct: 1 },
              { question: "Tawhid ar-Rububiyyah affirms Allah's oneness in what?", options: ["Worship only", "Lordship and creation", "Names and attributes", "Legislation"], correct: 1 },
            ],
            order_index: 1,
          },
          {
            title: "Belief in the Angels",
            title_ar: "الإيمان بالملائكة",
            slug: "belief-in-angels",
            video_url: "https://www.youtube.com/embed/rmo4UblVEKg?si=h7fpO6Da34JNBggt&start=116&end=148",
            arabic_text: "الْحَمْدُ لِلَّهِ فَاطِرِ السَّمَاوَاتِ وَالْأَرْضِ جَاعِلِ الْمَلَائِكَةِ رُسُلًا",
            content:
              "Angels (Mala'ikah) are created from light. They are honored servants of Allah who obey His commands without fail. They do not eat, drink, or disobey.\n\nKey angels include: Jibril (Gabriel) — brings revelation, Mika'il (Michael) — provides sustenance, Israfil — blows the Trumpet, Malak al-Mawt (Azrael) — takes souls, and the Kiraman Katibin — record deeds.\n\nBelief in angels means accepting their existence, their names, their functions, and that they constantly worship Allah.",
            questions: [
              { question: "What are angels created from?", options: ["Clay", "Fire", "Light", "Water"], correct: 2 },
              { question: "Which angel is responsible for bringing revelation?", options: ["Mika'il", "Jibril", "Israfil", "Malak al-Mawt"], correct: 1 },
              { question: "What is the role of the Kiraman Katibin?", options: ["They guard Paradise", "They record deeds", "They blow the Trumpet", "They take souls"], correct: 1 },
              { question: "Which angel will blow the Trumpet on the Day of Judgement?", options: ["Jibril", "Mika'il", "Israfil", "Azrael"], correct: 2 },
              { question: "What is true about angels according to the lesson?", options: ["They eat and drink", "They can disobey Allah", "They constantly worship Allah", "They are created from fire"], correct: 2 },
            ],
            order_index: 2,
          },
          {
            title: "Belief in the Divine Books",
            title_ar: "الإيمان بالكتب",
            slug: "belief-in-divine-books",
            video_url: "https://www.youtube.com/embed/rmo4UblVEKg?si=h7fpO6Da34JNBggt&start=149&end=186",
            arabic_text: "نَزَّلَ عَلَيْكَ الْكِتَابَ بِالْحَقِّ مُصَدِّقًا لِّمَا بَيْنَ يَدَيْهِ وَأَنزَلَ التَّوْرَاةَ وَالْإِنجِيلَ",
            content:
              "Muslims believe in all the scriptures revealed by Allah to His prophets. These include: the Suhuf (Scrolls) of Ibrahim, the Tawrah (Torah) given to Musa, the Zabur (Psalms) given to Dawud, the Injil (Gospel) given to Isa, and the Quran given to Muhammad (peace be upon them all).\n\nThe Quran is the final and most complete revelation, superseding all previous books. It is preserved in its original Arabic and contains guidance for all of humanity until the end of time.",
            questions: [
              { question: "Which scripture was given to Prophet Dawud (AS)?", options: ["Tawrah", "Zabur", "Injil", "Suhuf"], correct: 1 },
              { question: "What makes the Quran unique among all scriptures?", options: ["It was revealed in multiple languages", "It is preserved in its original Arabic", "It contains stories only", "It was revealed to multiple prophets"], correct: 1 },
              { question: "The Injil was given to which prophet?", options: ["Musa (AS)", "Dawud (AS)", "Isa (AS)", "Ibrahim (AS)"], correct: 2 },
              { question: "The Suhuf (Scrolls) are associated with which prophet?", options: ["Musa (AS)", "Dawud (AS)", "Isa (AS)", "Ibrahim (AS)"], correct: 3 },
              { question: "The Quran supersedes all previous books because it is:", options: ["The longest book", "The final and most complete revelation", "Only for Arabs", "Written in multiple languages"], correct: 1 },
            ],
            order_index: 3,
          },
          {
            title: "Belief in the Prophets",
            title_ar: "الإيمان بالأنبياء",
            slug: "belief-in-prophets",
            video_url: "https://www.youtube.com/embed/rmo4UblVEKg?si=h7fpO6Da34JNBggt&start=187&end=220",
            arabic_text: "إِنَّا أَوْحَيْنَا إِلَيْكَ كَمَا أَوْحَيْنَا إِلَىٰ نُوحٍ وَالنَّبِيِّينَ مِن بَعْدِهِ",
            content:
              "Belief in the Prophets means affirming that Allah sent messengers to every nation to guide humanity to the truth. They were the best of creation, chosen by Allah to deliver His message.\n\nWe believe in all of them: Adam, Nuh, Ibrahim, Musa, Isa, and Muhammad (peace be upon them all). Muhammad is the final prophet, and there is no prophet after him.\n\nThe prophets were protected from sin (isma) in conveying the message. They are models of character, patience, and devotion. To reject even one prophet is to reject them all.",
            questions: [
              { question: "Why did Allah send prophets to humanity?", options: ["To rule over people", "To guide humanity to the truth", "To perform miracles", "To write scriptures"], correct: 1 },
              { question: "Who is the final prophet sent by Allah?", options: ["Isa (AS)", "Musa (AS)", "Muhammad ﷺ", "Ibrahim (AS)"], correct: 2 },
              { question: "What does 'isma' refer to regarding prophets?", options: ["Their wealth", "Protection from sin in conveying the message", "Their physical strength", "Their long life"], correct: 1 },
              { question: "What happens if someone rejects even one prophet?", options: ["They can still accept others", "They reject them all", "They are forgiven automatically", "Only that prophet is rejected"], correct: 1 },
              { question: "Prophets were described in the lesson as:", options: ["The wealthiest people", "The best of creation", "The most powerful rulers", "The oldest among their people"], correct: 1 },
            ],
            order_index: 4,
          },
          {
            title: "Belief in the Day of Judgement",
            title_ar: "الإيمان باليوم الآخر",
            slug: "belief-in-day-of-judgement",
            video_url: "https://www.youtube.com/embed/rmo4UblVEKg?si=h7fpO6Da34JNBggt&start=220&end=266",
            arabic_text: "وَيَوْمَ نُسَيِّرُ الْجِبَالَ وَتَرَى الْأَرْضَ بَارِزَةً وَحَشَرْنَاهُمْ فَلَمْ نُغَادِرْ مِنْهُمْ أَحَدًا",
            content:
              "The Day of Judgement (Yawm al-Qiyamah) is the day when all of creation will be resurrected and held accountable for their deeds. Belief in this day includes belief in: the Resurrection, the Gathering, the Book of Deeds, the Scale (Mizan), the Bridge (Sirat), and the Final Destination of Paradise or Hellfire.\n\nEveryone will be judged with perfect justice. Those who believed and did righteous deeds will enter Paradise by Allah's mercy. Those who rejected the truth will face eternal punishment.\n\nThis belief instills taqwa (God-consciousness) and reminds us that this life is temporary — a test for the eternal life to come.",
            questions: [
              { question: "What is Yawm al-Qiyamah?", options: ["The night of power", "The Day of Judgement", "The day of Eid", "The day of forgiveness"], correct: 1 },
              { question: "Which of the following is part of belief in the Last Day?", options: ["Reincarnation", "The Scale (Mizan)", "Karma", "Astrology"], correct: 1 },
              { question: "What is the Mizan?", options: ["The book of deeds", "The scale on which deeds are weighed", "The bridge over Hell", "The pool of the Prophet"], correct: 1 },
              { question: "What does belief in the Day of Judgement instill in a believer?", options: ["Fear of death only", "Taqwa (God-consciousness)", "Desire for worldly wealth", "Carelessness"], correct: 1 },
              { question: "According to the lesson, this life is:", options: ["The final destination", "A test for the eternal life to come", "Unimportant", "The only life we have"], correct: 1 },
            ],
            order_index: 5,
          },
          {
            title: "Belief in Divine Decree (Qadr)",
            title_ar: "الإيمان بالقدر",
            slug: "belief-in-divine-decree",
            video_url: "https://www.youtube.com/embed/rmo4UblVEKg?si=h7fpO6Da34JNBggt&start=266",
            arabic_text: "إِنَّا كُلَّ شَيْءٍ خَلَقْنَاهُ بِقَدَرٍ",
            content:
              "Belief in Divine Decree (Qadr) means affirming that everything that happens — good or bad — occurs by the knowledge, will, and power of Allah. This includes four levels: Allah's complete knowledge of all things, His recording of all things in the Preserved Tablet (al-Lawh al-Mahfuz), His will that nothing occurs outside of it, and His creation of all actions and events.\n\nQadr is a profound source of peace. Whatever befalls you could not have missed you, and whatever misses you could not have befallen you. This frees the heart from anxiety and regret.\n\nAt the same time, Qadr does not negate human free will — we choose our actions and are accountable for them. The relationship between divine decree and human responsibility is a mystery that the believer accepts.",
            questions: [
              { question: "What does Qadr refer to?", options: ["Only good events", "Divine Decree — everything happens by Allah's will", "Human free will only", "Random chance"], correct: 1 },
              { question: "How many levels are there in belief in Qadr?", options: ["Two", "Three", "Four", "Five"], correct: 2 },
              { question: "Where are all things recorded according to Qadr?", options: ["In the Quran", "In the Preserved Tablet", "In the Torah", "In human hearts"], correct: 1 },
              { question: "According to the lesson, Qadr is a source of:", options: ["Anxiety", "Peace and freedom from regret", "Arrogance", "Laziness"], correct: 1 },
              { question: "Does belief in Qadr negate human responsibility?", options: ["Yes, humans have no choice", "No, we choose actions and are accountable", "Only for good deeds", "It depends on the situation"], correct: 1 },
            ],
            order_index: 6,
          },
        ],
      },
      {
        title: "Tawhid and Its Categories",
        title_ar: "التوحيد وأقسامه",
        slug: "tawhid-categories",
        order_index: 2,
        lessons: [
          {
            title: "Tawhid ar-Rububiyyah",
            title_ar: "توحيد الربوبية",
            slug: "tawhid-rububiyyah",
            arabic_text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
            content:
              "Tawhid ar-Rububiyyah is the oneness of Allah's Lordship. It means affirming that Allah alone is the Creator, Sustainer, Sovereign, and Controller of all affairs. He alone gives life and causes death, sends down rain, and governs the universe.\n\nEven the polytheists of Quraysh acknowledged this type of Tawheed. They believed Allah created the heavens and the earth, yet they still worshipped others alongside Him.\n\nThis category establishes that all power and authority belong to Allah alone.",
            order_index: 1,
          },
          {
            title: "Tawhid al-Uluhiyyah",
            title_ar: "توحيد الألوهية",
            slug: "tawhid-uluhiyyah",
            arabic_text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
            content:
              "Tawhid al-Uluhiyyah is the oneness of Allah's worship. It means singling out Allah alone for all acts of worship — prayer, fasting, supplication, trust, fear, hope, love, and sacrifice.\n\nThis is the essence of the Shahada: 'La ilaha illa Allah' — there is no god worthy of worship except Allah. It was the primary message of all prophets.\n\nAny act of worship directed to other than Allah is major shirk, which Allah does not forgive unless one repents.",
            order_index: 2,
          },
          {
            title: "Tawhid al-Asma was-Sifat",
            title_ar: "توحيد الأسماء والصفات",
            slug: "tawhid-asma-was-sifat",
            arabic_text: "لَيْسَ كَمِثْلِهِ شَيْءٌ ۖ وَهُوَ السَّمِيعُ الْبَصِيرُ",
            content:
              "Tawhid al-Asma was-Sifat is the oneness of Allah's Names and Attributes. It means affirming for Allah the names and attributes that He has affirmed for Himself in the Quran and through His Messenger, without distortion (tahrif), denial (ta'til), inquiring into how (takyeef), or likening to creation (tamthil).\n\nAllah is As-Sami' (All-Hearing), Al-Basir (All-Seeing), Al-Qadir (All-Powerful), Ar-Rahman (Most Merciful). His attributes are perfect and unique to Him.\n\nThe principle is: 'There is nothing like unto Him, and He is the All-Hearing, All-Seeing.' (42:11)",
            order_index: 3,
          },
        ],
      },
      {
        title: "The Saved Sect",
        title_ar: "الفرقة الناجية",
        slug: "saved-sect",
        order_index: 3,
        lessons: [
          {
            title: "Ahlus-Sunnah wal-Jama'ah",
            title_ar: "أهل السنة والجماعة",
            slug: "ahlus-sunnah",
            arabic_text: "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا",
            content:
              "Ahlus-Sunnah wal-Jama'ah (the People of the Sunnah and the Community) are those who follow the Quran and authentic Sunnah according to the understanding of the companions (Sahabah). They are the majority of Muslims and represent the orthodox tradition.\n\nKey principles include: following the Quran and Sunnah, loving the companions, avoiding innovation (bid'ah), and maintaining unity.\n\nThe Prophet (peace be upon him) said: 'My Ummah will split into 73 sects, all in the Fire except one.' They asked: 'Who is that, O Messenger of Allah?' He said: 'Those who follow what I and my companions are upon.'",
            order_index: 1,
          },
          {
            title: "Warning Against Innovation (Bid'ah)",
            title_ar: "التحذير من البدعة",
            slug: "warning-against-bidah",
            arabic_text: "وَأَنَّ هَٰذَا صِرَاطِي مُسْتَقِيمًا فَاتَّبِعُوهُ ۖ وَلَا تَتَّبِعُوا السُّبُلَ فَتَفَرَّقَ بِكُمْ عَن سَبِيلِهِ",
            content:
              "Bid'ah (religious innovation) refers to introducing new practices into the religion that are not part of the Quran and Sunnah. The Prophet said: 'Every innovation is misguidance, and every misguidance is in the Fire.'\n\nInnovations can range from minor practices to major doctrinal deviations. The safeguard against bid'ah is to ground all worship and belief in authentic evidence from the revealed sources.\n\nGood intentions do not justify innovations. The religion was perfected during the Prophet's lifetime, as Allah says: 'This day I have perfected for you your religion.' (5:3)",
            order_index: 2,
          },
        ],
      },
    ],
  },

  // ─── 2. Fiqh ─────────────────────────────────────────────────────────
  {
    title: "Fiqh",
    title_ar: "الفقه",
    description:
      "Study Islamic jurisprudence: rulings on worship, transactions, marriage, and daily life according to the Quran and Sunnah.",
    description_ar:
      "دراسة الفقه الإسلامي: أحكام العبادات والمعاملات والنكاح والحياة اليومية وفق الكتاب والسنة.",
    level: "intermediate",
    slug: "fiqh",
    order_index: 2,
    sections: [
      {
        title: "Tahara (Purification)",
        title_ar: "الطهارة",
        slug: "tahara",
        order_index: 1,
        lessons: [
          {
            title: "Wudu (Ablution)",
            title_ar: "الوضوء",
            slug: "wudu",
            arabic_text: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ",
            content:
              "Wudu is the ritual washing performed before prayer. Its obligatory (fard) acts are: washing the face, washing the arms to the elbows, wiping the head, and washing the feet to the ankles — in order.\n\nSunnah acts include: rinsing the mouth, sniffing water into the nose, wiping the ears, and saying the basmalah before starting.\n\nWudu is invalidated by: natural discharge, deep sleep, loss of consciousness, and touching the private parts directly. The Prophet said: 'The key to Paradise is prayer, and the key to prayer is purification.'",
            order_index: 1,
          },
          {
            title: "Ghusl (Full Bath)",
            title_ar: "الغسل",
            slug: "ghusl",
            arabic_text: "وَإِن كُنتُمْ جُنُبًا فَاطَّهَّرُوا",
            content:
              "Ghusl (full body wash) becomes obligatory after: sexual intercourse, ejaculation (wet dream or otherwise), and the end of menstruation and post-childbirth bleeding.\n\nThe obligatory acts of ghusl are: rinsing the mouth, sniffing water into the nose, and washing the entire body with water.\n\nRecommended acts include: washing the private parts, performing wudu-like washing before the full bath, and pouring water over the head three times. Ghusl on Friday is a confirmed Sunnah for attending the congregational prayer.",
            order_index: 2,
          },
          {
            title: "Tayammum (Dry Ablution)",
            title_ar: "التيمم",
            slug: "tayammum",
            arabic_text: "فَلَمْ تَجِدُوا مَاءً فَتَيَمَّمُوا صَعِيدًا طَيِّبًا",
            content:
              "Tayammum is a substitute for wudu or ghusl when water is unavailable or its use would cause harm. It is performed by striking clean earth and wiping the face and hands.\n\nConditions for tayammum include: absence of water, illness that would worsen with water, or being on a journey with insufficient water.\n\nTayammum is nullified by the same things that nullify wudu, AND by the presence of water (if performing tayammum for lack of water). Allah says: 'And He has not placed upon you any hardship in the religion.' (22:78)",
            order_index: 3,
          },
        ],
      },
      {
        title: "Salah (Prayer)",
        title_ar: "الصلاة",
        slug: "salah",
        order_index: 2,
        lessons: [
          {
            title: "The Five Daily Prayers",
            title_ar: "الصلوات الخمس",
            slug: "five-daily-prayers",
            arabic_text: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
            content:
              "The five daily prayers are Fajr (2 rak'ahs), Dhuhr (4), Asr (4), Maghrib (3), and Isha (4). They are an obligation upon every adult Muslim of sound mind.\n\nPrayer times are determined by the sun's position: Fajr from dawn to sunrise, Dhuhr when the sun passes its zenith, Asr when shadows equal object length, Maghrib at sunset, Isha when twilight disappears.\n\nPrayer is the second pillar of Islam and the first deed for which a person will be held accountable on the Day of Judgment. The Prophet said: 'The covenant between us and them is prayer; whoever abandons it has disbelieved.'",
            order_index: 1,
          },
          {
            title: "Conditions and Pillars of Prayer",
            title_ar: "شروط الصلاة وأركانها",
            slug: "conditions-pillars-prayer",
            arabic_text: "وَقُومُوا لِلَّهِ قَانِتِينَ",
            content:
              "The conditions for prayer (shurut) include: being Muslim, of sound mind, having reached puberty, being in a state of purity, covering the awrah, facing the qiblah, and that the time for prayer has entered.\n\nThe pillars of prayer (arkaan) include: standing (if able), the opening takbeer, reciting Surah al-Fatihah, bowing (ruku), rising from ruku, prostrating (sujood), rising from sujood, the final tashahhud, and the tasleem.\n\nIntentionally omitting any pillar invalidates the prayer. Forgetting a pillar requires repeating that part and performing sujood as-sahw (prostration of forgetfulness).",
            order_index: 2,
          },
          {
            title: "Jumu'ah (Friday Prayer)",
            title_ar: "صلاة الجمعة",
            slug: "jumuah-prayer",
            arabic_text: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ",
            content:
              "Jumu'ah (Friday prayer) is an obligatory congregational prayer that replaces Dhuhr for men. It consists of a khutbah (sermon) delivered by the imam followed by two rak'ahs of prayer.\n\nAttending Jumu'ah is obligatory upon every free, adult, resident male Muslim. Women may attend if they wish but are not obligated.\n\nThe khutbah has two parts with a brief sitting between them. The imam advises the congregation, reminds them of Allah, and may address current affairs. It is recommended to arrive early, listen attentively, and send blessings upon the Prophet on Friday.",
            order_index: 3,
          },
        ],
      },
      {
        title: "Zakat and Charity",
        title_ar: "الزكاة والصدقة",
        slug: "zakat-charity",
        order_index: 3,
        lessons: [
          {
            title: "The Obligation of Zakat",
            title_ar: "فريضة الزكاة",
            slug: "obligation-of-zakat",
            arabic_text: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ",
            content:
              "Zakat is the third pillar of Islam. It is an obligatory charity on wealth that has reached the nisab (minimum threshold) and been held for one lunar year. The standard rate is 2.5% of savings and wealth.\n\nZakat purifies wealth and helps those in need. It is to be given to eight categories specified in the Quran (9:60): the poor, the needy, zakat collectors, those whose hearts are to be reconciled, slaves, debtors, in the path of Allah, and the stranded traveler.\n\nZakat is not a tax or voluntary charity — it is a right of Allah upon the wealth of the wealthy.",
            order_index: 1,
          },
          {
            title: "Sadaqah (Voluntary Charity)",
            title_ar: "الصدقة التطوعية",
            slug: "sadaqah-voluntary-charity",
            arabic_text: "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ",
            content:
              "Sadaqah is any act of giving done to seek Allah's pleasure. It is not limited to money — even a smile is sadaqah. The Prophet said: 'Every good deed is sadaqah.'\n\nSadaqah can be: feeding the hungry, visiting the sick, removing harm from the road, teaching knowledge, or giving a helping hand. Ongoing charity (sadaqah jariyah) includes building a mosque, digging a well, or raising a righteous child.\n\nThe best sadaqah is that given while healthy and hoping to live, fearing poverty but hoping for reward. It extinguishes sins as water extinguishes fire.",
            order_index: 2,
          },
        ],
      },
    ],
  },

  // ─── 3. Tafsir ───────────────────────────────────────────────────────
  {
    title: "Tafsir",
    title_ar: "التفسير",
    description:
      "A comprehensive study of Quranic exegesis. Learn the meanings, context, and lessons from the Book of Allah.",
    description_ar:
      "دراسة شاملة لتفسير القرآن الكريم. تعلم معاني وآيات القرآن وسياقه ودروسه.",
    level: "intermediate",
    slug: "tafsir",
    order_index: 3,
    sections: [
      {
        title: "Introduction to Tafsir",
        title_ar: "مقدمة في التفسير",
        slug: "intro-to-tafsir",
        order_index: 1,
        lessons: [
          {
            title: "The Science of Tafsir",
            title_ar: "علم التفسير",
            slug: "science-of-tafsir",
            arabic_text: "كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ",
            content:
              "Tafsir is the science of explaining and interpreting the Quran. It involves understanding the Arabic language, the context of revelation (asbab an-nuzul), the abrogating and abrogated verses (nasikh wa mansukh), and the explanations of the Prophet and his companions.\n\nThe best tafsir is: (1) the Quran explaining itself, (2) the Sunnah explaining the Quran, (3) the statements of the Sahabah, (4) the statements of the Tabi'in, and (5) linguistic analysis.\n\nMajor works of tafsir include Tafsir Ibn Kathir, Tafsir al-Tabari, Tafsir al-Qurtubi, and Tafsir al-Sa'di. Each scholar approached tafsir with their unique methodology while adhering to authentic principles.",
            order_index: 1,
          },
          {
            title: "Meccan and Medinan Revelations",
            title_ar: "المكي والمدني",
            slug: "meccan-medinan-revelations",
            arabic_text: "الر ۚ كِتَابٌ أُحْكِمَتْ آيَاتُهُ ثُمَّ فُصِّلَتْ مِن لَّدُنْ حَكِيمٍ خَبِيرٍ",
            content:
              "The Quran was revealed over 23 years: approximately 13 years in Makkah and 10 years in Madinah. Meccan surahs focus on Tawheed, the Hereafter, and moral reform. Medinan surahs contain legislation, social laws, and guidance for the Muslim community.\n\nMeccan surahs are typically shorter, more rhythmic, and address the soul directly. Medinan surahs are longer, contain detailed rulings, and address the believers collectively.\n\nKnowing whether a verse is Meccan or Medinan helps in understanding its context and application. Most scholars determine this based on the time of revelation rather than location.",
            order_index: 2,
          },
        ],
      },
      {
        title: "Tafsir of Selected Surahs",
        title_ar: "تفسير سور مختارة",
        slug: "selected-surahs",
        order_index: 2,
        lessons: [
          {
            title: "Surah al-Fatihah",
            title_ar: "سورة الفاتحة",
            slug: "surah-al-fatihah",
            arabic_text:
              "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
            content:
              "Surah al-Fatihah (The Opening) is the greatest surah of the Quran. It consists of 7 verses and is recited in every unit of prayer. It is a comprehensive prayer that summarizes the relationship between the servant and Allah.\n\nIt begins with praise (hamd), establishes Allah's sovereignty, and then the servant makes the ultimate request: 'Guide us to the straight path.'\n\nThe straight path is that of the prophets, the truthful, the martyrs, and the righteous — not the path of those who incurred wrath (such as those who knew the truth and rejected it) nor of those who went astray (such as those who worshiped without knowledge).",
            order_index: 1,
          },
          {
            title: "Surah al-Ikhlas",
            title_ar: "سورة الإخلاص",
            slug: "surah-al-ikhlas",
            arabic_text:
              "قُلْ هُوَ اللَّهُ أَحَدٌ\nاللَّهُ الصَّمَدُ\nلَمْ يَلِدْ وَلَمْ يُولَدْ\nوَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
            content:
              "Surah al-Ikhlas (Sincerity) is equivalent to one-third of the Quran. It is a concise yet complete statement of Tawheed. The surah affirms Allah's absolute oneness (Ahad), His self-sufficiency (Samad), and negates any notion of offspring or parentage for Him.\n\n'Al-Ahad' means the One, the Unique — there is no partner or equal. 'As-Samad' means the Eternal, the Self-Sufficient Master whom all creation depends upon, yet He depends on none.\n\nThe surah refutes all false concepts about Allah — whether from polytheists, atheists, or those who attribute physical offspring to Him. The Prophet said that reciting this surah earns the reward of reciting one-third of the Quran.",
            order_index: 2,
          },
        ],
      },
    ],
  },

  // ─── 4. Hadith ───────────────────────────────────────────────────────
  {
    title: "Hadith",
    title_ar: "الحديث",
    description:
      "Study the prophetic traditions: their collection, authentication, and the timeless wisdom contained within them.",
    description_ar:
      "دراسة الأحاديث النبوية: جمعها وتصحيحها والحكمة الخالدة التي تحتويها.",
    level: "intermediate",
    slug: "hadith",
    order_index: 4,
    sections: [
      {
        title: "Introduction to Hadith Sciences",
        title_ar: "مقدمة في علوم الحديث",
        slug: "intro-hadith-sciences",
        order_index: 1,
        lessons: [
          {
            title: "The Classification of Hadith",
            title_ar: "تصنيف الحديث",
            slug: "classification-of-hadith",
            arabic_text: "وَمَا يَنطِقُ عَنِ الْهَوَىٰ إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ",
            content:
              "Hadith are classified based on authenticity: Sahih (authentic), Hasan (good), Da'if (weak), and Mawdu' (fabricated). Sahih hadith have a continuous chain of reliable narrators with no defects. Hasan hadith are slightly less in precision but still acceptable.\n\nClassification is also based on the chain: Mutawatir (mass-transmitted, certainty-level knowledge) and Ahad (single-chain, which includes Mashhur, Aziz, and Gharib).\n\nThe science of hadith (mustalah al-hadith) developed to protect the Sunnah from fabrication and error. Great scholars like al-Bukhari, Muslim, Abu Dawud, at-Tirmidhi, an-Nasa'i, and Ibn Majah compiled the most authoritative collections.",
            order_index: 1,
          },
          {
            title: "The Six Authentic Books",
            title_ar: "الصحاح الستة",
            slug: "six-authentic-books",
            arabic_text: "يَا أَيُّهَا الَّذِينَ آمَنُوا أَطِيعُوا اللَّهَ وَأَطِيعُوا الرَّسُولَ",
            content:
              "The six authoritative hadith collections (Kutub as-Sittah) are: Sahih al-Bukhari, Sahih Muslim, Sunan Abu Dawud, Jami' at-Tirmidhi, Sunan an-Nasa'i, and Sunan Ibn Majah.\n\nSahih al-Bukhari is considered the most authentic book after the Quran. Imam al-Bukhari spent 16 years collecting over 600,000 hadith and selected only about 7,275 (with repetition) as authentic.\n\nImam Muslim's collection is the second most authentic. The remaining four collections contain many authentic hadith alongside some hasan and da'if narrations, which scholars have identified and documented.",
            order_index: 2,
          },
        ],
      },
      {
        title: "Selected Hadith on Character",
        title_ar: "أحاديث مختارة في الأخلاق",
        slug: "hadith-on-character",
        order_index: 2,
        lessons: [
          {
            title: "Intentions and Actions",
            title_ar: "النية والعمل",
            slug: "intentions-and-actions",
            arabic_text: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
            content:
              "The hadith 'Actions are but by intentions' (innama al-a'malu bi-n-niyyat) is one of the most important hadith in Islam. It was narrated by Umar ibn al-Khattab and recorded by al-Bukhari and Muslim.\n\nThis hadith establishes that the validity and reward of any action depend on its intention. A deed done for Allah alone is accepted; a deed done for show or worldly gain has no reward in the Hereafter.\n\nScholars say this hadith is one-third of Islamic knowledge, alongside the hadith of Jibril (about faith, Islam, and ihsan) and the hadith 'Leave what makes you doubt for what does not make you doubt.'",
            order_index: 1,
          },
          {
            title: "Mercy and Compassion",
            title_ar: "الرحمة",
            slug: "mercy-and-compassion",
            arabic_text: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ",
            content:
              "The Prophet (peace be upon him) was sent as a mercy to all worlds. He said: 'The merciful are shown mercy by Ar-Rahman. Be merciful to those on earth, and the One in the heavens will be merciful to you.' (Abu Dawud, Tirmidhi)\n\nHe also said: 'He who does not show mercy to others will not be shown mercy.' (Bukhari, Muslim). This includes mercy towards people, animals, and even enemies in times of war.\n\nA companion asked: 'O Messenger of Allah, do we get reward for showing kindness to animals?' He replied: 'There is reward for showing kindness to every living creature.' (Bukhari, Muslim)",
            order_index: 2,
          },
          {
            title: "The Hadith of Jibril",
            title_ar: "حديث جبريل",
            slug: "hadith-of-jibril",
            arabic_text: "فَإِنَّهُ جِبْرِيلُ أَتَاكُمْ يُعَلِّمُكُمْ دِينَكُمْ",
            content:
              "The Hadith of Jibril (Gabriel) is a core hadith that defines Islam, Iman, and Ihsan. It is narrated by Umar ibn al-Khattab and recorded in Sahih Muslim.\n\nWhen asked about Islam, the Prophet replied: The five pillars — Shahada, Salah, Zakat, Sawm, and Hajj.\n\nWhen asked about Iman (faith), he replied: Belief in Allah, His angels, His books, His messengers, the Last Day, and divine decree.\n\nWhen asked about Ihsan (excellence), he replied: 'To worship Allah as if you see Him, for though you do not see Him, He indeed sees you.'\n\nThis hadith is considered the mother of Sunnah teachings, encompassing the entire religion in one conversation.",
            order_index: 3,
          },
        ],
      },
    ],
  },

  // ─── 5. Seerah ───────────────────────────────────────────────────────
  {
    title: "Seerah",
    title_ar: "السيرة النبوية",
    description:
      "Follow the life of the Prophet Muhammad (peace be upon him) from birth to prophethood, migration, and the establishment of the Islamic state.",
    description_ar:
      "اتبع حياة النبي محمد صلى الله عليه وسلم من الولادة إلى البعثة والهجرة وإقامة الدولة الإسلامية.",
    level: "beginner",
    slug: "seerah",
    order_index: 5,
    sections: [
      {
        title: "Before Prophethood",
        title_ar: "قبل البعثة",
        slug: "before-prophethood",
        order_index: 1,
        lessons: [
          {
            title: "The Birth and Early Life of the Prophet",
            title_ar: "ميلاد النبي ونشأته",
            slug: "birth-early-life",
            arabic_text: "لَقَدْ جَاءَكُمْ رَسُولٌ مِّنْ أَنفُسِكُمْ",
            content:
              "Muhammad ibn Abdullah (peace be upon him) was born in Makkah in the Year of the Elephant (approximately 570 CE). His father Abdullah died before his birth. His mother Aminah died when he was six. He was then raised by his grandfather Abdul-Muttalib and later by his uncle Abu Talib.\n\nAs a young man, he was known as 'Al-Amin' (the Trustworthy) and 'As-Sadiq' (the Truthful). He worked as a shepherd and later as a merchant. He never participated in the idolatrous practices of the Quraysh.\n\nHe married Khadijah bint Khuwaylid at age 25, a noble and wealthy businesswoman who proposed to him due to his honesty. She was his greatest supporter and the first to believe in his message.",
            order_index: 1,
          },
          {
            title: "The First Revelation",
            title_ar: "الوحي الأول",
            slug: "first-revelation",
            arabic_text: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
            content:
              "At age 40, while meditating in the cave of Hira on the mountain known as Jabal an-Nur, Prophet Muhammad received the first revelation through Angel Jibril (Gabriel). The first five verses of Surah al-Alaq were revealed: 'Read! In the name of your Lord who created.'\n\nOverwhelmed by the experience, he rushed home to Khadijah saying 'Cover me, cover me!' Khadijah comforted him and took him to her cousin Waraqah ibn Nawfal, a Christian scholar who confirmed that this was the same revelation given to Musa (Moses).\n\nAfter a pause in revelation (fatra), the revelation resumed strongly and continued for 23 years until the completion of the Quran.",
            order_index: 2,
          },
        ],
      },
      {
        title: "The Makkan Period",
        title_ar: "العصر المكي",
        slug: "makkan-period",
        order_index: 2,
        lessons: [
          {
            title: "The Secret and Open Call",
            title_ar: "الدعوة سرًا وجهرًا",
            slug: "secret-open-call",
            arabic_text: "فَاصْدَعْ بِمَا تُؤْمَرُ وَأَعْرِضْ عَنِ الْمُشْرِكِينَ",
            content:
              "The Prophet first called people to Islam secretly for three years. Those who responded included Khadijah, Abu Bakr, Ali, Zayd ibn Harithah, and Bilal. They met in secret to learn and worship.\n\nAfter the revelation of 'So declare what you are commanded' (15:94), the Prophet called the Quraysh openly, standing on Mount Safa and warning them of Allah's punishment. The Quraysh opposed him fiercely, especially upon hearing the call to abandon their idols.\n\nThe persecution intensified: Bilal was tortured under the desert sun, Sumayyah and Yasir were martyred, and the Muslims endured the boycott of Banu Hashim in the valley of Abu Talib for three years.",
            order_index: 1,
          },
          {
            title: "The Year of Grief and the Isra wal-Mi'raj",
            title_ar: "عام الحزن والإسراء والمعراج",
            slug: "year-of-grief-isra-miraj",
            arabic_text: "سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا",
            content:
              "The Year of Grief (610 CE) saw the death of two of the Prophet's greatest supporters: his wife Khadijah and his uncle Abu Talib. With their loss, the persecution from the Quraysh intensified.\n\nIn this difficult time, Allah honored the Prophet with the Isra wal-Mi'raj (the Night Journey and Ascension). He was transported from Makkah to Jerusalem and then ascended through the heavens, where he met previous prophets and received the obligation of five daily prayers.\n\nThis journey reaffirmed the Prophet's status and strengthened his resolve. It is a miracle that occurred in body and soul, witnessed by Allah's power alone.",
            order_index: 2,
          },
        ],
      },
      {
        title: "The Madinan Period",
        title_ar: "العصر المدني",
        slug: "madinan-period",
        order_index: 3,
        lessons: [
          {
            title: "The Hijrah (Migration)",
            title_ar: "الهجرة",
            slug: "the-hijrah",
            arabic_text: "إِلَّا تَنصُرُوهُ فَقَدْ نَصَرَهُ اللَّهُ إِذْ أَخْرَجَهُ الَّذِينَ كَفَرُوا ثَانِيَ اثْنَيْنِ",
            content:
              "The Hijrah (migration) to Madinah marks the beginning of the Islamic calendar. After repeated assassination attempts by the Quraysh, the Prophet and Abu Bakr migrated to Yathrib (later named Madinah), where a Muslim community had already formed.\n\nThey hid in the Cave of Thawr for three days. Abu Bakr was afraid, but the Prophet said: 'Do not grieve; indeed Allah is with us.' (9:40). Allah sent a spider to weave a web at the cave entrance and a pigeon to nest, convincing the pursuers no one was inside.\n\nIn Madinah, the Prophet established the first Islamic state, built the Prophet's Mosque, and united the Muhajirun (emigrants) with the Ansar (helpers) through brotherhood bonds.",
            order_index: 1,
          },
          {
            title: "Key Battles and Treaties",
            title_ar: "الغزوات والصلح",
            slug: "key-battles-treaties",
            arabic_text: "وَلِلَّهِ الْعِزَّةُ وَلِرَسُولِهِ وَلِلْمُؤْمِنِينَ",
            content:
              "Major events in Madinah include: Badr (the first major battle, where 313 Muslims defeated 1000 polytheists), Uhud (where Muslims suffered losses for disobeying the Prophet's orders), the Trench (Khandaq, where Salman al-Farsi suggested digging a defensive trench), and the Treaty of Hudaybiyyah (a 10-year peace treaty that was a turning point for Islam).\n\nThe conquest of Makkah in 8 AH was a peaceful victory. The Prophet entered the Kaaba and destroyed the idols, declaring: 'Truth has come, and falsehood has vanished.' (17:81).\n\nBy the time of his death at age 63, the entire Arabian Peninsula had accepted Islam. His farewell sermon at Arafat remains a timeless declaration of human rights and Islamic values.",
            order_index: 2,
          },
        ],
      },
    ],
  },

  // ─── 6. Arabic Language ──────────────────────────────────────────────
  {
    title: "Arabic Language",
    title_ar: "اللغة العربية",
    description:
      "Study Arabic grammar (Nahw), morphology (Sarf), and rhetoric (Balaghah) to better understand the Quran and Islamic texts.",
    description_ar:
      "دراسة النحو والصرف والبلاغة العربية لفهم القرآن والنصوص الإسلامية بشكل أفضل.",
    level: "intermediate",
    slug: "arabic-language",
    order_index: 6,
    sections: [
      {
        title: "Nahw (Grammar) Foundations",
        title_ar: "أسس النحو",
        slug: "nahw-foundations",
        order_index: 1,
        lessons: [
          {
            title: "Parts of Speech in Arabic",
            title_ar: "أقسام الكلام",
            slug: "parts-of-speech",
            arabic_text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
            content:
              "Arabic has three parts of speech: Ism (noun), Fi'l (verb), and Harf (particle). An ism denotes a person, place, thing, or concept. A fi'l indicates an action in past, present, or command form. A harf provides meaning only when attached to other words.\n\nNouns in Arabic have gender (masculine/feminine), number (singular/dual/plural), and case (nominative/accusative/genitive). Verbs conjugate according to person, gender, and number.\n\nUnderstanding these categories is the foundation of Arabic grammar. The science of Nahw was systematized by Abu al-Aswad ad-Du'ali and later refined by Sibawayh, whose book 'Al-Kitab' remains the foundational text of Arabic grammar.",
            order_index: 1,
          },
          {
            title: "The Nominal Sentence (Jumla Ismiyya)",
            title_ar: "الجملة الاسمية",
            slug: "nominal-sentence",
            arabic_text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
            content:
              "A nominal sentence begins with a noun and consists of two parts: Mubtada (subject, in nominative case) and Khabar (predicate, in nominative case). The mubtada is the topic, and the khabar provides information about it.\n\nExample: 'Allahu Ghafurun Rahim' — Allah (subject) is Oft-Forgiving, Most Merciful (predicate).\n\nUnlike English, the nominal sentence does not require a linking verb ('is', 'are'). The khabar can be a single word, a phrase, or even a full sentence. The mubtada and khabar must agree in gender and number.",
            order_index: 2,
          },
          {
            title: "The Verbal Sentence (Jumla Fi'liyya)",
            title_ar: "الجملة الفعلية",
            slug: "verbal-sentence",
            arabic_text: "يَقُولُ اللَّهُ تَعَالَىٰ",
            content:
              "A verbal sentence begins with a verb and consists of Fi'l (verb), Fa'il (subject), and optionally Maf'ul bihi (object). The default order in Arabic is Verb-Subject-Object (VSO).\n\nExample: 'Darasa at-talibu ad-darsa' — The student studied the lesson (literally: studied the student the lesson).\n\nWhen the subject is explicitly mentioned after the verb, the verb remains singular masculine even if the subject is plural or feminine (except in certain cases). The verbal sentence is more common in Arabic than the nominal sentence and carries nuances of action and renewal.",
            order_index: 3,
          },
        ],
      },
      {
        title: "Sarf (Morphology)",
        title_ar: "علم الصرف",
        slug: "sarf-morphology",
        order_index: 2,
        lessons: [
          {
            title: "The Arabic Root System",
            title_ar: "النظام الجذري",
            slug: "root-system",
            arabic_text: "وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا",
            content:
              "Most Arabic words derive from a three-letter root (usually, sometimes four). For example, the root K-T-B (كت ب) gives: Kataba (he wrote), Maktab (office), Kitab (book), Katib (writer), Maktubah (written), and so on.\n\nThere are approximately 10 common verb patterns (awzan). Each pattern adds a specific nuance: Form II (fa''ala) intensifies, Form III (fa'ala) indicates participation, Form X (istaf'ala) means to consider or seek.\n\nUnderstanding the root system allows you to guess the meaning of unfamiliar words from context. About 80-90% of Arabic vocabulary is based on the triliteral root system.",
            order_index: 1,
          },
          {
            title: "Verb Conjugation Overview",
            title_ar: "تصريف الأفعال",
            slug: "verb-conjugation",
            arabic_text: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ",
            content:
              "Arabic verbs conjugate for person (1st, 2nd, 3rd), gender (male/female), and number (singular/dual/plural). The past tense (madhi) is formed by adding suffixes to the root, while the present tense (mudari') adds prefixes and suffixes.\n\nExample of Kataba (to write): Katabtu (I wrote), Katabta (you masc. wrote), Katabti (you fem. wrote), Kataba (he wrote), Katabat (she wrote), Katabna (we wrote).\n\nThere are also imperative (amr), passive (majhul), and energetic (ta'kid) forms. Mastering verb tables (tasrif) is essential for fluency in Quranic and classical Arabic.",
            order_index: 2,
          },
        ],
      },
    ],
  },

  // ─── 7. Islamic History ──────────────────────────────────────────────
  {
    title: "Islamic History",
    title_ar: "التاريخ الإسلامي",
    description:
      "Explore the rich history of Islamic civilization: the Rightly Guided Caliphs, the Golden Age, and the spread of Islam across the world.",
    description_ar:
      "استكشف التاريخ الغني للحضارة الإسلامية: الخلفاء الراشدون والعصر الذهبي وانتشار الإسلام في العالم.",
    level: "intermediate",
    slug: "islamic-history",
    order_index: 7,
    sections: [
      {
        title: "The Rightly Guided Caliphs",
        title_ar: "الخلفاء الراشدون",
        slug: "rightly-guided-caliphs",
        order_index: 1,
        lessons: [
          {
            title: "Abu Bakr as-Siddiq (RA)",
            title_ar: "أبو بكر الصديق رضي الله عنه",
            slug: "abu-bakr-as-siddiq",
            arabic_text: "ثَانِيَ اثْنَيْنِ إِذْ هُمَا فِي الْغَارِ",
            content:
              "Abu Bakr (RA) was the first Caliph after the Prophet's death. He is known as 'As-Siddiq' (the Truthful) because he immediately affirmed the Prophet's night journey when others doubted. He was the Prophet's closest companion and father of Aisha (RA).\n\nHis caliphate (632-634 CE) faced the Ridda Wars (apostasy wars) as some tribes refused to pay zakat. He led decisively: 'By Allah, if they withhold even a rope they used to give to the Messenger, I will fight them for it.'\n\nHe also initiated the compilation of the Quran after the Battle of Yamamah, where many memorizers were killed. He served as Caliph for only 2 years but established critical precedents for the Muslim state.",
            order_index: 1,
          },
          {
            title: "Umar ibn al-Khattab (RA)",
            title_ar: "عمر بن الخطاب رضي الله عنه",
            slug: "umar-ibn-al-khattab",
            arabic_text: "اللَّهُمَّ أَعِزَّ الْإِسْلَامَ بِعُمَرَ",
            content:
              "Umar ibn al-Khattab (RA) was the second Caliph (634-644 CE). His conversion to Islam was a turning point — the Prophet prayed: 'O Allah, strengthen Islam with Umar.' After his conversion, Muslims prayed openly at the Kaaba for the first time.\n\nHis caliphate saw the expansion of Islam to Persia, Syria, Egypt, and North Africa. He established the Islamic calendar (Hijri), a public treasury (Bayt al-Mal), a judicial system, and provincial governance.\n\nKnown for his justice, humility, and direct oversight of governors, Umar would walk the streets at night checking on his people. He was martyred by a Persian slave while leading Fajr prayer.",
            order_index: 2,
          },
          {
            title: "Uthman and Ali (RA)",
            title_ar: "عثمان وعلي رضي الله عنهما",
            slug: "uthman-and-ali",
            arabic_text: "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا",
            content:
              "Uthman ibn Affan (RA), the third Caliph (644-656 CE), standardized the Quranic script and compiled the official Mushaf (Uthmanic codex). He was known for his modesty and generosity. His caliphate saw continued expansion but also the beginnings of fitnah (civil strife).\n\nAli ibn Abi Talib (RA), the fourth Caliph (656-661 CE), was the Prophet's cousin and son-in-law. He was raised by the Prophet and was among the first to accept Islam. His caliphate was marked by internal conflicts including the Battle of the Camel and the Battle of Siffin.\n\nThe period of the rightly guided caliphs lasted 30 years, as the Prophet foretold. Their governance was based on the Quran and Sunnah, with consultation (shura) as a key principle.",
            order_index: 3,
          },
        ],
      },
      {
        title: "The Golden Age",
        title_ar: "العصر الذهبي",
        slug: "golden-age",
        order_index: 2,
        lessons: [
          {
            title: "The Islamic Golden Age",
            title_ar: "العصر الذهبي للحضارة الإسلامية",
            slug: "islamic-golden-age",
            arabic_text: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
            content:
              "The Islamic Golden Age (roughly 8th-13th centuries) was a period of remarkable scientific, cultural, and intellectual achievement. Centered in Baghdad under the Abbasid Caliphate, scholars from diverse backgrounds translated and expanded upon Greek, Persian, and Indian knowledge.\n\nKey figures include: Al-Khwarizmi (father of algebra), Ibn Sina/Avicenna (medicine and philosophy), Al-Farabi (logic), Ibn Rushd/Averroes (philosophy), Ibn al-Haytham (optics), and Al-Idrisi (geography).\n\nInstitutions like the House of Wisdom (Bayt al-Hikmah) in Baghdad and the libraries of Cordoba attracted scholars worldwide. The emphasis on seeking knowledge ('ilm) in Islam drove this intellectual renaissance.",
            order_index: 1,
          },
          {
            title: "The Ottoman Empire",
            title_ar: "الدولة العثمانية",
            slug: "ottoman-empire",
            arabic_text: "وَأَعِدُّوا لَهُم مَّا اسْتَطَعْتُم مِّن قُوَّةٍ",
            content:
              "The Ottoman Empire (1299-1924) was one of the longest-lasting Islamic empires. Founded by Osman I, it grew from a small principality in Anatolia to a global superpower spanning three continents.\n\nMajor events include: the conquest of Constantinople (1453) by Mehmed the Conqueror, the peak under Suleiman the Magnificent (1520-1566), and the empire's gradual decline culminating in its dissolution after World War I.\n\nThe Ottomans were defenders of the Islamic world, protecting pilgrimage routes and administering justice through Islamic law. They also preserved and developed Islamic architecture, culminating in masterpieces like the Suleymaniye Mosque by architect Mimar Sinan.",
            order_index: 2,
          },
        ],
      },
    ],
  },

  // ─── 8. Tasawwuf / Tazkiyah ─────────────────────────────────────────
  {
    title: "Tasawwuf and Tazkiyah",
    title_ar: "التصوف والتزكية",
    description:
      "Learn about spiritual purification, character refinement, and the inner dimensions of Islam rooted in the Quran and Sunnah.",
    description_ar:
      "تعلم تزكية النفس وتطهير القلب والأبعاد الداخلية للإسلام المستندة إلى الكتاب والسنة.",
    level: "intermediate",
    slug: "tasawwuf-tazkiyah",
    order_index: 8,
    sections: [
      {
        title: "Purification of the Heart",
        title_ar: "تزكية القلوب",
        slug: "purification-of-heart",
        order_index: 1,
        lessons: [
          {
            title: "The Diseases of the Heart",
            title_ar: "أمراض القلوب",
            slug: "diseases-of-heart",
            arabic_text: "يَوْمَ لَا يَنفَعُ مَالٌ وَلَا بَنُونَ إِلَّا مَنْ أَتَى اللَّهَ بِقَلْبٍ سَلِيمٍ",
            content:
              "The heart (qalb) is the spiritual center of a person. The Prophet said: 'There is a piece of flesh in the body; if it is sound, the whole body is sound; if it is corrupt, the whole body is corrupt. Indeed, it is the heart.' (Bukhari, Muslim)\n\nSpiritual diseases include: arrogance (kibr), envy (hasad), ostentation (riya'), love of the world (hubb ad-dunya), anger (ghadab), and heedlessness (ghaflah). These diseases cloud the heart and distance one from Allah.\n\nPurification begins with recognizing these diseases, then actively treating them through sincere repentance, reflection, and consistent worship. The scholars of tazkiyah have written extensively on diagnosing and curing these spiritual ailments.",
            order_index: 1,
          },
          {
            title: "Muhasabah (Self-Accounting)",
            title_ar: "المحاسبة",
            slug: "muhasabah-self-accounting",
            arabic_text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَلْتَنظُرْ نَفْسٌ مَّا قَدَّمَتْ لِغَدٍ",
            content:
              "Muhasabah (self-accounting) is the practice of reflecting on one's actions and intentions, holding oneself accountable before being held accountable by Allah on the Day of Judgment.\n\nUmar ibn al-Khattab (RA) said: 'Take account of yourselves before you are taken to account.' The early Muslims would regularly assess their deeds: What did I intend today? What did I achieve? Where did I fall short?\n\nA practical method is to set aside time each evening to review the day: repent for sins, thank Allah for blessings, and plan for improvement. Regular muhasabah develops taqwa (God-consciousness) and helps align one's life with Divine pleasure.",
            order_index: 2,
          },
        ],
      },
      {
        title: "The Stages of the Soul",
        title_ar: "مراتب النفس",
        slug: "stages-of-soul",
        order_index: 2,
        lessons: [
          {
            title: "The Commanding and Blameworthy Soul",
            title_ar: "النفس الأمارة بالسوء",
            slug: "commanding-soul",
            arabic_text: "إِنَّ النَّفْسَ لَأَمَّارَةٌ بِالسُّوءِ",
            content:
              "The soul (nafs) has different stages. The lowest is an-Nafs al-Ammara (the commanding soul), which inclines toward evil and base desires. Allah mentions it in the story of Yusuf (AS): 'Indeed, the soul is ever inclined to evil.' (12:53)\n\nThis stage is characterized by following whims, indulgence in sins, and resistance to good. The person struggles to pray, finds obedience heavy, and is easily swayed by Shaytan and desires.\n\nThe remedy is: consistent muhasabah, accompanying the righteous, reducing worldly distractions, and sincerely asking Allah for help. With effort and divine grace, the soul can progress to higher stages.",
            order_index: 1,
          },
          {
            title: "The Contented Soul",
            title_ar: "النفس المطمئنة",
            slug: "contented-soul",
            arabic_text: "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً",
            content:
              "An-Nafs al-Mutma'innah (the contented soul) is the highest spiritual stage. Allah addresses it in the Quran: 'O contented soul, return to your Lord, well-pleased and pleasing [to Him].' (89:27-28)\n\nAt this stage, the soul finds peace in Allah, joy in worship, and contentment with divine decree. Obedience becomes easy, sins become detestable, and the person constantly feels the presence of Allah.\n\nBetween the commanding soul and the contented soul lies an-Nafs al-Lawwamah (the blaming soul) — which criticizes itself for shortcomings and strives for improvement. The goal of every believer is to reach the station of contentment, where the soul's rest is in its Creator.",
            order_index: 2,
          },
        ],
      },
      {
        title: "The Remembrance of Allah",
        title_ar: "ذكر الله",
        slug: "remembrance-of-allah",
        order_index: 3,
        lessons: [
          {
            title: "Dhikr: The Food of the Soul",
            title_ar: "الذكر: غذاء الروح",
            slug: "dhikr-food-of-soul",
            arabic_text: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
            content:
              "Dhikr (remembrance of Allah) is the essence of worship. It includes both verbal remembrance (saying Subhanallah, Alhamdulillah, Allahu Akbar, La ilaha illa Allah) and heart-based awareness (being conscious of Allah at all times).\n\nThe Quran says: 'And the men who remember Allah often and the women who remember — Allah has prepared for them forgiveness and a great reward.' (33:35)\n\nMorning and evening adhkar (supplications) protect the believer, bring barakah, and strengthen faith. The Prophet never let his tongue be dry from the remembrance of Allah. He encouraged constant dhikr: 'Let your tongue be moist with the remembrance of Allah.' (Tirmidhi)",
            order_index: 1,
          },
          {
            title: "Tawakkul: Reliance on Allah",
            title_ar: "التوكل على الله",
            slug: "tawakkul-reliance",
            arabic_text: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
            content:
              "Tawakkul (trust in Allah) is an essential aspect of tazkiyah. It means relying on Allah wholeheartedly while taking the necessary means. It is not fatalism or passivity — the Prophet himself tied his camel before trusting Allah.\n\nTrue tawakkul brings peace: 'And whoever relies upon Allah — then He is sufficient for him.' (65:3). The believer takes action, plans wisely, and then leaves the outcome to Allah with complete trust.\n\nTawakkul and rizq (provision) are connected. The Prophet said: 'If you were to rely upon Allah with the reliance He is due, He would provide for you as He provides for the birds — they go out in the morning hungry and return full.' (Tirmidhi, Ibn Majah)",
            order_index: 2,
          },
        ],
      },
    ],
  },

  // ─── 9. Usul al-Fiqh ─────────────────────────────────────────────────
  {
    title: "Usul al-Fiqh",
    title_ar: "أصول الفقه",
    description:
      "Study the principles of Islamic jurisprudence: how rulings are derived from the Quran, Sunnah, consensus, and analogical reasoning.",
    description_ar:
      "دراسة أصول الفقه: كيفية استنباط الأحكام من الكتاب والسنة والإجماع والقياس.",
    level: "advanced",
    slug: "usul-al-fiqh",
    order_index: 9,
    sections: [
      {
        title: "The Primary Sources",
        title_ar: "المصادر الأصلية",
        slug: "primary-sources",
        order_index: 1,
        lessons: [
          {
            title: "The Quran as Primary Source",
            title_ar: "القرآن كمصدر أول",
            slug: "quran-as-primary-source",
            arabic_text: "أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ ۚ وَلَوْ كَانَ مِنْ عِندِ غَيْرِ اللَّهِ لَوَجَدُوا فِيهِ اخْتِلَافًا كَثِيرًا",
            content:
              "The Quran is the primary and most authoritative source of Islamic law. Its verses are categorized into: Muhkamat (clear, unequivocal verses) — the foundation of the law, and Mutashabihat (ambiguous verses) — interpreted in light of the clear ones.\n\nLegal verses (ayat al-ahkam) cover worship, family law, criminal law, business transactions, and governance. Scholars have identified approximately 500 legal verses in the Quran.\n\nThe Quran's rulings take precedence over all other sources. The Sunnah explains and clarifies the Quran, but never contradicts it. Understanding the Quran requires knowledge of Arabic, asbab an-nuzul (context), and naskh (abrogation).",
            order_index: 1,
          },
          {
            title: "The Sunnah: Revelation and Explanation",
            title_ar: "السنة: وحي وبيان",
            slug: "sunnah-revelation-explanation",
            arabic_text: "وَمَا آتَاكُمُ الرَّسُولُ فَخُذُوهُ وَمَا نَهَاكُمْ عَنْهُ فَانتَهُوا",
            content:
              "The Sunnah is the second primary source of Islamic law. It consists of the Prophet's statements, actions, and tacit approvals. The Quran itself commands obedience to the Prophet and establishes his Sunnah as binding.\n\nThe Sunnah serves multiple functions: (1) explaining Quranic verses (e.g., how to pray), (2) specifying general verses (e.g., inheritance shares), (3) providing additional rulings not explicitly in the Quran (e.g., prohibition of combining a woman and her aunt in marriage).\n\nScholars of usul al-fiqh differentiate between Sunnah that is legislative (tashri'i) — establishing law — and that which is habitual (jibilli), like the Prophet's preferred foods or sleeping positions, which is recommended but not obligatory.",
            order_index: 2,
          },
        ],
      },
      {
        title: "Secondary Sources and Ijtihad",
        title_ar: "المصادر التبعية والاجتهاد",
        slug: "secondary-sources-ijtihad",
        order_index: 2,
        lessons: [
          {
            title: "Ijma (Consensus) and Qiyas (Analogy)",
            title_ar: "الإجماع والقياس",
            slug: "ijma-qiyas",
            arabic_text: "وَمَن يُشَاقِقِ الرَّسُولَ مِن بَعْدِ مَا تَبَيَّنَ لَهُ الْهُدَىٰ وَيَتَّبِعْ غَيْرَ سَبِيلِ الْمُؤْمِنِينَ",
            content:
              "Ijma (scholarly consensus) is the agreement of qualified jurists of a generation on a legal ruling. It is based on the principle that the Ummah does not unite upon error. Ijma is a binding source after the Quran and Sunnah.\n\nQiyas (analogical reasoning) is deriving a ruling for a new case by comparing it to an existing case with a shared effective cause (illah). For example, the prohibition of wine is extended to all intoxicants because the illah (intoxication) is common to both.\n\nBoth ijma and qiyas are recognized by the majority of scholars (Jumhur) as valid sources, though the Zahiri school rejects qiyas. Ijtihad (independent reasoning) is the process by which qualified scholars derive rulings using these sources.",
            order_index: 1,
          },
          {
            title: "Istihsan, Maslahah, and 'Urf",
            title_ar: "الاستحسان والمصلحة والعرف",
            slug: "istihsan-maslahah-urf",
            arabic_text: "الَّذِينَ يَسْتَمِعُونَ الْقَوْلَ فَيَتَّبِعُونَ أَحْسَنَهُ",
            content:
              "Istihsan (juristic preference) is departing from a clear analogy in favor of a more suitable ruling due to a stronger evidence or necessity. It is used by the Hanafi school and others to achieve justice and prevent hardship.\n\nMaslahah Mursalah (public interest) considers the general welfare in matters where no specific text exists. It is employed by the Maliki school as long as it aligns with the objectives of Islamic law (Maqasid ash-Shari'ah).\n\n'Urf (custom) refers to local customs and practices that do not contradict Islamic principles. Customs are considered in legal rulings, especially in transactions and family matters, as long as they are not explicitly prohibited by revelation.",
            order_index: 2,
          },
        ],
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════════
  //  8. TAZKIYAH (تزكية النفس)
  // ═════════════════════════════════════════════════════════════════════
  {
    title: "Tazkiyah",
    title_ar: "تزكية النفس",
    description:
      "Purify your soul and elevate your character. Study the diseases of the heart, the stages of the soul, and the path to spiritual excellence.",
    description_ar:
      "طهر روحك وارفع أخلاقك. دراسة أمراض القلوب ومراتب النفس والطريق إلى الإحسان الروحي.",
    level: "intermediate",
    slug: "tazkiyah",
    order_index: 8,
    sections: [
      // ── Section 1: Knowing Your Enemy — The Nafs ──
      {
        title: "Knowing Your Enemy — The Nafs",
        title_ar: "معرفة عدوك — النفس",
        slug: "knowing-your-nafs",
        order_index: 1,
        lessons: [
          {
            title: "The Three Levels of the Soul",
            title_ar: "مراتب النفس الثلاث",
            slug: "three-levels-of-soul",
            arabic_text: "وَنَفْسٍ وَمَا سَوَّاهَا فَأَلْهَمَهَا فُجُورَهَا وَتَقْوَاهَا",
            content:
              "The Quran describes the soul (nafs) as having different levels or stages. Understanding these levels is essential for spiritual growth. The three main stages are: an-Nafs al-Ammara (the commanding soul), an-Nafs al-Lawwamah (the blaming soul), and an-Nafs al-Mutma'innah (the contented soul).\\n\\nAn-Nafs al-Ammara (12:53) is the soul that commands evil. It inclines toward base desires, instant gratification, and rebellion against Allah. When a person follows every whim without restraint, they are at this level. The Prophet said: 'Your most dangerous enemy is your nafs which is between your sides.'\\n\\nAn-Nafs al-Lawwamah (75:2) is the soul that blames itself. It has awakened from heedlessness. When it sins, it feels guilt. When it falls short, it criticizes itself. This is the stage of struggle — the believer is fighting his lower desires. This is a positive stage, not a negative one.\\n\\nAn-Nafs al-Mutma'innah (89:27-28) is the soul at peace. It has found rest in the remembrance of Allah. It no longer struggles with major sins because obedience has become its nature. Allah addresses it: 'O contented soul, return to your Lord, well-pleased and pleasing [to Him].'\\n\\nThe journey of tazkiyah is moving from the commanding soul to the contented soul through self-awareness, struggle (mujahadah), and divine help. The next lessons will teach you how to recognize and treat the obstacles along this path.",
            order_index: 1,
          },
          {
            title: "The Commanding Soul — What It Wants",
            title_ar: "النفس الأمارة — ماذا تريد",
            slug: "commanding-soul-desires",
            arabic_text: "إِنَّ النَّفْسَ لَأَمَّارَةٌ بِالسُّوءِ إِلَّا مَا رَحِمَ رَبِّي",
            content:
              "The commanding soul (an-Nafs al-Ammara) is the part of us that pulls toward sin, laziness, and instant gratification. It is not evil in itself — Allah created it with natural desires. The problem is when these desires are not controlled by faith and reason.\\n\\nWhat does the commanding soul want? It wants: pleasure without limits (food, drink, sex, comfort), status and recognition from people, to avoid effort in worship, to take revenge when wronged, to follow the crowd rather than the truth, and to justify sins instead of repenting.\\n\\nThe Prophet said: 'The strong person is not the one who can wrestle others down. The strong person is the one who controls himself at times of anger.' (Bukhari, Muslim). True strength is not physical — it is the ability to say no to your commanding soul when it demands something Allah has forbidden.\\n\\nHow do you weaken the commanding soul? By not giving it what it wants all the time. Intermittent fasting, waking for Fajr, giving charity when you want to keep the money, being kind to someone who hurt you — each of these trains the soul to obey Allah rather than desire.\\n\\nThe next lesson will discuss another enemy: hawa (desire) versus aql (reason). The commanding soul operates through desires, and the intellect is your weapon against it.",
            order_index: 2,
          },
          {
            title: "Hawa (Desires) vs Aql (Reason)",
            title_ar: "الهوى والعقل",
            slug: "hawa-vs-aql",
            arabic_text: "أَفَرَأَيْتَ مَنِ اتَّخَذَ إِلَٰهَهُ هَوَاهُ",
            content:
              "The Quran warns against those who take their desires (hawa) as their god: 'Have you seen the one who takes his own desire as his god?' (25:43). When a person's desires override their intellect and faith, they have essentially made their desires an object of worship.\\n\\nAllah gave humans two faculties: aql (intellect/reason) and hawa (desire/passion). The intellect distinguishes right from wrong, considers consequences, and remembers Allah. Desire seeks immediate gratification without considering consequences. Your faith is strong when your intellect governs your desires. Your faith weakens when your desires govern your intellect.\\n\\nShaytan's strategy is to make desires look beautiful. He whispers: 'It's just one look... just one sip... just one more time. You can repent later.' The intellect replies: 'This pleasure will end in regret. The pleasure of obedience lasts forever. Allah is watching now.'\\n\\nThe companions trained themselves to follow intellect over desire. Abu Bakr (RA) would say: 'My intellect has never let me sleep through the night hungry when I could eat, nor has it let me sleep full when my neighbor was hungry.' His aql governed his actions completely.\\n\\nThe cure: strengthen your aql through knowledge (ilm) and reflection (tafakkur). The more you know about Allah, Paradise, Hell, and the purpose of life, the easier it becomes for your intellect to rule over your desires. This is why knowledge is the foundation of tazkiyah. The next sections will show you the specific diseases that afflict the soul when desires take over.",
            order_index: 3,
          },
        ],
      },
      // ── Section 2: Diseases of the Heart ──
      {
        title: "Diseases of the Heart",
        title_ar: "أمراض القلوب",
        slug: "diseases-of-heart",
        order_index: 2,
        lessons: [
          {
            title: "Kibr (Pride) — The Disease of Iblees",
            title_ar: "الكبر — داء إبليس",
            slug: "kibr-pride",
            arabic_text: "أَبَىٰ وَاسْتَكْبَرَ وَكَانَ مِنَ الْكَافِرِينَ",
            content:
              "Kibr (pride/arrogance) is the first sin ever committed in the universe. When Allah commanded the angels to prostrate to Adam, Iblees refused out of pride: 'I am better than him. You created me from fire and created him from clay.' (7:12). Pride caused the fall of Iblees from Jannah, and it can destroy your soul just as surely.\\n\\nThe Prophet said: 'No one who has an atom's weight of pride in his heart will enter Paradise.' (Muslim). A man asked: 'What about a person who likes his clothes to be nice?' The Prophet replied: 'Allah is beautiful and loves beauty. Pride is rejecting the truth and looking down on people.' (Muslim)\\n\\nPride manifests as: refusing to accept the truth when it comes from someone you consider beneath you, looking down on others because of their wealth, race, or status, feeling superior because of your knowledge or worship, and becoming angry when someone corrects you.\\n\\nThe cure for kibr is: remember that you were created from a drop of fluid (nutfah), you will die and decay, and you will stand before Allah alone. The Prophet said: 'Whoever humbles himself for Allah, Allah will raise him.' (Muslim). Umar ibn al-Khattab (RA) used to carry water on his shoulder despite being the caliph, saying: 'My nafs feels proud and I want to humble it.'\\n\\nThe next disease — hasad (envy) — often results from pride. A proud person envies others because he cannot stand anyone being better than him.",
            order_index: 1,
          },
          {
            title: "Hasad (Envy) — How It Destroys the Owner",
            title_ar: "الحسد — كيف يدمر صاحبه",
            slug: "hasad-envy",
            arabic_text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
            content:
              "Hasad (envy) is resenting the blessings that Allah has given to others and wishing for those blessings to be removed. The Prophet said: 'Do not envy one another... Be servants of Allah as brothers.' (Bukhari, Muslim). Hasad is a fire that burns good deeds like fire burns wood.\\n\\nThe first sin committed among humans was caused by hasad — one of Adam's sons (Qabil/Cain) killed his brother (Habil/Abel) because he envied that Allah accepted Habil's sacrifice. Hasad destroys the envier before it harms the envied. The envier lives in constant misery, while the envied person may not even know or care.\\n\\nHasad is different from ghibtah (admiration). Ghibtah is wishing you had the same blessing without wanting it to be taken from the other person. The Prophet said: 'There is no envy except in two cases: a person to whom Allah has given wealth and he spends it in the right way, and a person to whom Allah has given wisdom and he judges by it and teaches it.' (Bukhari, Muslim)\\n\\nThe cure for hasad is: remember that Allah distributes blessings as He wills, focus on your own blessings, make dua for the person you envy, and increase your gratitude (shukr). When you are grateful for what you have, you stop resenting what others have.\\n\\nThe next disease — riya (showing off) — connects to both pride and envy. A proud person wants to be seen. An envious person wants what others have. Both lead to showing off.",
            order_index: 2,
          },
          {
            title: "Riya (Showing Off) — The Hidden Shirk",
            title_ar: "الرياء — الشرك الخفي",
            slug: "riya-showing-off",
            arabic_text: "فَوَيْلٌ لِّلْمُصَلِّينَ الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ الَّذِينَ هُمْ يُرَاءُونَ",
            content:
              "Riya (showing off) is performing acts of worship or good deeds to be seen and praised by people, not for Allah. The Prophet called it 'the minor shirk' (Ahmad). It is shirk because it directs the intention — which should be purely for Allah — toward human approval.\\n\\nRiya is extremely dangerous because it is subtle. A person might pray longer in the mosque because others are watching. Give charity more when people are around. Speak more knowledgeably to impress listeners. Even the desire to be known as 'pious' or 'knowledgeable' can be a form of riya.\\n\\nThe Prophet said: 'The thing I fear most for you is the minor shirk — riya.' (Ahmad). On the Day of Judgment, those who did deeds for show will be told: 'Go to those for whom you did the deeds and see if you can find your reward with them.' The people who praised them on earth cannot give them any reward in the Hereafter.\\n\\nThe cure for riya is: ikhlas (sincerity) — purifying your intention for Allah alone. Train yourself to do good deeds in secret. The Prophet said: 'Seven people will be shaded by Allah on the Day of Judgment... a person who gives charity so secretly that his left hand does not know what his right hand gives.' (Bukhari, Muslim)\\n\\nKeep your worship between you and Allah. Do not seek human praise. If people praise you, say: 'O Allah, do not hold me accountable for what they say, and forgive me for what they do not know.' The next disease is the overarching one: love of this world (hubb ad-dunya).",
            order_index: 3,
          },
          {
            title: "Hubb ad-Dunya — Love of This World",
            title_ar: "حب الدنيا — حب هذه الحياة",
            slug: "hubb-ad-dunya",
            arabic_text: "بَلْ تُؤْثِرُونَ الْحَيَاةَ الدُّنْيَا وَالْآخِرَةُ خَيْرٌ وَأَبْقَىٰ",
            content:
              "Hubb ad-Dunya (love of this world) is the root of all sins. When a person loves this world more than the Hereafter, they will sacrifice their religion for worldly gain. The Prophet said: 'The love of this world is the head of every sin.'\\n\\nThis does not mean you cannot enjoy the good things of this world. Allah says: 'Say: Who has forbidden the adornment of Allah which He has produced for His servants and the good [lawful] things of provision?' (7:32). Enjoying what is halal is allowed. The problem is when this world becomes your ultimate goal — when you live for it, prioritize it over Allah, and become distracted from the Hereafter.\\n\\nSigns of hubb ad-dunya: your happiness depends on wealth and status, you neglect your prayers for work or entertainment, you postpone repentance thinking you have time, you worry excessively about money and provision, and the thought of death scares you because you are attached to this life.\\n\\nThe cure: remember the reality of this world. The Prophet said: 'What is the world compared to the Hereafter? It is like when one of you dips his finger in the sea. Let him see what comes back.' (Muslim). The world is a drop of water — the Hereafter is the ocean.\\n\\nIncrease your awareness of death. Visit graveyards. Reflect on the fact that you will leave behind everything you own. The Prophet advised: 'Live in this world as if you are a stranger or a wayfarer.' (Bukhari). A traveler does not get attached to the inn — they pass through and keep their eyes on the destination.\\n\\nThe next section will teach the cures and how to elevate your soul from these diseases toward spiritual excellence.",
            order_index: 4,
          },
        ],
      },
      // ── Section 3: Cures & Elevation ──
      {
        title: "Cures & Elevation",
        title_ar: "العلاج والارتقاء",
        slug: "cures-and-elevation",
        order_index: 3,
        lessons: [
          {
            title: "Tawbah — Returning to Allah",
            title_ar: "التوبة — العودة إلى الله",
            slug: "tawbah-returning",
            arabic_text: "يَا أَيُّهَا الَّذِينَ آمَنُوا تُوبُوا إِلَى اللَّهِ تَوْبَةً نَّصُوحًا",
            content:
              "Tawbah (repentance) is the most beautiful door of mercy. Allah has left it open for every sinner until the moment of death or the rising of the sun from the west. The Prophet said: 'Allah extends His hand at night to accept the repentance of the one who sinned during the day, and extends His hand during the day to accept the repentance of the one who sinned at night.' (Muslim)\\n\\nThe conditions of sincere repentance (tawbah nasuh) are: (1) stop the sin immediately, (2) regret what you have done, (3) resolve never to return to it, and (4) if the sin involves wronging another person, make amends with them.\\n\\nTawbah is not just for major sins. The Prophet would repent to Allah 100 times a day — despite being sinless. This was his way of teaching us that the believer never feels they have done enough. Every shortcoming, every missed opportunity for good, every imperfect intention is a reason to turn back to Allah.\\n\\nAllah loves those who repent. He says: 'Indeed, Allah loves those who are constantly repentant and loves those who purify themselves.' (2:222). When a servant repents, Allah is more joyful than a man who finds his lost camel in the desert after losing all hope.\\n\\nDo not let Shaytan deceive you with: 'You will sin again, so why repent?' Repent anyway. Every time you fall, get back up. The best of sinners are those who repent again and again. This is the door to all spiritual elevation.",
            order_index: 1,
          },
          {
            title: "Muhasabah — Daily Self-Accounting",
            title_ar: "المحاسبة — محاسبة النفس اليومية",
            slug: "muhasabah-self-accounting",
            arabic_text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَلْتَنظُرْ نَفْسٌ مَّا قَدَّمَتْ لِغَدٍ",
            content:
              "Muhasabah (self-accounting) is the practice of reviewing your actions and intentions daily. Umar ibn al-Khattab (RA) said: 'Take account of yourselves before you are taken to account. Weigh your deeds before they are weighed for you.'\\n\\nHow to practice muhasabah:\\n1. Set aside time each day (before sleep is ideal)\\n2. Review your day: What did I do for Allah? What sins did I commit? What good deeds did I miss?\\n3. Thank Allah for the good you did — He enabled it.\\n4. Repent for sins and resolve to do better tomorrow.\\n5. Identify one area to improve the next day.\\n\\nMuhasabah connects directly to the diseases of the heart. If you notice pride in your interactions, repent. If you felt envy when a colleague succeeded, catch it and make dua for them. The regular practice of muhasabah makes you aware of your spiritual state and prevents diseases from taking root.\\n\\nThe early Muslims were masters of muhasabah. Al-Hasan al-Basri said: 'A believer is the overseer of his own soul. He holds himself accountable for the sake of Allah. The reckoning on the Day of Judgment will be light for those who hold themselves accountable in this world.'\\n\\nStart small. Just 5 minutes before sleep. Ask: What did I do today that Allah will be pleased with? What will I improve tomorrow? The next lesson will teach you the most powerful medicine for the soul: dhikr (remembrance of Allah).",
            order_index: 2,
          },
          {
            title: "Dhikr — Remembrance as Medicine",
            title_ar: "الذكر — الدواء",
            slug: "dhikr-remembrance",
            arabic_text: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
            content:
              "Dhikr (remembrance of Allah) is the medicine for every disease of the heart. The Quran says: 'Indeed, in the remembrance of Allah do hearts find rest.' (13:28). If your heart is restless, anxious, sad, or confused — the cure is dhikr.\\n\\nDhikr includes: saying 'Subhanallah' (Glory to Allah), 'Alhamdulillah' (Praise to Allah), 'Allahu Akbar' (Allah is Greatest), 'La ilaha illa Allah' (There is no god but Allah), 'Astaghfirullah' (I seek forgiveness from Allah), morning and evening adhkar, Quran recitation, and dua.\\n\\nThe Prophet said: 'The example of the one who remembers his Lord and the one who does not remember Him is like the example of the living and the dead.' (Bukhari). A heart without dhikr is a dead heart. It does not feel the presence of Allah, does not long for worship, and does not find peace in obedience.\\n\\nMake dhikr a habit. The Prophet encouraged: 'Let your tongue be moist with the remembrance of Allah.' (Tirmidhi). Have a daily wird (set amount) of dhikr that you never miss, even if it is just 10 minutes after Fajr.\\n\\nEach type of dhikr has specific benefits: 'Subhanallah' purifies Allah from imperfection. 'Alhamdulillah' fills the scale with gratitude. 'Allahu Akbar' reminds you of His greatness. 'La ilaha illa Allah' is the best of all dhikr because it is the essence of Tawhid. 'Astaghfirullah' washes away sins.\\n\\nThe next lesson builds on this: tawakkul (reliance on Allah) is the fruit of dhikr. When you remember Allah constantly, you naturally trust Him completely.",
            order_index: 3,
          },
          {
            title: "Tawakkul — Trusting Allah Completely",
            title_ar: "التوكل — الثقة الكاملة بالله",
            slug: "tawakkul-trusting-allah",
            arabic_text: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
            content:
              "Tawakkul (trust in Allah) is the pinnacle of tazkiyah. When you have purified your intentions (tawbah), held yourself accountable (muhasabah), and filled your heart with dhikr, the natural result is complete reliance on Allah.\\n\\nTawakkul does not mean abandoning effort. The Prophet (peace be upon him) was asked: 'Should I tie my camel and trust Allah, or leave it untied and trust Allah?' He replied: 'Tie it and then trust Allah.' (Tirmidhi). Tawakkul is taking the means and then leaving the outcome to Allah — without anxiety and without despair.\\n\\nTrue tawakkul brings a profound peace. You do what you can, and whatever happens, you know it is from Allah. If you succeed, you thank Him. If you fail, you accept His decree. Your heart is not attached to outcomes because you trust that the One who controls outcomes knows what is best.\\n\\nThe Quran says: 'And whoever relies upon Allah — then He is sufficient for him.' (65:3). This verse is a complete program for the anxious heart. You worry about money? Tawakkul. You worry about your children? Tawakkul. You worry about the future? Tawakkul. The Provider (Ar-Razzaq) is sufficient.\\n\\nThis course on Tazkiyah has taken you from the depths of the diseases of the heart to the heights of spiritual excellence. The path is clear: know yourself (your nafs), recognize the diseases, repent, hold yourself accountable, remember Allah constantly, and trust Him completely. This is the way of the Prophet and his companions. This is the path to Jannah.\\n\\nThe next subject — Usul al-Fiqh — will show you how the scholars derived the rulings that guide this path. Knowledge and spirituality go hand in hand.",
            order_index: 4,
          },
        ],
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════════
  //  9. USUL AL-FIQH (أصول الفقه)
  // ═════════════════════════════════════════════════════════════════════
  {
    title: "Usul al-Fiqh",
    title_ar: "أصول الفقه",
    description:
      "Understand the principles of Islamic jurisprudence: how scholars derive rulings from the Quran, Sunnah, consensus, and analogical reasoning.",
    description_ar:
      "افهم أصول الفقه: كيف يستنبط العلماء الأحكام من الكتاب والسنة والإجماع والقياس.",
    level: "advanced",
    slug: "usul-al-fiqh",
    order_index: 9,
    sections: [
      // ── Section 1: What is Islamic Law Built On? ──
      {
        title: "What is Islamic Law Built On?",
        title_ar: "على ماذا بني الفقه الإسلامي؟",
        slug: "what-is-fiqh-built-on",
        order_index: 1,
        lessons: [
          {
            title: "Introduction to Usul al-Fiqh",
            title_ar: "مقدمة في أصول الفقه",
            slug: "intro-usul-al-fiqh",
            arabic_text: "وَمَا كَانَ الْمُؤْمِنُونَ لِيَنفِرُوا كَافَّةً ۚ فَلَوْلَا نَفَرَ مِن كُلِّ فِرْقَةٍ مِّنْهُمْ طَائِفَةٌ لِّيَتَفَقَّهُوا فِي الدِّينِ",
            content:
              "Usul al-Fiqh (the principles of jurisprudence) is the science that explains how Islamic rulings (fiqh) are derived from their sources. It is the methodology, not the rulings themselves. Fiqh is the product; usul al-fiqh is the process.\\n\\nUsul al-Fiqh answers questions like: How do we know that an action is obligatory (fard)? How do we know when the Quran's general command is specific? What happens when hadith seem to contradict? How do we handle situations the Quran and Sunnah did not explicitly address?\\n\\nThe foundational sources are: the Quran (the word of Allah), the Sunnah (the example of the Prophet), Ijma (consensus of scholars), and Qiyas (analogical reasoning). Some schools also consider Istihsan, Maslahah, 'Urf, and other principles.\\n\\nThe great imams of fiqh — Abu Hanifah, Malik, Shafi'i, and Ahmad — developed these principles. Their differences in methodology led to different rulings, but all are valid and all operate within the framework of usul. The Prophet said: 'If a judge makes a ruling and strives (ijtihad) and is correct, he has two rewards. If he strives and is wrong, he has one reward.' (Bukhari, Muslim)\\n\\nUnderstanding usul al-fiqh helps you appreciate the depth of Islamic scholarship. It protects you from extremist interpretations (which ignore established principles) and from overly liberal interpretations (which abandon the sources altogether).",
            order_index: 1,
          },
          {
            title: "The Quran as the First Source",
            title_ar: "القرآن كمصدر أول",
            slug: "quran-as-first-source",
            arabic_text: "إِنَّا أَنزَلْنَا إِلَيْكَ الْكِتَابَ بِالْحَقِّ لِتَحْكُمَ بَيْنَ النَّاسِ بِمَا أَرَاكَ اللَّهُ",
            content:
              "The Quran is the primary and most authoritative source of Islamic law. It is the literal word of Allah, preserved perfectly, and it takes precedence over all other sources. Every ruling derived from fiqh must be consistent with the Quran.\\n\\nNot all Quranic verses are legal in nature. Scholars divide Quranic verses into: ayat al-ahkam (legal verses) — approximately 500 verses that contain rulings about worship, family, commerce, and crime — and other verses about belief, stories, and the Hereafter.\\n\\nThe Quranic style of legislation is unique. Sometimes it gives detailed rules (inheritance shares in 4:11-12), sometimes general principles (establish justice), and sometimes commands with wisdom attached ('prayer prevents immorality and wrongdoing' 29:45). Understanding this style is part of usul.\\n\\nThe Quran also uses three types of commands: fard (obligatory — you must do it), mandub (recommended — you are encouraged to do it), and mubah (permissible — you may do it). Prohibitions are similarly graded: haram (forbidden — you must avoid it) and makruh (disliked — you are encouraged to avoid it).\\n\\nThe Quran is the foundation. The Sunnah explains, specifies, and supplements it — but never contradicts it. If a hadith seems to contradict the Quran, the hadith is either misunderstood or inauthentic. This principle keeps the sources in harmony.",
            order_index: 2,
          },
          {
            title: "The Sunnah — Why We Follow the Prophet ﷺ",
            title_ar: "السنة — لماذا نتبع النبي ﷺ",
            slug: "sunnah-why-we-follow",
            arabic_text: "وَمَا آتَاكُمُ الرَّسُولُ فَخُذُوهُ وَمَا نَهَاكُمْ عَنْهُ فَانتَهُوا",
            content:
              "The Sunnah is the second primary source of Islamic law. It consists of the Prophet's words, actions, and tacit approvals. Allah commands in the Quran: 'O you who believe, obey Allah and obey the Messenger.' (4:59). This obedience to the Messenger includes following his Sunnah.\\n\\nThe Sunnah serves several functions in relation to the Quran:\\n1. Explanation (bayan tafsir): The Sunnah explains how to perform what the Quran commands. The Quran says 'establish prayer' — the Prophet showed us how.\\n2. Specification (bayan takhsis): The Sunnah specifies the general. The Quran says 'forbidden to you are...' — the Sunnah specifies which animals are included.\\n3. Addition (bayan tashri'): The Sunnah can add rulings not explicitly in the Quran — like the prohibition of combining a woman and her aunt in marriage.\\n\\nThe authority of the Sunnah is absolute in matters of religion. The Quran itself establishes this: 'Nor does he speak from his own desire. It is only revelation revealed.' (53:3-4). The Prophet's teachings are divinely inspired.\\n\\nScholars of usul differentiate between the Prophet's actions: some were legislative (tashri'i — to be followed), some were habitual (jibilli — like his preferred foods), and some were specific to him (khasais — like marrying more than four wives). Knowing these categories is part of usul.\\n\\nThe relationship between the Quran and Sunnah is the backbone of fiqh. The next section will show how scholars use secondary sources to address new situations.",
            order_index: 3,
          },
        ],
      },
      // ── Section 2: Secondary Sources ──
      {
        title: "Secondary Sources",
        title_ar: "المصادر التبعية",
        slug: "secondary-sources",
        order_index: 2,
        lessons: [
          {
            title: "Ijma — Scholarly Consensus",
            title_ar: "الإجماع — اتفاق العلماء",
            slug: "ijma-consensus",
            arabic_text: "وَمَن يُشَاقِقِ الرَّسُولَ مِن بَعْدِ مَا تَبَيَّنَ لَهُ الْهُدَىٰ وَيَتَّبِعْ غَيْرَ سَبِيلِ الْمُؤْمِنِينَ نُوَلِّهِ مَا تَوَلَّىٰ",
            content:
              "Ijma (consensus) is the agreement of qualified scholars of a generation on a legal ruling. It is the third source of Islamic law after the Quran and Sunnah. The principle is based on the hadith: 'My Ummah will not agree upon an error.' (Hakim)\\n\\nIf all the scholars of a generation agree on a ruling, that ruling becomes binding. No Muslim can reject ijma. For example, the five daily prayers being obligatory is established by ijma — no scholar has ever disagreed on this.\\n\\nIjma can be explicit (the scholars openly agree and state their agreement) or implicit (some scholars agree, others stay silent, and their silence is taken as consent). Most scholars accept both forms, though some require explicit agreement.\\n\\nContemporary ijma is harder to achieve in a global Ummah with many scholars. However, classical ijma on foundational issues remains authoritative. For example, the prohibition of interest (riba), the obligation of hijab, and the punishment for adultery are all established by ijma.\\n\\nIjma ensures that the religion is not subject to individual whims. It is a safeguard against innovation because any new opinion must be validated against the consensus of the scholars who came before.",
            order_index: 1,
          },
          {
            title: "Qiyas — Analogical Reasoning (with Examples)",
            title_ar: "القياس — الاستدلال بالتمثيل (مع أمثلة)",
            slug: "qiyas-analogical-reasoning",
            arabic_text: "فَاعْتَبِرُوا يَا أُولِي الْأَبْصَارِ",
            content:
              "Qiyas (analogical reasoning) is the fourth primary source of Islamic law. It means deriving a ruling for a new case by comparing it to an existing case from the Quran, Sunnah, or Ijma when they share the same effective cause (illah).\\n\\nExample: The Quran prohibits wine (khamr) because it intoxicates. Through qiyas, scholars extend this prohibition to all intoxicants — beer, whiskey, drugs, etc. — because they share the same illah (intoxication).\\n\\nQiyas has four components:\\n1. Asl (original case) — the ruling from Quran/Sunnah (e.g., wine is haram)\\n2. Far' (new case) — what we want to rule on (e.g., cocaine)\\n3. Illah (effective cause) — the reason behind the original ruling (intoxication)\\n4. Hukm (ruling) — the same ruling applies to the new case (haram)\\n\\nNot all scholars accept qiyas. The Zahiri school (followers of Dawud al-Zahiri) reject it entirely, relying only on the apparent (zahir) meaning of texts. The Hanbali school uses it but restricts it. The Hanafi school uses it extensively, especially in transactions.\\n\\nQiyas is not personal opinion — it is a disciplined methodology with strict rules. The illah must be: (1) evident, not hidden, (2) consistent — it must apply in all cases, not just some, and (3) relevant — it must be the reason Allah gave the ruling, not an arbitrary attribute.\\n\\nThe next lesson covers other secondary sources that scholars use when qiyas is not applicable.",
            order_index: 2,
          },
          {
            title: "Istihsan, Maslahah, 'Urf — Islam's Flexibility",
            title_ar: "الاستحسان والمصلحة والعرف — مرونة الإسلام",
            slug: "istihsan-maslahah-urf",
            arabic_text: "الَّذِينَ يَسْتَمِعُونَ الْقَوْلَ فَيَتَّبِعُونَ أَحْسَنَهُ",
            content:
              "Beyond the four primary sources, scholars have developed additional principles to address new situations while remaining faithful to the revelation. These principles are not independent sources — they operate within the framework of the Quran, Sunnah, Ijma, and Qiyas.\\n\\nIstihsan (juristic preference): Departing from an apparent qiyas in favor of a stronger evidence or to avoid hardship. Example: A contract with uncertainty (gharar) is normally invalid. But istihsan allows salam contracts (advance payment for future delivery) because people need them for agriculture and trade. The Hanafi school uses istihsan extensively.\\n\\nMaslahah Mursalah (public interest): Considering the general welfare in cases where no specific text exists. Example: Umar ibn al-Khattab (RA) established prisons, regulated markets, and created a public treasury — not because specific texts commanded these, but because they serve the public interest (maslahah) and align with the objectives of Shariah (maqasid). The Maliki school uses this method widely.\\n\\n'Urf (custom/local practice): Customs that do not contradict Islamic principles can influence rulings. Example: The mahr (dowry) amount is determined by custom in each society, not by a fixed text. Contracts and business practices based on local custom are valid as long as they do not involve prohibited elements.\\n\\nThese principles show that Islam is not rigid. It has flexibility to adapt to different times and places while remaining anchored in revelation. The next section will show how all these principles come together in real-world application.",
            order_index: 3,
          },
        ],
      },
      // ── Section 3: Applying It ──
      {
        title: "Applying It",
        title_ar: "التطبيق العملي",
        slug: "applying-it",
        order_index: 3,
        lessons: [
          {
            title: "How a Fatwa is Made",
            title_ar: "كيف يصدر الفتوى",
            slug: "how-fatwa-is-made",
            arabic_text: "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ",
            content:
              "A fatwa is a non-binding legal opinion issued by a qualified scholar (mufti) in response to a specific question. It is not the same as a court judgment (qada) — a fatwa guides the questioner, while a judge's ruling is binding on the parties.\\n\\nThe process of issuing a fatwa: (1) understand the question clearly — what is being asked, (2) identify the relevant texts from Quran and Sunnah, (3) consider the consensus of scholars (ijma), (4) use qiyas if the case is new, (5) consider the context, time, place, and circumstances, (6) consider the consequences (ma'alah) of the ruling — will it cause harm? will it lead to something worse?\\n\\nA mufti must have deep knowledge: Arabic language, Quran, hadith, usul al-fiqh, maqasid al-shariah, and the existing body of fiqh. They must also be aware of contemporary realities. A mufti who does not understand modern finance, medicine, or technology cannot give reliable fatwas on those topics.\\n\\nFatwas can change with time, place, and circumstances — a principle based on the actions of the companions. For example, Umar (RA) changed the distribution of zakat during a famine. The ruling (hukm) is based on the evidence and the situation, not on personal opinion.\\n\\nThe Prophet warned: 'Whoever gives a fatwa without knowledge will bear the sin of those who act on it.' (Abu Dawud). This is why you must ask qualified scholars, not unqualified internet personalities. The next lesson discusses the schools of thought (madhahib) that organize this vast body of scholarship.",
            order_index: 1,
          },
          {
            title: "The 4 Madhabs — Differences are a Mercy",
            title_ar: "المذاهب الأربعة — الاختلاف رحمة",
            slug: "four-madhabs",
            arabic_text: "وَاخْتِلَافُ أَلْسِنَتِكُمْ وَأَلْوَانِكُمْ ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّلْعَالِمِينَ",
            content:
              "The four Sunni schools of thought (madhahib) are: Hanafi, Maliki, Shafi'i, and Hanbali. They are not four different religions — they are four methodologies for deriving fiqh from the same sources. Each is valid, and Muslims may follow any of them.\\n\\nThe Hanafi school was founded by Imam Abu Hanifah (d. 150 AH). He emphasized qiyas and ra'y (reasoned opinion) because he lived in Kufa, a multicultural city with many new situations not addressed by explicit texts. Today, the Hanafi school is followed by most Muslims in South Asia, Turkey, the Balkans, and parts of the Arab world.\\n\\nThe Maliki school was founded by Imam Malik (d. 179 AH). He emphasized the practice of the people of Madinah (amal ahl al-Madinah) as a source of law, because Madinah was the city of the Prophet and his companions. The Maliki school is predominant in North and West Africa.\\n\\nThe Shafi'i school was founded by Imam al-Shafi'i (d. 204 AH), who systematized usul al-fiqh in his book 'Al-Risalah'. He balanced text (nass) and reason, and emphasized the apparent meaning of hadith. The Shafi'i school is followed in parts of Egypt, Yemen, Southeast Asia (Indonesia, Malaysia), and East Africa.\\n\\nThe Hanbali school was founded by Imam Ahmad (d. 241 AH). He emphasized strict adherence to texts and limited use of qiyas. The Hanbali school is predominant in Saudi Arabia and Qatar, and it is the official school of the Saudi judicial system.\\n\\nDifferences between the schools are not conflicts — they are mercy. The Prophet's companions themselves differed on rulings, and the Prophet accepted their differences. The key is to follow a school with knowledge and respect the other schools. The final lesson will teach a deeper principle: fiqh of priorities.",
            order_index: 2,
          },
          {
            title: "Fiqh of Priorities — What Matters Most",
            title_ar: "فقه الأولويات — ما هو الأهم",
            slug: "fiqh-of-priorities",
            arabic_text: "فَمَن زُحْزِحَ عَنِ النَّارِ وَأُدْخِلَ الْجَنَّةَ فَقَدْ فَازَ ۗ وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ",
            content:
              "Fiqh al-Awlawiyyat (the jurisprudence of priorities) is the principle of understanding what matters most in Islam. Not everything is equally important. Some obligations are more urgent than others. Some sins are worse than others. Knowing the hierarchy of priorities prevents extremism and imbalance.\\n\\nThe obligations ranked: The foundations of faith (aqeedah) take priority over fiqh details. The obligatory (fard) takes priority over the recommended (sunnah). The rights of Allah (like salah) and the rights of people (like paying debts) — scholars say rights of people take priority because they cannot be forgiven without the person's consent.\\n\\nExample: A person has a debt due tomorrow and time to pray. He should pray first (it is an obligation with a fixed time) but if the debt collector will harm him for delay, he should prioritize paying the debt because rights of people take precedence. This is fiqh of priorities in action.\\n\\nAnother principle: repelling harm takes priority over bringing benefit. The Prophet said: 'There should be no harm nor reciprocating harm.' (Ibn Majah). If a new product benefits the economy but harms people's health, preventing harm takes priority.\\n\\nThe greatest priority is your salvation in the Hereafter. Every action should be weighed against this question: Will this bring me closer to Allah? If yes, do it. If no, avoid it. If unsure, learn more.\\n\\nThis course on Usul al-Fiqh has given you the tools to understand how Islamic law works. You have learned: the sources (Quran, Sunnah, Ijma, Qiyas), the secondary principles (Istihsan, Maslahah, 'Urf), how fatwas are made, the four schools of thought, and the fiqh of priorities. Use this knowledge to appreciate the depth of Islamic scholarship and to practice your religion with understanding.\\n\\nThe final subject — Dawah — will show you how to share what you have learned with others. Knowledge is a trust; it must be conveyed.",
            order_index: 3,
          },
        ],
      },
    ],
  },

  // ─── 10. Dawah ──────────────────────────────────────────────────────
  {
    title: "Dawah",
    title_ar: "الدعوة",
    description:
      "Learn the principles and methods of calling to Allah with wisdom, beautiful preaching, and sound argumentation.",
    description_ar:
      "تعلم مبادئ وأساليب الدعوة إلى الله بالحكمة والموعظة الحسنة والمجادلة بالتي هي أحسن.",
    level: "intermediate",
    slug: "dawah",
    order_index: 10,
    sections: [
      {
        title: "Foundations of Dawah",
        title_ar: "أسس الدعوة",
        slug: "foundations-of-dawah",
        order_index: 1,
        lessons: [
          {
            title: "The Obligation of Dawah",
            title_ar: "وجوب الدعوة",
            slug: "obligation-of-dawah",
            arabic_text: "ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ",
            content:
              "Dawah (calling to Allah) is a collective obligation (fard kifayah) upon the Muslim community. If enough people fulfill it, the sin is removed from others. However, every Muslim shares the responsibility according to their capacity.\n\nThe Quran commands: 'Let there be a community among you who call to the good, enjoin what is right, and forbid what is wrong.' (3:104).\n\nThe Prophet said: 'Convey from me, even if it is one verse.' (Bukhari). Dawah is not limited to scholars — every Muslim can invite others to Islam through their character, kindness, and simple explanations. The best dawah is often through example rather than words.",
            order_index: 1,
          },
          {
            title: "The Methodology of Dawah",
            title_ar: "منهج الدعوة",
            slug: "methodology-of-dawah",
            arabic_text: "وَجَادِلْهُم بِالَّتِي هِيَ أَحْسَنُ",
            content:
              "The Quran establishes three methods of dawah: (1) Hikmah (wisdom) — presenting the truth with appropriate timing and understanding, (2) Maw'izah Hasanah (beautiful preaching) — gentle, heartfelt advice that touches the soul, and (3) Jidal bi-llati hiya ahsan (argumentation in the best way) — respectful debate without insults.\n\nKey principles include: starting with the fundamentals of Tawheed, using the Quran and authentic hadith, adapting language to the audience, being patient with questions and rejection, and avoiding extremism in both leniency and harshness.\n\nDawah should be accompanied by good character. People judge Islam by the conduct of Muslims. Harshness, anger, or arrogance in dawah repels people, while gentleness attracts them, as the Prophet's success demonstrates.",
            order_index: 2,
          },
        ],
      },
      {
        title: "Dawah in Practice",
        title_ar: "الدعوة عمليًا",
        slug: "dawah-in-practice",
        order_index: 2,
        lessons: [
          {
            title: "Addressing Common Questions",
            title_ar: "الإجابة عن الأسئلة الشائعة",
            slug: "addressing-common-questions",
            arabic_text: "وَلَا تَسُبُّوا الَّذِينَ يَدْعُونَ مِن دُونِ اللَّهِ",
            content:
              "When doing dawah, expect questions about: the existence of God, the authenticity of the Quran, the role of Prophet Muhammad, women in Islam, jihad, science and religion, and Islam's relationship with other faiths.\n\nThe best approach is: listen genuinely, acknowledge good points, use clear evidence, and connect every answer to Tawheed. Avoid getting defensive or confrontational. The goal is to convey the message clearly, not to win an argument.\n\nUse resources like the Quran's scientific miracles, historical preservation of the Quran, and the Prophet's biography as starting points. Tailor your approach — what resonates with a university student differs from what speaks to a spiritual seeker.",
            order_index: 1,
          },
          {
            title: "Dawah to Muslims and Non-Muslims",
            title_ar: "الدعوة للمسلمين وغير المسلمين",
            slug: "dawah-muslims-non-muslims",
            arabic_text: "رَبَّنَا إِنَّنَا سَمِعْنَا مُنَادِيًا يُنَادِي لِلْإِيمَانِ",
            content:
              "Dawah to non-Muslims focuses on introducing Islam's core message: Tawheed, the purpose of life, and the Hereafter. The approach should be gentle, respectful, and tailored to the individual's background. Many people come to Islam through the character of Muslims they know.\n\nDawah to Muslims (tajdid — revival) involves reminding fellow Muslims of their obligations, encouraging repentance, and helping them strengthen their faith and practice. This includes teaching the Quran, organizing study circles, and promoting good character.\n\nBoth types require sincerity (ikhlas), patience (sabr), and knowledge. The best du'at (callers) embody what they preach. As the poet said: 'The call to Allah is not with raised voices, but with illuminated hearts.'",
            order_index: 2,
          },
        ],
      },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding 10 subjects with sections and lessons...\n");

  // Remove old courses that overlap with the new structured subjects
  const oldSlugs = ["new-muslim-guide", "aqeedah-basics", "arabic-alphabet"];
  for (const slug of oldSlugs) {
    const { error } = await supabase.from("courses").delete().eq("slug", slug);
    if (error) {
      console.log(`  ⚠️  Could not delete "${slug}": ${error.message}`);
    } else {
      console.log(`  🗑️  Deleted old course: ${slug}`);
    }
  }
  console.log("");

  for (const course of courses) {
    const { data: insertedCourse, error: courseErr } = await supabase
      .from("courses")
      .upsert(
        {
          title: course.title,
          title_ar: course.title_ar,
          description: course.description,
          description_ar: course.description_ar,
          level: course.level,
          slug: course.slug,
          is_published: true,
          order_index: course.order_index,
        },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (courseErr) {
      console.error(`  ❌ Error inserting course ${course.title}:`, courseErr);
      continue;
    }

    console.log(`  📘 ${course.title} (${course.title_ar})`);

    for (const section of course.sections) {
      const { data: insertedSection, error: sectionErr } = await supabase
        .from("sections")
        .upsert(
          {
            course_id: insertedCourse.id,
            title: section.title,
            title_ar: section.title_ar,
            slug: section.slug,
            order_index: section.order_index,
          },
          { onConflict: "course_id, slug" }
        )
        .select()
        .single();

      if (sectionErr) {
        console.error(`    ❌ Error inserting section ${section.title}:`, sectionErr);
        continue;
      }

      let lessonCount = 0;
      for (const lesson of section.lessons) {
        const { data: insertedLesson, error: lessonErr } = await supabase
          .from("lessons")
          .upsert(
            {
              section_id: insertedSection.id,
              title: lesson.title,
              title_ar: lesson.title_ar,
              slug: lesson.slug,
              content: lesson.content,
              content_type: (lesson.video_url ? "both" : "text") as "both" | "text",
              video_url: lesson.video_url ?? null,
              arabic_text: lesson.arabic_text,
              is_published: true,
              order_index: lesson.order_index,
            },
            { onConflict: "section_id, slug" }
          )
          .select()
          .single();

        if (lessonErr) {
          console.error(`    ❌ Error inserting lesson "${lesson.title}":`, lessonErr);
          continue;
        }

        if (lesson.questions) {
          const { error: quizErr } = await supabase
            .from("quizzes")
            .upsert(
              { lesson_id: insertedLesson.id, questions: lesson.questions },
              { onConflict: "lesson_id" }
            );
          if (quizErr) {
            console.error(`    ⚠️  Error inserting quiz for "${lesson.title}":`, quizErr);
          }
        }

        lessonCount++;
      }
      console.log(`    📂 ${section.title} (${section.title_ar}) — ${lessonCount} lessons`);
    }
    console.log("");
  }

  console.log("✅ Seed complete! 10 subjects seeded.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
