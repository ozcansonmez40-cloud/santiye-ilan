import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "./constants";
import type { Listing } from "./types";
import { SITE_URL } from "./site-url";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Next.js resolves './' against each page, without filter/query parameters.
  alternates: { canonical: './' },
  title: {
    default: "Saha İlan | Emlak, Vasıta, Ürün, Hizmet ve İş İlanları",
    template: "%s | Saha İlan",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: './',
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

  const title = listing.title;

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
