import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/app/lib/firebase-admin";

const COOKIE = process.env.SESSION_COOKIE_NAME ?? "__session";
const MAX_AGE = Number(process.env.SESSION_COOKIE_MAX_AGE ?? 60 * 60 * 8);

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(COOKIE)?.value;

    if (!session) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 401 }
      );
    }

    // Verify current session to get UID
    const decoded = await adminAuth.verifySessionCookie(session, true) as any;
    const uid = decoded.uid;

    // Get the current user from Firebase (includes updated custom claims)
    const user = await adminAuth.getUser(uid);

    // Create a new session cookie with updated claims
    // Use user's custom claims directly
    const idToken = await adminAuth.createCustomToken(uid, user.customClaims);
    
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: MAX_AGE * 1000,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE,
    });

    return res;
  } catch (error: any) {
    console.error("refresh-session error:", error);
    return NextResponse.json(
      { error: "Failed to refresh session" },
      { status: 500 }
    );
  }
}
