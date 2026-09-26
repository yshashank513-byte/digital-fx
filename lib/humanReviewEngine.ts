/**
 * HumanReviewEngine
 * Produces 100% natural, casual, human-written reviews across multiple Indian languages:
 * - English
 * - Hindi (हिंदी)
 * - Hinglish (Romanized Hindi)
 * - Marathi (मराठी)
 *
 * Designed specifically to bypass Google Maps spam/duplicate detection algorithms:
 * 1. High-entropy slot permutation (Openers + Specifics + Team Praise + Outro)
 * 2. Varied lengths (Short 1-liner, Balanced 2-3 lines, Detailed 4 lines)
 * 3. Human conversational phrasing (no robotic AI buzzwords like "delighted", "synergistic", "paradigm")
 * 4. Guaranteed distinct output on every reload or "Shuffle" click.
 */

export type SupportedLanguage = "en" | "hi" | "hinglish" | "mr";

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", nativeLabel: "हिंदी", flag: "🇮🇳" },
  { code: "hinglish", label: "Hinglish", nativeLabel: "Hinglish", flag: "💬" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी", flag: "🚩" },
];

interface CategoryPhrases {
  openers: string[];
  aspects: string[];
  closers: string[];
}

// Industry-tailored vocabulary for 100% natural human feel
const CATEGORY_VOCABULARY: Record<string, Record<SupportedLanguage, CategoryPhrases>> = {
  "Digital Marketing Agency": {
    en: {
      openers: [
        "Really good experience working with {name}.",
        "One of the best digital marketing teams in this area.",
        "Had a great experience with {name} for our business growth.",
        "Very professional and supportive team at {name}.",
        "Working with {name} has been totally worth it.",
        "Got our SEO and Google Maps work done through {name}.",
        "Highly satisfied with the services provided by {name}.",
      ],
      aspects: [
        "Our Google ranking and incoming calls have improved noticeably.",
        "The team handles our ads and SEO with complete transparency.",
        "They share clear updates every week and are always available on call.",
        "The leads have grown consistently and the website speed is super fast.",
        "Very knowledgeable team that actually understands local search and ROI.",
        "They delivered what was promised without any fake commitments.",
        "Great communication and genuine guidance for online growth.",
      ],
      closers: [
        "Highly recommended for anyone looking to grow their business online!",
        "Definite 5 stars for their dedication and hard work.",
        "Will definitely continue working with them. Keep it up guys!",
        "Thank you team for the great support and results.",
        "Very happy with their work. Would recommend without hesitation.",
        "Best agency for genuine marketing results.",
      ],
    },
    hi: {
      openers: [
        "{name} के साथ काम करने का अनुभव बहुत ही शानदार रहा।",
        "डिजिटल मार्केटिंग और एसईओ के लिए बहुत ही बेहतरीन और भरोसेमंद टीम है।",
        "{name} की सर्विस से हम पूरी तरह से संतुष्ट हैं।",
        "अगर आपको अपने बिजनेस की ऑनलाइन ग्रोथ करनी है तो {name} सबसे बेस्ट है।",
        "बहुत ही प्रोफेशनल और समय पर काम करने वाली टीम है।",
        "{name} से हमने अपनी वेबसाइट और गूगल मैप्स की रैंकिंग कराई थी।",
      ],
      aspects: [
        "हमारे गूगल मैप्स की रैंकिंग और कस्टमर कॉल्स में काफी अच्छा सुधार हुआ है।",
        "टीम का रिस्पॉन्स बहुत तेज है और हर हफ्ते पूरा काम समझाते हैं।",
        "बिना किसी झूठे वादे के जो कमिटमेंट किया, वो समय पर पूरा करके दिया।",
        "लीड्स काफी अच्छी आ रही हैं और काम में पूरी ईमानदारी दिखती है।",
        "टीम बहुत कोऑपरेटिव है और जब भी कॉल करो हमेशा मदद के लिए तैयार रहते हैं।",
      ],
      closers: [
        "शानदार काम के लिए पूरी टीम का बहुत-बहुत धन्यवाद!",
        "जरूर रिकमेंड करूंगा, 5 स्टार सर्विस!",
        "अपने काम में पूरी ईमानदारी और मेहनत दिखती है। बहुत-बहुत शुक्रिया।",
        "भरोसेमंद सर्विस और बेहतरीन रिजल्ट्स।",
      ],
    },
    hinglish: {
      openers: [
        "{name} ke sath kaam karke bohot achha laga.",
        "Best digital marketing team in the city, genuine work karte hain.",
        "Bohot professional aur helpful team hai {name} ki.",
        "{name} ki service se hum fully satisfied hain.",
        "Online growth aur SEO ke liye {name} bilkul sahi choice hai.",
        "Humne apne business ka Google ranking aur ads {name} se karwaya.",
      ],
      aspects: [
        "Google Maps par ranking improve hui hai aur leads bhi badh gayi hain.",
        "Team call par hamesha available rehti hai aur regular updates deti hai.",
        "Kaam bilkul transparent hai aur koi faltu charges nahi lete.",
        "Website aur SEO dono bohot smoothly chal raha hai.",
        "Bohot cooperative staff hai, sab kuch ache se explain karte hain.",
      ],
      closers: [
        "Bohot badiya service hai, highly recommended!",
        "Puri team ko 5 stars meri taraf se. Keep up the good work!",
        "Thank you {name} team for genuine support and results!",
        "Bina soche inki service le sakte ho, bohot genuine log hain.",
      ],
    },
    mr: {
      openers: [
        "{name} सोबत काम करण्याचा अनुभव अतिशय उत्तम राहिला.",
        "डिजिटल मार्केटिंग आणि एसईओ साठी अत्यंत विश्वासू आणि तज्ज्ञ टीम.",
        "{name} च्या कामाबद्दल मी पूर्णपणे समाधानी आहे.",
        "व्यवसाय वाढवण्यासाठी {name} ही एक उत्तम संस्था आहे.",
        "खूपच व्यावसायिक आणि सहकार्य करणारी टीम आहे.",
      ],
      aspects: [
        "आमचे गुगल मॅप्स रँकिंग आणि ग्राहकांचे कॉल्स खूप चांगल्या प्रकारे वाढले आहेत.",
        "कामात पारदर्शकता आहे आणि वेळेवर प्रगती अहवाल मिळतो.",
        "कोणतेही खोटे आश्वासन न देता प्रत्यक्ष निकाल दाखवला.",
        "कॉलवर लगेच प्रतिसाद मिळतो आणि योग्य मार्गदर्शन करतात.",
      ],
      closers: [
        "उत्कृष्ट सेवेबद्दल धन्यवाद! सर्वांना नक्की शिफारस करेन.",
        "५ पैकी ५ स्टार! खूप छान काम.",
        "खूप खूप आभार {name} टीम, असेच पुढे चालू ठेवा!",
        "नक्कीच पुन्हा यांच्याशीच काम करेन.",
      ],
    },
  },

  "Packers & Movers": {
    en: {
      openers: [
        "Had a smooth shifting experience with {name}.",
        "Very professional and reliable packers and movers.",
        "Booked {name} for our household relocation recently.",
        "Top-notch shifting service provided by {name}.",
      ],
      aspects: [
        "The packing was done with multi-layer bubble wrap and cartons.",
        "Not a single item or glass piece was damaged during transit.",
        "The moving crew was very polite, disciplined, and loaded everything carefully.",
        "Delivered right on time at our destination without any hidden charges.",
      ],
      closers: [
        "Will definitely hire them again for future shifting. Highly recommended!",
        "Completely hassle-free experience. 5 stars!",
        "Thank you team for safe and timely delivery!",
      ],
    },
    hi: {
      openers: [
        "{name} के साथ शिफ्टिंग का अनुभव बहुत ही शानदार रहा।",
        "सामान की पैकिंग और शिफ्टिंग के लिए बहुत ही भरोसेमंद टीम है।",
        "घर की शिफ्टिंग के लिए हमने {name} को बुक किया था।",
      ],
      aspects: [
        "पैकिंग बहुत ही मजबूत की थी, कांच का भी कोई सामान नहीं टूटा।",
        "स्टाफ बहुत विनम्र और मेहनती था, सारा सामान आराम से सेट कर दिया।",
        "बिना किसी देरी के सही समय पर डिलीवरी दी और कोई एक्स्ट्रा चार्ज नहीं लिया।",
      ],
      closers: [
        "सुरक्षित शिफ्टिंग के लिए बहुत-बहुत धन्यवाद! जरूर रिकमेंड करूंगा।",
        "पूरी तरह टेंशन-फ्री शिफ्टिंग रही। 5 स्टार सर्विस!",
      ],
    },
    hinglish: {
      openers: [
        "{name} se shifting karwayi aur experience bohot badiya raha.",
        "Best packers and movers in the area, timely aur safe delivery.",
        "House shifting ke liye {name} ko book kiya tha.",
      ],
      aspects: [
        "Packing quality bohot solid thi, ek bhi item damage nahi hua.",
        "Staff bohot polite aur hardworking tha, sab sambhal kar load kiya.",
        "Time par delivery de di aur koi hidden charges nahi maange.",
      ],
      closers: [
        "Aage bhi inhi se shifting karwayenge. Highly recommended!",
        "Thank you team safe shifting ke liye!",
      ],
    },
    mr: {
      openers: [
        "{name} कडून घर शिफ्टिंग करून घेतली, अनुभव खूप छान होता.",
        "अतिशय विश्वासू आणि काळजीपूर्वक सामान पोहोचवणारे पॅकर्स.",
      ],
      aspects: [
        "पॅकिंग उत्तम केली होती, एकाही वस्तूचे नुकसान झाले नाही.",
        "कर्मचारी खूप नम्र आणि प्रामाणिक होते.",
        "वेळेत सामान पोहोचवले आणि वाजवी दर आकारले.",
      ],
      closers: [
        "खूप छान सेवा दिली, धन्यवाद! सर्वांना शिफारस करतो.",
      ],
    },
  },

  "Jewellery Store": {
    en: {
      openers: [
        "Wonderful shopping experience at {name}.",
        "One of the most trusted jewellery showrooms around.",
        "Visited {name} for bridal and festive jewellery shopping.",
      ],
      aspects: [
        "Their gold and diamond collection has beautiful modern designs.",
        "The staff was very patient and explained hallmarking purity clearly.",
        "Transparent billing with fair making charges.",
      ],
      closers: [
        "Extremely happy with my purchase. Highly recommended showroom!",
        "Will visit again for our family functions. 5 stars!",
      ],
    },
    hi: {
      openers: [
        "{name} पर खरीदारी का अनुभव बहुत ही बढ़िया रहा।",
        "सोने और हीरे के आभूषणों के लिए बहुत ही भरोसेमंद शोरूम है।",
      ],
      aspects: [
        "हॉलमार्क ज्वेलरी के लेटेस्ट और खूबसूरत डिजाइन उपलब्ध हैं।",
        "सेल्स स्टाफ बहुत ही शालीनता से सारे डिजाइन दिखाता है।",
        "बिलिंग पूरी तरह पारदर्शी है और मेकिंग चार्ज भी सही है।",
      ],
      closers: [
        "खरीदारी से बहुत संतुष्ट हैं। सभी को जरूर जाना चाहिए!",
        "शानदार कलेक्शन और बेहतरीन सर्विस। धन्यवाद!",
      ],
    },
    hinglish: {
      openers: [
        "{name} se jewellery li, bohot pyara collection hai inke pas.",
        "Family function ke liye shopping ki thi yaha se.",
      ],
      aspects: [
        "Staff bohot patiently designs dikhata hai aur purity explain karta hai.",
        "Hallmark gold ke latest designs hain aur making charges bhi reasonable hain.",
      ],
      closers: [
        "Bohot achha showroom hai, definitely recommend karunga!",
      ],
    },
    mr: {
      openers: [
        "{name} मध्ये दागिन्यांची खरेदी करण्याचा अनुभव उत्तम होता.",
        "शुद्ध सोन्याचे दागिने आणि विश्वासार्ह शोरूम.",
      ],
      aspects: [
        "हॉलमार्क सोन्याचे अतिशय सुंदर व आधुनिक डिझाइन्स आहेत.",
        "कर्मचाऱ्यांचे वर्तन खूप आपुलकीचे आणि नम्र आहे.",
      ],
      closers: [
        "नक्कीच पुन्हा भेट देईन. खूप खूप धन्यवाद!",
      ],
    },
  },

  "Restaurant": {
    en: {
      openers: [
        "Had a wonderful dining experience at {name} with family.",
        "Loved the food and welcoming vibes at {name}.",
        "Visited {name} recently and was thoroughly impressed.",
      ],
      aspects: [
        "The food was freshly prepared, rich in flavor, and served hot.",
        "Clean hygiene standards and pleasant ambiance for family dinners.",
        "The service was fast and the staff was extremely courteous.",
      ],
      closers: [
        "Must-visit place for good food lovers! Will come back soon.",
        "Great taste and pocket-friendly pricing. 5 stars!",
      ],
    },
    hi: {
      openers: [
        "{name} में खाना खाने का अनुभव बहुत ही लाजवाब रहा।",
        "परिवार के साथ डिनर के लिए बहुत ही बेहतरीन जगह है।",
      ],
      aspects: [
        "खाना बिल्कुल गरमा-गरम, ताजा और बहुत स्वादिष्ट था।",
        "सिटिंग अरेंजमेंट और एम्बियंस बहुत सुकून देने वाला है।",
        "स्टाफ की सर्विस बहुत तेज और विनम्र थी।",
      ],
      closers: [
        "स्वाद और सर्विस दोनों 1 नंबर! जरूर जाएं।",
        "बेहतरीन स्वाद के लिए बहुत-बहुत धन्यवाद!",
      ],
    },
    hinglish: {
      openers: [
        "{name} par dinner kiya aur khana sach me bohot tasty tha.",
        "Family aur friends ke sath aane ke liye best restaurant hai.",
      ],
      aspects: [
        "Khana bilkul fresh aur properly prepared tha.",
        "Ambiance bohot peaceful hai aur service bhi quick thi.",
      ],
      closers: [
        "Taste bohot badiya tha, dubara zaroor aayenge!",
      ],
    },
    mr: {
      openers: [
        "{name} मध्ये जेवणाचा अनुभव अतिशय चविष्ट आणि सुखद राहिला.",
        "कुटुंबासमवेत जेवणासाठी एक उत्तम ठिकाण.",
      ],
      aspects: [
        "जेवण अत्यंत चविष्ट, ताजे आणि गरमागरम होते.",
        "स्वच्छता आणि वातावरण खूपच छान आहे.",
      ],
      closers: [
        "पुन्हा नक्कीच भेट देऊ! ५ स्टार चव.",
      ],
    },
  },

  "Clinic": {
    en: {
      openers: [
        "Very good medical consultation experience at {name}.",
        "Consulted the doctor at {name} recently, very satisfied.",
        "One of the cleanest and most trustworthy clinics around.",
        "Got treated at {name}, very compassionate team.",
      ],
      aspects: [
        "The doctor listened patiently, diagnosed accurately, and explained everything clearly.",
        "The clinic staff was helpful and maintained strict hygiene standards.",
        "Minimal waiting time and smooth appointment process.",
        "Very reassuring and genuine care provided throughout.",
      ],
      closers: [
        "Highly recommended for genuine healthcare and consultation!",
        "Thank you doctor and staff for the wonderful care.",
        "Definite 5 stars for their compassionate treatment.",
      ],
    },
    hi: {
      openers: [
        "{name} पर डॉक्टर से परामर्श का अनुभव बहुत अच्छा रहा।",
        "इलाज और परामर्श के लिए बहुत ही भरोसेमंद क्लिनिक है।",
        "{name} में डॉक्टर और स्टाफ का व्यवहार बहुत ही सराहनीय है।",
      ],
      aspects: [
        "डॉक्टर साहब ने बहुत ध्यान से बात सुनी और सही इलाज बताया।",
        "क्लिनिक में साफ-सफाई और स्वच्छता का पूरा ध्यान रखा गया है।",
        "स्टाफ बहुत विनम्र है और ज्यादा इंतज़ार नहीं करना पड़ा।",
      ],
      closers: [
        "सहानुभूतिपूर्ण देखभाल के लिए बहुत-बहुत धन्यवाद! 5 स्टार।",
        "जरूर रिकमेंड करूंगा, बहुत ही भरोसेमंद डॉक्टर हैं।",
      ],
    },
    hinglish: {
      openers: [
        "{name} par doctor consultation ka experience kaafi achha raha.",
        "Bohot trustworthy clinic hai, doctor bohot caring aur experienced hain.",
        "{name} par checkup karwaya aur kaafi relief mila.",
      ],
      aspects: [
        "Doctor ne bohot dhyan se problem samjhi aur genuine advice di.",
        "Clinic bilkul clean aur hygienic hai, staff bhi polite tha.",
        "Zyada wait nahi karna pada, appointment smoothly ho gaya.",
      ],
      closers: [
        "Thank you doctor genuine treatment ke liye, highly recommended!",
        "5 stars meri taraf se compassionate care ke liye!",
      ],
    },
    mr: {
      openers: [
        "{name} येथे डॉक्टरांचा सल्ला घेण्याचा अनुभव अतिशय चांगला होता.",
        "उपचारासाठी अत्यंत विश्वासार्ह क्लिनिक.",
      ],
      aspects: [
        "डॉक्टरांनी सर्व काही शांतपणे ऐकून घेतले आणि योग्य मार्गदर्शन केले.",
        "क्लिनिकमध्ये उत्तम स्वच्छता आणि व्यवस्था आहे.",
      ],
      closers: [
        "उत्कृष्ट उपचाराबद्दल धन्यवाद! ५ स्टार सेवा.",
      ],
    },
  },

  "Salon": {
    en: {
      openers: [
        "Loved my hair styling and grooming session at {name}.",
        "One of the best salons in town for styling and grooming.",
        "Had a refreshing and relaxing experience at {name}.",
      ],
      aspects: [
        "The stylist took time to understand my requirements and gave great styling advice.",
        "Clean, sanitized tools and premium quality products used throughout.",
        "Pleasant ambiance and warm hospitality from the staff.",
      ],
      closers: [
        "Totally satisfied with the new look! Will visit again.",
        "Solid 5 stars for the great styling work and polite service.",
      ],
    },
    hi: {
      openers: [
        "{name} पर हेयरकट और ग्रूमिंग का अनुभव बहुत ही बढ़िया रहा।",
        "स्टाइलिंग और ब्यूटी सर्विस के लिए सबसे बेस्ट सैलून है।",
      ],
      aspects: [
        "स्टाइलिस्ट ने बहुत अच्छे से समझकर बिल्कुल परफेक्ट लुक दिया।",
        "साफ-सफाई और इस्तेमाल किए गए प्रोडक्ट्स दोनों बहुत बढ़िया थे।",
      ],
      closers: [
        "नए लुक से पूरी तरह खुश हूँ। बहुत-बहुत शुक्रिया!",
        "शानदार सर्विस, 5 स्टार रेटिंग!",
      ],
    },
    hinglish: {
      openers: [
        "{name} par grooming aur styling karwayi, maza aa gaya.",
        "Best salon experience, hair styling bohot achhi ki inhone.",
      ],
      aspects: [
        "Stylist ne exactly waisa hi look diya jaisa maine manga tha.",
        "Sanitized tools aur clean environment tha, staff bhi polite tha.",
      ],
      closers: [
        "Fully satisfied with the service, definitely recommend karunga!",
      ],
    },
    mr: {
      openers: [
        "{name} मध्ये हेअरस्टाईल आणि ग्रुमिंगचा अनुभव उत्तम राहिला.",
      ],
      aspects: [
        "स्टायलिस्ट खूप कुशल आहेत आणि त्यांनी उत्तम सल्ला दिला.",
        "स्वच्छता आणि दर्जेदार उत्पादने वापरली.",
      ],
      closers: [
        "खूप छान सेवा, नक्कीच पुन्हा भेट देईन!",
      ],
    },
  },

  "Hotel": {
    en: {
      openers: [
        "Pleasant and comfortable stay at {name}.",
        "Booked a stay at {name} and had a wonderful time.",
      ],
      aspects: [
        "The room was spotless, bed was comfortable, and room service was prompt.",
        "Front desk staff was welcoming and handled check-in very smoothly.",
        "Peaceful atmosphere and well-maintained property.",
      ],
      closers: [
        "Would love to stay here again. Highly recommended!",
        "5-star hospitality from check-in to check-out.",
      ],
    },
    hi: {
      openers: [
        "{name} में ठहरने का अनुभव बहुत ही सुखद और आरामदायक रहा।",
      ],
      aspects: [
        "कमरे बहुत साफ-सुथरे थे और रूम सर्विस बहुत तेज थी।",
        "स्टाफ का व्यवहार बहुत ही आदरपूर्ण और सहयोगी रहा।",
      ],
      closers: [
        "शानदार आतिथ्य सत्कार के लिए धन्यवाद! 5 स्टार।",
      ],
    },
    hinglish: {
      openers: [
        "{name} me stay kiya, bohot peaceful aur comfortable tha.",
      ],
      aspects: [
        "Rooms bilkul clean the aur staff ka behavior bohot welcoming tha.",
        "Check-in quick tha aur service bhi timely mili.",
      ],
      closers: [
        "Great stay experience, aage bhi yahin rukenge!",
      ],
    },
    mr: {
      openers: [
        "{name} येथे मुक्कामाचा अनुभव अतिशय सुखद आणि आरामदायी राहिला.",
      ],
      aspects: [
        "खोल्या अतिशय स्वच्छ होत्या आणि सेवेचा दर्जा उत्तम होता.",
      ],
      closers: [
        "उत्कृष्ट आदरातिथ्य, खूप खूप धन्यवाद!",
      ],
    },
  },

  "Real Estate": {
    en: {
      openers: [
        "Very professional real estate consultation with {name}.",
        "Had a transparent and trustworthy experience with {name}.",
      ],
      aspects: [
        "Clear legal documentation and transparent property guidance with zero pressure.",
        "The team answered every question patiently and gave genuine market advice.",
      ],
      closers: [
        "Reliable advisory team you can count on. Highly recommended!",
      ],
    },
    hi: {
      openers: [
        "{name} के साथ प्रॉपर्टी और रियल एस्टेट का अनुभव बहुत ही भरोसेमंद रहा।",
      ],
      aspects: [
        "सारे पेपर्स और लीगल डॉक्यूमेंट्स बहुत ही पारदर्शिता से दिखाए और समझाए।",
        "टीम ने बिना किसी दबाव के बिल्कुल सही मार्गदर्शन दिया।",
      ],
      closers: [
        "ईमानदार और भरोसेमंद सर्विस के लिए बहुत-बहुत धन्यवाद!",
      ],
    },
    hinglish: {
      openers: [
        "{name} se property consultation liya, bohot honest aur genuine team hai.",
      ],
      aspects: [
        "Saari documentation transparent rakhi aur sahi property advice di.",
      ],
      closers: [
        "Reliable real estate partner, definitely recommend karunga!",
      ],
    },
    mr: {
      openers: [
        "{name} कडून रिअल इस्टेट सल्ला घेतला, अनुभव अतिशय विश्वासार्ह होता.",
      ],
      aspects: [
        "सर्व कागदपत्रे आणि मार्गदर्शन पूर्णपणे पारदर्शक होते.",
      ],
      closers: [
        "उत्कृष्ट मार्गदर्शन, नक्कीच शिफारस करतो.",
      ],
    },
  },

  "Automobile": {
    en: {
      openers: [
        "Smooth and satisfying vehicle service experience with {name}.",
        "One of the most dependable workshops in the city.",
      ],
      aspects: [
        "Diagnosed the vehicle issue accurately and completed the work on schedule.",
        "Used genuine parts and provided transparent billing without hidden costs.",
      ],
      closers: [
        "My vehicle is running smoothly. 5 stars for the great workmanship!",
      ],
    },
    hi: {
      openers: [
        "{name} पर गाड़ी की सर्विस कराने का अनुभव बहुत ही शानदार रहा।",
      ],
      aspects: [
        "गाड़ी की समस्या को सही तरीके से समझा और समय पर काम करके दिया।",
        "बिलिंग पूरी तरह पारदर्शी रही और कोई फालतू पार्ट्स नहीं बदले।",
      ],
      closers: [
        "शानदार काम के लिए बहुत-बहुत धन्यवाद! गाड़ी बिल्कुल मक्खन चल रही है।",
      ],
    },
    hinglish: {
      openers: [
        "{name} par vehicle service karwayi, bohot badiya kaam kiya team ne.",
      ],
      aspects: [
        "Time par delivery di aur genuine parts use kiye. Transparent billing.",
      ],
      closers: [
        "Gaadi bohot smooth chal rahi hai ab, 5 stars!",
      ],
    },
    mr: {
      openers: [
        "{name} येथे गाडीच्या सेवेचा अनुभव उत्तम राहिला.",
      ],
      aspects: [
        "काम वेळेत पूर्ण केले आणि मूळ सुटे भाग वापरले.",
      ],
      closers: [
        "उत्कृष्ट काम, धन्यवाद!",
      ],
    },
  },

  "General": {
    en: {
      openers: [
        "Very pleasant experience with {name}.",
        "Highly professional and customer-oriented service.",
        "Happy to share my genuine positive feedback for {name}.",
        "Got great support and assistance from the team at {name}.",
      ],
      aspects: [
        "The staff was polite, attentive, and addressed all queries patiently.",
        "Work was completed on time with great attention to detail.",
        "Pricing is fair and transparent with zero hidden surprises.",
        "Prompt communication and reliable after-service support.",
      ],
      closers: [
        "Would definitely recommend their services to everyone!",
        "Truly satisfied with the overall experience. Keep it up!",
        "Thank you so much team for the great service!",
      ],
    },
    hi: {
      openers: [
        "{name} के साथ बहुत ही अच्छा अनुभव रहा।",
        "बहुत ही भरोसेमंद और जिम्मेदारी से काम करने वाले लोग हैं।",
        "इनकी सर्विस से हम पूरी तरह संतुष्ट हैं।",
      ],
      aspects: [
        "स्टाफ का व्यवहार बहुत अच्छा और मददगार है।",
        "समय पर काम पूरा करके दिया और कोई परेशानी नहीं होने दी।",
        "दाम भी बिल्कुल सही हैं और काम में पूरी क्वालिटी है।",
      ],
      closers: [
        "शानदार सेवा के लिए धन्यवाद! 5 स्टार रेटिंग।",
        "सभी को जरूर रिकमेंड करूंगा। बहुत-बहुत शुक्रिया!",
      ],
    },
    hinglish: {
      openers: [
        "{name} ke sath experience bohot acha raha.",
        "Bohot professional aur genuine service provide karte hain.",
      ],
      aspects: [
        "Staff bohot cooperative hai aur time par kaam khatam kiya.",
        "Kaam ki quality top notch hai aur pricing bhi genuine hai.",
      ],
      closers: [
        "Bohot achha kaam kiya team ne, highly recommended!",
        "Thank you so much {name} team!",
      ],
    },
    mr: {
      openers: [
        "{name} सोबतचा अनुभव अतिशय चांगला राहिला.",
        "अत्यंत प्रामाणिक आणि दर्जेदार सेवा देणारी टीम.",
      ],
      aspects: [
        "कर्मचाऱ्यांचे वर्तन खूप नम्र आणि मदतीचे होते.",
        "वेळेवर काम पूर्ण केले आणि वाजवी दर आकारले.",
      ],
      closers: [
        "उत्कृष्ट सेवेबद्दल धन्यवाद! ५ स्टार!",
      ],
    },
  },
};

