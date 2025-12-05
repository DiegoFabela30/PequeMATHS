/**
 * PÁGINA DE ADMINISTRACIÓN DE USUARIOS
 * ====================================
 * 
 * Propósito: Página protegida que muestra la lista completa de usuarios registrados
 * en Firebase Authentication. Solo accesible para usuarios con rol de administrador.
 * 
 */

import { getSessionUser } from "@/app/lib/getSessionUser";
import { redirect } from "next/navigation";
import { adminAuth } from "@/app/lib/firebase-admin";

/**
 * CONFIGURACIÓN DEL RUNTIME
 * =========================
 * Define que este componente se ejecutará en el entorno Node.js
 * (no en Edge Runtime). Necesario para usar Firebase Admin SDK que
 * requiere acceso completo a las APIs de Node.js
 */
export const runtime = "nodejs";

/**
 * COMPONENTE PRINCIPAL - UsersPage
 * ================================
 * 
 * Server Component asíncrono que:
 * 1. Verifica la autenticación y autorización del usuario
 * 2. Obtiene la lista de usuarios desde Firebase Admin
 * 3. Renderiza la información de manera visual
 * 
 * Flujo de seguridad:
 * - Si no hay usuario en sesión → redirige a /log-in
 * - Si el usuario no es admin → redirige a página principal /
 * - Si es admin → muestra la lista de usuarios
 */
export default async function UsersPage() {
  // ==========================================
  // 1. AUTENTICACIÓN Y AUTORIZACIÓN
  // ==========================================
  
  /**
   * Obtiene el usuario actual desde la sesión del servidor
   * Esta función verifica las cookies de sesión y retorna
   * los datos del usuario autenticado o null si no hay sesión
   */
  const user = await getSessionUser();

  /**
   * PROTECCIÓN DE RUTA - Nivel 1: Autenticación
   * Si no hay usuario logueado, redirige a la página de login
   */
  if (!user) redirect("/log-in");
  
  /**
   * PROTECCIÓN DE RUTA - Nivel 2: Autorización
   * Si el usuario existe pero no tiene el flag admin=true,
   * redirige a la página principal. Solo administradores pueden
   * ver esta página.
   */
  if (!user.admin) redirect("/");

  // ==========================================
  // 2. OBTENCIÓN DE DATOS DE USUARIOS
  // ==========================================
  
  /**
   * Obtiene lista de usuarios desde Firebase Admin SDK
   * 
   * adminAuth.listUsers(1000):
   * - Parámetro 1000: máximo de usuarios a obtener en una sola consulta
   * - Retorna un objeto con la lista de usuarios y metadata
   * - Requiere credenciales de administrador (Firebase Admin SDK)
   * 
   * Nota: Para producción con más de 1000 usuarios, se debería
   * implementar paginación usando el token pageToken
   */
  const usersResult = await adminAuth.listUsers(1000);

  /**
   * Transforma los datos de Firebase a un formato simplificado
   * 
   * Mapeo de datos:
   * - uid: identificador único del usuario en Firebase
   * - name: nombre del usuario (usa "Sin nombre" si no existe)
   * - email: correo electrónico (usa "Sin correo" si no existe)
   * - creationTime: fecha de registro del usuario
   * 
   * El operador ?? (nullish coalescing) asigna valores por defecto
   * cuando displayName o email son null o undefined
   */
  const users = usersResult.users.map((u) => ({
    uid: u.uid,
    name: u.displayName ?? "Sin nombre",
    email: u.email ?? "Sin correo",
    creationTime: u.metadata.creationTime,
  }));

  // ==========================================
  // 3. RENDERIZADO DE INTERFAZ
  // ==========================================
  
  /**
   * Retorna el JSX que muestra:
   * - Título de la página con el total de usuarios
   * - Lista de usuarios con su información básica
   * - Cada usuario muestra: avatar, nombre, email, fecha de creación y UID
   * 
   * Características de visualización:
   * - Diseño responsive (se adapta a móviles y escritorio)
   * - Efectos hover para mejor UX
   * - Formato de fecha localizado
   * - UID visible para referencia técnica
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 drop-shadow-sm">
          👥 Usuarios Registrados
        </h1>

        {/* Muestra el contador total de usuarios */}
        <p className="text-lg text-gray-700 mb-10">
          Total de usuarios:{" "}
          <span className="font-semibold text-blue-600">{users.length}</span>
        </p>

        {/* Itera sobre cada usuario y crea una tarjeta */}
        <div className="space-y-6">
          {users.map((u) => (
            <div
              key={u.uid}
              className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl shadow-md">
                    👤
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {u.name}
                    </h2>
                    <p className="text-gray-600 text-sm">{u.email}</p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-sm text-gray-500">
                    📅 Creado el:{" "}
                    <span className="font-medium">
                      {/* Convierte la fecha ISO a formato local legible */}
                      {new Date(u.creationTime!).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 h-px bg-gray-200"></div>

              {/* Muestra el UID para referencia técnica */}
              <p className="text-xs text-gray-400 mt-3 break-all">
                🔑 UID: {u.uid}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * RESUMEN DE FUNCIONALIDAD
 * =========================
 * 
 * Este archivo implementa una página de administración que:
 * 
 * 1. SEGURIDAD DE DOBLE CAPA:
 *    - Verifica que el usuario esté autenticado
 *    - Verifica que el usuario tenga permisos de administrador
 * 
 * 2. ACCESO PRIVILEGIADO A DATOS:
 *    - Usa Firebase Admin SDK (no el SDK cliente)
 *    - Puede acceder a datos de todos los usuarios
 *    - Ejecuta en servidor (Server Component)
 * 
 * 3. PRESENTACIÓN DE DATOS:
 *    - Lista hasta 1000 usuarios
 *    - Muestra información básica de cada usuario
 *    - Interfaz visual atractiva y responsive
 * 
 * CONSIDERACIONES DE SEGURIDAD:
 * - Solo ejecuta en servidor (nunca expone datos al cliente)
 * - Doble verificación de permisos
 * - No expone tokens ni credenciales sensibles
 * 
 * MEJORAS POTENCIALES:
 * - Implementar paginación para más de 1000 usuarios
 * - Agregar búsqueda y filtrado de usuarios
 * - Permitir edición/eliminación de usuarios
 * - Agregar logs de auditoría de acciones admin
 */