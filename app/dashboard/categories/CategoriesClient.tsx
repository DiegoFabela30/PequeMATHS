/**
 * COMPONENTE DE ADMINISTRACIÓN DE CATEGORÍAS (CLIENT-SIDE)
 * ========================================================
 * 
 * Propósito: Componente cliente que gestiona el CRUD completo de categorías
 * para un sistema de blog o publicaciones. Permite crear, leer, actualizar
 * y eliminar categorías con interfaz visual e interactiva.
 * 
 * Tecnologías:
 * - Next.js 14+ (Client Component - requiere interactividad del usuario)
 * - React Hooks para manejo de estado y efectos
 * - API Routes para operaciones CRUD
 * - TypeScript para tipado fuerte
 */

"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";

/**
 * DEFINICIÓN DE TIPOS
 * ===================
 * 
 * Category: Estructura de datos que representa una categoría en el sistema
 * 
 * Campos:
 * - id: Identificador único de la categoría (generado por base de datos)
 * - name: Nombre visible de la categoría (ej: "Noticias", "Tutoriales")
 * - slug: URL-friendly version del nombre (ej: "noticias", "tutoriales")
 * - description: Texto descriptivo opcional de la categoría
 * - color: Color hexadecimal para identificación visual (ej: "#22c55e")
 * - createdAt: Timestamp de creación (puede ser null si no está disponible)
 * - updatedAt: Timestamp de última actualización (puede ser null)
 */
type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  createdAt: string | null;
  updatedAt: string | null;
};

/**
 * COMPONENTE PRINCIPAL - CategoriesClient
 * =======================================
 * 
 * Client Component que implementa:
 * 1. Listado de categorías existentes
 * 2. Formulario para crear nuevas categorías
 * 3. Edición inline de categorías
 * 4. Eliminación con confirmación
 * 5. Manejo de estados de carga y errores
 */
