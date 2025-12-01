"use client";

import Image from "next/image";
import HeaderClient from "./componentes/HeaderClient";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Comic+Neue:wght@400;700&family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap');
        
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
        
        @keyframes pop-in {
          0% { opacity: 0; transform: translateY(30px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        
        @keyframes fade-bottom {
          0% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-rotate {
          animation: float-rotate 8s ease-in-out infinite;
        }
        
        .animate-pop-in {
          animation: pop-in 1s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 1.5s ease-out;
        }
        
        .animate-bounce-in {
          animation: bounce-in 2s ease-out;
        }
        
        .reveal {
          opacity: 0;
          transition: all 1s ease-in-out;
        }
        
        .reveal.active {
          opacity: 1;
          animation: fade-bottom 1s ease-in-out;
        }
        
        .bubblegum-font {
          font-family: 'Bubblegum Sans', cursive;
        }
      `}</style>
     
      <HeaderClient />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/80 via-blue-500/60 to-purple-500/70"></div>
        
        {/* Decoraciones flotantes */}
        <div className="absolute top-[10%] left-[5%] text-yellow-300 text-5xl opacity-70 z-10 animate-float-rotate" style={{animationDelay: '0s'}}>+</div>
        <div className="absolute bottom-[15%] right-[10%] text-green-400 text-4xl opacity-70 z-10 animate-float-rotate" style={{animationDelay: '1s'}}>●</div>
        <div className="absolute top-[20%] right-[15%] text-orange-400 text-3xl opacity-70 z-10 animate-float-rotate" style={{animationDelay: '2s'}}>■</div>
        
        <div className="max-w-7xl mx-auto px-4 py-24 relative z-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="bubblegum-font text-4xl md:text-6xl font-extrabold leading-tight text-white animate-pop-in" style={{textShadow: '3px 3px 0 rgba(0,0,0,0.1)'}}>
                ¡Aprender <span className="text-yellow-300">matemáticas</span> nunca fue tan <span className="text-yellow-300">divertido</span>!
              </h1>
              <p className="mt-5 text-white text-lg animate-fade-in" style={{textShadow: '1px 1px 0 rgba(0,0,0,0.1)'}}>
                Juegos de memoria para niños de 7 a 15 años que refuerzan conceptos matemáticos básicos mientras se divierten.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a 
                  id="cta" 
                  href="#features" 
                  className="bubblegum-font inline-flex items-center rounded-full bg-green-400 hover:bg-green-500 text-white font-semibold px-8 py-4 text-xl shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 animate-bounce-in"
                >
                  Explora los Juegos →
                </a>
              </div>
            </div>  
            <div className="flex justify-center md:justify-end animate-fade-in">
              <div className="w-full max-w-md transform hover:rotate-2 hover:scale-105 transition-all duration-500">
                <Image 
                  src="/imagenes/Logo_Pequemaths.png" 
                  alt="Ilustración de niños aprendiendo matemáticas" 
                  width={720} 
                  height={560} 
                  className="rounded-3xl shadow-2xl" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías de Juegos */}
      <section id="features" className="w-full px-0 py-20 -mt-20">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-full relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'repeating-linear-gradient(45deg, #81C784 0px, #81C784 10px, transparent 10px, transparent 20px)', backgroundSize: '40px 40px'}}></div>
          
          <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
            <div className="text-center mb-12">
              <h2 className="reveal bubblegum-font text-4xl md:text-5xl font-bold mb-4 text-gray-800" style={{textShadow: '2px 2px 0 rgba(0,0,0,0.05)'}}>
                Categorías de juegos
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-orange-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              <article className="reveal flex flex-col items-center text-center hover:transform hover:scale-105 hover:-translate-y-4 hover:rotate-3 transition-all duration-400 bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="w-full h-32 bg-gradient-to-br from-sky-300 to-sky-400 flex items-center justify-center text-6xl relative overflow-hidden group">
                  <span className="relative z-10 transform group-hover:scale-125 transition-transform duration-300">🔢</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
                <div className="p-6">
                  <h3 className="bubblegum-font text-xl font-semibold text-slate-900 mb-4">Números</h3>
                  <a href="/juegos/encuentra-numero">
                    <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:-translate-y-1 shadow-md">
                      Juega
                    </button>
                  </a>
                </div>
              </article>

              <article className="reveal flex flex-col items-center text-center hover:transform hover:scale-105 hover:-translate-y-4 hover:rotate-3 transition-all duration-400 bg-white rounded-3xl shadow-xl overflow-hidden" style={{animationDelay: '0.2s'}}>
                <div className="w-full h-32 bg-gradient-to-br from-yellow-300 to-yellow-400 flex items-center justify-center text-6xl relative overflow-hidden group">
                  <span className="relative z-10 transform group-hover:scale-125 transition-transform duration-300 text-gray-800">➕</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
                <div className="p-6">
                  <h3 className="bubblegum-font text-xl font-semibold text-slate-900 mb-4">Sumas y restas</h3>
                  <a href="/juegos/suma-saltarina">
                    <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:-translate-y-1 shadow-md">
                      Juega
                    </button>
                  </a>
                </div>
              </article>

              <article className="reveal flex flex-col items-center text-center hover:transform hover:scale-105 hover:-translate-y-4 hover:rotate-3 transition-all duration-400 bg-white rounded-3xl shadow-xl overflow-hidden" style={{animationDelay: '0.4s'}}>
                <div className="w-full h-32 bg-gradient-to-br from-emerald-300 to-emerald-400 flex items-center justify-center text-6xl relative overflow-hidden group">
                  <span className="relative z-10 transform group-hover:scale-125 transition-transform duration-300">⭐</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
                <div className="p-6">
                  <h3 className="bubblegum-font text-xl font-semibold text-slate-900 mb-4">Formas</h3>
                  <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:-translate-y-1 shadow-md">
                    Juega
                  </button>
                </div>
              </article>

              <article className="reveal flex flex-col items-center text-center hover:transform hover:scale-105 hover:-translate-y-4 hover:rotate-3 transition-all duration-400 bg-white rounded-3xl shadow-xl overflow-hidden" style={{animationDelay: '0.6s'}}>
                <div className="w-full h-32 bg-gradient-to-br from-amber-300 to-amber-400 flex items-center justify-center text-6xl relative overflow-hidden group">
                  <span className="relative z-10 transform group-hover:scale-125 transition-transform duration-300">🧩</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
                <div className="p-6">
                  <h3 className="bubblegum-font text-xl font-semibold text-slate-900 mb-4">Patrones</h3>
                  <a href="/juegos/patron-perdido">
                  <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:-translate-y-1 shadow-md">
                    Juega
                  </button>
                  </a>
                </div>
              </article>

              <article className="reveal flex flex-col items-center text-center hover:transform hover:scale-105 hover:-translate-y-4 hover:rotate-3 transition-all duration-400 bg-white rounded-3xl shadow-xl overflow-hidden" style={{animationDelay: '0.8s'}}>
                <div className="w-full h-32 bg-gradient-to-br from-purple-300 to-purple-400 flex items-center justify-center text-6xl relative overflow-hidden group">
                  <span className="relative z-10 transform group-hover:scale-125 transition-transform duration-300">🧠</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
                <div className="p-6">
                  <h3 className="bubblegum-font text-xl font-semibold text-slate-900 mb-4">Memoria</h3>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:-translate-y-1 shadow-md">
                    Juega
                  </button>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Juegos por Edad */}
      <section id="age" className="w-full px-4 py-20 -mt-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'repeating-linear-gradient(0deg, #FFF176 0px, #FFF176 10px, transparent 10px, transparent 20px)', backgroundSize: '30px 30px'}}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-pink-300/60 to-pink-200/60 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="reveal bubblegum-font text-3xl md:text-4xl font-bold mb-4 text-gray-800">Juegos por edad</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-orange-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <article className="reveal rounded-3xl border-2 border-purple-400 bg-gradient-to-br from-purple-400/50 to-purple-300/50 p-6 hover:border-purple-600 hover:-translate-y-3 hover:shadow-2xl transition-all duration-400">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-4 bg-amber-300 text-2xl">
                  📚
                </div>
                <h3 className="bubblegum-font font-semibold text-2xl text-center text-gray-800 mb-2">7 a 9 años</h3>
                <p className="text-purple-700 font-semibold text-center mb-4">Segundo y Tercero</p>
                <p className="text-purple-800 mt-2 text-sm text-center mb-6">Patrones numéricos y preparación para multiplicación. Juegos más avanzados para niños que ya dominan conceptos básicos.</p>
                <button className="w-full bg-sky-400 hover:bg-sky-500 text-white font-semibold py-3 rounded-full transition-all duration-300 hover:-translate-y-1 shadow-md">
                  Ver juegos
                </button>
              </article>

              <article className="reveal rounded-3xl border-2 border-purple-400 bg-gradient-to-br from-purple-300/50 to-purple-200/50 p-6 hover:border-purple-600 hover:-translate-y-3 hover:shadow-2xl transition-all duration-400">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-4 bg-amber-300 text-2xl">
                  📐
                </div>
                <h3 className="bubblegum-font font-semibold text-2xl text-center text-gray-800 mb-2">10 a 12 años</h3>
                <p className="text-purple-700 font-semibold text-center mb-4">Cuarto y Quinto</p>
                <p className="text-purple-800 mt-2 text-sm text-center mb-6">Actividades con multiplicaciones, divisiones, fracciones básicas y geometría elemental. Diseñados para preparar a los niños para conceptos más abstractos.</p>
                <button className="w-full bg-green-400 hover:bg-green-500 text-white font-semibold py-3 rounded-full transition-all duration-300 hover:-translate-y-1 shadow-md">
                  Ver juegos
                </button>
              </article>

              <article className="reveal rounded-3xl border-2 border-purple-400 bg-gradient-to-br from-purple-200/50 to-purple-100/50 p-6 hover:border-purple-600 hover:-translate-y-3 hover:shadow-2xl transition-all duration-400">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-4 bg-amber-300 text-2xl">
                  🎓
                </div>
                <h3 className="bubblegum-font font-semibold text-2xl text-center text-gray-800 mb-2">13 a 15 años</h3>
                <p className="text-purple-700 font-semibold text-center mb-4">Secundaria</p>
                <p className="text-purple-800 mt-2 text-sm text-center mb-6">Ejercicios de álgebra básica, geometría analítica, potencias y raíces, estadística elemental y problemas de lógica, todos presentados de forma interactiva.</p>
                <button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-full transition-all duration-300 hover:-translate-y-1 shadow-md">
                  Ver juegos
                </button>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="why" className="w-full py-20 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'repeating-linear-gradient(45deg, #4FC3F7 0px, #4FC3F7 10px, transparent 10px, transparent 20px)', backgroundSize: '40px 40px'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="reveal bubblegum-font text-4xl md:text-5xl font-bold mb-4 text-gray-800">¿Por qué usar PequeMaths?</h2>
            <div className="w-20 h-1 bg-sky-400 rounded-full mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <article className="reveal flex flex-col items-center text-center bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-400 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-sky-400 transition-all duration-300 group-hover:h-2"></div>
              <div className="w-24 h-24 rounded-full bg-sky-400/10 flex items-center justify-center mb-6 text-5xl group-hover:bg-sky-400 group-hover:text-white transition-all duration-300">
                🎯
              </div>
              <h3 className="bubblegum-font text-xl font-semibold text-slate-900 mb-3">Motivación</h3>
              <p className="text-slate-600 text-sm">Aprender jugando aumenta el interés y la motivación de los niños, haciendo que el aprendizaje sea una experiencia positiva.</p>
            </article>

            <article className="reveal flex flex-col items-center text-center bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-400 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-sky-400 transition-all duration-300 group-hover:h-2"></div>
              <div className="w-24 h-24 rounded-full bg-sky-400/10 flex items-center justify-center mb-6 text-5xl group-hover:bg-sky-400 group-hover:text-white transition-all duration-300">
                👁
              </div>
              <h3 className="bubblegum-font text-xl font-semibold text-slate-900 mb-3">Atención</h3>
              <p className="text-slate-600 text-sm">Los juegos mejoran la concentración y el enfoque, ayudando a los niños a mantener la atención durante más tiempo.</p>
            </article>

            <article className="reveal flex flex-col items-center text-center bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-400 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-sky-400 transition-all duration-300 group-hover:h-2"></div>
              <div className="w-24 h-24 rounded-full bg-sky-400/10 flex items-center justify-center mb-6 text-5xl group-hover:bg-sky-400 group-hover:text-white transition-all duration-300">
                🧠
              </div>
              <h3 className="bubblegum-font text-xl font-semibold text-slate-900 mb-3">Memoria</h3>
              <p className="text-slate-600 text-sm">Fortalece la memoria a corto y largo plazo mediante actividades divertidas que estimulan diferentes áreas del cerebro.</p>
            </article>

            <article className="reveal flex flex-col items-center text-center bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-400 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-sky-400 transition-all duration-300 group-hover:h-2"></div>
              <div className="w-24 h-24 rounded-full bg-sky-400/10 flex items-center justify-center mb-6 text-5xl group-hover:bg-sky-400 group-hover:text-white transition-all duration-300">
                💡
              </div>
              <h3 className="bubblegum-font text-xl font-semibold text-slate-900 mb-3">Razonamiento</h3>
              <p className="text-slate-600 text-sm">Desarrolla el pensamiento lógico y la resolución de problemas, habilidades fundamentales para el éxito académico.</p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24 text-center relative overflow-hidden bg-gradient-to-br from-sky-400/90 to-blue-500/85">
        <div className="absolute top-[20%] left-[5%] text-white/20 text-5xl z-10 animate-float-rotate">+</div>
        <div className="absolute bottom-[15%] right-[10%] text-white/20 text-4xl z-10 animate-float-rotate" style={{animationDelay: '1s'}}>=</div>
        
        <div className="max-w-3xl mx-auto relative z-20">
          <h2 className="reveal bubblegum-font text-4xl md:text-5xl font-bold text-white mb-6" style={{textShadow: '2px 2px 0 rgba(0,0,0,0.1)'}}>
            ¡Únete a la aventura matemática hoy mismo!
          </h2>
          <p className="reveal text-white text-lg mb-8">Crea una cuenta gratuita y comienza a explorar todos nuestros juegos educativos diseñados por expertos en educación infantil</p>
          <button className="bubblegum-font inline-flex items-center gap-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:-translate-y-2 hover:scale-105 text-xl">
            👤 Crear cuenta
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer aria-label="Footer principal" className="w-full bg-gradient-to-r from-sky-400 to-blue-500 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'repeating-linear-gradient(0deg, #FFFFFF 0px, #FFFFFF 10px, transparent 10px, transparent 20px)', backgroundSize: '30px 30px'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="bubblegum-font text-3xl font-bold text-white mb-6 relative inline-block">
                Aprende Jugando
                <div className="absolute bottom-0 left-0 w-10 h-1 bg-yellow-300 rounded-full"></div>
              </h3>
              <p className="text-white text-sm leading-relaxed mb-6">Plataforma educativa para niños de 7 a 15 años que aprenden matemáticas jugando. Diseñada por educadores y psicólogos infantiles para garantizar una experiencia divertida y efectiva.</p>
              <div className="flex gap-4">
                {['F', 'T', 'I', 'Y'].map((social, idx) => (
                  <div key={idx} className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-sky-400 hover:-translate-y-2 transition-all duration-300 cursor-pointer font-bold">
                    {social}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="bubblegum-font text-2xl font-bold text-white mb-6 relative inline-block">
                Enlaces rápidos
                <div className="absolute bottom-0 left-0 w-10 h-1 bg-yellow-300 rounded-full"></div>
              </h3>
              <ul className="space-y-3">
                {[
                  { icon: '🏠', text: 'Inicio', href: '#Inicio' },
                  { icon: '🎮', text: 'Juegos', href: '#Juegos' },
                  { icon: '📞', text: 'Contacto', href: '#Contacto' },
                  { icon: 'ℹ', text: 'Sobre nosotros', href: '#Sobrenosotros' }
                ].map((link, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="text-yellow-300 text-xl">{link.icon}</span>
                    <a href={link.href} className="text-white hover:text-yellow-300 hover:pl-2 transition-all duration-300">{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white">© 2025 Aprende Jugando – Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </>
  );
}