"use client";

import { useState } from "react";
import Link from "next/link";

interface BusinessCategoryShowcase {
  id: string;
  name: string;
  icon: string;
  badge: string;
  counterType: string;
  reviewsCount: string;
  rating: string;
  samples: {
    en: string;
    hi: string;
    hinglish: string;
    mr: string;
  };
}

const SHOWCASE_CATEGORIES: BusinessCategoryShowcase[] = [
  {
    id: "clinic",
    name: "Doctor & Dental Clinic",
    icon: "🏥",
    badge: "Healthcare & Dental",
    counterType: "Doctor Chamber & Reception Desk",
    reviewsCount: "140+ reviews gained",
    rating: "4.9 ★★★★★",
    samples: {
      en: "Consulted Dr. Verma recently. Very gentle doctor, clean clinic hygiene, and clear diagnosis without unnecessary medicines. Highly recommended!",
      hi: "डॉक्टर साहब का व्यवहार बहुत ही अच्छा और शांत है। क्लिनिक में साफ-सफाई बहुत अच्छी है और सही इलाज मिला। बहुत-बहुत धन्यवाद।",
      hinglish: "Doctor bohot experienced hain aur sab kuch detail me samjhate hain. Clinic bohot hygienic hai aur staff bhi supportive hai.",
      mr: "डॉक्टरांचा सल्ला अतिशय उत्तम ठरला. क्लिनिकमध्ये स्वच्छता उत्तम आहे आणि उपचार पद्धती अत्यंत विश्वासार्ह आहे.",
    },
  },
  {
    id: "medical",
    name: "Medical & Pharmacy Store",
    icon: "💊",
    badge: "Retail Pharmacy",
    counterType: "Medicine Billing Counter",
    reviewsCount: "95+ reviews gained",
    rating: "4.9 ★★★★★",
    samples: {
      en: "All genuine medicines available under one roof with good discounts. The pharmacist is polite and assists quickly. Very reliable medical store!",
      hi: "सभी दवाइयां आसानी से मिल जाती हैं और डिस्काउंट भी अच्छा देते हैं। स्टाफ बहुत मददगार है और समय पर दवाइयां उपलब्ध कराते हैं।",
      hinglish: "Sabhi medicines easily available ho jaati hain. Staff helpful hai aur billing bhi quick hai. Best pharmacy store in this area.",
      mr: "सर्व प्रकारची औषधे योग्य दरात मिळतात. कर्मचाऱ्यांची सेवा तत्पर आणि नम्र आहे.",
    },
  },
  {
    id: "restaurant",
    name: "Restaurant & Cafe",
    icon: "🍽️",
    badge: "Food & Dining",
    counterType: "Dining Table & Cash Counter",
    reviewsCount: "320+ reviews gained",
    rating: "4.8 ★★★★★",
    samples: {
      en: "Had dinner with family here. Food was freshly cooked, delicious, and served piping hot. Quick service and welcoming ambiance. 5 stars!",
      hi: "परिवार के साथ डिनर का अनुभव बहुत ही शानदार रहा। खाना बहुत स्वादिष्ट और गरमा-गरम परोसा गया। सर्विस बहुत तेज है!",
      hinglish: "Food quality bohot zabardast thi aur staff ka behavior polite tha. Family ke sath aane ke liye best restaurant hai.",
      mr: "जेवण अत्यंत चविष्ट आणि ताजे होते. वातावरण खूप छान आणि स्वच्छता उत्तम आहे. पुन्हा नक्की भेट देऊ!",
    },
  },
  {
    id: "salon",
    name: "Salon & Luxury Spa",
    icon: "💇",
    badge: "Beauty & Grooming",
    counterType: "Reception & Styling Mirrors",
    reviewsCount: "210+ reviews gained",
    rating: "4.9 ★★★★★",
    samples: {
      en: "Loved the haircut and facial service! The stylist understood exactly what I wanted. Clean tools and premium products used throughout.",
      hi: "हेयरकट और ग्रूमिंग सर्विस बहुत ही बढ़िया लगी। स्टाफ बहुत ट्रेंड है और साफ-सफाई का पूरा ध्यान रखते हैं। जरूर जाएं!",
      hinglish: "Hair styling bohot achhe se ki inhone. Cleanliness aur products sab top class the. Value for money salon hai.",
      mr: "उत्कृष्ट हेअरकट आणि ब्युटी सर्व्हिस! कर्मचारी अत्यंत कुशल आहेत आणि सेवा समाधानकारक आहे.",
    },
  },
  {
    id: "jewellery",
    name: "Jewellery Showroom",
    icon: "💎",
    badge: "Gold & Diamonds",
    counterType: "Showroom Counter & Billing",
    reviewsCount: "175+ reviews gained",
    rating: "5.0 ★★★★★",
    samples: {
      en: "Bought wedding jewellery from here. Transparent hallmark purity, beautiful modern designs, and fair making charges. Very trusted showroom!",
      hi: "शादी की खरीदारी के लिए सबसे भरोसेमंद शोरूम। हॉलमार्क सोने के बेहतरीन डिजाइन मिले और स्टाफ ने बहुत प्यार से सब दिखाया।",
      hinglish: "Hallmark jewellery ke latest designs hain. Making charges transparent hain aur staff bohot cooperative hai. Full trust!",
      mr: "शुद्ध हॉलमार्क दागिने आणि उत्कृष्ट डिझाइन्स. कर्मचाऱ्यांचे सहकार्य खूप छान होते. विश्वासू शोरूम!",
    },
  },
  {
    id: "packers",
    name: "Packers & Movers",
    icon: "🚚",
    badge: "Shifting & Relocation",
    counterType: "Delivery Receipt & WhatsApp QR",
    reviewsCount: "260+ reviews gained",
    rating: "4.9 ★★★★★",
    samples: {
      en: "Smooth household shifting! Multi-layer bubble packing kept all fragile items safe. The crew was disciplined and delivered right on time.",
      hi: "घर की शिफ्टिंग बहुत ही सुरक्षित तरीके से की। एक भी सामान नहीं टूटा और लड़के बहुत मेहनती थे। समय पर डिलीवरी दी।",
      hinglish: "Safe packing aur timely delivery di team ne. Koi hidden charges nahi liye aur sab samaan safely unload kiya. Highly recommended!",
      mr: "सुरक्षित सामान पोहोचवले. पॅकिंग अत्यंत दर्जेदार होती आणि एकाही वस्तूचे नुकसान झाले नाही. उत्तम सेवा!",
    },
  },
  {
    id: "clothing",
    name: "Clothing & Retail Store",
    icon: "👕",
    badge: "Fashion & Apparel",
    counterType: "Billing Counter Standee",
    reviewsCount: "115+ reviews gained",
    rating: "4.8 ★★★★★",
    samples: {
      en: "Wide variety of trendy ethnic and casual wear at reasonable rates. Good quality fabric and very supportive sales staff!",
      hi: "कपड़ों का कलेक्शन बहुत ही नया और बढ़िया है। दाम भी सही हैं और ट्रायल रूम आदि सब साफ-सुथरे हैं। बहुत अच्छी दुकान है।",
      hinglish: "Latest collection mil gaya festive shopping ke liye. Fabric quality achhi hai aur rates bhi reasonable hain.",
      mr: "कपड्यांचे वैविध्यपूर्ण व आधुनिक कलेक्शन. वाजवी दर आणि उत्तम ग्राहक सेवा.",
    },
  },
  {
    id: "automobile",
    name: "Car / Bike Service Center",
    icon: "🚗",
    badge: "Auto Garage & Detailing",
    counterType: "Customer Lounge & Job Card Desk",
    reviewsCount: "190+ reviews gained",
    rating: "4.9 ★★★★★",
    samples: {
      en: "Got full car servicing done here. Honest advice on parts, transparent billing, and delivered washed clean on committed time.",
      hi: "गाड़ी की सर्विस बहुत ही बढ़िया करके दी। कोई फालतू खर्चा नहीं बताया और टाइम पर कार हैंडओवर की। बहुत भरोसेमंद गैराज है।",
      hinglish: "Mechanics experienced hain aur genuine parts use karte hain. Car smooth chal rahi hai ab. Thanks team!",
      mr: "गाडीचे काम अत्यंत प्रामाणिकपणे आणि वेळेत करून दिले. वाजवी बिल आणि उत्कृष्ट सर्व्हिसिंग.",
    },
  },
];

