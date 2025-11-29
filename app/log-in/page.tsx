"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HeaderClient from "../componentes/HeaderClient";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, type UserCredential } from "firebase/auth";
import { auth } from "../lib/firebase-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setError("Por favor, ingresa tu email");
      return;
    }
    if (!password.trim()) {
      setError("Por favor, ingresa tu contraseña");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const cred: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario autenticado:", cred.user);
      
      // Crear sesión server
      const idToken = await cred.user.getIdToken();
      await fetch("/api/sessionLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, remember: true }),
      });
      
      router.push("/");
    } catch (err: unknown) {
      console.error("Error al iniciar sesión:", err);
      if (err instanceof Error) {
        if (err.message.includes("user-not-found")) {
          setError("No existe una cuenta con este email");
        } else if (err.message.includes("wrong-password")) {
          setError("Contraseña incorrecta");
        } else if (err.message.includes("invalid-email")) {
          setError("Email inválido");
        } else if (err.message.includes("invalid-credential")) {
          setError("Email o contraseña incorrectos");
        } else {
          setError("Error al iniciar sesión. Por favor, intenta de nuevo.");
        }
      } else {
        setError("Error desconocido al iniciar sesión.");
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
      const result: UserCredential = await signInWithPopup(auth, provider);
      console.log("Usuario autenticado con Google:", result.user);
      
      // Crear sesión server
      const idToken = await result.user.getIdToken();
      await fetch("/api/sessionLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, remember: true }),
      });
      
      router.push("/");
    } catch (err: unknown) {
      console.error("Error al iniciar sesión con Google:", err);
      if (err instanceof Error) {
        if (err.message.includes("popup-closed-by-user")) {
          setError("Inicio de sesión cancelado");
        } else {
          setError("Error al iniciar sesión con Google. Por favor, intenta de nuevo.");
        }
      } else {
        setError("Error desconocido con Google Sign-In.");
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
          font-family: 'Comic Neue', 'Quicksand', Arial, sans-serif;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
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
        {/* Decoraciones flotantes */}
        <div className="absolute top-[10%] left-[5%] text-sky-400 text-5xl opacity-30 z-10 animate-float-rotate">🔢</div>
        <div className="absolute bottom-[15%] right-[10%] text-purple-400 text-4xl opacity-30 z-10 animate-float-rotate" style={{animationDelay: '1s'}}>⭐</div>
        <div className="absolute top-[30%] right-[15%] text-pink-400 text-3xl opacity-30 z-10 animate-float-rotate" style={{animationDelay: '2s'}}>➕</div>
        <div className="absolute bottom-[40%] left-[8%] text-yellow-400 text-4xl opacity-30 z-10 animate-float-rotate" style={{animationDelay: '3s'}}>🎯</div>
        
        <div className="max-w-7xl mx-auto px-4 py-12 relative w-full z-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Columna izquierda - Información */}
            <div className="text-center md:text-left">
              <h1 className="bubblegum-font text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 bg-clip-text text-transparent" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.1)'}}>
                ¡Bienvenido de vuelta! 👋
              </h1>
              <p className="mt-6 text-gray-700 text-xl font-medium">
                Continúa tu aventura de aprendizaje con matemáticas divertidas
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <a 
                  href="/page.tsx" 
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-bold px-6 py-3 shadow-lg hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                >
                  <span>🎮</span> Ver Juegos
                </a>
                <a 
                  href="/app/page.tsx" 
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-6 py-3 shadow-lg hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                >
                  <span>✨</span> Beneficios
                </a>
              </div>
              
              <div className="mt-8 p-4 bg-yellow-100 border-2 border-yellow-300 rounded-2xl shadow-md inline-block">
                <p className="text-sm text-gray-700 font-medium">
                  ¿No tienes cuenta? 
                  <a href="/sign-up" className="ml-2 text-purple-600 hover:text-purple-700 font-bold underline decoration-wavy decoration-purple-400">
                    Regístrate gratis aquí 🎉
                  </a>
                </p>
              </div>
            </div>

            {/* Columna derecha - Formulario */}
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white border-4 border-purple-300 rounded-3xl p-8 shadow-2xl hover:shadow-[0_20px_60px_rgba(168,85,247,0.3)] transition-all duration-300">
                <header className="mb-8 text-center">
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-sky-400 to-purple-500 mb-4 shadow-lg">
                    <span className="text-4xl">🔐</span>
                  </div>
                  <h2 className="bubblegum-font text-3xl font-bold text-gray-800">Iniciar Sesión</h2>
                  <p className="mt-2 text-sm text-gray-600 font-medium">
                    Ingresa tus credenciales para continuar
                  </p>
                </header>

                <form className="space-y-5" onSubmit={onSubmit}>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-bold text-gray-700"
                    >
                      📧 Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="tucorreo@ejemplo.com"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full rounded-xl border-2 border-purple-300 bg-purple-50/50 px-4 py-3 text-gray-800 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                    />
                  </div>
                  
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-bold text-gray-700"
                    >
                      🔑 Contraseña
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="w-full rounded-xl border-2 border-purple-300 bg-purple-50/50 px-4 py-3 text-gray-800 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="inline-flex items-center gap-2 text-gray-700 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-2 border-purple-300 text-purple-500 focus:ring-purple-400 cursor-pointer"
                      />
                      Recordarme
                    </label>
                    <a href="/forgot-password" className="text-purple-600 hover:text-purple-700 font-bold hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-100 border-2 border-red-400 p-3 text-sm text-red-800 font-medium animate-pulse">
                      ⚠️ {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="bubblegum-font w-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold px-6 py-4 text-lg shadow-lg hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300"
                  >
                    {loading ? "⏳ Iniciando sesión..." : "🚀 Iniciar Sesión"}
                  </button>
                </form>

                <div className="my-6 flex items-center gap-3">
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
                  <span className="text-sm text-gray-500 font-bold">o continúa con</span>
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full rounded-full border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 px-4 py-3 font-bold text-gray-700 inline-flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                  type="button"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                    fill="currentColor"
                  >
                    <path d="M21.35 11.1h-9.18v2.98h5.27a4.52 4.52 0 0 1-1.95 2.96 6.06 6.06 0 0 1-3.32.96 6.06 6.06 0 0 1-4.28-1.78 6.26 6.26 0 0 1-1.76-4.4 6.25 6.25 0 0 1 1.76-4.4 6.06 6.06 0 0 1 4.28-1.78c1.46 0 2.78.5 3.82 1.33l2.1-2.1A9.3 9.3 0 0 0 12.17 2 9.1 9.1 0 0 0 5.7 4.7 9.25 9.25 0 0 0 3 11.82a9.25 9.25 0 0 0 2.7 7.12A9.1 9.1 0 0 0 12.17 22c2.49 0 4.57-.82 6.08-2.37 1.56-1.56 2.41-3.77 2.41-6.42 0-.68-.05-1.28-.31-2.11Z" />
                  </svg>
                  {loading ? "Procesando..." : "Google"}
                </button>

                <p className="mt-8 text-center text-sm text-gray-600 font-medium">
                  ¿No tienes cuenta?{" "}
                  <a
                    href="/sign-up"
                    className="text-purple-600 hover:text-purple-700 font-bold underline decoration-wavy decoration-purple-400"
                  >
                    Regístrate aquí 🎉
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-sky-400 to-blue-500 py-8 text-center text-white font-medium">
        <p className="text-sm">
          © 2025 Proyecto para clase - Programación web 🎓
        </p>
      </footer>
    </>
  );
}
