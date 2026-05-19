import type { Metadata } from 'next'
import ListingForm from '@/components/ListingForm'

export const metadata: Metadata = {
  title: 'İlan Ver | Şantiye İlan',
  description: 'Şantiye şefi, inşaat mühendisi veya saha personeli ilanı verin. Hızlı ve kolaydır.',
}

export default function IlanVerPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">İlan Ver</h1>
          <p className="mt-2 text-slate-500 text-sm">
            Formu doldurun, paketinizi seçin — ilanınız anında yayına çıksın.
          </p>
        </div>

        <ListingForm />
      </div>
    </div>
  )
}
