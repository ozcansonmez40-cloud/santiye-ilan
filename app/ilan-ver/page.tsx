import type { Metadata } from 'next'
import ListingForm from '@/components/ListingForm'

export const metadata: Metadata = {
  title: 'İlan Ver | Saha İlan',
  description: 'Emlak, vasıta, ürün, hizmet veya iş ilanınızı ücretsiz yayınlayın. Kategorinizi seçin, ilan bilgilerinizi paylaşın.',
}

export default async function IlanVerPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">İlan Ver</h1>
          <p className="mt-2 text-slate-500 text-sm">
            Kategorinizi seçin, ilanınızı hazırlayın ve ücretsiz yayınlayın.
          </p>
        </div>

        <ListingForm initialCategory={category} />
      </div>
    </div>
  )
}
