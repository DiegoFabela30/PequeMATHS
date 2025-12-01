import { getSessionUser } from "@/app/lib/getSessionUser";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const user = await getSessionUser();

  return (
    <>
      <header className="w-full bg-gradient-to-r from-sky-400 to-blue-500 py-4 px-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-yellow-300">Peque</span>
            <span className="text-4xl font-bold text-white">MATHS</span>
          </div>
          <a href="/" className="bg-white text-blue-500 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 hover:text-blue-600 transition-all hover:scale-105">
            🏠 Inicio
          </a>
        </div>
      </header>

      <main className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-purple-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {user ? (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header del perfil */}
              <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-8 text-center">
                <h1 className="text-4xl font-bold text-white mb-2">👤 Mi Perfil</h1>
                <p className="text-sky-100">Personaliza tu cuenta y edita tus datos</p>
              </div>

              {/* Contenido */}
              <div className="p-8">
                <ProfileClient user={user} />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-red-400 to-pink-500 p-12 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">⚠️ No autenticado</h1>
                <p className="text-lg text-red-50 mb-8">No estás conectado. Inicia sesión para acceder a tu perfil.</p>
                <a
                  href="/log-in"
                  className="inline-block px-8 py-3 bg-white text-red-500 font-bold rounded-full hover:bg-red-50 hover:scale-105 transition-all shadow-lg"
                >
                  🔐 Iniciar sesión
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}