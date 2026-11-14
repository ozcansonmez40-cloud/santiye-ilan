import type { Listing, ListingCategory, ListingType } from './types'

export type CategoryDefinition = {
  id: ListingCategory
  label: string
  description: string
  types: ListingType[]
  detailLabel: string
  suggestions: string[]
  titleExample: string
}

export const CATEGORIES: CategoryDefinition[] = [
  { id: 'emlak', label: 'Emlak', description: 'Ev, arsa ve işyeri', types: ['real_estate_sale', 'real_estate_rent'], detailLabel: 'Emlak türü', suggestions: ['Daire', 'Müstakil Ev', 'Villa', 'Arsa', 'İşyeri', 'Ofis', 'Depo', 'Diğer Emlak'], titleExample: 'Örn: Kadıköy’de sahibinden kiralık 2+1 daire' },
  { id: 'vasita', label: 'Vasıta', description: 'Otomobil, motosiklet ve daha fazlası', types: ['vehicle_sale', 'vehicle_rent'], detailLabel: 'Vasıta türü', suggestions: ['Otomobil', 'Motosiklet', 'Elektrikli Araç', 'Ticari Araç', 'Minibüs', 'Kamyon', 'Karavan', 'Deniz Aracı', 'İş Makinesi', 'Diğer Vasıta'], titleExample: 'Örn: Sahibinden bakımlı 2020 model otomobil' },
  { id: 'urun', label: 'Ürün / İkinci El', description: 'Elektronik, mobilya ve alışveriş', types: ['product_sale'], detailLabel: 'Ürün türü', suggestions: ['Telefon', 'Bilgisayar', 'Elektronik', 'Mobilya', 'Beyaz Eşya', 'Ev ve Yaşam', 'Giyim', 'Spor ve Outdoor', 'Kitap', 'Hobi ve Koleksiyon', 'Anne ve Bebek', 'Diğer Ürün'], titleExample: 'Örn: Az kullanılmış çalışma masası ve sandalye' },
  { id: 'hizmet', label: 'Hizmet', description: 'Uzmanlar, ustalar ve profesyoneller', types: ['service_offer', 'service_request'], detailLabel: 'Hizmet alanı', suggestions: ['Temizlik', 'Nakliyat', 'Tadilat', 'Teknik Servis', 'Özel Ders', 'Yazılım ve Web', 'Tasarım', 'Fotoğraf ve Video', 'Organizasyon', 'Bakım Hizmetleri', 'Danışmanlık', 'Diğer Hizmet'], titleExample: 'Örn: Ev ve ofis için profesyonel temizlik hizmeti' },
  { id: 'is', label: 'İş / Eleman', description: 'Her sektörden iş ve çalışan', types: ['employer', 'worker'], detailLabel: 'Pozisyon / Meslek', suggestions: [], titleExample: 'Örn: İstanbul / Kadıköy - Satış Danışmanı Aranıyor' },
]

export const TYPE_LABELS: Record<ListingType, string> = {
  employer: 'Eleman Aranıyor', worker: 'İş Arıyorum',
  real_estate_sale: 'Satılık', real_estate_rent: 'Kiralık',
  vehicle_sale: 'Satılık', vehicle_rent: 'Kiralık', product_sale: 'Satılık',
  service_offer: 'Hizmet Veriyorum', service_request: 'Hizmet Arıyorum',
}

export function findCategory(id?: string) {
  return CATEGORIES.find(category => category.id === id)
}

export function categoryForType(type: string): CategoryDefinition {
  return CATEGORIES.find(category => category.types.includes(type as ListingType)) ?? CATEGORIES[4]
}

export function isJobType(type: string) {
  return type === 'employer' || type === 'worker'
}

export type ListingFilters = { category?: string; type?: string; city?: string; position?: string; q?: string }

export function matchesListingFilters(listing: Listing, filters: ListingFilters) {
  if (filters.category && filters.category !== 'all' && categoryForType(listing.listingType).id !== filters.category) return false
  if (filters.type && filters.type !== 'all' && listing.listingType !== filters.type) return false
  if (filters.city && listing.city !== filters.city) return false
  if (filters.position && listing.position !== filters.position.trim()) return false
  const term = filters.q?.trim().toLocaleLowerCase('tr')
  return !term || [listing.title, listing.description, listing.city, listing.position, listing.companyName ?? '', categoryForType(listing.listingType).label]
    .some(value => value.toLocaleLowerCase('tr').includes(term))
}
