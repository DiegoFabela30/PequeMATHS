"use client";

import { useState, useEffect, useRef } from "react";

const icons = [
  "🐱", "🐶", "🦊", "🐸", "🐼",
  "🐵", "🐰", "🦁", "🐮", "🐷",
  "⭐", "❤️", "🍀", "🔥", "🎈"
];

export default function MemoriaMagica() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [options, setOptions] = useState<string[][]>([]);
  const [correctOption, setCorrectOption] = useState(0);

  const [showSequence, setShowSequence] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [correctScore, setCorrectScore] = useState(0);
  const [attemptsScore, setAttemptsScore] = useState(0);

  const [canSelect, setCanSelect] = useState(false);
  const sequenceTimerRef = useRef<number | null>(null);

  const [feedback, setFeedback] = useState({ show: false, correct: false, message: "" });
  const [levelComplete, setLevelComplete] = useState(false);

  const maxLevel = 5;

  // Inicializar juego
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    startLevel();
    return () => {
      if (sequenceTimerRef.current) {
        clearTimeout(sequenceTimerRef.current);
        sequenceTimerRef.current = null;
      }
    };
  }, []);

  function startLevel() {
    const length = 3 + currentLevel; // Secuencia crece por nivel
    const newSequence: string[] = [];

    for (let i = 0; i < length; i++) {
      // eslint-disable-next-line react-hooks/purity
      newSequence.push(icons[Math.floor(Math.random() * icons.length)]);
    }

    setSequence(newSequence);
    generateOptions(newSequence);
    setShowSequence(true);
    setCanSelect(false);

    const delay = 2500 + currentLevel * 500;
    if (sequenceTimerRef.current) {
      clearTimeout(sequenceTimerRef.current);
    }
    // @ts-ignore -- window.setTimeout returns number in browser
    sequenceTimerRef.current = window.setTimeout(() => {
      setShowSequence(false);
      setCanSelect(true);
      sequenceTimerRef.current = null;
    }, delay) as unknown as number;
  }

  function generateOptions(correctSeq: string[]) {
    const optionsTemp: string[][] = [correctSeq];

    while (optionsTemp.length < 3) {
      const fakeSeq = correctSeq.map(icon => {
        if (Math.random() < 0.5) return icons[Math.floor(Math.random() * icons.length)];
        return icon;
      });

      if (!optionsTemp.some(o => o.join("") === fakeSeq.join(""))) {
        optionsTemp.push(fakeSeq);
      }
    }

    const shuffled = optionsTemp.sort(() => Math.random() - 0.5);
    setOptions(shuffled);
    setCorrectOption(shuffled.findIndex(o => o.join("") === correctSeq.join("")));
  }

  function handleClick(index: number) {
    if (!canSelect) return;

    setAttemptsScore(prev => prev + 1);

    if (index === correctOption) {
      setCorrectScore(prev => prev + 1);

      setFeedback({
        show: true,
        correct: true,
        message: "¡Excelente memoria! 😄"
      });

      if (currentLevel >= maxLevel) {
        setTimeout(() => setLevelComplete(true), 1000);
      } else {
        setTimeout(() => {
          setCurrentLevel(prev => prev + 1);
          startLevel();
        }, 1500);
      }

    } else {
      setFeedback({
        show: true,
        correct: false,
        message: "No es la secuencia correcta 😢"
      });
    }
  }

  function closeFeedback() {
    setFeedback({ show: false, correct: false, message: "" });
  }

  function restartGame() {
    setCurrentLevel(1);
    setCorrectScore(0);
    setAttemptsScore(0);
    setLevelComplete(false);
    startLevel();
  }

  return (
    <>
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-purple-500 to-purple-600 py-4 px-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-yellow-300">Peque</span>
            <span className="text-4xl font-bold text-white">MATHS</span>
          </div>
          <a href="/." className="bg-white text-purple-500 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 hover:text-purple-600 transition-all hover:scale-105">
            🏠 Inicio
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-10 bg-gradient-to-br from-purple-100 to-pink-100 text-black">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* Título */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-8 text-center">
              <h1 className="text-4xl font-bold mb-2 text-black">✨ Memoria Mágica</h1>
              <p className="text-lg text-black">Recuerda la secuencia y elige la correcta 🧠</p>
            </div>

            <div className="p-8">

              {/* Stats */}
              <div className="flex justify-between mb-8 bg-gray-100 p-4 rounded-full">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-black">Aciertos:</span>
                  <span className="text-2xl text-black">{correctScore}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-black">Nivel:</span>
                  <span className="text-2xl text-black">{currentLevel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-black">Intentos:</span>
                  <span className="text-2xl text-black">{attemptsScore}</span>
                </div>
              </div>

              {/* Juego */}
              <div className="text-center mb-6">

                {/* Secuencia */}
                <div className="text-5xl mb-6">
                  {showSequence ? (
                    <div className="animate-pulse font-bold">
                      {sequence.join(" ")}
                    </div>
                  ) : (
                    <div className="text-xl text-gray-400">La secuencia se ocultó 👀</div>
                  )}
                </div>

                {/* Opciones */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleClick(i)}
                      disabled={!canSelect}
                      aria-disabled={!canSelect}
                      className={`bg-white rounded-2xl p-4 shadow-lg transition-all ${canSelect ? 'hover:shadow-xl hover:-translate-y-2 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                    >
                      <span className="text-4xl">{opt.join(" ")}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reiniciar */}
              <div className="flex justify-center">
                <button
                  onClick={restartGame}
                  className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105"
                >
                  🔄 Nuevo Juego
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Feedback */}
      {feedback.show && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center max-w-md animate-scale-in">
            <div className={`text-7xl mb-4 ${feedback.correct ? "text-green-500" : "text-red-500"}`}>
              {feedback.correct ? "😊" : "😢"}
            </div>
            <h2 className="text-2xl font-bold mb-4 text-black">{feedback.message}</h2>
            <button
              onClick={closeFeedback}
              className="bg-blue-500 text-white px-8 py-3 rounded-full font-bold"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Nivel Completado */}
      {levelComplete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center max-w-md animate-scale-in">
            <div className="text-7xl mb-4 text-yellow-400 animate-spin-slow">⭐</div>
            <h2 className="text-3xl font-bold mb-4 text-black">¡Juego Completado!</h2>

            <p className="mb-6 text-black">¡Increíble memoria!</p>

            <button
              onClick={restartGame}
              className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-6 py-3 rounded-full font-bold"
            >
              🔄 Jugar de nuevo
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        @keyframes spin {
          from { transform: rotate(0); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
      `}</style>
    </>
  );
}
