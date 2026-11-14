import type { ListingCategory, ListingType, WorkType } from './types'
import { findCategory, isJobType } from './classifieds'

export type ListingDraft = {
  category: ListingCategory
  listingType: ListingType
  title: string
  city: string
  district: string
  detail: string
  companyName: string
  workType: WorkType | ''
  priceText: string
  description: string
  contactName: string
  contactPhone: string
  contactEmail: string
  whatsappEnabled: boolean
}

export function emptyDraft(category: ListingCategory = 'urun'): ListingDraft {
  const definition = findCategory(category)!
  return { category, listingType: definition.types[0], title: '', city: '', district: '', detail: '', companyName: '', workType: '', priceText: '', description: '', contactName: '', contactPhone: '', contactEmail: '', whatsappEnabled: false }
}

export function validateDraft(draft: ListingDraft) {
  const errors: Partial<Record<keyof ListingDraft, string>> = {}
  if (!findCategory(draft.category)?.types.includes(draft.listingType)) errors.listingType = 'Kategoriye uygun ilan türü seçin.'
  if (!draft.title.trim() || draft.title.trim().length > 200) errors.title = 'Başlık 1–200 karakter olmalıdır.'
  if (!draft.city.trim()) errors.city = 'Şehir seçin.'
  if (draft.listingType === 'worker' && draft.city === 'Yurtdışı') errors.city = 'İş arayan ilanları için Türkiye içinden şehir seçin.'
  if (!draft.detail.trim() || draft.detail.trim().length > 100) errors.detail = 'Alt kategori veya meslek girin (en fazla 100 karakter).'
  if (!draft.description.trim() || draft.description.trim().length > 5000) errors.description = 'Açıklama 1–5000 karakter olmalıdır.'
  if (!draft.contactName.trim() || draft.contactName.trim().length > 100) errors.contactName = 'İletişim adını girin (en fazla 100 karakter).'
  if (!draft.contactPhone.trim() && !draft.contactEmail.trim()) errors.contactPhone = 'Telefon veya e-posta bilgilerinden en az birini girin.'
  if (draft.contactPhone.length > 20) errors.contactPhone = 'Telefon en fazla 20 karakter olmalıdır.'
  if (draft.contactEmail && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contactEmail.trim()) || draft.contactEmail.length > 100)) errors.contactEmail = 'Geçerli bir e-posta adresi girin.'
  if (draft.priceText.length > 120) errors.priceText = 'Fiyat bilgisi en fazla 120 karakter olmalıdır.'
  return errors
}

export function slugify(text: string) {
  const replacements: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' }
  return text.toLocaleLowerCase('tr').replace(/[çğıöşü]/g, letter => replacements[letter]).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60).replace(/-$/g, '')
}

export function createListingPayload(draft: ListingDraft, userId: string, slug: string) {
  if (Object.keys(validateDraft(draft)).length) throw new Error('Invalid listing draft')
  // Retain the existing Firestore fields so old listings and deployed rules remain compatible.
  // Category is unambiguously encoded by listingType; position and salaryText now also carry
  // a non-job subcategory and public price/fee text. Private contacts are always separate.
  return {
    listingType: draft.listingType,
    title: draft.title.trim(), city: draft.city.trim(), district: draft.district.trim(),
    position: draft.detail.trim(), description: draft.description.trim(),
    ...(draft.priceText.trim() ? { salaryText: draft.priceText.trim() } : {}),
    ...(isJobType(draft.listingType) && draft.workType ? { workType: draft.workType } : {}),
    ...(draft.listingType !== 'worker' && draft.companyName.trim() ? { companyName: draft.companyName.trim() } : {}),
    slug, userId, status: 'active', isFeatured: false, isUrgent: false, viewCount: 0, contactClickCount: 0,
  }
}