const OWNER_REVIEWS = [
  {
    name: "Dr. R. K. Verma",
    business: "Verma Dental & Maxillofacial Clinic",
    location: "Indirapuram, Ghaziabad",
    type: "Dental & Orthodontic Clinic",
    rating: 5,
    quote:
      "Pehle patients treatment ke baad kehte the 'haan doctor sahab review de denge', par ghar jaakar koi nahi likhta tha. ReviewFlow AI standee lagane ke baad patient chair se uthkar reception counter par hi 15 second me review post kar deta hai. Hamare Google reviews 42 se badhkar 190+ ho gaye hain aur 'Dentist in Indirapuram' search karne par hum #1 aate hain!",
    avatarBg: "#207de9",
  },
  {
    name: "Sanjeev Gupta",
    business: "Gupta Medicos & Surgical Hub",
    location: "RDC Raj Nagar, Ghaziabad",
    type: "Retail Pharmacy & Health Store",
    rating: 5,
    quote:
      "Medical store par rush hota hai, isliye customer se review maangne ka time nahi hota. Ab counter pe standee laga hai. Log billing karate waqt camera on karke scan karte hain, Hindi ya English select karke turant review submit kar dete hain. Sabse achhi baat ye hai ki review bilkul natural banta hai, koi robot nahi lagta.",
    avatarBg: "#059669",
  },
  {
    name: "Anand Khurana",
    business: "The Grand Awadh Restaurant & Banquet",
    location: "Crossings Republik, Ghaziabad",
    type: "Multi-Cuisine Family Dining",
    rating: 5,
    quote:
      "Hamare har dining table aur cash counter par acrylic standee rakha hai. Bill aane ke time par guests scan karte hain. 3 mahine me 320 se zyada genuine 5-star Google reviews aa chuke hain. Weekend footfall me seedha 30% ka jump dekha hai humne. Har restaurant ko ye lagana chahiye.",
    avatarBg: "#e11d48",
  },
  {
    name: "Pooja Sharma",
    business: "Blush & Glow Luxury Salon & Spa",
    location: "Sector 62, Noida",
    type: "Unisex Salon & Bridal Studio",
    rating: 5,
    quote:
      "Clients service se bohot khush hoti hain par lamba review type karne me aalas karti hain. ReviewFlow AI se bas ek tap me unke man-pasand words generate ho jaate hain. Marathi aur Hindi me bhi text aa jata hai jo hamare customers ko bohot pasand aaya. Google Maps rating 4.9 par stable hai!",
    avatarBg: "#db2777",
  },
  {
    name: "Manish Tyagi",
    business: "Speedy Safe Relocation & Logistics",
    location: "Delhi NCR & Noida",
    type: "Packers & Movers",
    rating: 5,
    quote:
      "Delivery receipt aur WhatsApp delivery message me hum ReviewFlow QR dete hain. Pura shifting safe hone ke baad customer bina jhanjhat ke review deta hai. Har review me zero damage aur polite staff ka mention hota hai jisse naye customers bina shaq ke order book kar rahe hain.",
    avatarBg: "#0284c7",
  },
  {
    name: "Vipin Singhal",
    business: "Singhal Jewellers & Gems",
    location: "Gandhi Nagar, Ghaziabad",
    type: "Hallmark Gold & Diamond Showroom",
    rating: 5,
    quote:
      "Jewellery business me Google trust sabse important hota hai. Normal QR lagate the to koi likhta nahi tha. ReviewFlow AI se transparent billing aur hallmark designs ke reviews aane lage. Local jewellery buyers ab Google Maps se sidhe shop par visit kar rahe hain.",
    avatarBg: "#d97706",
  },
];

