import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { defaultMetadata } from '@/lib/seo'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  ...defaultMetadata,
  icons: {
    icon: [{ url: '/logo-v2.png', type: 'image/png', sizes: '512x512' }],
    apple: [{ url: '/apple-touch-icon-v2.png', sizes: '180x180' }],
  },
  verification: {
    google: 'GI3qiK5sQUnPLMB3pGvNusYK0iJEF342T5l709eGLVQ',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
