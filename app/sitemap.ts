import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://santiye-ilan.vercel.app'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/ilanlar`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/ilan-ver`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/giris`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/kvkk`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/gizlilik`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/kullanim-sartlari`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]
}
