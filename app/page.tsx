import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { defaultMetadata } from '@/lib/seo'
import { POPULAR_CITIES } from '@/lib/constants'
import StatsStrip from '@/components/StatsStrip'
import CityChips from '@/components/CityChips'
import FilterBar from '@/components/FilterBar'
import ListingsGrid from '@/components/ListingsGrid'
import CategoryNav from '@/components/CategoryNav'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Saha İlan | Emlak, Vasıta, Ürün, Hizmet ve İş İlanları',
  description:
    'Satılık ve kiralık emlak, araçlar, ikinci el ürünler, hizmetler ve iş ilanları. Saha İlan’da aradığınızı bulun, ücretsiz ilan verin.',
}

const STATS = [
  { value: '5', label: 'Ana Kategori' },
  { value: '81', label: 'İl' },
  { value: 'Ücretsiz', label: 'İlan Yayınlama' },
  { value: 'Doğrudan', label: 'İletişim' },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── Hero ──────────────────────────────────────────── */}
      <section className="bg-slate-900 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Aradığın ilan,{' '}
            <span className="text-amber-400">her alanda</span> burada.
          </h1>
          <p className="mt-5 text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Emlak, vasıta, ürün, hizmet ve iş ilanları tek yerde.
            İhtiyacınızı bulun, ilanınızı ücretsiz yayınlayın, doğrudan iletişime geçin.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/ilanlar"
              className="px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-colors text-sm"
            >
              İlanlara Bak
            </Link>
            <Link
              href="/ilan-ver"
              className="px-7 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors text-sm border border-slate-600"
            >
              Ücretsiz İlan Ver
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Quick filter ──────────────────────────────────── */}
      <section className="bg-slate-800 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <Suspense fallback={<div className="h-24 animate-pulse bg-slate-700 rounded-xl" />}>
            <FilterBar />
          </Suspense>
        </div>
      </section>

      <CategoryNav />

      {/* ─── Stats ─────────────────────────────────────────── */}
      <StatsStrip stats={STATS} />

      {/* ─── Featured listings ─────────────────────────────── */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader title="Öne Çıkan İlanlar" href="/ilanlar" linkLabel="Tümünü Gör" />
          <div className="mt-6">
            <ListingsGrid mode="featured" maxCount={4} />
          </div>
        </div>
      </section>

      {/* ─── Latest listings ───────────────────────────────── */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader title="Son İlanlar" href="/ilanlar" linkLabel="Tüm İlanları Gör" />
          <div className="mt-6">
            <ListingsGrid mode="latest" maxCount={4} />
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/ilanlar"
              className="inline-block px-6 py-3 border border-slate-300 hover:border-amber-400 hover:text-amber-600 text-slate-600 font-medium rounded-xl text-sm transition-colors"
            >
              Tüm İlanları Gör →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Popular cities ────────────────────────────────── */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader title="Popüler Şehirler" />
          <div className="mt-6">
            <CityChips cities={POPULAR_CITIES} />
          </div>
        </div>
      </section>

      {/* ─── How it works ──────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">Nasıl Çalışır?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 text-xl font-bold flex items-center justify-center mb-4">
                  {step.step}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/ilan-ver"
              className="inline-block px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-colors text-sm"
            >
              Ücretsiz İlan Ver
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA banner ────────────────────────────────────── */}
      <section className="bg-slate-900 py-14">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            İlanınız doğru kişiye ulaşsın.
          </h2>
          <p className="text-slate-300 text-sm mb-7">
            Satmak, kiralamak, hizmet sunmak veya iş fırsatı paylaşmak için bir ilan oluşturun.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/ilan-ver"
              className="px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-colors text-sm"
            >
              Ücretsiz İlan Ver
            </Link>
            <Link
              href="/ilanlar"
              className="px-7 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors text-sm border border-slate-600"
            >
              Tüm İlanları Keşfet
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function SectionHeader({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl md:text-2xl font-bold text-slate-800">{title}</h2>
      {href && linkLabel && (
        <Link href={href} className="text-sm font-medium text-amber-600 hover:text-amber-500 transition-colors">
          {linkLabel} →
        </Link>
      )}
    </div>
  )
}

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Kategorini Seç',
    desc: 'Emlak, vasıta, ürün, hizmet veya iş kategorisinden ihtiyacınıza uygun olanı seçin.',
  },
  {
    step: '2',
    title: 'İlanı Yayınla',
    desc: 'Formu doldurun, gönderin — ilanınız anında yayına çıkar. Ücretsiz ve hızlıdır.',
  },
  {
    step: '3',
    title: 'İletişim Kurulur',
    desc: 'İlgilenen kişiler ilan üzerinden sizinle doğrudan iletişime geçer.',
  },
]
