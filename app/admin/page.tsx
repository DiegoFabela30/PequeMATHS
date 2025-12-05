import { getSessionUser } from '@/app/lib/getSessionUser';
import AdminClient from './AdminClient';
import { redirect } from 'next/navigation';

/**
 * Página principal del panel de administración.
 * 
 * Este archivo:
 *  - Valida si el usuario tiene una sesión activa mediante las cookies.
 *  - Verifica si el usuario tiene permisos de administrador (custom claim).
 *  - Si no cumple, redirige automáticamente.
 *  - Si cumple, renderiza la vista del administrador.
 * 
 * NOTA:
 *  Esta página es un Server Component y por eso se puede ejecutar
 *  lógica de seguridad en el servidor antes de enviar la vista.
 */

export default async function AdminPage() {

  // ============================================================
  // 1. Obtener usuario autenticado desde la cookie de sesión
  // ============================================================
  const user = await getSessionUser();
  
  // Si no existe sesión → redirigir al login
  if (!user) {
    console.log('[Admin] No session user found, redirecting to /log-in');
    redirect('/log-in');
  }
  
  // ============================================================
  // 2. Validar permisos de administrador (custom claim)
  // ============================================================
  // Si el usuario existe pero no tiene la flag admin → redirigir al home
  if (!user.admin) {
    console.log('[Admin] User', user.email, 'is not admin (admin flag:', user.admin, '), redirecting to /');
    redirect('/');
  }

  // Si llega aquí, significa que el usuario sí es admin
  console.log('[Admin] User', user.email, 'has admin access');

  // ============================================================
  // 3. Renderizar dashboard del administrador
  // ============================================================
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Contenedor principal del panel */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

          {/* Encabezado visual del panel */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 text-white">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm mt-1">Panel de control — gestión de usuarios</p>
          </div>

          {/* Sección interna del cliente */}
          <div className="p-6">
            {/* Componente que maneja funcionalidades con interactividad */}
            <AdminClient />
          </div>
        </div>
      </div>
    </main>
  );
}
