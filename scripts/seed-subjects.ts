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
            video_url: "https://www.youtube.com/embed/rmo4UblVEKg?si=h7fpO6Da34JNBggt&start=0&end=115.3",
            arabic_text: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ",
            content:
              "Faith in Allah means believing firmly in His existence, Lordship and Divinity, and in His Names and Attributes. Faith in Allah implies four things, whoever believes in them is a true believer.\n\n1 – Belief in the existence of Allah. The existence of Allah is indicated by reason and by man's innate nature. Every man has been created with an innate belief in his Creator without having to first think about it or be taught, and no one deviates from this innate nature except the one who has been exposed to misguiding influences. The Prophet (peace be upon him) said: 'There is no child who is not born in a state of fitrah (the natural inclination of man), but his parents make him a Jew, a Christian or a Magian.' (Bukhari, Muslim). All these created things, past, present and future, must have a Creator Who brought them into existence, because it is not possible for them to have created themselves or to have come into existence by accident.\n\n2 – Belief in the Lordship of Allah (Rububiyyah). That He alone is the Lord, with no partner or helper. The Lord (Rabb) is the One Who has the power of creation, dominion and control. There is no Creator except Allah, no Sovereign except Allah, no controller of affairs except Allah. 'Surely, His is the creation and commandment' (7:54).\n\n3 – Belief in His Divinity (Uluhiyyah). That He is the One True God, with no partner or associate. Allah (God) means the One Who is worshipped out of love and veneration. This is what is meant by La ilaha illa Allah (there is no god but Allah). No one deserves to be worshipped or singled out for worship except Allah. The call of all the Messengers, from the first to the last of them, was the call to say La ilaha illa Allah.\n\n4 – Belief in His Names and Attributes (Asma was-Sifat). Affirming the names and attributes which Allah has affirmed for Himself in His Book and in the Sunnah of His Messenger in a manner that befits Him, without distorting (tahrif), denying (ta'til), inquiring into how (takyeef), or likening to creation (tamthil). 'There is nothing like Him, and He is the All-Hearing, All-Seeing.' (42:11)\n\nSource: islamqa.info/en/answers/34630",
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
            video_url: "https://www.youtube.com/embed/rmo4UblVEKg?si=h7fpO6Da34JNBggt&start=116&end=148.3",
            arabic_text: "الْحَمْدُ لِلَّهِ فَاطِرِ السَّمَاوَاتِ وَالْأَرْضِ جَاعِلِ الْمَلَائِكَةِ رُسُلًا",
            content:
              "The angels form an unseen world; they were created by Allah from light and they obey the commands of Allah: 'Who disobey not, (from executing) the commands they receive from Allah, but do that which they are commanded.' (66:6). Belief in the angels implies four essential things:\n\n1 – Affirming that they exist and that they are part of the creation of Allah, subject to His Lordship and subjugated to Him. They are 'honoured slaves. They speak not until He has spoken, and they act on His command.' (21:26-27). 'And those who are near Him (i.e. the angels) are not too proud to worship Him, nor are they weary (of His worship). They glorify His praises night and day, (and) they never slacken (to do so).' (21:19-20).\n\n2 – Belief in the names of those whose name we know, such as Jibreel, Mikail, Israfil, Malik, Radwan and others – peace be upon them.\n\n3 – Belief in the attributes of those whose attributes we know, as we know the description of Jibreel (peace be upon him) from the sunnah, and that he has six hundred wings which filled the horizon.\n\n4 – Belief in the actions which we know some of them do. Jibreel is entrusted with revelation, Israfil is entrusted with sounding the trumpet-blast (to herald the onset of the Day of Resurrection), Mikail is entrusted with the rain, and Malik is entrusted with Hell.\n\nOne of the most important things that we must believe in is that every person has two angels with him who record his deeds: '(Remember) that the two receivers (recording angels) receive (each human being), one sitting on the right and one on the left (to note his or her actions).' (50:17-18).\n\nSource: islamqa.info/en/answers/9477",
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
            video_url: "https://www.youtube.com/embed/rmo4UblVEKg?si=h7fpO6Da34JNBggt&start=149&end=186.3",
            arabic_text: "نَزَّلَ عَلَيْكَ الْكِتَابَ بِالْحَقِّ مُصَدِّقًا لِّمَا بَيْنَ يَدَيْهِ وَأَنزَلَ التَّوْرَاةَ وَالْإِنجِيلَ",
            content:
              "Belief in the Books of Allah implies four things:\n\n1 – Firm belief that all of them were revealed from Allah, and that Allah spoke them in a real sense. Some were heard from Him from behind a veil, some were conveyed by an angelic messenger to a human messenger, and some were written by Allah's own Hand. 'And to Musa Allah spoke directly.' (4:164).\n\n2 – The Books that Allah has mentioned by name, we must believe in by name. These are the Books which Allah has named in the Quran: the Quran, the Tawrat (Torah), the Injil (Gospel), the Zabur (Psalms), and the Scriptures (Suhuf) of Ibrahim and Musa. Those which Allah has mentioned in general terms, we must believe in them in general terms.\n\n3 – Believing whatever is true of what they say, such as what is said in the Quran, and whatever has not been altered or distorted in the previous Books.\n\n4 – Believing that Allah revealed the Quran as a witness over these Books and to confirm them: 'And We have sent down to you (O Muhammad) the Book (this Quran) in truth, confirming the Scripture that came before it and Muhaymin (trustworthy in highness and a witness) over it (old Scriptures).' (5:48).\n\nThe Quran is the final and most complete revelation, superseding all previous books. It is preserved in its original Arabic and contains guidance for all of humanity until the end of time.\n\nSource: islamqa.info/en/answers/9519",
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
            video_url: "https://www.youtube.com/embed/rmo4UblVEKg?si=h7fpO6Da34JNBggt&start=187&end=220.3",
            arabic_text: "إِنَّا أَوْحَيْنَا إِلَيْكَ كَمَا أَوْحَيْنَا إِلَىٰ نُوحٍ وَالنَّبِيِّينَ مِن بَعْدِهِ",
            content:
              "It is obligatory to believe in all the Prophets and Messengers whom Allah has sent. The Prophets and Messengers were many, and no one knows their number except Allah. Among them are those of whom Allah has told us, and some of whom He has not told us. Allah has mentioned twenty-five in the Quran, and we are obliged to believe in all of them.\n\nAllah chose Messengers and Prophets from among the sons of Adam, and sent them to each nation, and commanded them to call them to worship Allah alone. 'And verily, We have sent among every Ummah (community, nation) a Messenger (proclaiming): Worship Allah (Alone), and avoid Taghut (all false deities besides Allah).' (16:36).\n\nThe difference between a Nabi (Prophet) and a Rasool (Messenger) is that a Rasool is one to whom a new law is revealed, while a Nabi is one who is sent to confirm the law of a previous Messenger. Allah has mentioned twenty-five by name in the Quran, including Nuh, Ibrahim, Musa, Isa, and Muhammad (peace be upon them all). Muhammad is the final prophet, and there is no prophet after him. He was sent to all of mankind.\n\nThe Prophets and Messengers were chosen by Allah to be an example to their nations. They were protected from sin in conveying the message. 'Indeed in the Messenger of Allah (Muhammad) you have a good example to follow for him who hopes for (the Meeting with) Allah and the Last Day.' (33:21). Belief in all the Prophets and Messengers is one of the pillars of Islamic belief, without which the faith of the Muslim cannot be complete.\n\nSource: islamqa.info/en/answers/10468",
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
            video_url: "https://www.youtube.com/embed/rmo4UblVEKg?si=h7fpO6Da34JNBggt&start=220&end=266.3",
            arabic_text: "وَيَوْمَ نُسَيِّرُ الْجِبَالَ وَتَرَى الْأَرْضَ بَارِزَةً وَحَشَرْنَاهُمْ فَلَمْ نُغَادِرْ مِنْهُمْ أَحَدًا",
            content:
              "Belief in the Day of Judgement (Yawm al-Qiyamah) is one of the six pillars of faith. The sequence of events on the Day of Resurrection is as follows:\n\n1 – The people are resurrected and rise from their graves, then go to the land of gathering, where they will stand for a long time, during which they will suffer intense hardship and thirst, and experience extreme fear.\n\n2 – When they have stood for a long time, Allah will bring forth the cistern of the Prophet (blessings and peace of Allah be upon him) to which people will come. The one who died adhering to his Sunnah, without introducing any innovation, will come to the cistern and be given to drink from it.\n\n3 – Then the great intercession will come – the intercession of the Prophet (blessings and peace of Allah be upon him), who will ask Allah to hasten the reckoning for all people.\n\n4 – After that will come the examination of deeds, then the reckoning. Then the records of deeds will fly to the people.\n\n5 – Then after that the balance (Mizan) will be set up, and deeds will be weighed.\n\n6 – Then after the balance, people will be divided into groups and categories, with people of similar calibre being grouped together.\n\n7 – Then Allah will cause darkness to prevail just before people reach Hell. The believers will be given light, and the hypocrites will not be given light and will fall into Hell.\n\n8 – Then the Prophet (blessings and peace of Allah be upon him) will be standing on the Sirat (bridge), asking: 'O Allah, grant safety.' The believers will cross over the Sirat, each one passing in accordance with his deeds.\n\nBelief in the Day of Judgement instills taqwa (God-consciousness) and reminds us that this life is temporary — a test for the eternal life to come.\n\nSource: islamqa.info/en/answers/220511",
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
              "Belief in al-Qadr (the divine will and decree) is one of the pillars of faith. The Prophet (peace and blessings of Allah be upon him) said, when he answered Jibreel's question about faith: '(It means) believing in Allah, His angels, His Books, His Messengers and the Last Day, and to believe in al-Qadr (the divine decree) both good and bad.'\n\nBelief in al-Qadr is based on four things:\n\n1 – Knowledge: That Allah knows what His creation will do, by virtue of His eternal knowledge. 'And with Him are the keys of the Ghayb (all that is hidden), none knows them but He. And He knows whatever there is in the land and in the sea; not a leaf falls, but He knows it.' (6:59)\n\n2 – Writing: That Allah has written the destiny of all creatures in al-Lawh al-Mahfuz (the Preserved Tablet). The Prophet said: 'Allah wrote down the decrees of creation fifty thousand years before He created the heavens and the earth.' (Muslim)\n\n3 – Will: That what Allah wills happens and what He does not will does not happen. There is no movement in the heavens or on earth but it happens by His will.\n\n4 – Creation: That Allah is the Creator of all things, including the actions of His slaves. They do their actions in a real sense, and He is the Creator of them and of their actions.\n\nWhoever believes in these four believes in al-Qadr. The belief of Ahl al-Sunnah wal-Jama'ah is that a person has freedom of will, and hence he will be rewarded or punished. But his will is subject to the will of Allah, and nothing can take place in the universe that is not willed by Allah.\n\nSource: islamqa.info/en/answers/20806",
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
            video_url: "https://www.youtube.com/embed/ASYfRbFuNmU?si=h7fpO6Da34JNBggt&start=0&end=600",
            content:
              "Tawhid ar-Rububiyyah (Oneness of Divine Lordship) means believing in Allah as One and Unique with regard to His actions such as creation, sovereignty, control, giving life and death, and so on. Allah says: 'Surely, His is the creation and the commandment' (7:54).\n\nThere is a great deal of evidence to support this in the Quran and Sunnah. Whoever believes that there is any creator other than Allah or any sovereign controlling this universe and disposing of its affairs other than Allah has denied this aspect of Tawhid and disbelieved in Allah.\n\nThe disbelievers of old accepted this aspect of Tawhid in general terms, although they differed with regard to some of its details. Allah says: 'And if you were to ask them: Who has created the heavens and the earth and subjected the sun and the moon? they will surely reply: Allah.' (29:61).\n\nSo whoever affirms this Tawhid in the true sense must inevitably also affirm the Oneness of Allah's Divinity (Tawhid al-Uluhiyyah).\n\nSource: islamqa.info/en/answers/49030",
            order_index: 1,
          },
          {
            title: "Tawhid al-Uluhiyyah",
            title_ar: "توحيد الألوهية",
            slug: "tawhid-uluhiyyah",
            arabic_text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
            video_url: "https://www.youtube.com/embed/ASYfRbFuNmU?si=h7fpO6Da34JNBggt&start=600&end=1200",
            content:
              "Tawhid al-Uluhiyyah means devoting all acts of worship, both inward and outward, in word and deed, to Allah Alone, and not worshipping anything or anyone other than Allah, no matter who he is. It is called Tawhid al-Uluhiyyah because it is based on ta-alluh lillah, which is worship and devotion to Allah accompanied by love and veneration.\n\nIt is also called Tawhid al-'Ibadah (Oneness of Worship) because it means that a person worships Allah by doing what He has commanded and avoiding that which He has forbidden. Allah says: 'And your Lord has decreed that you worship none but Him' (17:23) and 'Worship Allah and join none with Him in worship' (4:36).\n\nThis is the essence of the Shahada: 'La ilaha illa Allah' — there is no god worthy of worship except Allah. It was the primary message of all prophets. This is the kind of Tawhid concerning which people went astray, which is why the prophets were sent and the Books were revealed. Whoever goes astray with regard to this Tawhid, such as devoting some of his worship to someone other than Allah, has gone beyond the pale of Islam.\n\nSource: islamqa.info/en/answers/49030",
            order_index: 2,
          },
          {
            title: "Tawhid al-Asma was-Sifat",
            title_ar: "توحيد الأسماء والصفات",
            slug: "tawhid-asma-was-sifat",
            arabic_text: "لَيْسَ كَمِثْلِهِ شَيْءٌ ۖ وَهُوَ السَّمِيعُ الْبَصِيرُ",
            video_url: "https://www.youtube.com/embed/ASYfRbFuNmU?si=h7fpO6Da34JNBggt&start=1200&end=0",
            content:
              "Tawhid al-Asma wa'l-Sifat (Oneness of the Divine Names and Attributes) means affirming the names and attributes of Allah and believing that there is none like unto Allah in His names and attributes. This Tawhid is based on two principles:\n\n1 – Affirmation: Affirming that which Allah has affirmed for Himself in His Book or that His Prophet (peace and blessings of Allah be upon him) has affirmed of His beautiful names and sublime attributes in a manner that suits the Majesty and Greatness of Allah, without distorting them, twisting their meanings, denying their reality or discussing how they are.\n\n2 – Denial: Denying that Allah has any faults and denying any shortcomings that He has denied Himself. The evidence for that is the words of Allah: 'There is nothing like Him, and He is the All-Hearer, the All-Seer' (42:11). So He has denied that He bears any resemblance to His creation, and affirmed that He has attributes of perfection in a manner that befits Him.\n\nExamples of Allah's beautiful names include Ar-Rahman (Most Compassionate), Ar-Rahim (Most Merciful), Al-Malik (The Sovereign), Al-Quddus (The Pure), As-Sami' (All-Hearing), Al-Basir (All-Seeing).\n\nSource: islamqa.info/en/answers/49030",
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
              "Ahl al-Sunnah wa'l-Jamaa'ah are those who adhere to the Sunnah and who unite upon it, not turning to anything else, whether that be in matters of belief (aqeedah) or matters of actions which are subject to shar'i rulings. Hence they are called Ahl al-Sunnah because they adhere to it (the Sunnah), and they are called Ahl al-Jamaa'ah because they are united in following it.\n\nThe Prophet (peace be upon him) said: 'My Ummah will split into 73 sects, all in the Fire except one.' They asked: 'Who is that, O Messenger of Allah?' He said: 'Those who follow what I and my companions are upon.' (Tirmidhi)\n\nIf you examine the followers of bid'ah (innovation), you will find that they differ concerning that which they are following, with regard to beliefs, methodology and practices, which indicates that their being far removed from the Sunnah is commensurate with the extent to which they have introduced innovations.\n\nSource: islamqa.info/en/answers/10777",
            order_index: 1,
          },
          {
            title: "Warning Against Innovation (Bid'ah)",
            title_ar: "التحذير من البدعة",
            slug: "warning-against-bidah",
            arabic_text: "وَأَنَّ هَٰذَا صِرَاطِي مُسْتَقِيمًا فَاتَّبِعُوهُ ۖ وَلَا تَتَّبِعُوا السُّبُلَ فَتَفَرَّقَ بِكُمْ عَن سَبِيلِهِ",
            content:
              "Bid'ah (religious innovation) refers to introducing new practices into the religion. The Prophet (blessings and peace of Allah be upon him) said: 'Beware of newly introduced matters, for every newly introduced matter is an innovation, and every innovation is misguidance.' (Abu Dawud) And he said: 'Whoever does an action that is not in accordance with this matter of ours, it will be rejected.' (Muslim)\n\nInnovation (bid'ah) is defined by three characteristics:\n\n1 – Being newly introduced into the religion.\n2 – Being attributed to the religion of Islam (seeking to draw close to Allah by means of something He did not prescribe).\n3 – Having no basis in the religious texts, whether in a specific sense or in general terms.\n\nThis excludes new inventions and newly introduced matters pertaining to worldly life, that have nothing to do with religion. It also excludes sins that have been introduced but were known before.\n\nThe safeguard against bid'ah is to ground all worship and belief in authentic evidence from the revealed sources. Good intentions do not justify innovations, as the religion was perfected during the Prophet's lifetime: 'This day I have perfected for you your religion.' (5:3)\n\nSource: islamqa.info/en/answers/118225",
            order_index: 2,
          },
        ],
      },
      {
        title: "Contemporary Issues in Aqeedah",
        title_ar: "قضايا عقدية معاصرة",
        slug: "contemporary-issues-aqeedah",
        order_index: 4,
        lessons: [
          {
            title: "Magic, Soothsaying, and Fortune-Telling",
            title_ar: "السحر والكهانة والعرافة",
            slug: "magic-soothsaying",
            arabic_text: "وَلَا يُفْلِحُ السَّاحِرُ حَيْثُ أَتَى",
            video_url: "https://www.youtube.com/embed/ASYfRbFuNmU?si=h7fpO6Da34JNBggt&start=1200&end=1500",
            content:
              "Magic (sihr) is real and its effects are real, but Islam forbids it and regards it as major shirk. The Prophet (peace and blessings of Allah be upon him) said: 'Avoid the seven destructive sins.' They asked: 'What are they, O Messenger of Allah?' He said: 'Associating others with Allah (shirk), magic...' (Narrated by al-Bukhari and Muslim). Learning magic and teaching it are forms of disbelief (kufr). Allah says: 'And they [the two angels] taught no one until they had said, Indeed, we are a trial, so do not separate yourself [from Allah by disbelieving in magic]. And they learn from them that by which they cause separation between a man and his wife. But they do not harm anyone through it except by permission of Allah.' (2:102). Soothsaying (kahanah) and fortune-telling are also forbidden. The Prophet said: 'Whoever goes to a fortune-teller and asks him about something, his prayer will not be accepted for forty days.' (Muslim). Believers are commanded to rely on Allah alone and not seek knowledge of the unseen from any source other than revelation.\n\nSource: islamqa.info/en/answers/11189",
            order_index: 1,
          },
          {
            title: "Tawassul (Seeking Intermediation)",
            title_ar: "التوسل",
            slug: "tawassul",
            arabic_text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَابْتَغُوا إِلَيْهِ الْوَسِيلَةَ",
            video_url: "https://www.youtube.com/embed/ASYfRbFuNmU?si=h7fpO6Da34JNBggt&start=1500&end=1800",
            content:
              "Tawassul (seeking wasilah or drawing near to Allah) through righteous deeds is one of the things that are prescribed in sharee'ah. The believer seeks to draw closer to Allah by obeying Him, worshipping Him, and following His commands. The prescribed type of tawassul includes: (1) Tawassul through Allah's names and attributes; (2) Tawassul through one's righteous deeds; (3) Tawassul by asking a living righteous person to make du'aa'. The forbidden type of tawassul includes: (1) Tawassul to Allah by virtue of a particular person, such as saying 'I ask You by virtue of Your Prophet' or 'by virtue of so-and-so' — this was not practiced by the Sahabah and is an innovation; (2) Tawassul that is directed to someone other than Allah, i.e., calling upon the dead or absent saints for help, which is a form of major shirk. The correct position is that the Sahabah did not do tawassul by the Prophet's person after he died. Umar ibn al-Khattab used to pray for rain through al-Abbas, not through the Prophet.\n\nSource: islamqa.info/en/answers/120",
            order_index: 2,
          },
          {
            title: "Love and Hate for Allah's Sake",
            title_ar: "الحب والبغض في الله",
            slug: "love-hate-for-allah",
            arabic_text: "وَالَّذِينَ آمَنُوا أَشَدُّ حُبًّا لِّلَّهِ",
            content:
              "Loving for the sake of Allah and hating for the sake of Allah are among the greatest acts of faith. The Prophet (peace and blessings of Allah be upon him) said: 'Whoever loves for Allah, hates for Allah, gives for Allah, and withholds for Allah has perfected faith.' (Abu Dawud). Loving for Allah means loving the believers and righteous people because of their obedience to Allah. Hating for Allah means hating the disbelievers and sinners because of their disobedience. This does not mean mistreating people; rather it is an internal state of the heart. The Prophet loved the son of his daughter and said: 'O Allah, I love him, so love him.' He also hated the deeds of the hypocrites but treated them according to Islamic rulings. Loving for Allah is the strongest bond of faith. The Prophet said: 'The strongest bond of faith is loving for Allah and hating for Allah.' (Ahmad). The sweetness of faith is not attained until these feelings are firmly rooted in the heart.\n\nSource: islamqa.info/en/answers/39641",
            order_index: 3,
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
            video_url: "https://www.youtube.com/embed/lAbCSbGf6Mo?si=fiqh001&start=0&end=300",
            content:
              "Wudu is the ritual washing performed before prayer. The obligatory parts of wudu are:\n\n1 – Washing the face completely once, which includes rinsing the mouth and nose.\n2 – Washing the arms up to the elbows, once.\n3 – Wiping the entire head, including the ears.\n4 – Washing the feet up to the ankles, once.\n\nThese must be done in order and continuously (one after the other with no lengthy interruption). The evidence is the verse: 'O you who believe! When you intend to offer As-Salah (the prayer), wash your faces and your hands (forearms) up to the elbows, rub (by passing wet hands over) your heads, and (wash) your feet up to the ankles.' (5:6).\n\nThe mustahabb (recommended) parts of wudu include: saying Bismillah, washing the hands three times, rinsing the mouth and nose three times, washing the face three times, washing the arms three times, wiping the head and ears once with fresh water, and washing the feet three times. After completing wudu, it is recommended to say: 'Ashhadu an la ilaha ill-Allah wahdahu la sharika lah, wa ashhadu anna Muhammadan abduhu wa rasuluhu.'\n\nThere is no difference between men and women in the way wudu should be done. The conditions of wudu are: being Muslim, of sound mind, having reached the age of discernment and having the intention of doing wudu.\n\nSource: islamqa.info/en/answers/11497",
            order_index: 1,
          },
          {
            title: "Ghusl (Full Bath)",
            title_ar: "الغسل",
            slug: "ghusl",
            arabic_text: "وَإِن كُنتُمْ جُنُبًا فَاطَّهَّرُوا",
            video_url: "https://www.youtube.com/embed/lAbCSbGf6Mo?si=fiqh001&start=300&end=600",
            content:
              "Ghusl (full body wash) becomes obligatory after: sexual intercourse, ejaculation (wet dream or otherwise), and the end of menstruation and post-childbirth bleeding. Ghusl on Friday is a confirmed Sunnah for attending the congregational prayer.\n\nA brief summary of the requirements for ghusl:\n\n1 – Make the intention for purification.\n2 – Wash the private parts.\n3 – Make wudu like the wudu done for prayer.\n4 – Pour water on the right side, then the left side.\n5 – Pour water on the head, covering the entire body with water.\n\nIt is reported in the Sunnah that the Prophet (peace and blessings of Allah be upon him), when performing ghusl from janabah, used to wash his hands, then wash his private parts with his left hand. After that he performed wudu like that for prayer. Next he took some water and ran his fingers in the roots of his hair until he used three handfuls of water on his head. He would then go on pouring water on the rest of his body and wash his legs. (Muslim)\n\nSource: islamqa.info/en/answers/415",
            order_index: 2,
          },
          {
            title: "Tayammum (Dry Ablution)",
            title_ar: "التيمم",
            slug: "tayammum",
            arabic_text: "فَلَمْ تَجِدُوا مَاءً فَتَيَمَّمُوا صَعِيدًا طَيِّبًا",
            video_url: "https://www.youtube.com/embed/lAbCSbGf6Mo?si=fiqh001&start=600&end=0",
            content:
              "Tayammum is a substitute for wudu or ghusl when water is unavailable or its use would cause harm. The way in which tayammum is done is:\n\n1 – Say Bismillah with the intention of doing tayammum.\n2 – Strike the ground once with the palms of the hands.\n3 – Wipe the back of the right hand with the palm of the left, and the back of the left hand with the palm of the right.\n4 – Wipe the face with both hands.\n5 – Recite the same du'as that are recited after wudu.\n\nThis is based on the hadith of Ammar ibn Yasir (may Allah be pleased with him) in al-Bukhari and Muslim, where the Prophet (peace and blessings of Allah be upon him) said: 'It would have been sufficient for you to do this' — then he struck the palms of his hands on the ground, then dusted them off, then wiped the back of each hand with the other, then he wiped his face with his hands.\n\nConditions for tayammum include: absence of water, illness that would worsen with water, or being on a journey with insufficient water. Tayammum is nullified by the same things that nullify wudu, and by the presence of water (if performing tayammum for lack of water).\n\nSource: islamqa.info/en/answers/21074",
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
            video_url: "https://www.youtube.com/embed/j0xitQtLljg?si=fiqh002&start=0&end=540",
            content:
              "The five daily prayers are an obligation upon every adult Muslim of sound mind. Their times were defined by the Prophet (peace and blessings of Allah be upon him) in the hadith: 'The time for Zhuhr is from when the sun has passed its zenith and a man's shadow is equal in length to his height, until the time for Asr comes. The time for Asr lasts until the sun turns yellow. The time for Maghrib lasts until the twilight has faded. The time for Isha lasts until midnight. The time for Subh (Fajr) prayer lasts from the beginning of the pre-dawn so long as the sun has not yet started to rise.' (Muslim, 612)\n\nIn summary:\n- Fajr: from true dawn (second dawn) until sunrise. (2 rak'ahs)\n- Dhuhr: from when the sun passes its zenith until the shadow of an object is equal to its length. (4 rak'ahs)\n- Asr: from when Dhuhr time ends until sunset (preferred time: until the sun turns yellow). (4 rak'ahs)\n- Maghrib: from sunset until the red afterglow (twilight) fades. (3 rak'ahs)\n- Isha: from when the red afterglow disappears until midnight. (4 rak'ahs)\n\nPrayer is the second pillar of Islam and the first deed for which a person will be held accountable on the Day of Judgment. The Prophet said: 'The covenant between us and them is prayer; whoever abandons it has disbelieved.'\n\nSource: islamqa.info/en/answers/9940",
            order_index: 1,
          },
          {
            title: "Conditions and Pillars of Prayer",
            title_ar: "شروط الصلاة وأركانها",
            slug: "conditions-pillars-prayer",
            arabic_text: "وَقُومُوا لِلَّهِ قَانِتِينَ",
            video_url: "https://www.youtube.com/embed/j0xitQtLljg?si=fiqh002&start=540&end=1080",
            content:
              "The conditions for prayer include: being Muslim, of sound mind, having reached puberty, being in a state of purity, covering the awrah, facing the qiblah, and that the time for prayer has entered.\n\nThere are 14 pillars of prayer (arkaan), which cannot be waived whether one omits them deliberately or by mistake:\n1 – Standing during obligatory prayers (if able)\n2 – The opening takbeer (saying 'Allahu akbar')\n3 – Reciting al-Fatihah\n4 – Rukoo' (bowing)\n5 – Rising from bowing\n6 – Standing up straight\n7 – Sujood (prostration)\n8 – Rising from prostration\n9 – Sitting between the two prostrations\n10 – Being at ease in each of these physical pillars\n11 – The final tashahhud\n12 – Sitting to recite the final tashahhud\n13 – The two salaams\n14 – Doing the pillars in order\n\nThere are 8 obligatory parts of prayer, which are waived if one forgets and can be compensated for by prostration of forgetfulness (sujud as-sahw): takbeers other than the opening takbeer, saying 'Sami'a Allahu liman hamidah', saying 'Rabbana wa laka'l-hamd', saying 'Subhaana rabbiy al-azeem' when bowing, saying 'Subhaana rabbiy al-a'laa' when prostrating, saying 'Rabb ighfir li' between the two prostrations, the first tashahhud, and sitting for the first tashahhud.\n\nSource: islamqa.info/en/answers/65847",
            order_index: 2,
          },
          {
            title: "Jumu'ah (Friday Prayer)",
            title_ar: "صلاة الجمعة",
            slug: "jumuah-prayer",
            arabic_text: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ",
            video_url: "https://www.youtube.com/embed/j0xitQtLljg?si=fiqh002&start=1080&end=0",
            content:
              "Jumu'ah (Friday prayer) is an obligatory congregational prayer that replaces Dhuhr for men. Allah chose Friday to be the best of days before Him, and He singled it out for major events and great qualities. Jumu'ah prayer has a particular virtue and great qualities through the blessing of this great day.\n\nAttending Jumu'ah is obligatory upon every free, adult, resident male Muslim. Women may attend if they wish but are not obligated. The Prophet (blessings and peace of Allah be upon him) said: 'Whoever misses three Jumu'ahs out of heedlessness, Allah will place a seal on his heart.'\n\nJumu'ah consists of a khutbah (sermon) delivered by the imam followed by two rak'ahs of prayer. The khutbah has two parts with a brief sitting between them. It is recommended to perform ghusl on Friday, wear perfume, come early to the mosque, and listen attentively to the khutbah.\n\nThe main reason for venerating Friday prayer is because of the divine decree that singled out this prayer and this day for special virtues. This is one of the manifestations of Allah's Lordship (rububiyyah), as He Alone singles out for veneration whatever He Wills of His creation and whatever times and places He chooses.\n\nSource: islamqa.info/en/answers/165601",
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
            video_url: "https://www.youtube.com/embed/49Bk4WJeG7Q?si=fiqh003&start=0&end=600",
            content:
              "Zakat is the third pillar of Islam. It is an obligatory charity on wealth that has reached the nisab (minimum threshold) and been held for one lunar year. The standard rate is 2.5% (one quarter of one tenth).\n\nIn order for Zakah to be due on money, two conditions must be met:\n1 – It must reach the nisab (minimum threshold). The nisab is the equivalent of 85 grams of gold or 595 grams of silver.\n2 – One lunar year has passed since it reached the nisab.\n\nIf the money is less than the nisab, then no Zakah is due on it. If extra money is earned during the year that stems directly from the original amount (such as profit from investment), then Zakah should be paid on the entire amount at the end of the year. If the extra money comes from a different source (such as inheritance), then a separate year should be counted for it.\n\nZakat is to be given to eight categories specified in the Quran (9:60): the poor, the needy, zakat collectors, those whose hearts are to be reconciled, slaves, debtors, in the path of Allah, and the stranded traveler.\n\nSource: islamqa.info/en/answers/93414",
            order_index: 1,
          },
          {
            title: "Sadaqah (Voluntary Charity)",
            title_ar: "الصدقة التطوعية",
            slug: "sadaqah-voluntary-charity",
            arabic_text: "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ",
            video_url: "https://www.youtube.com/embed/49Bk4WJeG7Q?si=fiqh003&start=600&end=0",
            content:
              "Sadaqah (voluntary charity) is any act of giving done to seek Allah's pleasure. It is not limited to money — even a smile is sadaqah. The Prophet said: 'Every good deed is sadaqah.'\n\nAllah says: 'The likeness of those who spend their wealth in the way of Allah, is as the likeness of a grain (of corn); it grows seven ears, and each ear has a hundred grains. Allah gives manifold increase to whom He wills.' (2:261)\n\nThe Prophet (peace and blessings of Allah be upon him) said: 'Whoever gives charity equal to a date from good (halal) earnings — for Allah does not accept anything but that which is good — Allah will take it in His right hand and tend it for the one who gave it as any one of you tends his foal, until it becomes like a mountain.' (Bukhari, Muslim)\n\nHe also said: 'There is no day on which the people get up but two angels come down and one of them says: O Allah, give in compensation to the one who spends (in charity), and the other says: O Allah, destroy the one who withholds.' (Bukhari, Muslim)\n\nOngoing charity (sadaqah jariyah) includes building a mosque, digging a well, or raising a righteous child. The best sadaqah is that given while healthy and hoping to live, fearing poverty but hoping for reward.\n\nSource: islamqa.info/en/answers/36783",
            order_index: 2,
          },
        ],
      },
      {
        title: "Fasting (Sawm)",
        title_ar: "الصيام",
        slug: "fasting-sawm",
        order_index: 4,
        lessons: [
          {
            title: "The Obligation and Virtues of Fasting",
            title_ar: "فريضة الصيام وفضائله",
            slug: "obligation-virtues-fasting",
            arabic_text: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ",
            content:
              "Fasting (sawm) in Ramadan is the fourth pillar of Islam. Allah says: 'O you who believe! Fasting is prescribed for you as it was prescribed for those before you, that you may become righteous (taqwa).' (2:183). The obligation of fasting Ramadan is proven by the Quran, the Sunnah, and scholarly consensus. The Prophet (peace and blessings of Allah be upon him) said: 'Islam is built on five: testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, establishing prayer, paying zakat, fasting Ramadan, and pilgrimage to the House.' (Bukhari, Muslim). Fasting is an act of worship that is uniquely between the slave and his Lord. The Prophet said, in a hadith qudsi: 'Every deed of the son of Adam is for him except fasting; it is for Me and I shall reward for it.' (Bukhari, Muslim). Fasting develops taqwa (God-consciousness), self-discipline, and empathy for the poor. It is a shield that protects the believer from sin and from the Fire.\n\nSource: islamqa.info/en/answers/93521",
            order_index: 1,
          },
          {
            title: "Rulings of Ramadan",
            title_ar: "أحكام رمضان",
            slug: "rulings-ramadan",
            arabic_text: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ",
            content:
              "Fasting in Ramadan begins at the sighting of the crescent moon. The Prophet said: 'Fast when you see it (the new moon) and break your fast when you see it. If it is cloudy, then complete the month of Shaban as thirty days.' (Bukhari, Muslim). The intention (niyyah) for fasting must be made before Fajr. It is recommended to have suhoor (pre-dawn meal) and to delay it until just before Fajr. The fast is broken at Maghrib with iftar, and it is recommended to break the fast with dates and water before praying Maghrib. The Prophet said: 'My Ummah will continue to be upon goodness as long as they hasten to break the fast.' (Bukhari, Muslim). Things that break the fast include: intentional eating and drinking, intentional vomiting, sexual intercourse, and the onset of menstruation or postpartum bleeding. Things that do NOT break the fast include: eating or drinking out of forgetfulness, unintentional vomiting, and anything that enters the body without intent (such as rinsing the mouth). The one who breaks his fast without a valid excuse must repent and make up the day, and if the break was through intercourse, he must also pay kaffarah (expiation) by freeing a slave or fasting two consecutive months or feeding sixty poor people.\n\nSource: islamqa.info/en/answers/37951",
            order_index: 2,
          },
          {
            title: "Voluntary Fasts",
            title_ar: "الصيام التطوعي",
            slug: "voluntary-fasts",
            arabic_text: "وَصُومُوا تَصِحُّوا",
            content:
              "Voluntary fasting is highly recommended and brings great reward. The best voluntary fasts include: (1) Fasting on Mondays and Thursdays — the Prophet used to fast on these days, and said: 'Deeds are presented (to Allah) on Monday and Thursday, and I like my deeds to be presented while I am fasting.' (Tirmidhi). (2) The three white days (al-ayyam al-beed) — the 13th, 14th, and 15th of each lunar month. The Prophet said: 'Fasting three days of each month is like fasting for a lifetime.' (Bukhari, Muslim). (3) Fasting six days of Shawwal — the Prophet said: 'Whoever fasts Ramadan then follows it with six days of Shawwal, it is as if he fasted for a lifetime.' (Muslim). (4) The day of Arafah (9th of Dhul Hijjah) — fasting it expiates the sins of the previous year and the coming year, for those not performing Hajj. (5) The day of Ashura (10th of Muharram) along with the 9th — expiates the sins of the previous year. (6) Fasting the month of Muharram, which is the best month for voluntary fasting after Ramadan. (7) Fasting as much as possible in Sha'ban — the Prophet used to fast most of Sha'ban. It is forbidden to fast on Eid al-Fitr, Eid al-Adha, and the days of Tashreeq (11th-13th of Dhul Hijjah). It is also disliked to single out Friday for fasting.\n\nSource: islamqa.info/en/answers/36289",
            order_index: 3,
          },
        ],
      },
      {
        title: "Hajj and Umrah",
        title_ar: "الحج والعمرة",
        slug: "hajj-and-umrah",
        order_index: 5,
        lessons: [
          {
            title: "The Obligation and Virtues of Hajj",
            title_ar: "فريضة الحج وفضائله",
            slug: "obligation-hajj",
            arabic_text: "وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا",
            content:
              "Hajj (pilgrimage to Makkah) is the fifth pillar of Islam. Allah says: 'And Hajj (pilgrimage to Makkah) to the House (Kaaba) is a duty that mankind owes to Allah, those who can afford the expenses (for one's conveyance, provision and residence).' (3:97). Hajj is obligatory once in a lifetime upon every free, adult, sane Muslim who is physically and financially able. The virtues of Hajj are immense. The Prophet (peace and blessings of Allah be upon him) said: 'Whoever performs Hajj for the sake of Allah and does not commit any obscenity or transgression will return free of sin as on the day his mother bore him.' (Bukhari, Muslim). He also said: 'An accepted Hajj brings no less a reward than Paradise.' (Bukhari, Muslim). Hajj is the greatest jihad for women, as the Prophet said when asked about jihad for women: 'Their jihad is Hajj.' (Bukhari). The conditions for Hajj being obligatory are: being Muslim, being of sound mind, having reached puberty, being free, and being able to afford it (having sufficient provision and means of transport, security on the journey, and being able to leave dependents with adequate support).\n\nSource: islamqa.info/en/answers/111840",
            order_index: 1,
          },
          {
            title: "The Rituals of Hajj",
            title_ar: "مناسك الحج",
            slug: "rituals-hajj",
            arabic_text: "وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ",
            content:
              "Hajj begins on the 8th of Dhul-Hijjah. The pilgrim enters ihram (state of consecration) from the miqat (appointed station). Ihram for men consists of two white seamless sheets; women may wear any modest clothing that covers the body, avoiding the face veil and gloves. While in ihram, certain things are prohibited: wearing perfume, cutting nails or hair, hunting, engaging in sexual relations, and for men, wearing stitched clothing or covering the head. The rituals of Hajj follow a specific sequence: (1) On the 8th of Dhul-Hijjah (Yawm at-Tarwiyah), pilgrims go to Mina and spend the day. (2) On the 9th (Yawm Arafah), they gather at Arafah from noon until sunset — standing at Arafah is the greatest pillar of Hajj. The Prophet said: 'Hajj is Arafah.' (Tirmidhi). (3) After sunset, they proceed to Muzdalifah, where they combine Maghrib and Isha and spend the night. (4) On the 10th (Yawm an-Nahr), they go to Mina, stone the Jamrat al-Aqabah, sacrifice an animal, shave or trim their hair, and perform tawaf al-ifadah around the Kaaba. (5) On the 11th-13th (Ayyam at-Tashreeq), they stone the three jamarat each day. (6) Before leaving Makkah, they perform tawaf al-wada' (farewell circumambulation). The three obligatory acts of Hajj are: ihram, standing at Arafah, and tawaf al-ifadah.\n\nSource: islamqa.info/en/answers/158553",
            order_index: 2,
          },
          {
            title: "Umrah",
            title_ar: "العمرة",
            slug: "umrah",
            arabic_text: "وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ",
            content:
              "Umrah (lesser pilgrimage) can be performed at any time of the year. It is recommended, and some scholars consider it obligatory at least once. The Prophet performed Umrah four times in his life, all in the month of Dhul-Qa'dah. The rituals of Umrah include: (1) Entering ihram from the miqat; (2) Performing tawaf (circumambulation) around the Kaaba seven times, starting from the Black Stone; (3) Performing sa'y (walking) between Safa and Marwah seven times; (4) Shaving or trimming the hair. The Prophet said: 'Umrah is an expiation for the sins committed between it and the previous Umrah.' (Bukhari, Muslim). Performing Umrah in Ramadan is especially meritorious — the Prophet said: 'Umrah in Ramadan is equivalent to Hajj (in reward).' (Bukhari, Muslim). There is no specified time for Umrah, but the best time is Ramadan. The same prohibitions of ihram apply to Umrah as to Hajj.\n\nSource: islamqa.info/en/answers/105278",
            order_index: 3,
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
            video_url: "https://www.youtube.com/embed/52QILyMug3E?si=tafsir01&start=0&end=600",
            content:
              "Tafsir is the science of explaining the meanings of the Qur'an. The mufassir follows one of two methods.\n\nThe first method is tafsir on the basis of narrated texts (at-tafsir bil-ma'thur). This is of several types:\n\n1. Tafsir of the Qur'an by the Qur'an: Some parts of the Qur'an explain other parts. As Shaykh al-Islam Ibn Taymiyah said: The soundest way is to interpret the Qur'an by the Qur'an, because sometimes it refers to a matter in brief then explains it in detail elsewhere.\n\n2. Tafsir of the Prophet (blessings and peace of Allah be upon him): He came to both convey and explain the Qur'an. Allah says: 'And We have also sent down unto you the reminder, that you may explain clearly to men what is sent down to them' (an-Nahl 16:44). If an explanation has reached us from the Prophet, it is obligatory to adhere to it.\n\n3. Tafsir based on reports from the Sahabah: Their tafsir takes precedence over others, because they witnessed the revelation and knew the circumstances. As Ibn Mas'ood said: One of us would learn ten verses and not move on until he understood their meaning and put them into practice.\n\n4. Tafsir based on reports from the Tabi'een: If no explanation is found in the Qur'an, Sunnah, or words of the Sahabah, the mufassir turns to the Tabi'een, who acquired their knowledge from the Companions.\n\nThe second method is tafsir on the basis of individual understanding and ijtihad (at-tafsir bir-ra'y). This requires extensive knowledge of Arabic language, its styles, and deep insight into the rules of sharee'ah.\n\nTafsir based on individual understanding is blameworthy when: (1) the person is not qualified and explains without knowledge; (2) he follows his whims and desires to support innovation. Said Ibn 'Uthaymeen: The one who interprets the meanings of the Qur'an is testifying that Allah meant such and such. This is a very serious matter, for Allah has forbidden saying about Him that which we do not know.",
            order_index: 1,
          },
          {
            title: "Meccan and Medinan Revelations",
            title_ar: "المكي والمدني",
            slug: "meccan-medinan-revelations",
            arabic_text: "الر ۚ كِتَابٌ أُحْكِمَتْ آيَاتُهُ ثُمَّ فُصِّلَتْ مِن لَّدُنْ حَكِيمٍ خَبِيرٍ",
            video_url: "https://www.youtube.com/embed/52QILyMug3E?si=tafsir01&start=600&end=0",
            content:
              "Scholars have discussed the distinction between Makkan and Madinan revelations. One of the characteristics of Makkan verses is that they are addressed to all of mankind with the call 'O mankind', whereas Madinan verses are addressed to the believers with 'O you who believe'.\n\nThe call 'O mankind' appears in twenty places in the Book. The one who ponders these verses will find that they call all people, believers and disbelievers, righteous and evildoers, to think about that which will benefit them in the Hereafter and to worship Allah alone.\n\nAs for places where 'O mankind' appears in the context of Hajj, the reason is that Hajj was first enjoined with the call of Ibrahim (peace be upon him) to all the people of the earth. As Allah says: 'And proclaim to mankind the Hajj. They will come to you on foot and on every lean camel, they will come from every deep and distant mountain highway' (al-Hajj 22:27).\n\nIbn Katheer said: It was narrated that Ibrahim said: O Lord, how can I call mankind when my voice will not reach them? It was said: Call, and it is for Us to convey. So he stood and said: O mankind, your Lord has established a House, so come on pilgrimage to it. The mountains lowered themselves so that his voice could reach all the corners of the earth, and those who were still in their fathers' loins heard it.\n\nThis characteristic — that Makkan surahs address all mankind while Madinan surahs address the believers — helps in understanding the context and purpose of the revelation.",
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
            video_url: "https://www.youtube.com/embed/wVQ43CCdv-0?si=tafsir02&start=0&end=0",
            content:
              "Surat Al-Fatihah is the greatest surah of the Quran. It is one of the pillars of the prayer; no prayer is valid without it. The Prophet (blessings and peace of Allah be upon him) said: 'There is no prayer for the one who does not recite the Opening of the Book.'\n\nIt is the best surah of the Quran. The Prophet said to Ubayy ibn Ka'b: 'By the One in Whose hand is my soul, nothing like it has been revealed in the Torah or in the Gospel or in the Psalms or in the Furqan. Verily it is the seven oft-repeated verses and the Glorious Quran that I have been given.'\n\nDespite its brevity, Surat Al-Fatihah includes all three types of Tawhid: Tawhid ar-Rububiyyah (divine Lordship), Tawhid al-Uluhiyyah (divinity), and Tawhid al-Asma' was-Sifat (divine names and attributes).\n\nIt refers to well-being for both hearts and bodies. It is a complete healing and beneficial remedy. Ibn Al-Qayyim said: 'The Opening of the Book is the complete healing, the beneficial remedy, the perfect Ruqyah, the key to independence of means and success, that wards off worry, distress, fear and grief.'\n\nSurat Al-Fatihah is a refutation of all followers of falsehood. The straight path refers to the path of the Messenger of Allah and his companions. It contains the most beneficial of supplications, as Ibn Taymiyah said: 'I have thought about the most beneficial of supplications, and it is asking for help to do that which pleases Allah. Then I found it in Al-Fatihah: It is You we worship and You we ask for help.'",
            order_index: 1,
          },
          {
            title: "Surah al-Ikhlas",
            title_ar: "سورة الإخلاص",
            slug: "surah-al-ikhlas",
            arabic_text:
              "قُلْ هُوَ اللَّهُ أَحَدٌ\nاللَّهُ الصَّمَدُ\nلَمْ يَلِدْ وَلَمْ يُولَدْ\nوَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
            content:
              "Surat al-Ikhlas (Qul Huwa Allahu Ahad) is equivalent to one-third of the Quran. Al-Bukhari narrated from Abu Sa'id that a man heard another reciting it repeatedly and thought it was too little, but the Messenger of Allah (peace and blessings of Allah be upon him) said: 'By the One in Whose Hand is my soul, it is equivalent to one-third of the Quran.'\n\nThere is an important distinction between jaza (reward) and ijza (sufficiency). Reciting Qul Huwallahu Ahad brings a reward equivalent to reciting one-third of the Quran, but it does not take the place of reading one-third of the Quran. If a person vows to read one-third of the Quran, it is not sufficient for him to read this surah alone.\n\nThe correct scholarly view is that this surah has this great virtue because the Quran deals with three topics: one-third for rulings, one-third for promises and warnings, and one-third for the Divine names and attributes. This surah combines the names and attributes, as stated by Ibn Surayj and affirmed by Ibn Taymiyah.\n\nIbn Taymiyah said: 'Rewards are of different types, just as wealth is of different types. If a man possesses one type of wealth to the value of one thousand dinars, that does not mean he can do without the other types. Similarly, the people need the commands, prohibitions and stories that are in the Quran, and these cannot be replaced by anything else.'\n\nThus while the reward is immense, the Muslim cannot do without the other two issues — the rulings and the promises and warnings — which are found throughout the rest of the Quran.",
            order_index: 2,
          },
        ],
      },
      {
        title: "Advanced Tafsir Studies",
        title_ar: "دراسات متقدمة في التفسير",
        slug: "advanced-tafsir",
        order_index: 3,
        lessons: [
          {
            title: "Tafsir of Surah al-Kahf",
            title_ar: "تفسير سورة الكهف",
            slug: "surah-al-kahf",
            arabic_text: "الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا",
            video_url: "https://www.youtube.com/embed/52QILyMug3E?si=tafsir01&start=0&end=0",
            content:
              "Surah al-Kahf (The Cave) was revealed in Makkah and contains 110 verses. It is one of the five surahs that begin with 'Alhamdu lillah'. The Prophet (peace and blessings of Allah be upon him) said: 'Whoever recites Surah al-Kahf on Friday, a light will shine for him between the two Fridays.' (al-Hakim). The surah contains four main stories, each teaching a profound lesson: (1) The People of the Cave — illustrating the virtue of faith and patience in the face of persecution; (2) The Owner of the Two Gardens — a warning against pride and attachment to worldly wealth; (3) Musa (AS) and al-Khidr — teaching humility in seeking knowledge and that Allah's wisdom may be hidden from us; (4) Dhul-Qarnayn — showing that power should be used to establish justice. The surah also refutes those who claim Allah has a son, and emphasizes that true success lies in doing righteous deeds and hoping for the mercy of Allah. It is highly recommended to recite this surah every Friday.\n\nSource: islamqa.info/en/answers/10700",
            order_index: 1,
          },
          {
            title: "Tafsir of Surah Yaseen",
            title_ar: "تفسير سورة يس",
            slug: "surah-yaseen",
            arabic_text: "يس وَالْقُرْآنِ الْحَكِيمِ",
            content:
              "Surah Yaseen is known as the 'heart of the Quran'. It was revealed in Makkah and contains 83 verses. The Prophet (peace and blessings of Allah be upon him) said: 'Everything has a heart, and the heart of the Quran is Yaseen. Whoever recites Yaseen, Allah will write for him the reward of reciting the Quran ten times.' (Tirmidhi — classed as weak by some scholars but the meaning is sound). The surah focuses on three core themes: (1) Tawheed — affirming the oneness of Allah and warning against shirk. It presents proofs of Allah's power through creation, including the alternation of day and night, the movement of the sun and moon, and the revival of dead land. (2) Risalah (Prophethood) — the story of the messengers sent to a town and the man who came running from the farthest part of the city to support them. (3) The Hereafter — vivid descriptions of the Resurrection and the accountability of deeds. The surah consoles the Prophet by showing that rejection of messengers is not new. It is recommended to recite Yaseen for the dying and the deceased, following the practice of many early Muslims.\n\nSource: islamqa.info/en/answers/236772",
            order_index: 2,
          },
          {
            title: "The Miraculous Nature of the Quran (I'jaz)",
            title_ar: "إعجاز القرآن",
            slug: "ijaz-al-quran",
            arabic_text: "قُل لَّئِنِ اجْتَمَعَتِ الْإِنسُ وَالْجِنُّ عَلَىٰ أَن يَأْتُوا بِمِثْلِ هَٰذَا الْقُرْآنِ لَا يَأْتُونَ بِمِثْلِهِ",
            content:
              "I'jaz al-Quran (the miraculous nature of the Quran) refers to the Quran's inability to be matched or imitated. Allah challenges humanity to produce anything like it: 'Say: If mankind and the jinn were to gather together to produce the like of this Quran, they could not produce the like thereof, even if they backed up one another.' (17:88). The Quran is miraculous in many ways: (1) Linguistic miracle — the Arabic of the Quran is unmatched in eloquence, beauty, and precision. The Arabs at the time of revelation were masters of poetry and rhetoric, yet they could not produce anything comparable. (2) Legislative miracle — the laws and rulings of the Quran are perfectly suited for all times and places. (3) Scientific miracles — the Quran contains accurate references to natural phenomena that were unknown at the time, such as the expansion of the universe (51:47), the barrier between fresh and salt water (25:53), and the stages of embryonic development (23:12-14). (4) Prophetic miracles — the Quran accurately prophesied future events, such as the victory of the Romans over the Persians (30:2-4). These aspects confirm that the Quran is the word of Allah and not the product of any human being.\n\nSource: islamqa.info/en/answers/75348",
            order_index: 3,
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
            video_url: "https://www.youtube.com/embed/Q-_RSi0B7g4?si=hadith01&start=0&end=1200",
            content:
              "The scholars have various ways of categorizing ahadith, each examining the hadith from a specific angle.\n\nWhen they looked at who the hadith was attributed to, they divided it into: (1) Marfoo' — if the hadith was the words of the Prophet (blessings and peace of Allah be upon him); (2) Mawqoof — if it was the words of a Sahabi; (3) Maqtoo' — if it was the words of a Tabi'i.\n\nWhen they looked at the isnaads (chains of narrators), they divided hadith into: (1) Mutawatir — narrated via many isnaads; (2) Ahad (or ghareeb) — narrated via only one isnaad.\n\nWhen they looked at whether it was to be accepted or rejected, they divided hadith into: (1) Maqbool (accepted) — the highest being Saheeh (sound), which fulfills the highest conditions of acceptability, and Hasan (good), which fulfills the minimum conditions; (2) Mardood (rejected) — which includes Da'eef (weak) and Mawdoo' (fabricated).\n\nWhen at-Tirmidhi says 'hasan ghareeb', it may be that it is ghareeb in this particular isnaad, but the text has corroborating evidence by virtue of which it is classed as hasan, as Ibn Taymiyah explained.",
            order_index: 1,
          },
          {
            title: "The Six Authentic Books",
            title_ar: "الصحاح الستة",
            slug: "six-authentic-books",
            arabic_text: "يَا أَيُّهَا الَّذِينَ آمَنُوا أَطِيعُوا اللَّهَ وَأَطِيعُوا الرَّسُولَ",
            video_url: "https://www.youtube.com/embed/Q-_RSi0B7g4?si=hadith01&start=1200&end=0",
            content:
              "The authors of the Six Books are: Imam al-Bukhari, Imam Muslim, Imam Abu Dawood, Imam al-Tirmidhi, Imam al-Nasa'i, and Imam Ibn Majah.\n\nImam al-Bukhari (194-256 AH) compiled more than 600,000 hadith and selected only the most sound for his al-Jami' al-Saheeh, the most authentic book after the Quran. He spent sixteen years traveling to collect hadith, studying under one thousand scholars.\n\nImam Muslim (204-261 AH) compiled his Saheeh, which is second only to al-Bukhari in status and the strength of its ahadith, spending nearly fifteen years on it.\n\nImam Abu Dawood (202-275 AH) authored al-Sunan, which includes more than 5300 ahadith. He was a leading hadith scholar of his age.\n\nImam al-Tirmidhi (209-279 AH) compiled al-Jami', which is the most comprehensive of the Sunan books and the most useful to the hadith scholar and faqeeh, because he mentions the isnaads and clarifies what is saheeh and what is da'eef.\n\nImam al-Nasa'i (215-300 AH) was one of the leading scholars of hadith. Al-Daraqutni said: 'Abu Abd al-Rahman is the foremost among all scholars of hadith, and he is the best evaluator of narrators of his time.'\n\nImam Ibn Majah (209-273 AH) authored al-Sunan. He traveled to Iraq, Basrah, Kufa, Baghdad, Makkah, Syria, Egypt and al-Ray to write down hadith.\n\nWith regard to the ahadith in these books, the ummah accepts everything in Sahih al-Bukhari and Sahih Muslim as sound. The other four books of Sunan are not free of some da'eef ahadith, which the authors sometimes noted and which later scholars identified through examining the chains of narrators.",
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
            video_url: "https://www.youtube.com/embed/jEH1eokufjU?si=hadith02&start=0&end=260",
            content:
              "Intention (niyyah) is the spirit of deeds through which deeds become valid. The Prophet (peace and blessings of Allah be upon him) said: 'Actions are but by intentions and each person will have but that which he intended.' Narrated by al-Bukhari and Muslim.\n\nIntentions are of two types. The first is obligatory intention, without which an act of worship is not valid, such as the intention in wudu, prayer, zakat, fasting and Hajj. It is not prescribed to say out loud 'I intend to pray Zuhr' etc.; the place of intention is the heart.\n\nThe second type is mustahabb intention, which turns permissible deeds into acts of worship, such as eating, drinking and sleeping with the intention of strengthening oneself to do acts of worship. The Prophet said: 'You will never spend anything that you spend for the sake of Allah, but you will be rewarded for it, even the morsel of food that you put in your wife's mouth.' Narrated by al-Bukhari.\n\nMu'adh (may Allah be pleased with him) said: 'I sleep and I get up (to pray at night), and I seek reward for my sleep as I seek reward for my getting up.' He sought reward for resting just as he sought reward for striving, because if the intention in resting is to enable one to do acts of worship, one attains reward.\n\nWhat helps to keep this intention in mind is deliberating and taking stock of oneself before acting, until it becomes a habit, so that most of one's time becomes worship.",
            order_index: 1,
          },
          {
            title: "Mercy and Compassion",
            title_ar: "الرحمة",
            slug: "mercy-and-compassion",
            arabic_text: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ",
            video_url: "https://www.youtube.com/embed/jEH1eokufjU?si=hadith02&start=260&end=520",
            content:
              "The mercy of Allah is of two types. The first type is an attribute of the Essence of Allah, may He be exalted. This is not created and it is infinite, for He is the Most Gracious (ar-Rahman), the Most Merciful (ar-Rahim). Allah says: 'And your Lord is the Forgiving, full of mercy' (al-Kahf 18:58).\n\nThe second type is created mercy, which is composed of one hundred parts. Abu Hurayrah reported that the Messenger of Allah (blessings and peace of Allah be upon him) said: 'Indeed Allah created mercy, on the day He created it, in one hundred parts. Then He kept ninety-nine parts of it with Him and sent one part for all of His creation. If the disbeliever knew of all that there is with Allah of mercy, he would never despair of Paradise, and if the believer knew of all that there is with Allah of punishment, he would never feel safe from the Fire.' Narrated by al-Bukhari.\n\nMuslim narrated it as: 'Indeed, Allah has one hundred parts of mercy, of which He sent one part to be shared between the jinn, humankind, the animals and the vermin. By virtue of it they show compassion to one another and show mercy to one another, and by virtue of it the wild animal shows compassion to its offspring. And Allah has kept behind ninety-nine parts of mercy, by which He will show mercy to His slaves on the Day of Resurrection.'\n\nThe disbelievers receive mercy in this world — Allah gives them good health, wealth and children, and sent Messengers and Books to them. But in the Hereafter, He will deal with them according to His justice.",
            order_index: 2,
          },
          {
            title: "The Hadith of Jibril",
            title_ar: "حديث جبريل",
            slug: "hadith-of-jibril",
            arabic_text: "فَإِنَّهُ جِبْرِيلُ أَتَاكُمْ يُعَلِّمُكُمْ دِينَكُمْ",
            video_url: "https://www.youtube.com/embed/jEH1eokufjU?si=hadith02&start=520&end=0",
            content:
              "There are three degrees of Islam: Islam, iman and ihsan. This is established by the famous hadith of Jibril narrated by Muslim from Umar ibn al-Khattab.\n\nThe first degree is Islam. When used on its own, it refers to the religion as a whole. When used in conjunction with iman, it refers to outward deeds and words. The Prophet said: 'Islam is to testify that there is none worthy of worship except Allah and that Muhammad is the Messenger of Allah, to establish regular prayer, to pay zakah, to fast Ramadan and to go on pilgrimage to the House if you are able to.'\n\nThe second degree is iman (faith). When used on its own, it refers to the whole religion. The Salaf were agreed that iman means affirming in the heart, saying with the tongue, and acting with one's physical faculties; it increases by obedience and decreases by sin. When used with Islam, it refers to inward beliefs. The Prophet said: 'It means believing in Allah, His angels, His Books, His Messengers, and the Last Day, and believing in al-qadar, both good and bad.'\n\nThe third degree is ihsan (excellence). The Prophet said: 'It means worshipping Allah as if you can see Him, and although you cannot see Him, He can see you.' This is the highest degree. Ihsan is of two categories: the higher is worshipping Allah as if you see Him, with awareness of His nearness; the second is sincerity and awareness that Allah is always watching.\n\nJibril came to teach the people their religion, encompassing all three degrees in one conversation.",
            order_index: 3,
          },
        ],
      },
      {
        title: "Further Studies in Hadith",
        title_ar: "دراسات متقدمة في الحديث",
        slug: "advanced-hadith",
        order_index: 3,
        lessons: [
          {
            title: "The Muwatta of Imam Malik",
            title_ar: "موطأ الإمام مالك",
            slug: "muwatta-imam-malik",
            arabic_text: "وَإِنَّهُ لَكِتَابٌ عَزِيزٌ",
            content:
              "The Muwatta of Imam Malik ibn Anas (93-179 AH) is one of the earliest and most important collections of hadith and fiqh. Imam Malik compiled it over forty years, reviewing it with thousands of scholars each year. It contains approximately 1,720 hadith, arranged by chapters of fiqh. What makes the Muwatta unique is that it combines hadith with the practice (amal) of the people of Madinah, which Imam Malik considered a source of legal authority. The Prophet said: 'There will be a time when people will beat the flanks of their camels (i.e., travel far) in search of knowledge, and they will find no scholar more knowledgeable than the scholar of Madinah.' (Tirmidhi). Many scholars interpreted this as referring to Imam Malik. Al-Shafi'i said: 'There is no book on earth more authentic than the Muwatta after the Book of Allah.' The Muwatta includes hadith from the Prophet, fatwas of the Sahabah, and the rulings of the Tabi'een, making it an essential source for understanding the development of Islamic law. Imam Ahmad ibn Hanbal authenticated the Muwatta and relied on it extensively.\n\nSource: islamqa.info/en/answers/63998",
            order_index: 1,
          },
          {
            title: "The Musnad of Imam Ahmad",
            title_ar: "مسند الإمام أحمد",
            slug: "musnad-imam-ahmad",
            arabic_text: "وَإِنَّهُ لَذِكْرٌ لَّكَ وَلِقَوْمِكَ",
            content:
              "The Musnad of Imam Ahmad ibn Hanbal (164-241 AH) is the largest collection of hadith among the early works, containing approximately 27,000 hadith (around 40,000 including repeats). Unlike other collections that arrange hadith by topic, the Musnad is organized by narrator — all the hadith narrated by Abu Bakr are together, followed by those of Umar, Uthman, Ali, and so on. Imam Ahmad selected these hadith from a vast pool of over 750,000. He said to his son Abdullah: 'I compiled this Musnad from over 750,000 hadith. If the Muslims disagree about a matter of the Sunnah, let them refer to the Musnad; if they find it there, it is evidence.' Imam Ahmad was known for his strictness in accepting narrators — he would not accept hadith from anyone who engaged in bid'ah (innovation). The Musnad contains many authentic hadith not found in the Six Books. However, it also contains some weak hadith, which scholars have identified. It remains a primary source for hadith study and is especially valuable for finding multiple chains of narration for the same hadith.\n\nSource: islamqa.info/en/answers/115328",
            order_index: 2,
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
            video_url: "https://www.youtube.com/embed/VOUp3ZZ9t3A?si=seerah01&start=0&end=600",
            content:
              "The Prophet (peace and blessings of Allah be upon him) was born in Makkah in the Year of the Elephant. The scholars differed as to the exact date of his birth. The most well-known view is that he was born on the 12th of Rabee' al-Awwal. Some said he was born on the 8th or 9th of that month, or on the 2nd. His father Abdullah ibn Abdul-Muttalib died before he was born, when he was approximately four months old in his mother's womb, according to the majority of scholars. Others said that his father died when he was twenty-eight months old, but the first view is more correct.\n\nAfter his birth, he was nursed by Thuwaybah, the freed slave of Abu Lahab, for several days. Then Halimah al-Sa'diyyah (may Allah be pleased with her) nursed him. When he was about two years old, Halimah brought him back to his mother.\n\nHis mother Aminah bint Wahb died when he was six years old, as he was travelling with her to Madinah to visit his maternal uncles. After that, his grandfather Abdul-Muttalib took care of him, but he died when the Prophet was eight years old. Then his uncle Abu Talib took custody of him.\n\nThe Prophet (peace and blessings of Allah be upon him) worked as a shepherd, as he himself said: 'There was no prophet who was not a shepherd.' He also went to Syria for trade with his uncle Abu Talib when he was twelve years old. The monk Bahira saw signs of prophethood in him.\n\nHe was known among his people as Al-Amin (the trustworthy) and As-Sadiq (the truthful). When the Quraysh rebuilt the Kaaba and disputed over who would place the Black Stone, they agreed to accept the judgment of whoever entered first. The Prophet entered first, and he placed the stone on a cloth and had each tribal chief hold a corner, then he placed it in position himself.\n\nHe married Khadijah bint Khuwaylid (may Allah be pleased with her) when he was twenty-five and she was forty. She was a wealthy businesswoman and she proposed to him after seeing his honesty in trade. She bore him all his children except Ibrahim. She was his greatest supporter and the first to believe in his message.\n\nSource: islamqa.info/en/answers/147601",
            order_index: 1,
          },
          {
            title: "The First Revelation",
            title_ar: "الوحي الأول",
            slug: "first-revelation",
            arabic_text: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
            video_url: "https://www.youtube.com/embed/VOUp3ZZ9t3A?si=seerah01&start=600&end=0",
            content:
              "The beginning of the Revelation that came to the Messenger of Allah (peace and blessings of Allah be upon him) was good dreams; he never saw a dream but it came true like bright daylight. Then seclusion was made dear to him, and he used to go to the cave of Hira' and worship there, devoting himself to worship for a number of nights before coming back to his family.\n\nThen the truth came to him suddenly while he was in the cave of Hira'. The angel came and said, 'Read!' The Messenger of Allah said, 'I am not a reader.' The angel took hold of him and squeezed him until he could not bear it any more, then released him and said, 'Read!' He said, 'I am not a reader.' The angel took hold of him and squeezed him a second time until he could not bear it any more, then released him and said, 'Read!' He said, 'I am not a reader.' The angel took hold of him and squeezed him a third time until he could not bear it any more, then released him and said: 'Read! In the Name of your Lord Who has created. He has created man from a clot. Read! And your Lord is the Most Generous, Who has taught by the pen. He has taught man that which he knew not.' (96:1-5)\n\nThen the Messenger of Allah went back with his heart beating wildly, until he came to Khadijah (may Allah be pleased with her) and said, 'Cover me! Cover me!' They covered him till his fear went away. Then he said to Khadijah, 'O Khadijah, I fear for myself,' and he told her what had happened. Khadijah said, 'Nay, be of good cheer, for by Allah, Allah will never disgrace you. You uphold the ties of kinship, speak truthfully, help the poor and destitute, serve your guests generously and assist those who are stricken by calamity.'\n\nThen Khadijah took him to Waraqah ibn Nawfal, who was a Christian scholar. He was an old man who had become blind. When the Prophet told him what he had seen, Waraqah said: 'This is the Namus (Jibril) who came down to Musa. Would that I were young and could live until the time when your people will drive you out.' The Messenger of Allah said, 'Will they really drive me out?' Waraqah said, 'Yes. Never has there come a man with that which you have brought, but he was persecuted.'\n\nThen the revelation ceased for a while (fatra), after which it resumed with the revelation of Surah al-Muddaththir: 'O you enveloped in garments! Arise and warn! And magnify your Lord! And purify your garments! And keep away from the idols!' (74:1-5)\n\nSource: islamqa.info/en/answers/13488",
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
            video_url: "https://www.youtube.com/embed/hN7M7lmvbNk?si=seerah02&start=0&end=750",
            content:
              "The Prophet (peace and blessings of Allah be upon him) called people to Islam secretly at first, because Makkah was a centre of idolatry and the people were deeply attached to the religion of their forefathers. The first to respond were Khadijah bint Khuwaylid, his wife; Zayd ibn Harithah, his freed slave; Ali ibn Abi Talib, his cousin who was living with him; and Abu Bakr al-Siddiq, his close friend. Through Abu Bakr, many prominent Companions embraced Islam, including Uthman ibn Affan, al-Zubayr ibn al-Awwam, Abd al-Rahman ibn Awf, Sa'd ibn Abi Waqqas, and Talhah ibn Ubaydillah. They used to meet secretly with the Prophet to learn the Quran and worship.\n\nAfter three years, Allah commanded the Prophet to make the call open. The first verse commanding this was: 'And warn your nearest kinsfolk' (26:214). The Prophet ascended Mount Safa and called out, 'O Bani Fihr, O Bani Adiyy' until the Quraysh gathered. He said: 'Tell me, if I were to inform you that there is an army by the valley which intends to attack you, would you believe me?' They said: 'Yes, we have only experienced truthfulness from you.' He said: 'Indeed, I am most definitely warning you of a severe punishment ahead!' Abu Lahab then said: 'May destruction come to you! Have you merely gathered us for this?' Then Surah al-Lahab was revealed.\n\nThereafter, the Prophet (peace and blessings of Allah be upon him) went to the marketplaces of 'Ukaaz, Mijannah and Dhu'l-Majaz during the Hajj seasons, calling people to Islam, saying: 'O people, say La ilaha illa Allah and you will prosper.' He attended the gatherings of the Arabs in their camps, calling them to Tawheed.\n\nWhen the Quraysh saw that he was openly denouncing their idols, their opposition intensified. They persecuted the weak Muslims severely. Bilal was tortured under the desert sun with a heavy rock on his chest, yet he continued to say 'Ahad, Ahad' (Allah is One). Sumayyah bint Khabbab and her husband Yasir were martyred, being the first martyrs in Islam. Khabbab ibn al-Aratt said: 'We complained to the Prophet while he was sitting in the shade of the Ka'bah, leaning over his Burd, and we said to him: Would you seek help for us? Would you pray to Allah for us?'\n\nThe Quraysh imposed a complete social and economic boycott on Banu Hashim and Banu al-Muttalib, forcing them to live in the mountain pass of Abu Talib for three years. No food or drink was sold to them except secretly. The boycott finally ended when it was revealed that the document had been eaten by termites, except for the name of Allah.\n\nSource: islamqa.info/en/answers/34958",
            order_index: 1,
          },
          {
            title: "The Year of Grief and the Isra wal-Mi'raj",
            title_ar: "عام الحزن والإسراء والمعراج",
            slug: "year-of-grief-isra-miraj",
            arabic_text: "سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا",
            video_url: "https://www.youtube.com/embed/hN7M7lmvbNk?si=seerah02&start=750&end=0",
            content:
              "After the death of Abu Talib, the polytheists of Quraysh intensified their persecution of the Prophet (peace and blessings of Allah be upon him). An insolent man sprinkled sand on his head. When he arrived home, his daughter washed the sand away while he said: 'Do not weep, my daughter. Allah will verily protect your father.'\n\nIn this context, Allah honored His Prophet with the Isra wal-Mi'raj. Allah says: 'Exalted is He Who took His Servant by night from al-Masjid al-Haram to al-Masjid al-Aqsa, whose surroundings We have blessed, to show him of Our signs. Indeed, He is the Hearing, the Seeing' (17:1). The Prophet was taken from Makkah to Jerusalem, and from there he ascended to the heavens.\n\nAnas ibn Malik narrated that the Messenger of Allah said: 'I was brought al-Buraq, a white, long mount larger than a donkey but smaller than a mule, who would place its hoof at the farthest point within its sight. I mounted it until I reached Bayt al-Maqdis. I tethered it to the ring where the prophets tether their mounts. Then I entered the mosque and prayed two rak'ahs in it. When I came out, Jibril brought me a vessel of wine and a vessel of milk. I chose the milk, and Jibril said: You have chosen the fitrah.'\n\nThen they ascended to the first heaven where Adam welcomed him. To the second heaven where Isa and Yahya welcomed him. To the third heaven where Yusuf was. To the fourth heaven where Idris was. To the fifth heaven where Harun was. To the sixth heaven where Musa was. To the seventh heaven where Ibrahim was, reclining against al-Bayt al-Ma'mur. Then he was taken to Sidrat al-Muntaha.\n\nThere Allah made fifty prayers obligatory every day and night. As he descended, Musa advised him: 'Return to your Lord and ask Him for reduction, for your Ummah cannot bear this.' The Prophet went back and forth between his Lord and Musa until Allah reduced it to five prayers, each counted as ten, making fifty in reward.\n\nAllah revealed to him what He revealed and made five prayers obligatory. When the Quraysh disbelieved him about the Night Journey, Allah displayed Bayt al-Maqdis before him so he could describe its details to them.\n\nSource: islamqa.info/en/answers/256196",
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
            video_url: "https://www.youtube.com/embed/JbcAj754-mo?si=seerah03&start=0&end=750",
            content:
              "When the persecution of the people of Makkah against the Muslims grew intense, Allah commanded them to migrate so that they could establish the religion of Allah in a land where they could worship Him. The Prophet saw in a dream that he was migrating to a land of date-palm trees, which turned out to be Madinah.\n\nThe first Companions to migrate were Mus'ab ibn Umayr and Ibn Umm Maktum, who started teaching the Quran. Then Ammar, Bilal, and Sa'd came, then Umar ibn al-Khattab with twenty others.\n\nWhen the Prophet was given permission to migrate, he went to Abu Bakr's house at noon and said: 'I have been given permission to migrate.' Abu Bakr said: 'Shall I accompany you? May my father be sacrificed for you, O Messenger of Allah!' The Prophet said: 'Yes.'\n\nThey reached the Cave of Thawr and stayed there for three nights. Abdullah ibn Abi Bakr stayed with them overnight and would leave before dawn to listen to the plots of Quraysh. Amir ibn Fuhayrah brought them milk at night. They hired a guide from Bani al-Dayl, who was of the religion of the disbelievers, but they trusted him.\n\nSuraqah ibn Ju'sham pursued them for the reward offered by Quraysh. When he approached, his horse's forelegs sank into the ground. He realized the Prophet was protected and asked for a guarantee of security, which the Prophet wrote for him.\n\nThe Prophet said to Abu Bakr in the cave: 'What do you think, O Abu Bakr, of two people of whom Allah is the third?'\n\nWhen they reached Madinah, the Muslims were overjoyed. The girls and boys were saying: 'This is the Messenger of Allah, he has come!' The Prophet stayed with Bani Amr ibn Awf for ten nights and established the Mosque of Quba. Then he rode his she-camel until it knelt at the place where the Prophet's Mosque was later built. He bought the land from two orphan boys and built the mosque, carrying bricks himself saying: 'This load is better than the load of Khaybar, for it is more pious in the Sight of Allah.'\n\nThe Hijrah marks the beginning of the Islamic calendar and the establishment of the first Islamic state.\n\nSource: islamqa.info/en/answers/10063",
            order_index: 1,
          },
          {
            title: "Key Battles and Treaties",
            title_ar: "الغزوات والصلح",
            slug: "key-battles-treaties",
            arabic_text: "وَلِلَّهِ الْعِزَّةُ وَلِرَسُولِهِ وَلِلْمُؤْمِنِينَ",
            video_url: "https://www.youtube.com/embed/JbcAj754-mo?si=seerah03&start=750&end=0",
            content:
              "The scholars differentiated between a military campaign (ghazwah) on which the Prophet went out himself, and an expedition (sariyyah) which he sent but did not go out on. The number of campaigns and expeditions is approximately one hundred or more. The campaigns in which he himself fought were nine.\n\nIbn Ishaq listed the campaigns as follows: Waddan (al-Abwa'), Buwat, al-Ushayrah, the first Badr, the great Battle of Badr, Banu Sulaym, pursuit of Abu Sufyan, Ghatafan (Dhu Amr), Najran, the Battle of Uhud, Hamra al-Asad, Banu al-Nadir, Dhat al-Riqa', the final Badr (al-Sawiq), Dumat al-Jandal, al-Khandaq (the Trench), Banu Qurayzah, Banu Lihyan, Dhu Qarad, Banu al-Mustaliq, al-Hudaybiyyah, Khaybar, the Conquest of Makkah, Hunayn, al-Ta'if, and Tabuk.\n\nHe fought in nine of these: Badr, Uhud, al-Khandaq, Banu Qurayzah, Banu al-Mustaliq, Khaybar, the Conquest of Makkah, Hunayn, and al-Ta'if.\n\nThe Battle of Badr in 2 AH was a decisive victory where 313 Muslims defeated a much larger Quraysh force, establishing the strength of the Muslim state. At Uhud in 3 AH, the Muslims suffered losses when the archers disobeyed the Prophet's order to hold their position. The Battle of al-Khandaq in 5 AH saw the Muslims dig a trench around Madinah, a strategy suggested by Salman al-Farsi.\n\nThe Treaty of Hudaybiyyah in 6 AH, though initially seeming unfavorable, was a great victory as Allah described it (48:1), leading to the conquest of Khaybar and later the peaceful Conquest of Makkah in 8 AH, where the Prophet entered the Kaaba and destroyed the idols.\n\nSource: islamqa.info/en/answers/305386",
            order_index: 2,
          },
        ],
      },
      {
        title: "The Prophet's Life and Legacy",
        title_ar: "حياة النبي صلى الله عليه وسلم وإرثه",
        slug: "prophets-life-legacy",
        order_index: 4,
        lessons: [
          {
            title: "The Character and Manners of the Prophet",
            title_ar: "خلق النبي صلى الله عليه وسلم",
            slug: "character-of-prophet",
            arabic_text: "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ",
            video_url: "https://www.youtube.com/embed/JbcAj754-mo?si=seerah03&start=0&end=0",
            content:
              "Allah described His Prophet (peace and blessings of Allah be upon him) as being of immense moral character. Anas (may Allah be pleased with him) said: 'The Messenger of Allah was the best of people in character.' (Bukhari, Muslim). His character was the Quran itself — Aishah said when asked about his character: 'His character was the Quran.' (Muslim). He was the most truthful and trustworthy of people. The people of Makkah called him Al-Amin (the trustworthy) even before his prophethood. He was the most humble — he would sit with the poor, eat with the needy, and serve his family. He never struck a servant or a woman. He was the most generous — Ibn Abbas said: 'The Messenger of Allah was the most generous of people, and he was most generous in Ramadan.' (Bukhari, Muslim). He was the most courageous — Ali said: 'When the fighting grew fierce, we would seek protection behind the Messenger of Allah.' (Ahmad). He was the most merciful — he would weep when seeing others suffer, and he forbade harming any living creature. His mercy extended even to his enemies. He said: 'I was sent to perfect good character.' (Bukhari).\n\nSource: islamqa.info/en/answers/102440",
            order_index: 1,
          },
          {
            title: "His Family Life",
            title_ar: "حياته الأسرية",
            slug: "family-life-prophet",
            arabic_text: "لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ",
            content:
              "The Prophet (peace and blessings of Allah be upon him) was an exemplary husband and father. He married Khadijah bint Khuwaylid at age 25 and remained monogamous to her until her death. After her death, he married several wives for various reasons: to strengthen tribal bonds, to provide for widows, and to teach the Ummah through them — the Mothers of the Believers. His treatment of his wives was gentle and kind. He would help with household chores, mend his own clothes, and milk his own goat. He said: 'The best of you are those who are best to their families, and I am the best of you to my family.' (Tirmidhi). He never raised his hand against any of his wives or servants. He would listen to them, consult them, and even receive advice from them — as when Umm Salamah advised him during the Treaty of Hudaybiyyah. He was a loving father to his children — all seven of whom were from Khadijah except Ibrahim who was from Mariyah. His daughters Zaynab, Ruqayyah, Umm Kulthum, and Fatimah were all believers who supported him. His sons — al-Qasim, Abdullah, and Ibrahim — all died in infancy. He would carry his grandchildren and let them climb on his back during prayer. His love for his daughter Fatimah was such that he would stand for her when she entered and seat her in his place.\n\nSource: islamqa.info/en/answers/10078",
            order_index: 2,
          },
          {
            title: "His Final Days and Death",
            title_ar: "أيامه الأخيرة ووفاته",
            slug: "final-days-prophet",
            arabic_text: "إِنَّكَ مَيِّتٌ وَإِنَّهُم مَّيِّتُونَ",
            content:
              "In the tenth year after the Hijrah (632 CE), the Prophet (peace and blessings of Allah be upon him) began to show signs of illness. He had been feeling unwell after returning from the Farewell Pilgrimage, during which he gave his final sermon, saying: 'O people, I have left among you that which if you hold fast to, you will never go astray: the Book of Allah and my Sunnah.' The illness began as a severe headache. He sought treatment from his wives and stayed in the apartment of Aishah. Despite his severe pain, he continued to lead the prayer until he could no longer stand, at which point he appointed Abu Bakr to lead the prayer. He would ask: 'Where am I tomorrow? Where am I tomorrow?' hoping to spend his last day with Aishah. His wives agreed that he could stay with her. In his final moments, Aishah held him and heard him say: 'Rather, the Exalted Companion in Paradise.' (Bukhari). He then raised his finger and said: 'O Allah, the Exalted Companion' three times, and his hand fell. He passed away on Monday, the 12th of Rabee' al-Awwal, 11 AH (632 CE). The Sahabah were devastated — Umar refused to believe it, while Abu Bakr addressed the people from the mosque, saying: 'Whoever worshipped Muhammad, let him know that Muhammad is dead. But whoever worshipped Allah, let him know that Allah is alive and never dies.' He was buried in the apartment of Aishah, where the Prophet's Mosque in Madinah now houses his grave.\n\nSource: islamqa.info/en/answers/10010",
            order_index: 3,
          },
        ],
      },
    ],
  },



  // ─── 6. Islamic History ──────────────────────────────────────────────
  {
    title: "Islamic History",
    title_ar: "التاريخ الإسلامي",
    description:
      "Explore the history of Islamic civilization: the Rightly Guided Caliphs, the virtue of knowledge, and the Ottoman Caliphate.",
    description_ar:
      "استكشف تاريخ الحضارة الإسلامية: الخلفاء الراشدون وفضل العلم والخلافة العثمانية.",
    level: "intermediate",
    slug: "islamic-history",
    order_index: 6,
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
            video_url: "https://www.youtube.com/embed/gnuNhA09khk?si=history01&start=0&end=600",
            content:
              'The imam (ruler) or caliph was appointed to lead the Islamic state by one of three methods: being chosen and elected by the decision makers (ahl al-hall wa\'l-\'aqd), being appointed by the previous caliph, or seizing power by force.\n\nAbu Bakr al-Siddeeq (may Allah be pleased with him) became caliph when he was elected by the decision makers, then the Sahabah unanimously agreed with that and swore allegiance to him, and accepted him as caliph. He was the first adult male to embrace Islam and the closest companion of the Prophet (peace and blessings of Allah be upon him).\n\nThere is no difference of opinion among Ahl as-Sunnah wal-Jama\'ah that the best of the ummah after its Prophet is Abu Bakr, then \'Umar (may Allah be pleased with them both). Al-Bukhari (3671) narrated that Muhammad ibn al-Hanafiyyah said: I said to my father \u2014 meaning \'Ali (may Allah be pleased with him) \u2014: Which of the people is best after the Messenger of Allah? He said: Abu Bakr. I said: Then who? He said: Then \'Umar.\n\nIbn Taymiyah (may Allah have mercy on him) said: "The scholars are agreed that Abu Bakr and \'Umar were more knowledgeable than the rest of the Sahabah, greater in terms of obedience to Allah and His Messenger than the others, and more qualified to recognize the truth and follow it than them." (Majmu\' al-Fatawa, 35/124)\n\nAn-Nawawi (may Allah have mercy on him) said: "Ahl as-Sunnah are unanimously agreed that the best of them was Abu Bakr, then \'Umar." (Sharh an-Nawawi \'ala Muslim, 15/148)\n\nReference: Islam Q&A, Answer 111836, Answer 211865, Answer 240154',
            order_index: 1,
          },
          {
            title: "Umar ibn al-Khattab (RA)",
            title_ar: "عمر بن الخطاب رضي الله عنه",
            slug: "umar-ibn-al-khattab",
            arabic_text: "اللَّهُمَّ أَعِزَّ الْإِسْلَامَ بِعُمَرَ",
            video_url: "https://www.youtube.com/embed/gnuNhA09khk?si=history01&start=600&end=1200",
            content:
              'Umar ibn al-Khattab (may Allah be pleased with him) became caliph when the position was passed on to him by Abu Bakr al-Siddeeq (may Allah be pleased with him). This was done by appointment of the previous caliph, which is one of the three recognized methods of selecting a ruler in Islamic political tradition.\n\nThe Sahabah agreed and swore allegiance to him, and he became the second caliph. He is regarded by Ahl as-Sunnah wal-Jama\'ah as the second best of this ummah after Abu Bakr, and after the Prophet (peace and blessings of Allah be upon him). This was confirmed by \'Ali ibn Abi Talib (may Allah be pleased with him) himself, as narrated by al-Bukhari.\n\nIbn Taymiyah (may Allah have mercy on him) said: "The Rightly-Guided Caliphs are the most knowledgeable of the ummah about the life and Sunnah of the Messenger of Allah (blessings and peace of Allah be upon him) and the circumstances he went through." (Majmu\' al-Fatawa, 20/234)\n\nIbn \'Uthaymin (may Allah have mercy on him) said: "No one had more knowledge about Islamic rulings than the Rightly-Guided Caliphs (may Allah be pleased with them)." (Majmu\' Fatawa wa Rasa\'il al-\'Uthaymeen, 222/62)\n\nReference: Islam Q&A, Answer 111836, Answer 211865',
            order_index: 2,
          },
          {
            title: "Uthman and Ali (RA)",
            title_ar: "عثمان وعلي رضي الله عنهما",
            slug: "uthman-and-ali",
            arabic_text: "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا",
            video_url: "https://www.youtube.com/embed/gnuNhA09khk?si=history01&start=1200&end=0",
            content:
              'Uthman ibn \'Affan (may Allah be pleased with him) became caliph in a similar manner to Abu Bakr, when \'Umar ibn al-Khattab (may Allah be pleased with him) delegated the appointment to a shoora council of six of the senior Sahabah, who were to elect one of their number. \'Abd al-Rahman ibn \'Awf consulted the Muhaajireen and Ansaar, and when he saw that the people were all inclined towards \'Uthman, he swore allegiance to him first, then the rest swore allegiance to him.\n\nIt is soundly narrated that \'Uthman recited the entire Quran in one rak\'ah. At-Tabarani narrated in Al-Kabir (130) that his wife said, when they surrounded his house: "Whether you kill him or not, he used to spend the entire night praying one rak\'ah in which he would recite the entire Quran."\n\nAli ibn Abi Talib (may Allah be pleased with him) became caliph when he was elected by most of the decision makers.\n\nThe early generations and leading scholars differed concerning \'Uthman and \'Ali: which of them was superior? The majority are of the view that \'Uthman is more virtuous and takes precedence over \'Ali, as he superseded him in deserving to be appointed caliph.\n\nIbn Hajar (may Allah have mercy on him) said: "In the end, there was consensus among Ahl as-Sunnah that their order in terms of virtue is the same as their order in terms of being appointed as caliph, may Allah be pleased with all of them." (Fath al-Bari, 7/34)\n\nReference: Islam Q&A, Answer 111836, Answer 240154, Answer 211865',
            order_index: 3,
          },
        ],
      },
      {
        title: "Islam and Knowledge",
        title_ar: "الإسلام والعلم",
        slug: "islam-and-knowledge",
        order_index: 2,
        lessons: [
          {
            title: "The Virtue of Knowledge in Islam",
            title_ar: "فضل العلم في الإسلام",
            slug: "virtue-of-knowledge",
            arabic_text: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
            content:
              'Allah created man and provided him with the tools for acquiring knowledge, namely hearing, sight and wisdom. Allah says (interpretation of the meaning): "And Allah has brought you out from the wombs of your mothers while you know nothing. And He gave you hearing, sight and hearts that you might give thanks (to Allah)." (an-Nahl 16:78)\n\nAllah praises the scholars and raises their status. He says (interpretation of the meaning): "Allah will exalt in degree those of you who believe, and those who have been granted knowledge" (al-Mujaadilah 58:11). And He says: "Say: \'Are those who know equal to those who know not?\' It is only men of understanding who will remember." (az-Zumar 39:9)\n\nBecause of the importance of knowledge, Allah commanded His Messenger to seek more of it. Allah says: "and say: \'My Lord! Increase me in knowledge\'" (Ta-Ha 20:114).\n\nThe Messenger (peace and blessings of Allah be upon him) made seeking knowledge an obligation upon every Muslim, and he explained that the superiority of the one who has knowledge over the one who merely worships is like the superiority of the moon over every other heavenly body. He said that the scholars are the heirs of the Prophets and that the Prophets did not leave behind dinars and dirhams, rather their inheritance was knowledge, so whoever acquires it has gained a great share.\n\nHe (peace and blessings of Allah be upon him) said: "Whoever follows a path in the pursuit of knowledge, Allah will make a path to Paradise easy for him." (Narrated by al-Bukhari, Kitaab al-\'Ilm, 10)\n\nIslam calls us to learn all kinds of beneficial knowledge. Branches of knowledge vary in status, the highest of which is knowledge of sharee\'ah, then knowledge of medicine, then the other fields of knowledge.\n\nReference: Islam Q&A, Answer 10471',
            order_index: 1,
          },
          {
            title: "The Ottoman Caliphate",
            title_ar: "الخلافة العثمانية",
            slug: "ottoman-caliphate",
            arabic_text: "يَا أَيُّهَا الَّذِينَ آمَنُوا أَطِيعُوا اللَّهَ وَأَطِيعُوا الرَّسُولَ وَأُولِي الْأَمْرِ مِنكُمْ",
            content:
              'The Ottoman state was one of the longest-lasting Islamic empires. It is important to understand its relationship with the various regions of the Islamic world.\n\nNajd (central Arabia) never came under Ottoman rule, because the rule of the Ottoman state never reached that far, no Ottoman governor was appointed over that region and the Turkish soldiers never marched through its land. Dr. Saalih al-\'Abood said: "Najd never came under Ottoman rule, because the rule of the Ottoman state never reached that far." (\'Aqeedat al-Shaykh Muhammad ibn \'Abd al-Wahhaab, 1/27)\n\nDr. \'Abd-Allaah al-\'Uthaymeen said: "Najd never experienced direct Ottoman rule before the call of Shaykh Muhammad ibn \'Abd al-Wahhaab emerged, just as it never experienced any strong influence that could have an impact on events inside Najd." (Muhammad ibn \'Abd al-Wahhaab Hayaatuhu wa Fikruhu, p. 11)\n\nThe Ottoman state was divided into administrative provinces. A Turkish document entitled Qawaaneen Aal \'Uthmaan indicates that from the beginning of the eleventh century AH the Ottoman state was divided into 23 provinces, of which 14 were Arabic provinces, and the land of Najd was not among them.\n\nThe Prophet (peace and blessings of Allah be upon him) said: "Whoever among you sees something evil, let him change it with his hand; if he cannot, then with his tongue; if he cannot, then with his heart, and that is the weakest of faith." (Narrated by Muslim)\n\nIbn Baaz (may Allah have mercy on him) said: "Shaykh Muhammad ibn \'Abd al-Wahhaab did not rebel against the Ottoman Caliphate as far as I know, because there was no area in Najd that was under Turkish rule."\n\nReference: Islam Q&A, Answer 9243',
            order_index: 2,
          },
        ],
      },
      {
        title: "The Great Islamic Dynasties",
        title_ar: "الدول الإسلامية الكبرى",
        slug: "great-islamic-dynasties",
        order_index: 3,
        lessons: [
          {
            title: "The Umayyad Caliphate",
            title_ar: "الخلافة الأموية",
            slug: "umayyad-caliphate",
            arabic_text: "وَاللَّهُ غَالِبٌ عَلَىٰ أَمْرِهِ وَلَٰكِنَّ أَكْثَرَ النَّاسِ لَا يَعْلَمُونَ",
            content:
              "The Umayyad Caliphate (661-750 CE / 41-132 AH) was established by Muawiyah ibn Abi Sufyan (may Allah be pleased with him) after the Fitnah (civil strife). Muawiyah was the first in a line of 14 Umayyad caliphs who ruled from Damascus. The Umayyad period was marked by tremendous territorial expansion — the Islamic empire stretched from Spain in the west to Central Asia in the east. Important conquests included North Africa, Spain (Andalusia), Transoxiana, and Sindh. The Umayyads made Arabic the official language of the empire and minted the first Islamic currency. They built remarkable architectural works including the Dome of the Rock in Jerusalem and the Umayyad Mosque in Damascus. Despite their achievements, the Umayyads faced criticism from some scholars for turning the caliphate into a hereditary monarchy. The Umayyad period ended with the Abbasid Revolution in 750 CE, when the Abbasids overthrew the last Umayyad caliph, Marwan II. One Umayyad prince, Abd al-Rahman I, escaped to Spain and established the Umayyad Emirate of Cordoba, which lasted for centuries. The scholars differed regarding the legitimacy of the Umayyad rulers, but the majority of Ahl al-Sunnah accept their caliphate as valid while acknowledging that some of them were just rulers and others were not.\n\nSource: islamqa.info/en/answers/22881",
            order_index: 1,
          },
          {
            title: "The Abbasid Caliphate",
            title_ar: "الخلافة العباسية",
            slug: "abbasid-caliphate",
            arabic_text: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
            content:
              "The Abbasid Caliphate (750-1258 CE / 132-656 AH) succeeded the Umayyads and ruled from Baghdad. The Abbasids were descendants of al-Abbas, the uncle of the Prophet (peace and blessings of Allah be upon him). The early Abbasid period is considered the Golden Age of Islamic civilization. The most famous Abbasid caliphs include al-Mansur (who founded Baghdad in 762 CE), Harun al-Rashid (786-809 CE), and al-Ma'mun (813-833 CE). Under the Abbasids, the Islamic world experienced a flourishing of knowledge in every field — medicine, astronomy, mathematics, philosophy, literature, and Islamic sciences. The House of Wisdom (Bayt al-Hikmah) in Baghdad became a center of translation and scholarship, preserving and building upon the knowledge of ancient civilizations. Great scholars like Imam Abu Hanifah, Imam Malik, Imam al-Shafi'i, Imam Ahmad ibn Hanbal, al-Bukhari, Muslim, and the linguist Sibawayh lived during the early Abbasid era. The Abbasid Caliphate gradually declined due to internal conflicts, the rise of regional dynasties (such as the Fatimids in Egypt and the Seljuks), and the devastating Mongol invasion of Baghdad in 1258 CE, which ended the Abbasid Caliphate in Iraq. A shadow Abbasid Caliphate continued in Cairo under the Mamluks until the Ottoman conquest.\n\nSource: islamqa.info/en/answers/22881",
            order_index: 2,
          },
          {
            title: "The Islamic Golden Age",
            title_ar: "العصر الذهبي للإسلام",
            slug: "islamic-golden-age",
            arabic_text: "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ",
            content:
              "The Islamic Golden Age (roughly 8th-13th centuries CE) was a period of extraordinary scientific, cultural, and economic flourishing in the Islamic world. The Quran and Sunnah encouraged seeking knowledge, which inspired Muslims to pursue learning in all fields. Major contributions include: (1) Medicine — Ibn Sina (Avicenna) wrote al-Qanun fi al-Tibb (The Canon of Medicine), the standard medical text in Europe for 500 years. Al-Razi (Rhazes) identified smallpox and measles. Al-Zahrawi (Albucasis) pioneered surgical techniques. (2) Mathematics — Al-Khwarizmi developed algebra (al-jabr) and introduced the decimal number system. (3) Astronomy — Al-Battani made precise astronomical observations. Ibn al-Haytham (Alhazen) revolutionized optics. (4) Philosophy — Ibn Rushd (Averroes) and al-Farabi preserved and expanded upon Greek philosophy. (5) Geography — Ibn Battuta traveled across the known world and documented his journeys. (6) Literature — The Arabian Nights, the poetry of al-Mutanabbi, and Rumi's spiritual poetry. The Golden Age was not limited to Arabs — Persian, Turkish, Berber, Indian, and Andalusian scholars all contributed. The decline began with internal political fragmentation and the Mongol invasion, but the legacy of Islamic scholarship laid the foundation for the European Renaissance.\n\nSource: islamqa.info/en/answers/10471",
            order_index: 3,
          },
        ],
      },
    ],
  },





  // ═════════════════════════════════════════════════════════════════════
  //  7. TAZKIYAH (تزكية النفس)
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
    order_index: 7,
    sections: [
      // ── Section 1: Knowing Your Enemy — The Nafs ──
      {
        title: "Knowing Your Enemy — The Nafs",
        title_ar: "معرفة عدوك — النفس",
        slug: "knowing-your-nafs",
        order_index: 1,
        lessons: [
          {
            title: "Disciplining the Soul (Nafs)",
            title_ar: "تأديب النفس",
            slug: "disciplining-the-nafs",
            arabic_text: "وَنَفْسٍ وَمَا سَوَّاهَا فَأَلْهَمَهَا فُجُورَهَا وَتَقْوَاهَا",
            video_url: "https://www.youtube.com/embed/4kWMwOLpR8U?si=tazkiyah01&start=0&end=800",
            content:
              "Purification of the soul (tazkiyah) is one of the primary goals of Islamic teachings. Allah sent the Prophet (peace and blessings of Allah be upon him) to purify the believers and teach them the Book and wisdom.\n\nImam al-Aajurri (may Allah have mercy on him) said: \"If someone were to say: what evidence is there for disciplining the nafs? The answer is: The Quran, the Sunnah and the words of the Muslim scholars.\" (Adab an-Nufoos, p. 9)\n\nHe also said: \"How bad is the situation of the one who neglects to discipline his nafs and train it on the basis of knowledge; and how good is the situation of the one who pays attention to disciplining his nafs and knows what Allah has enjoined upon him and what He has forbidden to him, and is patient in going against the whims and desires of his nafs, and seeks the help of Allah the Almighty in doing so.\" (Adab an-Nufoos, p. 17)\n\nAr-Rabee' ibn Anas said, concerning the verse \"Ward off from yourselves and your families a Fire\" [at-Tahreem 66:6]: \"Discipline and train yourselves and your families to adhere to the commands of Allah, may He be glorified and exalted.\"\n\nThe Quran describes three states of the soul: an-Nafs al-Ammarah (the soul that commands evil, Yusuf 12:53), an-Nafs al-Lawwamah (the blaming soul, al-Qiyamah 75:2), and an-Nafs al-Mutma'innah (the contented soul, al-Fajr 89:27-28). The journey of tazkiyah is the movement from the commanding soul to the contented soul through self-discipline, knowledge, and turning to Allah.\n\nReference: Islam Q&A, Answer 178627",
            order_index: 1,
          },
          {
            title: "The Commanding Soul and Its Desires",
            title_ar: "النفس الأمارة وشهواتها",
            slug: "commanding-soul-desires",
            arabic_text: "إِنَّ النَّفْسَ لَأَمَّارَةٌ بِالسُّوءِ إِلَّا مَا رَحِمَ رَبِّي",
            video_url: "https://www.youtube.com/embed/4kWMwOLpR8U?si=tazkiyah01&start=800&end=1600",
            content:
              'Allah created the nafs (soul) with inclinations toward both good and evil. The main purpose for which Allah has prescribed religion is to discipline the nafs, purify it, and instruct it to do acts of worship and obedience. To Allah belong the creation and the commandment.\n\nThe commanding soul (an-nafs al-ammarah) pulls toward sin, laziness, and instant gratification. It is not evil in itself \u2014 Allah created it with natural desires. The problem is when these desires are not controlled by faith and reason.\n\nImam al-Aajurri said: "Do you not see, may Allah have mercy on you, that your Lord Most Generous is urging you to discipline yourself and your families. Pay heed to Allah and make yourselves adhere to that." (Adab an-Nufoos, p. 15)\n\nThe believer disciplines his nafs by: following the commands of Allah, avoiding what He has forbidden, being patient in going against whims and desires, and seeking the help of Allah in doing so.\n\nReference: Islam Q&A, Answer 178627',
            order_index: 2,
          },
          {
            title: "Following Desires (Hawa)",
            title_ar: "اتباع الهوى",
            slug: "following-desires",
            arabic_text: "أَفَرَأَيْتَ مَنِ اتَّخَذَ إِلَٰهَهُ هَوَاهُ",
            video_url: "https://www.youtube.com/embed/4kWMwOLpR8U?si=tazkiyah01&start=1600&end=2400",
            content:
              'The Quran warns against those who take their desires (hawa) as their god. Allah says (interpretation of the meaning): "Have you seen the one who takes his own desire as his god? Would you then be a guardian over him?" [al-Furqan 25:43]\n\nAllah gave humans intellect (\'aql) and desire (hawa). The intellect distinguishes right from wrong, considers consequences, and remembers Allah. Desire seeks immediate gratification without considering consequences. Faith is strong when the intellect governs desires; faith weakens when desires govern the intellect.\n\nThe Salaf understood the danger of following desires. They disciplined themselves to follow intellect over desire, and they knew that true strength is controlling oneself at times of anger and desire.\n\nStrengthening the intellect through knowledge (ilm) and reflection (tafakkur) is the path to overcoming the dominance of desires. The more one knows about Allah, Paradise, Hell, and the purpose of life, the easier it becomes for the intellect to rule over desires.\n\nReference: Islam Q&A, Answer 178627',
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
            title: "Kibr (Pride/Arrogance)",
            title_ar: "الكبر",
            slug: "kibr-pride",
            arabic_text: "أَبَىٰ وَاسْتَكْبَرَ وَكَانَ مِنَ الْكَافِرِينَ",
            video_url: "https://www.youtube.com/embed/4kWMwOLpR8U?si=tazkiyah02&start=2400&end=2700",
            content:
              'Kibr (pride/arrogance) is a major sin and a disease of the heart. The Prophet (peace and blessings of Allah be upon him) defined it clearly: "Arrogance means rejecting the truth and looking down on people." (Narrated by Muslim)\n\nAllah, the Exalted, said: "Might is His garment and pride is His cloak; whoever seeks to compete with Me concerning them, I will punish him." (Narrated by Muslim, 2620). An-Nawawi (may Allah have mercy on him) said: "This is a stern warning against arrogance which clearly demonstrates that it is prohibited." (Sharh Muslim, 16/173)\n\nThe Prophet (peace and blessings of Allah be upon him) said: "No one who has an atom\'s weight of pride in his heart will enter Paradise." (Muslim). A man asked: "What about a person who likes his clothes to be nice?" The Prophet replied: "Allah is beautiful and loves beauty. Pride is rejecting the truth and looking down on people." (Muslim)\n\nTypes of arrogance include: when a person does not accept the truth and produces false arguments against it, and when a person admires himself and feels superior to people.\n\nAllah says (interpretation of the meaning): "And turn not your face away from men with pride, nor walk in insolence through the earth. Verily, Allah likes not any arrogant boaster." [Luqman 31:18]\n\nReference: Islam Q&A, Answer 9229',
            order_index: 1,
          },
          {
            title: "Hasad (Envy) and Its Cure",
            title_ar: "الحسد وعلاجه",
            slug: "hasad-envy",
            arabic_text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
            video_url: "https://www.youtube.com/embed/4kWMwOLpR8U?si=tazkiyah02&start=2700&end=3000",
            content:
              'Hasad (destructive envy) means wishing that a blessing that Allah has bestowed on the envied person be taken away. Allah enjoined His Prophet (peace and blessings of Allah be upon him) to seek refuge with Him from the evil of the envier when he envies. Allah says (interpretation of the meaning): "And from the evil of the envier when he envies." [al-Falaq 113:5]\n\nHasad is of varying degrees:\n- When a person wants the blessing to be taken away from his Muslim brother, even if it does not come to him.\n- Where he wants the blessing to be taken away from someone else because he wants it, in the hope that it will come to him.\n- Where he wishes for himself a blessing like that which someone else has, without wanting it to be taken away from the other person. This is permissible and is called ghibtah (admiration), not hasad.\n\nThe envier harms himself in three ways: he earns sin because hasad is haram, it is bad etiquette before Allah as it means hating Allah\'s blessing His slaves, and he suffers because of too much worry and distress.\n\nEnvy does not change the decree of Allah at all. Ibn \'Uthaymeen (may Allah have mercy on him) said: "Envy is one of the characteristics of the Jews, and it is a major sin. It does not change anything of the decree of Allah; rather it is a cause of sorrow and pain for the envier." (Fataawa Noor \'ala ad-Darb, 24/2)\n\nReference: Islam Q&A, Answer 105471, Answer 180892',
            order_index: 2,
          },
          {
            title: "Riya (Showing Off)",
            title_ar: "الرياء",
            slug: "riya-showing-off",
            arabic_text: "فَوَيْلٌ لِّلْمُصَلِّينَ الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ الَّذِينَ هُمْ يُرَاءُونَ",
            video_url: "https://www.youtube.com/embed/4kWMwOLpR8U?si=tazkiyah02&start=3000&end=3300",
            content:
              'Showing off (riya) is performing acts of worship or good deeds to be seen and praised by people, not for Allah. The Prophet (peace and blessings of Allah be upon him) called it "the minor shirk." (Narrated by Ahmad)\n\nShaykh Ibn \'Uthaymin (may Allah have mercy on him) explained that showing off may affect worship in three ways:\n\n1. When the basic motive for worship is to be seen by others \u2014 this invalidates the act of worship.\n2. When it develops during the act of worship: if he wards it off and does not give in to it, it does not affect him; if he gives in to it, the entire act becomes invalid.\n3. When the idea of showing off develops after the act of worship has ended \u2014 this does not affect it.\n\nTips for resisting the temptation to show off include: remembering that Allah is always watching His slave; seeking the help of Allah; knowing the effects of showing off and how it will be judged in the Hereafter; thinking about the punishment in this world for showing off \u2014 Allah will expose him and make his bad intentions known to others; and concealing worship and not making a display of it.\n\nThe Prophet (peace and blessings of Allah be upon him) said: "Whoever shows off, Allah will expose him." (Narrated by al-Bukhari, 6134; Muslim, 2986)\n\nReference: Islam Q&A, Answer 9359, Answer 6578',
            order_index: 3,
          },
          {
            title: "This World and Its Pleasures",
            title_ar: "الدنيا ولذاتها",
            slug: "this-world-pleasures",
            arabic_text: "بَلْ تُؤْثِرُونَ الْحَيَاةَ الدُّنْيَا وَالْآخِرَةُ خَيْرٌ وَأَبْقَىٰ",
            video_url: "https://www.youtube.com/embed/4kWMwOLpR8U?si=tazkiyah02&start=3300&end=3600",
            content:
              'The pleasures of this world are of three types:\n\n1. Pleasures which will be followed by a greater pain, or which make a person miss out on a greater pleasure. These are the pleasures enjoyed by sinners, such as those who enjoy zina, drinking wine, stealing, and so on. It will be said to them on the Day of Resurrection: "You received your good things in the life of the world, and you took your pleasure therein." [al-Ahqaaf 46:20]\n\n2. Pleasures which will not be punished in the Hereafter, but overindulgence causes a person to miss out on achieving higher levels and keeps him from earning reward. These are the permissible pleasures done without the intention of worship.\n\n3. Pleasures for which a person will be rewarded. These belong to the believers who enjoy them seeking help thereby to obey Allah and keep themselves away from sin. The Prophet (peace and blessings of Allah be upon him) said: "Allah will be pleased with a slave who eats some food then praises Allah for it, and drinks some drink then praises Allah for it." (Narrated by Muslim, 2734)\n\nThis world is the place of striving and the Hereafter is the place of reward or punishment. Allah tests His slaves with calamities and tribulations so that the believer may be distinguished from the disbeliever.\n\nReference: Islam Q&A, Answer 4649, Answer 13205',
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
            title: 'Tawbah \u2014 Sincere Repentance',
            title_ar: "التوبة النصوح",
            slug: "tawbah-sincere-repentance",
            arabic_text: "يَا أَيُّهَا الَّذِينَ آمَنُوا تُوبُوا إِلَى اللَّهِ تَوْبَةً نَّصُوحًا",
            video_url: "https://www.youtube.com/embed/4kWMwOLpR8U?si=tazkiyah03&start=3600&end=3900",
            content:
              'The conditions of sincere repentance (tawbah nasuh) are: giving up the sin straight away, regretting what has happened in the past, resolving not to go back to the sin, and if the sin involves wronging another person, seeking forgiveness from the one who was wronged or giving him his rights.\n\nThe Prophet (peace and blessings of Allah be upon him) said: "Regret is repentance." (Narrated by Ahmad, 4012; classed as sahih by al-Albani). Regret is the cornerstone of repentance, for it leads to giving up the sin and resolving not to go back to it.\n\nAllah says (interpretation of the meaning): "O you who believe! Turn to Allah with sincere repentance! It may be that your Lord will expiate from you your sins, and admit you into Gardens under which rivers flow (Paradise)." [at-Tahrim 66:8]\n\nThe Prophet (peace and blessings of Allah be upon him) said: "Allah spreads out His Hand at night to accept the repentance of those who did wrong during the day, and He spreads out His Hand during the day to accept the repentance of those who did wrong during the night. (This will continue) until the sun rises from the west." (Narrated by Muslim, 2759)\n\nReference: Islam Q&A, Answer 289765, Answer 14289',
            order_index: 1,
          },
          {
            title: 'Muhasabah \u2014 Self-Accounting',
            title_ar: "المحاسبة",
            slug: "muhasabah-self-accounting",
            arabic_text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَلْتَنظُرْ نَفْسٌ مَّا قَدَّمَتْ لِغَدٍ",
            video_url: "https://www.youtube.com/embed/4kWMwOLpR8U?si=tazkiyah03&start=3900&end=4200",
            content:
              'This information could not be verified on islamqa.info.\n\nAllah says (interpretation of the meaning): "O you who have believed, fear Allah. And let every soul look to what it has put forth for tomorrow." [al-Hashr 59:18]\n\nThis verse encourages the believer to examine his deeds and hold himself accountable before the Day of Reckoning. Umar ibn al-Khattab (may Allah be pleased with him) said: "Take account of yourselves before you are taken to account."\n\nReference: Islam Q&A',
            order_index: 2,
          },
          {
            title: 'Dhikr \u2014 Remembrance of Allah',
            title_ar: "ذكر الله",
            slug: "dhikr-remembrance",
            arabic_text: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
            video_url: "https://www.youtube.com/embed/4kWMwOLpR8U?si=tazkiyah03&start=4200&end=4500",
            content:
              'Remembering Allah (dhikr) brings great benefits, such as spiritual well-being, tranquility and softening of the heart. Allah, may He be Exalted, says (interpretation of the meaning): "Those who believe, and whose hearts find rest in the remembrance of Allah. Verily, in the remembrance of Allah do hearts find rest." [ar-Ra\'d 13:28]\n\nThe Prophet (peace and blessings of Allah be upon him) said: "The example of the one who remembers his Lord and the one who does not remember Him is like the example of the living and the dead." (Narrated by al-Bukhari)\n\nRemembering Allah may be obligatory, as in the case of Takbirat al-Ihram (the Takbir said when starting the prayer), or it may be recommended. The believer who loves Allah inevitably remembers Allah all the time.\n\nBy dhikr the Muslim attains great reward by doing a small deed, which is simply moving one\'s lips and reciting a few words. The Prophet (peace and blessings of Allah be upon him) said: "Whoever follows a path in the pursuit of knowledge, Allah will make a path to Paradise easy for him."\n\nReference: Islam Q&A, Answer 253005',
            order_index: 3,
          },
          {
            title: 'Tawakkul \u2014 Reliance on Allah',
            title_ar: "التوكل على الله",
            slug: "tawakkul-reliance",
            arabic_text: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
            video_url: "https://www.youtube.com/embed/4kWMwOLpR8U?si=tazkiyah03&start=4500&end=0",
            content:
              'Putting one\'s trust (tawakkul) in Allah involves two things: depending on Allah and believing that He is the One Who causes measures to be effective, and taking appropriate measures. Putting one\'s trust in Allah does not mean refraining from taking measures; rather part of putting one\'s trust in Allah is taking appropriate measures and striving to do so.\n\nShaykh \'Abd al-\'Aziz ibn Baz (may Allah have mercy on him) said: "Trust in Allah combines two things: reliance on Allah and believing that He is the creator of means and measures, that His decree will inevitably come to pass; and taking appropriate measures, for failing to take measures is contrary to trust in Allah." (Fatwa ash-Shaykh Ibn Baz, 4/427)\n\nShaykh al-Islam Ibn Taymiyah (may Allah have mercy on him) said: "The individual\'s heart should be reliant upon Allah, not on the means or measures, and Allah will make easy for him the measures that he may take to rectify his condition in this world and the hereafter." (Majmu\' al-Fatawa, 8/528)\n\nAllah says (interpretation of the meaning): "And whoever relies upon Allah \u2014 then He is sufficient for him. Indeed, Allah will accomplish His purpose. Allah has set a measure for all things." [at-Talaq 65:3]\n\nReference: Islam Q&A, Answer 130499, Answer 128891',
            order_index: 4,
          },
        ],
      },
      // ── Section 4: Essential Virtues ──
      {
        title: "Essential Virtues",
        title_ar: "الفضائل الأساسية",
        slug: "essential-virtues",
        order_index: 4,
        lessons: [
          {
            title: "Patience (Sabr)",
            title_ar: "الصبر",
            slug: "patience-sabr",
            arabic_text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
            video_url: "https://www.youtube.com/embed/4kWMwOLpR8U?si=tazkiyah03&start=0&end=0",
            content:
              "Sabr (patience) is half of faith and one of the greatest virtues in Islam. Allah mentions patience in the Quran more than ninety times. He says: 'O you who believe! Seek help through patience and prayer. Indeed, Allah is with the patient.' (2:153). Patience is of three types: (1) Patience in obeying Allah — persisting in worship and good deeds despite the effort; (2) Patience in refraining from sin — controlling one's desires and avoiding what Allah has forbidden; (3) Patience with the trials of Allah — accepting hardship, illness, and loss with faith and hope of reward. The reward for patience is immense: 'Indeed, the patient will be given their reward without account.' (39:10). The Prophet (peace and blessings of Allah be upon him) said: 'No one has been given anything better and more abundant than patience.' (Bukhari, Muslim). When calamity strikes, the believer says: 'Inna lillahi wa inna ilayhi raji'oon' and knows that everything belongs to Allah. The Prophet said: 'How amazing is the affair of the believer! All his affairs are good. If he is granted ease, he is thankful, and that is good for him. If he is afflicted with hardship, he is patient, and that is good for him.' (Muslim).\n\nSource: islamqa.info/en/answers/31703",
            order_index: 1,
          },
          {
            title: "Gratitude (Shukr)",
            title_ar: "الشكر",
            slug: "gratitude-shukr",
            arabic_text: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
            video_url: "https://www.youtube.com/embed/4kWMwOLpR8U?si=tazkiyah03&start=600&end=0",
            content:
              "Shukr (gratitude) is the opposite of kufr (ingratitude/disbelief). Gratitude to Allah is a fundamental characteristic of the believer. Allah says: 'And (remember) when your Lord proclaimed: If you are grateful, I will surely increase you (in favor); but if you deny, indeed My punishment is severe.' (14:7). Gratitude is expressed in three ways: (1) Gratitude of the heart — acknowledging that all blessings come from Allah alone; (2) Gratitude of the tongue — praising Allah and saying 'Alhamdulillah'; (3) Gratitude of the limbs — using Allah's blessings to obey Him and not to disobey Him. The Prophet (peace and blessings of Allah be upon him) prayed at night until his feet swelled, and when asked why, he said: 'Should I not be a grateful servant?' (Bukhari, Muslim). True gratitude leads to more blessings and is a means of protection from punishment. The Prophet said: 'Whoever says in the morning: O Allah, whatever blessing I or any of Your creation have woken up with, it is from You alone, with no partner, so praise be to You and gratitude — has offered his gratitude for the day.' (Abu Dawud). Ingratitude leads to the loss of blessings.\n\nSource: islamqa.info/en/answers/26657",
            order_index: 2,
          },
          {
            title: "Love of Allah and His Messenger",
            title_ar: "محبة الله ورسوله",
            slug: "love-of-allah-messenger",
            arabic_text: "قُلْ إِن كَانَ آبَاؤُكُمْ وَأَبْنَاؤُكُمْ وَإِخْوَانُكُمْ وَأَزْوَاجُكُمْ وَعَشِيرَتُكُمْ وَأَمْوَالٌ اقْتَرَفْتُمُوهَا وَتِجَارَةٌ تَخْشَوْنَ كَسَادَهَا وَمَسَاكِنُ تَرْضَوْنَهَا أَحَبَّ إِلَيْكُم مِّنَ اللَّهِ وَرَسُولِهِ وَجِهَادٍ فِي سَبِيلِهِ فَتَرَبَّصُوا حَتَّىٰ يَأْتِيَ اللَّهُ بِأَمْرِهِ",
            content:
              "Love of Allah is the foundation of faith. It is the essence of Tawhid — 'Those who believe love Allah more than all else' (2:165). The signs of true love for Allah include: (1) Following the Prophet (peace and blessings of Allah be upon him) — 'Say: If you love Allah, then follow me, and Allah will love you.' (3:31); (2) Longing to meet Allah — the Prophet said: 'Whoever loves to meet Allah, Allah loves to meet him.' (Bukhari, Muslim); (3) Remembering Allah often and feeling joy in His remembrance; (4) Loving what Allah loves and hating what He hates. Love for the Prophet is a necessary part of faith. The Prophet said: 'None of you truly believes until I am more beloved to him than his father, his child, and all of mankind.' (Bukhari, Muslim). This love is proven by obeying him, defending his Sunnah, and following his example. Love for righteous believers is also part of faith: 'The believers are but brothers' (49:10). The Prophet said: 'There are three qualities, whoever has them will taste the sweetness of faith: that Allah and His Messenger are more beloved to him than all else... and that he loves a person only for the sake of Allah.' (Bukhari, Muslim).\n\nSource: islamqa.info/en/answers/127052",
            order_index: 3,
          },
        ],
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════════
  //  8. USUL AL-FIQH (أصول الفقه)
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
    order_index: 8,
    sections: [
      {
        title: "Sources of Islamic Law",
        title_ar: "مصادر التشريع الإسلامي",
        slug: "sources-of-islamic-law",
        order_index: 1,
        lessons: [
          {
            title: "Introduction to Usul al-Fiqh",
            title_ar: "مقدمة في أصول الفقه",
            slug: "intro-usul-al-fiqh",
            arabic_text: "وَمَا كَانَ الْمُؤْمِنُونَ لِيَنفِرُوا كَافَّةً ۚ فَلَوْلَا نَفَرَ مِن كُلِّ فِرْقَةٍ مِّنْهُمْ طَائِفَةٌ لِّيَتَفَقَّهُوا فِي الدِّينِ",
            video_url: "https://www.youtube.com/embed/idxLWxZMIYM?si=usul01&start=0&end=600",
            content:
              "Shari'ah is the entire religion; Fiqh is knowledge of the practical, minor Shar'i rulings; and Usul al-Fiqh is knowledge of the evidence for Shar'i rulings and the ways in which these rulings are derived.\n\nThe sources of Islam on which all beliefs, principles and rulings are based are represented by the two Revelations: the Quran and Sunnah. This is what is implied by Islam being a divinely-revealed religion: its pillars are based on infallible texts that were sent down from heaven, which are represented in the verses of the Holy Quran and the texts of the saheeh Prophetic Sunnah.\n\nImam al-Shafi'i (may Allah have mercy on him) said: \"No view is binding unless it is based on the Book of Allah or the Sunnah of His Messenger (peace and blessings of Allah be upon him). Everything other than them should be based on them.\" (Jimaa' al-'Ilm)\n\nFrom these two sources the scholars derived other principles on which rulings may be based: ijma' (scholarly consensus) and qiyas (analogy). Imam al-Shafi'i said: \"No one has any right whatsoever to say that something is halal or haram except on the basis of knowledge, and the basis of knowledge is a text in the Quran or Sunnah, or ijma' (scholarly consensus) or qiyas (analogy).\" (Al-Risalah, 39)\n\nIbn Taymiyah (may Allah have mercy on him) said: \"If we say Quran, Sunnah and ijma', they all stem from the same source, because the Messenger agrees with everything that is in the Quran, and the ummah is unanimously agreed upon it in general.\" (Majmoo' al-Fatawa, 7/40)\n\nReference: Islam Q&A, Answer 112268",
            order_index: 1,
          },
          {
            title: "The Quran as the First Source",
            title_ar: "القرآن كمصدر أول",
            slug: "quran-as-first-source",
            arabic_text: "إِنَّا أَنزَلْنَا إِلَيْكَ الْكِتَابَ بِالْحَقِّ لِتَحْكُمَ بَيْنَ النَّاسِ بِمَا أَرَاكَ اللَّهُ",
            video_url: "https://www.youtube.com/embed/idxLWxZMIYM?si=usul01&start=600&end=1200",
            content:
              "The Quran was revealed by Allah, may He be glorified, as a law and a reference as to what is permissible and prohibited, what is commanded and forbidden, for people to follow, so that they obey its commands and abide by its prohibitions, take what it allows as permissible and take what it prohibits as forbidden.\n\nThe Quran tells us about what happened before and what is yet to come, and it is a reference for judging between us. Allah says (interpretation of the meaning): \"We have neglected nothing in the Book\" (6:38).\n\nAfter the Revelation was completed, Allah said (interpretation of the meaning): \"This day, I have perfected your religion for you\" (5:3).\n\nThe Sunnah [words and deeds of the Prophet (peace and blessings of Allah be upon him)] came to explain and complement the Quran. The Prophet (peace and blessings of Allah be upon him) said: \"I have been given the Quran and something like it with it.\" The phrase \"something like it with it\" refers to the Sunnah. (Saheeh hadeeth)\n\nAllah commanded us to refer to these two constitutional references, when He said (interpretation of the meaning): \"If you differ in anything amongst yourselves, refer it to Allah and His Messenger\" (4:59). Referring to Allah means referring to the Quran, and referring to His Messenger means referring to the Sunnah. The Quran is the primary source of legislation, then comes the Sunnah.\n\nReference: Islam Q&A, Answer 2110",
            order_index: 2,
          },
          {
            title: "The Sunnah as the Second Source",
            title_ar: "السنة كمصدر ثان",
            slug: "sunnah-as-second-source",
            arabic_text: "وَمَا آتَاكُمُ الرَّسُولُ فَخُذُوهُ وَمَا نَهَاكُمْ عَنْهُ فَانتَهُوا",
            video_url: "https://www.youtube.com/embed/idxLWxZMIYM?si=usul01&start=1200&end=0",
            content:
              "The Sunnah is the second primary source of Islamic law. It consists of the words, actions, and tacit approvals of the Prophet Muhammad (peace and blessings of Allah be upon him). The Quran commands obedience to the Messenger alongside obedience to Allah.\n\nThe Sunnah explains and complements the Quran. It came to explain how to perform what the Quran commands, to specify general statements, and to add rulings not explicitly mentioned in the Quran.\n\nIbn Taymiyah (may Allah have mercy on him) said: \"Everything that the Prophet enjoined in his Sunnah, the Quran obliged us to follow it.\" (Majmoo' al-Fatawa, 7/40)\n\nThe sources of Islam on which all beliefs, principles and rulings are based are represented by the two Revelations: the Quran and Sunnah. The Sunnah is revelation from Allah, as the Quran says: \"Nor does he speak from his own desire. It is only revelation revealed\" (53:3-4).\n\nDr. Abd al-Kareem Zaydaan said: \"The sources of fiqh all derive from the Revelation (wahy) of Allah, whether it is Quran or Sunnah.\" (Al-Madkhil li Diraasat al-Sharee'ah al-Islamiyyah, p. 153)\n\nReference: Islam Q&A, Answer 112268",
            order_index: 3,
          },
        ],
      },
      // ── Section 2: Secondary Sources ──
      {
        title: "Secondary Sources of Legislation",
        title_ar: "المصادر التبعية للتشريع",
        slug: "secondary-sources",
        order_index: 2,
        lessons: [
          {
            title: "Ijma — Scholarly Consensus",
            title_ar: "الإجماع — اتفاق العلماء",
            slug: "ijma-consensus",
            arabic_text: "وَمَن يُشَاقِقِ الرَّسُولَ مِن بَعْدِ مَا تَبَيَّنَ لَهُ الْهُدَىٰ وَيَتَّبِعْ غَيْرَ سَبِيلِ الْمُؤْمِنِينَ نُوَلِّهِ مَا تَوَلَّىٰ",
            video_url: "https://www.youtube.com/embed/SvgGzXcYKIc?si=usul02&start=0&end=600",
            content:
              "Consensus (ijma') is one of the important sources of legislation that must be followed. It is defined as: the unanimous agreement among the scholars of the ummah after the death of Muhammad (blessings and peace of Allah be upon him), during any era, on some particular matter.\n\nThere is a great deal of definitive evidence from the Quran and Sunnah for the fact that consensus constitutes binding proof. Allah, may He be exalted, says (interpretation of the meaning): \"And whoever opposes the Messenger after guidance has become clear to him and follows other than the way of the believers - We will give him what he has taken and drive him into Hell, and evil it is as a destination\" (an-Nisa' 4:115).\n\nIbn Hazm (may Allah have mercy on him) said: \"Whoever goes against it — that is, consensus — after coming to know of it, or after proof has been established on the basis of consensus, is deserving of the warning mentioned in the verse.\" (Maraatib al-Ijma', p. 7)\n\nAl-Qadi Abu Ya'la (may Allah have mercy on him) said: \"Consensus constitutes binding proof with which one should comply and it is haram to go against it; it is not possible for the ummah to agree on error.\" (Al-'Uddah fi Usool al-Fiqh, 4/1058)\n\nShaykh Ibn 'Uthaymin (may Allah have mercy on him) said: \"The consensus of the ummah is either right or wrong. If it is right, then their consensus constitutes proof, and if it is wrong, then how could this ummah, which is the dearest of nations to Allah since the time of its Prophet until the onset of the Hour, agree on something that is wrong? This is utterly impossible.\" (Majmu' Fatawa wa Rasa'il al-'Uthaymin, 11/63)\n\nReference: Islam Q&A, Answers 256101 and 197937",
            order_index: 1,
          },
          {
            title: "Qiyas — Analogical Reasoning (with Examples)",
            title_ar: "القياس — الاستدلال بالتمثيل (مع أمثلة)",
            slug: "qiyas-analogical-reasoning",
            arabic_text: "فَاعْتَبِرُوا يَا أُولِي الْأَبْصَارِ",
            video_url: "https://www.youtube.com/embed/SvgGzXcYKIc?si=usul02&start=600&end=1200",
            content:
              "Qiyas (analogical reasoning) is the fourth source of Islamic law according to the majority of scholars. It means deriving a ruling for a new case (far') by comparing it to an existing case (asl) from the Quran, Sunnah, or Ijma when they share the same effective cause ('illah).\n\nImam al-Shafi'i (may Allah have mercy on him) included qiyas among the sources of knowledge, saying: \"No one has any right whatsoever to say that something is halal or haram except on the basis of knowledge, and the basis of knowledge is a text in the Quran or Sunnah, or ijma' (scholarly consensus) or qiyas (analogy).\" (Al-Risalah, 39)\n\nDr. Abd al-Kareem Zaydaan said: \"The sources of fiqh all derive from the Revelation (wahy) of Allah, whether it is Quran or Sunnah. Hence we prefer to divide these sources into original sources, namely the Quran and Sunnah, and secondary sources to which the texts of the Quran and Sunnah refer, such as ijma' (scholarly consensus) and qiyas (analogy).\" (Al-Madkhil li Diraasat al-Sharee'ah al-Islamiyyah, p. 153)\n\nExample: The Quran prohibits wine (khamr) because it intoxicates. Through qiyas, scholars extend this prohibition to all intoxicants because they share the same effective cause ('illah). Qiyas has four components: the original case (asl), the ruling (hukm), the new case (far'), and the effective cause ('illah).\n\nReference: Islam Q&A, Answer 112268",
            order_index: 2,
          },
          {
            title: "Istihsan, Maslahah, 'Urf — Islam's Flexibility",
            title_ar: "الاستحسان والمصلحة والعرف — مرونة الإسلام",
            slug: "istihsan-maslahah-urf",
            arabic_text: "الَّذِينَ يَسْتَمِعُونَ الْقَوْلَ فَيَتَّبِعُونَ أَحْسَنَهُ",
            video_url: "https://www.youtube.com/embed/SvgGzXcYKIc?si=usul02&start=1200&end=0",
            content:
              "With regard to sources other than the four primary ones — such as the opinions of the Sahabah, istihsan (discretion), sadd al-dhara'i' (blocking the means that lead to evil), istishab, 'urf (custom), the laws of those who came before us, al-masalih al-mursalah (things that serve the general interests of the Muslims) and so on — the scholars differed as to how valid it is to use them as evidence. According to the view that they are acceptable — all or some of them — they are secondary to the Quran and Sunnah and should be in accordance with them.\n\nIstihsan means departing from an apparent analogy (qiyas) in favor of a stronger evidence or to avoid hardship. Al-Masalih al-Mursalah refers to considerations of public interest in cases where no specific text exists. 'Urf refers to local customs and practices that do not contradict Islamic principles.\n\nThese principles are not independent sources; they operate within the framework of the Quran, Sunnah, Ijma, and Qiyas, and they must be in accordance with the primary sources.\n\nReference: Islam Q&A, Answer 112268",
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
            video_url: "https://www.youtube.com/embed/7nflGnmR83I?si=usul03&start=0&end=600",
            content:
              "Ibn al-Qayyim (may Allah have mercy on him) mentioned that Imam Ahmad (may Allah have mercy on him) said: No man should set himself up to issue fatwas until he has attained five qualities:\n1. He should have a good intention, for if he does not have a good intention, he will not be blessed and there will be no blessings in his words.\n2. He should be knowledgeable, forbearing, dignified and calm.\n3. He should have a strong grasp of knowledge.\n4. He should have a strong personality and not be affected by people's criticism.\n5. He should know what people are like.\n\nIbn al-Qayyim said: These five qualities are the foundation for issuing fatwas. If any of them are lacking, there will be a commensurate defect in the mufti.\n\nAn-Nawawi (may Allah have mercy on him) said regarding the conditions to be met by the mufti: he should be accountable, Muslim, trustworthy, honest, far removed from evildoing, have an innate ability to grasp the meanings of things, be clear-minded and mature in thinking, of sound understanding and able to reach sound conclusions, and alert. This applies equally to one who is free, a slave, a woman, one who is blind, and one who is nonverbal.\n\nReference: Islam Q&A, Answers 21844 and 130102",
            order_index: 1,
          },
          {
            title: "The 4 Madhabs — Differences are a Mercy",
            title_ar: "المذاهب الأربعة — الاختلاف رحمة",
            slug: "four-madhabs",
            arabic_text: "وَاخْتِلَافُ أَلْسِنَتِكُمْ وَأَلْوَانِكُمْ ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّلْعَالِمِينَ",
            video_url: "https://www.youtube.com/embed/7nflGnmR83I?si=usul03&start=600&end=1200",
            content:
              "It is not obligatory for a Muslim to follow any particular madhhab among the four madhhabs. People vary in their level of understanding and ability to derive rulings from the evidence. There are some for whom it is permissible to follow (taqlid), and indeed it may be obligatory in their case. There are others who can only follow the Shar'i evidence.\n\nThe four madhhabs are named after the four imams — Imam Abu Hanifah, Imam Malik, Imam al-Shafi'i and Imam Ahmad. These imams learned fiqh from the Quran and Sunnah, and they are mujtahidin. The mujtahid either gets it right, in which case he will have two rewards, or he will get it wrong, in which case he will be rewarded for his ijtihad and will be forgiven for his mistake.\n\nThe one who is able to derive rulings from the Quran and Sunnah should take from them like those who came before him; it is not right for him to follow blindly (taqlid) when he believes that the truth lies elsewhere. Whoever does not have the ability to derive rulings himself is permitted to follow one whom he feels comfortable following.\n\nThe madhhab of Abu Hanifah is the most widespread madhhab among the Muslims. That does not mean that his madhhab is the most sound or that every ijtihad in it is correct; rather like other madhhabs, it contains some things that are correct and some that are incorrect. What the believer must do is to follow the truth and what is correct, regardless of who says it.\n\nReference: Islam Q&A, Answer 21420",
            order_index: 2,
          },
          {
            title: "Fiqh of Priorities — What Matters Most",
            title_ar: "فقه الأولويات — ما هو الأهم",
            slug: "fiqh-of-priorities",
            arabic_text: "فَمَن زُحْزِحَ عَنِ النَّارِ وَأُدْخِلَ الْجَنَّةَ فَقَدْ فَازَ ۗ وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ",
            video_url: "https://www.youtube.com/embed/7nflGnmR83I?si=usul03&start=1200&end=0",
            content:
              "This information could not be verified on islamqa.info.",
            order_index: 3,
          },
        ],
      },
      {
        title: "Ijtihad and Legal Theory",
        title_ar: "الاجتهاد والنظرية القانونية",
        slug: "ijtihad-legal-theory",
        order_index: 4,
        lessons: [
          {
            title: "Ijtihad and the Mujtahid",
            title_ar: "الاجتهاد والمجتهد",
            slug: "ijtihad-mujtahid",
            arabic_text: "وَمَا كَانَ الْمُؤْمِنُونَ لِيَنفِرُوا كَافَّةً ۚ فَلَوْلَا نَفَرَ مِن كُلِّ فِرْقَةٍ مِّنْهُمْ طَائِفَةٌ لِّيَتَفَقَّهُوا فِي الدِّينِ وَلِيُنذِرُوا قَوْمَهُمْ إِذَا رَجَعُوا إِلَيْهِمْ لَعَلَّهُمْ يَحْذَرُونَ",
            video_url: "https://www.youtube.com/embed/7nflGnmR83I?si=usul03&start=0&end=0",
            content:
              "Ijtihad (independent legal reasoning) is the process by which a qualified scholar derives rulings from the primary sources of Islamic law. It is a fard kifayah (communal obligation) — if some qualified scholars engage in ijtihad, the obligation is lifted from the rest. The conditions for a mujtahid include: (1) Deep knowledge of the Quran and Sunnah — he must know the verses of rulings (ayah al-ahkam) and hadith of rulings, which number approximately 500 each; (2) Knowledge of Arabic language, grammar, and rhetoric to understand the texts correctly; (3) Knowledge of the scholarly consensus (ijma') so he does not contradict it; (4) Knowledge of the principles of hadith criticism (mustalah al-hadith); (5) Knowledge of the principles of jurisprudence (usul al-fiqh); (6) Knowledge of abrogating and abrogated verses (nasikh and mansukh); (7) Understanding of the objectives of Shariah (maqasid al-shariah). A mujtahid may err or be correct — if he is correct, he gets two rewards; if he errs, he gets one reward, as the Prophet said (Bukhari, Muslim). Ijtihad is not permissible for those who are not qualified, as this leads to misguidance.\n\nSource: islamqa.info/en/answers/41118",
            order_index: 1,
          },
          {
            title: "Taqlid (Following Scholarship)",
            title_ar: "التقليد",
            slug: "taqlid",
            arabic_text: "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ",
            content:
              "Taqlid means following the opinion of a qualified scholar or madhab (school of thought) without knowing the detailed evidence. For the ordinary Muslim who does not have the ability to derive rulings directly from the Quran and Sunnah, it is obligatory to follow those who have knowledge. Allah says: 'Ask the people of knowledge if you do not know.' (16:43). The four established madhabs — Hanafi, Maliki, Shafi'i, and Hanbali — are all valid and follow the Quran and Sunnah. The differences among them are differences of mercy and are usually in minor matters, not in principles of faith. The Prophet's companions differed among themselves on many issues, yet they remained brothers. The scholars of each madhab agreed on the fundamentals and differed only on some subsidiary matters based on their understanding of the evidence. A layperson may follow any of the four madhabs. However, it is not permissible to follow a madhab for the sake of personal desire or to seek leniency by picking and choosing — rather one should follow a madhab with respect and commit to its methodology. If a person finds that the evidence in another madhab is stronger on a particular issue, they may follow it as long as they are not doing so merely to follow their whims.\n\nSource: islamqa.info/en/answers/31805",
            order_index: 2,
          },
          {
            title: "Maqasid al-Shariah (Higher Objectives of Law)",
            title_ar: "مقاصد الشريعة",
            slug: "maqasid-al-shariah",
            arabic_text: "الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِي وَرَضِيتُ لَكُمُ الْإِسْلَامَ دِينًا",
            content:
              "Maqasid al-Shariah (the higher objectives of Islamic law) refer to the purposes and goals that the Shariah aims to achieve. Scholars have identified five essential objectives (al-daruriyyat al-khamsah) that the Shariah protects: (1) Protection of religion (hifz al-din) — preserving the freedom to worship and practice Islam; (2) Protection of life (hifz al-nafs) — the prohibition of murder and the preservation of human life; (3) Protection of intellect (hifz al-aql) — the prohibition of intoxicants that cloud the mind; (4) Protection of lineage (hifz al-nasl) — the regulation of marriage and prohibition of zina (adultery); (5) Protection of property (hifz al-mal) — the prohibition of theft, fraud, and usury. In addition to these essentials, the Shariah also considers needs (hajiyyat) that make life easier, and improvements (tahsiniyyat) that beautify and perfect human conduct. Understanding the maqasid helps scholars apply Islamic law in new situations. For example, the permissibility of breaking the fast while traveling is based on the objective of preventing hardship. The maqasid are not independent sources of law — they are derived from the texts and used as tools for understanding and applying the revealed law correctly.\n\nSource: islamqa.info/en/answers/93412",
            order_index: 3,
          },
        ],
      },
    ],
  },

  // ─── 9. Dawah ──────────────────────────────────────────────────────
  {
    title: "Dawah",
    title_ar: "الدعوة",
    description:
      "Learn the principles and methods of calling to Allah with wisdom, beautiful preaching, and sound argumentation.",
    description_ar:
      "تعلم مبادئ وأساليب الدعوة إلى الله بالحكمة والموعظة الحسنة والمجادلة بالتي هي أحسن.",
    level: "intermediate",
    slug: "dawah",
    order_index: 9,
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
            video_url: "https://www.youtube.com/embed/IUBqdHmfEFI?si=dawah01&start=0&end=600",
            content:
              "Calling people to Allah, may He be exalted, is a communal obligation (fard kifayah) upon the ummah and it is an individual obligation (fard 'ayn) upon every Muslim, according to his level of ability and knowledge. The Prophet (blessings and peace of Allah be upon him) said: \"Convey from me, even if it is only one verse.\" (Narrated by al-Bukhari, 3461)\n\nIbn Katheer (may Allah have mercy on him) said, in his commentary on the verse \"Let there arise out of you a group of people inviting to all that is good\" (Aal 'Imraan 3:104): \"What is meant by this verse is that there should be a group of this ummah who carry out this mission; however, that is also obligatory upon every individual of the ummah according to his means.\" (Tafseer Ibn Katheer, 2/78)\n\nShaykh 'Abd al-'Azeez ibn Baaz (may Allah have mercy on him) said: \"The evidence from the Quran and Sunnah indicates that it is obligatory to call people to Allah, may He be glorified and exalted, and that this is one of the obligatory duties.\" (Majmoo' Fataawa Ibn Baaz, 1/330)\n\nIf sufficient numbers of people undertake dawah, the duty is waived from the others and for the others dawah becomes a confirmed Sunnah and a great righteous deed. But if the people of a specific area do not undertake dawah, the burden of sin is incurred by all of them.\n\nReference: Islam Q&A, Answer 186813",
            order_index: 1,
          },
          {
            title: "The Methodology of Dawah",
            title_ar: "منهج الدعوة",
            slug: "methodology-of-dawah",
            arabic_text: "وَجَادِلْهُم بِالَّتِي هِيَ أَحْسَنُ",
            video_url: "https://www.youtube.com/embed/IUBqdHmfEFI?si=dawah01&start=600&end=0",
            content:
              "Allah, may He be exalted, says (interpretation of the meaning): \"Invite (mankind, O Muhammad SAW) to the Way of your Lord (i.e. Islam) with wisdom (i.e. with the Divine Inspiration and the Quran) and fair preaching, and argue with them in a way that is better\" [an-Nahl 16:125]. This verse establishes the three methods of dawah: wisdom (hikmah), beautiful preaching (maw'izah hasanah), and arguing in a way that is better.\n\nShaykh 'Abd al-'Azeez ibn Baaz (may Allah have mercy on him) said, commenting on the obligation of dawah: \"The evidence from the Quran and Sunnah indicates that it is obligatory to call people to Allah, may He be glorified and exalted.\" (Majmoo' Fataawa Ibn Baaz, 1/330)\n\nThe caller should go ahead and call people with wisdom and beautiful preaching, with clear proof, and with patience in dealing with them. Allah says (interpretation of the meaning): \"Say (O Muhammad SAW): 'This is my way; I invite unto Allah (i.e. to the Oneness of Allah - Islamic Monotheism) with sure knowledge, I and whosoever follows me (also must invite others to Allah i.e., to the Oneness of Allah - Islamic Monotheism) with sure knowledge'\" [Yoosuf 12:108].\n\nReference: Islam Q&A, Answer 186813",
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
            video_url: "https://www.youtube.com/embed/Mp0WtZYxlds?si=dawah02&start=0&end=600",
            content:
              "This information could not be verified on islamqa.info.",
            order_index: 1,
          },
          {
            title: "Dawah to Muslims and Non-Muslims",
            title_ar: "الدعوة للمسلمين وغير المسلمين",
            slug: "dawah-muslims-non-muslims",
            arabic_text: "رَبَّنَا إِنَّنَا سَمِعْنَا مُنَادِيًا يُنَادِي لِلْإِيمَانِ",
            video_url: "https://www.youtube.com/embed/Mp0WtZYxlds?si=dawah02&start=600&end=0",
            content:
              "There is no need at all for differences as to which work should take precedence: calling Muslims or calling non-Muslims. The one whom Allah enables to do any of that should go ahead with it.\n\nThere are some Muslims who are good at calling non-Muslims, because Allah has given them the ability to explain things clearly or to convince people easily, or He has enabled him to learn the language of the non-Muslims whom he is calling, or because of the nature of his work. In such cases we say to the individual: Go ahead and call these people with wisdom and beautiful preaching, with clear proof, and with patience in dealing with them.\n\nAnd there are some Muslims who are good at calling their fellow Muslims, because of some of the things that have been mentioned above; or because he has skills in convincing and debating in various issues and establishing clear proof; or because he is well versed in some branches of Islamic knowledge that may be needed more by one who calls Muslims than one who calls non-Muslims.\n\nBoth are necessary according to sharee'ah, and each person will be enabled to do that for which he was created. The one who finds that he has an interest and is able to work in either of the two fields should not denounce anyone who works in the other field, because both of them are good and are necessary.\n\nReference: Islam Q&A, Answer 186813",
            order_index: 2,
          },
        ],
      },
      {
        title: "Advanced Dawah",
        title_ar: "الدعوة المتقدمة",
        slug: "advanced-dawah",
        order_index: 3,
        lessons: [
          {
            title: "Dawah in the Modern Age",
            title_ar: "الدعوة في العصر الحديث",
            slug: "dawah-modern-age",
            arabic_text: "ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ",
            content:
              "Dawah in the modern age comes with unique challenges and opportunities. The internet and social media have made it possible to reach millions of people with the message of Islam. However, they also spread misinformation and distractions. The principles of dawah remain the same: calling to Allah with wisdom (hikmah), good preaching (maw'izah hasanah), and debating in the best manner (jidal bil-ahsan) as Allah commands in 16:125. The Prophet (peace and blessings of Allah be upon him) said: 'Convey from me, even if it is one verse.' (Bukhari). Effective modern dawah requires: (1) Using digital platforms — creating quality Islamic content on YouTube, social media, and websites; (2) Understanding the audience — addressing the questions and doubts of contemporary people, especially about science, feminism, human rights, and pluralism; (3) Being proactive — engaging with popular culture and current events to present an Islamic perspective; (4) Collaboration — working together with other da'wah organizations and avoiding divisiveness. The Muslim must also be mindful of the manners of dawah: being gentle, patient, and merciful, as the Prophet was. Allah said to Musa and Harun when sending them to Pharaoh: 'Speak to him softly; perhaps he may be reminded or fear Allah.' (20:44). If the Prophet was commanded to be gentle with Pharaoh, how much more should we be gentle with ordinary people seeking the truth.\n\nSource: islamqa.info/en/answers/32043",
            order_index: 1,
          },
          {
            title: "Dawah to People of Other Faiths",
            title_ar: "الدعوة لأتباع الديانات الأخرى",
            slug: "dawah-other-faiths",
            arabic_text: "وَلَا تُجَادِلُوا أَهْلَ الْكِتَابِ إِلَّا بِالَّتِي هِيَ أَحْسَنُ",
            content:
              "Calling people of other faiths to Islam requires special knowledge and sensitivity. The Quran provides the best guidance for this: 'And do not argue with the People of the Book except in the best manner, except those who do wrong among them. And say: We believe in what has been revealed to us and what has been revealed to you. Our God and your God is One, and to Him we submit.' (29:46). When calling Jews and Christians, it is effective to focus on the common ground — belief in one God, the prophets, and the moral teachings. The Quran tells us to say: 'Say: O People of the Book, come to a common word between us and you: that we worship none but Allah.' (3:64). When calling Hindus, Buddhists, or atheists, one should start with the belief in God, drawing on rationality and the fitrah (innate nature). The Prophet sent letters to the rulers of his time — the Negus of Abyssinia, Heraclius of Byzantium, the Chosroes of Persia, and the Muqawqis of Egypt — each tailored to their specific beliefs and context. Key principles include: (1) Respecting other faiths without compromising Islamic teachings; (2) Understanding what the other person believes before presenting Islam; (3) Being patient and not expecting immediate results; (4) Focusing on the positive message of Islam — mercy, justice, and the relationship with God; (5) Using evidence from their own scriptures where appropriate, such as the prophecies about Muhammad in the Bible.\n\nSource: islamqa.info/en/answers/32043",
            order_index: 2,
          },
        ],
      },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding 9 courses with sections and lessons...\n");

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

  console.log("✅ Seed complete! 9 courses seeded.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
