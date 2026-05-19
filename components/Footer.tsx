import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="max-w-xs">
            <p className="text-white font-bold text-lg">Saha İlan</p>
            <p className="text-sm mt-2 leading-relaxed">
              İnşaat, mimarlık ve saha personeli için Türkiye'nin ilan platformu.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 text-sm">
            <div className="flex flex-col gap-2">
              <p className="text-white font-semibold mb-1">Platform</p>
              <Link href="/ilanlar" className="hover:text-white transition-colors">İlanlar</Link>
              <Link href="/ilan-ver" className="hover:text-white transition-colors">İlan Ver</Link>
              <Link href="/giris" className="hover:text-white transition-colors">Giriş Yap</Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-white font-semibold mb-1">Yasal</p>
              <Link href="/kvkk" className="hover:text-white transition-colors">KVKK</Link>
              <Link href="/gizlilik" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
              <Link href="/kullanim-sartlari" className="hover:text-white transition-colors">Kullanım Şartları</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-700 text-xs text-center text-slate-500">
          © 2026 Saha İlan. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  )
}