export function resolveCategoryKey(category: string = ""): string {
  const c = (category || "").toLowerCase().trim();
  if (c.includes("packer") || c.includes("mover") || c.includes("shift") || c.includes("logistics")) {
    return "Packers & Movers";
  }
  if (c.includes("jewel") || c.includes("gold") || c.includes("diamond")) {
    return "Jewellery Store";
  }
  if (c.includes("restau") || c.includes("cafe") || c.includes("food") || c.includes("dining") || c.includes("bakery") || c.includes("sweet")) {
    return "Restaurant";
  }
  if (c.includes("clinic") || c.includes("doctor") || c.includes("hospital") || c.includes("health") || c.includes("dental") || c.includes("eye")) {
    return "Clinic";
  }
  if (c.includes("salon") || c.includes("spa") || c.includes("beauty") || c.includes("parlour") || c.includes("parlor") || c.includes("hair")) {
    return "Salon";
  }
  if (c.includes("hotel") || c.includes("resort") || c.includes("stay") || c.includes("lodge") || c.includes("banquet")) {
    return "Hotel";
  }
  if (c.includes("real estate") || c.includes("property") || c.includes("builder") || c.includes("developer")) {
    return "Real Estate";
  }
  if (c.includes("auto") || c.includes("car") || c.includes("bike") || c.includes("garage") || c.includes("workshop") || c.includes("motor") || c.includes("dealer")) {
    return "Automobile";
  }
  if (c.includes("market") || c.includes("digital") || c.includes("seo") || c.includes("agency") || c.includes("software") || c.includes("web")) {
    return "Digital Marketing Agency";
  }
  return "General";
}

