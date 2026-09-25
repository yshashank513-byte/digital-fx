"use client";

import { useState, useEffect } from "react";
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

  // Form Fields
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
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [initialStatus, setInitialStatus] = useState<QRStatus>("pending_approval");

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
      setCity("Ghaziabad");
      setState("Uttar Pradesh");
      setPincode("");
      setGoogleReviewUrl("");
      setBrandColor("#207de9");
      setAdditionalNotes("");
      setInitialStatus("pending_approval");
    }
    setError("");
    setFieldErrors({});
  }, [editingBusiness, isOpen]);

  if (!isOpen) return null;

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
    } else if (
      !googleReviewUrl.startsWith("http://") &&
      !googleReviewUrl.startsWith("https://")
    ) {
      errs.googleReviewUrl = "URL must start with http:// or https://";
    }

    if (website.trim() && !website.startsWith("http://") && !website.startsWith("https://")) {
      errs.website = "Website URL must start with http:// or https://";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, submitStatus?: QRStatus) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");

    const targetStatus = submitStatus || (isEditing ? initialStatus : "pending_approval");

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
      setError(err.message || "An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#207de9] text-xl font-bold">
              🏢
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#080d24]">
                {isEditing ? "Edit Business Profile" : "Register New Business & Dynamic QR"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? "Update business information and Google Review destination."
                  : "Create business profile and generate unique ReviewFlow QR code."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={(e) => handleSubmit(e)} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
              <span className="font-bold text-sm">⚠️</span>
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* Section 1: Business Identity */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#207de9]">
                01. Business Information
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apex Dental & Implant Clinic"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none transition focus:border-[#207de9] focus:ring-2 focus:ring-blue-100 ${
                    fieldErrors.name ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                  }`}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-[11px] text-rose-600 font-medium">{fieldErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none bg-white transition focus:border-[#207de9] focus:ring-2 focus:ring-blue-100"
                >
                  {CATEGORIES_LIST.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Owner / Contact Person
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Verma"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none transition focus:border-[#207de9] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none transition focus:border-[#207de9] focus:ring-2 focus:ring-blue-100 ${
                    fieldErrors.phone ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                  }`}
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-[11px] text-rose-600 font-medium">{fieldErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@business.com"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none transition focus:border-[#207de9] focus:ring-2 focus:ring-blue-100 ${
                    fieldErrors.email ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                  }`}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-[11px] text-rose-600 font-medium">{fieldErrors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Address & Location */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#207de9]">
                02. Location &amp; Address
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Complete Business Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shop No., Market / Building, Sector / Area"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none transition focus:border-[#207de9] focus:ring-2 focus:ring-blue-100 ${
                  fieldErrors.address ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                }`}
              />
              {fieldErrors.address && (
                <p className="mt-1 text-[11px] text-rose-600 font-medium">{fieldErrors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ghaziabad / Noida"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none transition focus:border-[#207de9] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Uttar Pradesh"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none transition focus:border-[#207de9] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="201016"
                  maxLength={6}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none transition focus:border-[#207de9] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Google Business Profile & Review Link */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#207de9]">
                03. Google Review Destination
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Google Review URL / Business Profile Link <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                value={googleReviewUrl}
                onChange={(e) => setGoogleReviewUrl(e.target.value)}
                placeholder="https://g.page/r/.../review or https://search.google.com/local/writereview?placeid=..."
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none font-mono transition focus:border-[#207de9] focus:ring-2 focus:ring-blue-100 ${
                  fieldErrors.googleReviewUrl ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                }`}
              />
              {fieldErrors.googleReviewUrl && (
                <p className="mt-1 text-[11px] text-rose-600 font-medium">
                  {fieldErrors.googleReviewUrl}
                </p>
              )}
              <p className="mt-1 text-[10.5px] text-slate-400">
                Tip: Copy the direct &quot;Ask for reviews&quot; link from your Google Business Profile dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.business.com"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none transition focus:border-[#207de9] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  QR Brand Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="h-9 w-12 rounded-lg border border-slate-200 p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono outline-none uppercase"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Internal Operational Notes
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="e.g. Printed tent card requested, 2 counter standees needed."
                rows={2}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none transition focus:border-[#207de9] focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5">
            {!isEditing && (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, "draft")}
                disabled={loading}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
              >
                Save as Draft
              </button>
            )}

            <button
              type="button"
              onClick={(e) => handleSubmit(e)}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#207de9] px-5 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-blue-600 transition cursor-pointer disabled:opacity-50"
            >
              {loading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              <span>{isEditing ? "Update Business" : "Submit & Generate Dynamic QR"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
