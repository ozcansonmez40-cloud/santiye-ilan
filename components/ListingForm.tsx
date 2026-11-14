'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { collection, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { db, auth, isFirebaseConfigured } from '@/lib/firebase'
import { TURKISH_CITIES, CITY_DISTRICTS, POSITIONS, WORK_TYPE_LABELS, ABROAD_COUNTRIES } from '@/lib/constants'
import { CATEGORIES, TYPE_LABELS, findCategory, isJobType } from '@/lib/classifieds'
import { emptyDraft, validateDraft, createListingPayload, slugify, type ListingDraft } from '@/lib/listing-draft'
import type { ListingCategory, ListingType, WorkType } from '@/lib/types'
import CategoryIcon from './CategoryIcon'

export default function ListingForm({ initialCategory }: { initialCategory?: string }) {
  const router = useRouter()
  const [form, setForm] = useState(() => emptyDraft(findCategory(initialCategory)?.id ?? 'urun'))
  const [errors, setErrors] = useState<Partial<Record<keyof ListingDraft, string>>>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [user, setUser] = useState<User | null | 'loading'>('loading')
  const category = findCategory(form.category)!
  const job = isJobType(form.listingType)
  const suggestions = job ? POSITIONS : category.suggestions

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) { setUser(null); return }
    return onAuthStateChanged(auth, setUser)
  }, [])

  function set<K extends keyof ListingDraft>(key: K, value: ListingDraft[K]) {
    setForm(previous => ({ ...previous, [key]: value }))
    setErrors(previous => ({ ...previous, [key]: undefined }))
  }

  function changeCategory(id: ListingCategory) {
    const next = findCategory(id)!
    setForm(previous => ({ ...previous, category: id, listingType: next.types[0], detail: '', workType: '', priceText: '' }))
    setErrors({})
  }

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    const validation = validateDraft(form)
    setErrors(validation)
    if (Object.keys(validation).length) return
    if (!user || user === 'loading') { setSubmitError('İlanınızı yayınlamak için giriş yapın veya ücretsiz hesap oluşturun.'); return }
    if (!isFirebaseConfigured || !db) { setSubmitError('İlan sistemi şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin.'); return }
    setLoading(true)
    setSubmitError('')
    const listingRef = doc(collection(db, 'listings'))
    let publicSaved = false
    try {
      await setDoc(listingRef, {
        ...createListingPayload(form, user.uid, `${slugify(form.title)}-${listingRef.id}`),
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      })
      publicSaved = true
      await setDoc(doc(db, 'listing_contacts', listingRef.id), {
        contactName: form.contactName.trim(), contactPhone: form.contactPhone.trim(),
        contactEmail: form.contactEmail.trim(), whatsappEnabled: form.whatsappEnabled, userId: user.uid,
      })
      router.push('/ilanim')
    } catch {
      // The existing rules require the listing to exist before its private contact document.
      // Roll back this newly created listing if the second write fails.
      if (publicSaved) {
        try { await deleteDoc(listingRef) } catch {
          setSubmitError('İlan oluşturuldu ancak iletişim bilgileri kaydedilemedi. Tekrar ilan vermeden önce İlanlarım bölümünü kontrol edin.')
          setLoading(false)
          return
        }
      }
      setSubmitError('İlan kaydedilemedi. Bilgileriniz formda duruyor; tekrar deneyebilirsiniz.')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
      {user === null && <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-slate-700">
        İlanınızı hazırlayabilirsiniz. Yayınlamak için <Link href="/giris" className="font-semibold text-amber-700 underline">giriş yapın</Link> veya <Link href="/giris?mod=kayit" className="font-semibold text-amber-700 underline">ücretsiz hesap oluşturun</Link>.
      </div>}

      <fieldset>
        <legend className="text-base font-bold text-slate-800 mb-3">1. Kategori seçin</legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map(item => <label key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${form.category === item.id ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-slate-200 text-slate-600 hover:border-amber-300'}`}>
            <input type="radio" name="category" value={item.id} checked={form.category === item.id} onChange={() => changeCategory(item.id)} className="accent-amber-500 shrink-0" />
            <CategoryIcon category={item.id} className="w-5 h-5 shrink-0" />
            <span className="text-sm font-semibold">{item.label}</span>
          </label>)}
        </div>
      </fieldset>

      <fieldset>
        <legend className="block text-sm font-semibold text-slate-700 mb-2">İlan türü</legend>
        <div className="flex gap-5 flex-wrap">
          {category.types.map(type => <label key={type} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="radio" name="listingType" value={type} checked={form.listingType === type} onChange={() => { set('listingType', type as ListingType); if (type === 'worker' && form.city === 'Yurtdışı') { set('city', ''); set('district', '') } }} className="accent-amber-500" />{TYPE_LABELS[type]}
          </label>)}
        </div>
        {errors.listingType && <p className="text-xs text-red-600 mt-1">{errors.listingType}</p>}
      </fieldset>

      <div className="border-t border-slate-100 pt-5"><h2 className="text-base font-bold text-slate-800 mb-4">2. İlan bilgileri</h2>
        <div className="space-y-5">
          <Field label="İlan başlığı" error={errors.title}><input required maxLength={200} value={form.title} onChange={e => set('title', e.target.value)} placeholder={category.titleExample} className={inputCls(errors.title)} /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Şehir" error={errors.city}><select required value={form.city} onChange={e => { set('city', e.target.value); set('district', '') }} className={inputCls(errors.city)}><option value="">Şehir seçin</option>{form.listingType !== 'worker' && <option value="Yurtdışı">Yurtdışı</option>}{TURKISH_CITIES.map(city => <option key={city} value={city}>{city}</option>)}</select></Field>
            <Field label={form.city === 'Yurtdışı' ? 'Ülke' : 'İlçe (isteğe bağlı)'}><select value={form.district} disabled={!form.city} onChange={e => set('district', e.target.value)} className={inputCls()}><option value="">{form.city ? (form.city === 'Yurtdışı' ? 'Ülke seçin' : 'İlçe seçin') : 'Önce şehir seçin'}</option>{(form.city === 'Yurtdışı' ? ABROAD_COUNTRIES : CITY_DISTRICTS[form.city] ?? []).map(district => <option key={district} value={district}>{district}</option>)}</select></Field>
          </div>
          <Field label={category.detailLabel} error={errors.detail}>
            <input required list="listing-detail-options" value={form.detail} onChange={e => set('detail', e.target.value)} maxLength={100} placeholder="Listeden seçin veya kendiniz yazın" className={inputCls(errors.detail)} />
          </Field>
          <datalist id="listing-detail-options">{suggestions.map(detail => <option key={detail} value={detail} />)}</datalist>
          {job && <Field label="Çalışma şekli (isteğe bağlı)"><select value={form.workType} onChange={e => set('workType', e.target.value as WorkType | '')} className={inputCls()}><option value="">Seçin</option>{Object.entries(WORK_TYPE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></Field>}
          <Field label={job ? 'Ücret bilgisi (isteğe bağlı)' : 'Fiyat / Ücret (isteğe bağlı)'} error={errors.priceText}>
            <input maxLength={120} value={form.priceText} onChange={e => set('priceText', e.target.value)} placeholder={job ? 'Örn: Görüşmede belirtilecek' : form.listingType.endsWith('_rent') ? 'Örn: Aylık 20.000 TL veya günlük 1.500 TL' : 'Örn: 12.500 TL veya teklif alınız'} className={inputCls(errors.priceText)} />
          </Field>
          <Field label="Açıklama" error={errors.description}><textarea required maxLength={5000} rows={6} value={form.description} onChange={e => set('description', e.target.value)} placeholder={job ? 'Görevleri, çalışma koşullarını ve beklentilerinizi yazın.' : 'İlanın özelliklerini, durumunu ve diğer önemli ayrıntıları yazın.'} className={inputCls(errors.description)} /></Field>
          {form.listingType !== 'worker' && <Field label="Firma / İşletme adı (isteğe bağlı)"><input maxLength={100} value={form.companyName} onChange={e => set('companyName', e.target.value)} className={inputCls()} /></Field>}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5"><h2 className="text-base font-bold text-slate-800 mb-2">3. İletişim bilgileri</h2>
        <p className="text-xs text-slate-500 mb-4">Telefon ve e-posta bilgileriniz yalnızca giriş yapan kullanıcılara gösterilir.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="İletişim adı" error={errors.contactName}><input required maxLength={100} autoComplete="name" value={form.contactName} onChange={e => set('contactName', e.target.value)} className={inputCls(errors.contactName)} /></Field>
          <Field label="Telefon" error={errors.contactPhone}><input type="tel" maxLength={20} autoComplete="tel" value={form.contactPhone} onChange={e => set('contactPhone', e.target.value)} placeholder="05xx xxx xx xx" className={inputCls(errors.contactPhone)} /></Field>
          <Field label="E-posta" error={errors.contactEmail}><input type="email" maxLength={100} autoComplete="email" value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} className={inputCls(errors.contactEmail)} /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700 mt-4 cursor-pointer"><input type="checkbox" checked={form.whatsappEnabled} onChange={e => set('whatsappEnabled', e.target.checked)} className="accent-amber-500" />WhatsApp ile ulaşılabilir</label>
      </div>

      {submitError && <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{submitError}{!user && <> <Link href="/giris" className="underline font-semibold">Giriş Yap</Link></>}</div>}
      <button type="submit" disabled={loading || user === 'loading'} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed">{loading ? 'Yayınlanıyor...' : 'İlanı Ücretsiz Yayınla'}</button>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div><label className="block text-sm font-semibold text-slate-700 mb-1">{label}{children}</label>{error && <p className="mt-1 text-xs text-red-600">{error}</p>}</div>
}

function inputCls(error?: string) {
  return `w-full mt-1 border ${error ? 'border-red-400 ring-1 ring-red-300' : 'border-slate-200'} rounded-lg px-3 py-2.5 text-sm font-normal text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white disabled:bg-slate-50 disabled:text-slate-400`
}
