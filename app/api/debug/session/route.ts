import { cookies } from "next/headers";
import { adminAuth } from "@/app/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("__session")?.value;

    if (!session) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    const decoded = await adminAuth.verifySessionCookie(session, true) as any;

    return NextResponse.json({
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      admin: decoded.admin,
      allClaims: decoded,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
