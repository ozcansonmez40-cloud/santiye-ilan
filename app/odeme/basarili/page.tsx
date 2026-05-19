import Link from 'next/link'
import { Suspense } from 'react'
import BasariliIcerik from './BasariliIcerik'

export default function BasariliPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md text-center">
        <Suspense>
          <BasariliIcerik />
        </Suspense>
      </div>
    </div>
  )
}
