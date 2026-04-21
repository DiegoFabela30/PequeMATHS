import { NextRequest, NextResponse } from 'next/server';
import { updateLastLogin } from '../../lib/user-profiles';

export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: 'Missing uid' }, { status: 400 });
    }

    await updateLastLogin(uid);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating last login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}