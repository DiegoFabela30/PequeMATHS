"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../lib/firebase-client";

export default function HeaderClient() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-xl shadow-lg">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/imagenes/Logo_Navbar.png" alt="PequeMaths" width={120} height={60} className="rounded-md" />
        <span className="text-2xl font-bold text-sky-600">PequeMaths</span>
      </Link>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link href="/log-in" className="px-6 py-2 rounded-2xl bg-blue-500 text-white font-semibold">
              Iniciar sesión
            </Link>
            <Link href="/sign-up" className="px-6 py-2 rounded-2xl bg-purple-500 text-white font-semibold">
              Registrarme
            </Link>
          </>
        ) : (
          <>
            <Link href="/profile" className="px-6 py-2 rounded-2xl bg-green-500 text-white font-semibold">
              Perfil
            </Link>
            <button
              onClick={() => auth.signOut()}
              className="px-6 py-2 rounded-2xl bg-red-500 text-white font-semibold"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </header>
  );
}
