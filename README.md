# Saha İlan

**Emlak, vasıta, ürün, hizmet ve iş ilanları için Türkiye'nin ilan platformu.**

Satılık/kiralık emlak ve vasıta, ürün/ikinci el, hizmet veren/arayan ve iş/eleman ilanları yayınlanabilir. Kategori, ilan türü, şehir, alt kategori/meslek ve anahtar kelimeye göre filtrelenir.

Kategori tanımları `lib/classifieds.ts`, form doğrulaması ve kayıt dönüşümü `lib/listing-draft.ts` içindedir. Eski `employer` ve `worker` kayıtları İş / Eleman kategorisine aittir; veri göçü gerekmez. Diğer kategoriler ayrı `listingType` değerleri kullanır. Mevcut Firestore alanları korunur: `position` alt kategori/meslek, `salaryText` fiyat/ücret bilgisini taşır. Telefon/e-posta yalnızca `listing_contacts` koleksiyonunda tutulur. Veritabanı erişim kuralları genişletilmez.

`npm run test:classifieds` kategori eşlemesini, kayıt doğrulamasını, filtreleri ve iletişim bilgilerinin ayrı tutulmasını kontrol eder. Yeni ikonun ana dosyası `public/saha-ilan-icon-master.png`; boyutları yeniden üretmek için `node scripts/prepare-brand-icons.mjs` çalıştırılır.

---

## Tech Stack

| Katman        | Teknoloji                              |
|---------------|----------------------------------------|
| Web frontend  | Next.js 16 (App Router) + Tailwind CSS v4 |
| Backend       | Firebase (Auth, Firestore, Storage, Analytics) |
| Deployment    | Vercel                                 |
| Mobile (plan) | Flutter — aynı Firebase projesi        |
| Ödeme (plan)  | PayTR / iyzico via Cloud Functions     |

---

## Yerel Geliştirme

```bash
npm install
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

### Ortam Değişkenleri

Firebase bağlantısı için `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Ortam değişkenleri eksikse uygulama mock veriyle çalışmaya devam eder.

---

## Proje Yapısı

```
app/
  page.tsx                  — Ana sayfa
  ilanlar/page.tsx          — İlan listesi (filtrelenebilir)
  ilanlar/[slug]/page.tsx   — İlan detay sayfası
  ilan-ver/page.tsx         — İlan verme formu
  giris/page.tsx            — Giriş sayfası
  admin/page.tsx            — Admin paneli

components/
  Header.tsx                — Navigasyon
  Footer.tsx                — Alt bilgi
  JobCard.tsx               — İlan kartı
  FilterBar.tsx             — Filtre çubuğu (client)
  CityChips.tsx             — Şehir hızlı filtre (client)
  FeaturedListing.tsx       — Öne çıkan ilan kartı
  StatsStrip.tsx            — İstatistik şeridi
  ListingForm.tsx           — İlan verme formu (client)

lib/
  types.ts                  — TypeScript tipleri (Flutter ile paylaşılan veri modeli)
  constants.ts              — Sabit veriler (şehirler, pozisyonlar, etiketler)
  mockData.ts               — Geliştirme için mock ilanlar / kullanıcılar / ödemeler
  firebase.ts               — Firebase bağlantısı (yapılandırma eksikse devre dışı)
  seo.ts                    — SEO metadata yardımcıları
```

---

## Planlanan Firebase Koleksiyonları

| Koleksiyon       | İçerik                                           |
|------------------|--------------------------------------------------|
| `users`          | Kullanıcı profilleri (rol, e-posta, şehir)       |
| `listings`       | İlanlar (tüm alanlar `types.ts` içinde tanımlı)  |
| `payments`       | Ödeme kayıtları (PayTR / iyzico / manuel)        |
| `analyticsEvents`| Görüntülenme, iletişim tıklaması, ödeme olayları |

---

## Flutter Uygulama Stratejisi

Flutter uygulaması aynı Firebase projesini kullanacak:

- **Auth:** `firebase_auth` paketi ile aynı kullanıcılar
- **Firestore:** `cloud_firestore` paketi, aynı koleksiyonlar ve alan adları
- **Storage:** `firebase_storage` paketi, aynı dosya yolları
- **Analytics:** `firebase_analytics` paketi, aynı olay yapısı

`lib/types.ts` içindeki TypeScript tipleri, Flutter veri sınıfları için referans model görevi görür. Alan adları ve tipler bire bir eşleştirilmelidir.

---

## Ödeme Stratejisi

PayTR veya iyzico entegrasyonu Firebase Cloud Functions üzerinden yapılacak:

1. Kullanıcı ödeme başlatır → web/Flutter ödeme sayfasına yönlendirir
2. Ödeme sağlayıcı webhook'u Cloud Function'a çağrı yapar
3. Cloud Function, `payments` koleksiyonuna kayıt ekler
4. `listings` koleksiyonundaki `isFeatured` veya `isUrgent` alanını günceller

Paket türleri: `featured` (₺499), `urgent` (₺299), `monthly_company` (₺999)

---

## URL Yapısı

```
/                             Ana sayfa
/ilanlar                      İlan listesi
/ilanlar/[slug]               İlan detayı
/ilan-ver                     İlan verme formu
/giris                        Giriş / kayıt
/admin                        Admin paneli (korumalı)
```
