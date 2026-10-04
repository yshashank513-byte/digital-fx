import { NextRequest, NextResponse } from "next/server";
import { verifyMetaSignature } from "@/lib/whatsapp/service";
import { loadStore, persistStore } from "@/lib/whatsapp/store";
import { ChatMessage } from "@/lib/whatsapp/types";

// WhatsApp Cloud API Webhook Verification (GET)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken = process.env.WEBHOOK_VERIFY_TOKEN || "digitalfx_whatsapp_webhook_token_2026";

  if (mode === "subscribe" && token === expectedToken) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({ error: "Verification token mismatch or invalid mode" }, { status: 403 });
}

// WhatsApp Cloud API Inbound Message & Delivery Receipts Handler (POST)
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-hub-signature-256");
    const appSecret = process.env.WHATSAPP_APP_SECRET;

    // Optional HMAC signature check if app secret configured
    if (appSecret && signature) {
      const isValid = verifyMetaSignature(rawBody, signature, appSecret);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid HMAC SHA-256 signature" }, { status: 401 });
      }
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const store = loadStore();

    // Process WhatsApp Webhook payload format
    if (payload.object === "whatsapp_business_account" && Array.isArray(payload.entry)) {
      for (const entry of payload.entry) {
        for (const change of entry.changes || []) {
          const value = change.value;
          if (!value) continue;

          // Inbound Message
          if (Array.isArray(value.messages)) {
            for (const msg of value.messages) {
              const fromPhone = msg.from;
              const textBody = msg.text?.body || (msg.type === "button" ? msg.button?.text : "[Media Message]");
              const senderName = value.contacts?.[0]?.profile?.name || `+${fromPhone}`;

              // Find or link conversation
              let convo = store.conversations.find((c) => c.customerPhone.replace(/[^0-9]/g, "").includes(fromPhone));
              const businessId = convo ? convo.businessId : store.businesses[0].id;

              if (!convo) {
                convo = {
                  id: `conv-inbound-${Date.now()}`,
                  businessId,
                  customerId: `cust-${Date.now()}`,
                  customerName: senderName,
                  customerPhone: `+${fromPhone}`,
                  lastMessage: textBody,
                  lastMessageAt: new Date().toISOString(),
                  lastMessageSender: "customer",
                  unreadCount: 1,
                  status: "unread",
                  tags: ["Inbound"],
                  notesCount: 0,
                  createdAt: new Date().toISOString(),
                };
                store.conversations.unshift(convo);
              } else {
                convo.lastMessage = textBody;
                convo.lastMessageAt = new Date().toISOString();
                convo.lastMessageSender = "customer";
                convo.unreadCount += 1;
              }

              const newMsg: ChatMessage = {
                id: msg.id || `wamid.in_${Date.now()}`,
                conversationId: convo.id,
                businessId,
                sender: "customer",
                senderName,
                text: textBody,
                timestamp: new Date().toISOString(),
                status: "delivered",
              };
              store.messages.push(newMsg);

              // Auto-reply automation trigger simulation
              const activeAutomations = store.automations.filter((a) => a.businessId === businessId && a.isActive);
              for (const auto of activeAutomations) {
                if (auto.trigger === "new_whatsapp_message" || (auto.trigger === "keyword" && textBody.toLowerCase().includes("help"))) {
                  auto.totalRuns += 1;
                  auto.successRuns += 1;
                  // Auto reply message
                  const botReply: ChatMessage = {
                    id: `wamid.bot_${Date.now()}`,
                    conversationId: convo.id,
                    businessId,
                    sender: "bot",
                    senderName: "Automated Assistant",
                    text: `Hello ${senderName}! Thank you for contacting us. An executive will connect with you shortly.`,
                    timestamp: new Date(Date.now() + 1000).toISOString(),
                    status: "sent",
                  };
                  store.messages.push(botReply);
                  convo.lastMessage = botReply.text;
                  convo.lastMessageSender = "bot";
                }
              }
            }
          }

          // Message Status Update (sent / delivered / read)
          if (Array.isArray(value.statuses)) {
            for (const statusObj of value.statuses) {
              const msg = store.messages.find((m) => m.id === statusObj.id);
              if (msg) {
                msg.status = statusObj.status as any;
              }
            }
          }
        }
      }

      persistStore(store);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
