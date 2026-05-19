import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | Şantiye İlan',
}

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Gizlilik Politikası</h1>
          <p className="text-sm text-slate-400 mb-8">Son güncelleme: Mayıs 2026</p>

          <Section title="1. Genel Bakış">
            <p>Şantiye İlan olarak gizliliğinize saygı duyuyor ve kişisel verilerinizi korumayı taahhüt ediyoruz. Bu politika, hangi verileri topladığımızı, nasıl kullandığımızı ve koruduğumuzu açıklamaktadır.</p>
          </Section>

          <Section title="2. Topladığımız Bilgiler">
            <p><strong>Hesap bilgileri:</strong> E-posta, ad-soyad (Google ile girişte otomatik alınır).</p>
            <p className="mt-2"><strong>İlan bilgileri:</strong> Verdiğiniz ilanlardaki konum, pozisyon, iletişim bilgileri.</p>
            <p className="mt-2"><strong>Teknik veriler:</strong> IP adresi, tarayıcı türü, ziyaret edilen sayfalar.</p>
          </Section>

          <Section title="3. Çerezler">
            <p>Oturum yönetimi için zorunlu çerezler kullanılmaktadır. Bu çerezler olmadan giriş yapma ve ilan verme özellikleri çalışmaz. Reklam amaçlı çerez kullanılmamaktadır.</p>
          </Section>

          <Section title="4. Verilerinizin Güvenliği">
            <p>Verileriniz Firebase (Google Cloud) altyapısında şifreli olarak saklanmaktadır. Firestore güvenlik kuralları ile yetkisiz erişim engellenmektedir.</p>
          </Section>

          <Section title="5. Üçüncü Taraf Hizmetler">
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Firebase / Google:</strong> Kimlik doğrulama ve veritabanı</li>
              <li><strong>Vercel:</strong> Barındırma hizmeti</li>
            </ul>
          </Section>

          <Section title="6. Verilerinizin Silinmesi">
            <p>Hesabınızı ve verilerinizi silmek için <strong>ozcansonmez.arc@gmail.com</strong> adresine e-posta gönderebilirsiniz. Talepler 30 gün içinde sonuçlandırılır.</p>
          </Section>

          <Section title="7. İletişim">
            <p>Gizlilik politikamızla ilgili sorularınız için: <strong>ozcansonmez.arc@gmail.com</strong></p>
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
