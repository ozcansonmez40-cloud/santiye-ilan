'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { db, auth, isFirebaseConfigured } from '@/lib/firebase'
import { LISTING_TYPE_LABELS } from '@/lib/constants'
import type { Listing } from '@/lib/types'

export default function IlanımPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null | 'loading'>('loading')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) { setUser(null); return }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      if (!u) router.replace('/giris')
    })
    return () => unsub()
  }, [router])

  useEffect(() => {
    if (!user || user === 'loading') return
    fetchMyListings(user.uid)
  }, [user])

  async function fetchMyListings(uid: string) {
    if (!db) return
    setLoading(true)
    try {
      const snap = await getDocs(
        query(collection(db, 'listings'), where('userId', '==', uid))
      )
      const results: Listing[] = snap.docs.map((d) => ({
        ...(d.data() as Omit<Listing, 'id'>),
        id: d.id,
        createdAt: d.data().createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
        updatedAt: d.data().updatedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      }))
      setListings(results)
    } catch {
      setListings([])
    } finally {
      setLoading(false)
    }
  }

  async function handleDeactivate(id: string) {
    if (!db) return
    setActionId(id)
    try {
      await updateDoc(doc(db, 'listings', id), {
        status: 'expired',
        updatedAt: serverTimestamp(),
      })
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: 'expired' } : l))
    } finally {
      setActionId(null)
    }
  }

  async function handleDelete(id: string) {
    if (!db || !confirm('Bu ilanı kalıcı olarak silmek istediğinize emin misiniz?')) return
    setActionId(id)
    try {
      await deleteDoc(doc(db, 'listings', id))
      setListings((prev) => prev.filter((l) => l.id !== id))
    } finally {
      setActionId(null)
    }
  }

  async function handleActivate(id: string) {
    if (!db) return
    setActionId(id)
    try {
      await updateDoc(doc(db, 'listings', id), {
        status: 'active',
        updatedAt: serverTimestamp(),
      })
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: 'active' } : l))
    } finally {
      setActionId(null)
    }
  }

  if (user === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">İlanlarım</h1>
          <Link
            href="/ilan-ver"
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            + Yeni İlan Ver
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-4xl mb-4">📋</p>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">Henüz ilanınız yok</h2>
            <p className="text-sm text-slate-400 mb-5">İlk ilanınızı ücretsiz verin.</p>
            <Link
              href="/ilan-ver"
              className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              İlan Ver
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {LISTING_TYPE_LABELS[listing.listingType]}
                      </span>
                      <StatusBadge status={listing.status} />
                    </div>
                    <h2 className="font-bold text-slate-800 truncate">{listing.title}</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {listing.city}{listing.district ? ` / ${listing.district}` : ''} · {listing.position}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(listing.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    {listing.status === 'active' && (
                      <Link
                        href={`/ilanlar/${listing.slug}`}
                        target="_blank"
                        className="text-xs text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Görüntüle
                      </Link>
                    )}
                    {listing.status === 'active' && (
                      <button
                        onClick={() => handleDeactivate(listing.id)}
                        disabled={actionId === listing.id}
                        className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Pasife Al
                      </button>
                    )}
                    {listing.status === 'expired' && (
                      <button
                        onClick={() => handleActivate(listing.id)}
                        disabled={actionId === listing.id}
                        className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Aktife Al
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(listing.id)}
                      disabled={actionId === listing.id}
                      className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    active: { label: 'Yayında', cls: 'bg-emerald-100 text-emerald-700' },
    pending_payment: { label: 'Ödeme Bekliyor', cls: 'bg-amber-100 text-amber-700' },
    expired: { label: 'Pasif', cls: 'bg-slate-100 text-slate-500' },
    draft: { label: 'Taslak', cls: 'bg-slate-100 text-slate-500' },
    rejected: { label: 'Reddedildi', cls: 'bg-red-100 text-red-600' },
  }
  const s = map[status] ?? { label: status, cls: 'bg-slate-100 text-slate-500' }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  )
}
