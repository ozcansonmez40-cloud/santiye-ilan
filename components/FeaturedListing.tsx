import Link from 'next/link'
import type { Listing } from '@/lib/types'
import { LISTING_TYPE_LABELS } from '@/lib/constants'

type Props = {
  listing: Listing
}

export default function FeaturedListing({ listing }: Props) {
  const typeColor =
    listing.listingType === 'employer'
      ? 'bg-blue-50 text-blue-700 border-blue-100'
      : 'bg-emerald-50 text-emerald-700 border-emerald-100'

  return (
    <Link
      href={`/ilanlar/${listing.slug}`}
      className="block bg-white rounded-xl border-2 border-amber-200 hover:border-amber-400 hover:shadow-lg transition-all p-5 relative group"
    >
      <div className="absolute -top-3 left-4">
        <span className="text-xs font-bold px-3 py-1 bg-amber-500 text-white rounded-full shadow-sm">
          ★ Öne Çıkan
        </span>
      </div>

      <div className="mt-2 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${typeColor}`}>
            {LISTING_TYPE_LABELS[listing.listingType]}
          </span>
          {listing.isUrgent && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
              Acil
            </span>
          )}
        </div>

        <h2 className="font-bold text-slate-800 text-base leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
          {listing.title}
        </h2>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">
          <span>📍 {listing.city} / {listing.district}</span>
          <span>💼 {listing.position}</span>
        </div>

        {listing.salaryText && (
          <p className="text-sm text-slate-500">{listing.salaryText}</p>
        )}

        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {listing.description}
        </p>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>{listing.companyName ?? listing.contactName}</span>
        <span>{listing.viewCount} görüntülenme</span>
      </div>
    </Link>
  )
}
