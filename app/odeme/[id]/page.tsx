'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth, isFirebaseConfigured } from '@/lib/firebase'

const PACKAGES = [
  {
    id: 'standard',
    name: 'Standart İlan',
    price: 0,
    priceLabel: 'Ücretsiz',
    duration: '30 gün',
    features: ['İlan listesinde görünür', '30 gün aktif', 'Telefon ile iletişim'],
    highlight: false,
    comingSoon: false,
  },
  {
    id: 'urgent',
    name: 'Acil İlan',
    price: 299,
    priceLabel: '₺299',
    duration: '30 gün',
    features: ['Arama sonuçlarında üst sıra', '"Acil" rozeti', '30 gün aktif', 'Daha fazla görüntülenme'],
    highlight: false,
    comingSoon: true,
  },
  {
    id: 'featured',
    name: 'Öne Çıkan İlan',
    price: 499,
    priceLabel: '₺499',
    duration: '30 gün',
    features: ['Ana sayfada gösterim', 'Arama sonuçlarında üst sıra', '"Öne Çıkan" rozeti', '30 gün aktif', 'En fazla görüntülenme'],
    highlight: true,
    comingSoon: true,
  },
]

export default function OdemePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [selected, setSelected] = useState('standard')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authReady, setAuthReady] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) { setAuthReady(true); return }
    const unsub = onAuthStateChanged(auth, (u) => {
      setAuthed(!!u)
      setAuthReady(true)
      if (!u) router.replace('/giris')
    })
    return () => unsub()
  }, [router])

  async function handlePayment() {
    if (!isFirebaseConfigured || !db) return
    setLoading(true)
    setError('')

    const pkg = PACKAGES.find(p => p.id === selected)!

    try {
      await updateDoc(doc(db, 'listings', id), {
        status: 'active',
        isFeatured: selected === 'featured',
        isUrgent: selected === 'urgent',
        updatedAt: serverTimestamp(),
      })

      // Gerçek ödeme entegrasyonu burada olacak (iyzico/PayTR)
      // Şimdilik direkt başarı sayfasına yönlendiriyoruz
      router.push(`/odeme/basarili?paket=${pkg.name}`)
    } catch {
      setError('Bir hata oluştu. Tekrar deneyin.')
      setLoading(false)
    }
  }

  const selectedPkg = PACKAGES.find(p => p.id === selected)!

  if (!authReady) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" /></div>
  }

  if (!authed) return null

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">İlan Paketi Seçin</h1>
          <p className="mt-2 text-slate-500 text-sm">
            İlanınız kaydedildi. Paketinizi seçin, ödemeyi tamamlayın — ilanınız anında yayınlanır.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => !pkg.comingSoon && setSelected(pkg.id)}
              disabled={pkg.comingSoon}
              className={`relative text-left rounded-2xl border-2 p-5 transition-all ${
                pkg.comingSoon
                  ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                  : selected === pkg.id
                  ? 'border-amber-500 bg-amber-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {pkg.comingSoon && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Yakında
                </span>
              )}
              {!pkg.comingSoon && pkg.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">
                  En Popüler
                </span>
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-slate-800">{pkg.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{pkg.duration}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  selected === pkg.id ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                }`}>
                  {selected === pkg.id && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-3">{pkg.priceLabel}</p>
              <ul className="space-y-1.5">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                    <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-600 text-sm">Seçilen paket:</span>
            <span className="font-bold text-slate-800">{selectedPkg.name}</span>
          </div>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <span className="text-slate-600 text-sm">Toplam:</span>
            <span className="text-xl font-bold text-slate-900">
              {selectedPkg.price === 0 ? 'Ücretsiz' : `₺${selectedPkg.price}`}
            </span>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? 'İşleniyor...'
              : selectedPkg.price === 0
              ? 'Ücretsiz Yayınla'
              : `₺${selectedPkg.price} Öde ve Yayınla`}
          </button>

          {selectedPkg.price > 0 && (
            <p className="text-center text-xs text-slate-400 mt-3">
              Güvenli ödeme · iyzico / PayTR entegrasyonu yakında aktif olacak
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
