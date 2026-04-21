/**
 * COMPONENTE DE ADMINISTRACIÓN DE CATEGORÍAS (CLIENT-SIDE)
 */

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
      if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
      setCategories(data.categories ?? []);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e?.message ?? "Error al cargar categorías");
      } else {
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
      if (!res.ok) throw new Error(data.error ?? "Error al guardar");
      await loadCategories();
      resetForm();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e?.message ?? "Error al guardar categoría");
      } else {
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
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al eliminar");
      await loadCategories();
      if (editingId === id) resetForm();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e?.message ?? "Error al eliminar categoría");
      } else {
        setErr("Error al eliminar categoría desconocido");
      }
    }
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Comic+Neue:wght@400;700&display=swap');
        .bubblegum-font { font-family: 'Bubblegum Sans', cursive; }

        @keyframes float-rotate {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(8deg); }
        }
        @keyframes pop-in {
          0% { opacity: 0; transform: translateY(24px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-float-rotate { animation: float-rotate 7s ease-in-out infinite; }
        .animate-pop-in { animation: pop-in 0.6s ease-out both; }
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
      `}</style>

      <div className="relative min-h-screen overflow-hidden">

        {/* ── Fondo degradado igual al Home ── */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/80 via-blue-500/60 to-purple-500/70 -z-10" />

        {/* ── Decoraciones flotantes ── */}
        <div className="pointer-events-none absolute top-[6%] left-[3%] text-yellow-300 text-5xl opacity-60 animate-float-rotate" style={{animationDelay:'0s'}}>+</div>
        <div className="pointer-events-none absolute top-[12%] right-[5%] text-orange-300 text-4xl opacity-50 animate-float-rotate" style={{animationDelay:'1.5s'}}>■</div>
        <div className="pointer-events-none absolute bottom-[10%] left-[6%] text-green-300 text-4xl opacity-50 animate-float-rotate" style={{animationDelay:'2s'}}>●</div>
        <div className="pointer-events-none absolute bottom-[18%] right-[4%] text-pink-300 text-3xl opacity-50 animate-float-rotate" style={{animationDelay:'0.8s'}}>★</div>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

          {/* ══ ENCABEZADO ══ */}
          <section className="animate-pop-in flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-white/70 text-sm font-semibold tracking-widest uppercase mb-1">
                Panel de Administración
              </p>
              <h1 className="bubblegum-font text-5xl text-white drop-shadow-md">
                🏷️ Categorías
              </h1>
              <p className="mt-2 text-white/80 text-sm max-w-md">
                Crea y administra las categorías que verán los usuarios. Cada una genera su propio slug para las rutas.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="bubblegum-font self-start md:self-center inline-flex items-center gap-2 bg-white text-sky-500 font-semibold px-5 py-3 rounded-full shadow-lg hover:-translate-y-1 hover:scale-105 transition-all duration-300 text-sm"
            >
              ← Volver al dashboard
            </Link>
          </section>

          {/* ══ FORMULARIO ══ */}
          <section className="animate-pop-in bg-white rounded-3xl shadow-2xl p-8 card-hover" style={{animationDelay:'0.1s'}}>

            {/* Badge modo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                   style={{background: editingId ? '#fde68a' : '#bae6fd'}}>
                {editingId ? '✏️' : '✨'}
              </div>
              <h2 className="bubblegum-font text-3xl text-slate-700">
                {editingId ? "Editar categoría" : "Nueva categoría"}
              </h2>
            </div>

            {err && (
              <p className="mb-4 text-red-500 text-sm font-semibold bg-red-50 rounded-full py-2 px-5 text-center">
                ⚠️ {err}
              </p>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[2fr,3fr,auto,auto]">
              {/* Nombre */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide pl-2">Nombre</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Sumas"
                  className="w-full p-3 rounded-full border-2 border-sky-200 focus:border-sky-400 focus:outline-none transition-colors text-slate-700 placeholder:text-slate-300 text-sm"
                />
              </div>

              {/* Descripción */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide pl-2">Descripción</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Texto breve de la categoría"
                  className="w-full p-3 rounded-full border-2 border-sky-200 focus:border-sky-400 focus:outline-none transition-colors text-slate-700 placeholder:text-slate-300 text-sm"
                />
              </div>

              {/* Color */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide pl-2">Color</label>
                <div className="relative">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-14 h-11 rounded-full border-2 border-sky-200 cursor-pointer p-1 bg-white"
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col justify-end gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bubblegum-font bg-sky-400 hover:bg-sky-500 text-white px-6 py-3 rounded-full shadow-md hover:-translate-y-1 hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-base whitespace-nowrap"
                >
                  {saving
                    ? editingId ? "Guardando..." : "Creando..."
                    : editingId ? "💾 Guardar" : "➕ Crear"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors text-center"
                  >
                    Cancelar edición
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* ══ LISTA DE CATEGORÍAS ══ */}
          <section className="animate-pop-in" style={{animationDelay:'0.2s'}}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-xl">📂</div>
              <h2 className="bubblegum-font text-3xl text-white drop-shadow-sm">
                Categorías existentes
              </h2>
            </div>

            {loading ? (
              <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
                <p className="bubblegum-font text-2xl text-sky-400 animate-pulse">Cargando categorías... 🔄</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
                <p className="text-5xl mb-4">🗂️</p>
                <p className="bubblegum-font text-2xl text-slate-500">Aún no hay categorías</p>
                <p className="text-slate-400 text-sm mt-2">¡Crea la primera usando el formulario de arriba!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {categories.map((cat, idx) => (
                  <div
                    key={cat.id}
                    className="animate-pop-in bg-white rounded-3xl shadow-xl p-6 card-hover"
                    style={{animationDelay: `${0.05 * idx}s`}}
                  >
                    {/* Header de la tarjeta */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        {/* Burbuja de color */}
                        <span
                          className="w-8 h-8 rounded-full shadow-md border-2 border-white flex-shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <h3 className="bubblegum-font text-xl text-slate-700">{cat.name}</h3>
                      </div>
                      <span className="text-[11px] bg-slate-100 text-slate-400 rounded-full px-3 py-1 font-mono flex-shrink-0">
                        /{cat.slug}
                      </span>
                    </div>

                    {/* Descripción */}
                    {cat.description && (
                      <p className="text-sm text-slate-500 mb-4 pl-1">{cat.description}</p>
                    )}

                    {/* Separador */}
                    <div className="h-px bg-slate-100 my-3" />

                    {/* Acciones */}
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/categoria/${cat.slug}`}
                        className="text-xs text-sky-500 hover:text-sky-600 font-semibold transition-colors flex items-center gap-1"
                      >
                        Ver ruta pública →
                      </Link>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(cat)}
                          className="bubblegum-font text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-600 px-4 py-1.5 rounded-full transition-all duration-200 hover:-translate-y-0.5"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id)}
                          className="bubblegum-font text-sm bg-red-100 hover:bg-red-200 text-red-500 px-4 py-1.5 rounded-full transition-all duration-200 hover:-translate-y-0.5"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </>
  );
}