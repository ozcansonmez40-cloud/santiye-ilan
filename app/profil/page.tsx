'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/lib/firebase'

export default function ProfilPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null | 'loading'>('loading')

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) { setUser(null); return }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      if (!u) router.replace('/giris')
    })
    return () => unsub()
  }, [router])

  async function handleSignOut() {
    if (!auth) return
    await signOut(auth)
    router.push('/')
  }

  if (user === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const displayName = user.displayName || user.email?.split('@')[0] || 'Kullanıcı'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Profilim</h1>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-xl">
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt={displayName} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-lg">{displayName}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {user.providerData[0]?.providerId === 'google.com' ? '🔗 Google ile giriş' : '📧 E-posta ile giriş'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/ilanim"
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 text-center transition-colors"
            >
              <p className="text-2xl font-bold text-amber-600 mb-0.5">📋</p>
              <p className="text-sm font-semibold text-slate-700">İlanlarım</p>
              <p className="text-xs text-slate-400">Yönet</p>
            </Link>
            <Link
              href="/ilan-ver"
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 text-center transition-colors"
            >
              <p className="text-2xl font-bold text-amber-600 mb-0.5">➕</p>
              <p className="text-sm font-semibold text-slate-700">Yeni İlan</p>
              <p className="text-xs text-slate-400">Ücretsiz ver</p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Hesap</h2>
          <div className="space-y-2">
            <Link href="/kvkk/talep" className="flex items-center justify-between py-2.5 text-sm text-slate-600 hover:text-slate-800 transition-colors border-b border-slate-50">
              <span>Veri Talebi (KVKK)</span>
              <span className="text-slate-300">›</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-between py-2.5 text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              <span>Çıkış Yap</span>
              <span>›</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
