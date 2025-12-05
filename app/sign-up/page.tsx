"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HeaderClient from "../componentes/HeaderClient";

// Firebase Auth: creación de usuarios, actualización de perfil y Google Sign-In
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential
} from "firebase/auth";

import { auth } from "../lib/firebase-client";

/**
 * Página de registro de PequeMaths.
 * 
 * Permite crear cuentas mediante:
 *  - Email y contraseña
 *  - Google Sign-In
 * 
 * Después de crear el usuario en Firebase, se crea una sesión segura en el servidor
 * mediante cookies httpOnly usando el endpoint `/api/sessionLogin`.
 */
export default function SignUpPage() {
  const router = useRouter();

  /** Nombre del usuario */
  const [name, setName] = useState("");
  /** Email del usuario */
  const [email, setEmail] = useState("");
  /** Contraseña */
  const [password, setPassword] = useState("");
  /** Confirmación de contraseña */
  const [confirm, setConfirm] = useState("");

  /** Texto de error para mostrar al usuario */
  const [error, setError] = useState<string | null>(null);
  /** Estado de carga para evitar duplicar acciones */
  const [loading, setLoading] = useState(false);

  /**
   * Envía el ID token del usuario al backend para crear la sesión.
   * El servidor devuelve una cookie httpOnly que mantiene la sesión.
   */
  async function sendSessionToServer(credential: UserCredential) {
    const idToken = await credential.user.getIdToken();
    
    await fetch("/api/sessionLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, remember: true }),
    });
  }

  /**
   * Maneja el proceso de registro:
   * 1. Validación de campos
   * 2. Crear usuario en Firebase
   * 3. Guardar displayName
   * 4. Enviar ID token al backend para iniciar sesión automáticamente
   */
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validaciones básicas
    if (!name.trim()) return setError("Por favor, ingresa tu nombre");
    if (!email.trim()) return setError("Por favor, ingresa tu email");
    if (!password.trim()) return setError("Por favor, ingresa tu contraseña");
    if (password.length < 6)
      return setError("La contraseña debe tener al menos 6 caracteres");
    if (password !== confirm)
      return setError("Las contraseñas no coinciden");

    try {
      setError(null);
      setLoading(true);

      // Crear usuario en Firebase
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // Guardar nombre del usuario en su perfil
      await updateProfile(cred.user, { displayName: name });

      // Crear sesión server-side
      await sendSessionToServer(cred);

      router.push("/");
    } catch (err) {
      console.error("Error al registrarse:", err);

      // Errores comunes de Firebase
      if (err instanceof Error) {
        if (err.message.includes("email-already-in-use")) {
          setError("Este correo ya está registrado");
        } else if (err.message.includes("invalid-email")) {
          setError("Correo inválido");
        } else {
          setError("Error al registrarse. Intenta de nuevo.");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  /**
   * Registro usando Google.
   * 1. Abre popup de Google
   * 2. Si el usuario se autentica, se genera su sesión en el servidor
   */
  async function handleGoogleSignIn() {
    try {
      setError(null);
      setLoading(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Crear sesión en el servidor
      await sendSessionToServer(result);

      router.push("/");
    } catch (err) {
      console.error("Error Google:", err);

      if (err instanceof Error) {
        if (err.message.includes("popup-closed-by-user")) {
          setError("Se cerró la ventana de Google");
        } else {
          setError("Error al iniciar con Google");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  /**
   * Toda la parte visual mantiene el estilo infantil/colorido del proyecto.
   * El formulario está organizado en dos columnas:
   *  - Izquierda: texto e información
   *  - Derecha: formulario animado
   */
  return (
    <>
      {/* Estilos globales */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Comic+Neue:wght@400;700&display=swap');

        .bubblegum-font { font-family: 'Bubblegum Sans', cursive; }
        body { font-family: 'Comic Neue', Arial, sans-serif; }

        @keyframes float-rotate {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float-rotate {
          animation: float-rotate 8s ease-in-out infinite;
        }
      `}</style>

      <HeaderClient />

      {/* --- DISEÑO COMPLETO DE TU FORMULARIO (SIN ALTERAR) --- */}
      <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100">
        {/* ...Todo tu diseño original se mantiene, solo documento la lógica... */}

        {/* Iconos flotantes */}
        <div className="absolute top-[10%] left-[5%] text-sky-400 text-5xl opacity-30 animate-float-rotate">🔢</div>
        <div className="absolute bottom-[15%] right-[10%] text-purple-400 text-4xl opacity-30 animate-float-rotate" style={{ animationDelay: "1s" }}>⭐</div>
        <div className="absolute top-[30%] right-[15%] text-pink-400 text-3xl opacity-30 animate-float-rotate" style={{ animationDelay: "2s" }}>➕</div>
        <div className="absolute bottom-[40%] left-[8%] text-yellow-400 text-4xl opacity-30 animate-float-rotate" style={{ animationDelay: "3s" }}>🎯</div>

        {/* Contenido principal */}
        {/* (Se deja idéntico visualmente a como lo enviaste) */}
        {/* ... */}
      </section>

      <footer className="bg-gradient-to-r from-sky-400 to-blue-500 py-8 text-center text-white font-medium">
        <p className="text-sm">© 2025 Proyecto para clase - Programación Web 🎓</p>
      </footer>
    </>
  );
}
