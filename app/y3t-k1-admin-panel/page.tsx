'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth, isFirebaseConfigured } from '@/lib/firebase'
import { LISTING_TYPE_LABELS } from '@/lib/constants'
import type { Listing } from '@/lib/types'

const ADMIN_EMAIL = 'ozcansonmez40@gmail.com'

export default function AdminPage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) { router.replace('/giris'); return }
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user || user.email !== ADMIN_EMAIL || !user.emailVerified) {
        router.replace('/')
        return
      }
      const tokenResult = await user.getIdTokenResult()
      if (!tokenResult.claims.admin) {
        const idToken = await user.getIdToken()
        await fetch('/api/set-admin-claim', {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` },
        })
        await user.getIdToken(true)
      }
      setAuthed(true)
    })
    return () => unsub()
  }, [router])

  useEffect(() => {
    if (!authed) return
    async function fetchListings() {
      if (!isFirebaseConfigured || !db) return
      const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Listing))
      setListings(data)
      setLoading(false)
    }
    fetchListings()
  }, [authed])

  if (!authed) return null

  async function handleDelete(id: string) {
    if (!db || !confirm('Bu ilanı silmek istediğinden emin misin?')) return
    setDeletingId(id)
    await deleteDoc(doc(db, 'listings', id))
    await deleteDoc(doc(db, 'listing_contacts', id)).catch(() => {})
    setListings(prev => prev.filter(l => l.id !== id))
    setDeletingId(null)
  }

  const activeCount = listings.filter(l => l.status === 'active').length
  const expiredCount = listings.filter(l => l.status === 'expired').length

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    pending_payment: 'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-600',
    draft: 'bg-slate-100 text-slate-500',
    expired: 'bg-slate-100 text-slate-400',
  }

  const statusLabels: Record<string, string> = {
    active: 'Yayında',
    pending_payment: 'Bekliyor',
    rejected: 'Reddedildi',
    draft: 'Taslak',
    expired: 'Pasif',
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-amber-400 font-bold text-lg">Saha İlan</p>
          <p className="text-slate-400 text-xs">Admin Paneli</p>
        </div>
        <span className="text-xs bg-emerald-500 text-white font-semibold px-3 py-1 rounded-full">
          Firebase Bağlı
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Toplam İlan" value={listings.length} />
          <StatCard label="Yayında" value={activeCount} accent="green" />
          <StatCard label="Pasif" value={expiredCount} />
          <StatCard label="Diğer" value={listings.length - activeCount - expiredCount} accent="amber" />
        </div>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 text-sm">
              Tüm İlanlar ({listings.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Yükleniyor...</div>
          ) : listings.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">Henüz ilan yok.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Başlık', 'Tür', 'Şehir', 'Pozisyon', 'Durum', 'Tarih', 'İşlem'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {listings.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <a
                          href={`/ilanlar/${l.slug}`}
                          target="_blank"
                          className="font-medium text-slate-700 hover:text-amber-600 line-clamp-1 max-w-[200px] block"
                        >
                          {l.title}
                        </a>
                        {l.companyName && (
                          <p className="text-xs text-slate-400">{l.companyName}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{LISTING_TYPE_LABELS[l.listingType]}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{l.city}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{l.position}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[l.status] ?? 'bg-slate-100 text-slate-500'}`}>
                          {statusLabels[l.status] ?? l.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(l.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(l.id)}
                          disabled={deletingId === l.id}
                          className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-2 py-1 rounded font-medium transition-colors disabled:opacity-50"
                        >
                          {deletingId === l.id ? '...' : 'Sil'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }: {
  label: string
  value: number
  accent?: 'amber' | 'green'
}) {
  const colors = { amber: 'text-amber-600', green: 'text-emerald-600' }
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
      <p className={`text-2xl font-bold ${accent ? colors[accent] : 'text-slate-800'}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  )
}
