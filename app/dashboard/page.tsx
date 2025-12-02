import { getSessionUser } from '@/app/lib/getSessionUser';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getSessionUser();

  // Si no hay sesión, redirige a login
  if (!user) {
    redirect('/log-in');
  }

  // Si no es admin, redirige a home
  if (!user.admin) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard de Administrador</h1>
        <p className="text-gray-600 mb-8">Bienvenido, {user.name || user.email}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gestión de Usuarios</h2>
            <p className="text-gray-600">Accede a la sección de usuarios para gestionar permisos.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Analítica</h2>
            <p className="text-gray-600">Consulta las estadísticas y análisis del sistema.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Configuración</h2>
            <p className="text-gray-600">Ajusta los parámetros y configuración del sistema.</p>
          </div>
        </div>
      </div>
    </div>
  );
}