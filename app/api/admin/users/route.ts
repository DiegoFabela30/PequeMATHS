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

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // list users (up to 1000)
    const list = await adminAuth.listUsers(1000);
    const users = list.users.map(u => ({ uid: u.uid, email: u.email, displayName: u.displayName, admin: !!u.customClaims?.admin }));
    return NextResponse.json({ users });
  } catch (err: any) {
    console.error('list users error', err);
    return NextResponse.json({ error: 'Failed to list users' }, { status: 500 });
  }
}
