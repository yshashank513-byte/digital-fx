"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { BusinessProfile, BusinessCategory, QRStatus } from "@/lib/reviewFlowTypes";
import { CATEGORIES_LIST } from "@/lib/reviewFlowCategories";

interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedBiz: BusinessProfile) => void;
  editingBusiness?: BusinessProfile | null;
}

export default function AddBusinessModal({
  isOpen,
  onClose,
  onSuccess,
  editingBusiness,
}: AddBusinessModalProps) {
  const isEditing = Boolean(editingBusiness);

  // ---------------------------------------------------------------------------
  // 1. FORM STATE
  // ---------------------------------------------------------------------------
  const [name, setName] = useState("");
  const [category, setCategory] = useState<BusinessCategory>("Packers & Movers");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Ghaziabad");
  const [state, setState] = useState("Uttar Pradesh");
  const [pincode, setPincode] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [brandColor, setBrandColor] = useState("#207de9");
  const [qrStyle, setQrStyle] = useState<"square" | "rounded" | "circle">("square");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [initialStatus, setInitialStatus] = useState<QRStatus>("pending_approval");

  // Logo upload state
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [logoFileName, setLogoFileName] = useState<string>("");
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI & Validation States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  // Generated QR preview data URL
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string>("");

  // ---------------------------------------------------------------------------
  // 2. POPULATE INITIAL / EDIT DATA
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (editingBusiness) {
      setName(editingBusiness.name || "");
      setCategory(editingBusiness.category || "Packers & Movers");
      setOwnerName(editingBusiness.ownerName || "");
      setPhone(editingBusiness.phone || "");
      setEmail(editingBusiness.email || "");
      setWebsite(editingBusiness.website || "");
      setAddress(editingBusiness.address || "");
      setCity(editingBusiness.city || "Ghaziabad");
      setState(editingBusiness.state || "Uttar Pradesh");
      setPincode(editingBusiness.pincode || "");
      setGoogleReviewUrl(editingBusiness.googleReviewUrl || "");
      setBrandColor(editingBusiness.brandColor || "#207de9");
      setQrStyle(editingBusiness.qrStyle || "square");
      setLogoUrl(editingBusiness.logoUrl || "");
      setLogoFileName(editingBusiness.logoUrl ? "business-logo" : "");
      setAdditionalNotes(editingBusiness.additionalNotes || "");
      setInitialStatus(editingBusiness.status || "active");
    } else {
      setName("OM Packers and Movers");
      setCategory("Packers & Movers");
      setOwnerName("Shashank Yadav");
      setPhone("+91 98765 43210");
      setEmail("contact@ompackers.in");
      setWebsite("");
      setAddress("Shop No. 12, ABC Market, Kaushambi, Ghaziabad");
      setCity("Ghaziabad");
      setState("Uttar Pradesh");
      setPincode("201016");
      setGoogleReviewUrl("https://g.page/r/CS3Zr8xyQyKREBM/review");
      setBrandColor("#207de9");
      setQrStyle("square");
      setLogoUrl("");
      setLogoFileName("");
      setAdditionalNotes("e.g. Printed tent card requested, 2 counter standees needed.");
      setInitialStatus("pending_approval");
    }
    setError("");
    setFieldErrors({});
  }, [editingBusiness, isOpen]);

  // ---------------------------------------------------------------------------
  // 3. LIVE QR CODE GENERATOR
  // ---------------------------------------------------------------------------
  const generateLiveQR = useCallback(async () => {
    try {
      const destination = googleReviewUrl.trim() || "https://www.digitalfx.in/reviewflow";
      const qrData = await QRCode.toDataURL(destination, {
        width: 450,
        margin: 1,
        color: {
          dark: brandColor || "#207de9",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      });
      setQrPreviewUrl(qrData);
    } catch (err) {
      console.error("QR Code Live Generation Error:", err);
    }
  }, [googleReviewUrl, brandColor]);

  useEffect(() => {
    generateLiveQR();
  }, [generateLiveQR]);

  // Category Tagline Helper
  const getCategoryTagline = (cat: BusinessCategory) => {
    switch (cat) {
      case "Packers & Movers":
        return "Your Feedback Helps Us Move Better!";
      case "Jewellery Store":
        return "Your Review Adds Sparkle to Our Craft!";
      case "Restaurant":
        return "Your Review Flavors Our Passion!";
      case "Salon":
        return "Your Review Makes Us Shine!";
      case "Hotel":
        return "Your Review Makes Every Stay Memorable!";
      case "Real Estate":
        return "Your Feedback Builds Trusted Homes!";
      case "Digital Marketing Agency":
        return "Your Feedback Drives Growth!";
      case "Clinic":
        return "Your Feedback Helps Us Care Better!";
      case "Automobile Dealer":
        return "Your Review Keeps Our Wheels Turning!";
      default:
        return "Your feedback helps us improve.";
    }
  };

  if (!isOpen) return null;

  // ---------------------------------------------------------------------------
  // 4. LOGO UPLOAD & REMOVE HANDLERS
  // ---------------------------------------------------------------------------
  const handleFileProcess = (file: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit. Please upload a smaller image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoUrl(result);
      setLogoFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLogo(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl("");
    setLogoFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ---------------------------------------------------------------------------
  // 5. VALIDATION
  // ---------------------------------------------------------------------------
  const isUrlValid = (url: string) => {
    try {
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = "Business name is required.";
    if (!category) errs.category = "Category is required.";

    const digits = phone.replace(/\D/g, "");
    if (!phone.trim()) {
      errs.phone = "Contact mobile number is required.";
    } else if (digits.length < 10) {
      errs.phone = "Please enter a valid 10-digit mobile number.";
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    if (!address.trim()) {
      errs.address = "Complete business address is required.";
    }

    if (!googleReviewUrl.trim()) {
      errs.googleReviewUrl = "Google Review or Business Profile URL is required.";
    } else if (!isUrlValid(googleReviewUrl.trim())) {
      errs.googleReviewUrl = "URL must start with http:// or https://";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ---------------------------------------------------------------------------
  // 6. FORM SUBMISSION
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent, submitStatus?: QRStatus) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");

    const targetStatus = submitStatus || (isEditing ? initialStatus : "active");

    try {
      const payload = {
        id: editingBusiness?.id,
        name: name.trim(),
        category,
        ownerName: ownerName.trim() || undefined,
        phone: phone.trim(),
        email: email.trim() || undefined,
        website: website.trim() || undefined,
        address: address.trim(),
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        pincode: pincode.trim() || undefined,
        googleReviewUrl: googleReviewUrl.trim(),
        brandColor,
        qrStyle,
        logoUrl: logoUrl || undefined,
        additionalNotes: additionalNotes.trim() || undefined,
        status: targetStatus,
      };

      const res = await fetch("/api/reviewflow/businesses", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save business profile.");
      }

      onSuccess(json.business);
      onClose();
    } catch (err: any) {
      console.error("SAVE BUSINESS ERROR:", err);
      setError(err.message || "Failed to save business profile.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 7. QR CODE DOWNLOAD GENERATOR (PNG, JPG, SVG, PDF)
  // ---------------------------------------------------------------------------
  const triggerDownload = async (format: "png" | "jpg" | "svg" | "pdf") => {
    setDownloadingFormat(format);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Card Container Border
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 3;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // Business Logo or Header Text
      let logoDrawn = false;
      if (logoUrl) {
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = logoUrl;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          const maxLogoW = 340;
          const maxLogoH = 90;
          const ratio = Math.min(maxLogoW / img.width, maxLogoH / img.height);
          const drawW = img.width * ratio;
          const drawH = img.height * ratio;
          const drawX = (canvas.width - drawW) / 2;
          ctx.drawImage(img, drawX, 40, drawW, drawH);
          logoDrawn = true;
        } catch {
          // fallback to text
        }
      }

      if (!logoDrawn) {
        ctx.fillStyle = "#080d24";
        ctx.font = "bold 26px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(name.trim() || "BUSINESS NAME", canvas.width / 2, 85);
      }

      // Draw QR Code
      const qrImg = new Image();
      qrImg.src = qrPreviewUrl;
      await new Promise((resolve) => {
        qrImg.onload = resolve;
      });

      const qrSize = 340;
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = 160;

      // QR box background
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(qrX - 15, qrY - 15, qrSize + 30, qrSize + 30, 20);
      ctx.fill();
      ctx.stroke();

      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // Draw Google Center Badge
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(canvas.width / 2, qrY + qrSize / 2, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2;
      ctx.stroke();

      // G Letter
      ctx.fillStyle = brandColor || "#207de9";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("G", canvas.width / 2, qrY + qrSize / 2);

      // Bottom Banner
      const bannerY = 560;
      const bannerH = 180;
      ctx.fillStyle = brandColor || "#207de9";
      ctx.beginPath();
      ctx.roundRect(40, bannerY, canvas.width - 80, bannerH, 20);
      ctx.fill();

      // Review Us on Google
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText("Review Us on Google", canvas.width / 2, bannerY + 55);

      // 5 Gold Stars
      ctx.fillStyle = "#facc15";
      ctx.font = "32px sans-serif";
      ctx.fillText("★★★★★", canvas.width / 2, bannerY + 105);

      // Tagline
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(getCategoryTagline(category), canvas.width / 2, bannerY + 145);

      // Footer branding
      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px sans-serif";
      ctx.fillText("Powered by Digital FX ReviewFlow AI", canvas.width / 2, canvas.height - 20);

      // Export file
      const safeFilename = (name || "business").toLowerCase().replace(/[^a-z0-9]+/g, "-");

      if (format === "png" || format === "jpg") {
        const mimeType = format === "png" ? "image/png" : "image/jpeg";
        const dataUrl = canvas.toDataURL(mimeType, 0.95);
        const link = document.createElement("a");
        link.download = `${safeFilename}-review-qr.${format}`;
        link.href = dataUrl;
        link.click();
      } else if (format === "svg") {
        const svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
            <rect width="600" height="800" fill="#ffffff" stroke="#e2e8f0" stroke-width="3" rx="20"/>
            <image href="${qrPreviewUrl}" x="130" y="160" width="340" height="340"/>
            <rect x="40" y="560" width="520" height="180" rx="20" fill="${brandColor || "#207de9"}"/>
            <text x="300" y="615" fill="#ffffff" font-size="28" font-weight="bold" text-anchor="middle" font-family="sans-serif">Review Us on Google</text>
            <text x="300" y="665" fill="#facc15" font-size="32" text-anchor="middle" font-family="sans-serif">★★★★★</text>
            <text x="300" y="705" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle" font-family="sans-serif">${getCategoryTagline(category)}</text>
            <text x="300" y="785" fill="#94a3b8" font-size="12" text-anchor="middle" font-family="sans-serif">Powered by Digital FX ReviewFlow AI</text>
          </svg>
        `;
        const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${safeFilename}-review-qr.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      } else if (format === "pdf") {
        // High quality printable canvas popup
        const dataUrl = canvas.toDataURL("image/png");
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head><title>Print ${name} Review QR</title></head>
              <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f1f5f9;">
                <img src="${dataUrl}" style="max-height:92vh;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.1);"/>
                <script>window.onload = function() { window.print(); };</script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      }
    } catch (err) {
      console.error("Download Error:", err);
      alert("Failed to export QR file. Please try again.");
    } finally {
      setDownloadingFormat(null);
      setDownloadDropdownOpen(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 8. RENDER UI
  // ---------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      {/* Modal Container */}
      <div className="w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden my-auto">
        
        {/* =====================================================================
            HEADER (Clean Blue Accent Icon + Title + Close Button)
            ===================================================================== */}
        <div className="px-6 py-4.5 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white text-lg font-bold shadow-xs">
              🏢
            </span>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-[#080d24]">
                Register New Business &amp; Generate Review QR
              </h1>
              <p className="text-xs text-slate-500">
                Create your business profile and get a unique ReviewFlow QR code.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="h-8 w-8 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* =====================================================================
            MAIN CONTENT AREA (Left 65% Form, Right 35% Sticky Live Preview)
            ===================================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 bg-[#f8fafc]">
          {error && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-bold text-rose-800 flex items-center gap-2">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* -----------------------------------------------------------------
                LEFT COLUMN: BUSINESS REGISTRATION FORM (approx 65%)
                ----------------------------------------------------------------- */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
              
              {/* 01 BUSINESS INFORMATION */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-sm font-bold">
                    🏢
                  </span>
                  <div>
                    <h2 className="text-xs sm:text-sm font-black text-[#080d24] uppercase tracking-wide">
                      01 Business Information
                    </h2>
                    <p className="text-[11px] text-slate-500">Enter your business details.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Business Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Business Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
                      }}
                      placeholder="e.g. OM Packers and Movers"
                      className={`w-full h-11 rounded-xl border px-3.5 text-xs text-[#080d24] transition focus:outline-none focus:ring-2 ${
                        fieldErrors.name
                          ? "border-rose-300 focus:ring-rose-200 bg-rose-50/30"
                          : "border-slate-200 bg-slate-50/40 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="mt-1 text-[11px] font-medium text-rose-600">{fieldErrors.name}</p>
                    )}
                  </div>

                  {/* Business Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Business Category <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                        className="w-full h-11 appearance-none rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 text-xs font-semibold text-[#080d24] transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        {CATEGORIES_LIST.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        ▼
                      </span>
                    </div>
                  </div>
                </div>

                {/* Owner, Mobile, Email */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Owner / Contact Person
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">👤</span>
                      <input
                        type="text"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="Shashank Yadav"
                        className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/40 pl-8 pr-3 text-xs text-[#080d24] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">📞</span>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: "" });
                        }}
                        placeholder="+91 98765 43210"
                        className={`w-full h-11 rounded-xl border pl-8 pr-3 text-xs text-[#080d24] transition focus:outline-none focus:ring-2 ${
                          fieldErrors.phone
                            ? "border-rose-300 focus:ring-rose-200 bg-rose-50/30"
                            : "border-slate-200 bg-slate-50/40 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="mt-1 text-[11px] font-medium text-rose-600">{fieldErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">✉</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contact@ompackers.in"
                        className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/40 pl-8 pr-3 text-xs text-[#080d24] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 02 BUSINESS LOGO (Upload + Live Custom Preview) */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-sm font-bold">
                    🖼️
                  </span>
                  <div>
                    <h2 className="text-xs sm:text-sm font-black text-[#080d24] uppercase tracking-wide">
                      02 Business Logo
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Upload your business logo (JPG, PNG or SVG). This logo will be used in the QR code.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* Drag & Drop Upload Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingLogo(true);
                    }}
                    onDragLeave={() => setIsDraggingLogo(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[110px] ${
                      isDraggingLogo
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-slate-300 hover:border-blue-400 bg-slate-50/50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileProcess(e.target.files[0]);
                        }
                      }}
                    />
                    <span className="text-2xl text-blue-600 mb-1">☁️</span>
                    <p className="text-xs font-bold text-[#080d24]">Click to upload logo</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG or SVG (Max 2MB)</p>
                  </div>

                  {/* Logo Preview Card */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-3 flex flex-col items-center justify-center relative min-h-[110px] shadow-xs">
                    {logoUrl ? (
                      <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
                        <img
                          src={logoUrl}
                          alt="Uploaded Logo Preview"
                          className="max-h-16 max-w-[180px] object-contain"
                        />
                        <span className="mt-1.5 truncate max-w-[170px] text-[10px] font-mono text-slate-500">
                          {logoFileName || "uploaded-logo"}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveLogo();
                          }}
                          className="absolute top-1 right-1 h-6 w-6 rounded-full bg-slate-700/90 text-white hover:bg-rose-600 transition flex items-center justify-center text-xs font-bold cursor-pointer"
                          title="Remove uploaded logo"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="text-center p-2">
                        <span className="text-xl text-slate-300">🏢</span>
                        <p className="text-[11px] font-semibold text-slate-400 mt-1">No logo uploaded</p>
                        <p className="text-[10px] text-slate-400">Default business title will be rendered</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 03 LOCATION & ADDRESS */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-sm font-bold">
                    📍
                  </span>
                  <div>
                    <h2 className="text-xs sm:text-sm font-black text-[#080d24] uppercase tracking-wide">
                      03 Location &amp; Address
                    </h2>
                    <p className="text-[11px] text-slate-500">Enter your complete business address.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Complete Business Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">📍</span>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (fieldErrors.address) setFieldErrors({ ...fieldErrors, address: "" });
                      }}
                      placeholder="Shop No. 12, ABC Market, Kaushambi, Ghaziabad"
                      className={`w-full h-11 rounded-xl border pl-8 pr-3 text-xs text-[#080d24] transition focus:outline-none focus:ring-2 ${
                        fieldErrors.address
                          ? "border-rose-300 focus:ring-rose-200 bg-rose-50/30"
                          : "border-slate-200 bg-slate-50/40 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                    />
                  </div>
                  {fieldErrors.address && (
                    <p className="mt-1 text-[11px] font-medium text-rose-600">{fieldErrors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🏛️</span>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ghaziabad"
                        className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/40 pl-8 pr-3 text-xs text-[#080d24] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🗺️</span>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Uttar Pradesh"
                        className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/40 pl-8 pr-3 text-xs text-[#080d24] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pincode</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">📌</span>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="201016"
                        className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/40 pl-8 pr-3 text-xs text-[#080d24] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 04 GOOGLE REVIEW DESTINATION */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600 text-sm font-black">
                    G
                  </span>
                  <div>
                    <h2 className="text-xs sm:text-sm font-black text-[#080d24] uppercase tracking-wide">
                      04 Google Review Destination
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Add your Google Business Profile review link.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Google Review URL / Business Profile Link <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔗</span>
                      <input
                        type="url"
                        value={googleReviewUrl}
                        onChange={(e) => {
                          setGoogleReviewUrl(e.target.value);
                          if (fieldErrors.googleReviewUrl) setFieldErrors({ ...fieldErrors, googleReviewUrl: "" });
                        }}
                        placeholder="https://g.page/r/CS3Zr8xyQyKREBM/review"
                        className={`w-full h-11 rounded-xl border pl-8 pr-3 text-xs text-[#080d24] transition focus:outline-none focus:ring-2 ${
                          fieldErrors.googleReviewUrl
                            ? "border-rose-300 focus:ring-rose-200 bg-rose-50/30"
                            : "border-slate-200 bg-slate-50/40 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (isUrlValid(googleReviewUrl.trim())) {
                          window.open(googleReviewUrl.trim(), "_blank");
                        } else {
                          alert("Please enter a valid HTTP/HTTPS URL first to test.");
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-4 h-11 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold shrink-0 transition cursor-pointer"
                    >
                      <span>🔗</span> Test Link
                    </button>
                  </div>

                  {fieldErrors.googleReviewUrl && (
                    <p className="mt-1 text-[11px] font-medium text-rose-600">{fieldErrors.googleReviewUrl}</p>
                  )}

                  {/* Validation State Badge */}
                  <div className="mt-2.5">
                    {googleReviewUrl && isUrlValid(googleReviewUrl.trim()) ? (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 rounded-xl">
                        <span>✓</span> Valid Google Review link! This link will be used in your QR code.
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400">
                        Enter your direct Google Maps place review URL (e.g. https://g.page/r/.../review or https://search.google.com/local/writereview?placeid=...)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 05 CUSTOMIZATION (Color Picker & QR Styles) */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 text-sm font-bold">
                    🎨
                  </span>
                  <div>
                    <h2 className="text-xs sm:text-sm font-black text-[#080d24] uppercase tracking-wide">
                      05 Customization
                    </h2>
                    <p className="text-[11px] text-slate-500">Choose QR code style and colors.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                  {/* QR Brand Accent Color */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      QR Brand Accent Color
                    </label>
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <input
                          type="color"
                          value={brandColor}
                          onChange={(e) => setBrandColor(e.target.value)}
                          className="h-11 w-14 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white shadow-xs"
                        />
                      </div>
                      <input
                        type="text"
                        value={brandColor.toUpperCase()}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 text-xs font-mono font-bold text-[#080d24] focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* QR Style Selectors */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      QR Style
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Square */}
                      <button
                        type="button"
                        onClick={() => setQrStyle("square")}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center transition cursor-pointer ${
                          qrStyle === "square"
                            ? "border-blue-600 bg-blue-50/50 text-blue-700 font-bold ring-2 ring-blue-100"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-base mb-0.5">▦</span>
                        <span className="text-[10px]">Square</span>
                      </button>

                      {/* Rounded */}
                      <button
                        type="button"
                        onClick={() => setQrStyle("rounded")}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center transition cursor-pointer ${
                          qrStyle === "rounded"
                            ? "border-blue-600 bg-blue-50/50 text-blue-700 font-bold ring-2 ring-blue-100"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-base mb-0.5">▣</span>
                        <span className="text-[10px]">Rounded</span>
                      </button>

                      {/* Circle */}
                      <button
                        type="button"
                        onClick={() => setQrStyle("circle")}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center transition cursor-pointer ${
                          qrStyle === "circle"
                            ? "border-blue-600 bg-blue-50/50 text-blue-700 font-bold ring-2 ring-blue-100"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-base mb-0.5">⦿</span>
                        <span className="text-[10px]">Circle</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 06 ADDITIONAL INFORMATION */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 text-sm font-bold">
                    📄
                  </span>
                  <div>
                    <h2 className="text-xs sm:text-sm font-black text-[#080d24] uppercase tracking-wide">
                      06 Additional Information
                    </h2>
                    <p className="text-[11px] text-slate-500">Add any internal notes for your reference.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Internal Operational Notes
                  </label>
                  <textarea
                    rows={2}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="e.g. Printed tent card requested, 2 counter standees needed."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/40 p-3 text-xs text-[#080d24] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </form>

            {/* -----------------------------------------------------------------
                RIGHT COLUMN: LIVE QR CODE PREVIEW PANEL (approx 35%)
                ----------------------------------------------------------------- */}
            <div className="lg:col-span-5 lg:sticky lg:top-4 space-y-4">
              
              {/* Header Badge */}
              <div className="flex items-center gap-2 px-1">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-600 text-xs font-bold">
                  👁
                </span>
                <div>
                  <h3 className="text-xs font-black text-[#080d24]">QR Code Preview</h3>
                  <p className="text-[10px] text-slate-400">This is how your QR code will look.</p>
                </div>
              </div>

              {/* LIVE STANDEE / MARKETING CARD MOCKUP */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-lg flex flex-col items-center text-center overflow-hidden transition-all duration-200">
                
                {/* 1. Business Logo at Top */}
                <div className="h-16 w-full flex items-center justify-center mb-3">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={name || "Business Logo"}
                      className="max-h-14 max-w-[220px] object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-black text-[#080d24] truncate max-w-[240px]">
                        {name || "OM PACKERS AND MOVERS"}
                      </span>
                      <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400">
                        {category}
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Branded QR Code in Center */}
                <div
                  className={`bg-white p-3.5 border-2 shadow-xs mb-3 transition-all relative flex items-center justify-center ${
                    qrStyle === "rounded"
                      ? "rounded-3xl border-slate-200"
                      : qrStyle === "circle"
                      ? "rounded-full border-blue-200/80 p-5"
                      : "rounded-2xl border-slate-200"
                  }`}
                >
                  {qrPreviewUrl ? (
                    <img
                      src={qrPreviewUrl}
                      alt="Review QR Code"
                      className={`w-44 h-44 object-contain ${
                        qrStyle === "circle" ? "rounded-full" : qrStyle === "rounded" ? "rounded-2xl" : "rounded-lg"
                      }`}
                    />
                  ) : (
                    <div className="w-44 h-44 bg-slate-100 animate-pulse rounded-lg" />
                  )}

                  {/* Center Google Badge Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="h-9 w-9 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center">
                      <span className="text-sm font-black" style={{ color: brandColor || "#207de9" }}>
                        G
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Bottom Callout Banner */}
                <div
                  className="w-full rounded-2xl p-4 text-white shadow-xs transition-colors duration-200"
                  style={{ backgroundColor: brandColor || "#207de9" }}
                >
                  <h4 className="text-sm font-black tracking-wide uppercase">
                    Review Us on Google
                  </h4>
                  <div className="flex items-center justify-center gap-1 text-amber-300 text-lg my-1">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                  <p className="text-[11px] font-medium text-white/90">
                    &ldquo;{getCategoryTagline(category)}&rdquo;
                  </p>
                </div>
              </div>

              {/* DOWNLOAD QR BUTTONS */}
              <div className="space-y-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
                  >
                    <span>⬇</span> Download QR Code <span className="text-[10px]">▼</span>
                  </button>

                  {/* Segmented Format Downloads Row */}
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {(["png", "jpg", "svg", "pdf"] as const).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => triggerDownload(fmt)}
                        disabled={downloadingFormat !== null}
                        className="py-1.5 px-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-extrabold uppercase text-slate-700 shadow-xs hover:border-blue-400 transition cursor-pointer disabled:opacity-50"
                      >
                        {downloadingFormat === fmt ? "..." : fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* QR CODE INFO CHECKLIST CARD */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-950 space-y-2 shadow-xs">
                <div className="flex items-center gap-1.5 font-black text-blue-900">
                  <span>ℹ</span> QR Code Info
                </div>
                <ul className="space-y-1.5 text-[11px] text-blue-900/90 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Contains your business logo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Links to your Google review page</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Unique to your business</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>High quality for print &amp; digital</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Customizable colors &amp; style</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </div>

        {/* =====================================================================
            STICKY MODAL FOOTER (Cancel, Save as Draft, Submit & Generate)
            ===================================================================== */}
        <div className="px-6 py-4 border-t border-slate-200/80 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={loading}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
            >
              <span>💾</span> Save as Draft
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e, "active")}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#207de9] to-[#1570ef] px-6 py-2.5 text-xs font-black text-white shadow-md hover:from-[#1866c2] hover:to-[#0f5ac2] transition cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>⊞</span>
                  <span>Submit &amp; Generate Dynamic QR</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
