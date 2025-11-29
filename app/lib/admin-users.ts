import { adminAuth } from "./firebase-admin";

export type AdminUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  disabled: boolean;
  creationTime: string;
  lastSignInTime: string | null;
  providers: string[]; // 👈 nuevo
};

export async function listAuthUsers(limit = 50): Promise<AdminUser[]> {
  const result = await adminAuth.listUsers(limit);

  return result.users.map((u) => ({
    uid: u.uid,
    email: u.email ?? null,
    displayName: u.displayName ?? null,
    disabled: u.disabled,
    creationTime: u.metadata.creationTime,
    lastSignInTime: u.metadata.lastSignInTime ?? null,
    providers: u.providerData.map((p) => p.providerId), // ej: ["password"], ["google.com"]
  }));
}