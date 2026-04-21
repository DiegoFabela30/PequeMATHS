import { getSessionUser } from '@/app/lib/getSessionUser';
import { redirect } from 'next/navigation';

/**
 * Página intermedia de redirección después del login.
 *
 * Esta página verifica si el usuario autenticado tiene permisos de administrador
 * y lo redirige al dashboard correspondiente:
 * - Admin: /dashboard
 * - Usuario regular: /
 */
export default async function AuthRedirectPage() {
  // Obtener el usuario de la sesión
  const user = await getSessionUser();

  // Si no hay sesión, redirigir al login
  if (!user) {
    redirect('/log-in');
  }

  // Si es administrador, redirigir al dashboard
  if (user.admin) {
    redirect('/dashboard');
  }

  // Si es usuario regular, redirigir al home
  redirect('/');
}