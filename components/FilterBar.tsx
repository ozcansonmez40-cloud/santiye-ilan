'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { TURKISH_CITIES, POSITIONS } from '@/lib/constants'
import { CATEGORIES, TYPE_LABELS, findCategory } from '@/lib/classifieds'

const control = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white'

export default function FilterBar() {
  const router = useRouter()
  const params = useSearchParams()
  const [category, setCategory] = useState(params.get('category') ?? 'all')
  const [type, setType] = useState(params.get('type') ?? 'all')
  const [city, setCity] = useState(params.get('city') ?? '')
  const [detail, setDetail] = useState(params.get('position') ?? '')
  const [search, setSearch] = useState(params.get('q') ?? '')
  const definition = findCategory(category)
  const suggestions = definition ? (definition.id === 'is' ? POSITIONS : definition.suggestions) : [...new Set([...CATEGORIES.flatMap(item => item.suggestions), ...POSITIONS])]
  const types = definition ? definition.types : CATEGORIES.flatMap(item => item.types)

  function apply() {
    const query = new URLSearchParams()
    if (category !== 'all') query.set('category', category)
    if (type !== 'all') query.set('type', type)
    if (city) query.set('city', city)
    if (detail.trim()) query.set('position', detail.trim())
    if (search.trim()) query.set('q', search.trim())
    router.push(`/ilanlar${query.size ? '?' + query.toString() : ''}`)
  }

  function reset() {
    setCategory('all'); setType('all'); setCity(''); setDetail(''); setSearch('')
    router.push('/ilanlar')
  }

  return <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <select aria-label="Kategori" value={category} onChange={event => { setCategory(event.target.value); setType('all'); setDetail('') }} className={control}>
        <option value="all">Tüm Kategoriler</option>{CATEGORIES.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
      <select aria-label="İlan türü" value={type} onChange={event => setType(event.target.value)} className={control}>
        <option value="all">Tüm İlan Türleri</option>{types.map(item => <option key={item} value={item}>{definition ? TYPE_LABELS[item] : `${CATEGORIES.find(category => category.types.includes(item))!.label} · ${TYPE_LABELS[item]}`}</option>)}
      </select>
      <select aria-label="Şehir" value={city} onChange={event => setCity(event.target.value)} className={control}><option value="">Tüm Şehirler</option>{TURKISH_CITIES.map(city => <option key={city} value={city}>{city}</option>)}</select>
      <input aria-label="Anahtar kelime" type="search" placeholder="Ne arıyorsunuz?" value={search} onChange={event => setSearch(event.target.value)} onKeyDown={event => event.key === 'Enter' && apply()} className={control} />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 mt-3 items-center">
      <div><input aria-label="Alt kategori veya meslek" list="filter-detail-options" maxLength={100} value={detail} onChange={event => setDetail(event.target.value)} onKeyDown={event => event.key === 'Enter' && apply()} placeholder={definition ? `${definition.detailLabel} (isteğe bağlı)` : 'Alt kategori veya meslek (isteğe bağlı)'} className={control} />
        <datalist id="filter-detail-options">{suggestions.map(item => <option key={item} value={item} />)}</datalist>
      </div>
      <button onClick={apply} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm py-2.5 px-8 rounded-lg transition-colors">İlan Ara</button>
      <button onClick={reset} className="text-sm py-2 text-slate-500 hover:text-slate-700">Temizle</button>
    </div>
  </div>
}