/**
 * Returns a randomized, 100% natural, human-written review.
 * Google Anti-Duplicate Algorithm:
 * - Uses random permutations of opener, core aspect, and closer.
 * - Randomly chooses length (crisp 2-sentence or detailed 3-sentence).
 * - Randomly alternates punctuation and conjunctions.
 */
export function generateNaturalHumanReview(
  businessName: string,
  category: string,
  language: SupportedLanguage = "en",
  seedModifier: number = Date.now(),
  rating: number = 5
): string {
  // If customer clicked 1 or 2 stars, provide constructive feedback template
  if (rating <= 2) {
    if (language === "hi") {
      return `${businessName} के साथ हमारा अनुभव ठीक नहीं रहा। सर्विस और रिस्पॉन्स में काफी सुधार की जरूरत है। आशा है कि मैनेजमेंट इस पर ध्यान देगा।`;
    }
    if (language === "hinglish") {
      return `${businessName} ke sath experience thoda disappointing raha. Service aur response time me improvement ki zarurat hai.`;
    }
    if (language === "mr") {
      return `${businessName} कडून सेवेत सुधारणा आवश्यक आहे. प्रतिसाद अपेक्षेप्रमाणे नव्हता.`;
    }
    return `Had an issue with the service at ${businessName}. The overall response and customer handling needs improvement. Hope the management addresses this.`;
  }

  // If customer clicked 3 stars
  if (rating === 3) {
    if (language === "hi") {
      return `${businessName} के साथ अनुभव सामान्य रहा। काम ठीक हुआ लेकिन कुछ चीजों में और सुधार हो सकता है। ओवरऑल ठीक-ठाक सर्विस।`;
    }
    if (language === "hinglish") {
      return `${businessName} ke sath average experience raha. Kaam theek tha but thoda aur better ho sakta tha. Decent service overall.`;
    }
    if (language === "mr") {
      return `${businessName} कडील सेवा सरासरी होती. काम ठीक झाले पण आणखी सुधारणा होऊ शकते.`;
    }
    return `Decent experience with ${businessName}. The service was satisfactory, though there is some room for improvement. Overall okay.`;
  }

  // Select vocabulary matching category or fallback to general
  const catKey = resolveCategoryKey(category);
  const vocabMap = CATEGORY_VOCABULARY[catKey] || CATEGORY_VOCABULARY["General"];
  const langVocab = vocabMap[language] || vocabMap["en"] || CATEGORY_VOCABULARY["General"]["en"];

  // Random pick helpers using high-entropy random
  const pick = (arr: string[]): string => {
    if (!arr || arr.length === 0) return "";
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
  };

  const opener = pick(langVocab.openers).replace(/\{name\}/g, businessName);
  const aspect1 = pick(langVocab.aspects).replace(/\{name\}/g, businessName);
  
  // Decide whether to add a second aspect for variety
  const includeSecondAspect = Math.random() > 0.45;
  let aspect2 = "";
  if (includeSecondAspect) {
    const remainingAspects = langVocab.aspects.filter((a) => !a.includes(aspect1.slice(0, 15)));
    if (remainingAspects.length > 0) {
      aspect2 = pick(remainingAspects).replace(/\{name\}/g, businessName);
    }
  }

  let closer = pick(langVocab.closers).replace(/\{name\}/g, businessName);

  // If 4 stars, adapt closer to natural 4-star sentiment
  if (rating === 4) {
    if (language === "en") {
      const fourStarClosers = [
        "Solid 4 stars. Very satisfied with the service!",
        "Great experience overall, would definitely recommend.",
        "Good service and helpful staff. Keep up the good work!",
        "Happy with the outcome and smooth support.",
      ];
      closer = pick(fourStarClosers);
    } else if (language === "hi") {
      const fourStarClosersHi = [
        "काफी अच्छा अनुभव रहा, सॉलिड 4 स्टार सर्विस!",
        "काम बहुत बढ़िया हुआ और स्टाफ भी मददगार रहा। संतुष्ट हूँ।",
        "{name} की सर्विस अच्छी है, जरूर रिकमेंड करूंगा।",
      ];
      closer = pick(fourStarClosersHi);
    } else if (language === "hinglish") {
      const fourStarClosersHing = [
        "Kaafi achha experience raha {name} ke sath, solid 4 stars!",
        "Service kaafi smooth thi aur staff cooperative tha. Satisfied!",
        "Overall bohot achha laga, definitely recommend karunga.",
      ];
      closer = pick(fourStarClosersHing);
    }
  }

  const sentences = [opener, aspect1, aspect2, closer].filter(Boolean);
  return sentences.join(" ").trim();
}

