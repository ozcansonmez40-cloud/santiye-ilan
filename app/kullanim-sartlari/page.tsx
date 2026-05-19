import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kullanım Şartları | Saha İlan',
}

export default function KullanimSartlariPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Kullanım Şartları</h1>
          <p className="text-sm text-slate-400 mb-8">Son güncelleme: Mayıs 2026</p>

          <Section title="1. Kabul">
            <p>Saha İlan platformunu kullanarak bu kullanım şartlarını kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız platformu kullanmayınız.</p>
          </Section>

          <Section title="2. Hizmet Tanımı">
            <p>Saha İlan, inşaat sektöründe iş arayan profesyoneller ile eleman arayan firma ve müteahhitleri bir araya getiren bir ilan platformudur. Platform, taraflar arasındaki iletişime aracılık eder; iş akdi kurulmasına taraf değildir.</p>
          </Section>

          <Section title="3. İlan Kuralları">
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>İlanlar gerçek ve doğru bilgi içermelidir.</li>
              <li>Yanıltıcı, sahte veya dolandırıcılık amaçlı ilanlar kesinlikle yasaktır.</li>
              <li>İnşaat ve saha işleriyle ilgisi olmayan ilanlar yayınlanamaz.</li>
              <li>Kişisel hakaret veya ayrımcılık içeren ilanlar kaldırılır.</li>
            </ul>
          </Section>

          <Section title="4. Kullanıcı Sorumluluğu">
            <p>İlan içeriklerinin doğruluğundan ve yasal uygunluğundan ilan veren kullanıcı sorumludur. Saha İlan, kullanıcılar arasındaki anlaşmazlıklarda taraf olmaz.</p>
          </Section>

          <Section title="5. Ödeme">
            <p>Standart ilanlar ücretsizdir. Öne Çıkan ve Acil ilan paketleri ücretlidir. Ödemeler iade edilmez; ancak teknik bir sorun nedeniyle ilan yayınlanamadıysa destek talebinde bulunabilirsiniz.</p>
          </Section>

          <Section title="6. İlan Süresi">
            <p>İlanlar yayınlandıktan itibaren 30 gün aktif kalır. Süre dolduğunda ilan otomatik olarak pasife alınır.</p>
          </Section>

          <Section title="7. Platformun Hakları">
            <p>Saha İlan, kurallara aykırı ilanları önceden bildirim yapmaksızın kaldırma hakkını saklı tutar. Kötüye kullanım halinde hesap askıya alınabilir.</p>
          </Section>

          <Section title="8. İletişim">
            <p>Sorularınız için: <strong>ozcansonmez.arc@gmail.com</strong></p>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-bold text-slate-700 mb-2">{title}</h2>
      <div className="text-sm text-slate-600 leading-relaxed">{children}</div>
    </div>
  )
}
