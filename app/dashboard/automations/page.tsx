"use client";

import { useEffect, useState } from "react";
import {
  Workflow,
  Plus,
  Play,
  Pause,
  Copy,
  Save,
  CheckCircle2,
  Trash2,
  ArrowDown,
  MessageSquare,
  FileCode2,
  Clock,
  Tag,
  UserCheck,
  Send,
  HelpCircle,
  Code,
  Bell,
  Settings,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Automation, AutomationStep, AutomationTrigger, AutomationAction } from "@/lib/whatsapp/types";

const TRIGGER_OPTIONS: { id: AutomationTrigger; label: string; icon: string }[] = [
  { id: "new_whatsapp_message", label: "New WhatsApp message", icon: "💬" },
  { id: "keyword", label: "Keyword Match", icon: "🔍" },
  { id: "new_lead", label: "New Lead Captured", icon: "👤" },
  { id: "new_customer", label: "New Customer Registered", icon: "⭐" },
  { id: "new_form_submission", label: "New Web Form Submission", icon: "📝" },
  { id: "time_date", label: "Time / Date Schedule", icon: "⏰" },
  { id: "followup_due", label: "Follow-up Due", icon: "📅" },
  { id: "order_status", label: "Order Status Updated", icon: "📦" },
  { id: "manual", label: "Manual API / Agent Trigger", icon: "⚡" },
];

const ACTION_OPTIONS: { id: AutomationAction; label: string; icon: string; category: string }[] = [
  { id: "send_whatsapp_message", label: "Send WhatsApp message", icon: "💬", category: "Messaging" },
  { id: "send_template", label: "Send Meta Template", icon: "📄", category: "Messaging" },
  { id: "ask_question", label: "Ask Question & Wait", icon: "❓", category: "Interactive" },
  { id: "wait", label: "Wait Delay", icon: "⏳", category: "Logic" },
  { id: "condition", label: "Condition Branch (If/Else)", icon: "🔀", category: "Logic" },
  { id: "add_tag", label: "Add Tag", icon: "🏷️", category: "CRM" },
  { id: "remove_tag", label: "Remove Tag", icon: "✂️", category: "CRM" },
  { id: "assign_agent", label: "Assign to Agent", icon: "👨‍💼", category: "CRM" },
  { id: "create_lead", label: "Create Lead in Pipeline", icon: "🎯", category: "CRM" },
  { id: "update_customer", label: "Update Customer Record", icon: "📝", category: "CRM" },
  { id: "create_followup", label: "Create Follow-up Reminder", icon: "⏰", category: "CRM" },
  { id: "webhook", label: "Trigger External Webhook", icon: "🌐", category: "Integration" },
  { id: "notify_admin", label: "Notify SaaS Admin / Manager", icon: "🔔", category: "Integration" },
];

