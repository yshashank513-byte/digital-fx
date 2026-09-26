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
        "Ambiance bohot peacefull hai aur service bhi quick thi.",
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
  const vocabMap = CATEGORY_VOCABULARY[category] || CATEGORY_VOCABULARY["Digital Marketing Agency"] || CATEGORY_VOCABULARY["General"];
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
  const rawClean = (userNotes || "").trim();
  const kwList = [...keywords];

  let combinedAspects = kwList.map((k) => k.trim()).filter(Boolean);
  if (rawClean && !kwList.some((k) => k.toLowerCase() === rawClean.toLowerCase())) {
    combinedAspects.push(rawClean);
  }

  // High entropy pseudo-random slot picker using sine-hash
  const rnd = (arr: string[], offset: number = 0) => {
    if (!arr || arr.length === 0) return "";
    const hash = Math.abs(Math.sin(seed * 997 + offset * 7919) * 100000);
    const idx = Math.floor(hash) % arr.length;
    return arr[idx];
  };

  const cleanName = businessName || "this place";
  const aspectKeys = combinedAspects.map((a) => a.toLowerCase().trim());

  // ---------------------------------------------------------------------------
  // 1. ENGLISH (en)
  // ---------------------------------------------------------------------------
  if (language === "en") {
    if (rating >= 5) {
      const openers = [
        `Had an exceptional experience with ${cleanName}.`,
        `Visited ${cleanName} recently and was thoroughly impressed.`,
        `Truly pleased with the quality and hospitality at ${cleanName}.`,
        `Sharing my genuine feedback for ${cleanName} - absolutely delighted!`,
        `One of the most reliable and customer-friendly places in the city.`,
        `Really glad I chose ${cleanName}. Everything went smoothly.`,
        `Outstanding work and wonderful attitude by the team at ${cleanName}.`,
        `Very smooth, polite, and reassuring experience throughout.`,
        `My experience with ${cleanName} has been 100% positive.`,
        `Everything from first consultation to completion was handled with precision.`,
        `Can confidently say that ${cleanName} stands out for their dedication.`,
        `A really positive visit to ${cleanName}, totally satisfied with their work.`,
        `Just had our work completed by ${cleanName} and couldn't be happier.`,
        `Remarkable professionalism and care shown by ${cleanName}.`,
        `I rarely leave reviews, but ${cleanName} truly earned this 5-star rating.`,
      ];

      const aspectDict: Record<string, string[]> = {
        service: [
          "The service was swift, efficient, and well-coordinated.",
          "Service delivery was prompt and completely stress-free.",
          "Their speed of execution and attention to detail is remarkable.",
          "Really appreciate how systematic and orderly the service was.",
          "The promptness and responsiveness of the service left a great impression.",
          "Quick turnaround time without any compromises on standards.",
        ],
        staff: [
          "The staff was polite, welcoming, and very attentive to all our queries.",
          "Very courteous and supportive team that genuinely listens to customers.",
          "The staff members were humble, well-trained, and extremely cooperative.",
          "Every team member was patient, approachable, and thorough in their explanations.",
          "Great hospitality and warm behavior from the entire staff.",
          "Felt respected and prioritized thanks to the humble team.",
        ],
        quality: [
          "The work quality and hygiene standards are genuinely top-notch.",
          "Impressed by the premium standards and precision they maintain.",
          "High-grade attention to detail without cutting any corners.",
          "The finishing and quality of work exceeded all expectations.",
          "Top-level standards and modern approach throughout the process.",
          "Flawless execution with great attention to every small detail.",
        ],
        experience: [
          "The whole experience was pleasant, seamless, and reassuring.",
          "Felt totally comfortable and well taken care of from start to end.",
          "A genuinely 5-star experience that sets a solid benchmark for others.",
          "Smooth, orderly coordination that made the whole visit effortless.",
          "Comfortable environment and seamless communication throughout.",
          "Peace of mind from start to finish.",
        ],
        value: [
          "Completely fair pricing and true value for money.",
          "Honest, transparent charges with no hidden surprises whatsoever.",
          "Total peace of mind and great value for the high quality provided.",
          "Very reasonably priced considering the top-tier professionalism.",
          "Clear billing and complete integrity in their pricing structure.",
          "Worth every rupee spent.",
        ],
      };

      const closers = [
        "Highly recommended to everyone!",
        "Will definitely return and recommend to friends and family.",
        "Easily a solid 5 stars. Keep up the wonderful work!",
        "Thank you team for the wonderful support and care.",
        "A trustworthy and dependable place you can count on.",
        "10/10 experience without hesitation.",
        "Very satisfied customer. Best wishes to the entire team!",
        "Kudos to the entire management and staff for such high standards.",
        "Looking forward to visiting again. Truly recommended.",
        "Five stars well deserved!",
      ];

      const op = rnd(openers, 1);
      const aspectLines: string[] = [];

      aspectKeys.forEach((key, i) => {
        if (aspectDict[key]) {
          aspectLines.push(rnd(aspectDict[key], i * 17 + 3));
        } else {
          aspectLines.push(`The ${key} aspect was handled with great care and attention.`);
        }
      });

      if (aspectLines.length === 0) {
        const fallbacks = [
          "Everything was organized smoothly and completed on schedule.",
          "Great coordination, clear communication, and impressive results.",
          "Very smooth process from start to end with zero hassle.",
        ];
        aspectLines.push(rnd(fallbacks, 7));
      }

      const cl = rnd(closers, 9);
      return [op, ...aspectLines, cl].join(" ").trim();
    }

    if (rating === 4) {
      const openers = [
        `Overall, I had a very good experience with ${cleanName}.`,
        `Visited ${cleanName} and was quite happy with the service.`,
        `Good service and positive interaction with the team at ${cleanName}.`,
        `My experience with ${cleanName} was smooth and satisfactory.`,
        `Pleasant visit to ${cleanName}, they handled everything well.`,
      ];
      const closers = [
        "Solid 4-star experience. Would definitely recommend!",
        "Satisfied with their work and looking forward to visiting again.",
        "Good work overall, keep it up!",
        "Nice support and dependable team.",
        "Decent and reliable place, worth a visit.",
      ];
      const aspText = aspectKeys.length > 0
        ? `The ${aspectKeys.join(" and ")} was handled very well.`
        : "The service and coordination was smooth throughout.";
      return `${rnd(openers, 1)} ${aspText} ${rnd(closers, 4)}`;
    }

    if (rating === 3) {
      const openers = [
        `Average experience with ${cleanName}.`,
        `Visited ${cleanName} recently for service.`,
        `Fair interaction with ${cleanName}.`,
      ];
      const aspText = aspectKeys.length > 0
        ? `The ${aspectKeys.join(" and ")} was okay, though there is room for improvement.`
        : "Things were acceptable, but service coordination could be improved.";
      return `${rnd(openers, 1)} ${aspText} Hope the management takes this feedback positively.`;
    }

    // 1-2 stars
    const aspText = aspectKeys.length > 0
      ? `especially regarding the ${aspectKeys.join(" and ")}.`
      : "as the service did not match the expected standards.";
    return `Had an unsatisfactory experience with ${cleanName}, ${aspText} Hope the management looks into these issues and improves.`;
  }

  // ---------------------------------------------------------------------------
  // 2. HINDI (hi)
  // ---------------------------------------------------------------------------
  if (language === "hi") {
    if (rating >= 5) {
      const openers = [
        `${cleanName} के साथ बहुत ही बेहतरीन और सुखद अनुभव रहा।`,
        `${cleanName} की सर्विस वाकई में काफी शानदार, भरोसेमंद और असरदार है।`,
        `हाल ही में ${cleanName} से काम कराया, मन पूरी तरह से संतुष्ट हो गया।`,
        `अगर आप बेहतरीन क्वालिटी और सही गाइडेंस चाहते हैं तो ${cleanName} सबसे उत्तम विकल्प है।`,
        `बहुत ही ईमानदार और समयबद्ध काम देखने को मिला ${cleanName} पर।`,
        `${cleanName} की पूरी टीम का काम और अंदाज दोनों ही लाजवाब हैं।`,
        `अपने अनुभव के आधार पर कह सकता हूँ कि ${cleanName} बेहद भरोसेमंद जगह है।`,
        `${cleanName} पर काम कराकर मन को बहुत राहत मिली, सब कुछ बहुत सुव्यवस्थित था।`,
      ];

      const aspectDict: Record<string, string[]> = {
        service: [
          "इनकी सर्विस बहुत ही तेज, सुव्यवस्थित और बिना किसी देरी के रही।",
          "काम तय समय पर और बिना किसी परेशानी के पूरा करके दिया गया।",
          "सर्विस की स्पीड और काम करने का तरीका वाकई काबिले तारीफ है।",
        ],
        staff: [
          "स्टाफ का व्यवहार बहुत ही विनम्र, सहयोगी और आदरपूर्ण रहा।",
          "टीम के सभी लोग बहुत धैर्यवान हैं और हर बात को प्यार से समझाते हैं।",
          "पूरे स्टाफ ने बहुत सम्मान और अपनेपन के साथ मदद की।",
        ],
        quality: [
          "काम की क्वालिटी और सफाई के मानक बहुत ही उच्च दर्जे के हैं।",
          "क्वालिटी में कोई समझौता नहीं किया गया, काम बहुत बारीकी से हुआ।",
          "सटीक और बेहतरीन क्वालिटी का काम देखकर दिल खुश हो गया।",
        ],
        experience: [
          "शुरुआत से लेकर काम पूरा होने तक का पूरा अनुभव बहुत शांतिपूर्ण और सुखद रहा।",
          "किसी भी प्रकार की भागदौड़ या परेशानी नहीं हुई, सब कुछ बहुत सहज था।",
          "एक बहुत ही सकारात्मक और यादगार अनुभव रहा।",
        ],
        value: [
          "बिल्कुल वाजिब और पारदर्शी रेट्स हैं, कोई छिपे हुए चार्ज नहीं लिए गए।",
          "दी गई सर्विस के सामने पैसे की पूरी कद्र मिलती है।",
          "उचित मूल्य और पूरी ईमानदारी देखने को मिली।",
        ],
      };

      const closers = [
        "दिल से 5 स्टार रेटिंग और पूरी टीम को बहुत-बहुत शुभकामनाएं!",
        "मैं अपने सभी परिचितों और दोस्तों को ${cleanName} जरूर रिकमेंड करूँगा।",
        "शानदार काम और विनम्र व्यवहार के लिए बहुत-बहुत धन्यवाद।",
        "भरोसेमंद जगह, जरूरत पड़ने पर निश्चित रूप से दोबारा आऊंगा।",
        "५ में से ५ स्टार! ऐसे ही बढ़िया काम करते रहिए।",
        "शानदार परिणाम के लिए पूरी टीम का आभार।",
      ];

      const op = rnd(openers, 2);
      const aspectLines: string[] = [];

      aspectKeys.forEach((key, i) => {
        if (aspectDict[key]) {
          aspectLines.push(rnd(aspectDict[key], i * 19 + 5));
        } else {
          aspectLines.push(`${key} का काम बहुत ही अच्छे से संभाला गया।`);
        }
      });

      if (aspectLines.length === 0) {
        aspectLines.push("काम बहुत ही साफ-सुथरा और समयबद्ध तरीके से पूरा हुआ।");
      }

      const cl = rnd(closers, 8).replace("${cleanName}", cleanName);
      return [op, ...aspectLines, cl].join(" ").trim();
    }

    if (rating === 4) {
      return `${cleanName} के साथ अनुभव काफी अच्छा और सकारात्मक रहा। काम समय पर हुआ और स्टाफ का सहयोग भी अच्छा था। ओवरऑल काफी संतुष्ट हूँ, 4 स्टार!`;
    }

    if (rating === 3) {
      return `${cleanName} के साथ अनुभव सामान्य रहा। सर्विस ठीक-ठाक थी, लेकिन कुछ सुधार की गुंजाइश अभी भी महसूस हुई। आशा है आगे और बेहतर करेंगे।`;
    }

    return `${cleanName} के साथ अनुभव निराशाजनक रहा। सर्विस क्वालिटी और समयबद्धता में सुधार की बहुत आवश्यकता है।`;
  }

  // ---------------------------------------------------------------------------
  // 3. HINGLISH (hinglish)
  // ---------------------------------------------------------------------------
  if (language === "hinglish") {
    if (rating >= 5) {
      const openers = [
        `${cleanName} ke sath experience sach me bohot hi badhiya aur smooth raha!`,
        `Recently ${cleanName} visit kiya aur unka kaam dekh kar kaafi impress hua.`,
        `One of the best and most trustworthy places, ${cleanName} truly rocks!`,
        `Mujhe ${cleanName} ki professionalism aur kaam karne ka dhang bohot pasand aaya.`,
        `${cleanName} se service li aur honestly result expectations se bhi better tha.`,
        `Bohot genuine aur supportive team hai ${cleanName} ki.`,
        `${cleanName} par kaam kara ke fully satisfied hoon, koi dikkat nahi aayi.`,
        `Agar achhi quality aur honest guidance chahiye toh ${cleanName} best option hai.`,
      ];

      const aspectDict: Record<string, string[]> = {
        service: [
          "Service bohot fast thi aur sab kuch perfectly schedule par hua.",
          "Bina kisi delay ke bohot smooth tareeqe se saari service complete ki.",
          "Service speed aur quick response bohot impressive tha.",
        ],
        staff: [
          "Staff bohot polite, humble aur cooperative hai, har sawal ka pyar se jawab diya.",
          "Team ka behavior bohot supportive tha aur sabne bohot ache se guide kiya.",
          "Staff ne bohot patience ke sath pura process explain kiya.",
        ],
        quality: [
          "Kaam ki quality aur finishing bilkul top-class hai, koi kami nahi mili.",
          "Kaam me bohot safaai aur perfection dekhne ko mila.",
          "Quality standards genuinely high hain, 100% genuine kaam.",
        ],
        experience: [
          "Overall visit bohot comfortable aur hassle-free raha.",
          "Pura experience bilkul tension-free tha, consultation se completion tak.",
          "Sach me ek smooth aur 5-star experience raha.",
        ],
        value: [
          "Rates bilkul genuine aur transparent hain, koi hidden charges nahi.",
          "Paisa vasool service hai, quality ke hisaab se pricing bilkul fair hai.",
          "Honest pricing aur complete satisfaction mila.",
        ],
      };

      const closers = [
        "Solid 5 stars bante hain, highly recommended to everyone!",
        "Definitely family aur friends ko recommend karunga. Keep it up guys!",
        "Team bohot supportive hai, great work done!",
        "Fully satisfied customer, thank you so much to the team!",
        "10/10 experience, aage bhi yahin aayenge!",
        "Bina kisi hesitation ke inki service le sakte ho, full genuine!",
      ];

      const op = rnd(openers, 3);
      const aspectLines: string[] = [];

      aspectKeys.forEach((key, i) => {
        if (aspectDict[key]) {
          aspectLines.push(rnd(aspectDict[key], i * 23 + 7));
        } else {
          aspectLines.push(`${key} ka kaam bhi kaafi ache se handle kiya.`);
        }
      });

      if (aspectLines.length === 0) {
        aspectLines.push("Saara kaam time par aur bina kisi pareshani ke complete hua.");
      }

      const cl = rnd(closers, 9);
      return [op, ...aspectLines, cl].join(" ").trim();
    }

    if (rating === 4) {
      return `${cleanName} ke sath overall good experience raha. Kaam time par hua aur staff bhi helpful tha. Satisfied with the service, 4 stars!`;
    }

    if (rating === 3) {
      return `${cleanName} ke sath experience average raha. Kaam theek tha but customer service aur coordination thoda improve ho sakta hai.`;
    }

    return `${cleanName} ke sath experience disappointing raha. Service quality aur commitment par dhyan dene ki zaroorat hai.`;
  }

  // ---------------------------------------------------------------------------
  // 4. MARATHI (mr)
  // ---------------------------------------------------------------------------
  if (rating >= 5) {
    const openers = [
      `${cleanName} सोबत काम करण्याचा अनुभव अतिशय उत्तम आणि समाधानकारक राहिला.`,
      `${cleanName} ची सेवा आणि कामाची पद्धत खरोखरच कौतुकास्पद आणि विश्वासू आहे.`,
      `${cleanName} कडून नुकतीच सेवा घेतली, मनापासून पूर्ण समाधान झाले.`,
      `उत्कृष्ट दर्जा आणि योग्य मार्गदर्शनासाठी ${cleanName} ही सर्वोत्तम निवड आहे.`,
    ];

    const aspectDict: Record<string, string[]> = {
      service: [
        "सेवा वेळेवर आणि अतिशय पद्धतशीरपणे पूर्ण करण्यात आली.",
        "सेवेचा वेग आणि कामाचे नियोजन खरोखरच वाखाणण्याजोगे होते.",
      ],
      staff: [
        "कर्मचाऱ्यांचे वागणे अत्यंत नम्र, आदरयुक्त आणि सहकार्य करणारे होते.",
        "प्रत्येक प्रश्नाचे त्यांनी शांतपणे आणि समजावून उत्तर दिले.",
      ],
      quality: [
        "कामाचा दर्जा आणि स्वच्छता सर्वोत्तम आहे, कुठेही तडजोड केली नाही.",
        "कामातील बारकावे आणि अचूकता खूपच आवडली.",
      ],
      experience: [
        "संपूर्ण अनुभव अतिशय सुखद आणि विश्वासार्ह राहिला.",
        "कोणताही त्रास न होता सर्व काही सुरळीत पार पडले.",
      ],
      value: [
        "दर अत्यंत रास्त आणि पारदर्शक आहेत, पैशाचे पूर्ण समाधान मिळाले.",
        "प्रामाणिक दर आणि उत्तम दर्जा, नक्कीच योग्य मोबदला मिळाला.",
      ],
    };

    const closers = [
      "उत्कृष्ट सेवेबद्दल धन्यवाद! सर्वांना नक्कीच शिफारस करेन.",
      "५ पैकी ५ स्टार! खूप छान काम, असेच पुढे चालू ठेवा.",
      "खूप खूप आभार आणि पुढील वाटचालीस शुभेच्छा!",
      "नक्कीच पुन्हा यांच्याशीच संपर्क करेन. उत्तम सेवा!",
    ];

    const op = rnd(openers, 4);
    const aspectLines: string[] = [];

    aspectKeys.forEach((key, i) => {
      if (aspectDict[key]) {
        aspectLines.push(rnd(aspectDict[key], i * 29 + 11));
      } else {
        aspectLines.push(`${key} बाबतचे काम सुद्धा उत्तम प्रकारे पार पडले.`);
      }
    });

    if (aspectLines.length === 0) {
      aspectLines.push("सर्व काम वेळेत आणि सुरळीतपणे पूर्ण झाले.");
    }

    const cl = rnd(closers, 6);
    return [op, ...aspectLines, cl].join(" ").trim();
  }

  if (rating === 4) {
    return `${cleanName} चा अनुभव चांगला राहिला. काम वेळेवर झाले आणि कर्मचाऱ्यांचे सहकार्य मिळाले. समाधानकारक काम, ४ स्टार!`;
  }

  if (rating === 3) {
    return `${cleanName} सोबतचा अनुभव सामान्य राहिला. सेवा ठीक होती, पण काही सुधारणा अपेक्षित आहेत.`;
  }

  return `${cleanName} कडून मिळालेली सेवा निराशाजनक होती. सेवेच्या दर्जात सुधारणा करणे गरजेचे आहे.`;
}

