import type { Metadata } from 'next'
import { Suspense } from 'react'
import FilterBar from '@/components/FilterBar'
import ListingsGrid from '@/components/ListingsGrid'

export const metadata: Metadata = {
  title: 'Saha İlanları | Saha İlan',
  description:
    'Şantiye şefi, inşaat mühendisi, mimar ve saha personeli ilanları. Şehir ve pozisyona göre filtreleyin.',
}

type PageProps = {
  searchParams: Promise<{ type?: string; city?: string; position?: string; q?: string }>
}

export default async function IlanlarPage({ searchParams }: PageProps) {
  const { type, city, position, q } = await searchParams

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-5">
            Saha İlanları
          </h1>
          <Suspense fallback={<div className="h-24 animate-pulse bg-slate-700 rounded-xl" />}>
            <FilterBar />
          </Suspense>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-xl" />)}
          </div>
        }>
          <ListingsGrid
            mode="all"
            filterType={type}
            filterCity={city}
            filterPosition={position}
            filterQ={q}
          />
        </Suspense>
      </div>
    </div>
  )
}
