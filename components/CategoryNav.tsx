import Link from 'next/link'
import { CATEGORIES } from '@/lib/classifieds'
import CategoryIcon from './CategoryIcon'

export default function CategoryNav() {
  return (
    <section id="kategoriler" className="py-12 bg-white scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">Ne arıyorsunuz?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map(category => <Link key={category.id} href={`/ilanlar?category=${category.id}`} className="rounded-2xl border border-slate-200 p-5 hover:border-amber-400 hover:bg-amber-50 transition-colors group">
            <span className="w-12 h-12 flex items-center justify-center rounded-xl bg-amber-100 text-amber-700 mb-4"><CategoryIcon category={category.id} /></span>
            <h3 className="font-bold text-slate-800 group-hover:text-amber-700">{category.label}</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{category.description}</p>
          </Link>)}
        </div>
      </div>
    </section>
  )
}
