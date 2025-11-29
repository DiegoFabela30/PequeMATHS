import { redirect } from "next/navigation";
import { getSessionUser } from "@/app/lib/getSessionUser";

export default async function ProfilePage() {
  const user = await getSessionUser();

  // Si no hay usuario → Login
  if (!user) {
    redirect("/log-in");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          Perfil del Usuario
        </h2>

        <div className="flex flex-col items-center">
          {user.picture && (
            <img
              src={user.picture}
              alt="foto de perfil"
              className="w-24 h-24 rounded-full border shadow mb-4"
            />
          )}

          <p className="text-lg font-semibold mb-2">
            {user.name ?? "Sin nombre"}
          </p>

          <p className="text-gray-600 mb-6">{user.email}</p>
        </div>

        <form action="/api/sessionLogout" method="POST">
          <button
            type="submit"
            className="w-full py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
