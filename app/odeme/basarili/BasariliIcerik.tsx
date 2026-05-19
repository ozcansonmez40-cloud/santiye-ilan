'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function BasariliIcerik() {
  const searchParams = useSearchParams()
  const paket = searchParams.get('paket') ?? 'Standart İlan'

  return (
    <>
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-slate-800 mb-2">İlanınız Yayında!</h1>
      <p className="text-slate-500 text-sm mb-2">
        <span className="font-semibold text-slate-700">{paket}</span> paketiyle ilanınız başarıyla yayınlandı.
      </p>
      <p className="text-slate-400 text-xs mb-8">
        İlanınıza gelen başvurular ve iletişim taleplerini takip edebilirsiniz.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/ilanlar"
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-sm transition-colors"
        >
          İlanları Gör
        </Link>
        <Link
          href="/ilan-ver"
          className="px-6 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-sm transition-colors"
        >
          Yeni İlan Ver
        </Link>
      </div>
    </>
  )
}
