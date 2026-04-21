import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminDb } from "@/app/lib/firebase-admin";

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("__session")?.value;
  if (!session) return null;

  try {
    const adminAuth = (await import("@/app/lib/firebase-admin")).adminAuth;
    const decoded = await adminAuth.verifySessionCookie(session, true) as any;
    if (decoded && decoded.admin) return decoded;
    return null;
  } catch (err) {
    return null;
  }
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const usersSnap = await adminDb.collection("users").orderBy("createdAt", "desc").get();
    const users = usersSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
