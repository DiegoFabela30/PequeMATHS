"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export default function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#22c55e");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadCategories() {
    try {
      setErr(null);
      setLoading(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? `Error ${res.status}`);
      }
      setCategories(data.categories ?? []);
    } catch (e: unknown) {
      if(e instanceof Error){
        setErr(e?.message ?? "Error al cargar categorías");
      }else{
        setErr("Error al cargar categorías desconocido");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function resetForm() {
    setName("");
    setDescription("");
    setColor("#22c55e");
    setEditingId(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setErr("El nombre es obligatorio");
      return;
    }

    setSaving(true);
    setErr(null);
    try {
      const body = { name, description, color };
      let res: Response;

      if (editingId) {
        res = await fetch(`/api/categories/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Error al guardar");
      }

      await loadCategories();
      resetForm();
    } catch (e: unknown) {
      if(e instanceof Error){
        setErr(e?.message ?? "Error al guardar categoría");
      }else{
        setErr("Error al guardar categoría desconocido");
      }
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(cat: Category) {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
    setColor(cat.color || "#22c55e");
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Seguro que quieres eliminar esta categoría?")) return;
    try {
      setErr(null);
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Error al eliminar");
      }
      await loadCategories();
      if (editingId === id) {
        resetForm();
      }
    } catch (e: unknown) {
      if(e instanceof Error){
        setErr(e?.message ?? "Error al eliminar categoría");
      }else{
        setErr("Error al eliminar categoría desconocido");
      }
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Administración</p>
          <h1 className="text-3xl font-bold text-white">Categorías</h1>
          <p className="mt-2 text-sm text-slate-400">
            Administra las categorías que verán los usuarios finales (incluye
            slug para rutas).
          </p>
        </div>

        <Link
          href="/dashboard"
          className="text-sm text-emerald-400 hover:text-emerald-300"
        >
          ← Volver al dashboard
        </Link>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">
          {editingId ? "Editar categoría" : "Nueva categoría"}
        </h2>

        {err && <p className="text-sm text-red-300">{err}</p>}

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-[2fr,3fr,1fr,auto]"
        >
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">Nombre</label>
            <input
              className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Noticias"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">Descripción</label>
            <input
              className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Texto breve de la categoría"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">Color</label>
            <input
              type="color"
              className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900/60 p-1"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="flex flex-col justify-end gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-sm px-4 py-2 disabled:opacity-60"
            >
              {saving
                ? editingId
                  ? "Guardando..."
                  : "Creando..."
                : editingId
                ? "Guardar cambios"
                : "Crear categoría"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="text-lg font-semibold text-white mb-4">
          Categorías existentes
        </h2>

        {loading ? (
          <p className="text-sm text-slate-400">Cargando categorías...</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-slate-400">
            Aún no hay categorías. Crea la primera arriba 👆
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full border border-slate-700"
                      style={{ backgroundColor: cat.color }}
                    />
                    <h3 className="text-sm font-semibold text-white">
                      {cat.name}
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    slug: <code>{cat.slug}</code>
                  </span>
                </div>

                {cat.description && (
                  <p className="text-xs text-slate-400">{cat.description}</p>
                )}

                <div className="mt-2 flex items-center justify-between">
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    Ver ruta pública →
                  </Link>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(cat)}
                      className="text-xs text-slate-300 hover:text-white"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}