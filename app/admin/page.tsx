import type { Metadata } from 'next'
import { mockListings, mockUsers, mockPayments } from '@/lib/mockData'
import { LISTING_TYPE_LABELS } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Admin Paneli | Şantiye İlan',
}

// TODO: Protect this page with Firebase Auth role check
// import { getAuth } from 'firebase-admin/auth'
// Verify ID token and check custom claim: role === 'admin'
// If not admin, redirect to /giris with notFound() or redirect()

export default function AdminPage() {
  const totalListings = mockListings.length
  const pendingListings = mockListings.filter((l) => l.status === 'pending_payment')
  const approvedListings = mockListings.filter((l) => l.status === 'active')
  const featuredListings = mockListings.filter((l) => l.isFeatured)
  const totalPayments = mockPayments.reduce((sum, p) => sum + (p.status === 'success' ? p.amount : 0), 0)

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Admin header */}
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-amber-400 font-bold text-lg">Şantiye İlan</p>
          <p className="text-slate-400 text-xs">Admin Paneli</p>
        </div>
        <span className="text-xs bg-amber-500 text-slate-900 font-semibold px-3 py-1 rounded-full">
          Mock Veri — Firebase bağlı değil
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* ─── Stats ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Toplam İlan" value={totalListings} />
          <StatCard label="Bekleyen" value={pendingListings.length} accent="amber" />
          <StatCard label="Onaylı" value={approvedListings.length} accent="green" />
          <StatCard label="Öne Çıkan" value={featuredListings.length} accent="blue" />
          <StatCard label="Kullanıcı" value={mockUsers.length} />
          <StatCard label="Gelir (TRY)" value={`₺${totalPayments.toLocaleString('tr-TR')}`} accent="purple" />
        </div>

        {/* ─── Pending approval ───────────────────────────── */}
        {pendingListings.length > 0 && (
          <section className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="font-semibold text-amber-800 text-sm">
                Onay Bekleyen İlanlar ({pendingListings.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <ListingTableHead />
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pendingListings.map((l) => (
                    <ListingTableRow key={l.id} listing={l} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 flex gap-2">
              {/* TODO: Wire up Firebase approve/reject calls */}
              {/* await updateDoc(doc(db, 'listings', id), { status: 'approved' }) */}
              <button className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1.5 rounded-lg font-semibold transition-colors">
                Seçilenleri Onayla
              </button>
              <button className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-semibold transition-colors">
                Seçilenleri Reddet
              </button>
            </div>
          </section>
        )}

        {/* ─── All listings ────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 text-sm">
              Tüm İlanlar ({totalListings})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <ListingTableHead showActions />
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockListings.map((l) => (
                  <ListingTableRow key={l.id} listing={l} showActions />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── Users ───────────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 text-sm">
              Kullanıcılar ({mockUsers.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Ad', 'E-posta', 'Rol', 'Şehir', 'Kayıt Tarihi'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">{u.displayName}</td>
                    <td className="px-4 py-3 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : u.role === 'employer'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{u.city ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(u.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── Payments ────────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 text-sm">
              Ödeme Kayıtları ({mockPayments.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['İlan ID', 'Kullanıcı', 'Paket', 'Tutar', 'Sağlayıcı', 'Durum', 'Tarih'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{p.listingId}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{p.userId}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-slate-600">{p.packageType}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">₺{p.amount}</td>
                    <td className="px-4 py-3 text-slate-500">{p.provider}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        p.status === 'success'
                          ? 'bg-emerald-100 text-emerald-700'
                          : p.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(p.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* TODO: Real payments via PayTR or iyzico webhook → Firebase Cloud Function → update status in Firestore */}
        </section>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: number | string
  accent?: 'amber' | 'green' | 'blue' | 'purple'
}) {
  const colors = {
    amber: 'text-amber-600',
    green: 'text-emerald-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
  }
  const valueColor = accent ? colors[accent] : 'text-slate-800'

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  )
}

function ListingTableHead({ showActions }: { showActions?: boolean }) {
  const headers = ['Başlık', 'Tür', 'Şehir', 'Pozisyon', 'Durum', 'Görüntülenme', 'Tarih']
  if (showActions) headers.push('İşlem')
  return (
    <tr>
      {headers.map((h) => (
        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {h}
        </th>
      ))}
    </tr>
  )
}

function ListingTableRow({
  listing,
  showActions,
}: {
  listing: (typeof mockListings)[number]
  showActions?: boolean
}) {
  const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    pending_payment: 'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-600',
    draft: 'bg-slate-100 text-slate-500',
    expired: 'bg-slate-100 text-slate-400',
  }

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3">
        <p className="font-medium text-slate-700 line-clamp-1 max-w-[200px]">{listing.title}</p>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-slate-500">{LISTING_TYPE_LABELS[listing.listingType]}</span>
      </td>
      <td className="px-4 py-3 text-slate-500 text-xs">{listing.city}</td>
      <td className="px-4 py-3 text-slate-500 text-xs">{listing.position}</td>
      <td className="px-4 py-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[listing.status] ?? ''}`}>
          {listing.status}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-400 text-xs">{listing.viewCount}</td>
      <td className="px-4 py-3 text-slate-400 text-xs">
        {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
      </td>
      {showActions && (
        <td className="px-4 py-3">
          <div className="flex gap-1">
            <button className="text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2 py-1 rounded font-medium transition-colors">
              Onayla
            </button>
            <button className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-2 py-1 rounded font-medium transition-colors">
              Reddet
            </button>
          </div>
        </td>
      )}
    </tr>
  )
}