const FAQS = [
  {
    q: "Kya isse hamara Google Business Profile account suspend ya ban ho sakta hai?",
    a: "Bilkul nahi! ReviewFlow AI 100% Google Anti-Gating aur Anti-Spam policy compliant hai. Isme koi automated bot ya fake reviews nahi aate. Har review customer ke verified Google account se khud submit hota hai, aur hamara dynamic non-duplicate engine har customer ke liye alag sentences generate karta hai taaki Google algorithm par zero duplicate flags aayin.",
  },
  {
    q: "Ye normal Google QR Code se alag kaise hai?",
    a: "Normal Google QR scan karne par ek khali (blank) box khulta hai jaha customer ko khud sochna padta hai ki kya likhe, jisse 90% log phone band kar dete hain. ReviewFlow AI scan karne par customer ko bina kisi sawal ke ek natural, 100% human review Hindi, English, Hinglish ya Marathi me likha hua ready milta hai jise wo 1 second me Google par post kar sakte hain.",
  },
  {
    q: "Standee hamare counter par kaise deliver hoga?",
    a: "Order karne ke 24 hours ke andar aapke business name, official Google link aur customized high-resolution QR ke sath acrylic tabletop standee tayyar kiya jata hai aur direct aapki shop/clinic/office par courier se deliver ho jata hai.",
  },
  {
    q: "Kya customer review me apne shabdon me koi badlav kar sakta hai?",
    a: "Haan, bilkul! Review text box fully editable hota hai. Customer chahe to staff ka naam, koi specific dish ya personal experience type kar sakta hai, ya 'Shuffle' dabakar 5 alag variations dekh sakta hai.",
  },
  {
    q: "Agar koi customer 1 ya 2 star dena chahe to kya use roka jayega?",
    a: "Nahi, Google ki strict policies ke tahat negative reviews ko block ('gating') karna illegal hai. Hamara system policy compliant hai aur customer ko direct transparent link deta hai, jo aapke Google account ki longevity ke liye 100% safe hai.",
  },
  {
    q: "Charges kya hain aur setup kaise shuru hoga?",
    a: "Hamare paas transparent one-time starter plans hain starting from ₹1,999 (jisme 2x Premium Acrylic Standees delivery + unlimited scans + lifetime access included hai). Koi hidden monthly deduction nahi hai. Aap WhatsApp button dabakar turant order initiate kar sakte hain.",
  },
];

