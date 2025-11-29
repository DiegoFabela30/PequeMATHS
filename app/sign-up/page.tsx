"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HeaderClient from "../componentes/HeaderClient";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential
} from "firebase/auth";
import { auth } from "../lib/firebase-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendSessionToServer(credential: UserCredential) {
    const idToken = await credential.user.getIdToken();
    await fetch("/api/sessionLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, remember: true }),
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

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

      // Crear usuario
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });

      await sendSessionToServer(cred);

      router.push("/");
    } catch (err) {
      console.error("Error al registrarse:", err);

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

  async function handleGoogleSignIn() {
    try {
      setError(null);
      setLoading(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

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

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Comic+Neue:wght@400;700&display=swap');

        .bubblegum-font {
          font-family: 'Bubblegum Sans', cursive;
        }

        body {
          font-family: 'Comic Neue', Arial, sans-serif;
        }

        @keyframes float-rotate {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        .animate-float-rotate {
          animation: float-rotate 8s ease-in-out infinite;
        }
      `}</style>

      <HeaderClient />

      <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100">
        
        <div className="absolute top-[10%] left-[5%] text-sky-400 text-5xl opacity-30 animate-float-rotate">🔢</div>
        <div className="absolute bottom-[15%] right-[10%] text-purple-400 text-4xl opacity-30 animate-float-rotate" style={{ animationDelay: "1s" }}>⭐</div>
        <div className="absolute top-[30%] right-[15%] text-pink-400 text-3xl opacity-30 animate-float-rotate" style={{ animationDelay: "2s" }}>➕</div>
        <div className="absolute bottom-[40%] left-[8%] text-yellow-400 text-4xl opacity-30 animate-float-rotate" style={{ animationDelay: "3s" }}>🎯</div>

        <div className="max-w-7xl mx-auto px-4 py-12 relative w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div className="text-center md:text-left">
              <h1 className="bubblegum-font text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-purple-500 via-pink-500 to-sky-500 bg-clip-text text-transparent">
                ¡Crea tu cuenta! 🎉
              </h1>

              <p className="mt-6 text-gray-700 text-xl font-medium">
                Únete y empieza a aprender matemáticas de forma divertida.
              </p>

              <div className="mt-8 p-4 bg-green-100 border-2 border-green-300 rounded-2xl shadow-md inline-block">
                <p className="text-sm text-gray-700 font-medium">
                  ¿Ya tienes cuenta?{" "}
                  <a href="/log-in" className="text-purple-600 hover:text-purple-700 font-bold underline decoration-wavy">
                    Inicia sesión aquí 🔐
                  </a>
                </p>
              </div>
            </div>

            <div className="w-full max-w-md mx-auto">
              <div className="bg-white border-4 border-sky-300 rounded-3xl p-8 shadow-2xl hover:shadow-[0_20px_60px_rgba(56,189,248,0.3)] transition-all duration-300">

                <header className="mb-8 text-center">
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 mb-4 shadow-lg">
                    <span className="text-4xl">📝</span>
                  </div>
                  <h2 className="bubblegum-font text-3xl font-bold text-gray-800">
                    Crear Cuenta
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 font-medium">
                    Llena tus datos para registrarte
                  </p>
                </header>

                <form onSubmit={onSubmit} className="space-y-5">
                  
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      👤 Nombre
                    </label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      className="w-full rounded-xl border-2 border-sky-300 bg-sky-50 px-4 py-3 text-gray-800 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      📧 Email
                    </label>
                    <input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full rounded-xl border-2 border-sky-300 bg-sky-50 px-4 py-3 text-gray-800 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      🔑 Contraseña
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="w-full rounded-xl border-2 border-sky-300 bg-sky-50 px-4 py-3 text-gray-800 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      ✔️ Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      placeholder="Repite la contraseña"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      disabled={loading}
                      className="w-full rounded-xl border-2 border-sky-300 bg-sky-50 px-4 py-3 text-gray-800 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200 transition-all"
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-100 border-2 border-red-400 p-3 text-sm text-red-800 font-medium animate-pulse">
                      ⚠️ {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="bubblegum-font w-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-bold px-6 py-4 text-lg shadow-lg hover:-translate-y-1 hover:scale-105 transition-all"
                  >
                    {loading ? "⏳ Creando cuenta..." : "🎉 Crear Cuenta"}
                  </button>
                </form>

                <div className="my-6 flex items-center gap-3">
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
                  <span className="text-sm text-gray-500 font-bold">o registrate con</span>
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full rounded-full border-2 border-gray-300 bg-white hover:bg-gray-50 px-4 py-3 font-bold text-gray-700 inline-flex items-center justify-center gap-3 shadow-md hover:-translate-y-1 hover:scale-105 transition-all"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M21.35 11.1h-9.18v2.98h5.27a4.52 4.52 0 0 1-1.95 2.96 6.06 6.06 0 0 1-3.32.96 6.06 6.06 0 0 1-4.28-1.78 6.26 6.26 0 0 1-1.76-4.4 6.25 6.25 0 0 1 1.76-4.4 6.06 6.06 0 0 1 4.28-1.78c1.46 0 2.78.5 3.82 1.33l2.1-2.1A9.3 9.3 0 0 0 12.17 2 9.1 9.1 0 0 0 5.7 4.7 9.25 9.25 0 0 0 3 11.82a9.25 9.25 0 0 0 2.7 7.12A9.1 9.1 0 0 0 12.17 22c2.49 0 4.57-.82 6.08-2.37 1.56-1.56 2.41-3.77 2.41-6.42 0-.68-.05-1.28-.31-2.11Z" />
                  </svg>
                  Google
                </button>

              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-sky-400 to-blue-500 py-8 text-center text-white font-medium">
        <p className="text-sm">© 2025 Proyecto para clase - Programación Web 🎓</p>
      </footer>
    </>
  );
}
