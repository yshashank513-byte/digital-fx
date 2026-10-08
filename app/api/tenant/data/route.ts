import { NextRequest, NextResponse } from "next/server";
import { loadStore, persistStore } from "@/lib/whatsapp/store";
import { getActiveTenantBusinessId } from "@/lib/whatsapp/auth";
import { Lead, Customer, MessageTemplate, Automation, Campaign, Followup, TeamMember } from "@/lib/whatsapp/types";
import { verifyAdminAuth } from "@/lib/adminApiAuth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.response!;
    }

    const businessId = await getActiveTenantBusinessId();
    const type = request.nextUrl.searchParams.get("type");
    const conversationId = request.nextUrl.searchParams.get("conversationId");

    const store = loadStore();

    if (type === "messages" && conversationId) {
      const msgs = store.messages.filter((m) => m.conversationId === conversationId);
      return NextResponse.json({ messages: msgs });
    }

    return NextResponse.json({
      leads: store.leads.filter((l) => l.businessId === businessId),
      conversations: store.conversations.filter((c) => c.businessId === businessId),
      customers: store.customers.filter((c) => c.businessId === businessId),
      templates: store.templates.filter((t) => t.businessId === businessId),
      automations: store.automations.filter((a) => a.businessId === businessId),
      campaigns: store.campaigns.filter((c) => c.businessId === businessId),
      followups: store.followups.filter((f) => f.businessId === businessId),
      teamMembers: store.teamMembers.filter((t) => t.businessId === businessId),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch tenant data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.response!;
    }

    const body = await request.json();
    const businessId = body.businessId || (await getActiveTenantBusinessId());
    const store = loadStore();

    switch (body.action) {
      case "create_lead": {
        const newLead: Lead = {
          id: `lead-${Date.now()}`,
          businessId,
          name: body.name || "New Prospect",
          phone: body.phone,
          email: body.email || "",
          source: body.source || "WhatsApp Inbound",
          industry: body.industry || "General",
          requirement: body.requirement || "General enquiry",
          status: body.status || "new",
          assignedToAgentName: body.assignedToAgentName || "Unassigned",
          estimatedValue: Number(body.estimatedValue || 0),
          tags: body.tags || ["Lead"],
          lastContactAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        store.leads.unshift(newLead);
        persistStore(store);
        return NextResponse.json({ success: true, lead: newLead });
      }

      case "update_lead_status": {
        const lead = store.leads.find((l) => l.id === body.leadId && l.businessId === businessId);
        if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        lead.status = body.status;
        lead.updatedAt = new Date().toISOString();
        persistStore(store);
        return NextResponse.json({ success: true, lead });
      }

      case "create_customer": {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          businessId,
          name: body.name,
          phone: body.phone,
          email: body.email,
          company: body.company,
          tags: body.tags || ["Customer"],
          totalOrdersOrDeals: 0,
          totalSpent: 0,
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };
        store.customers.unshift(newCust);
        persistStore(store);
        return NextResponse.json({ success: true, customer: newCust });
      }

      case "toggle_automation": {
        const auto = store.automations.find((a) => a.id === body.automationId && a.businessId === businessId);
        if (!auto) return NextResponse.json({ error: "Automation not found" }, { status: 404 });
        auto.isActive = !auto.isActive;
        auto.updatedAt = new Date().toISOString();
        persistStore(store);
        return NextResponse.json({ success: true, automation: auto });
      }

      case "save_automation": {
        let auto = store.automations.find((a) => a.id === body.automation.id && a.businessId === businessId);
        if (auto) {
          Object.assign(auto, body.automation, { updatedAt: new Date().toISOString() });
        } else {
          auto = {
            ...body.automation,
            id: `auto-${Date.now()}`,
            businessId,
            totalRuns: 0,
            successRuns: 0,
            failedRuns: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          store.automations.unshift(auto!);
        }
        persistStore(store);
        return NextResponse.json({ success: true, automation: auto });
      }

      case "create_template": {
        const newTemplate: MessageTemplate = {
          id: `tmpl-${Date.now()}`,
          businessId,
          name: body.name.toLowerCase().replace(/\s+/g, "_"),
          category: body.category || "UTILITY",
          language: body.language || "en_US",
          status: "APPROVED", // Auto-approved in sandbox
          headerType: body.headerType || "NONE",
          headerText: body.headerText,
          body: body.body,
          footer: body.footer,
          buttons: body.buttons || [],
          variables: body.variables || ["customer_name"],
          createdAt: new Date().toISOString(),
        };
        store.templates.unshift(newTemplate);
        persistStore(store);
        return NextResponse.json({ success: true, template: newTemplate });
      }

      case "launch_campaign": {
        const newCampaign: Campaign = {
          id: `camp-${Date.now()}`,
          businessId,
          name: body.name,
          templateId: body.templateId,
          templateName: body.templateName,
          targetAudience: body.targetAudience,
          recipientCount: Number(body.recipientCount || 100),
          status: "completed",
          sentCount: Number(body.recipientCount || 100),
          deliveredCount: Math.round(Number(body.recipientCount || 100) * 0.98),
          readCount: Math.round(Number(body.recipientCount || 100) * 0.84),
          failedCount: Math.round(Number(body.recipientCount || 100) * 0.02),
          repliesCount: Math.round(Number(body.recipientCount || 100) * 0.28),
          variables: body.variables || {},
          createdAt: new Date().toISOString(),
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        };
        store.campaigns.unshift(newCampaign);

        // Update Usage
        const usage = store.usage.find((u) => u.businessId === businessId);
        if (usage) {
          usage.messagesSent += newCampaign.sentCount;
          usage.messagesDelivered += newCampaign.deliveredCount;
          usage.campaignsRun += 1;
        }

        persistStore(store);
        return NextResponse.json({ success: true, campaign: newCampaign });
      }

      case "toggle_followup": {
        const fup = store.followups.find((f) => f.id === body.followupId && f.businessId === businessId);
        if (fup) {
          fup.status = fup.status === "completed" ? "pending" : "completed";
          persistStore(store);
        }
        return NextResponse.json({ success: true, followup: fup });
      }

      case "create_followup": {
        const newFup: Followup = {
          id: `fup-${Date.now()}`,
          businessId,
          customerName: body.customerName,
          customerPhone: body.customerPhone,
          dueAt: body.dueAt || new Date(Date.now() + 86400000).toISOString(),
          notes: body.notes,
          assignedAgentName: body.assignedAgentName || "Account Rep",
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        store.followups.unshift(newFup);
        persistStore(store);
        return NextResponse.json({ success: true, followup: newFup });
      }

      case "add_team_member": {
        const member: TeamMember = {
          id: `tm-${Date.now()}`,
          businessId,
          name: body.name,
          email: body.email,
          phone: body.phone,
          role: body.role || "agent",
          status: "active",
          assignedConversationsCount: 0,
          joinedAt: new Date().toISOString(),
        };
        store.teamMembers.push(member);
        persistStore(store);
        return NextResponse.json({ success: true, teamMember: member });
      }

      default:
        return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Operation failed" }, { status: 500 });
  }
}
