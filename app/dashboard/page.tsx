import { getSessionUser } from "@/app/lib/getSessionUser";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getSessionUser();

  // Si no hay sesión, redirige a login
  if (!user) {
    redirect("/log-in");
  }

  // Si no es admin, redirige a home
  if (!user.admin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-10">
      <div className="max-w-7xl mx-auto">

        {/* Encabezado */}
        <header className="mb-10">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
            Dashboard de Administrador
          </h1>

          <p className="mt-2 text-lg text-gray-700 font-medium">
            Bienvenido,{" "}
            <span className="font-semibold">{user.name || user.email}</span>
          </p>
        </header>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* CARD: Categorías */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-200 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-center w-16 h-16 mb-5 rounded-full bg-gradient-to-br from-pink-400 to-red-400 shadow-lg text-white text-3xl">
              🗂️
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Categorías</h2>
            <p className="text-gray-600 mb-5">
              Crea, edita o elimina las categorías para los niños.
            </p>
            <button className="w-full py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition">
              <a href="/dashboard/categories" >
                Configurar
              </a>
            </button>
          </div>

          {/* CARD 1: Gestión de usuarios */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-sky-200 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-center w-16 h-16 mb-5 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 shadow-lg text-white text-3xl">
              👥
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Gestión de Usuarios
            </h2>
            <p className="text-gray-600 mb-5">
              Administra permisos y cuentas del sistema.
            </p>
            <button className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition">
              Entrar
            </button>
          </div>

          {/* CARD 2: Analítica */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-200 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-center w-16 h-16 mb-5 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg text-white text-3xl">
              📊
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Analítica</h2>
            <p className="text-gray-600 mb-5">
              Consulta estadísticas y métricas importantes.
            </p>
            <button className="w-full py-3 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-600 transition">
              Ver estadísticas
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
