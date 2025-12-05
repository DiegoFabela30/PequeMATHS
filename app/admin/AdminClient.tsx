"use client";

import { useEffect, useState } from 'react';

// Tipo para los usuarios recibidos desde la API interna
type User = { 
  uid: string; 
  email?: string; 
  displayName?: string; 
  admin?: boolean 
};

/**
 * Componente cliente del panel de administración.
 *
 * Este componente:
 *  - Obtiene la lista de usuarios desde el backend (/api/admin/users)
 *  - Permite cambiar el rol de administrador de cualquier usuario
 *  - Refresca la lista después de cada cambio
 *  - Muestra mensajes de éxito o error
 *
 * IMPORTANTE:
 *  Este archivo es un Client Component porque usa estados, hooks
 *  y hace fetch desde el navegador.
 */
export default function AdminClient() {

  // Lista de usuarios recibida desde la API
  const [users, setUsers] = useState<User[]>([]);

  // Estado de carga para mostrar "Cargando..."
  const [loading, setLoading] = useState(false);

  // Manejo de errores al cargar usuarios
  const [error, setError] = useState<string | null>(null);

  // Mensajes temporales de confirmación (cambios de rol)
  const [message, setMessage] = useState<string | null>(null);

  /**
   * Obtiene usuarios desde la API interna:
   * GET /api/admin/users
   *
   * Esta ruta está protegida en el backend y solo permite acceso a administradores.
   */
  async function fetchUsers() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();

      // Si el servidor devolvió error, lanzar excepción
      if (!res.ok) throw new Error(data?.error || 'Failed to load users');

      // Cargar los usuarios en el estado
      setUsers(data.users ?? []);

    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  // Ejecutar fetchUsers cuando el componente se monta
  useEffect(() => { fetchUsers(); }, []);

  /**
   * Alterna el rol admin de un usuario.
   *
   * Llama:
   *   POST /api/admin/set-admin
   *
   * Body:
   *   { uid: string, makeAdmin: boolean }
   *
   * Después de cambiar el rol, recarga la lista de usuarios.
   */
  async function toggleAdmin(uid: string, current: boolean) {
    try {
      const res = await fetch('/api/admin/set-admin', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, makeAdmin: !current })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || 'Failed to update admin role');

      // Mensaje temporal indicando que los cambios ya se aplicaron
      setMessage(`✅ Rol ${!current ? 'otorgado' : 'revocado'}. El usuario debe cerrar sesión y volver a iniciar para que los cambios tomen efecto.`);
      
      // Esconder mensaje después de 5 segundos
      setTimeout(() => setMessage(null), 5000);

      // Actualizar lista de usuarios
      fetchUsers();

    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  /**
   * Render del panel de administración.
   *
   * Muestra:
   *  - Lista de usuarios
   *  - Estado actual del rol admin
   *  - Botón para cambiar entre user/admin
   */
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Usuarios</h2>

      {/* Indicadores de carga o error */}
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Mensaje temporal de éxito */}
      {message && (
        <p className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {message}
        </p>
      )}

      {/* Lista de usuarios */}
      <div className="space-y-3">
        {users.map(u => (
          <div 
            key={u.uid} 
            className="flex items-center justify-between p-3 border rounded"
          >
            {/* Información del usuario */}
            <div>
              <div className="font-semibold">
                {u.displayName ?? u.email ?? u.uid}
              </div>
              <div className="text-sm text-gray-600">{u.email}</div>
            </div>

            {/* Rol + Botón para actualizar */}
            <div className="flex gap-2 items-center">

              {/* Chip de rol */}
              <div className={`px-3 py-1 rounded-full text-sm 
                ${u.admin ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {u.admin ? 'Admin' : 'User'}
              </div>

              {/* Botón de acción */}
              <button 
                onClick={() => toggleAdmin(u.uid, !!u.admin)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                {u.admin ? 'Quitar admin' : 'Hacer admin'}
              </button>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
