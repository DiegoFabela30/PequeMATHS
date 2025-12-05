"use client";

import { useState, useEffect } from "react";

type Shape = { name: string; emoji: string; color: string };
type Difficulty = 'facil' | 'normal' | 'dificil';

const shapes: Shape[] = [
  { name: 'círculo', emoji: '🔵', color: 'bg-blue-500' },
  { name: 'cuadrado', emoji: '🟦', color: 'bg-blue-600' },
  { name: 'triángulo', emoji: '🔺', color: 'bg-red-500' },
  { name: 'estrella', emoji: '⭐', color: 'bg-yellow-400' },
  { name: 'corazón', emoji: '❤', color: 'bg-pink-500' },
  { name: 'hexágono', emoji: '⬡', color: 'bg-purple-500' },
  { name: 'rombo', emoji: '🔶', color: 'bg-orange-500' },
  { name: 'óvalo', emoji: '🟠', color: 'bg-green-500' },
  { name: 'rectángulo', emoji: '▭', color: 'bg-emerald-400' },
  { name: 'pentágono', emoji: '⬟', color: 'bg-indigo-500' },
  { name: 'semicírculo', emoji: '◐', color: 'bg-teal-400' },
  { name: 'octágono', emoji: '🛑', color: 'bg-red-700' },
  { name: 'cuadrado claro', emoji: '⬜', color: 'bg-slate-300' },
  { name: 'cuadrado oscuro', emoji: '⬛', color: 'bg-slate-700' }
];

const characters: string[] = ['🦸‍♂', '🧚‍♀', '🧙‍♂', '🦊', '🐱', '🐶', '🐰', '🐼'];

