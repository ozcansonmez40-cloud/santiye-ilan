'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { TURKISH_CITIES, POSITIONS, LISTING_TYPE_LABELS } from '@/lib/constants'

export default function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [listingType, setListingType] = useState(searchParams.get('type') ?? 'all')
  const [city, setCity] = useState(searchParams.get('city') ?? '')
  const [position, setPosition] = useState(searchParams.get('position') ?? '')
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  function apply() {
    const params = new URLSearchParams()
    if (listingType !== 'all') params.set('type', listingType)
    if (city) params.set('city', city)
    if (position) params.set('position', position)
    if (query.trim()) params.set('q', query.trim())
    router.push(`/ilanlar${params.size > 0 ? `?${params.toString()}` : ''}`)
  }

  function reset() {
    setListingType('all')
    setCity('')
    setPosition('')
    setQuery('')
    router.push('/ilanlar')
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <select
          value={listingType}
          onChange={(e) => setListingType(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
        >
          <option value="all">Tüm İlanlar</option>
          <option value="employer">{LISTING_TYPE_LABELS.employer}</option>
          <option value="worker">{LISTING_TYPE_LABELS.worker}</option>
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
        >
          <option value="">Tüm Şehirler</option>
          {TURKISH_CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
        >
          <option value="">Tüm Pozisyonlar</option>
          {POSITIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Anahtar kelime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && apply()}
          className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={apply}
          className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm py-2.5 rounded-lg transition-colors"
        >
          Filtrele
        </button>
        <button
          onClick={reset}
          className="px-4 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          Temizle
        </button>
      </div>
    </div>
  )
}
