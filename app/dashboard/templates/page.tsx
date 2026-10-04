"use client";

import { useEffect, useState } from "react";
import {
  FileCode2,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Smartphone,
  Sparkles,
  ExternalLink,
  MessageSquare,
  ChevronRight,
  X,
} from "lucide-react";
import { MessageTemplate, TemplateCategory, TemplateStatus } from "@/lib/whatsapp/types";

export default function TenantTemplatesPage() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Create Template Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "UTILITY" as TemplateCategory,
    language: "en_US",
    headerType: "NONE" as "NONE" | "TEXT" | "IMAGE",
    headerText: "",
    body: "Hi {{customer_name}}, thank you for contacting {{business_name}}. Your appointment is confirmed for {{appointment_date}}.",
    footer: "Reply STOP to unsubscribe",
    buttonText: "Confirm Booking",
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      setLoading(true);
      const res = await fetch("/api/tenant");
      if (res.ok) {
        const json = await res.json();
        const tmpls: MessageTemplate[] = json.templates || [];
        setTemplates(tmpls);
        if (tmpls.length > 0) setSelectedTemplate(tmpls[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTemplate(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name) return;

    try {
      const res = await fetch("/api/tenant/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_template",
          ...formData,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.template) {
          setTemplates([json.template, ...templates]);
          setSelectedTemplate(json.template);
        }
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const filteredTemplates = templates.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.body.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === "ALL" || t.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  function getPreviewBody(body: string) {
    return body
      .replace(/{{customer_name}}/g, "Rahul Mehta")
      .replace(/{{business_name}}/g, "Apex Hospital")
      .replace(/{{appointment_date}}/g, "Oct 12, 11:30 AM")
      .replace(/{{order_id}}/g, "ORD-92841")
      .replace(/{{agent_name}}/g, "Dr. Arvind");
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
            WhatsApp Message Templates
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#207de9] border border-blue-200">
              Meta Cloud Verified
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build approved utility and marketing templates for broadcast campaigns and automations.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#207de9] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-600 transition-colors mt-3 sm:mt-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Meta Template</span>
        </button>
      </div>

      {/* Main Grid: Template List (Left 2 cols) & Live Phone Preview Mockup (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Templates Catalog */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#080d24] placeholder-slate-400 focus:outline-none focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              {["ALL", "MARKETING", "UTILITY", "AUTHENTICATION"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    categoryFilter === cat
                      ? "bg-[#207de9] text-white shadow-2xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((tmpl) => {
              const isSelected = selectedTemplate?.id === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 bg-white ${
                    isSelected
                      ? "border-[#207de9] ring-2 ring-[#207de9]/20 shadow-sm"
                      : "border-slate-200/90 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-[#080d24] font-mono truncate">
                      {tmpl.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      tmpl.status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {tmpl.status}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-400 uppercase font-mono">
                    {tmpl.category} • {tmpl.language}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-sans bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    {tmpl.body}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>{tmpl.variables.length} variables</span>
                    <span className="text-[#207de9] font-semibold">Click to preview &gt;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Live WhatsApp Smartphone Mockup */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[320px] rounded-[38px] border-4 border-slate-800 bg-slate-900 p-2 shadow-2xl relative">
            {/* Phone Screen */}
            <div className="rounded-[30px] bg-[#0b141a] overflow-hidden flex flex-col h-[540px]">
              
              {/* WhatsApp App Bar */}
              <div className="h-14 bg-[#1f2c34] px-3 flex items-center justify-between text-white border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-[#207de9] flex items-center justify-center text-xs font-bold text-white">
                    WA
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1 text-white">
                      Business Verified
                      <span className="text-emerald-400 text-[10px]">✓</span>
                    </div>
                    <div className="text-[9px] text-emerald-400">Official WhatsApp Account</div>
                  </div>
                </div>
                <span className="text-xs text-slate-400">⋮</span>
              </div>

              {/* Chat Canvas with Wallpaper Background */}
              <div className="flex-1 p-3 flex flex-col justify-end space-y-2 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px] overflow-y-auto">
                {selectedTemplate ? (
                  <div className="rounded-2xl bg-[#202c33] text-white p-3.5 shadow-lg max-w-[94%] self-start space-y-2 border border-slate-800/80">
                    {/* Header if text */}
                    {selectedTemplate.headerText && (
                      <div className="font-bold text-xs text-slate-200 border-b border-slate-700/60 pb-1.5">
                        {selectedTemplate.headerText}
                      </div>
                    )}

                    {/* Rendered Body */}
                    <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {getPreviewBody(selectedTemplate.body)}
                    </div>

                    {/* Footer */}
                    {selectedTemplate.footer && (
                      <div className="text-[10px] text-slate-400 italic">
                        {selectedTemplate.footer}
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="text-[9px] text-slate-400 text-right">
                      10:45 AM
                    </div>

                    {/* Interactive Buttons */}
                    {selectedTemplate.buttons && selectedTemplate.buttons.length > 0 && (
                      <div className="pt-2 border-t border-slate-700/80 space-y-1">
                        {selectedTemplate.buttons.map((btn, i) => (
                          <div
                            key={i}
                            className="w-full py-2 bg-[#1f2c34] text-center text-xs text-blue-400 font-semibold rounded-lg hover:bg-slate-700 cursor-pointer transition-colors"
                          >
                            {btn.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-slate-400 text-xs text-center">Select a template to view preview</div>
                )}
              </div>

              {/* Phone Footer Input bar */}
              <div className="h-11 bg-[#1f2c34] px-3 flex items-center justify-between text-slate-400 text-xs">
                <span>Message...</span>
                <span>🎤</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 text-center">
            Live preview showing runtime variable interpolation on WhatsApp Android / iOS client.
          </p>
        </div>
      </div>

      {/* Create Meta Template Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#080d24] flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-[#207de9]" />
                Submit New Meta WhatsApp Template
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Template Name (lower_case_only) *</label>
                <input
                  type="text"
                  required
                  placeholder="appointment_reminder_v1"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, "_") })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] font-mono focus:outline-none focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
                  >
                    <option value="UTILITY">UTILITY</option>
                    <option value="MARKETING">MARKETING</option>
                    <option value="AUTHENTICATION">AUTHENTICATION</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Language Code</label>
                  <input
                    type="text"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] font-mono focus:outline-none focus:border-[#207de9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Message Body *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Use {{variable_name}} syntax..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Footer Text (Optional)</label>
                  <input
                    type="text"
                    value={formData.footer}
                    onChange={(e) => setFormData({ ...formData, footer: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Quick Action Button</label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl font-semibold shadow-xs transition-colors"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
