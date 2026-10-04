"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Check,
  CheckCheck,
  Send,
  FileCode2,
  CalendarClock,
  Plus,
} from "lucide-react";
import { Conversation, ChatMessage, LeadStatus } from "@/lib/whatsapp/types";

function TenantInboxContent() {
  const searchParams = useSearchParams();
  const queryConvoId = searchParams.get("convoId");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Filters & Search
  const [filter, setFilter] = useState<"all" | "unread" | "assigned" | "follow_up" | "closed">("all");
  const [search, setSearch] = useState("");

  // Composer
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);

  // Right Panel State
  const [newTagInput, setNewTagInput] = useState("");
  const [newNoteInput, setNewNoteInput] = useState("");
  const [notesList, setNotesList] = useState<string[]>([
    "Customer requested urgent consultation details.",
    "Followed up on Monday; satisfied with quotation.",
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTenantInbox();
  }, []);

  useEffect(() => {
    if (selectedConvo) {
      fetchMessages(selectedConvo.id);
    }
  }, [selectedConvo?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchTenantInbox() {
    try {
      setLoading(true);
      const res = await fetch("/api/tenant");
      if (res.ok) {
        const json = await res.json();
        const convos: Conversation[] = json.conversations || [];
        setConversations(convos);
        setTemplates(json.templates || []);

        if (queryConvoId) {
          const matched = convos.find((c) => c.id === queryConvoId);
          setSelectedConvo(matched || convos[0] || null);
        } else if (convos.length > 0) {
          setSelectedConvo(convos[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMessages(convoId: string) {
    try {
      setMessagesLoading(true);
      const res = await fetch(`/api/tenant/data?type=messages&conversationId=${convoId}`);
      if (res.ok) {
        const json = await res.json();
        setMessages(json.messages || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMessagesLoading(false);
    }
  }

  async function handleSendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedConvo) return;

    const textToSend = inputText.trim();
    setInputText("");
    setSending(true);

    const tempId = `wamid.temp_${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      conversationId: selectedConvo.id,
      businessId: selectedConvo.businessId,
      sender: "agent",
      senderName: "Digital FX Agent",
      text: textToSend,
      timestamp: new Date().toISOString(),
      status: "sent",
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch("/api/whatsapp/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientPhone: selectedConvo.customerPhone,
          text: textToSend,
          conversationId: selectedConvo.id,
          senderName: "Digital FX Agent",
        }),
      });

      if (res.ok) {
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) => (m.id === tempId ? { ...m, status: "delivered" } : m))
          );
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  async function handleSendTemplate(tmpl: any) {
    if (!selectedConvo) return;
    setTemplatePickerOpen(false);

    try {
      const res = await fetch("/api/whatsapp/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "template",
          recipientPhone: selectedConvo.customerPhone,
          templateName: tmpl.name,
          conversationId: selectedConvo.id,
          variables: { customer_name: selectedConvo.customerName, business_name: "Apex Hospital" },
        }),
      });

      if (res.ok) {
        fetchMessages(selectedConvo.id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleAddTag() {
    if (!newTagInput.trim() || !selectedConvo) return;
    if (!selectedConvo.tags.includes(newTagInput.trim())) {
      selectedConvo.tags.push(newTagInput.trim());
      setConversations([...conversations]);
    }
    setNewTagInput("");
  }

  function handleAddNote() {
    if (!newNoteInput.trim()) return;
    setNotesList((prev) => [newNoteInput.trim(), ...prev]);
    setNewNoteInput("");
  }

  function handleUpdateLeadStatus(newStatus: LeadStatus) {
    if (!selectedConvo) return;
    selectedConvo.leadStatus = newStatus;
    setConversations([...conversations]);
  }

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.customerPhone.includes(search) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === "unread") return c.unreadCount > 0 || c.status === "unread";
    if (filter === "assigned") return !!c.assignedAgentName;
    if (filter === "follow_up") return c.status === "follow_up";
    if (filter === "closed") return c.status === "closed";
    return true;
  });

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col -m-4 sm:-m-6 lg:-m-8 bg-white border-t border-slate-200 overflow-hidden">
      {/* 3-Panel CRM Workspace Layout */}
      <div className="flex-1 flex min-h-0 divide-x divide-slate-200">
        
        {/* PANEL 1: LEFT CONVERSATION LIST */}
        <div className="w-80 shrink-0 flex flex-col bg-white min-h-0">
          <div className="p-3.5 border-b border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#080d24] flex items-center gap-2">
                WhatsApp Inbox
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#207de9] border border-blue-200">
                  {conversations.length}
                </span>
              </h2>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#080d24] placeholder-slate-400 focus:outline-none focus:border-[#207de9]"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {(["all", "unread", "assigned", "follow_up", "closed"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-medium whitespace-nowrap transition-colors ${
                    filter === tab
                      ? "bg-[#207de9] text-white font-semibold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-thin scrollbar-thumb-slate-200">
            {filteredConversations.map((convo) => {
              const isSelected = selectedConvo?.id === convo.id;

              return (
                <button
                  key={convo.id}
                  onClick={() => {
                    setSelectedConvo(convo);
                    convo.unreadCount = 0;
                  }}
                  className={`w-full p-3.5 text-left transition-colors flex items-start gap-3 hover:bg-slate-50 ${
                    isSelected ? "bg-blue-50/60 border-l-4 border-[#207de9]" : ""
                  }`}
                >
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs text-[#207de9]">
                    {convo.customerName.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-[#080d24] truncate max-w-[130px]">
                        {convo.customerName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {convo.lastMessageAt?.slice(11, 16) || "10:30"}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono mb-1">
                      {convo.customerPhone}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-slate-600 truncate max-w-[150px]">
                        {convo.lastMessage}
                      </p>
                      {convo.unreadCount > 0 && (
                        <span className="h-4 min-w-[16px] px-1 rounded-full bg-[#207de9] text-white text-[9px] font-bold flex items-center justify-center">
                          {convo.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PANEL 2: MIDDLE WHATSAPP CHAT THREAD */}
        <div className="flex-1 flex flex-col bg-[#efeae2] min-h-0 relative">
          {selectedConvo ? (
            <>
              {/* Chat Header */}
              <div className="h-14 shrink-0 px-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs text-[#207de9]">
                    {selectedConvo.customerName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#080d24] flex items-center gap-2">
                      {selectedConvo.customerName}
                      <span className="rounded-md bg-blue-50 px-1.5 py-0.2 text-[9px] text-[#207de9] border border-blue-200 uppercase font-mono font-bold">
                        {selectedConvo.leadStatus || "New"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">{selectedConvo.customerPhone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTemplatePickerOpen(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#207de9] rounded-xl text-xs font-bold border border-blue-200 transition"
                  >
                    <FileCode2 className="w-3.5 h-3.5" />
                    <span>Send Template</span>
                  </button>
                  <button
                    onClick={() => {
                      selectedConvo.status = "closed";
                      setConversations([...conversations]);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
                  >
                    Close Chat
                  </button>
                </div>
              </div>

              {/* Message Bubbles Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-300">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                    Loading messages...
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender === "agent";
                    const isBot = msg.sender === "bot";

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-3.5 py-2 text-xs shadow-sm ${
                            isMe
                              ? "bg-[#d9fdd3] text-[#111b21] rounded-tr-xs"
                              : isBot
                              ? "bg-white text-cyan-900 border border-cyan-200 rounded-tl-xs"
                              : "bg-white text-[#111b21] rounded-tl-xs"
                          }`}
                        >
                          {(isBot || (isMe && msg.senderName)) && (
                            <div className="text-[10px] font-bold text-emerald-800 mb-0.5">
                              {msg.senderName}
                            </div>
                          )}

                          <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                          <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-slate-500">
                            <span>{msg.timestamp.slice(11, 16)}</span>
                            {isMe && (
                              <span>
                                {msg.status === "read" ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                ) : msg.status === "delivered" ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
                                ) : (
                                  <Check className="w-3 h-3 text-slate-400" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTemplatePickerOpen(true)}
                  className="p-2 text-slate-500 hover:text-[#207de9] rounded-xl hover:bg-slate-100"
                  title="Insert WhatsApp Template"
                >
                  <FileCode2 className="w-4 h-4 text-[#207de9]" />
                </button>

                <input
                  type="text"
                  placeholder="Type a WhatsApp message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#080d24] placeholder-slate-400 focus:outline-none focus:border-[#207de9]"
                />

                <button
                  type="submit"
                  disabled={sending || !inputText.trim()}
                  className="p-2.5 bg-[#207de9] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              Select a conversation to start messaging
            </div>
          )}
        </div>

        {/* PANEL 3: RIGHT PANEL */}
        {selectedConvo && (
          <div className="w-72 shrink-0 flex flex-col bg-white p-4 space-y-5 overflow-y-auto min-h-0 border-l border-slate-200">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Profile</h3>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="font-bold text-[#080d24] text-sm">{selectedConvo.customerName}</div>
                <div className="text-[#207de9] font-mono text-[11px] font-semibold">{selectedConvo.customerPhone}</div>
                <div className="text-slate-400 text-[10px]">ID: {selectedConvo.customerId}</div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">CRM Pipeline Stage</label>
              <select
                value={selectedConvo.leadStatus || "new"}
                onChange={(e) => handleUpdateLeadStatus(e.target.value as LeadStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-[#080d24] text-xs font-medium focus:outline-none focus:border-[#207de9]"
              >
                <option value="new">New Prospect</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="quotation_sent">Quotation Sent</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Deal Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedConvo.tags.map((tg, idx) => (
                  <span key={idx} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 font-medium">
                    #{tg}
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-[#080d24]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Internal Agent Notes</span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="New note..."
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-[#080d24]"
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="px-2.5 py-1 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  Save
                </button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {notesList.map((nt, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                    {nt}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => alert(`Created follow-up reminder for ${selectedConvo.customerName}`)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <CalendarClock className="w-3.5 h-3.5 text-amber-500" />
                <span>Create Follow-up Reminder</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Template Picker Modal */}
      {templatePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-[#080d24] flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-[#207de9]" />
                Select Approved WhatsApp Template
              </h2>
              <button onClick={() => setTemplatePickerOpen(false)} className="text-slate-400 hover:text-[#080d24]">✕</button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleSendTemplate(tmpl)}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:border-[#207de9] hover:bg-blue-50/30 cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#080d24]">{tmpl.name}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-50 text-[#207de9] border border-blue-200">
                      {tmpl.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{tmpl.body}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setTemplatePickerOpen(false)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TenantInboxPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-slate-400 text-xs font-semibold">
          Loading WhatsApp CRM Inbox...
        </div>
      }
    >
      <TenantInboxContent />
    </Suspense>
  );
}
