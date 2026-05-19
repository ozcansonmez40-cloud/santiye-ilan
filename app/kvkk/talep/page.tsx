'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function KvkkTalepPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [requestType, setRequestType] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch(`https://formsubmit.co/ajax/ozcansonmez.arc@gmail.com`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          'Ad Soyad': name,
          'E-posta': email,
          'Talep Türü': requestType,
          'Açıklama': message,
          _subject: `Şantiye İlan KVKK Talebi: ${requestType}`,
        }),
      })
      setSent(true)
    } catch {
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-xl mx-auto px-4">
        <Link href="/kvkk" className="text-sm text-slate-500 hover:text-slate-700 mb-6 inline-block">
          ← KVKK Sayfasına Dön
        </Link>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-xl font-bold text-slate-800 mb-1">KVKK Başvuru Formu</h1>
          <p className="text-sm text-slate-500 mb-6">
            Kişisel verilerinizle ilgili taleplerinizi aşağıdaki formu doldurarak iletebilirsiniz. 30 gün içinde yanıt verilir.
          </p>

          {sent ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-sm font-semibold text-green-800">Talebiniz alındı.</p>
              <p className="text-xs text-green-600 mt-1">30 gün içinde e-posta adresinize yanıt verilecektir.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">E-posta</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Talep Türü</label>
                <select
                  required
                  value={requestType}
                  onChange={e => setRequestType(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Seçiniz</option>
                  <option value="Verilerimin silinmesi">Verilerimin silinmesi</option>
                  <option value="Verilerimin güncellenmesi">Verilerimin güncellenmesi</option>
                  <option value="Verilerim hakkında bilgi">Verilerim hakkında bilgi</option>
                  <option value="Veri işlemeye itiraz">Veri işlemeye itiraz</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Açıklama</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Talebinizi detaylı açıklayınız..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60"
              >
                {loading ? 'Gönderiliyor...' : 'Talebi Gönder'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
