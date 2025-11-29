import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("__session")?.value;

    if (!session) return null;

    const decoded = await adminAuth.verifySessionCookie(session, true);

    return {
      uid: decoded.uid,
      email: decoded.email ?? "",
      name: decoded.name ?? "",
      picture: decoded.picture ?? "",
    };
  } catch {
    return null;
  }
}
