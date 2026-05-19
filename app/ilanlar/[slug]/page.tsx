'use client'

import { useEffect, useState, use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { collection, query, where, limit, getDocs } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/lib/firebase'
import { LISTING_TYPE_LABELS, WORK_TYPE_LABELS } from '@/lib/constants'
import type { Listing } from '@/lib/types'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default function ListingDetailPage({ params }: PageProps) {
  const { slug } = use(params)
  const [listing, setListing] = useState<Listing | null | 'loading'>('loading')

  useEffect(() => {
    async function fetchListing() {
      if (!isFirebaseConfigured || !db) {
        setListing(null)
        return
      }
      try {
        const snap = await getDocs(
          query(collection(db, 'listings'), where('slug', '==', slug), limit(1))
        )
        if (snap.empty) {
          setListing(null)
          return
        }
        const doc = snap.docs[0]
        setListing({
          ...(doc.data() as Omit<Listing, 'id'>),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
        })
      } catch {
        setListing(null)
      }
    }
    fetchListing()
  }, [slug])

  if (listing === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!listing) return notFound()

  const typeColor =
    listing.listingType === 'employer'
      ? 'bg-blue-50 text-blue-700 border-blue-100'
      : 'bg-emerald-50 text-emerald-700 border-emerald-100'

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/ilanlar"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6"
        >
          ← İlanlara Dön
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-900 px-6 py-5">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${typeColor}`}>
                {LISTING_TYPE_LABELS[listing.listingType]}
              </span>
              {listing.isUrgent && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                  Acil
                </span>
              )}
              {listing.isFeatured && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                  ★ Öne Çıkan
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white leading-snug">
              {listing.title}
            </h1>
          </div>

          <div className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <InfoItem label="Şehir / İlçe" value={`${listing.city}${listing.district ? ' / ' + listing.district : ''}`} />
              <InfoItem label="Pozisyon" value={listing.position} />
              {listing.workType && (
                <InfoItem label="Çalışma Şekli" value={WORK_TYPE_LABELS[listing.workType]} />
              )}
              {listing.experienceYears && (
                <InfoItem label="Deneyim" value={`${listing.experienceYears}+ yıl`} />
              )}
              {listing.projectType && (
                <InfoItem label="Proje Türü" value={listing.projectType} />
              )}
              {listing.salaryText && (
                <InfoItem label="Ücret" value={listing.salaryText} />
              )}
              {listing.companyName && (
                <InfoItem label="Firma" value={listing.companyName} />
              )}
            </div>

            <hr className="border-slate-100" />

            <div>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Açıklama
              </h2>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            <hr className="border-slate-100" />

            <div>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                İletişim
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                {listing.contactPhone ? (
                  <a
                    href={`tel:${listing.contactPhone}`}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl text-sm transition-colors text-center"
                  >
                    📞 {listing.contactPhone}
                  </a>
                ) : (
                  <button className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl text-sm transition-colors">
                    📞 İletişim Bilgilerini Gör
                  </button>
                )}
                {listing.whatsappEnabled && listing.contactPhone && (
                  <a
                    href={`https://wa.me/90${listing.contactPhone.replace(/\D/g, '').replace(/^0/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl text-sm transition-colors text-center"
                  >
                    💬 WhatsApp ile Ulaş
                  </a>
                )}
              </div>
              {listing.contactName && (
                <p className="text-xs text-slate-400 mt-2 text-center">{listing.contactName}</p>
              )}
            </div>

            <hr className="border-slate-100" />
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Yayınlanma:{' '}
                {new Date(listing.createdAt).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span>{listing.viewCount} görüntülenme</span>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-xs text-slate-400">
          Uygunsuz ilan?{' '}
          <button className="underline hover:text-slate-600">Bildir</button>
        </p>
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-slate-700">{value}</p>
    </div>
  )
}