export default function ReviewFlowLandingClient() {
  const [selectedCatId, setSelectedCatId] = useState<string>("clinic");
  const [selectedLang, setSelectedLang] = useState<"en" | "hi" | "hinglish" | "mr">("en");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const currentCat = SHOWCASE_CATEGORIES.find((c) => c.id === selectedCatId) || SHOWCASE_CATEGORIES[0];

  const whatsappOrderUrl = (planName: string = "ReviewFlow AI Standee Setup") => {
    const text = encodeURIComponent(
      `Hi Digital FX Team, I want to get "${planName}" for my shop/clinic/business. Please share the details and QR setup process.`
    );
    return `https://wa.me/919319807273?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#207de9] selection:text-white">
      
      {/* 1. TOP HEADER & NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="Digital FX" className="h-10 sm:h-11 w-auto object-contain" />
            </Link>
            <span className="hidden sm:inline-block text-slate-300">|</span>
            <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              <span className="text-xs font-black tracking-wider text-[#207de9] uppercase">ReviewFlow AI</span>
              <span className="text-[9px] font-black bg-[#207de9] text-white px-1.5 py-0.5 rounded uppercase">SaaS</span>
            </div>
          </div>

          {/* Quick Nav Links on Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#how-it-works" className="hover:text-[#207de9] transition">How It Works</a>
            <a href="#simulator" className="hover:text-[#207de9] transition">Shop Categories</a>
            <a href="#reviews" className="hover:text-[#207de9] transition">Owner Reviews</a>
            <a href="#pricing" className="hover:text-[#207de9] transition">Charges &amp; Standees</a>
            <a href="#faqs" className="hover:text-[#207de9] transition">FAQs</a>
          </nav>

          {/* WhatsApp Redirect Action Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/r/digital-fx"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2.5 rounded-xl border border-slate-200 transition cursor-pointer"
            >
              <span>📱</span> Test Live QR
            </Link>
            <a
              href={whatsappOrderUrl("Store Standee Registration")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-white bg-[#059669] hover:bg-[#047857] px-4 sm:px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
            >
              <span>💬 Add Business (WhatsApp)</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 sm:pt-16 pb-20 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-4xl mx-auto">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-6 shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>🇮🇳 Built for Indian Clinics, Medical Stores, Restaurants, Salons &amp; Retail Shops</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#080d24] tracking-tight leading-[1.12]">
              Turn Every Walk-in Customer into an{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#207de9] via-emerald-600 to-indigo-600 block sm:inline">
                Authentic 5-Star Google Review
              </span>{" "}
              in Under 15 Seconds.
            </h1>

            {/* Subtitle Description */}
            <p className="mt-5 text-sm sm:text-lg text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
              Normal Google QRs fail because customers hate writing paragraphs. <strong>ReviewFlow AI</strong> places a smart acrylic standee on your counter. When scanned, it auto-generates a natural, 100% human review in <strong>English, हिंदी, Hinglish, or मराठी</strong> — ready to post on your official Google Maps profile with 1 click!
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={whatsappOrderUrl("ReviewFlow AI Standee Setup - Main CTA")}
                target="_blank"
                rel="noopener noreferrer"
                className="py-4 px-8 rounded-2xl font-black text-white text-base bg-[#059669] hover:bg-[#047857] shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2.5 cursor-pointer active:scale-95"
              >
                <span>💬 Get Standee for Your Shop (WhatsApp)</span>
                <span>→</span>
              </a>

              <Link
                href="/r/digital-fx"
                target="_blank"
                className="py-4 px-6 rounded-2xl font-bold text-slate-800 text-base bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>📱 Scan / Test Live Digital FX Flow</span>
                <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-black">
                  Zero Form
                </span>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-200/80">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-3xl font-black text-[#207de9]">85%</div>
                <div className="text-xs text-slate-500 font-bold mt-1">Review Conversion Rate</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">vs 8% for normal Google QRs</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-3xl font-black text-emerald-600">15 Sec</div>
                <div className="text-xs text-slate-500 font-bold mt-1">Customer Time on Phone</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Zero questions, zero forms</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-3xl font-black text-[#080d24]">4 Langs</div>
                <div className="text-xs text-slate-500 font-bold mt-1">Multi-Language Engine</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">English, हिंदी, Hinglish, मराठी</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-3xl font-black text-purple-600">100%</div>
                <div className="text-xs text-slate-500 font-bold mt-1">Safe &amp; Anti-Duplicate</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Zero risk to Google Business Profile</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. STEP-BY-STEP VISUAL ARCHITECTURE */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#207de9] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              Frictionless 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#080d24] mt-3">
              How ReviewFlow AI Works for Your Store
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-normal">
              No apps to download. No surveys to fill. Works on every iPhone &amp; Android camera out of the box.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* STEP 1 */}
            <div className="bg-slate-50 rounded-3xl p-7 border border-slate-200 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="h-12 w-12 rounded-2xl bg-blue-100 text-[#207de9] flex items-center justify-center text-2xl font-black">
                    🖨️
                  </span>
                  <span className="text-3xl font-black text-slate-300">01</span>
                </div>
                <h3 className="text-lg font-black text-[#080d24]">
                  Tabletop Standee on Billing Counter
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  We print and deliver high-grade acrylic tabletop tent cards featuring your business logo, Google review link, and dynamic smart QR code.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200/80 bg-white rounded-2xl p-4 border border-slate-200 text-xs">
                <span className="text-[11px] font-black uppercase text-blue-600 tracking-wider block mb-1">
                  Customer Action:
                </span>
                <p className="text-slate-700 font-semibold">
                  Customer pays bill at your counter or clinic desk and scans the standee with their mobile camera.
                </p>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="bg-slate-50 rounded-3xl p-7 border border-slate-200 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-black">
                    ✨
                  </span>
                  <span className="text-3xl font-black text-slate-300">02</span>
                </div>
                <h3 className="text-lg font-black text-[#080d24]">
                  Instant Human Review Draft Generated
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  No forms or questions! Customer sees an instant, natural 5-star review tailored to your exact business type in their chosen language (English, Hindi, Hinglish, Marathi).
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200/80 bg-white rounded-2xl p-4 border border-slate-200 text-xs">
                <span className="text-[11px] font-black uppercase text-emerald-600 tracking-wider block mb-1">
                  Anti-Duplicate Engine:
                </span>
                <p className="text-slate-700 font-semibold">
                  Customer can tap <strong>&quot;दूसरा रिव्यू देखें / Shuffle&quot;</strong> to cycle through unlimited unique variations so Google never flags duplicate text.
                </p>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="bg-slate-50 rounded-3xl p-7 border border-slate-200 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-black">
                    🚀
                  </span>
                  <span className="text-3xl font-black text-slate-300">03</span>
                </div>
                <h3 className="text-lg font-black text-[#080d24]">
                  1-Click Direct Post on Google Maps
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Customer taps <strong>&quot;Review on Google ↗&quot;</strong>. The review draft is auto-copied to their clipboard, Google Maps review box opens directly, and customer hits &quot;Post&quot;!
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200/80 bg-white rounded-2xl p-4 border border-slate-200 text-xs">
                <span className="text-[11px] font-black uppercase text-indigo-600 tracking-wider block mb-1">
                  Local SEO Result:
                </span>
                <p className="text-slate-700 font-semibold">
                  Your Google Maps 3-Pack ranking shoots up to #1, driving 40%+ more phone calls and walk-in footfall every week.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE CATEGORY SHOWCASE SIMULATOR */}
      <section id="simulator" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#207de9] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              Live Category Demonstration
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#080d24] mt-3">
              See How It Works For Any Business Category
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-normal">
              Select your business type below to test how natural reviews are generated for your specific store.
            </p>
          </div>

          {/* Category Chips Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-5xl mx-auto">
            {SHOWCASE_CATEGORIES.map((cat) => {
              const isActive = cat.id === selectedCatId;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer border ${
                    isActive
                      ? "bg-[#080d24] text-white border-[#080d24] shadow-md scale-105"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Simulator Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
            
            {/* Header of Simulator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentCat.icon}</span>
                <div>
                  <h3 className="text-xl font-black text-[#080d24]">
                    {currentCat.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mt-0.5">
                    <span>📍 Standee Placed At: <strong>{currentCat.counterType}</strong></span>
                    <span>•</span>
                    <span className="text-emerald-600 font-bold">{currentCat.reviewsCount}</span>
                  </div>
                </div>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                {(["en", "hi", "hinglish", "mr"] as const).map((lang) => {
                  const labels = {
                    en: "🇬🇧 English",
                    hi: "🇮🇳 हिंदी",
                    hinglish: "💬 Hinglish",
                    mr: "🚩 मराठी",
                  };
                  return (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        selectedLang === lang
                          ? "bg-white text-[#207de9] shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {labels[lang]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Customer Phone View */}
            <div className="mt-6 bg-slate-50 rounded-2xl p-5 sm:p-7 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                <span>Customer Mobile Screen (Auto-Generated)</span>
                <span className="text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                  ✓ 100% Non-AI Tone
                </span>
              </div>

              {/* Review Text Display */}
              <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-300 shadow-xs relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-amber-500 font-black text-sm tracking-widest">
                    ★★★★★ (5.0)
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    Editable Text Box
                  </span>
                </div>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                  &ldquo;{currentCat.samples[selectedLang]}&rdquo;
                </p>
              </div>

              {/* Simulated Google Button */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => alert("Ye demo button hai. Live test karne ke liye upar 'Test Live QR' click karein!")}
                  className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl font-black text-white text-sm bg-[#4285F4] hover:bg-[#3367d6] shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Review on Google</span>
                  <span>↗</span>
                </button>

                <a
                  href={whatsappOrderUrl(`${currentCat.name} Standee Pack`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-bold text-xs bg-[#059669] hover:bg-[#047857] text-white transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>💬 Get This For My {currentCat.name}</span>
                  <span>→</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. WHY TRADITIONAL GOOGLE QRS FAIL VS REVIEWFLOW AI */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              The Real Retail Difference
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#080d24] mt-3">
              Why Normal Google QRs Fail vs ReviewFlow AI
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-normal">
              Most shop owners paste a normal QR printout and wonder why nobody reviews. Here is the reason:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Normal QR */}
            <div className="bg-red-50/40 rounded-3xl p-7 border border-red-200 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
                <span>❌ Traditional Black &amp; White Google QR</span>
              </div>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700 font-medium pt-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Opens a completely blank box — customer gets writer&apos;s block and closes phone.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Less than 8% of customers actually complete and publish the review.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Customers who only speak Hindi or Marathi struggle to write formal English.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Paper printouts get dirty, faded, and look cheap on premium counters.</span>
                </li>
              </ul>
            </div>

            {/* ReviewFlow AI */}
            <div className="bg-emerald-50/60 rounded-3xl p-7 border-2 border-emerald-400 shadow-md space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black">
                <span>✓ ReviewFlow AI Smart Standee</span>
              </div>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-800 font-semibold pt-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-black shrink-0">✓</span>
                  <span>Auto-generates a natural, human-written review in 1 tap without thinking.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-black shrink-0">✓</span>
                  <span>Over 85% completion rate — customers post it on Google right at your counter.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-black shrink-0">✓</span>
                  <span>Instant 1-tap language switcher for English, हिंदी, Hinglish, and मराठी.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-black shrink-0">✓</span>
                  <span>Laser-cut premium acrylic tabletop standee that boosts store brand authority.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 6. VERIFIED LOCAL BUSINESS OWNER REVIEWS */}
      <section id="reviews" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#207de9] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              Real Shop &amp; Clinic Results
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#080d24] mt-3">
              Trusted by 150+ Verified Business Owners
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-normal">
              Doctors, chemists, restaurateurs, salon owners &amp; retailers across Delhi NCR and India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OWNER_REVIEWS.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 text-sm mb-3">
                    {"★".repeat(rev.rating)}
                    <span className="text-xs font-bold text-slate-500 ml-1.5">5.0 Verified</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center font-black text-white text-xs shrink-0"
                    style={{ backgroundColor: rev.avatarBg }}
                  >
                    {rev.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#080d24] leading-tight">
                      {rev.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-semibold">
                      {rev.business}
                    </p>
                    <span className="text-[10px] text-blue-600 font-bold block">
                      📍 {rev.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. TRANSPARENT CHARGES & PRICING PACKAGES */}
      <section id="pricing" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              Clear &amp; Transparent Charges
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#080d24] mt-3">
              Get Your Complete Standee Kit Delivered
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-normal">
              No hidden fees. No recurring lock-ins. Delivered straight to your shop or clinic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* PLAN 1 */}
            <div className="bg-slate-50 rounded-3xl p-7 border border-slate-200 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
                  Single Counter Pack
                </span>
                <h3 className="text-xl font-black text-[#080d24] mt-1">
                  Starter Standee Kit
                </h3>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-[#080d24]">₹1,999</span>
                  <span className="text-xs text-slate-500 font-bold">one-time</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Perfect for single-doctor clinics, medical stores &amp; boutique shops.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>2x Premium Acrylic Tabletop Standees</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Custom Smart QR + Digital Vector Files</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>English, हिंदी, Hinglish &amp; मराठी Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Unlimited Customer Scans (No Expiry)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Free Shipping across India</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <a
                  href={whatsappOrderUrl("Starter Standee Kit (₹1,999)")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl font-black text-center text-xs text-white bg-[#080d24] hover:bg-[#207de9] shadow-sm transition block cursor-pointer"
                >
                  Order on WhatsApp →
                </a>
              </div>
            </div>

            {/* PLAN 2 - HIGHLIGHTED */}
            <div className="bg-white rounded-3xl p-8 border-2 border-[#207de9] shadow-2xl relative flex flex-col justify-between scale-102">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#207de9] text-white text-[11px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                🔥 Most Popular for Clinics &amp; Cafes
              </span>

              <div>
                <span className="text-xs font-black uppercase text-[#207de9] tracking-wider">
                  Multi-Counter Retail
                </span>
                <h3 className="text-2xl font-black text-[#080d24] mt-1">
                  Growth Business Pack
                </h3>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-[#080d24]">₹3,499</span>
                  <span className="text-xs text-slate-500 font-bold">one-time</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Designed for multi-table restaurants, multi-chair salons, and busy clinics.
                </p>

                <ul className="mt-6 space-y-3.5 text-xs text-slate-800 font-semibold">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>4x Premium Acrylic Tabletop Standees</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>4x Staff Lanyard Cards</strong> for mobile review collection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Full Google Maps 3-Pack SEO Audit by Digital FX</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Dynamic Anti-Duplicate Shuffle Algorithm</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Priority WhatsApp Support &amp; Lifetime Updates</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <a
                  href={whatsappOrderUrl("Growth Business Pack (₹3,499)")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-xl font-black text-center text-sm text-white bg-[#059669] hover:bg-[#047857] shadow-lg shadow-emerald-600/25 transition block cursor-pointer"
                >
                  Order Growth Pack on WhatsApp →
                </a>
              </div>
            </div>

            {/* PLAN 3 */}
            <div className="bg-slate-50 rounded-3xl p-7 border border-slate-200 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-black uppercase text-purple-600 tracking-wider">
                  Multi-Branch &amp; Chains
                </span>
                <h3 className="text-xl font-black text-[#080d24] mt-1">
                  Enterprise Retail Chain
                </h3>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-[#080d24]">₹6,999</span>
                  <span className="text-xs text-slate-500 font-bold">custom kit</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  For hospitals, multi-outlet restaurants, jewellery chains &amp; franchises.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>10x Laser-Etched Acrylic Standees</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Multi-Branch Central Analytics Dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Dedicated Local SEO Account Manager</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Custom Category Keywords Optimization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Express 48h Courier Delivery</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <a
                  href={whatsappOrderUrl("Enterprise Retail Chain Kit (₹6,999)")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl font-black text-center text-xs text-white bg-[#080d24] hover:bg-[#207de9] shadow-sm transition block cursor-pointer"
                >
                  Contact for Enterprise on WhatsApp →
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section id="faqs" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-[#207de9] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              Clear Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#080d24] mt-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-normal">
              Everything business owners ask before setting up their counter standee.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-extrabold text-[#080d24]">
                      {faq.q}
                    </span>
                    <span className="text-lg font-black text-[#207de9] shrink-0">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION BANNER */}
      <section className="py-16 bg-[#080d24] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-5">
            <span>🛡️ 100% Google Anti-Review-Gating Policy Safe</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Dominate Your Local Area on Google Maps?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-4 max-w-2xl mx-auto leading-relaxed">
            Get your custom branded tabletop standee delivered to your shop or clinic. Start collecting authentic 5-star Google reviews from every walk-in customer today!
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={whatsappOrderUrl("Direct Final CTA Order")}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-8 rounded-2xl font-black text-white text-base bg-[#059669] hover:bg-[#047857] shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2.5 cursor-pointer active:scale-95"
            >
              <span>💬 Order Standee on WhatsApp (+91 93198 07273)</span>
              <span>→</span>
            </a>

            <Link
              href="/r/digital-fx"
              target="_blank"
              className="py-4 px-6 rounded-2xl font-bold text-white text-base bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>📱 Test Customer Experience</span>
              <span>↗</span>
            </Link>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-center gap-6">
            <span>📍 Digital FX Office: Shop No. 210, 2nd Floor, Orbit Plaza, Crossings Republik, Ghaziabad</span>
            <span>•</span>
            <span>📞 Call / WhatsApp: +91 93198 07273</span>
          </div>
        </div>
      </section>

      {/* 10. SAAS FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo-white.svg" alt="Digital FX" className="h-10 sm:h-11 w-auto object-contain" />
            <span className="text-slate-700">|</span>
            <span className="font-bold text-slate-300">ReviewFlow AI Enterprise Suite</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/" className="hover:text-white transition">Digital FX Home</Link>
            <Link href="/services" className="hover:text-white transition">Local SEO &amp; Maps</Link>
            <Link href="/r/digital-fx" className="hover:text-white transition">Customer Review Flow</Link>
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            {/* Discrete Admin Portal for Management */}
            <Link
              href="/reviewflow/dashboard"
              className="text-[#207de9] hover:text-blue-400 font-bold transition flex items-center gap-1"
            >
              <span>🔒 Admin Dashboard</span>
            </Link>
          </div>

          <div className="text-slate-500">
            © {new Date().getFullYear()} Digital FX®. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
