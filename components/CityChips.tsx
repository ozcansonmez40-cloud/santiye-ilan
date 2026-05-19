'use client'

import { useRouter } from 'next/navigation'

type Props = {
  cities: string[]
}

export default function CityChips({ cities }: Props) {
  const router = useRouter()

  return (
    <div className="flex flex-wrap gap-2">
      {cities.map((city) => (
        <button
          key={city}
          onClick={() => router.push(`/ilanlar?city=${encodeURIComponent(city)}`)}
          className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:border-amber-400 hover:text-amber-600 transition-colors shadow-sm cursor-pointer"
        >
          {city}
        </button>
      ))}
    </div>
  )
}
