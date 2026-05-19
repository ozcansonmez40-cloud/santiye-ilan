import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni | Şantiye İlan',
}

export default function KvkkPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">KVKK Aydınlatma Metni</h1>
          <p className="text-sm text-slate-400 mb-8">Son güncelleme: Mayıs 2026</p>

          <Section title="1. Veri Sorumlusu">
            <p>Şantiye İlan olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla kişisel verilerinizi işlemekteyiz.</p>
          </Section>

          <Section title="2. İşlenen Kişisel Veriler">
            <p>Platformumuzu kullandığınızda aşağıdaki veriler işlenebilir:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Ad, soyad, e-posta adresi</li>
              <li>Telefon numarası</li>
              <li>İlan içerikleri (şehir, pozisyon, açıklama vb.)</li>
              <li>IP adresi ve tarayıcı bilgileri</li>
            </ul>
          </Section>

          <Section title="3. Kişisel Verilerin İşlenme Amaçları">
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>İlan oluşturma ve yönetme hizmetinin sunulması</li>
              <li>Kullanıcı hesabının oluşturulması ve yönetilmesi</li>
              <li>Platform güvenliğinin sağlanması</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            </ul>
          </Section>

          <Section title="4. Kişisel Verilerin Aktarılması">
            <p>Kişisel verileriniz; Firebase (Google LLC) altyapısı üzerinde saklanmakta olup yurt dışına aktarım KVKK'nın 9. maddesi kapsamında gerçekleştirilmektedir. Verileriniz üçüncü taraf reklam şirketleriyle paylaşılmamaktadır.</p>
          </Section>

          <Section title="5. Kişisel Veri Sahibinin Hakları">
            <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>Verilerin silinmesini veya yok edilmesini isteme</li>
              <li>İşlemenin kısıtlanmasını talep etme</li>
            </ul>
          </Section>

          <Section title="6. İletişim">
            <p>Haklarınızı kullanmak için <strong>ozcansonmez.arc@gmail.com</strong> adresine e-posta gönderebilirsiniz.</p>
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
