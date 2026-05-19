'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/lib/firebase'

type Mode = 'giris' | 'kayit' | 'sifre-sifirla'

export default function GirisPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('giris')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [ageConfirmed, setAgeConfirmed] = useState(false)

  function switchMode(next: Mode) {
    setMode(next)
    setError('')
    setInfo('')
    setPassword('')
    setPasswordConfirm('')
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isFirebaseConfigured || !auth) return
    setError('')

    if (mode === 'kayit' && password !== passwordConfirm) {
      setError('Şifreler eşleşmiyor.')
      return
    }
    if (mode === 'kayit' && !ageConfirmed) {
      setError('Devam etmek için 18 yaşında veya üzerinde olduğunuzu onaylamalısınız.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'giris') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      router.push('/')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('E-posta veya şifre hatalı.')
      } else if (code === 'auth/email-already-in-use') {
        setError('Bu e-posta zaten kayıtlı.')
      } else if (code === 'auth/weak-password') {
        setError('Şifre en az 6 karakter olmalı.')
      } else {
        setError('Bir hata oluştu. Tekrar deneyin.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handlePasswordReset(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isFirebaseConfigured || !auth) return
    setError('')
    setInfo('')
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setInfo('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Gelen kutunuzu kontrol edin.')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code === 'auth/user-not-found') {
        setError('Bu e-posta adresiyle kayıtlı hesap bulunamadı.')
      } else {
        setError('Bir hata oluştu. Tekrar deneyin.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    if (!isFirebaseConfigured || !auth) return
    setError('')
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push('/')
    } catch {
      setError('Google ile giriş başarısız.')
    } finally {
      setLoading(false)
    }
  }

  if (mode === 'sifre-sifirla') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold text-slate-900">
              Şantiye <span className="text-amber-500">İlan</span>
            </Link>
            <h1 className="mt-4 text-xl font-bold text-slate-800">Şifremi Unuttum</h1>
            <p className="mt-1 text-sm text-slate-500">
              E-posta adresinize sıfırlama bağlantısı göndereceğiz.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            {info ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                  {info}
                </div>
                <button
                  onClick={() => switchMode('giris')}
                  className="w-full bg-amber-400 text-slate-900 font-bold py-3 rounded-xl text-sm hover:bg-amber-500 transition"
                >
                  Giriş sayfasına dön
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">E-posta</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ornek@firma.com"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-400 text-slate-900 font-bold py-3 rounded-xl text-sm hover:bg-amber-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                </button>

                <button
                  type="button"
                  onClick={() => switchMode('giris')}
                  className="w-full text-sm text-slate-500 hover:text-slate-700"
                >
                  Geri dön
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Şantiye <span className="text-amber-500">İlan</span>
          </Link>
          <h1 className="mt-4 text-xl font-bold text-slate-800">
            {mode === 'giris' ? 'Hesabınıza Giriş Yapın' : 'Yeni Hesap Oluşturun'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {mode === 'giris' ? (
              <>
                Hesabınız yok mu?{' '}
                <button onClick={() => switchMode('kayit')} className="text-amber-600 font-medium hover:text-amber-500">
                  Kayıt olun
                </button>
              </>
            ) : (
              <>
                Zaten hesabınız var mı?{' '}
                <button onClick={() => switchMode('giris')} className="text-amber-600 font-medium hover:text-amber-500">
                  Giriş yapın
                </button>
              </>
            )}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {mode === 'giris' ? 'Google ile Giriş Yap' : 'Google ile Kayıt Ol'}
          </button>

          <div className="relative flex items-center">
            <div className="flex-1 border-t border-slate-100" />
            <span className="px-3 text-xs text-slate-400">veya e-posta ile</span>
            <div className="flex-1 border-t border-slate-100" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">E-posta</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ornek@firma.com"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-slate-700">Şifre</label>
                {mode === 'giris' && (
                  <button
                    type="button"
                    onClick={() => switchMode('sifre-sifirla')}
                    className="text-xs text-amber-600 hover:text-amber-500"
                  >
                    Şifremi unuttum
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {mode === 'kayit' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Şifre Tekrar</label>
                  <input
                    type="password"
                    required
                    value={passwordConfirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ageConfirmed}
                    onChange={e => setAgeConfirmed(e.target.checked)}
                    className="mt-0.5 accent-amber-500"
                  />
                  <span className="text-xs text-slate-600">
                    18 yaşında veya üzerinde olduğumu onaylıyorum. İnşaat sektöründe 18 yaş altı çalışma yasal olarak yasaktır.
                  </span>
                </label>
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 text-slate-900 font-bold py-3 rounded-xl text-sm hover:bg-amber-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Lütfen bekleyin...' : mode === 'giris' ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Devam ederek{' '}
          <Link href="/kullanim-sartlari" className="underline">Kullanım Şartları</Link>
          {' '}ve{' '}
          <Link href="/gizlilik" className="underline">Gizlilik Politikası</Link>
          {`'nı`} kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  )
}
