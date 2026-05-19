'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/lib/firebase'
import { TURKISH_CITIES, CITY_DISTRICTS, POSITIONS, LISTING_TYPE_LABELS } from '@/lib/constants'
import type { ListingType } from '@/lib/types'

type FormData = {
  listingType: ListingType
  title: string
  city: string
  district: string
  position: string
  description: string
  contactName: string
  contactPhone: string
  whatsappEnabled: boolean
}

type FieldErrors = Partial<Record<keyof FormData, string>>

const INITIAL: FormData = {
  listingType: 'employer',
  title: '',
  city: '',
  district: '',
  position: '',
  description: '',
  contactName: '',
  contactPhone: '',
  whatsappEnabled: false,
}

function slugify(text: string): string {
  const map: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', İ: 'i', ö: 'o', ş: 's', ü: 'u', Ç: 'c', Ğ: 'g', Ö: 'o', Ş: 's', Ü: 'u' }
  return text
    .toLowerCase()
    .replace(/[çğıİöşüÇĞÖŞÜ]/g, (c) => map[c] ?? c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

export default function ListingForm() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const next: FieldErrors = {}
    if (!form.title.trim()) next.title = 'Başlık zorunludur.'
    if (!form.city) next.city = 'Şehir seçiniz.'
    if (!form.position) next.position = 'Pozisyon seçiniz.'
    if (!form.description.trim()) next.description = 'Açıklama zorunludur.'
    if (!form.contactName.trim()) next.contactName = 'İletişim adı zorunludur.'
    if (!form.contactPhone.trim()) next.contactPhone = 'Telefon zorunludur.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validate()) return
    if (!isFirebaseConfigured || !db) {
      setSubmitError('Sistem şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin.')
      return
    }

    setLoading(true)
    setSubmitError('')
    try {
      const slug = `${slugify(form.title)}-${Date.now()}`
      const docRef = await addDoc(collection(db, 'listings'), {
        ...form,
        slug,
        status: 'pending_payment',
        isFeatured: false,
        isUrgent: false,
        viewCount: 0,
        contactClickCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      router.push(`/odeme/${docRef.id}`)
    } catch {
      setSubmitError('İlan kaydedilirken bir hata oluştu. Tekrar deneyin.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">İlan Türü</label>
        <div className="flex gap-6">
          {(['employer', 'worker'] as const).map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="listingType"
                value={type}
                checked={form.listingType === type}
                onChange={() => set('listingType', type)}
                className="accent-amber-500"
              />
              <span className="text-sm text-slate-700">{LISTING_TYPE_LABELS[type]}</span>
            </label>
          ))}
        </div>
      </div>

      <Field label="Başlık" error={errors.title}>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Örn: İstanbul / Kadıköy - Şantiye Şefi Aranıyor"
          className={inputCls(errors.title)}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Şehir" error={errors.city}>
          <select
            value={form.city}
            onChange={(e) => { set('city', e.target.value); set('district', '') }}
            className={inputCls(errors.city)}
          >
            <option value="">Şehir seçin</option>
            {TURKISH_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="İlçe">
          {form.city ? (
            <select
              value={form.district}
              onChange={(e) => set('district', e.target.value)}
              className={inputCls()}
            >
              <option value="">İlçe seçin (opsiyonel)</option>
              {(CITY_DISTRICTS[form.city] ?? []).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              disabled
              placeholder="Önce şehir seçin"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-400 bg-slate-50 cursor-not-allowed"
            />
          )}
        </Field>
      </div>

      <Field label="Pozisyon" error={errors.position}>
        <select
          value={form.position}
          onChange={(e) => set('position', e.target.value)}
          className={inputCls(errors.position)}
        >
          <option value="">Pozisyon seçin</option>
          {POSITIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </Field>

      <Field label="Açıklama" error={errors.description}>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={5}
          placeholder="Proje, pozisyon ve beklentiler hakkında detay verin..."
          className={inputCls(errors.description)}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="İletişim Adı / Firma" error={errors.contactName}>
          <input
            type="text"
            value={form.contactName}
            onChange={(e) => set('contactName', e.target.value)}
            placeholder="Ad veya firma adı"
            className={inputCls(errors.contactName)}
          />
        </Field>
        <Field label="Telefon" error={errors.contactPhone}>
          <input
            type="tel"
            value={form.contactPhone}
            onChange={(e) => set('contactPhone', e.target.value)}
            placeholder="05xx xxx xx xx"
            className={inputCls(errors.contactPhone)}
          />
        </Field>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="whatsapp"
          checked={form.whatsappEnabled}
          onChange={(e) => set('whatsappEnabled', e.target.checked)}
          className="accent-amber-500 w-4 h-4 cursor-pointer"
        />
        <label htmlFor="whatsapp" className="text-sm text-slate-700 cursor-pointer">
          WhatsApp ile ulaşılabilir
        </label>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
          {submitError}
        </div>
      )}

      <div className="pt-1">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-lg text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Kaydediliyor...' : 'Devam Et → Paket Seç'}
        </button>
        <p className="text-xs text-slate-400 text-center mt-3">
          Bir sonraki adımda ilan paketinizi seçeceksiniz.
        </p>
      </div>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

function inputCls(error?: string) {
  return `w-full border ${
    error ? 'border-red-400 ring-1 ring-red-300' : 'border-slate-200'
  } rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white`
}
