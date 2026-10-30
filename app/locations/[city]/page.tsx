import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getCitySeoProfile,
  CANONICAL_LOCATION_SLUGS,
  getParentStateSlugForCity,
} from "@/lib/citySeoData";

interface PageProps {
  params: Promise<{
    city: string;
  }>;
}

export async function generateStaticParams() {
  return CANONICAL_LOCATION_SLUGS.map((slug) => ({ city: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawCity = resolvedParams.city.toLowerCase().trim();

  let targetSlug = rawCity;
  if (targetSlug === "gurugram") targetSlug = "gurgaon";
  if (targetSlug === "bengaluru") targetSlug = "bangalore";

  const profile = getCitySeoProfile(targetSlug);
  if (profile) {
    permanentRedirect(`/digital-marketing-agency/${profile.slug}`);
  }

  const parentState = getParentStateSlugForCity(rawCity);
  if (parentState) {
    permanentRedirect(`/digital-marketing-agency/${parentState}`);
  }

  return {
    title: "Redirecting to Location | Digital FX",
  };
}

export default async function LegacyLocationCityRedirectPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawCity = resolvedParams.city.toLowerCase().trim();

  let targetSlug = rawCity;
  if (targetSlug === "gurugram") targetSlug = "gurgaon";
  if (targetSlug === "bengaluru") targetSlug = "bangalore";

  const profile = getCitySeoProfile(targetSlug);
  if (profile) {
    permanentRedirect(`/digital-marketing-agency/${profile.slug}`);
  }

  const parentState = getParentStateSlugForCity(rawCity);
  if (parentState) {
    permanentRedirect(`/digital-marketing-agency/${parentState}`);
  }

  notFound();
}
