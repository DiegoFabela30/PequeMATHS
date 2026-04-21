import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { listCategories, createCategory, type CategoryInput } from '@/app/lib/admin-categories';

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;
  if (!session) return null;

  try {
    const adminAuth = (await import('@/app/lib/firebase-admin')).adminAuth;
    const decoded = await adminAuth.verifySessionCookie(session, true) as any;
    if (decoded && decoded.admin) return decoded;
    return null;
  } catch (err) {
    return null;
  }
}

export async function GET() {
  try {
    const categories = await listCategories();
    return NextResponse.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json() as CategoryInput;
    const { name, description, color } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const category = await createCategory({
      name: name.trim(),
      description: description?.trim() || '',
      color: color || '#22c55e'
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error('Error creating category:', err);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}