export default function CazadorFormas() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentShape, setCurrentShape] = useState<Shape>(shapes[0]);
  const [displayedShapes, setDisplayedShapes] = useState<Shape[]>([]);
  const [correctScore, setCorrectScore] = useState(0);
  const [wrongScore, setWrongScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [character, setCharacter] = useState('🦸‍♂');
  const [feedback, setFeedback] = useState({ show: false, correct: false, message: '' });
  const [gameOver, setGameOver] = useState(false);
  const [clickedShape, setClickedShape] = useState<number | null>(null);

  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  function generateShapes() {
    if (!difficulty) return;

    // Determinar cuántas figuras mostrar según la dificultad
    const numShapes = 
      difficulty === 'facil' ? 3 :
      difficulty === 'normal' ? 5 : 7;

    // Seleccionar formas aleatorias únicas
    const shuffledShapes = shuffleArray([...shapes]);
    const selectedShapes = shuffledShapes.slice(0, numShapes);
    
    // Elegir una forma objetivo al azar
    const target = selectedShapes[Math.floor(Math.random() * selectedShapes.length)];
    setCurrentShape(target);

    // Mezclar las formas para mostrarlas
    setDisplayedShapes(shuffleArray(selectedShapes));
  }

  const startNewGame = () => {
    if (!difficulty) return;
    
    setCorrectScore(0);
    setWrongScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setGameOver(false);
    setCharacter(characters[Math.floor(Math.random() * characters.length)]);
    generateShapes();
  };

  const selectDifficulty = (diff: Difficulty) => {
    setDifficulty(diff);
    setCurrentLevel(1);
    setCorrectScore(0);
    setWrongScore(0);
    setTimeLeft(30);
    setGameActive(false);
    setGameOver(false);
  };

  useEffect(() => {
    if (difficulty && !gameActive && !gameOver) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generateShapes();
    }
  }, [difficulty]);

  useEffect(() => {
    if (!gameActive || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, gameOver]);

  function handleShapeClick(shape: Shape, index: number) {
    if (!gameActive) return;

    setClickedShape(index);
    setTimeout(() => setClickedShape(null), 300);

    if (shape.name === currentShape.name) {
      setCorrectScore(prev => prev + 1);
      setFeedback({
        show: true,
        correct: true,
        message: '¡Excelente! ¡Encontraste la forma correcta!'
      });

      setTimeout(() => {
        setFeedback({ show: false, correct: false, message: '' });
        generateShapes();
      }, 800);
    } else {
      setWrongScore(prev => prev + 1);
      setFeedback({
        show: true,
        correct: false,
        message: '¡Ups! Esa no es la forma que buscamos.'
      });

      setTimeout(() => {
        setFeedback({ show: false, correct: false, message: '' });
      }, 800);
    }
  }

  function nextLevel() {
    setCurrentLevel(prev => prev + 1);
    setGameOver(false);
    startNewGame();
  }

  // Pantalla de selección de dificultad
  if (!difficulty) {
    return (
      <>
        <header className="w-full bg-gradient-to-r from-pink-400 to-purple-500 py-4 px-6 shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-yellow-300">Peque</span>
              <span className="text-4xl font-bold text-white">MATHS</span>
            </div>
            <a
              href="/."
              className="bg-white text-purple-500 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 hover:text-purple-600 transition-all"
            >
              🏠 Inicio
            </a>
          </div>
        </header>

        <main className="flex-1 py-10 bg-gradient-to-br from-pink-100 to-purple-100 min-h-screen flex items-center justify-center">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-12">
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4 text-purple-600">🔷 Cazador de Formas</h1>
                <p className="text-xl text-gray-700">Selecciona tu nivel de dificultad</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => selectDifficulty('facil')}
                  className="bg-gradient-to-br from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  <div className="text-6xl mb-4">😊</div>
                  <h3 className="text-2xl font-bold mb-2">FÁCIL</h3>
                  <p className="text-sm opacity-90">Solo 3 figuras</p>
                  <p className="text-sm opacity-90">Perfecto para empezar</p>
                </button>

                <button
                  onClick={() => selectDifficulty('normal')}
                  className="bg-gradient-to-br from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  <div className="text-6xl mb-4">🤔</div>
                  <h3 className="text-2xl font-bold mb-2">NORMAL</h3>
                  <p className="text-sm opacity-90">5 figuras</p>
                  <p className="text-sm opacity-90">Un buen reto</p>
                </button>

                <button
                  onClick={() => selectDifficulty('dificil')}
                  className="bg-gradient-to-br from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  <div className="text-6xl mb-4">🔥</div>
                  <h3 className="text-2xl font-bold mb-2">LEGENDARIO</h3>
                  <p className="text-sm opacity-90">7 figuras</p>
                  <p className="text-sm opacity-90">Para expertos</p>
                </button>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <header className="w-full bg-gradient-to-r from-pink-400 to-purple-500 py-4 px-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-yellow-300">Peque</span>
            <span className="text-4xl font-bold text-white">MATHS</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setDifficulty(null);
                setGameActive(false);
                setGameOver(false);
              }}
              className="bg-white text-purple-500 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 hover:text-purple-600 transition-all"
            >
              🔄 Cambiar Dificultad
            </button>
            <a
              href="/."
              className="bg-white text-purple-500 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 hover:text-purple-600 transition-all"
            >
              🏠 Inicio
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10 bg-gradient-to-br from-pink-100 to-purple-100 min-h-screen">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-8 text-center">
              <h1 className="text-4xl font-bold mb-2 text-black">🔷 Cazador de Formas</h1>
              <p className="text-lg text-black">¡Encuentra todas las formas correctas antes de que se acabe el tiempo!</p>
              <div className="mt-4">
                <span className={`px-6 py-2 rounded-full font-bold text-lg ${
                  difficulty === 'facil' ? 'bg-green-500' :
                  difficulty === 'normal' ? 'bg-yellow-500' : 'bg-red-500'
                } text-white`}>
                  {difficulty === 'facil' ? '😊 FÁCIL' :
                   difficulty === 'normal' ? '🤔 NORMAL' : '🔥 LEGENDARIO'}
                </span>
              </div>
            </div>

            <div className="p-8">

              {/* Score Row */}
              <div className="flex justify-between mb-8 bg-gray-100 p-4 rounded-full">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-black">✅ Correctas:</span>
                  <span className="text-2xl text-green-600 font-bold">{correctScore}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-black">⏱ Tiempo:</span>
                  <span className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-600 animate-pulse" : "text-black"}`}>
                    {timeLeft}s
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-black">❌ Errores:</span>
                  <span className="text-2xl text-red-600 font-bold">{wrongScore}</span>
                </div>
              </div>

              {/* Target Shape */}
              <div className="mb-8 text-center">
                <div className="bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-2xl p-6 inline-block">
                  <p className="text-xl font-bold text-black mb-3">🎯 Busca esta forma:</p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-7xl">{currentShape.emoji}</span>
                    <div className="text-left">
                      <p className="text-3xl font-bold text-black capitalize">{currentShape.name}</p>
                      <p className="text-sm text-gray-700">¡Haz clic cuando la encuentres!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Grid */}
              <div className="relative bg-gradient-to-b from-sky-200 to-green-200 rounded-2xl p-8 mb-6 min-h-96 flex items-center justify-center">
                <div className="absolute top-4 left-4 text-6xl animate-bounce-slow">
                  {character}
                </div>

                {!gameActive && !gameOver ? (
                  <button
                    onClick={startNewGame}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-12 py-6 rounded-full font-bold text-2xl hover:scale-110 transition-transform shadow-2xl"
                  >
                    ▶️ Iniciar Juego
                  </button>
                ) : (
                  <div
                    className={`grid gap-4 ${
                      difficulty === 'facil' ? "grid-cols-3" :
                      difficulty === 'normal' ? "grid-cols-3" :
                      "grid-cols-4"
                    }`}
                  >
                    {displayedShapes.map((shape, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleShapeClick(shape, idx)}
                        className={`${shape.color} rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-110 transition-all cursor-pointer ${
                          clickedShape === idx ? "scale-90" : ""
                        }`}
                      >
                        <div className="text-6xl">{shape.emoji}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-center mb-4">
                <span className="bg-purple-500 text-white px-6 py-2 rounded-full font-bold text-lg">
                  Nivel {currentLevel}
                </span>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={startNewGame}
                  className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                >
                  🔄 Nuevo Juego
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Feedback Toast */}
      {feedback.show && (
        <div
          className={`fixed top-24 left-1/2 -translate-x-1/2 ${
            feedback.correct ? "bg-green-500" : "bg-red-500"
          } text-white px-8 py-4 rounded-full font-bold text-xl shadow-2xl animate-bounce z-50`}
        >
          {feedback.correct ? "✅" : "❌"} {feedback.message}
        </div>
      )}

      {/* Game Over */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center max-w-md animate-scale-in">
            <div className="text-7xl mb-4">
              {correctScore >= 15 ? "🏆" : correctScore >= 10 ? "⭐" : "😊"}
            </div>

            <h2 className="text-3xl font-bold mb-4 text-black">
              {correctScore >= 15
                ? "¡Increíble!"
                : correctScore >= 10
                ? "¡Muy Bien!"
                : "¡Buen Intento!"}
            </h2>

            <p className="mb-6 text-black">¡Se acabó el tiempo!</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-4xl font-bold text-green-600">{correctScore}</div>
                <div className="text-sm text-black">Correctas</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-red-600">{wrongScore}</div>
                <div className="text-sm text-black">Errores</div>
              </div>
            </div>

            <div className="flex gap-4">
              {correctScore >= 10 && (
                <button
                  onClick={nextLevel}
                  className="flex-1 bg-gradient-to-r from-purple-400 to-purple-500 text-white px-6 py-3 rounded-full font-bold"
                >
                  ➡ Siguiente Nivel
                </button>
              )}

              <button
                onClick={startNewGame}
                className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold"
              >
                🔄 Jugar de Nuevo
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}