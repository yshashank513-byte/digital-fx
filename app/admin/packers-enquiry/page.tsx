"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";

export type PackersEnquiry = {
  id: string; // e.g. "PK-1001"
  name: string;
  phone: string;
  from_location: string;
  to_location: string;
  address: string;
  truck_feet: string;
  vendor_rate: number;
  customer_rate: number;
  follow_up_date: string; // "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm"
  remark: string;
  status: "pending" | "interested" | "cancel" | "booked";
  created_at: string;
};

const TRUCK_PRESETS = [
  "Tata Ace / Chhota Hathi (7 Ft)",
  "Pickup (8 Ft)",
  "14 Feet Closed Container",
  "14 Feet Open Truck",
  "17 Feet Container",
  "19 Feet Container",
  "22 Feet Multi-Axle",
  "32 Feet Single Axle (SXL)",
  "32 Feet Multi-Axle (MXL)",
  "Other / Custom",
];

// Storage key bumped to v2 to cleanly separate from old cached demo items
const STORAGE_KEY = "digitalfx_packers_enquiries_v2";

export default function PackersEnquiryPage() {
  const [enquiries, setEnquiries] = useState<PackersEnquiry[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [followUpFilter, setFollowUpFilter] = useState<string>("all");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState<PackersEnquiry | null>(null);
  const [quotationSlipEnquiry, setQuotationSlipEnquiry] = useState<PackersEnquiry | null>(null);
  const [whatsAppModalEnquiry, setWhatsAppModalEnquiry] = useState<PackersEnquiry | null>(null);
  const [whatsAppCustomText, setWhatsAppCustomText] = useState("");
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    from_location: string;
    to_location: string;
    address: string;
    truck_feet: string;
    vendor_rate: string;
    customer_rate: string;
    follow_up_date: string;
    remark: string;
    status: "pending" | "interested" | "cancel" | "booked";
  }>({
    name: "",
    phone: "",
    from_location: "",
    to_location: "",
    address: "",
    truck_feet: "14 Feet Closed Container",
    vendor_rate: "",
    customer_rate: "",
    follow_up_date: "",
    remark: "",
    status: "pending",
  });

  const printRef = useRef<HTMLDivElement>(null);

  // Helper to re-sequence ALL saved enquiries chronologically into clean #PK-1001, #PK-1002... order
  const normalizeEnquirySerialNumbers = (list: PackersEnquiry[]): PackersEnquiry[] => {
    if (!list || list.length === 0) return [];

    // Sort chronologically ascending by creation date
    const sorted = [...list].sort((a, b) => {
      const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return tA - tB;
    });

    return sorted.map((item, idx) => ({
      ...item,
      id: `PK-${1001 + idx}`,
    }));
  };

  // 1. Initial Load from LocalStorage & Clean Sequential IDs
  useEffect(() => {
    setIsClient(true);
    try {
      let list: PackersEnquiry[] = [];
      const storedV2 = localStorage.getItem(STORAGE_KEY);
      const storedV1 = localStorage.getItem("digitalfx_packers_enquiries");

      if (storedV2 !== null) {
        const parsed = JSON.parse(storedV2);
        if (Array.isArray(parsed)) list = parsed;
      } else if (storedV1 !== null) {
        const parsed = JSON.parse(storedV1);
        if (Array.isArray(parsed)) list = parsed;
      }

      // Re-sequence all saved enquiries so serial numbers are 100% clean and sequential
      const cleanedList = normalizeEnquirySerialNumbers(list);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedList));
      setEnquiries(cleanedList);
    } catch (e) {
      console.error("Failed to load local enquiries:", e);
      setEnquiries([]);
    }
  }, []);

  // 2. Save back to LocalStorage whenever enquiries change
  const saveToStorage = (updated: PackersEnquiry[]) => {
    const normalized = normalizeEnquirySerialNumbers(updated);
    setEnquiries(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (e) {
      console.error("Storage error:", e);
    }
  };

  // Helper to generate Next Enquiry ID sequentially
  const generateEnquiryId = () => {
    return `PK-${1001 + enquiries.length}`;
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      from_location: "",
      to_location: "",
      address: "",
      truck_feet: "14 Feet Closed Container",
      vendor_rate: "",
      customer_rate: "",
      follow_up_date: "",
      remark: "",
      status: "pending",
    });
    setEditingEnquiry(null);
  };

  // Open Add Modal
  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item: PackersEnquiry) => {
    setEditingEnquiry(item);
    setFormData({
      name: item.name,
      phone: item.phone,
      from_location: item.from_location,
      to_location: item.to_location,
      address: item.address,
      truck_feet: item.truck_feet,
      vendor_rate: item.vendor_rate ? String(item.vendor_rate) : "",
      customer_rate: item.customer_rate ? String(item.customer_rate) : "",
      follow_up_date: item.follow_up_date || "",
      remark: item.remark || "",
      status: item.status || "pending",
    });
    setIsAddModalOpen(true);
  };

  // Save (Create or Update)
  const handleSaveEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Please enter customer Name and Phone Number.");
      return;
    }

    const vRate = parseFloat(formData.vendor_rate) || 0;
    const cRate = parseFloat(formData.customer_rate) || 0;

    if (editingEnquiry) {
      // Update existing
      const updated = enquiries.map((item) => {
        if (item.id === editingEnquiry.id) {
          return {
            ...item,
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            from_location: formData.from_location.trim(),
            to_location: formData.to_location.trim(),
            address: formData.address.trim(),
            truck_feet: formData.truck_feet,
            vendor_rate: vRate,
            customer_rate: cRate,
            follow_up_date: formData.follow_up_date,
            remark: formData.remark.trim(),
            status: formData.status,
          };
        }
        return item;
      });
      saveToStorage(updated);
    } else {
      // Create new
      const newEnquiry: PackersEnquiry = {
        id: generateEnquiryId(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        from_location: formData.from_location.trim(),
        to_location: formData.to_location.trim(),
        address: formData.address.trim(),
        truck_feet: formData.truck_feet,
        vendor_rate: vRate,
        customer_rate: cRate,
        follow_up_date: formData.follow_up_date,
        remark: formData.remark.trim(),
        status: formData.status,
        created_at: new Date().toISOString(),
      };
      saveToStorage([newEnquiry, ...enquiries]);
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  // Quick Status Toggle on Row
  const handleStatusChange = (id: string, newStatus: PackersEnquiry["status"]) => {
    const updated = enquiries.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    saveToStorage(updated);
  };

  // Format Display Date
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check Follow Up Urgency
  const getFollowUpStatus = (dateStr: string) => {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    if (isNaN(target.getTime())) return null;

    const now = new Date();
    const isToday =
      target.getDate() === now.getDate() &&
      target.getMonth() === now.getMonth() &&
      target.getFullYear() === now.getFullYear();

    if (isToday) return "today";
    if (target < now) return "overdue";
    return "upcoming";
  };

  // Professional row color coding based on status
  // User Prompt: "pending intrsetsed or cancel kru to colourint ho jana chahiye puri enquiry pr"
  // Clean, high-end corporate tints paired with solid status indicator border
  const getRowColorClasses = (status: PackersEnquiry["status"]) => {
    switch (status) {
      case "pending":
        return "border-l-4 border-l-amber-500 bg-amber-50/35 hover:bg-amber-50/65";
      case "interested":
        return "border-l-4 border-l-emerald-500 bg-emerald-50/35 hover:bg-emerald-50/65";
      case "cancel":
        return "border-l-4 border-l-rose-400 bg-rose-50/30 hover:bg-rose-50/55 text-slate-600";
      case "booked":
        return "border-l-4 border-l-[#207de9] bg-blue-50/35 hover:bg-blue-50/65";
      default:
        return "border-l-4 border-l-slate-200 bg-white hover:bg-slate-50";
    }
  };

  // Filtered Enquiries
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      // 1. Status Filter
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      // 2. Follow-Up Filter
      if (followUpFilter !== "all") {
        const fuStatus = getFollowUpStatus(item.follow_up_date);
        if (followUpFilter === "today" && fuStatus !== "today") return false;
        if (followUpFilter === "overdue" && fuStatus !== "overdue") return false;
        if (followUpFilter === "upcoming" && fuStatus !== "upcoming") return false;
        if (followUpFilter === "none" && item.follow_up_date) return false;
      }

      // 3. Search Term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const inId = (item.id || "").toLowerCase().includes(q);
        const inName = (item.name || "").toLowerCase().includes(q);
        const inPhone = (item.phone || "").toLowerCase().includes(q);
        const inFrom = (item.from_location || "").toLowerCase().includes(q);
        const inTo = (item.to_location || "").toLowerCase().includes(q);
        const inTruck = (item.truck_feet || "").toLowerCase().includes(q);
        const inRemark = (item.remark || "").toLowerCase().includes(q);
        const inAddress = (item.address || "").toLowerCase().includes(q);

        return inId || inName || inPhone || inFrom || inTo || inTruck || inRemark || inAddress;
      }

      return true;
    });
  }, [enquiries, statusFilter, followUpFilter, searchTerm]);

  // Metrics KPI calculations
  const metrics = useMemo(() => {
    const total = enquiries.length;
    const pending = enquiries.filter((e) => e.status === "pending").length;
    const interested = enquiries.filter((e) => e.status === "interested").length;
    const cancel = enquiries.filter((e) => e.status === "cancel").length;
    const booked = enquiries.filter((e) => e.status === "booked").length;

    const totalCustomerVal = enquiries.reduce((sum, e) => sum + (e.customer_rate || 0), 0);
    const totalVendorVal = enquiries.reduce((sum, e) => sum + (e.vendor_rate || 0), 0);
    const expectedProfit = totalCustomerVal - totalVendorVal;

    const followUpToday = enquiries.filter(
      (e) => getFollowUpStatus(e.follow_up_date) === "today"
    ).length;

    return {
      total,
      pending,
      interested,
      cancel,
      booked,
      totalCustomerVal,
      totalVendorVal,
      expectedProfit,
      followUpToday,
    };
  }, [enquiries]);

  // Export to CSV
  const exportCSV = () => {
    const headers = [
      "Enquiry ID",
      "Customer Name",
      "Mobile No",
      "From Location",
      "To Location",
      "Detailed Address",
      "Truck Feet",
      "Vendor Rate (INR)",
      "Customer Rate (INR)",
      "Profit (INR)",
      "Follow-Up Date",
      "Status",
      "Created Date",
      "Remark",
    ];

    const rows = filteredEnquiries.map((e) => [
      e.id,
      `"${(e.name || "").replace(/"/g, '""')}"`,
      `"${e.phone || ""}"`,
      `"${(e.from_location || "").replace(/"/g, '""')}"`,
      `"${(e.to_location || "").replace(/"/g, '""')}"`,
      `"${(e.address || "").replace(/"/g, '""')}"`,
      `"${(e.truck_feet || "").replace(/"/g, '""')}"`,
      e.vendor_rate || 0,
      e.customer_rate || 0,
      (e.customer_rate || 0) - (e.vendor_rate || 0),
      `"${e.follow_up_date || ""}"`,
      `"${e.status.toUpperCase()}"`,
      `"${e.created_at || ""}"`,
      `"${(e.remark || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `digitalfx_packers_enquiries_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON Backup
  const exportJSONBackup = () => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(enquiries, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute(
      "download",
      `digitalfx_packers_backup_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import JSON Backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          if (
            window.confirm(
              `Found ${json.length} enquiry records in file. Load and overwrite current register?`
            )
          ) {
            saveToStorage(json);
            alert("Enquiry register restored successfully!");
          }
        } else {
          alert("Invalid backup file format.");
        }
      } catch {
        alert("Error reading JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Open Quotation / Slip Generator
  const openQuotationSlip = (item: PackersEnquiry) => {
    setQuotationSlipEnquiry(item);
    setCopiedQuote(false);
  };

  // Open WhatsApp Modal
  const openWhatsAppModal = (item: PackersEnquiry) => {
    setWhatsAppModalEnquiry(item);

    const rateText = item.customer_rate && item.customer_rate > 0
      ? `₹${item.customer_rate.toLocaleString("en-IN")}/- (All-Inclusive)`
      : `As Discussed`;

    const defaultMsg =
      `🚚 *OM PACKERS AND MOVERS*\n` +
      `_All India Relocation & Vehicle Transport Services_\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `Dear *${item.name || "Customer"}*,\n\n` +
      `Thank you for contacting *Om Packers and Movers*. Here is your official shifting quotation summary:\n\n` +
      `📍 *Pickup:* ${item.from_location || "As discussed"}\n` +
      `📍 *Drop:* ${item.to_location || "As discussed"}\n` +
      `🚛 *Vehicle / Truck:* ${item.truck_feet}\n` +
      `📦 *Items / Notes:* ${item.remark || "Household Goods / Vehicle Relocation"}\n` +
      `💰 *Net Quoted Rate:* *${rateText}*\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `✨ *Service Highlights:*\n` +
      `✔ Door-to-Door Safe Pickup & Delivery\n` +
      `✔ Scratch-Free Loading & Professional Handling\n` +
      `✔ Verified Driver & GPS Movement Updates\n` +
      `✔ On-Time Delivery Guarantee\n\n` +
      `Would you like us to confirm your booking and assign the vehicle slot?\n\n` +
      `📞 *Helpline / WhatsApp:* +91 9717586641\n` +
      `🌐 *Website:* www.ompackersindia.com\n\n` +
      `_Om Packers and Movers — Delivering Trust Nationwide_`;

    setWhatsAppCustomText(defaultMsg);
  };

  // Send WhatsApp message directly
  const sendWhatsAppDirect = (phone: string, text: string) => {
    const clean = phone.replace(/\D/g, "");
    const targetPhone = clean.startsWith("91") ? clean : clean.length === 10 ? `91${clean}` : clean;
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // Copy Quotation Slip to Clipboard
  const copyQuotationToClipboard = () => {
    if (!quotationSlipEnquiry) return;
    const e = quotationSlipEnquiry;
    const text =
      `====================================\n` +
      `       OM PACKERS AND MOVERS        \n` +
      `        OFFICIAL QUOTATION SLIP     \n` +
      `====================================\n` +
      `Quote ID: #${e.id}\n` +
      `Date: ${new Date().toLocaleDateString("en-IN")}\n\n` +
      `CUSTOMER DETAILS:\n` +
      `• Name: ${e.name}\n` +
      `• Phone: ${e.phone}\n` +
      `• Pickup Address: ${e.address || e.from_location}\n` +
      `• Destination: ${e.to_location}\n\n` +
      `MOVEMENT DETAILS:\n` +
      `• Vehicle / Truck: ${e.truck_feet}\n` +
      `• Description: ${e.remark || "Domestic / Commercial Relocation"}\n\n` +
      `FINANCIAL SUMMARY:\n` +
      `• Transportation & Loading: ₹${(e.customer_rate || 0).toLocaleString("en-IN")}/-\n` +
      `• Net Quoted Amount: ₹${(e.customer_rate || 0).toLocaleString("en-IN")}/-\n` +
      `• Advance Required: ₹${Math.round((e.customer_rate || 0) * 0.2).toLocaleString("en-IN")}/- (20%)\n` +
      `• Balance on Delivery: ₹${(Math.round((e.customer_rate || 0) * 0.8)).toLocaleString("en-IN")}/-\n\n` +
      `TERMS & CONDITIONS:\n` +
      `1. Standard transit insurance applicable upon declared goods value.\n` +
      `2. Toll taxes and state permits included as per quotation.\n` +
      `3. Loading & unloading handled by trained professional handlers.\n` +
      `====================================\n` +
      `Om Packers and Movers | Phone: +91 9717586641 | www.ompackersindia.com\n`;

    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 3000);
  };

  if (!isClient) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#207de9]" />
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Loading Enquiry Desk...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          TOP HEADER & ACTIONS (Clean Enterprise Style)
          ========================================================================= */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#207de9]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#207de9]" />
              Internal Logistics Desk
            </span>
            <span className="text-[11px] font-medium text-slate-400">/</span>
            <span className="text-[11px] font-medium text-slate-500">Packers &amp; Movers</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1.5">
            Packers &amp; Movers Enquiries
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log manual leads, negotiate vendor &amp; client rates, manage follow-up schedules, and generate PDF quotations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-[#207de9] hover:bg-[#1570ef] px-4 py-2 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New Enquiry</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          EXECUTIVE KPI METRICS CARDS
          ========================================================================= */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        
        {/* Total Book */}
        <div
          onClick={() => {
            setStatusFilter("all");
            setFollowUpFilter("all");
          }}
          className={
            "rounded-xl border p-3.5 transition cursor-pointer bg-white " +
            (statusFilter === "all" && followUpFilter === "all"
              ? "border-[#207de9] ring-2 ring-[#207de9]/15 shadow-sm"
              : "border-slate-200/90 hover:border-slate-300 shadow-xs")
          }
        >
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>Total Leads</span>
            <span className="h-2 w-2 rounded-full bg-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {metrics.total}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400">All registered</p>
        </div>

        {/* Pending */}
        <div
          onClick={() => setStatusFilter("pending")}
          className={
            "rounded-xl border p-3.5 transition cursor-pointer bg-white " +
            (statusFilter === "pending"
              ? "border-amber-500 ring-2 ring-amber-400/20 shadow-sm"
              : "border-slate-200/90 hover:border-amber-300 shadow-xs")
          }
        >
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
            <span>Pending</span>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-950 tabular-nums">
            {metrics.pending}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400">Awaiting action</p>
        </div>

        {/* Interested */}
        <div
          onClick={() => setStatusFilter("interested")}
          className={
            "rounded-xl border p-3.5 transition cursor-pointer bg-white " +
            (statusFilter === "interested"
              ? "border-emerald-500 ring-2 ring-emerald-400/20 shadow-sm"
              : "border-slate-200/90 hover:border-emerald-300 shadow-xs")
          }
        >
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
            <span>Interested</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-950 tabular-nums">
            {metrics.interested}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400">In negotiation</p>
        </div>

        {/* Cancel */}
        <div
          onClick={() => setStatusFilter("cancel")}
          className={
            "rounded-xl border p-3.5 transition cursor-pointer bg-white " +
            (statusFilter === "cancel"
              ? "border-rose-400 ring-2 ring-rose-400/20 shadow-sm"
              : "border-slate-200/90 hover:border-rose-300 shadow-xs")
          }
        >
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
            <span>Cancelled</span>
            <span className="h-2 w-2 rounded-full bg-rose-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-950 tabular-nums">
            {metrics.cancel}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400">Lost / dropped</p>
        </div>

        {/* Booked */}
        <div
          onClick={() => setStatusFilter("booked")}
          className={
            "rounded-xl border p-3.5 transition cursor-pointer bg-white " +
            (statusFilter === "booked"
              ? "border-[#207de9] ring-2 ring-blue-400/20 shadow-sm"
              : "border-slate-200/90 hover:border-blue-300 shadow-xs")
          }
        >
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
            <span>Booked</span>
            <span className="h-2 w-2 rounded-full bg-[#207de9]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[#207de9] tabular-nums">
            {metrics.booked}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400">Converted orders</p>
        </div>

        {/* Expected Net Margin */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
            <span>Net Margin</span>
            <span className="text-[10px] font-bold text-emerald-600">EST. PROFIT</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600 tabular-nums">
            ₹{metrics.expectedProfit.toLocaleString("en-IN")}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400 truncate">
            Quoted: ₹{metrics.totalCustomerVal.toLocaleString("en-IN")}
          </p>
        </div>

      </div>

      {/* =========================================================================
          SEARCH & FILTER STRIP
          ========================================================================= */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/90 bg-white p-3 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        
        {/* Search input with SVG */}
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, phone, route, truck, or notes..."
            className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/70 pl-9.5 pr-8 text-xs font-normal text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9] transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Clean Status Pill Filters (No Emojis) */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: "all", label: "All", dot: null, count: metrics.total },
            { key: "pending", label: "Pending", dot: "bg-amber-500", count: metrics.pending },
            { key: "interested", label: "Interested", dot: "bg-emerald-500", count: metrics.interested },
            { key: "cancel", label: "Cancelled", dot: "bg-rose-400", count: metrics.cancel },
            { key: "booked", label: "Booked", dot: "bg-[#207de9]", count: metrics.booked },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer " +
                (statusFilter === tab.key
                  ? "bg-[#207de9] text-white shadow-xs"
                  : "bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900")
              }
            >
              {tab.dot && (
                <span
                  className={
                    "w-1.5 h-1.5 rounded-full " +
                    (statusFilter === tab.key ? "bg-white" : tab.dot)
                  }
                />
              )}
              <span>{tab.label}</span>
              <span
                className={
                  "text-[10px] px-1 rounded " +
                  (statusFilter === tab.key
                    ? "bg-white/25 text-white"
                    : "bg-slate-200/80 text-slate-500")
                }
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Follow-up filter dropdown */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-2 lg:border-t-0 lg:pt-0">
          <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
            Follow-up:
          </span>
          <select
            value={followUpFilter}
            onChange={(e) => setFollowUpFilter(e.target.value)}
            className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-[#207de9] cursor-pointer"
          >
            <option value="all">All Schedules</option>
            <option value="today">Scheduled Today ({metrics.followUpToday})</option>
            <option value="overdue">Overdue</option>
            <option value="upcoming">Upcoming</option>
            <option value="none">No Follow-up</option>
          </select>
        </div>

      </div>

      {/* =========================================================================
          MAIN CRM TABLE
          ========================================================================= */}
      <div className="rounded-xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">ID &amp; Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Route &amp; Destination</th>
                <th className="py-3 px-4">Vehicle / Truck</th>
                <th className="py-3 px-4">Pricing &amp; Margin</th>
                <th className="py-3 px-4">Follow-Up</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-500">
                    <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                    </div>
                    <p className="font-semibold text-slate-800 text-sm">
                      {searchTerm || statusFilter !== "all" || followUpFilter !== "all"
                        ? "No matching enquiries found"
                        : "No enquiries recorded yet"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      {searchTerm || statusFilter !== "all" || followUpFilter !== "all"
                        ? "Try clearing your search query or reset filter selections."
                        : "Your enquiry desk is clear. Click 'New Enquiry' above to log your first client shipment."}
                    </p>
                    {!searchTerm && statusFilter === "all" && followUpFilter === "all" && (
                      <button
                        onClick={openAddModal}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#207de9] hover:bg-[#1570ef] px-4 py-2 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Add First Enquiry</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((item) => {
                  const fuStatus = getFollowUpStatus(item.follow_up_date);
                  const profit = (item.customer_rate || 0) - (item.vendor_rate || 0);
                  const rowStyle = getRowColorClasses(item.status);

                  return (
                    <tr
                      key={item.id}
                      className={"transition group " + rowStyle}
                    >
                      {/* ID & Date */}
                      <td className="py-3 px-4 align-top">
                        <span className="font-mono text-xs font-bold text-slate-900 block">
                          #{item.id}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5 whitespace-nowrap">
                          {formatDisplayDate(item.created_at)}
                        </span>
                      </td>

                      {/* Customer & Phone */}
                      <td className="py-3 px-4 align-top min-w-[170px]">
                        <span className="font-semibold text-xs text-slate-900 block leading-tight">
                          {item.name}
                        </span>
                        <div className="mt-1.5 flex items-center gap-2">
                          <a
                            href={`tel:${item.phone}`}
                            className="inline-flex items-center gap-1 text-slate-600 hover:text-[#207de9] font-mono text-[11px] font-medium"
                            title="Call customer"
                          >
                            <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            <span>{item.phone}</span>
                          </a>

                          <button
                            onClick={() => openWhatsAppModal(item)}
                            className="inline-flex items-center justify-center h-5 w-5 rounded bg-emerald-500 hover:bg-emerald-600 text-white transition cursor-pointer"
                            title="Generate WhatsApp estimate"
                          >
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                            </svg>
                          </button>
                        </div>
                      </td>

                      {/* Route & Address */}
                      <td className="py-3 px-4 align-top min-w-[220px]">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800 text-xs">
                          <span className="text-emerald-700">{item.from_location || "—"}</span>
                          <span className="text-slate-300">→</span>
                          <span className="text-blue-700">{item.to_location || "—"}</span>
                        </div>
                        {item.address && (
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 leading-normal" title={item.address}>
                            {item.address}
                          </p>
                        )}
                        {item.remark && (
                          <div className="mt-1 text-[11px] text-slate-500 line-clamp-1">
                            <span className="font-semibold text-slate-400">Note:</span> {item.remark}
                          </div>
                        )}
                      </td>

                      {/* Truck Feet */}
                      <td className="py-3 px-4 align-top min-w-[130px]">
                        <span className="inline-block font-medium text-[11px] text-slate-700 bg-white border border-slate-200/90 rounded-md px-2 py-0.5 shadow-2xs">
                          {item.truck_feet || "14 Ft Closed"}
                        </span>
                      </td>

                      {/* Rates & Profit */}
                      <td className="py-3 px-4 align-top min-w-[140px]">
                        <div className="text-[11px] space-y-0.5">
                          <div className="flex items-center justify-between text-slate-500">
                            <span>Cost:</span>
                            <span className="font-mono font-medium text-slate-700">
                              ₹{(item.vendor_rate || 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-slate-500">
                            <span>Quote:</span>
                            <span className="font-mono font-semibold text-[#207de9]">
                              ₹{(item.customer_rate || 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between border-t border-slate-200/60 pt-0.5 font-medium">
                            <span className="text-slate-400">Margin:</span>
                            <span
                              className={
                                "font-mono font-bold " +
                                (profit >= 0 ? "text-emerald-600" : "text-rose-600")
                              }
                            >
                              {profit >= 0 ? "+" : ""}₹{profit.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Follow-up */}
                      <td className="py-3 px-4 align-top min-w-[130px]">
                        {item.follow_up_date ? (
                          <div>
                            <div className="font-mono text-[11px] text-slate-700 font-medium whitespace-nowrap">
                              {formatDisplayDate(item.follow_up_date)}
                            </div>
                            {fuStatus === "today" && (
                              <span className="mt-1 inline-flex items-center gap-1 rounded bg-amber-100 text-amber-900 font-bold text-[9px] px-1.5 py-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                                Today
                              </span>
                            )}
                            {fuStatus === "overdue" && (
                              <span className="mt-1 inline-flex items-center gap-1 rounded bg-rose-100 text-rose-800 font-bold text-[9px] px-1.5 py-0.5">
                                Overdue
                              </span>
                            )}
                            {fuStatus === "upcoming" && (
                              <span className="mt-1 inline-flex items-center gap-1 rounded bg-slate-100 text-slate-700 font-medium text-[9px] px-1.5 py-0.5">
                                Upcoming
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Single Clean Status Selector (No emojis, no duplicate badges!) */}
                      <td className="py-3 px-4 align-top min-w-[125px]">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(
                              item.id,
                              e.target.value as PackersEnquiry["status"]
                            )
                          }
                          className={
                            "h-7 rounded-md border text-xs font-semibold px-2 outline-none cursor-pointer transition shadow-2xs " +
                            (item.status === "pending"
                              ? "bg-amber-100/90 text-amber-900 border-amber-300"
                              : item.status === "interested"
                              ? "bg-emerald-100/90 text-emerald-900 border-emerald-300"
                              : item.status === "cancel"
                              ? "bg-rose-100/90 text-rose-800 border-rose-300"
                              : "bg-blue-100/90 text-blue-900 border-blue-300")
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="interested">Interested</option>
                          <option value="cancel">Cancelled</option>
                          <option value="booked">Booked</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 align-top text-right min-w-[110px]">
                        <div className="flex items-center justify-end gap-1">
                          {/* Slip Generator button */}
                          <button
                            onClick={() => openQuotationSlip(item)}
                            className="inline-flex items-center gap-1 h-7 rounded border border-slate-200 bg-white hover:bg-slate-50 px-2 text-[11px] font-medium text-slate-700 shadow-2xs transition cursor-pointer"
                            title="Generate Print/PDF Quote Slip"
                          >
                            <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                              <line x1="16" y1="13" x2="8" y2="13" />
                              <line x1="16" y1="17" x2="8" y2="17" />
                              <polyline points="10 9 9 9 8 9" />
                            </svg>
                            <span>Slip</span>
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => openEditModal(item)}
                            className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition cursor-pointer"
                            title="Edit enquiry"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          ADD / EDIT MODAL
          ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl border border-slate-200 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#207de9]">
                  {editingEnquiry ? "Update Record" : "New Lead"}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {editingEnquiry
                    ? `Edit Enquiry #${editingEnquiry.id}`
                    : "Add Packers & Movers Enquiry"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEnquiry} className="mt-4 space-y-4">
              
              {/* Customer Name & Phone */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9717586641"
                    className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
                  />
                </div>
              </div>

              {/* From & To Route */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    From Location (Pickup)
                  </label>
                  <input
                    type="text"
                    value={formData.from_location}
                    onChange={(e) => setFormData({ ...formData, from_location: e.target.value })}
                    placeholder="e.g. Ghaziabad / Sector 62 Noida"
                    className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    To Location (Destination)
                  </label>
                  <input
                    type="text"
                    value={formData.to_location}
                    onChange={(e) => setFormData({ ...formData, to_location: e.target.value })}
                    placeholder="e.g. Bengaluru / Pune / Mumbai"
                    className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
                  />
                </div>
              </div>

              {/* Detailed Address */}
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Detailed Address (House / Floor / Street)
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Flat 301, Tower B, Sector 14, Ghaziabad"
                  className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
                />
              </div>

              {/* Truck Feet & Status */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Truck Size / Feet
                  </label>
                  <select
                    value={formData.truck_feet}
                    onChange={(e) => setFormData({ ...formData, truck_feet: e.target.value })}
                    className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#207de9]"
                  >
                    {TRUCK_PRESETS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as PackersEnquiry["status"],
                      })
                    }
                    className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-[#207de9]"
                  >
                    <option value="pending">Pending</option>
                    <option value="interested">Interested</option>
                    <option value="cancel">Cancelled</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>
              </div>

              {/* Rate & Profit Summary */}
              <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">
                    Rates &amp; Profit Calculator (₹)
                  </span>
                  {formData.customer_rate && formData.vendor_rate && (
                    <span className="text-xs font-bold text-emerald-600">
                      Margin: ₹
                      {(
                        (parseFloat(formData.customer_rate) || 0) -
                        (parseFloat(formData.vendor_rate) || 0)
                      ).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">
                      Vendor Rate (₹ Cost)
                    </label>
                    <input
                      type="number"
                      value={formData.vendor_rate}
                      onChange={(e) => setFormData({ ...formData, vendor_rate: e.target.value })}
                      placeholder="e.g. 25000"
                      className="mt-1 h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs font-mono font-medium text-slate-800 outline-none focus:border-[#207de9]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-500">
                      Customer Quoted Rate (₹ Selling)
                    </label>
                    <input
                      type="number"
                      value={formData.customer_rate}
                      onChange={(e) => setFormData({ ...formData, customer_rate: e.target.value })}
                      placeholder="e.g. 35000"
                      className="mt-1 h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs font-mono font-bold text-[#207de9] outline-none focus:border-[#207de9]"
                    />
                  </div>
                </div>
              </div>

              {/* Follow-up Date */}
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Follow-up Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.follow_up_date}
                  onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                  className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#207de9]"
                />
              </div>

              {/* Remark */}
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Remark / Goods Details
                </label>
                <textarea
                  rows={2}
                  value={formData.remark}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  placeholder="e.g. 2BHK shifting, 1 Double Bed, Fridge, fragile packaging required..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#207de9]"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#207de9] hover:bg-[#1570ef] px-4 py-2 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
                >
                  {editingEnquiry ? "Save Changes" : "Create Enquiry"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          PRINTABLE QUOTATION SLIP MODAL
          ========================================================================= */}
      {quotationSlipEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl border border-slate-200 my-8">
            
            {/* Modal Actions Bar (hidden when printed) */}
            <div className="print:hidden flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Quotation Slip
                </span>
                <span className="font-mono text-xs text-slate-400">#{quotationSlipEnquiry.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyQuotationToClipboard}
                  className="rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition cursor-pointer"
                >
                  {copiedQuote ? "✓ Copied" : "Copy Text"}
                </button>
                <button
                  onClick={() => window.print()}
                  className="rounded-lg bg-[#207de9] hover:bg-[#1570ef] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
                >
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setQuotationSlipEnquiry(null)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div
              ref={printRef}
              className="rounded-xl border border-slate-200 p-6 bg-white text-slate-900 text-xs space-y-4 shadow-xs"
            >
              {/* Slip Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-600 text-white font-black text-xs shadow-xs">
                    OM
                  </div>
                  <div>
                    <div className="text-base font-black tracking-tight text-slate-900">
                      OM PACKERS AND MOVERS
                    </div>
                    <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                      Phone: +91 9717586641 • www.ompackersindia.com
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-mono font-bold text-[#207de9]">
                    QUOTE #{quotationSlipEnquiry.id}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Date: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Customer & Route Box */}
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-3.5 border border-slate-200/80">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Customer Information
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    {quotationSlipEnquiry.name}
                  </p>
                  <p className="font-mono text-xs text-slate-600 mt-0.5">
                    Phone: {quotationSlipEnquiry.phone}
                  </p>
                  {quotationSlipEnquiry.address && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      {quotationSlipEnquiry.address}
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Shifting Movement
                  </span>
                  <div className="mt-1 space-y-1">
                    <p className="text-xs font-semibold text-emerald-800">
                      From: <span className="font-normal text-slate-700">{quotationSlipEnquiry.from_location || "—"}</span>
                    </p>
                    <p className="text-xs font-semibold text-blue-800">
                      To: <span className="font-normal text-slate-700">{quotationSlipEnquiry.to_location || "—"}</span>
                    </p>
                    <p className="text-xs font-semibold text-slate-600">
                      Vehicle: <span className="font-normal text-slate-700">{quotationSlipEnquiry.truck_feet}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Remarks / Goods Description */}
              {quotationSlipEnquiry.remark && (
                <div className="rounded-lg border border-slate-200 p-3 bg-white">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Goods / Consignment Notes
                  </span>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    {quotationSlipEnquiry.remark}
                  </p>
                </div>
              )}

              {/* Financial Quotation Summary */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    <tr>
                      <td className="py-2.5 px-3 text-slate-700">
                        Freight &amp; Transportation ({quotationSlipEnquiry.truck_feet})
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-900">
                        ₹{(quotationSlipEnquiry.customer_rate || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">
                        Professional Packing &amp; Loading Support
                      </td>
                      <td className="py-2 px-3 text-right text-slate-500 font-mono">
                        Included
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">
                        Transit Tolls &amp; Border Permits
                      </td>
                      <td className="py-2 px-3 text-right text-slate-500 font-mono">
                        Included
                      </td>
                    </tr>
                    <tr className="bg-emerald-50/60 font-bold text-emerald-950 border-t border-emerald-200">
                      <td className="py-2.5 px-3 text-xs uppercase tracking-wider">
                        Net Final Quoted Amount
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm">
                        ₹{(quotationSlipEnquiry.customer_rate || 0).toLocaleString("en-IN")}/-
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment Terms */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="text-[9px] font-semibold text-slate-400 uppercase">
                    20% Booking Advance
                  </span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">
                    ₹{Math.round((quotationSlipEnquiry.customer_rate || 0) * 0.2).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="text-[9px] font-semibold text-slate-400 uppercase">
                    80% Balance on Delivery
                  </span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">
                    ₹{Math.round((quotationSlipEnquiry.customer_rate || 0) * 0.8).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Terms & Signatures */}
              <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-400 space-y-0.5">
                <p>1. Transit insurance available upon declared inventory value.</p>
                <p>2. Vehicle booking confirmed upon advance transfer.</p>
                <p>3. Om Packers and Movers guarantees verified trucks with GPS movement updates.</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] text-slate-500 font-medium">
                <span>Authorized Signatory: ________________</span>
                <span>Customer Acceptance: ________________</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          WHATSAPP MESSAGE GENERATOR MODAL
          ========================================================================= */}
      {whatsAppModalEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  WhatsApp Estimate Generator
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Send directly to {whatsAppModalEnquiry.name} ({whatsAppModalEnquiry.phone})
                </p>
              </div>
              <button
                onClick={() => setWhatsAppModalEnquiry(null)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Message Preview (Editable):
              </label>
              <textarea
                rows={9}
                value={whatsAppCustomText}
                onChange={(e) => setWhatsAppCustomText(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setWhatsAppModalEnquiry(null)}
                className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sendWhatsAppDirect(whatsAppModalEnquiry.phone, whatsAppCustomText);
                  setWhatsAppModalEnquiry(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
              >
                <span>Send WhatsApp Message</span>
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