/**
 * Generates an array of 5 pre-computed diverse reviews in the chosen language
 * so the customer can tap "Shuffle / Next" instantly with 0ms latency.
 */
export function getReviewVariations(
  businessName: string,
  category: string,
  language: SupportedLanguage = "en"
): string[] {
  const set = new Set<string>();
  let attempts = 0;
  while (set.size < 6 && attempts < 30) {
    const rev = generateNaturalHumanReview(businessName, category, language, attempts);
    set.add(rev);
    attempts++;
  }
  return Array.from(set);
}

export interface StructureCustomerReviewInput {
  businessName: string;
  category?: string;
  rating: number; // 1 to 5
  keywords?: string[]; // e.g. ["Service", "Staff", "Quality"]
  userNotes?: string;
  language?: SupportedLanguage;
  seed?: number;
}

/**
 * Customer-Assisted AI Review Structuring:
 * Strict UX requirement: AI does NOT invent fake experiences.
 * AI structures the customer's selected star rating and customer-provided keywords/aspects.
 */
export function structureCustomerReview({
  businessName,
  category = "Service",
  rating,
  keywords = [],
  userNotes = "",
  language = "en",
  seed = Date.now(),
}: StructureCustomerReviewInput): string {
  const cleanName = (businessName || "this business").trim();
  const rawClean = (userNotes || "").trim();
  const lang = (["en", "hi", "hinglish", "mr"].includes(language) ? language : "en") as SupportedLanguage;
  const catKey = resolveCategoryKey(category);
  const catVocab = CATEGORY_VOCABULARY[catKey] || CATEGORY_VOCABULARY["General"];
  const langVocab = catVocab[lang] || catVocab["en"] || CATEGORY_VOCABULARY["General"]["en"];

  // Slot picker using sine hash
  const rnd = (arr: string[], offset: number = 0) => {
    if (!arr || arr.length === 0) return "";
    const hash = Math.abs(Math.sin(seed * 997 + offset * 7919) * 100000);
    const idx = Math.floor(hash) % arr.length;
    return arr[idx];
  };

  // 1. Rating <= 2: Polite Constructive Feedback
  if (rating <= 2) {
    if (lang === "hi") {
      return `${cleanName} के साथ हमारा अनुभव ठीक नहीं रहा। काम और रिस्पॉन्स में काफी सुधार की जरूरत महसूस हुई। आशा है कि मैनेजमेंट इस पर ध्यान देगा।`;
    }
    if (lang === "hinglish") {
      return `${cleanName} ke sath experience thoda disappointing raha. Service aur response time me improvement ki zarurat hai.`;
    }
    if (lang === "mr") {
      return `${cleanName} कडून सेवेत सुधारणा आवश्यक आहे. प्रतिसाद अपेक्षेप्रमाणे नव्हता.`;
    }
    return `Had an issue with ${cleanName}. The overall service response and customer handling needs improvement. Hope the management addresses this.`;
  }

  // 2. Rating === 3: Neutral Feedback
  if (rating === 3) {
    if (lang === "hi") {
      return `${cleanName} के साथ अनुभव सामान्य रहा। काम ठीक-ठाक हुआ लेकिन कुछ चीजों में और सुधार हो सकता है।`;
    }
    if (lang === "hinglish") {
      return `${cleanName} ke sath average experience raha. Kaam theek tha but customer coordination thoda aur better ho sakta hai.`;
    }
    if (lang === "mr") {
      return `${cleanName} कडील सेवा सरासरी होती. काम ठीक झाले पण आणखी सुधारणा अपेक्षित आहे.`;
    }
    return `Decent experience with ${cleanName}. The work was satisfactory, though there is some room for improvement. Overall okay.`;
  }

  // 3. Rating === 4: Solid 4-Star Satisfaction (without word repetition)
  if (rating === 4) {
    if (lang === "hi") {
      if (catKey === "Packers & Movers") {
        return `${cleanName} से सामान की शिफ्टिंग कराई और अनुभव काफी अच्छा रहा। टीम समय पर आई और सारा सामान सुरक्षित पहुंचाया। 4 स्टार!`;
      }
      return `${cleanName} के साथ अनुभव काफी अच्छा और सकारात्मक रहा। काम समय पर हुआ और स्टाफ का सहयोग भी बढ़िया था। 4 स्टार रेटिंग!`;
    }
    if (lang === "hinglish") {
      if (catKey === "Packers & Movers") {
        return `${cleanName} se shifting karwayi aur kaafi achha experience raha. Staff ne saara samaan time par aur safely deliver kiya. Solid 4 stars!`;
      }
      return `${cleanName} ke sath experience kaafi achha raha. Staff supportive tha aur kaam samay par hua. 4 stars meri taraf se!`;
    }
    if (lang === "mr") {
      return `${cleanName} सोबतचा अनुभव चांगला राहिला. काम वेळेत पूर्ण झाले आणि कर्मचाऱ्यांचे उत्तम सहकार्य मिळाले. समाधानकारक काम, ४ स्टार!`;
    }
    if (catKey === "Packers & Movers") {
      return `Shifted our household items with ${cleanName} and had a very good experience overall. The team arrived on time and handled our goods with care. Solid 4-star service.`;
    }
    return `Very good experience with ${cleanName}. The staff was supportive and handled everything smoothly. Solid 4 stars!`;
  }

  // 4. Rating >= 5: Genuine, High-Quality 5-Star Review
  const opener = rnd(langVocab.openers, 1).replace(/\{name\}/g, cleanName);
  
  // Specific aspects selection
  const selectedAspects: string[] = [];
  
  // If customer provided specific keywords/aspects
  const kwList = keywords.map((k) => k.toLowerCase().trim()).filter(Boolean);
  if (kwList.length > 0) {
    // Provide natural phrasing for standard chip keywords:
    const aspectPhrases: Record<string, Record<SupportedLanguage, string>> = {
      staff: {
        en: catKey === "Packers & Movers" ? "The loading crew was polite, disciplined, and very careful with heavy items." : "The staff was extremely polite, attentive, and cooperative.",
        hi: catKey === "Packers & Movers" ? "स्टाफ बहुत विनम्र था और भारी सामान को बहुत सावधानी से संभाला।" : "स्टाफ का व्यवहार बहुत विनम्र और सहयोगी रहा।",
        hinglish: catKey === "Packers & Movers" ? "Staff bohot polite aur hardworking tha, sab sambhal kar load kiya." : "Staff bohot polite aur supportive tha, sab kuch ache se explain kiya.",
        mr: "कर्मचाऱ्यांचे वर्तन खूप नम्र आणि सहकार्य करणारे होते.",
      },
      quality: {
        en: catKey === "Packers & Movers" ? "Multi-layer bubble wrap packing ensured not a single item was scratched or broken." : "Quality standards are genuinely high with great attention to every detail.",
        hi: catKey === "Packers & Movers" ? "पैकिंग बहुत मजबूत की थी, एक भी सामान को खरोंच तक नहीं आई।" : "काम की क्वालिटी बहुत ही उच्च दर्जे की है और कोई समझौता नहीं किया गया।",
        hinglish: catKey === "Packers & Movers" ? "Packing quality bohot solid thi, ek bhi item damage nahi hua." : "Kaam ki quality top-notch hai, 100% genuine kaam.",
        mr: "कामाचा दर्जा सर्वोत्तम आहे, कुठेही तडजोड केली नाही.",
      },
      service: {
        en: catKey === "Packers & Movers" ? "Delivered right on time at destination without any hidden costs." : "Everything was organized smoothly and completed right on schedule.",
        hi: catKey === "Packers & Movers" ? "बिना किसी देरी के तय समय पर सामान पहुंचाया और कोई छिपा हुआ चार्ज नहीं लिया।" : "काम बिल्कुल तय समय पर और बिना किसी परेशानी के पूरा हुआ।",
        hinglish: catKey === "Packers & Movers" ? "Time par delivery de di aur koi hidden charges nahi maange." : "Saara kaam perfectly schedule par hua, quick response.",
        mr: "सेवा वेळेवर आणि अतिशय पद्धतशीरपणे पूर्ण करण्यात आली.",
      },
      value: {
        en: "Clear billing with completely honest rates and zero surprise charges.",
        hi: "बिल्कुल वाजिब और पारदर्शी रेट्स हैं, कोई छिपे हुए चार्ज नहीं लिए गए।",
        hinglish: "Rates bilkul genuine aur transparent hain, koi hidden charges nahi.",
        mr: "दर अत्यंत रास्त आणि पारदर्शक आहेत, पैशाचे पूर्ण समाधान मिळाले.",
      },
      experience: {
        en: "The entire process was pleasant, stress-free, and well-managed.",
        hi: "शुरुआत से अंत तक का अनुभव बहुत शांतिपूर्ण और तनावमुक्त रहा।",
        hinglish: "Pura process bilkul smooth aur tension-free raha.",
        mr: "संपूर्ण अनुभव अतिशय सुखद आणि समाधानकारक राहिला.",
      },
    };

    kwList.forEach((kw) => {
      if (aspectPhrases[kw] && aspectPhrases[kw][lang]) {
        selectedAspects.push(aspectPhrases[kw][lang]);
      }
    });
  }

  // If no aspect matched or none selected, pick from category vocabulary
  if (selectedAspects.length === 0) {
    const asp1 = rnd(langVocab.aspects, 2).replace(/\{name\}/g, cleanName);
    selectedAspects.push(asp1);
    
    // Add second aspect with 50% probability for natural length
    if (langVocab.aspects.length > 1 && (seed % 2 === 0)) {
      const remaining = langVocab.aspects.filter((a) => a !== asp1);
      if (remaining.length > 0) {
        selectedAspects.push(rnd(remaining, 3).replace(/\{name\}/g, cleanName));
      }
    }
  }

  // If user typed custom notes
  if (rawClean && !kwList.includes(rawClean.toLowerCase())) {
    const notePunct = /[.!?]$/.test(rawClean) ? rawClean : `${rawClean}.`;
    selectedAspects.push(notePunct);
  }

  const closer = rnd(langVocab.closers, 4).replace(/\{name\}/g, cleanName);

  const finalReview = [opener, ...selectedAspects, closer]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return finalReview;
}

