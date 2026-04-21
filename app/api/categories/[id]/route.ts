import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateCategory, deleteCategory, type CategoryInput } from '@/app/lib/admin-categories';

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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json() as CategoryInput;
    const { name, description, color } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const category = await updateCategory(id, {
      name: name.trim(),
      description: description?.trim() || '',
      color: color || '#22c55e'
    });

    return NextResponse.json(category);
  } catch (err) {
    console.error('Error updating category:', err);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting category:', err);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}