/**
 * Canonical data model for Şantiye İlan.
 *
 * Flutter compatibility: These types map 1-to-1 to Firestore document schemas.
 * The Flutter app will use the same Firebase project, same collection names
 * (defined in lib/constants.ts), and the same field names as these types.
 */

export type ListingType = 'employer' | 'worker'

export type WorkType = 'full_time' | 'part_time' | 'project_based' | 'temporary'

export type ListingStatus = 'draft' | 'pending_payment' | 'active' | 'rejected' | 'expired'

export type UserRole = 'admin' | 'employer' | 'worker'

export type PaymentProvider = 'paytr' | 'iyzico' | 'manual'

export type PaymentPackageType = 'featured' | 'urgent' | 'monthly_company'

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded'

export type Listing = {
  id: string
  slug: string
  listingType: ListingType
  title: string
  city: string
  district: string
  position: string
  projectType?: string
  workType?: WorkType
  experienceYears?: number
  salaryMin?: number
  salaryMax?: number
  salaryText?: string
  description: string
  contactName?: string
  contactPhone?: string
  whatsappEnabled?: boolean
  companyName?: string
  isFeatured: boolean
  isUrgent: boolean
  status: ListingStatus
  viewCount: number
  contactClickCount: number
  createdAt: string
  updatedAt: string
  expiresAt?: string
}

export type UserProfile = {
  id: string
  role: UserRole
  displayName: string
  email: string
  phone?: string
  city?: string
  createdAt: string
}

export type PaymentRecord = {
  id: string
  userId: string
  listingId: string
  provider: PaymentProvider
  packageType: PaymentPackageType
  amount: number
  currency: 'TRY'
  status: PaymentStatus
  providerPaymentId?: string
  createdAt: string
}

export type AnalyticsEvent = {
  id: string
  userId?: string
  listingId?: string
  eventName:
    | 'listing_view'
    | 'contact_click'
    | 'listing_submit'
    | 'payment_started'
    | 'payment_success'
  platform: 'web' | 'flutter'
  createdAt: string
  metadata?: Record<string, string | number | boolean>
}
