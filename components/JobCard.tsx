import Link from 'next/link'
import type { Listing } from '@/lib/types'
import { LISTING_TYPE_LABELS, WORK_TYPE_LABELS } from '@/lib/constants'

type Props = {
  listing: Listing
}

export default function JobCard({ listing }: Props) {
  const typeColor =
    listing.listingType === 'employer'
      ? 'bg-blue-50 text-blue-700 border-blue-100'
      : 'bg-emerald-50 text-emerald-700 border-emerald-100'

  return (
    <Link
      href={`/ilanlar/${listing.slug}`}
      className="block bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all p-5 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2.5">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${typeColor}`}>
              {LISTING_TYPE_LABELS[listing.listingType]}
            </span>
            {listing.isUrgent && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                Acil
              </span>
            )}
            {listing.isFeatured && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                Öne Çıkan
              </span>
            )}
          </div>

          <h2 className="font-semibold text-slate-800 text-base leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
            {listing.title}
          </h2>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
            <span>📍 {listing.city} / {listing.district}</span>
            <span>💼 {listing.position}</span>
            {listing.workType && (
              <span>{WORK_TYPE_LABELS[listing.workType]}</span>
            )}
          </div>

          {listing.salaryText && (
            <p className="mt-1.5 text-sm text-slate-500">{listing.salaryText}</p>
          )}

          {listing.companyName && (
            <p className="mt-1 text-sm font-medium text-slate-600">{listing.companyName}</p>
          )}
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>
          {new Date(listing.createdAt).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
        <span>{listing.viewCount} görüntülenme</span>
      </div>
    </Link>
  )
}
