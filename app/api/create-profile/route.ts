import { NextRequest, NextResponse } from 'next/server';
import { createUserProfile } from '../../lib/user-profiles';

export async function POST(request: NextRequest) {
  try {
    const { uid, email, name, picture } = await request.json();

    if (!uid || !email || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const profile = await createUserProfile(uid, email, name, picture);

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error creating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}