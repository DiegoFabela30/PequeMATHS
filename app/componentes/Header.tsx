import Link from "next/link";
import Image from "next/image";
import { getSessionUser } from "@/app/lib/getSessionUser";

export default async function Header() {
  const user = await getSessionUser();

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/imagenes/Logo_Navbar.png" 
          width={50}
          height={50}
          alt="PequeMaths Logo"
        />
        <span className="text-xl font-bold text-sky-600">PequeMaths</span>
      </Link>

      <nav className="flex items-center gap-4">
        {!user ? (
          <>
            <Link
              href="/log-in"
              className="px-4 py-2 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition"
            >
              Iniciar sesión
            </Link>

            <Link
              href="/sign-up"
              className="px-4 py-2 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition"
            >
              Registrarse
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/profile"
              className="px-4 py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition"
            >
              Mi Perfil
            </Link>

            <form action="/api/sessionLogout" method="POST">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
              >
                Cerrar sesión
              </button>
            </form>
          </>
        )}
      </nav>
    </header>
  );
}
