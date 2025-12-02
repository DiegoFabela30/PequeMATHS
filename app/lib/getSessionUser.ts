import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("__session")?.value;

    if (!session) return null;

    const decoded = await adminAuth.verifySessionCookie(session, true) as any;
    
    // Custom claims are stored directly in the decoded token
    const isAdmin = decoded?.admin === true;

    return {
      uid: decoded.uid,
      email: decoded.email ?? "",
      name: decoded.name ?? "",
      picture: decoded.picture ?? "",
      admin: isAdmin
    };
  } catch {
    return null;
  }
}
