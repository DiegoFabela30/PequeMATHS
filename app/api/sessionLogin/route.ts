import { adminAuth } from "../../lib/firebase-admin";
import { NextResponse } from "next/server";

const COOKIE = process.env.SESSION_COOKIE_NAME ?? "__session";
const MAX_AGE = Number(process.env.SESSION_COOKIE_MAX_AGE ?? 60 * 60 * 8);

export async function POST(req: Request) {
  try {
    const { idToken, remember } = await req.json();
    if (!idToken)
      return NextResponse.json(
        { error: "Falta idToken" },
        { status: 400 }
      );

    const expiresIn = (remember ? MAX_AGE : 2 * 60 * 60) * 1000;

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: remember ? MAX_AGE : 2 * 60 * 60,
    });

    return res;
  } catch (e) {
    return NextResponse.json(
      { error: "No se pudo crear la cookie de sesión" },
      { status: 401 }
    );
  }
}
