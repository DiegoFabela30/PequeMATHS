import { adminDb } from "./firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  createdAt: string | null; // ISO string para el front
  updatedAt: string | null;
};

export type CategoryInput = {
  name: string;
  description: string;
  color: string;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const COLLECTION = "categories";

export async function listCategories(): Promise<Category[]> {
  const snap = await adminDb
    .collection(COLLECTION)
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map((doc) => {
    const data = doc.data() as {
      name?: string;
      slug?: string;
      description?: string;
      color?: string;
      createdAt?: Timestamp;
      updatedAt?: Timestamp;
    };

    return {
      id: doc.id,
      name: data.name ?? "",
      slug: data.slug ?? "",
      description: data.description ?? "",
      color: data.color ?? "#22c55e",
      createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
      updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
    };
  });
}

export async function createCategory(
  input: CategoryInput
): Promise<Category> {
  const slug = slugify(input.name);

  const ref = await adminDb.collection(COLLECTION).add({
    name: input.name,
    slug,
    description: input.description,
    color: input.color || "#22c55e",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: null,
  });

  const snap = await ref.get();
  const data = snap.data() as {
    name: string;
    slug: string;
    description: string;
    color: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  };

  return {
    id: ref.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    color: data.color,
    createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
    updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
  };
}

export async function updateCategory(
  id: string,
  input: CategoryInput
): Promise<Category> {
  const slug = slugify(input.name);

  const ref = adminDb.collection(COLLECTION).doc(id);
  await ref.update({
    name: input.name,
    slug,
    description: input.description,
    color: input.color || "#22c55e",
    updatedAt: FieldValue.serverTimestamp(),
  });

  const snap = await ref.get();
  const data = snap.data() as {
    name: string;
    slug: string;
    description: string;
    color: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  };

  return {
    id: snap.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    color: data.color,
    createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
    updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
  };
}

export async function deleteCategory(id: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).delete();
}