"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../lib/firebase-client";

/**
 * HeaderClient
 * --------------
 * Este es el componente de navegación principal del sitio.
 * 
 * 🔹 Es un Client Component porque:
 *   - Usa hooks de React (useState, useEffect)
 *   - Escucha cambios de estado en Firebase Auth
 *   - Necesita renderizado dinámico del usuario en el navegador
 * 
 * 🔹 Funciones principales:
 *   - Detecta si un usuario está autenticado usando Firebase Authentication.
 *   - Muestra botones de Login y Registro si NO hay sesión.
 *   - Muestra Perfil y Cerrar Sesión si SÍ hay sesión.
 *   - Escucha cambios en tiempo real (onAuthStateChanged):
 *        - Si el usuario inicia sesión → actualiza el header
 *        - Si el usuario cierra sesión → actualiza el header
 * 
 * 🔹 Este componente NO verifica roles de administrador.
 *    Solo muestra el estado de autenticación (user logged in/out).
 */

export default function HeaderClient() {

  /**
   * Estado local para guardar el usuario autenticado.
   * 
   * Firebase devuelve:
   *  - User → si hay sesión
   *  - null → si NO hay sesión
   */
  const [user, setUser] = useState<User | null>(null);

  /**
   * Se ejecuta una vez cuando el componente monta.
   * 
   * Configura un listener de Firebase que escucha en tiempo real
   * si el usuario inicia o cierra sesión.
   * 
   * onAuthStateChanged:
   *  - Se dispara cada vez que cambia el estado de autenticación.
   *  - Mantiene el header sincronizado con Firebase.
   */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));

    // Limpia el listener cuando el componente se desmonta
    return () => unsub();
  }, []);

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-xl shadow-lg">

      {/* LOGO + LINK A HOME */}
      <Link href="/" className="flex items-center gap-3">
        <Image 
          src="/imagenes/Logo_Navbar.png" 
          alt="PequeMaths" 
          width={120} 
          height={60} 
          className="rounded-md" 
        />
        <span className="text-2xl font-bold text-sky-600">PequeMaths</span>
      </Link>

      {/* BOTONES DEPENDIENDO DEL ESTADO DE SESIÓN */}
      <div className="flex items-center gap-4">

        {/* SI NO HAY USUARIO: mostrar login + registro */}
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

        /* SI HAY USUARIO: mostrar perfil + cerrar sesión */
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
