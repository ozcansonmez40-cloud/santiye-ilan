'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  type QueryConstraint,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/lib/firebase'
import { mockListings } from '@/lib/mockData'
import JobCard from '@/components/JobCard'
import FeaturedListing from '@/components/FeaturedListing'
import type { Listing } from '@/lib/types'
import { findCategory, matchesListingFilters } from '@/lib/classifieds'

type Props = {
  mode?: 'all' | 'featured' | 'latest'
  filterType?: string
  filterCategory?: string
  filterCity?: string
  filterPosition?: string
  filterQ?: string
  maxCount?: number
}

export default function ListingsGrid({
  mode = 'all',
  filterType,
  filterCategory,
  filterCity,
  filterPosition,
  filterQ,
  maxCount = 50,
}: Props) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const filters = { category: filterCategory, type: filterType, city: filterCity, position: filterPosition, q: filterQ }
    const finish = (items: Listing[]) => {
      const results = items.filter(item => matchesListingFilters(item, filters))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, maxCount)
      if (!cancelled) setListings(results)
    }
    async function fetchListings() {
      setLoading(true)
      setError('')
      if (!isFirebaseConfigured || !db) {
        const fallback = mockListings.filter((l) => l.status === 'active' && (mode !== 'featured' || l.isFeatured))
        finish(fallback)
        setLoading(false)
        return
      }

      try {
        const constraints: QueryConstraint[] = [
          where('status', '==', 'active'),
          limit(Math.max(50, maxCount)),
        ]

        if (mode === 'featured') constraints.push(where('isFeatured', '==', true))
        if (filterCity) constraints.push(where('city', '==', filterCity))
        if (filterType && filterType !== 'all') constraints.push(where('listingType', '==', filterType))
        else {
          const category = findCategory(filterCategory)
          if (category) constraints.push(category.types.length === 1 ? where('listingType', '==', category.types[0]) : where('listingType', 'in', category.types))
        }
        if (filterPosition) constraints.push(where('position', '==', filterPosition))

        const snap = await getDocs(query(collection(db, 'listings'), ...constraints))
        const results: Listing[] = snap.docs.map((doc) => ({
          ...(doc.data() as Omit<Listing, 'id'>),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
        }))

        finish(results)
      } catch (err) {
        console.error('Firestore fetch error:', err)
        if (!cancelled) { setListings([]); setError('İlanlar şu anda yüklenemedi. Lütfen sayfayı yenileyerek tekrar deneyin.') }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchListings()
    return () => { cancelled = true }
  }, [mode, filterType, filterCategory, filterCity, filterPosition, filterQ, maxCount])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  if (error) return <p role="alert" className="text-center py-10 text-sm text-red-600">{error}</p>

  if (listings.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔍</p>
        <h2 className="text-lg font-semibold text-slate-700 mb-2">İlan bulunamadı</h2>
        <p className="text-sm text-slate-400">Farklı filtreler deneyin veya tüm ilanları listeleyin.</p>
      </div>
    )
  }

  if (mode === 'featured') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((l) => (
          <FeaturedListing key={l.id} listing={l} />
        ))}
      </div>
    )
  }

  return (
    <>
      <p className="text-sm text-slate-500 mb-4">
        <span className="font-medium text-slate-700">{listings.length}</span> ilan listeleniyor
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((l) => (
          <JobCard key={l.id} listing={l} />
        ))}
      </div>
    </>
  )
}
