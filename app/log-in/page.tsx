"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HeaderClient from "../componentes/HeaderClient";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential
} from "firebase/auth";
import { auth } from "../lib/firebase-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const cred: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/api/sessionLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, remember: true }),
      });

      if (!res.ok) {
        setError("Error al iniciar sesión");
        return;
      }

      router.push("/auth-redirect");
    } catch (err) {
      console.error("Login error:", err);
      setError("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await fetch("/api/sessionLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, remember: true }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al iniciar sesión con Google");
        return;
      }

      router.push("/auth-redirect");
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Error con Google. Verifica tu conexión o intenta más tarde");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Comic+Neue:wght@400;700&display=swap');
        .bubblegum-font { font-family: 'Bubblegum Sans', cursive; }

        @keyframes float-rotate {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float-rotate {
          animation: float-rotate 8s ease-in-out infinite;
        }
        @keyframes pop-in {
          0% { opacity: 0; transform: translateY(30px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-pop-in { animation: pop-in 0.8s ease-out; }
      `}</style>
      

      <HeaderClient />

      <section className="relative overflow-hidden min-h-screen flex items-center justify-center py-20">

        {/* Fondo degradado igual al Hero del Home */}
        <div className="absolute inset-0 bg-linear-to-br from-sky-400/80 via-blue-500/60 to-purple-500/70"></div>

        {/* Decoraciones flotantes */}
        <div className="absolute top-[10%] left-[5%] text-yellow-300 text-5xl opacity-70 z-10 animate-float-rotate" style={{animationDelay: '0s'}}>+</div>
        <div className="absolute bottom-[15%] right-[10%] text-green-400 text-4xl opacity-70 z-10 animate-float-rotate" style={{animationDelay: '1s'}}>●</div>
        <div className="absolute top-[20%] right-[8%] text-orange-400 text-3xl opacity-70 z-10 animate-float-rotate" style={{animationDelay: '2s'}}>■</div>
        <div className="absolute bottom-[25%] left-[8%] text-pink-300 text-4xl opacity-60 z-10 animate-float-rotate" style={{animationDelay: '1.5s'}}>★</div>

        {/* Tarjeta — igual a las del Home: bg-white rounded-3xl shadow-xl */}
        <div className="relative z-20 w-full max-w-md mx-4 animate-pop-in">
          <div className="bg-white rounded-3xl shadow-2xl p-10 hover:shadow-3xl hover:-translate-y-1 transition-all duration-500">

            {/* Emoji decorativo arriba */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-sky-400/10 flex items-center justify-center text-5xl">
                🔑
              </div>
            </div>

            <h2 className="bubblegum-font text-4xl text-center text-sky-500 mb-2"
                style={{textShadow: '2px 2px 0 rgba(0,0,0,0.06)'}}>
              ¡Bienvenido de vuelta!
            </h2>
            <p className="text-center text-slate-500 mb-8 text-sm">
              Inicia sesión para seguir jugando 🎮
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="📧 Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-full border-2 border-sky-200 focus:border-sky-400 focus:outline-none transition-colors duration-200 text-slate-700 placeholder:text-slate-400"
              />

              <input
                type="password"
                placeholder="🔒 Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-full border-2 border-sky-200 focus:border-sky-400 focus:outline-none transition-colors duration-200 text-slate-700 placeholder:text-slate-400"
              />

              {error && (
                <p className="text-red-500 text-center text-sm font-semibold bg-red-50 rounded-full py-2 px-4">
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bubblegum-font w-full bg-sky-400 hover:bg-sky-500 disabled:bg-sky-300 text-white text-xl py-4 rounded-full transition-all duration-300 hover:-translate-y-1 hover:scale-105 shadow-lg disabled:cursor-not-allowed"
              >
                {loading ? "Cargando..." : "¡Entrar! 🚀"}
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-slate-400 text-sm">o</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleSignIn}
                className="bubblegum-font w-full bg-orange-400 hover:bg-orange-500 disabled:bg-orange-300 text-white text-xl py-4 rounded-full transition-all duration-300 hover:-translate-y-1 hover:scale-105 shadow-lg disabled:cursor-not-allowed"
              >
                {loading ? "Cargando..." : "🌐 Entrar con Google"}
              </button>
            </form>

            <p className="text-center text-slate-500 text-sm mt-6">
              ¿No tienes cuenta?{" "}
              <a href="/sign-up" className="text-purple-500 font-bold hover:text-purple-600 transition-colors">
                ¡Regístrate aquí! 🎉
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
