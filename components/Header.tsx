'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/lib/firebase'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [])

  async function handleSignOut() {
    if (!auth) return
    await signOut(auth)
    setMenuOpen(false)
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Hesabım'

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Image src="/logo.png" alt="Saha İlan" width={32} height={32} className="rounded" />
          <span className="text-xl font-bold text-amber-400 tracking-tight">Saha İlan</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <Link href="/ilanlar" className="text-slate-300 hover:text-white transition-colors">
            İlanlar
          </Link>
          <Link href="/ilan-ver" className="text-slate-300 hover:text-white transition-colors">
            İlan Ver
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/ilanim" className="text-slate-300 hover:text-white transition-colors text-sm">
                İlanlarım
              </Link>
              <Link href="/profil" className="text-slate-300 hover:text-white transition-colors text-sm">
                👤 {displayName}
              </Link>
              <button
                onClick={handleSignOut}
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <Link href="/giris" className="text-slate-300 hover:text-white transition-colors">
              Giriş Yap
            </Link>
          )}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/ilan-ver"
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Ücretsiz İlan Ver
          </Link>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menüyü aç/kapat"
        >
          <span className="block w-5 h-0.5 bg-white" />
          <span className="block w-5 h-0.5 bg-white" />
          <span className="block w-5 h-0.5 bg-white" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 pb-5 pt-3 flex flex-col gap-1 text-sm font-medium">
          <Link
            href="/ilanlar"
            className="py-2.5 text-slate-300 hover:text-white transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            İlanlar
          </Link>
          <Link
            href="/ilan-ver"
            className="py-2.5 text-slate-300 hover:text-white transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            İlan Ver
          </Link>
          {user ? (
            <>
              <Link
                href="/ilanim"
                className="py-2.5 text-slate-300 hover:text-white transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                İlanlarım
              </Link>
              <Link href="/profil" className="py-2.5 text-slate-300 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>
                👤 {displayName}
              </Link>
              <button
                onClick={handleSignOut}
                className="py-2.5 text-left text-slate-400 hover:text-white transition-colors"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <Link
              href="/giris"
              className="py-2.5 text-slate-300 hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Giriş Yap
            </Link>
          )}
          <Link
            href="/ilan-ver"
            className="mt-2 bg-amber-500 text-slate-900 font-semibold px-4 py-2.5 rounded-lg text-center"
            onClick={() => setMenuOpen(false)}
          >
            Ücretsiz İlan Ver
          </Link>
        </div>
      )}
    </header>
  )
}
