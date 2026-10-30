/**
 * Digital FX — Google Analytics 4 & Conversion Tracking Engine
 * Provides client helpers for tracking high-intent interactions:
 * - WhatsApp clicks
 * - Phone call clicks
 * - Enquiry form submissions
 */

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "set" | "js",
      targetIdOrAction: string | Date,
      params?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

export function trackEvent(
  action: string,
  params: Record<string, any> = {}
) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    try {
      window.gtag("event", action, params);
    } catch {
      // Fail silently if adblocker blocks analytics
    }
  }
}

export function trackWhatsAppClick(locationOrContext: string = "global") {
  trackEvent("whatsapp_click", {
    event_category: "Engagement",
    event_label: locationOrContext,
    value: 1,
  });
}

export function trackPhoneCallClick(locationOrContext: string = "global") {
  trackEvent("phone_call_click", {
    event_category: "Engagement",
    event_label: locationOrContext,
    value: 1,
  });
}

export function trackEnquirySubmit(serviceName: string, location: string = "India") {
  trackEvent("generate_lead", {
    event_category: "Conversion",
    event_label: `${serviceName} - ${location}`,
    service_type: serviceName,
    lead_location: location,
    value: 1,
  });
}
