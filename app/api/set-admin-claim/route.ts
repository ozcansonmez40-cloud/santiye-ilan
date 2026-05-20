import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

const ADMIN_EMAIL = 'ozcansonmez40@gmail.com'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const idToken = authHeader.slice(7)

  try {
    const decoded = await adminAuth.verifyIdToken(idToken)

    if (decoded.email !== ADMIN_EMAIL || !decoded.email_verified) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await adminAuth.setCustomUserClaims(decoded.uid, { admin: true })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
