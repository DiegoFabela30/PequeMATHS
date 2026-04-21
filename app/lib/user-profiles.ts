import 'server-only';
import { adminDb } from "./firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export type UserProfile = {
  uid: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: string | null;
  lastLoginAt: string | null;
  isAdmin?: boolean;
};

const COLLECTION = "users";

export async function createUserProfile(
  uid: string,
  email: string,
  name: string,
  picture?: string
): Promise<UserProfile> {
  const userRef = adminDb.collection(COLLECTION).doc(uid);

  const userData = {
    uid,
    email,
    name,
    picture: picture || null,
    createdAt: FieldValue.serverTimestamp(),
    lastLoginAt: FieldValue.serverTimestamp(),
    isAdmin: false, // Por defecto no es admin
  };

  await userRef.set(userData);

  return {
    uid,
    email,
    name,
    picture: picture || undefined,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    isAdmin: false,
  };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = adminDb.collection(COLLECTION).doc(uid);
  const snap = await userRef.get();

  if (!snap.exists) return null;

  const data = snap.data() as {
    uid: string;
    email: string;
    name: string;
    picture?: string;
    createdAt?: any;
    lastLoginAt?: any;
    isAdmin?: boolean;
  };

  return {
    uid: data.uid,
    email: data.email,
    name: data.name,
    picture: data.picture,
    createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
    lastLoginAt: data.lastLoginAt ? data.lastLoginAt.toDate().toISOString() : null,
    isAdmin: data.isAdmin || false,
  };
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<Pick<UserProfile, "name" | "picture">>
): Promise<UserProfile> {
  const userRef = adminDb.collection(COLLECTION).doc(uid);

  const updateData: any = {
    ...updates,
    lastLoginAt: FieldValue.serverTimestamp(),
  };

  await userRef.update(updateData);

  // Obtener el perfil actualizado
  return await getUserProfile(uid) as UserProfile;
}

export async function updateLastLogin(uid: string): Promise<void> {
  const userRef = adminDb.collection(COLLECTION).doc(uid);
  await userRef.update({
    lastLoginAt: FieldValue.serverTimestamp(),
  });
}
