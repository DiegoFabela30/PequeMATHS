// app/dashboard/users/page.tsx

import { getSessionUser } from "@/app/lib/getSessionUser";
import { redirect } from "next/navigation";
import { adminAuth } from "@/app/lib/firebase-admin";

export const runtime = "nodejs";

export default async function UsersPage() {
  const user = await getSessionUser();

  // proteger ruta
  if (!user) redirect("/log-in");
  if (!user.admin) redirect("/");

  // obtener usuarios desde Firebase Admin
  const usersResult = await adminAuth.listUsers(1000);

  const users = usersResult.users.map((u) => ({
    uid: u.uid,
    name: u.displayName ?? "Sin nombre",
    email: u.email ?? "Sin correo",
    creationTime: u.metadata.creationTime,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-10">
      <div className="max-w-6xl mx-auto">

        {/* Título */}
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 drop-shadow-sm">
          👥 Usuarios Registrados
        </h1>

        <p className="text-lg text-gray-700 mb-10">
          Total de usuarios:{" "}
          <span className="font-semibold text-blue-600">{users.length}</span>
        </p>

        {/* CONTENEDOR DE USUARIOS */}
        <div className="space-y-6">
          {users.map((u) => (
            <div
              key={u.uid}
              className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">

                {/* Información */}
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

                {/* Fecha */}
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-sm text-gray-500">
                    📅 Creado el:{" "}
                    <span className="font-medium">
                      {new Date(u.creationTime!).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>

              {/* Separador */}
              <div className="mt-4 h-px bg-gray-200"></div>

              {/* UID */}
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
