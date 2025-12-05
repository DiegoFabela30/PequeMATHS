/**
 * Obtiene la información del usuario autenticado usando la cookie de sesión
 * creada por Firebase Authentication.
 * 
 * Este archivo:
 *  - Lee la cookie "__session" almacenada en el navegador.
 *  - Verifica la validez de la cookie usando Firebase Admin.
 *  - Decodifica el token para obtener datos del usuario.
 *  - Extrae los "custom claims" (como admin: true).
 *  - Regresa un objeto con la información del usuario autenticado.
 */

import { cookies } from "next/headers";     // Para leer cookies en el servidor con Next.js
import { adminAuth } from "./firebase-admin"; // Instancia del Firebase Admin SDK ya inicializada

/**
 * Interface del token decodificado que Firebase Admin devuelve.
 * Se agregan los campos mínimos que se usan en la app.
 */
interface DecodedToken {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  admin?: boolean; // Custom claim que indica si el usuario es administrador
}

/**
 * Obtiene al usuario autenticado desde la cookie de sesión ("__session").
 * 
 * @returns Un objeto con la información del usuario o null si:
 *  - No existe cookie
 *  - La cookie es inválida o ha expirado
 *  - Ocurre un error al validar el token
 */
export async function getSessionUser() {
  try {
    // 1. Leer la cookie "__session" usando Next.js (solo accesible desde el servidor)
    const cookieStore = await cookies();
    const session = cookieStore.get("__session")?.value;

    // Si no existe cookie, no hay sesión activa
    if (!session) return null;

    // 2. Verificar y decodificar la cookie de sesión
    // El segundo parámetro "true" obliga a validar si el token aún es válido
    const decoded = await adminAuth.verifySessionCookie(session, true) as DecodedToken;
    
    // Custom claims vienen incluidos en el token ya decodificado
    const isAdmin = decoded?.admin === true;

    // 3. Regresar toda la información necesaria del usuario
    return {
      uid: decoded.uid,
      email: decoded.email ?? "",
      name: decoded.name ?? "",
      picture: decoded.picture ?? "",
      admin: isAdmin
    };

  } catch {
    // Si falla la validación (cookie inválida, expirada o modificada) regresamos null
    return null;
  }
}