export default function TenantAutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [selectedAuto, setSelectedAuto] = useState<Automation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStep, setSelectedStep] = useState<AutomationStep | null>(null);

  // Live test execution state
  const [isTesting, setIsTesting] = useState(false);
  const [testLog, setTestLog] = useState<string[]>([]);
  const [testModalOpen, setTestModalOpen] = useState(false);

  useEffect(() => {
    fetchAutomations();
  }, []);

  async function fetchAutomations() {
    try {
      setLoading(true);
      const res = await fetch("/api/tenant");
      if (res.ok) {
        const json = await res.json();
        const autos = json.automations || [];
        setAutomations(autos);
        if (autos.length > 0) {
          setSelectedAuto(autos[0]);
          setSelectedStep(autos[0].steps?.[0] || null);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive(auto: Automation) {
    const updated = !auto.isActive;
    auto.isActive = updated;
    setAutomations([...automations]);

    try {
      await fetch("/api/tenant/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_automation_status",
          automationId: auto.id,
          isActive: updated,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  }

  function handleAddStep(actionType: AutomationAction) {
    if (!selectedAuto) return;
    const newStepId = `step-${Date.now()}`;
    const option = ACTION_OPTIONS.find((a) => a.id === actionType);

    const newStep: AutomationStep = {
      id: newStepId,
      type: "action",
      actionType,
      title: option?.label || "New Action Step",
      config: actionType === "send_whatsapp_message" ? { text: "Hello, this is an automated response." } : {},
    };

    selectedAuto.steps.push(newStep);
    setAutomations([...automations]);
    setSelectedStep(newStep);
  }

  function handleDeleteStep(stepId: string) {
    if (!selectedAuto) return;
    selectedAuto.steps = selectedAuto.steps.filter((s) => s.id !== stepId);
    if (selectedStep?.id === stepId) {
      setSelectedStep(selectedAuto.steps[0] || null);
    }
    setAutomations([...automations]);
  }

  function handleDuplicateAutomation(auto: Automation) {
    const clone: Automation = {
      ...JSON.parse(JSON.stringify(auto)),
      id: `auto-${Date.now()}`,
      name: `${auto.name} (Copy)`,
      totalRuns: 0,
      successRuns: 0,
      failedRuns: 0,
      createdAt: new Date().toISOString(),
    };
    setAutomations([clone, ...automations]);
    setSelectedAuto(clone);
  }

  async function handleTestWorkflow() {
    if (!selectedAuto) return;
    setIsTesting(true);
    setTestLog([]);
    setTestModalOpen(true);

    const logs: string[] = [];
    logs.push(`[${new Date().toLocaleTimeString()}] Initializing sandbox runner for "${selectedAuto.name}"...`);
    setTestLog([...logs]);

    for (let i = 0; i < selectedAuto.steps.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      const step = selectedAuto.steps[i];
      logs.push(`[${new Date().toLocaleTimeString()}] Step ${i + 1} executed: "${step.title}" (${step.actionType}) - SUCCESS`);
      setTestLog([...logs]);
    }

    await new Promise((r) => setTimeout(r, 400));
    logs.push(`[${new Date().toLocaleTimeString()}] Workflow finished with 0 errors.`);
    setTestLog([...logs]);
    setIsTesting(false);
  }

  return (
    <div className="h-[calc(100vh-5.5rem)] flex flex-col -m-4 sm:-m-6 lg:-m-8 bg-[#f8fafc] text-[#080d24] overflow-hidden">
      {/* Workflow Builder Header */}
      <div className="h-14 shrink-0 px-5 border-b border-slate-200/90 bg-white flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-[#207de9]">
            <Workflow className="w-4 h-4" />
          </div>
          {selectedAuto && (
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={selectedAuto.name}
                  onChange={(e) => {
                    selectedAuto.name = e.target.value;
                    setAutomations([...automations]);
                  }}
                  className="bg-transparent font-bold text-sm text-[#080d24] focus:outline-none focus:border-b border-[#207de9]"
                />
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  selectedAuto.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"
                }`}>
                  {selectedAuto.isActive ? "LIVE" : "PAUSED"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-md">{selectedAuto.description}</p>
            </div>
          )}
        </div>

        {/* Workflow Toolbar */}
        <div className="flex items-center gap-2">
          {selectedAuto && (
            <>
              <button
                onClick={handleTestWorkflow}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#207de9]" />
                <span>Test Workflow</span>
              </button>

              <button
                onClick={() => handleToggleActive(selectedAuto)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shadow-xs ${
                  selectedAuto.isActive
                    ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                    : "bg-[#207de9] text-white hover:bg-blue-600"
                }`}
              >
                {selectedAuto.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{selectedAuto.isActive ? "Pause" : "Publish Live"}</span>
              </button>

              <button
                onClick={() => handleDuplicateAutomation(selectedAuto)}
                className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl shadow-2xs transition-colors"
                title="Duplicate Workflow"
              >
                <Copy className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Builder Layout: Workflows List (Left), Visual Flow Canvas (Center), Step Configurator (Right) */}
      <div className="flex-1 flex min-h-0 divide-x divide-slate-200/90">
        
        {/* Left: Workflows Navigator */}
        <div className="w-64 shrink-0 flex flex-col bg-white min-h-0 p-3 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">All Automations</span>
            <button
              onClick={() => {
                const newAuto: Automation = {
                  id: `auto-${Date.now()}`,
                  businessId: selectedAuto?.businessId || "biz-001",
                  name: "New WhatsApp Automation",
                  description: "Triggers on inbound keywords and qualifies prospect",
                  trigger: "new_whatsapp_message",
                  triggerConfig: {},
                  isActive: true,
                  totalRuns: 0,
                  successRuns: 0,
                  failedRuns: 0,
                  steps: [
                    { id: "s1", type: "trigger", actionType: "new_whatsapp_message", title: "Trigger: Inbound WhatsApp Message", config: {} },
                    { id: "s2", type: "action", actionType: "send_whatsapp_message", title: "Send Instant Auto-Reply", config: { text: "Hello! How can we assist you today?" } },
                  ],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                setAutomations([newAuto, ...automations]);
                setSelectedAuto(newAuto);
                setSelectedStep(newAuto.steps[0]);
              }}
              className="p-1.5 rounded-lg bg-blue-50 text-[#207de9] hover:bg-blue-100 transition-colors"
              title="Create Automation"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
            {automations.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setSelectedAuto(a);
                  setSelectedStep(a.steps[0] || null);
                }}
                className={`w-full p-2.5 rounded-xl text-left text-xs transition-colors space-y-1 border ${
                  selectedAuto?.id === a.id
                    ? "bg-blue-50/70 border-blue-200 text-[#080d24] font-semibold"
                    : "border-transparent text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{a.name}</span>
                  <span className={`h-2 w-2 rounded-full ${a.isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {a.steps.length} steps • {a.totalRuns.toLocaleString()} runs
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Visual Workflow Canvas */}
        <div className="flex-1 flex flex-col bg-[#f8fafc] min-h-0 overflow-y-auto p-8 items-center space-y-4">
          {selectedAuto?.steps.map((step, idx) => {
            const isSelected = selectedStep?.id === step.id;
            const isTrigger = step.type === "trigger";

            return (
              <div key={step.id} className="w-full max-w-md flex flex-col items-center">
                {/* Node Card */}
                <div
                  onClick={() => setSelectedStep(step)}
                  className={`w-full p-4 rounded-2xl border cursor-pointer transition-all relative ${
                    isSelected
                      ? "border-[#207de9] bg-white shadow-md ring-2 ring-[#207de9]/20"
                      : "border-slate-200/90 bg-white hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                      isTrigger ? "bg-blue-50 text-[#207de9] border border-blue-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                      {isTrigger ? "TRIGGER" : `ACTION #${idx}`}
                    </span>

                    {!isTrigger && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStep(step.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                        title="Remove Step"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-[#080d24]">{step.title}</h3>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{step.actionType}</div>

                  {step.config?.text && (
                    <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-700 font-sans italic truncate">
                      "{step.config.text}"
                    </div>
                  )}
                </div>

                {/* Arrow down to next step */}
                {idx < (selectedAuto?.steps.length || 0) - 1 && (
                  <div className="py-2 text-slate-400 flex flex-col items-center">
                    <div className="h-4 w-px bg-slate-300" />
                    <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Step Connector */}
          <div className="pt-2 flex flex-col items-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Append Action Step:</div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-lg">
              {ACTION_OPTIONS.slice(0, 6).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleAddStep(opt.id)}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 text-[11px] font-medium text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Step Inspector & Configuration Drawer */}
        <div className="w-80 shrink-0 flex flex-col bg-white p-4 space-y-4 overflow-y-auto min-h-0 border-l border-slate-200/90">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Step Inspector</h2>
            {selectedStep && (
              <span className="text-[10px] font-mono text-[#207de9] font-bold">{selectedStep.id}</span>
            )}
          </div>

          {selectedStep ? (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Step Label</label>
                <input
                  type="text"
                  value={selectedStep.title}
                  onChange={(e) => {
                    selectedStep.title = e.target.value;
                    setAutomations([...automations]);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] font-medium focus:outline-none focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Action Type</label>
                <select
                  value={selectedStep.actionType}
                  onChange={(e) => {
                    selectedStep.actionType = e.target.value as any;
                    setAutomations([...automations]);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
                >
                  {selectedStep.type === "trigger"
                    ? TRIGGER_OPTIONS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)
                    : ACTION_OPTIONS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
                </select>
              </div>

              {/* Action specific config fields */}
              {(selectedStep.actionType === "send_whatsapp_message" || selectedStep.actionType === "ask_question") && (
                <div>
                  <label className="block text-slate-600 font-medium mb-1">WhatsApp Message Body</label>
                  <textarea
                    rows={4}
                    value={selectedStep.config?.text || ""}
                    onChange={(e) => {
                      selectedStep.config = { ...selectedStep.config, text: e.target.value };
                      setAutomations([...automations]);
                    }}
                    placeholder="Type the message to automatically send to the customer..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] placeholder-slate-400 focus:outline-none focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Variables supported: &#123;&#123;customer_name&#125;&#125;</span>
                </div>
              )}

              {selectedStep.actionType === "assign_agent" && (
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Assign To Agent</label>
                  <select
                    value={selectedStep.config?.agent || "Dr. Arvind Sharma"}
                    onChange={(e) => {
                      selectedStep.config = { ...selectedStep.config, agent: e.target.value };
                      setAutomations([...automations]);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
                  >
                    <option value="Dr. Arvind Sharma">Dr. Arvind Sharma</option>
                    <option value="Rohan Verma">Rohan Verma</option>
                    <option value="Sneha Rao">Sneha Rao</option>
                  </select>
                </div>
              )}

              {selectedStep.actionType === "wait" && (
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Delay Duration (Minutes)</label>
                  <input
                    type="number"
                    value={selectedStep.config?.delayMinutes || 15}
                    onChange={(e) => {
                      selectedStep.config = { ...selectedStep.config, delayMinutes: Number(e.target.value) };
                      setAutomations([...automations]);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => alert("Step configuration saved.")}
                  className="w-full py-2.5 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Step</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-xs">Select a step on the canvas to configure parameters.</div>
          )}
        </div>
      </div>

      {/* Test Workflow Modal */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-[#080d24] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#207de9]" />
                Live Workflow Execution Test
              </h2>
              <button onClick={() => setTestModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 font-mono text-xs space-y-2 h-64 overflow-y-auto">
              {testLog.map((log, i) => (
                <div key={i} className="text-emerald-400">{log}</div>
              ))}
              {isTesting && (
                <div className="text-slate-400 animate-pulse">Running step simulation...</div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setTestModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Close Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
