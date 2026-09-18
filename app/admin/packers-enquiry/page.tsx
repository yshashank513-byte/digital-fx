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

const INITIAL_DEMO_DATA: PackersEnquiry[] = [
  {
    id: "PK-1001",
    name: "Rajesh Sharma",
    phone: "9876543210",
    from_location: "Ghaziabad (Raj Nagar)",
    to_location: "Bengaluru (Whitefield)",
    address: "Flat 402, Royal Palms, Sector 14, Ghaziabad",
    truck_feet: "19 Feet Container",
    vendor_rate: 32000,
    customer_rate: 45000,
    follow_up_date: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    remark: "3BHK Household furniture, 1 Double Bed, Fridge, Washing Machine + TV",
    status: "interested",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "PK-1002",
    name: "Vikram Malhotra",
    phone: "9811223344",
    from_location: "Noida Sector 62",
    to_location: "Pune (Hinjewadi)",
    address: "Tower 3, Floor 8, Cyber City Park, Sector 62 Noida",
    truck_feet: "14 Feet Closed Container",
    vendor_rate: 22000,
    customer_rate: 30000,
    follow_up_date: new Date().toISOString().slice(0, 16),
    remark: "2BHK shifting, fragile crockery, needs 3 layers bubble wrapping",
    status: "pending",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "PK-1003",
    name: "Amit Patel",
    phone: "9900112233",
    from_location: "Delhi (Dwarka)",
    to_location: "Ahmedabad (SG Highway)",
    address: "Pocket 2, Dwarka Sector 11, New Delhi",
    truck_feet: "17 Feet Container",
    vendor_rate: 26000,
    customer_rate: 35000,
    follow_up_date: new Date(Date.now() - 86400000).toISOString().slice(0, 16),
    remark: "Client said rates are high from other vendors, re-negotiate on evening call",
    status: "pending",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: "PK-1004",
    name: "Sunil Verma",
    phone: "9712345678",
    from_location: "Gurugram (Golf Course Road)",
    to_location: "Mumbai (Andheri East)",
    address: "A-501, The Magnolias, DLF Phase 5, Gurugram",
    truck_feet: "32 Feet Single Axle (SXL)",
    vendor_rate: 55000,
    customer_rate: 72000,
    follow_up_date: "",
    remark: "Booked! Advance ₹15,000 received. Loading scheduled for 25th morning.",
    status: "booked",
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: "PK-1005",
    name: "Pooja Hegde",
    phone: "9845012345",
    from_location: "Faridabad",
    to_location: "Hyderabad",
    address: "Sector 15, Near Crown Plaza, Faridabad",
    truck_feet: "14 Feet Closed Container",
    vendor_rate: 24000,
    customer_rate: 32000,
    follow_up_date: "",
    remark: "Customer postponed shifting to next month due to transfer hold",
    status: "cancel",
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
];

const STORAGE_KEY = "digitalfx_packers_enquiries_v1";

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

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    setIsClient(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEnquiries(parsed);
          return;
        }
      }
      // Seed with initial realistic data if empty
      setEnquiries(INITIAL_DEMO_DATA);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_DATA));
    } catch (e) {
      console.error("Failed to load local enquiries:", e);
      setEnquiries(INITIAL_DEMO_DATA);
    }
  }, []);

  // 2. Save back to LocalStorage whenever enquiries change
  const saveToStorage = (updated: PackersEnquiry[]) => {
    setEnquiries(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Storage error:", e);
    }
  };

  // Helper to generate Next Enquiry ID
  const generateEnquiryId = () => {
    const existingNums = enquiries
      .map((e) => {
        const m = e.id.match(/\d+/);
        return m ? parseInt(m[0], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const max = existingNums.length > 0 ? Math.max(...existingNums) : 1000;
    return `PK-${max + 1}`;
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
      alert("Please enter at least customer Name and Phone Number.");
      return;
    }

    const vRate = parseFloat(formData.vendor_rate) || 0;
    const cRate = parseFloat(formData.customer_rate) || 0;

    if (editingEnquiry) {
      // Update
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

  // Delete Enquiry
  const handleDeleteEnquiry = (id: string, name: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete enquiry #${id} for "${name}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    const updated = enquiries.filter((item) => item.id !== id);
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

  // Get Row Color Styles according to Status
  // User Prompt: "pending intrsetsed or cancel kru to colourint ho jana chahiye puri enquiry pr"
  const getRowColorClasses = (status: PackersEnquiry["status"]) => {
    switch (status) {
      case "pending":
        // Light warm yellow/amber tint on entire enquiry row
        return "bg-amber-50/85 hover:bg-amber-100/80 border-amber-300/90 text-amber-950";
      case "interested":
        // Light fresh emerald/green tint on entire enquiry row
        return "bg-emerald-50/85 hover:bg-emerald-100/80 border-emerald-300/90 text-emerald-950";
      case "cancel":
        // Light soft rose/red tint on entire enquiry row
        return "bg-rose-50/80 hover:bg-rose-100/80 border-rose-300/90 text-rose-950 opacity-90";
      case "booked":
        // Light soft royal blue tint on entire enquiry row
        return "bg-blue-50/85 hover:bg-blue-100/80 border-blue-300/90 text-blue-950";
      default:
        return "bg-white hover:bg-slate-50 border-slate-200 text-slate-900";
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status: PackersEnquiry["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-amber-200/80 text-amber-900 border border-amber-400/60 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
            Pending
          </span>
        );
      case "interested":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-emerald-200/80 text-emerald-900 border border-emerald-400/60 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Interested
          </span>
        );
      case "cancel":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-rose-200/80 text-rose-900 border border-rose-400/60 shadow-2xs">
            ✕ Cancelled
          </span>
        );
      case "booked":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-blue-200/80 text-blue-900 border border-blue-400/60 shadow-2xs">
            🚚 Booked
          </span>
        );
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
              `Found ${json.length} enquiry records. Do you want to load and merge them into your book?`
            )
          ) {
            saveToStorage(json);
            alert("Backup imported successfully!");
          }
        } else {
          alert("Invalid backup JSON format.");
        }
      } catch (err) {
        alert("Error parsing backup JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // Reset
  };

  // Open Quotation / Slip Generator
  const openQuotationSlip = (item: PackersEnquiry) => {
    setQuotationSlipEnquiry(item);
    setCopiedQuote(false);
  };

  // Open WhatsApp Modal
  const openWhatsAppModal = (item: PackersEnquiry) => {
    setWhatsAppModalEnquiry(item);
    const cleanPhone = (item.phone || "").replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("91")
      ? cleanPhone
      : cleanPhone.length === 10
      ? `91${cleanPhone}`
      : cleanPhone;

    const defaultMsg = `*DIGITAL FX PACKERS & MOVERS ESTIMATE*\n\n` +
      `नमस्ते ${item.name} जी,\n` +
      `Digital FX Logistics की तरफ से आपकी शिफ्टिंग का कोटेशन:\n\n` +
      `📍 *Pickup:* ${item.from_location || "—"}\n` +
      `🏁 *Drop:* ${item.to_location || "—"}\n` +
      `🚚 *Vehicle / Truck:* ${item.truck_feet}\n` +
      `💰 *Quotation Amount:* ₹${(item.customer_rate || 0).toLocaleString("en-IN")}/- (All Inclusive)\n` +
      `📦 *Items:* ${item.remark || "Household Goods"}\n\n` +
      `क्या हम आपकी गाड़ी और लोडिंग टीम बुक करें? अगर कोई सवाल हो तो कृपया बताएं।\n\n` +
      `*Digital FX Logistics & Movers*\n` +
      `📞 24/7 Helpline: +91 98765 43210 | www.digitalfx.in`;

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
      `      DIGITAL FX PACKERS & MOVERS   \n` +
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
      `• Description: ${e.remark || "Domestic Shifting"}\n\n` +
      `FINANCIAL SUMMARY:\n` +
      `• Transportation & Loading: ₹${(e.customer_rate || 0).toLocaleString("en-IN")}/-\n` +
      `• Net Quoted Amount: ₹${(e.customer_rate || 0).toLocaleString("en-IN")}/-\n` +
      `• Advance Required: ₹${Math.round((e.customer_rate || 0) * 0.2).toLocaleString("en-IN")}/- (20%)\n` +
      `• Balance on Delivery: ₹${(Math.round((e.customer_rate || 0) * 0.8)).toLocaleString("en-IN")}/-\n\n` +
      `TERMS & CONDITIONS:\n` +
      `1. Standard transit insurance applicable.\n` +
      `2. Toll taxes and state permits included as per agreement.\n` +
      `3. Loading & unloading by trained professional staff.\n` +
      `====================================\n` +
      `Digital FX Logistics | Support: www.digitalfx.in\n`;

    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 3000);
  };

  // Trigger Print
  const handlePrintSlip = () => {
    window.print();
  };

  if (!isClient) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-[#207de9]" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Loading Packers CRM...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          TOP HEADER & ACTION BAR
          ========================================================================= */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-sm">
              🚚
            </span>
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#207de9]">
              Internal Logistics &amp; Transport CRM
            </span>
            <span className="rounded-full bg-slate-200/80 px-2.5 py-0.5 text-[9.5px] font-extrabold text-slate-700">
              Offline Manual Book
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#080d24] mt-1 tracking-tight">
            Packers &amp; Movers Enquiries
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Complete manual enquiry log, vendor rate comparison, follow-up scheduler, and instant quotation generator.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-xl bg-[#207de9] hover:bg-[#1570ef] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#207de9]/20 transition cursor-pointer"
          >
            <span className="text-sm font-black">+</span>
            <span>Add New Enquiry</span>
          </button>

          <button
            onClick={exportCSV}
            disabled={filteredEnquiries.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition disabled:opacity-40 cursor-pointer"
            title="Export filtered records as CSV"
          >
            <span>📥 Export CSV</span>
          </button>

          <button
            onClick={exportJSONBackup}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition cursor-pointer"
            title="Download full backup file"
          >
            <span>💾 Backup</span>
          </button>

          <label className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition cursor-pointer">
            <span>📂 Restore</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* =========================================================================
          KPI STATS CARDS (Matching Dashboard Style)
          ========================================================================= */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        
        {/* Total */}
        <div
          onClick={() => {
            setStatusFilter("all");
            setFollowUpFilter("all");
          }}
          className={
            "rounded-2xl border p-4 shadow-xs transition cursor-pointer " +
            (statusFilter === "all" && followUpFilter === "all"
              ? "bg-white border-[#207de9] ring-2 ring-[#207de9]/15"
              : "bg-white border-slate-200/90 hover:border-slate-300")
          }
        >
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            <span>Total Leads</span>
            <span className="text-slate-600">📋</span>
          </div>
          <p className="mt-2 text-2xl font-black text-[#080d24] tabular-nums">
            {metrics.total}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500 font-medium">All enquiries</p>
        </div>

        {/* Pending (Amber) */}
        <div
          onClick={() => setStatusFilter("pending")}
          className={
            "rounded-2xl border p-4 shadow-xs transition cursor-pointer " +
            (statusFilter === "pending"
              ? "bg-amber-100/90 border-amber-500 ring-2 ring-amber-400/30"
              : "bg-amber-50/70 border-amber-200/80 hover:bg-amber-100/60")
          }
        >
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
            <span>Pending</span>
            <span className="text-amber-600">⏳</span>
          </div>
          <p className="mt-2 text-2xl font-black text-amber-900 tabular-nums">
            {metrics.pending}
          </p>
          <p className="mt-0.5 text-[10px] text-amber-700/80 font-medium">Awaiting update</p>
        </div>

        {/* Interested (Green) */}
        <div
          onClick={() => setStatusFilter("interested")}
          className={
            "rounded-2xl border p-4 shadow-xs transition cursor-pointer " +
            (statusFilter === "interested"
              ? "bg-emerald-100/90 border-emerald-500 ring-2 ring-emerald-400/30"
              : "bg-emerald-50/70 border-emerald-200/80 hover:bg-emerald-100/60")
          }
        >
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
            <span>Interested</span>
            <span className="text-emerald-600">🎯</span>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-900 tabular-nums">
            {metrics.interested}
          </p>
          <p className="mt-0.5 text-[10px] text-emerald-700/80 font-medium">Hot discussions</p>
        </div>

        {/* Cancel (Red) */}
        <div
          onClick={() => setStatusFilter("cancel")}
          className={
            "rounded-2xl border p-4 shadow-xs transition cursor-pointer " +
            (statusFilter === "cancel"
              ? "bg-rose-100/90 border-rose-500 ring-2 ring-rose-400/30"
              : "bg-rose-50/70 border-rose-200/80 hover:bg-rose-100/60")
          }
        >
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-rose-800">
            <span>Cancelled</span>
            <span className="text-rose-600">✕</span>
          </div>
          <p className="mt-2 text-2xl font-black text-rose-900 tabular-nums">
            {metrics.cancel}
          </p>
          <p className="mt-0.5 text-[10px] text-rose-700/80 font-medium">Lost / Postponed</p>
        </div>

        {/* Booked (Blue) */}
        <div
          onClick={() => setStatusFilter("booked")}
          className={
            "rounded-2xl border p-4 shadow-xs transition cursor-pointer " +
            (statusFilter === "booked"
              ? "bg-blue-100/90 border-[#207de9] ring-2 ring-blue-400/30"
              : "bg-blue-50/70 border-blue-200/80 hover:bg-blue-100/60")
          }
        >
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-blue-800">
            <span>Booked</span>
            <span className="text-blue-600">🚚</span>
          </div>
          <p className="mt-2 text-2xl font-black text-[#207de9] tabular-nums">
            {metrics.booked}
          </p>
          <p className="mt-0.5 text-[10px] text-blue-700/80 font-medium">Deal converted</p>
        </div>

        {/* Expected Net Profit */}
        <div className="rounded-2xl border border-emerald-300/80 bg-gradient-to-br from-emerald-50 to-teal-50/40 p-4 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
            <span>Net Margin</span>
            <span className="text-emerald-700 font-black">₹</span>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-700 tabular-nums">
            ₹{metrics.expectedProfit.toLocaleString("en-IN")}
          </p>
          <p className="mt-0.5 text-[10px] text-emerald-700/80 font-medium">
            Cust: ₹{metrics.totalCustomerVal.toLocaleString("en-IN")}
          </p>
        </div>

      </div>

      {/* =========================================================================
          FILTERS & SEARCH BAR
          ========================================================================= */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, phone, from, to, truck, remarks..."
            className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-8 text-xs font-medium text-[#080d24] placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#207de9] transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 mr-1">
            Status:
          </span>
          {[
            { key: "all", label: "All" },
            { key: "pending", label: "Pending (🟡)" },
            { key: "interested", label: "Interested (🟢)" },
            { key: "cancel", label: "Cancel (🔴)" },
            { key: "booked", label: "Booked (🔵)" },
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => setStatusFilter(st.key)}
              className={
                "px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer " +
                (statusFilter === st.key
                  ? "bg-[#207de9] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-[#080d24]")
              }
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Follow up quick filter */}
        <div className="flex items-center gap-1.5 border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 mr-1">
            Follow-Up:
          </span>
          <select
            value={followUpFilter}
            onChange={(e) => setFollowUpFilter(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#207de9] cursor-pointer"
          >
            <option value="all">All Dates</option>
            <option value="today">🔔 Today Only ({metrics.followUpToday})</option>
            <option value="overdue">⚠️ Overdue</option>
            <option value="upcoming">📅 Upcoming</option>
            <option value="none">None Set</option>
          </select>
        </div>

      </div>

      {/* =========================================================================
          MAIN TABLE: WITH FULL ROW COLOR CODING
          ========================================================================= */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-200 bg-slate-100/80 text-[10.5px] uppercase tracking-wider text-slate-600 font-black">
              <tr>
                <th className="py-3.5 px-4">ID &amp; Date</th>
                <th className="py-3.5 px-4">Customer &amp; Contact</th>
                <th className="py-3.5 px-4">Route &amp; Address</th>
                <th className="py-3.5 px-4">Truck / Feet</th>
                <th className="py-3.5 px-4">Rates &amp; Profit</th>
                <th className="py-3.5 px-4">Follow-Up</th>
                <th className="py-3.5 px-4">Status &amp; Color</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 font-medium">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <div className="text-3xl mb-2">🚚</div>
                    <p className="font-bold text-slate-600 text-sm">No enquiries found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchTerm || statusFilter !== "all" || followUpFilter !== "all"
                        ? "Try clearing your filters or search terms."
                        : "Click '+ Add New Enquiry' above to log your first Packers lead."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((item) => {
                  const fuStatus = getFollowUpStatus(item.follow_up_date);
                  const profit = (item.customer_rate || 0) - (item.vendor_rate || 0);
                  const colorClass = getRowColorClasses(item.status);

                  return (
                    <tr
                      key={item.id}
                      className={
                        "transition border-b border-slate-200/80 group " + colorClass
                      }
                    >
                      {/* ID & Creation */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-mono text-xs font-black text-slate-900 block">
                          #{item.id}
                        </span>
                        <span className="text-[10.5px] text-slate-500 block mt-0.5">
                          {formatDisplayDate(item.created_at)}
                        </span>
                      </td>

                      {/* Customer & Mobile */}
                      <td className="py-3.5 px-4 align-top min-w-[170px]">
                        <span className="font-bold text-sm text-slate-900 block leading-tight">
                          {item.name}
                        </span>
                        <div className="mt-1.5 flex items-center gap-2">
                          <a
                            href={`tel:${item.phone}`}
                            className="inline-flex items-center gap-1 text-slate-700 hover:text-[#207de9] font-mono text-xs font-bold"
                            title="Call directly"
                          >
                            <span>📞</span>
                            <span>{item.phone}</span>
                          </a>

                          <button
                            onClick={() => openWhatsAppModal(item)}
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xs transition cursor-pointer"
                            title="Open WhatsApp Generator"
                          >
                            <span className="text-[11px] font-bold">💬</span>
                          </button>
                        </div>
                      </td>

                      {/* Route & Address */}
                      <td className="py-3.5 px-4 align-top min-w-[210px]">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                          <span className="text-emerald-700">📍 {item.from_location || "—"}</span>
                          <span className="text-slate-400">➔</span>
                          <span className="text-blue-700">🏁 {item.to_location || "—"}</span>
                        </div>
                        {item.address && (
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {item.address}
                          </p>
                        )}
                        {item.remark && (
                          <div className="mt-1.5 rounded-md bg-white/70 border border-slate-200/80 px-2 py-1 text-[10.5px] text-slate-700">
                            <span className="font-bold text-slate-500">Remark:</span> {item.remark}
                          </div>
                        )}
                      </td>

                      {/* Truck Feet */}
                      <td className="py-3.5 px-4 align-top min-w-[140px]">
                        <span className="inline-block font-extrabold text-xs text-slate-800 bg-white/80 border border-slate-200/90 rounded-lg px-2.5 py-1 shadow-2xs">
                          {item.truck_feet || "14 Feet Closed"}
                        </span>
                      </td>

                      {/* Rates & Profit */}
                      <td className="py-3.5 px-4 align-top min-w-[150px]">
                        <div className="text-[11.5px] text-slate-700 font-semibold space-y-0.5">
                          <div>
                            <span className="text-slate-500">Vendor: </span>
                            <span className="font-bold font-mono">
                              ₹{(item.vendor_rate || 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Cust: </span>
                            <span className="font-black text-[#207de9] font-mono">
                              ₹{(item.customer_rate || 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="border-t border-slate-200/60 pt-0.5 mt-1">
                            <span className="text-slate-500">Margin: </span>
                            <span
                              className={
                                "font-black font-mono " +
                                (profit >= 0 ? "text-emerald-700" : "text-rose-700")
                              }
                            >
                              {profit >= 0 ? "+" : ""}₹{profit.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Follow-up */}
                      <td className="py-3.5 px-4 align-top min-w-[140px]">
                        {item.follow_up_date ? (
                          <div>
                            <div className="font-mono text-[11px] font-bold text-slate-800">
                              {formatDisplayDate(item.follow_up_date)}
                            </div>
                            {fuStatus === "today" && (
                              <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-amber-500 text-white font-extrabold text-[9px] px-2 py-0.5 animate-pulse">
                                🔔 TODAY
                              </span>
                            )}
                            {fuStatus === "overdue" && (
                              <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-rose-600 text-white font-extrabold text-[9px] px-2 py-0.5">
                                ⚠️ OVERDUE
                              </span>
                            )}
                            {fuStatus === "upcoming" && (
                              <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-blue-100 text-blue-800 border border-blue-200 font-extrabold text-[9px] px-2 py-0.5">
                                📅 UPCOMING
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Not scheduled</span>
                        )}
                      </td>

                      {/* Status Dropdown (User changes this, entire row changes color!) */}
                      <td className="py-3.5 px-4 align-top min-w-[130px]">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(
                              item.id,
                              e.target.value as PackersEnquiry["status"]
                            )
                          }
                          className="h-8 rounded-lg border border-slate-300 bg-white/95 px-2 text-xs font-black text-slate-900 shadow-2xs outline-none cursor-pointer hover:border-[#207de9] transition"
                        >
                          <option value="pending">🟡 Pending</option>
                          <option value="interested">🟢 Interested</option>
                          <option value="cancel">🔴 Cancel</option>
                          <option value="booked">🔵 Booked</option>
                        </select>
                        <div className="mt-1.5">{getStatusBadge(item.status)}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right min-w-[130px]">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quotation Slip Generator button ("i generator") */}
                          <button
                            onClick={() => openQuotationSlip(item)}
                            className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 px-2 text-xs font-bold text-slate-700 shadow-2xs transition cursor-pointer"
                            title="Generate Printable Quotation Slip"
                          >
                            <span>📄 Slip</span>
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => openEditModal(item)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-2xs transition cursor-pointer"
                            title="Edit enquiry details"
                          >
                            ✏️
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteEnquiry(item.id, item.name)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 shadow-2xs transition cursor-pointer"
                            title="Delete enquiry"
                          >
                            🗑️
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
          ADD / EDIT ENQUIRY MODAL
          ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#207de9]">
                  {editingEnquiry ? "Edit Record" : "New Record"}
                </span>
                <h3 className="text-xl font-black text-[#080d24] mt-0.5">
                  {editingEnquiry
                    ? `Update Enquiry #${editingEnquiry.id}`
                    : "Add Packers & Movers Enquiry"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEnquiry} className="mt-5 space-y-4">
              
              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-medium text-[#080d24] outline-none focus:bg-white focus:border-[#207de9] focus:ring-2 focus:ring-[#207de9]/15 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-medium text-[#080d24] outline-none focus:bg-white focus:border-[#207de9] focus:ring-2 focus:ring-[#207de9]/15 transition"
                  />
                </div>
              </div>

              {/* Row 2: From & To */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-700">
                    From Location (Pickup)
                  </label>
                  <input
                    type="text"
                    value={formData.from_location}
                    onChange={(e) => setFormData({ ...formData, from_location: e.target.value })}
                    placeholder="e.g. Ghaziabad / Sector 62 Noida"
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-medium text-[#080d24] outline-none focus:bg-white focus:border-[#207de9] focus:ring-2 focus:ring-[#207de9]/15 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">
                    To Location (Drop)
                  </label>
                  <input
                    type="text"
                    value={formData.to_location}
                    onChange={(e) => setFormData({ ...formData, to_location: e.target.value })}
                    placeholder="e.g. Bengaluru / Pune / Mumbai"
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-medium text-[#080d24] outline-none focus:bg-white focus:border-[#207de9] focus:ring-2 focus:ring-[#207de9]/15 transition"
                  />
                </div>
              </div>

              {/* Detailed Address */}
              <div>
                <label className="text-xs font-bold text-slate-700">
                  Detailed Address (House / Flat / Floor / Landmark)
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Flat 301, Tower B, Supertech Estate, Vaishali, Ghaziabad"
                  className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-medium text-[#080d24] outline-none focus:bg-white focus:border-[#207de9] focus:ring-2 focus:ring-[#207de9]/15 transition"
                />
              </div>

              {/* Truck Feet & Status */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Truck Size / Feet
                  </label>
                  <select
                    value={formData.truck_feet}
                    onChange={(e) => setFormData({ ...formData, truck_feet: e.target.value })}
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-[#080d24] outline-none focus:bg-white focus:border-[#207de9] transition"
                  >
                    {TRUCK_PRESETS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Initial Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as PackersEnquiry["status"],
                      })
                    }
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-[#080d24] outline-none focus:bg-white focus:border-[#207de9] transition"
                  >
                    <option value="pending">🟡 Pending (Yellow Row)</option>
                    <option value="interested">🟢 Interested (Green Row)</option>
                    <option value="cancel">🔴 Cancel (Red Row)</option>
                    <option value="booked">🔵 Booked (Blue Row)</option>
                  </select>
                </div>
              </div>

              {/* Rates & Profit Calculator */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-700">
                    Pricing &amp; Margin Calculator (₹)
                  </span>
                  {formData.customer_rate && formData.vendor_rate && (
                    <span className="text-xs font-extrabold text-emerald-700">
                      Expected Profit: ₹
                      {(
                        (parseFloat(formData.customer_rate) || 0) -
                        (parseFloat(formData.vendor_rate) || 0)
                      ).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500">
                      Vendor Rate (₹ Cost from Driver/Transporter)
                    </label>
                    <input
                      type="number"
                      value={formData.vendor_rate}
                      onChange={(e) => setFormData({ ...formData, vendor_rate: e.target.value })}
                      placeholder="e.g. 25000"
                      className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-mono font-bold text-slate-800 outline-none focus:border-[#207de9]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500">
                      Customer Quoted Rate (₹ Selling Price)
                    </label>
                    <input
                      type="number"
                      value={formData.customer_rate}
                      onChange={(e) => setFormData({ ...formData, customer_rate: e.target.value })}
                      placeholder="e.g. 35000"
                      className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-mono font-black text-[#207de9] outline-none focus:border-[#207de9]"
                    />
                  </div>
                </div>
              </div>

              {/* Follow-up Date */}
              <div>
                <label className="text-xs font-bold text-slate-700">
                  Follow-up Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.follow_up_date}
                  onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                  className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-[#080d24] outline-none focus:bg-white focus:border-[#207de9] transition"
                />
              </div>

              {/* Remark */}
              <div>
                <label className="text-xs font-bold text-slate-700">
                  Remark / Goods Details / Special Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.remark}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  placeholder="e.g. 2BHK furniture, 1 Double bed, fridge, washing machine, fragile packing..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-[#080d24] outline-none focus:bg-white focus:border-[#207de9] transition"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#207de9] hover:bg-[#1570ef] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#207de9]/20 transition cursor-pointer"
                >
                  {editingEnquiry ? "Update Enquiry" : "Save Enquiry"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          QUOTATION & BOOKING SLIP GENERATOR MODAL ("i generator")
          ========================================================================= */}
      {quotationSlipEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 my-8">
            
            {/* Modal Actions Bar (Not printed) */}
            <div className="print:hidden flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">📄</span>
                <span className="text-xs font-black uppercase tracking-wider text-[#207de9]">
                  Packers Quotation Slip Generator
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyQuotationToClipboard}
                  className="rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition cursor-pointer"
                >
                  {copiedQuote ? "✓ Copied!" : "📋 Copy Text"}
                </button>
                <button
                  onClick={handlePrintSlip}
                  className="rounded-lg bg-[#207de9] hover:bg-[#1570ef] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition cursor-pointer"
                >
                  🖨️ Print / Save PDF
                </button>
                <button
                  onClick={() => setQuotationSlipEnquiry(null)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div
              ref={printRef}
              className="rounded-xl border border-slate-200 p-6 bg-white text-slate-900 text-xs font-sans space-y-4 shadow-xs"
            >
              {/* Slip Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 overflow-hidden rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
                    <img src="/logo.png" alt="Digital FX" className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <div className="text-base font-black tracking-tight text-[#080d24]">
                      DIGITAL <span className="text-[#207de9]">FX</span> LOGISTICS
                    </div>
                    <div className="text-[8px] font-extrabold uppercase tracking-[2px] text-slate-400">
                      PACKERS &amp; MOVERS DIVISION
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block rounded-md bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-mono font-black text-[#207de9]">
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
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                    Customer Information
                  </span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    {quotationSlipEnquiry.name}
                  </p>
                  <p className="font-mono text-xs font-bold text-slate-700 mt-0.5">
                    📞 {quotationSlipEnquiry.phone}
                  </p>
                  {quotationSlipEnquiry.address && (
                    <p className="text-[10.5px] text-slate-500 mt-1">
                      {quotationSlipEnquiry.address}
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                    Shifting Movement
                  </span>
                  <div className="mt-1 space-y-1">
                    <p className="font-bold text-emerald-800 text-xs">
                      📍 From: <span className="font-medium text-slate-800">{quotationSlipEnquiry.from_location || "—"}</span>
                    </p>
                    <p className="font-bold text-blue-800 text-xs">
                      🏁 To: <span className="font-medium text-slate-800">{quotationSlipEnquiry.to_location || "—"}</span>
                    </p>
                    <p className="font-bold text-slate-700 text-xs">
                      🚚 Truck: <span className="font-medium text-slate-800">{quotationSlipEnquiry.truck_feet}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Remarks / Goods Description */}
              {quotationSlipEnquiry.remark && (
                <div className="rounded-lg border border-slate-200 p-3 bg-white">
                  <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                    Material / Goods Description
                  </span>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                    {quotationSlipEnquiry.remark}
                  </p>
                </div>
              )}

              {/* Financial Quotation Summary */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[9.5px] uppercase tracking-wider text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-xs">
                    <tr>
                      <td className="py-2.5 px-3">
                        Transportation &amp; Freight ({quotationSlipEnquiry.truck_feet})
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        ₹{(quotationSlipEnquiry.customer_rate || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">
                        Professional Packing &amp; Loading Charges
                      </td>
                      <td className="py-2 px-3 text-right text-slate-500 font-mono">
                        Included
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">
                        Toll Taxes &amp; State Border Permits
                      </td>
                      <td className="py-2 px-3 text-right text-slate-500 font-mono">
                        Included
                      </td>
                    </tr>
                    <tr className="bg-emerald-50/70 font-black text-emerald-900 border-t border-emerald-200">
                      <td className="py-3 px-3 text-xs uppercase tracking-wider">
                        Total Final Quoted Amount
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-sm">
                        ₹{(quotationSlipEnquiry.customer_rate || 0).toLocaleString("en-IN")}/-
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment Schedule */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">
                    20% Booking Advance
                  </span>
                  <p className="font-mono font-black text-slate-900 mt-0.5">
                    ₹{Math.round((quotationSlipEnquiry.customer_rate || 0) * 0.2).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">
                    80% Balance on Delivery
                  </span>
                  <p className="font-mono font-black text-slate-900 mt-0.5">
                    ₹{Math.round((quotationSlipEnquiry.customer_rate || 0) * 0.8).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Terms & Footer */}
              <div className="border-t border-slate-200 pt-3 text-[9.5px] text-slate-400 leading-relaxed space-y-0.5">
                <p>1. Transit insurance available upon declared inventory value.</p>
                <p>2. Unloading at upper floors without service lift may incur extra labor charge.</p>
                <p>3. Digital FX Logistics guarantees verified vehicles and GPS tracking support.</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] text-slate-500 font-semibold">
                <span>Authorized Signatory: ________________</span>
                <span>Customer Signature: ________________</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          WHATSAPP MESSAGE GENERATOR MODAL
          ========================================================================= */}
      {whatsAppModalEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 text-lg">💬</span>
                <div>
                  <h3 className="text-base font-black text-[#080d24]">
                    WhatsApp Message Generator
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Direct communication for {whatsAppModalEnquiry.name} ({whatsAppModalEnquiry.phone})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWhatsAppModalEnquiry(null)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <label className="text-xs font-bold text-slate-700">
                Generated Message (You can edit before sending):
              </label>
              <textarea
                rows={10}
                value={whatsAppCustomText}
                onChange={(e) => setWhatsAppCustomText(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
              />
            </div>

            <div className="mt-4 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setWhatsAppModalEnquiry(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sendWhatsAppDirect(whatsAppModalEnquiry.phone, whatsAppCustomText);
                  setWhatsAppModalEnquiry(null);
                }}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition cursor-pointer"
              >
                <span>🚀 Send on WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
