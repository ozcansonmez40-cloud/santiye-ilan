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

type Props = {
  mode?: 'all' | 'featured' | 'latest'
  filterType?: string
  filterCity?: string
  filterPosition?: string
  filterQ?: string
  maxCount?: number
}

export default function ListingsGrid({
  mode = 'all',
  filterType,
  filterCity,
  filterPosition,
  filterQ,
  maxCount = 50,
}: Props) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListings() {
      if (!isFirebaseConfigured || !db) {
        const fallback = mockListings.filter((l) => l.status === 'approved')
        setListings(fallback)
        setLoading(false)
        return
      }

      try {
        const constraints: QueryConstraint[] = [
          where('status', '==', 'active'),
          limit(maxCount),
        ]

        if (mode === 'featured') constraints.push(where('isFeatured', '==', true))
        if (filterCity) constraints.push(where('city', '==', filterCity))
        if (filterType && filterType !== 'all') constraints.push(where('listingType', '==', filterType))
        if (filterPosition) constraints.push(where('position', '==', filterPosition))

        const snap = await getDocs(query(collection(db, 'listings'), ...constraints))
        let results: Listing[] = snap.docs.map((doc) => ({
          ...(doc.data() as Omit<Listing, 'id'>),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
        }))

        if (filterQ) {
          const term = filterQ.toLowerCase()
          results = results.filter(
            (l) =>
              l.title.toLowerCase().includes(term) ||
              l.description.toLowerCase().includes(term) ||
              l.city.toLowerCase().includes(term) ||
              l.position.toLowerCase().includes(term)
          )
        }

        if (mode === 'latest') results = results.slice(0, maxCount)

        setListings(results)
      } catch (err) {
        console.error('Firestore fetch error:', err)
        setListings([])
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [mode, filterType, filterCity, filterPosition, filterQ, maxCount])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

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
