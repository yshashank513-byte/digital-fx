import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBusinessById } from "@/lib/reviewFlowStore";
import CustomerReviewClient from "./CustomerReviewClient";

interface Props {
  params: Promise<{ businessId: string }>;
  searchParams?: Promise<{ name?: string; cat?: string; reviewUrl?: string; city?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { businessId } = await params;
  let business = await getBusinessById(businessId);
  const sp = searchParams ? await searchParams : {};
  const name = business?.name || sp.name || businessId.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const cat = business?.category || sp.cat || "Local Business";

  return {
    title: `Share Your Experience with ${name} | Verified Google Review Desk`,
    description: `Leave your genuine customer review for ${name} (${cat}). Takes only 30 seconds.`,
    robots: { index: false, follow: false },
  };
}

export default async function CustomerReviewPage({ params, searchParams }: Props) {
  const { businessId } = await params;
  let business = await getBusinessById(businessId);
  const sp = searchParams ? await searchParams : {};

  if (!business) {
    const fallbackName = sp.name || businessId.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    business = {
      id: businessId,
      qrId: `rf_${businessId}`,
      name: fallbackName,
      category: (sp.cat as any) || "Other",
      phone: "+91 93198 07273",
      address: sp.city || "NCR",
      googleReviewUrl: sp.reviewUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackName)}`,
      city: sp.city || "NCR",
      brandColor: "#207de9",
      status: "active",
      active: true,
      totalScans: 1,
      totalVisits: 1,
      totalDrafts: 0,
      totalGoogleClicks: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return <CustomerReviewClient business={business!} />;
}
