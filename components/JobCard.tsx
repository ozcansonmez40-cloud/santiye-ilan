import Link from 'next/link'
import type { Listing } from '@/lib/types'
import { LISTING_TYPE_LABELS } from '@/lib/constants'

type Props = {
  listing: Listing
}

const WORK_TYPE_STYLES: Record<string, string> = {
  full_time: 'bg-blue-100 text-blue-700',
  part_time: 'bg-orange-100 text-orange-700',
  project_based: 'bg-purple-100 text-purple-700',
  temporary: 'bg-slate-100 text-slate-600',
}

const WORK_TYPE_LABELS: Record<string, string> = {
  full_time: 'Tam Zamanlı',
  part_time: 'Yarı Zamanlı',
  project_based: 'Proje Bazlı',
  temporary: 'Geçici',
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
      {listing.listingType === 'employer' && listing.companyName && (
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
          {listing.companyName}
        </p>
      )}

      <h2 className="font-bold text-slate-800 text-base leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors mb-2">
        {listing.title}
      </h2>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${typeColor}`}>
          {LISTING_TYPE_LABELS[listing.listingType]}
        </span>
        {listing.workType && WORK_TYPE_LABELS[listing.workType] && (
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${WORK_TYPE_STYLES[listing.workType] ?? 'bg-slate-100 text-slate-600'}`}>
            {WORK_TYPE_LABELS[listing.workType]}
          </span>
        )}
        {listing.isUrgent && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-600">
            Acil
          </span>
        )}
        {listing.isFeatured && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
            ★ Öne Çıkan
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
        <span>📍 {listing.city}{listing.district ? ` / ${listing.district}` : ''}</span>
        <span>💼 {listing.position}</span>
      </div>

      {listing.salaryText && (
        <p className="mt-1.5 text-sm text-slate-500">{listing.salaryText}</p>
      )}

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
