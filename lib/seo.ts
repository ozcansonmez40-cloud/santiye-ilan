import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "./constants";
import type { Listing } from "./types";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Saha İlan | İnşaat ve Saha Personeli İlan Platformu",
    template: "%s | Saha İlan",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: baseUrl,
    siteName: SITE_NAME,
    locale: "tr_TR",
    type: "website",
  },
};

export function listingMetadata(listing?: Listing): Metadata {
  if (!listing) {
    return {
      title: "İlan Bulunamadı",
      description: SITE_DESCRIPTION,
    };
  }

  const title = `${listing.city} ${listing.position} ${listing.listingType === "employer" ? "Aranıyor" : "İş Arıyorum"}`;

  return {
    title,
    description: listing.description,
    alternates: {
      canonical: `/ilanlar/${listing.slug}`,
    },
    openGraph: {
      title,
      description: listing.description,
      url: `/ilanlar/${listing.slug}`,
      type: "article",
      locale: "tr_TR",
    },
  };
}
