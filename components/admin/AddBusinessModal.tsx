"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { BusinessProfile, BusinessCategory, QRStatus } from "@/lib/reviewFlowTypes";
import { CATEGORIES_LIST } from "@/lib/reviewFlowCategories";
import { adminFetch } from "@/lib/adminFetch";

interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedBiz: BusinessProfile) => void;
  editingBusiness?: BusinessProfile | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Minimal pure-JS single-page PDF generator embedding JPEG image bytes
// ─────────────────────────────────────────────────────────────────────────────
function createPdfBlobFromJpeg(jpegBytes: Uint8Array, width: number, height: number): Blob {
  const enc = new TextEncoder();
  const obj1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
  const obj2 = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
  const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`;
  const imgHeader = `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`;
  const imgFooter = "\nendstream\nendobj\n";
  const contentStream = `q ${width} 0 0 ${height} 0 0 cm /Im1 Do Q`;
  const obj5 = `5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`;

  const header = "%PDF-1.4\n";
  const offsets: number[] = [];
  offsets[1] = header.length;
  offsets[2] = offsets[1] + obj1.length;
  offsets[3] = offsets[2] + obj2.length;
  offsets[4] = offsets[3] + obj3.length;
  const part1Bytes = enc.encode(header + obj1 + obj2 + obj3 + imgHeader);
  const part2Bytes = jpegBytes;
  const part3Text = imgFooter + obj5;
  const part3Bytes = enc.encode(part3Text);
  offsets[5] = part1Bytes.length + part2Bytes.length + enc.encode(imgFooter).length;

  let xref = "xref\n0 6\n0000000000 65535 f \n";
  for (let i = 1; i <= 5; i++) {
    xref += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  const startxref = part1Bytes.length + part2Bytes.length + part3Bytes.length;
  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;
  const trailerBytes = enc.encode(xref + trailer);

  return new Blob([part1Bytes, part2Bytes.buffer as ArrayBuffer, part3Bytes, trailerBytes], { type: "application/pdf" });
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
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [brandColor, setBrandColor] = useState("#207de9");
  const [qrStyle, setQrStyle] = useState<"square" | "rounded" | "circle">("square");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [initialStatus, setInitialStatus] = useState<QRStatus>("active");

  // Logo upload state
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [logoFileName, setLogoFileName] = useState<string>("");
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI & Validation States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [testUrlSuccess, setTestUrlSuccess] = useState(false);

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
      setName("");
      setCategory("Packers & Movers");
      setOwnerName("");
      setPhone("");
      setEmail("");
      setWebsite("");
      setAddress("");
      setCity("");
      setState("");
      setPincode("");
      setGoogleReviewUrl("");
      setBrandColor("#207de9");
      setQrStyle("square");
      setLogoUrl("");
      setLogoFileName("");
      setAdditionalNotes("");
      setInitialStatus("active");
    }
    setError("");
    setFieldErrors({});
    setTestUrlSuccess(false);
  }, [editingBusiness, isOpen]);

  // Track if form is dirty for unsaved changes guard
  const isDirty = Boolean(
    name.trim() ||
    phone.trim() ||
    googleReviewUrl.trim() ||
    logoUrl ||
    address.trim() ||
    email.trim() ||
    ownerName.trim()
  );

  const handleCloseSafe = () => {
    if (isDirty && !isEditing) {
      const confirmDiscard = window.confirm("You have unsaved changes in this form. Are you sure you want to close and discard them?");
      if (!confirmDiscard) return;
    }
    onClose();
  };

  // ---------------------------------------------------------------------------
  // 3. LIVE QR CODE GENERATOR
  // ---------------------------------------------------------------------------
  const generateLiveQR = useCallback(async () => {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "https://www.digitalfx.in";
      const slug = (name || "business")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const targetId = editingBusiness?.id || slug || "review";
      const destination = `${origin}/r/${targetId}?name=${encodeURIComponent(name || "Business")}&cat=${encodeURIComponent(category)}&city=${encodeURIComponent(city || "NCR")}&reviewUrl=${encodeURIComponent(googleReviewUrl.trim())}`;
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
  }, [name, category, city, googleReviewUrl, brandColor, editingBusiness]);

  useEffect(() => {
    generateLiveQR();
  }, [generateLiveQR]);

  if (!isOpen) return null;

  // ---------------------------------------------------------------------------
  // 4. LOGO HANDLERS
  // ---------------------------------------------------------------------------
  const handleFileProcess = (file: File) => {
    if (!file) return;
    const validMimes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];
    if (!validMimes.includes(file.type)) {
      setFieldErrors((prev) => ({ ...prev, logo: "Invalid file format. Please upload a PNG, JPG, SVG, or WEBP image." }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFieldErrors((prev) => ({ ...prev, logo: "File size exceeds 2MB limit. Please upload a smaller image." }));
      return;
    }

    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy.logo;
      return copy;
    });

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
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy.logo;
      return copy;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ---------------------------------------------------------------------------
  // 5. VALIDATION
  // ---------------------------------------------------------------------------
  const isUrlValid = (url: string) => {
    try {
      const u = new URL(url);
      const isHttp = u.protocol === "http:" || u.protocol === "https:";
      const hasValidHost = Boolean(u.hostname && u.hostname.includes(".") && !u.hostname.includes(" "));
      return isHttp && hasValidHost;
    } catch {
      return false;
    }
  };

  const validate = (forDraft = false) => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = forDraft ? "Business name is required to save a draft." : "Business name is required.";
    }

    if (forDraft) {
      setFieldErrors(errs);
      return Object.keys(errs).length === 0;
    }

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

    if (pincode.trim() && !/^\d{6}$/.test(pincode.trim())) {
      errs.pincode = "Please enter a valid 6-digit pincode.";
    }

    let cleanUrl = googleReviewUrl.trim();
    if (cleanUrl && !cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      if (cleanUrl.includes(".")) {
        cleanUrl = `https://${cleanUrl}`;
        setGoogleReviewUrl(cleanUrl);
      }
    }

    if (!cleanUrl) {
      errs.googleReviewUrl = "Google Review or Business Profile URL is required.";
    } else if (!isUrlValid(cleanUrl)) {
      errs.googleReviewUrl = "Please enter a valid URL (e.g. https://g.page/r/.../review)";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle URL Test Click
  const handleTestUrl = () => {
    let clean = googleReviewUrl.trim();
    if (clean && !clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`;
      setGoogleReviewUrl(clean);
    }
    if (clean && isUrlValid(clean)) {
      setTestUrlSuccess(true);
      window.open(clean, "_blank", "noopener,noreferrer");
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy.googleReviewUrl;
        return copy;
      });
      setTimeout(() => setTestUrlSuccess(false), 4000);
    } else {
      setFieldErrors((prev) => ({
        ...prev,
        googleReviewUrl: "Please enter a valid HTTP/HTTPS Google Review URL first.",
      }));
    }
  };

  // ---------------------------------------------------------------------------
  // 6. FORM SUBMISSION
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent, submitStatus?: QRStatus) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate concurrent submissions
    setError("");

    const isDraft = submitStatus === "draft";
    if (!validate(isDraft)) {
      setError(isDraft ? "Please provide a Business Name to save draft." : "Please complete the required fields highlighted in red below.");
      setTimeout(() => {
        const firstErrorEl = document.querySelector(".border-rose-300");
        if (firstErrorEl) firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 60);
      return;
    }

    setLoading(true);
    const targetStatus: QRStatus = submitStatus || (isEditing ? initialStatus : "active");
    let cleanUrl = googleReviewUrl.trim();
    if (cleanUrl && !cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`;
    }

    try {
      const payload = {
        id: editingBusiness?.id,
        name: name.trim(),
        category,
        ownerName: ownerName.trim() || undefined,
        phone: phone.trim(),
        email: email.trim() || undefined,
        website: website.trim() || undefined,
        address: address.trim() || (city ? `${city.trim()}, India` : "NCR, India"),
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        pincode: pincode.trim() || undefined,
        googleReviewUrl: cleanUrl,
        brandColor,
        qrStyle,
        logoUrl: logoUrl || undefined,
        additionalNotes: additionalNotes.trim() || undefined,
        status: targetStatus,
      };

      let res: Response;
      try {
        res = await adminFetch("/api/reviewflow/businesses", {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (_) {
        res = await fetch("/api/reviewflow/businesses", {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Server responded with status ${res.status}`);
      }

      onSuccess(json.business);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save business profile.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 7. QR CODE DOWNLOAD (PNG, JPG, SVG, PDF)
  // ---------------------------------------------------------------------------
  const triggerDownload = async (format: "png" | "jpg" | "svg" | "pdf") => {
    if (downloadingFormat !== null) return;
    setDownloadingFormat(format);
    try {
      const W = 700, H = 1150;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
      const cx = W / 2;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      // ── "Google" multicolor letters ──────────────────────────────
      const gColors = ["#4285F4", "#EA4335", "#FBBC04", "#4285F4", "#34A853", "#EA4335"];
      const gLetters = ["G", "o", "o", "g", "l", "e"];
      ctx.font = "bold 40px Arial, sans-serif";
      const lws = gLetters.map((l) => ctx.measureText(l).width);
      const totW = lws.reduce((a, b) => a + b, 0) + 4 * (gLetters.length - 1);
      let lx = cx - totW / 2;
      gLetters.forEach((letter, i) => {
        ctx.fillStyle = gColors[i];
        ctx.fillText(letter, lx + lws[i] / 2, 68);
        lx += lws[i] + 4;
      });

      // ── "Review Us" ──────────────────────────────────────────────
      ctx.fillStyle = "#0d1b4b";
      ctx.font = "bold 62px Arial, sans-serif";
      ctx.fillText("Review Us", cx, 143);

      // ── "on Google" with per-letter color ────────────────────────
      ctx.font = "bold 62px Arial, sans-serif";
      const onW2 = ctx.measureText("on ").width;
      const bls = gLetters.map((l) => ctx.measureText(l).width);
      const bGW = bls.reduce((a, b) => a + b, 0) + 3 * (gLetters.length - 1);
      const ls2 = cx - (onW2 + bGW) / 2;
      ctx.fillStyle = "#0d1b4b";
      ctx.fillText("on ", ls2 + onW2 / 2, 218);
      let bx2 = ls2 + onW2;
      gLetters.forEach((letter, i) => {
        ctx.fillStyle = gColors[i];
        ctx.fillText(letter, bx2 + bls[i] / 2, 218);
        bx2 += bls[i] + 3;
      });

      // ── Tagline ───────────────────────────────────────────────────
      ctx.fillStyle = "#4a5568";
      ctx.font = "20px Arial, sans-serif";
      ctx.fillText("Your feedback helps us serve you better!", cx, 258);

      // ── Star decoration lines ─────────────────────────────────────
      const ray = (x1: number, y1: number, x2: number, y2: number) => {
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      };
      const sy = 305;
      ray(cx - 130, sy - 5, cx - 155, sy - 20);
      ray(cx - 115, sy - 18, cx - 125, sy - 40);
      ray(cx + 130, sy - 5, cx + 155, sy - 20);
      ray(cx + 115, sy - 18, cx + 125, sy - 40);

      // ── 5 Stars ───────────────────────────────────────────────────
      ctx.fillStyle = "#f59e0b";
      ctx.font = "50px Arial, sans-serif";
      ctx.fillText("★  ★  ★  ★  ★", cx, sy + 5);

      // ── Logo Circle ───────────────────────────────────────────────
      const logoY = 388, logoR = 60;
      ctx.beginPath();
      ctx.arc(cx, logoY, logoR + 5, 0, Math.PI * 2);
      ctx.strokeStyle = brandColor || "#f97316";
      ctx.lineWidth = 4;
      ctx.stroke();

      let logoDrawn = false;
      if (logoUrl) {
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = logoUrl;
          await new Promise((r, j) => {
            img.onload = r;
            img.onerror = j;
          });
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, logoY, logoR, 0, Math.PI * 2);
          ctx.clip();
          const ratio = Math.min((logoR * 2) / img.width, (logoR * 2) / img.height);
          ctx.drawImage(img, cx - (img.width * ratio) / 2, logoY - (img.height * ratio) / 2, img.width * ratio, img.height * ratio);
          ctx.restore();
          logoDrawn = true;
        } catch { /**/ }
      }
      if (!logoDrawn) {
        ctx.beginPath();
        ctx.arc(cx, logoY, logoR, 0, Math.PI * 2);
        ctx.fillStyle = "#fff7ed";
        ctx.fill();
        ctx.fillStyle = brandColor || "#f97316";
        ctx.font = "bold 50px Arial, sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillText((name || "B").charAt(0).toUpperCase(), cx, logoY);
        ctx.textBaseline = "alphabetic";
      }

      // ── Business Name ─────────────────────────────────────────────
      ctx.fillStyle = "#0d1b4b";
      ctx.font = "bold 34px Arial, sans-serif";
      ctx.fillText((name || "BUSINESS NAME").toUpperCase(), cx, 490);

      // ── Category • City ───────────────────────────────────────────
      ctx.fillStyle = "#64748b";
      ctx.font = "19px Arial, sans-serif";
      ctx.fillText(`${category}${city ? " • " + city : ""}`, cx, 520);

      // ── QR with decorative rays ───────────────────────────────────
      const qrY = 558, qrSz = 240, qrX = cx - qrSz / 2;
      const blueRay = (angle: number, inner: number, outer: number) => {
        ctx.strokeStyle = brandColor || "#3b82f6";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * inner, qrY + qrSz / 2 + Math.sin(angle) * inner);
        ctx.lineTo(cx + Math.cos(angle) * outer, qrY + qrSz / 2 + Math.sin(angle) * outer);
        ctx.stroke();
      };
      blueRay(Math.PI + 0.15, 148, 185);
      blueRay(Math.PI - 0.15, 148, 185);
      blueRay(Math.PI + 0.5, 140, 172);
      blueRay(-0.15, 148, 185);
      blueRay(0.15, 148, 185);
      blueRay(-0.5, 140, 172);

      const qrImg = new Image();
      qrImg.src = qrPreviewUrl;
      await new Promise((r) => { qrImg.onload = r; });
      ctx.drawImage(qrImg, qrX, qrY, qrSz, qrSz);

      // Google G badge center
      ctx.beginPath();
      ctx.arc(cx, qrY + qrSz / 2, 26, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#4285F4";
      ctx.font = "bold 26px Arial, sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillText("G", cx, qrY + qrSz / 2);
      ctx.textBaseline = "alphabetic";

      // ── Scan the QR Code ──────────────────────────────────────────
      const scY = qrY + qrSz + 48;
      ctx.strokeStyle = brandColor || "#3b82f6";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(cx - 80, scY - 30, 22, 36, 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 80, scY - 10);
      ctx.lineTo(cx - 58, scY - 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - 69, scY - 4, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = brandColor || "#3b82f6";
      ctx.fill();

      ctx.fillStyle = "#0d1b4b";
      ctx.font = "bold 21px Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("Scan the QR Code", cx - 52, scY - 14);
      ctx.fillStyle = "#64748b";
      ctx.font = "16px Arial, sans-serif";
      ctx.fillText("to share your experience", cx - 52, scY + 10);

      // ── Feature divider + 3 items ─────────────────────────────────
      const fY = scY + 50;
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1.5;
      ctx.textAlign = "center";
      ctx.beginPath();
      ctx.moveTo(55, fY - 10);
      ctx.lineTo(W - 55, fY - 10);
      ctx.stroke();

      const feats = [
        { icon: "⚡", l1: "Takes only", l2: "15 seconds", c: "#f59e0b", x: cx - 195 },
        { icon: "⊞", l1: "No app", l2: "needed", c: "#ef4444", x: cx },
        { icon: "✓", l1: "Safe & Secure", l2: "Google Review", c: brandColor || "#3b82f6", x: cx + 195 },
      ];
      feats.forEach((f) => {
        ctx.fillStyle = f.c;
        ctx.font = "bold 26px Arial, sans-serif";
        ctx.fillText(f.icon, f.x, fY + 34);
        ctx.fillStyle = "#0d1b4b";
        ctx.font = "bold 14px Arial, sans-serif";
        ctx.fillText(f.l1, f.x, fY + 60);
        ctx.fillStyle = "#64748b";
        ctx.font = "13px Arial, sans-serif";
        ctx.fillText(f.l2, f.x, fY + 78);
      });
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 100, fY + 5);
      ctx.lineTo(cx - 100, fY + 85);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 100, fY + 5);
      ctx.lineTo(cx + 100, fY + 85);
      ctx.stroke();

      // ── Thank You ─────────────────────────────────────────────────
      ctx.fillStyle = "#0d1b4b";
      ctx.font = "italic bold 40px Georgia, serif";
      ctx.fillText("Thank You!", cx - 10, H - 54);
      ctx.fillStyle = "#ef4444";
      ctx.font = "32px Arial, sans-serif";
      ctx.fillText("♡", cx + 112, H - 56);
      ctx.strokeStyle = brandColor || "#3b82f6";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx - 90, H - 42);
      ctx.lineTo(cx + 90, H - 42);
      ctx.stroke();

      // ── File Export ───────────────────────────────────────────────
      const sf = (name || "business").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "review";

      if (format === "png" || format === "jpg") {
        const mime = format === "png" ? "image/png" : "image/jpeg";
        const a = document.createElement("a");
        a.download = `${sf}-review-standee.${format}`;
        a.href = canvas.toDataURL(mime, 0.95);
        a.click();
      } else if (format === "svg") {
        const du = canvas.toDataURL("image/png", 0.95);
        const sv = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><image href="${du}" x="0" y="0" width="${W}" height="${H}"/></svg>`;
        const blob = new Blob([sv], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = `${sf}-review-standee.svg`;
        a.href = url;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === "pdf") {
        // Pure single-page downloadable PDF document
        const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.92);
        const base64Str = jpegDataUrl.split(",")[1];
        const binaryStr = atob(base64Str);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const pdfBlob = createPdfBlobFromJpeg(bytes, W, H);
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.download = `${sf}-review-standee.pdf`;
        a.href = pdfUrl;
        a.click();
        URL.revokeObjectURL(pdfUrl);
      }
    } catch (err) {
      console.error("Download Error:", err);
      alert("Failed to export standee file. Please try again.");
    } finally {
      setDownloadingFormat(null);
    }
  };

  // ---------------------------------------------------------------------------
  // 8. INPUT HELPER
  // ---------------------------------------------------------------------------
  const inputCls = (errKey?: string) =>
    `w-full h-10 rounded-lg border px-3 text-[13px] text-slate-800 transition focus:outline-none focus:ring-2 placeholder:text-slate-400 ${
      errKey && fieldErrors[errKey]
        ? "border-rose-300 focus:ring-rose-200 bg-rose-50/30"
        : "border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-blue-100 focus:bg-white"
    }`;

  // ---------------------------------------------------------------------------
  // 9. RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full sm:max-w-5xl h-[96dvh] sm:h-auto sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden">

        {/* ── HEADER ── */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-[#207de9]/8 via-white to-white">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#207de9] flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-slate-900 leading-tight">
                {isEditing ? "Edit Business" : "Register New Business"}
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Generate an official Google Review QR standee in seconds</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCloseSafe}
            aria-label="Close modal"
            className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="mx-5 mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[12px] font-semibold text-rose-700 flex items-center gap-2">
              <span>⚠</span>
              <span>{error}</span>
              <button type="button" onClick={() => setError("")} className="ml-auto text-rose-400 hover:text-rose-700 font-bold">✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-0 lg:gap-px bg-slate-100">

            {/* ── LEFT: FORM ── */}
            <form id="biz-form" onSubmit={handleSubmit} className="bg-white px-5 py-5 space-y-5">

              {/* STEP 1 — Business Info */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-6 w-6 rounded-md bg-[#207de9] text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                  <span className="text-[12px] font-bold text-slate-700 uppercase tracking-wide">Business Info</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Business Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      maxLength={120}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
                      }}
                      placeholder="e.g. OM Packers and Movers"
                      className={inputCls("name")}
                    />
                    {fieldErrors.name && <p className="mt-1 text-[11px] text-rose-600 font-medium">{fieldErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Business Category <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                        className="w-full h-10 appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] font-medium text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white"
                      >
                        {CATEGORIES_LIST.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">▼</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Owner / Contact</label>
                    <input
                      type="text"
                      value={ownerName}
                      maxLength={80}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className={inputCls()}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Mobile <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      maxLength={15}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: "" });
                      }}
                      placeholder="e.g. 9876543210"
                      className={inputCls("phone")}
                    />
                    {fieldErrors.phone && <p className="mt-1 text-[11px] text-rose-600 font-medium">{fieldErrors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      maxLength={120}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                      }}
                      placeholder="e.g. hello@business.com"
                      className={inputCls("email")}
                    />
                    {fieldErrors.email && <p className="mt-1 text-[11px] text-rose-600 font-medium">{fieldErrors.email}</p>}
                  </div>
                </div>
              </section>

              <div className="border-t border-slate-100" />

              {/* STEP 2 — Business Logo */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-6 w-6 rounded-md bg-violet-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                  <span className="text-[12px] font-bold text-slate-700 uppercase tracking-wide">Business Logo</span>
                  <span className="text-[10px] text-slate-400 font-medium ml-1">Optional · Used in QR &amp; Standee</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingLogo(true); }}
                    onDragLeave={() => setIsDraggingLogo(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[100px] ${
                      isDraggingLogo ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-300 bg-slate-50/60 hover:bg-blue-50/30"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                      className="hidden"
                      onChange={(e) => { if (e.target.files?.[0]) handleFileProcess(e.target.files[0]); }}
                    />
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                    </div>
                    <p className="text-[12px] font-semibold text-slate-700">Click or drag to upload</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, SVG or WEBP · Max 2MB</p>
                  </div>

                  {/* Logo preview */}
                  <div className="rounded-xl border border-slate-200 bg-white p-3 flex flex-col items-center justify-center min-h-[100px] relative">
                    {logoUrl ? (
                      <>
                        <img src={logoUrl} alt="Logo Preview" className="max-h-14 max-w-[170px] object-contain" />
                        <span className="mt-1.5 text-[10px] font-mono text-slate-400 truncate max-w-[160px]">{logoFileName}</span>
                        <div className="flex items-center gap-1.5 mt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="px-2 py-0.5 rounded text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveLogo();
                            }}
                            className="px-2 py-0.5 rounded text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center opacity-40">
                        <span className="text-2xl">🏢</span>
                        <p className="text-[11px] font-medium text-slate-500 mt-1">No logo uploaded</p>
                        <p className="text-[10px] text-slate-400">Initial letter used on standee</p>
                      </div>
                    )}
                  </div>
                </div>
                {fieldErrors.logo && <p className="mt-2 text-[11px] text-rose-600 font-medium">{fieldErrors.logo}</p>}
              </section>

              <div className="border-t border-slate-100" />

              {/* STEP 3 — Location */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-6 w-6 rounded-md bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
                  <span className="text-[12px] font-bold text-slate-700 uppercase tracking-wide">Location &amp; Address</span>
                </div>
                <div className="mb-3">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Address</label>
                  <input
                    type="text"
                    value={address}
                    maxLength={200}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Shop No. 12, Market Complex, Sector 4"
                    className={inputCls("address")}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      maxLength={60}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ghaziabad"
                      className={inputCls()}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      maxLength={60}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Uttar Pradesh"
                      className={inputCls()}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      maxLength={6}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setPincode(val);
                        if (fieldErrors.pincode) setFieldErrors({ ...fieldErrors, pincode: "" });
                      }}
                      placeholder="201016"
                      className={inputCls("pincode")}
                    />
                    {fieldErrors.pincode && <p className="mt-1 text-[11px] text-rose-600 font-medium">{fieldErrors.pincode}</p>}
                  </div>
                </div>
              </section>

              <div className="border-t border-slate-100" />

              {/* STEP 4 — Google Review URL */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-6 w-6 rounded-md bg-red-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0">G</span>
                  <span className="text-[12px] font-bold text-slate-700 uppercase tracking-wide">Google Review Link</span>
                  <span className="text-[10px] text-rose-500 font-semibold">Required</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={googleReviewUrl}
                      onChange={(e) => {
                        setGoogleReviewUrl(e.target.value);
                        if (fieldErrors.googleReviewUrl) setFieldErrors({ ...fieldErrors, googleReviewUrl: "" });
                      }}
                      placeholder="https://g.page/r/.../review"
                      className={inputCls("googleReviewUrl")}
                    />
                    {fieldErrors.googleReviewUrl && (
                      <p className="mt-1 text-[11px] text-rose-600 font-medium">{fieldErrors.googleReviewUrl}</p>
                    )}
                    {googleReviewUrl && isUrlValid(googleReviewUrl.trim()) && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                        <span>✓</span> Valid Google Review link — QR will direct customer to this destination
                      </div>
                    )}
                    {testUrlSuccess && (
                      <div className="mt-1 text-[11px] font-semibold text-blue-700">
                        ↗ Link opened in a new tab for testing!
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleTestUrl}
                    className="shrink-0 h-10 px-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-600 hover:text-blue-700 text-[12px] font-semibold transition cursor-pointer"
                  >
                    Test ↗
                  </button>
                </div>
              </section>

              <div className="border-t border-slate-100" />

              {/* STEP 5 — Customization */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-6 w-6 rounded-md bg-amber-400 text-white text-[11px] font-bold flex items-center justify-center shrink-0">5</span>
                  <span className="text-[12px] font-bold text-slate-700 uppercase tracking-wide">QR Style &amp; Color</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Brand Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="h-10 w-12 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={brandColor.toUpperCase()}
                        maxLength={7}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="h-10 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] font-mono font-bold text-slate-800 focus:border-blue-400 focus:outline-none focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">QR Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["square", "rounded", "circle"] as const).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setQrStyle(style)}
                          className={`py-2 rounded-lg border text-[11px] font-semibold transition cursor-pointer capitalize ${
                            qrStyle === style
                              ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-300"
                              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {style === "square" ? "▦" : style === "rounded" ? "▣" : "⦿"} {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <div className="border-t border-slate-100" />

              {/* STEP 6 — Notes */}
              <section className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-6 w-6 rounded-md bg-slate-400 text-white text-[11px] font-bold flex items-center justify-center shrink-0">6</span>
                  <span className="text-[12px] font-bold text-slate-700 uppercase tracking-wide">Internal Notes</span>
                  <span className="text-[10px] text-slate-400">Optional</span>
                </div>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  maxLength={500}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="e.g. 2 counter standees needed, printed card requested…"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white resize-none placeholder:text-slate-400"
                />
              </section>
            </form>

            {/* ── RIGHT: LIVE QR PREVIEW ── */}
            <div className="bg-[#F8FAFC] lg:border-l border-slate-100 px-4 py-5 flex flex-col gap-4">

              {/* Preview label */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[12px] font-bold text-slate-700">Live Preview</h3>
                  <p className="text-[10px] text-slate-400">Updates as you type</p>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* ── PROFESSIONAL STANDEE CARD ── */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-md overflow-hidden">

                {/* Rainbow top strip */}
                <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#4285F4 0%,#EA4335 25%,#FBBC05 50%,#34A853 75%,#4285F4 100%)" }} />

                <div className="px-4 pt-4 pb-5 flex flex-col items-center text-center gap-3">

                  {/* Google heading */}
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="flex items-center gap-[1px] text-[22px] font-black leading-none tracking-tight">
                      <span style={{ color: "#4285F4" }}>G</span>
                      <span style={{ color: "#EA4335" }}>o</span>
                      <span style={{ color: "#FBBC05" }}>o</span>
                      <span style={{ color: "#4285F4" }}>g</span>
                      <span style={{ color: "#34A853" }}>l</span>
                      <span style={{ color: "#EA4335" }}>e</span>
                    </div>
                    <p className="text-[9px] uppercase tracking-[0.18em] font-bold text-slate-400">Review Us</p>
                  </div>

                  {/* 5 Stars */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill="#FBBF24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  {/* Logo circle + business info */}
                  <div className="flex flex-col items-center gap-1.5">
                    {logoUrl ? (
                      <div className="w-14 h-14 rounded-full border-[3px] flex items-center justify-center overflow-hidden bg-white shadow-sm" style={{ borderColor: brandColor || "#207de9" }}>
                        <img src={logoUrl} alt={name || "Logo"} className="w-full h-full object-contain p-1" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full border-[3px] flex items-center justify-center font-black text-white text-lg shadow-sm" style={{ borderColor: brandColor || "#207de9", backgroundColor: brandColor || "#207de9" }}>
                        {(name || "B").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-[12px] font-extrabold text-slate-900 uppercase tracking-wide leading-tight truncate max-w-[200px]">
                        {name || "BUSINESS NAME"}
                      </p>
                      <p className="text-[9px] text-slate-500 font-medium mt-0.5">{category}{city ? ` • ${city}` : ""}</p>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="relative flex items-center justify-center">
                    {/* Blue rays decoration */}
                    <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 flex flex-col gap-[3px]">
                      {[10, 14, 18, 14, 10].map((w, i) => (
                        <div key={i} className="rounded-full h-[2.5px]" style={{ width: `${w}px`, backgroundColor: brandColor || "#207de9", opacity: 0.5 }} />
                      ))}
                    </div>
                    <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 flex flex-col gap-[3px]">
                      {[10, 14, 18, 14, 10].map((w, i) => (
                        <div key={i} className="rounded-full h-[2.5px]" style={{ width: `${w}px`, backgroundColor: brandColor || "#207de9", opacity: 0.5 }} />
                      ))}
                    </div>

                    <div className={`bg-white p-2.5 border shadow-sm relative transition-all flex items-center justify-center ${
                      qrStyle === "rounded"
                        ? "rounded-2xl border-slate-200"
                        : qrStyle === "circle"
                        ? "rounded-full border-blue-200/60 p-4"
                        : "rounded-xl border-slate-200"
                    }`}>
                      {qrPreviewUrl ? (
                        <img
                          src={qrPreviewUrl}
                          alt="QR Code"
                          className={`w-32 h-32 object-contain ${
                            qrStyle === "circle" ? "rounded-full" : qrStyle === "rounded" ? "rounded-xl" : "rounded-sm"
                          }`}
                        />
                      ) : (
                        <div className="w-32 h-32 bg-slate-100 animate-pulse rounded-xl" />
                      )}
                      {/* Google G badge */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="h-7 w-7 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center">
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scan text */}
                  <div className="flex flex-col items-center gap-0.5">
                    <p className="text-[11px] font-bold text-slate-800">📷 Scan to share your experience</p>
                    <p className="text-[9px] text-slate-400">Takes only 15 seconds · No app needed</p>
                  </div>

                  {/* Divider + features */}
                  <div className="w-full border-t border-slate-100 pt-2.5">
                    <div className="flex items-center justify-around text-[8.5px] font-semibold text-slate-500">
                      <span className="flex flex-col items-center gap-0.5"><span className="text-[13px]">⚡</span>15 seconds</span>
                      <span className="w-px h-6 bg-slate-200" />
                      <span className="flex flex-col items-center gap-0.5"><span className="text-[13px]">📱</span>No app needed</span>
                      <span className="w-px h-6 bg-slate-200" />
                      <span className="flex flex-col items-center gap-0.5"><span className="text-[13px]">✅</span>Safe &amp; Secure</span>
                    </div>
                  </div>

                  {/* Thank you footer */}
                  <div className="flex flex-col items-center gap-0.5 pt-0.5">
                    <p className="text-[11px] font-bold italic text-slate-700">Thank You! ♡</p>
                    <div className="h-0.5 w-12 rounded-full" style={{ backgroundColor: brandColor || "#207de9" }} />
                  </div>

                </div>
              </div>

              {/* Download buttons */}
              <div>
                <p className="text-[11px] font-semibold text-slate-500 mb-2">Download Standee</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["png", "jpg", "svg", "pdf"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => triggerDownload(fmt)}
                      disabled={downloadingFormat !== null}
                      className="py-2 rounded-lg border border-slate-200 bg-white hover:bg-[#207de9] hover:border-[#207de9] hover:text-white text-[11px] font-bold uppercase text-slate-600 shadow-sm transition cursor-pointer disabled:opacity-40"
                    >
                      {downloadingFormat === fmt ? "…" : fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info checklist */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 px-3.5 py-3 space-y-1.5">
                <p className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">ℹ QR Code Info</p>
                {[
                  "Contains your business logo",
                  "Links to Google review page",
                  "Unique to your business",
                  "Print & digital ready",
                  "Customizable color & style",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-[11px] text-blue-800 font-medium">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 bg-white">
          <button
            type="button"
            onClick={handleCloseSafe}
            className="h-9 px-4 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={loading}
              className="h-9 px-4 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save Draft
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "active")}
              disabled={loading}
              className="h-9 px-5 rounded-lg bg-[#207de9] hover:bg-[#1866c2] text-white text-[13px] font-bold shadow-sm transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Processing…</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {isEditing ? "Save Changes" : "Submit & Generate QR"}
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
