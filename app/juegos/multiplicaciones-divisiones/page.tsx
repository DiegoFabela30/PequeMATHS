"use client";

import { useState, useEffect } from "react";

const characters = ['🦸‍♂️', '🧚‍♀️', '🧙‍♂️', '🦊', '🐱', '🐶', '🐰', '🐼'];

function randInt(min: number, max: number) {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  if (hi < lo) return lo; // fallback
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

export default function MultiDivSaltarina() {
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [correctScore, setCorrectScore] = useState(0);
  const [attemptsScore, setAttemptsScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentOperation, setCurrentOperation] = useState(0);
  const [character, setCharacter] = useState('🦸‍♂️');

  const [operation, setOperation] = useState({ num1: 0, num2: 0, type: 'x' });
  const [answers, setAnswers] = useState<number[]>([]);
  
  const [gameActive, setGameActive] = useState(true);
  const [feedback, setFeedback] = useState({ show: false, correct: false, message: '' });
  const [levelComplete, setLevelComplete] = useState(false);
  const [jumping, setJumping] = useState(false);

  const maxLevel = 5;
  const operationsPerLevel = 5;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    startNewGame();
  }, []);

  function startNewGame() {
    setCorrectScore(0);
    setAttemptsScore(0);
    setCurrentOperation(0);
    setGameActive(true);
    setLevelComplete(false);
    // eslint-disable-next-line react-hooks/purity
    setCharacter(characters[Math.floor(Math.random() * characters.length)]);
    setCharacter(characters[randInt(0, characters.length - 1)]);
    
    generateOperation();
  }

  function generateOperation() {
    let maxNumber = 10;
    if (currentLevel === 2) maxNumber = 15;
    if (currentLevel >= 3) maxNumber = 20;

    const isMultiplication = randInt(0, 1) === 1;

    if (isMultiplication) {
      const num1 = randInt(1, maxNumber);
      const num2 = randInt(1, maxNumber);
      const product = num1 * num2;

      setOperation({ num1, num2, type: '×' });
      setCorrectAnswer(product);
      setAnswers(generateAnswers(product, Math.max(maxNumber, Math.ceil(product / 2))));
    } else {
      // For division, choose a divisor and a quotient so the dividend is exact
      const divisor = randInt(1, Math.max(1, maxNumber - 1));
      const quotient = randInt(1, maxNumber);
      const dividend = divisor * quotient;

      setOperation({ num1: dividend, num2: divisor, type: '÷' });
      setCorrectAnswer(quotient);
      setAnswers(generateAnswers(quotient, Math.max(maxNumber, quotient + 5)));
    }
  }

  function generateAnswers(correctAnswer: number, maxNumber: number) {
    const answers = [correctAnswer];

    const range = Math.max(3, Math.floor(maxNumber / 2));
    while (answers.length < 3) {
      // generate plausible distractors near the correct answer
      const offset = randInt(-range, range);
      let incorrect = correctAnswer + offset;
      if (incorrect <= 0) incorrect = Math.abs(incorrect) + 1;
      if (!answers.includes(incorrect)) answers.push(incorrect);
    }

    return shuffleArray(answers);
  }

  function shuffleArray(array: number[]) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  function handleCloudClick(selectedAnswer: number) {
    if (!gameActive) return;

    setAttemptsScore(prev => prev + 1);

    if (selectedAnswer === correctAnswer) {
      setCorrectScore(prev => prev + 1);
      setJumping(true);
      setTimeout(() => setJumping(false), 1000);
      
      setFeedback({
        show: true,
        correct: true,
        message: '¡Excelente! ¡Muy bien!'
      });

      const newOperation = currentOperation + 1;
      setCurrentOperation(newOperation);

      if (newOperation >= operationsPerLevel) {
        setGameActive(false);
        setTimeout(() => setLevelComplete(true), 1500);
      }
    } else {
      setFeedback({
        show: true,
        correct: false,
        message: 'Ups, respuesta incorrecta.'
      });
    }
  }

  function closeFeedback() {
    setFeedback({ show: false, correct: false, message: '' });
    if (gameActive) generateOperation();
  }

  function nextLevel() {
    setLevelComplete(false);
    setCurrentLevel(prev => prev < maxLevel ? prev + 1 : 1);
    startNewGame();
  }

  function showHint() {
  const clouds = document.querySelectorAll('.cloud');

  clouds.forEach((cloud) => {
    const cloudAnswer = parseInt(cloud.getAttribute('data-answer') || '0');

    if (cloudAnswer === correctAnswer) {
      const el = cloud as HTMLElement;

      el.style.transition = "all 0.4s ease";
      el.style.transform = "scale(1.25)";
      el.style.boxShadow = "0 0 35px 15px rgba(0,255,0,0.9)";
      el.style.border = "4px solid #00ff00";
      el.style.backgroundColor = "#d4ffd4";

      setTimeout(() => {
        el.style.transform = "";
        el.style.boxShadow = "";
        el.style.border = "";
        el.style.backgroundColor = "";
      }, 1200);
    }
  });
}


  return (
    <>
      {/* HEADER */}
      <header className="w-full bg-gradient-to-r from-red-400 to-red-500 py-4 px-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-yellow-300">Peque</span>
            <span className="text-4xl font-bold text-white">MATHS</span>
          </div>
          <a href="/." className="bg-white text-red-500 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 hover:text-red-600 transition-all">
            🏠 Inicio
          </a>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 py-10 bg-gradient-to-br from-red-100 to-orange-100">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8 text-center">
              <h1 className="text-4xl font-bold mb-2 text-black">✖ ➗ Multiplicación y División Saltarina</h1>
              <p className="text-lg text-black">¡Elige la nube con el resultado correcto!</p>
            </div>

            {/* CONTENT */}
            <div className="p-8">

              {/* SCORE */}
              <div className="flex justify-between mb-8 bg-gray-100 p-4 rounded-full">
                <span className="font-bold text-black">Aciertos: {correctScore}</span>
                <span className="font-bold text-black">Nivel: {currentLevel}</span>
                <span className="font-bold text-black">Intentos: {attemptsScore}</span>
              </div>

              {/* GAME */}
              <div className="relative h-80 bg-gradient-to-b from-orange-200 to-orange-300 rounded-2xl mb-6 overflow-hidden">
                
                {/* Operation */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2">
                  <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl text-3xl font-bold text-black">
                    {operation.num1} {operation.type} {operation.num2} = ?
                  </div>
                </div>

                {/* Character */}
                <div className={`absolute bottom-32 left-12 text-6xl transition-all duration-500 ${jumping ? 'animate-jump' : ''}`}>
                  {character}
                </div>

                {/* Clouds */}
                <div className="absolute bottom-12 left-0 right-0 flex justify-around px-8">
                  {answers.map((answer, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCloudClick(answer)}
                      data-answer={answer}
                      className="cloud bg-white rounded-3xl px-6 py-4 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer"
                    >
                      <div className="text-3xl font-bold text-black">{answer}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CONTROLS */}
              <div className="flex justify-center gap-4">
                <button onClick={startNewGame} className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                  🔄 Nuevo Juego
                </button>
                <button onClick={showHint} className="bg-gradient-to-r from-red-400 to-red-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                  💡 Pista
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FEEDBACK */}
      {feedback.show && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center max-w-md animate-scale-in">
            <div className={`text-7xl mb-4 ${feedback.correct ? 'text-green-500' : 'text-red-500'}`}>
              {feedback.correct ? '😁' : '😢'}
            </div>
            <h2 className="text-2xl font-bold mb-4 text-black">{feedback.message}</h2>
            <button 
              onClick={closeFeedback}
              className="bg-red-500 text-white px-8 py-3 rounded-full font-bold hover:bg-red-600"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* LEVEL COMPLETE */}
      {levelComplete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center max-w-md animate-scale-in">
            <div className="text-7xl mb-4 text-yellow-400 animate-spin-slow">⭐</div>
            <h2 className="text-3xl font-bold mb-4 text-black">¡Nivel Completado!</h2>

            <p className="mb-6 text-black">¡Excelente trabajo!</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div><div className="text-3xl font-bold">{correctScore}</div><p>Aciertos</p></div>
              <div><div className="text-3xl font-bold">{currentLevel}</div><p>Nivel</p></div>
              <div><div className="text-3xl font-bold">{attemptsScore}</div><p>Intentos</p></div>
            </div>

            <div className="flex gap-4">
              <button onClick={nextLevel} className="flex-1 bg-red-500 text-white px-6 py-3 rounded-full font-bold">
                ➡️ Siguiente Nivel
              </button>
              <button onClick={startNewGame} className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-full font-bold">
                🔄 Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANIMACIONES */}
      <style jsx global>{`
        @keyframes jump {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-70px); }
        }
        .animate-jump {
          animation: jump 1s ease-in-out;
        }
        @keyframes scale-in {
          from { transform: scale(0.7); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
      `}</style>
    </>
  );
}
