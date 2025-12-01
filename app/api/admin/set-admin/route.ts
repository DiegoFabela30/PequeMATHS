import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/app/lib/firebase-admin';

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;
  if (!session) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(session, true) as any;
    if (decoded && (decoded.admin || decoded['admin'] || decoded.customClaims?.admin)) return decoded;
    return null;
  } catch (err) {
    return null;
  }
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { uid, makeAdmin } = body as { uid?: string; makeAdmin?: boolean };
    if (!uid) return NextResponse.json({ error: 'uid required' }, { status: 400 });

    await adminAuth.setCustomUserClaims(uid, makeAdmin ? { admin: true } : { admin: false });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('set-admin error', err);
    return NextResponse.json({ error: 'Failed to set admin' }, { status: 500 });
  }
}