export default function CategoriesClient() {
  
  // ==========================================
  // ESTADOS PARA DATOS Y UI
  // ==========================================
  
  /**
   * categories: Array que almacena todas las categorías cargadas desde la API
   * Inicializa vacío y se llena con loadCategories()
   */
  const [categories, setCategories] = useState<Category[]>([]);
  
  /**
   * loading: Indica si se están cargando las categorías desde la API
   * Útil para mostrar spinners o mensajes de "Cargando..."
   */
  const [loading, setLoading] = useState(true);
  
  /**
   * err: Almacena mensajes de error para mostrar al usuario
   * null cuando no hay errores
   */
  const [err, setErr] = useState<string | null>(null);

  // ==========================================
  // ESTADOS DEL FORMULARIO
  // ==========================================
  
  /**
   * name: Nombre de la categoría que se está creando/editando
   */
  const [name, setName] = useState("");
  
  /**
   * description: Descripción opcional de la categoría
   */
  const [description, setDescription] = useState("");
  
  /**
   * color: Color hexadecimal para la categoría
   * Default: #22c55e (verde emerald)
   */
  const [color, setColor] = useState("#22c55e");
  
  /**
   * saving: Indica si se está guardando una categoría (crear/actualizar)
   * Previene múltiples envíos simultáneos del formulario
   */
  const [saving, setSaving] = useState(false);
  
  /**
   * editingId: ID de la categoría que se está editando
   * null cuando se está creando una nueva categoría
   * string cuando se está editando una existente
   */
  const [editingId, setEditingId] = useState<string | null>(null);

  // ==========================================
  // FUNCIÓN: CARGAR CATEGORÍAS
  // ==========================================
  
  /**
   * loadCategories: Obtiene todas las categorías desde la API
   * 
   * Flujo:
   * 1. Resetea el estado de error
   * 2. Activa el estado de loading
   * 3. Hace petición GET a /api/categories
   * 4. Si hay error, lo captura y muestra
   * 5. Si es exitoso, actualiza el estado categories
   * 6. Siempre desactiva loading al finalizar (finally)
   * 
   * Manejo de errores tipado:
   * - Verifica que el error sea instancia de Error
   * - Extrae el mensaje de error o usa uno genérico
   */
  async function loadCategories() {
    try {
      setErr(null);
      setLoading(true);
      
      // Petición GET a la API de categorías
      const res = await fetch("/api/categories");
      const data = await res.json();
      
      // Verifica si la respuesta no es OK (status 4xx o 5xx)
      if (!res.ok) {
        throw new Error(data.error ?? `Error ${res.status}`);
      }
      
      // Actualiza el estado con las categorías obtenidas
      // Usa ?? [] para asegurar que siempre sea un array
      setCategories(data.categories ?? []);
      
    } catch (e: unknown) {
      // Manejo de errores tipado en TypeScript
      if(e instanceof Error){
        setErr(e?.message ?? "Error al cargar categorías");
      }else{
        setErr("Error al cargar categorías desconocido");
      }
    } finally {
      // Siempre se ejecuta, haya error o no
      setLoading(false);
    }
  }

  // ==========================================
  // EFECTO: CARGA INICIAL
  // ==========================================
  
  /**
   * useEffect: Se ejecuta una vez al montar el componente
   * 
   * Dependencias vacías [] significa que solo se ejecuta:
   * - Una vez cuando el componente se monta
   * - No se vuelve a ejecutar en re-renders
   * 
   * Carga las categorías automáticamente al abrir la página
   */
  useEffect(() => {
    loadCategories();
  }, []);

  // ==========================================
  // FUNCIÓN: RESETEAR FORMULARIO
  // ==========================================
  
  /**
   * resetForm: Limpia todos los campos del formulario
   * 
   * Se usa en tres casos:
   * 1. Después de crear una categoría exitosamente
   * 2. Después de editar una categoría exitosamente
   * 3. Cuando el usuario cancela una edición
   * 
   * Resetea a valores iniciales:
   * - Campos vacíos
   * - Color por defecto (verde)
   * - Sale del modo edición (editingId = null)
   */
  function resetForm() {
    setName("");
    setDescription("");
    setColor("#22c55e");
    setEditingId(null);
  }

  // ==========================================
  // FUNCIÓN: GUARDAR CATEGORÍA (CREAR/EDITAR)
  // ==========================================
  
  /**
   * handleSubmit: Maneja el envío del formulario
   * 
   * Comportamiento dual:
   * - Si editingId existe → Actualiza categoría existente (PUT)
   * - Si editingId es null → Crea nueva categoría (POST)
   * 
   * Validaciones:
   * - El nombre es obligatorio (no puede estar vacío)
   * - Previene el comportamiento por defecto del formulario
   * 
   * Flujo:
   * 1. Valida que el nombre no esté vacío
   * 2. Activa estado "saving" (deshabilita botón)
   * 3. Prepara el body con los datos del formulario
   * 4. Decide si hacer POST (crear) o PUT (editar)
   * 5. Envía la petición con headers JSON
   * 6. Si hay error, lo muestra al usuario
   * 7. Si es exitoso, recarga la lista y resetea el form
   * 8. Siempre desactiva "saving" al finalizar
   */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    // Previene el comportamiento por defecto del form (recarga de página)
    e.preventDefault();
    
    // Validación: nombre obligatorio
    // trim() elimina espacios en blanco al inicio/final
    if (!name.trim()) {
      setErr("El nombre es obligatorio");
      return;
    }

    setSaving(true);
    setErr(null);
    
    try {
      // Prepara el cuerpo de la petición con los datos del formulario
      const body = { name, description, color };
      let res: Response;

      // MODO EDICIÓN: Si existe editingId, actualiza la categoría
      if (editingId) {
        res = await fetch(`/api/categories/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } 
      // MODO CREACIÓN: Si no existe editingId, crea nueva categoría
      else {
        res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      const data = await res.json();
      
      // Verifica si hubo error en la respuesta
      if (!res.ok) {
        throw new Error(data.error ?? "Error al guardar");
      }

      // Éxito: recarga las categorías y resetea el formulario
      await loadCategories();
      resetForm();
      
    } catch (e: unknown) {
      // Manejo de errores tipado
      if(e instanceof Error){
        setErr(e?.message ?? "Error al guardar categoría");
      }else{
        setErr("Error al guardar categoría desconocido");
      }
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // FUNCIÓN: PREPARAR EDICIÓN
  // ==========================================
  
  /**
   * handleEdit: Carga los datos de una categoría en el formulario
   * 
   * Cuando el usuario hace clic en "Editar":
   * 1. Guarda el ID de la categoría en editingId
   * 2. Llena los campos del formulario con los datos actuales
   * 3. El formulario cambia visualmente a "modo edición"
   * 4. El botón muestra "Guardar cambios" en vez de "Crear"
   * 
   * Nota: No hace ninguna petición a la API, solo prepara el UI
   */
  function handleEdit(cat: Category) {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
    setColor(cat.color || "#22c55e"); // Usa color guardado o default
  }

  // ==========================================
  // FUNCIÓN: ELIMINAR CATEGORÍA
  // ==========================================
  
  /**
   * handleDelete: Elimina una categoría con confirmación
   * 
   * Flujo de seguridad:
   * 1. Muestra diálogo de confirmación nativo del navegador
   * 2. Si el usuario cancela, no hace nada (return early)
   * 3. Si confirma, hace petición DELETE a la API
   * 4. Si hay error, lo muestra al usuario
   * 5. Si es exitoso, recarga la lista de categorías
   * 6. Si la categoría eliminada estaba siendo editada, limpia el form
   * 
   * Importante:
   * - confirm() es bloqueante (síncrono)
   * - La eliminación es inmediata y no se puede deshacer
   * - Si falla, mantiene la categoría en la lista
   */
  async function handleDelete(id: string) {
    // Diálogo de confirmación: retorna true si acepta, false si cancela
    if (!confirm("¿Seguro que quieres eliminar esta categoría?")) return;
    
    try {
      setErr(null);
      
      // Petición DELETE a la API con el ID específico
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error ?? "Error al eliminar");
      }
      
      // Éxito: recarga la lista
      await loadCategories();
      
      // Si estaba editando esta categoría, limpia el formulario
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

  // ==========================================
  // RENDERIZADO DEL COMPONENTE
  // ==========================================
  
  /**
   * Estructura de la UI:
   * 
   * 1. Encabezado con título y link de regreso
   * 2. Formulario de creación/edición
   * 3. Lista de categorías existentes con opciones de editar/eliminar
   * 
   * Estados visuales:
   * - Loading: muestra "Cargando categorías..."
   * - Empty: muestra mensaje de "No hay categorías"
   * - Error: muestra mensaje de error en rojo
   * - Success: muestra grid de categorías con sus datos
   * 
   * Características:
   * - Formulario adaptativo (modo crear/editar)
   * - Botones deshabilitados durante saving
   * - Preview de color en tiempo real
   * - Links a las rutas públicas de cada categoría
   */
  return (
    <div className="space-y-6">
      {/* SECCIÓN 1: ENCABEZADO */}
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

      {/* SECCIÓN 2: FORMULARIO DE CREACIÓN/EDICIÓN */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">
          {/* Título dinámico según el modo */}
          {editingId ? "Editar categoría" : "Nueva categoría"}
        </h2>

        {/* Muestra errores si existen */}
        {err && <p className="text-sm text-red-300">{err}</p>}

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-[2fr,3fr,1fr,auto]"
        >
          {/* Campo: Nombre */}
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">Nombre</label>
            <input
              className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Noticias"
            />
          </div>

          {/* Campo: Descripción */}
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">Descripción</label>
            <input
              className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Texto breve de la categoría"
            />
          </div>

          {/* Campo: Color (color picker nativo) */}
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">Color</label>
            <input
              type="color"
              className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900/60 p-1"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col justify-end gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-sm px-4 py-2 disabled:opacity-60"
            >
              {/* Texto dinámico según el estado y modo */}
              {saving
                ? editingId
                  ? "Guardando..."
                  : "Creando..."
                : editingId
                ? "Guardar cambios"
                : "Crear categoría"}
            </button>
            
            {/* Botón de cancelar (solo visible en modo edición) */}
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

      {/* SECCIÓN 3: LISTA DE CATEGORÍAS */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="text-lg font-semibold text-white mb-4">
          Categorías existentes
        </h2>

        {/* Estado: Cargando */}
        {loading ? (
          <p className="text-sm text-slate-400">Cargando categorías...</p>
        ) : /* Estado: Sin categorías */ categories.length === 0 ? (
          <p className="text-sm text-slate-400">
            Aún no hay categorías. Crea la primera arriba 👆
          </p>
        ) : /* Estado: Lista de categorías */ (
          <div className="grid gap-4 md:grid-cols-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 flex flex-col gap-2"
              >
                {/* Encabezado de la tarjeta: color + nombre + slug */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Indicador de color */}
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

                {/* Descripción (si existe) */}
                {cat.description && (
                  <p className="text-xs text-slate-400">{cat.description}</p>
                )}

                {/* Acciones: ver ruta pública, editar, eliminar */}
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

/**
 * RESUMEN DE FUNCIONALIDAD
 * =========================
 * 
 * Este componente implementa un CRUD completo de categorías:
 * 
 * 1. CREATE (Crear):
 *    - Formulario con campos: nombre, descripción, color
 *    - Validación de nombre obligatorio
 *    - POST a /api/categories
 * 
 * 2. READ (Leer):
 *    - Carga automática al montar el componente
 *    - GET a /api/categories
 *    - Muestra lista visual con colores y slugs
 * 
 * 3. UPDATE (Actualizar):
 *    - Botón "Editar" carga datos en el formulario
 *    - Modo visual de edición
 *    - PUT a /api/categories/{id}
 * 
 * 4. DELETE (Eliminar):
 *    - Confirmación antes de eliminar
 *    - DELETE a /api/categories/{id}
 *    - Limpia formulario si estaba editando esa categoría
 * 
 * CARACTERÍSTICAS CLAVE:
 * - Manejo de estados de carga y error
 * - Prevención de doble envío (disabled durante saving)
 * - Formulario dual (crear/editar con UI adaptativa)
 * - Validación de datos antes de enviar
 * - Recarga automática después de operaciones exitosas
 * - Links a rutas públicas de cada categoría
 * 
 * FLUJO DE DATOS:
 * 1. Usuario → Formulario → handleSubmit
 * 2. handleSubmit → API Route → Base de Datos
 * 3. Base de Datos → API Route → loadCategories
 * 4. loadCategories → Estado categories → UI actualizada
 * 
 * MEJORAS POTENCIALES:
 * - Paginación para muchas categorías
 * - Búsqueda/filtrado de categorías
 * - Arrastrar y soltar para reordenar
 * - Validación de slug único
 * - Toast notifications en vez de alert()
 * - Confirmación con modal custom en vez de confirm()
 */