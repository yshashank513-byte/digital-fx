import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBusinessById } from "@/lib/reviewFlowStore";
import CustomerReviewClient from "./CustomerReviewClient";

interface Props {
  params: Promise<{ businessId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { businessId } = await params;
  const business = await getBusinessById(businessId);

  if (!business) {
    return {
      title: "Business Not Found | ReviewFlow AI",
    };
  }

  return {
    title: `Share Your Experience with ${business.name} | Verified Google Review Desk`,
    description: `Leave your genuine customer review for ${business.name} (${business.category}) in ${business.city || "NCR"}. Takes only 30 seconds.`,
    robots: { index: false, follow: false }, // Avoid duplicate indexing of customer short links
  };
}

export default async function CustomerReviewPage({ params }: Props) {
  const { businessId } = await params;
  const business = await getBusinessById(businessId);

  if (!business) {
    notFound();
  }

  return <CustomerReviewClient business={business} />;
}
