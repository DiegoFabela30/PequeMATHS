"use client";

import { useState, useEffect } from "react";

const characters = ['🧩', '🔍', '🧠', '🦊', '🐱', '🦉', '🐰', '🐼', '🐵', ''];

export default function PatronPerdido() {
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [correctScore, setCorrectScore] = useState(0);
  const [attemptsScore, setAttemptsScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentPattern, setCurrentPattern] = useState(0);
  const [character, setCharacter] = useState('🧩');
  const [sequence, setSequence] = useState<(number | null)[]>([]);
  const [missingIndex, setMissingIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [gameActive, setGameActive] = useState(true);
  const [feedback, setFeedback] = useState({ show: false, correct: false, message: '' });
  const [levelComplete, setLevelComplete] = useState(false);
  const [jumping, setJumping] = useState(false);

  const maxLevel = 5;
  const patternsPerLevel = 5;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    startNewGame();
  }, []);

  function startNewGame() {
    setCorrectScore(0);
    setAttemptsScore(0);
    setCurrentPattern(0);
    setGameActive(true);
    setLevelComplete(false);
    
    // eslint-disable-next-line react-hooks/purity
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    setCharacter(randomCharacter);
    
    generatePattern();
  }

  function generatePattern() {
    let patternType = 'arithmetic';
    if (currentLevel >= 3) {
      // eslint-disable-next-line react-hooks/purity
      patternType = Math.random() < 0.5 ? 'arithmetic' : 'geometric';
    }

    if (patternType === 'arithmetic') {
      generateArithmeticPattern();
    } else {
      generateGeometricPattern();
    }
  }

  function generateArithmeticPattern() {
    let increment = 1;
    if (currentLevel === 2) increment = 2;
    if (currentLevel === 3) increment = 3;
    if (currentLevel === 4) increment = 5;
    if (currentLevel === 5) increment = 10;

    // eslint-disable-next-line react-hooks/purity
    const start = Math.floor(Math.random() * 10) + 1;
    const newSequence = [];
    
    for (let i = 0; i < 5; i++) {
      newSequence.push(start + (i * increment));
    }

    // eslint-disable-next-line react-hooks/purity
    const missing = Math.floor(Math.random() * 3) + 1;
    const correct = newSequence[missing];
    
    setCorrectAnswer(correct);
    setMissingIndex(missing);
    newSequence[missing] = null;
    setSequence(newSequence);
    
    const generatedAnswers = generateAnswers(correct);
    setAnswers(generatedAnswers);
  }

  function generateGeometricPattern() {
    let multiplier = 2;
    if (currentLevel === 4) multiplier = 3;
    if (currentLevel === 5) multiplier = 4;

    // eslint-disable-next-line react-hooks/purity
    const start = Math.floor(Math.random() * 3) + 1;
    const newSequence = [];
    
    for (let i = 0; i < 5; i++) {
      newSequence.push(start * Math.pow(multiplier, i));
    }
    // eslint-disable-next-line react-hooks/purity
    const missing = Math.floor(Math.random() * 3) + 1;
    const correct = newSequence[missing];
    
    setCorrectAnswer(correct);
    setMissingIndex(missing);
    newSequence[missing] = null;
    setSequence(newSequence);
    
    const generatedAnswers = generateAnswers(correct);
    setAnswers(generatedAnswers);
  }

  function generateAnswers(correctAnswer: number) {
    const answers = [correctAnswer];
    
    while (answers.length < 3) {
      // eslint-disable-next-line react-hooks/purity
      const offset = Math.floor(Math.random() * 5) + 1;
      // eslint-disable-next-line react-hooks/purity
      const sign = Math.random() < 0.5 ? 1 : -1;
      const incorrectAnswer = correctAnswer + (offset * sign);
      
      if (incorrectAnswer > 0 && !answers.includes(incorrectAnswer)) {
        answers.push(incorrectAnswer);
      }
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

  function handleOptionClick(selectedAnswer: number) {
    if (!gameActive) return;

    setAttemptsScore(prev => prev + 1);

    if (selectedAnswer === correctAnswer) {
      setCorrectScore(prev => prev + 1);
      setJumping(true);
      setTimeout(() => setJumping(false), 1000);
      
      setFeedback({
        show: true,
        correct: true,
        message: '¡Muy bien! ¡Encontraste el patrón!'
      });

      const newPattern = currentPattern + 1;
      setCurrentPattern(newPattern);

      if (newPattern >= patternsPerLevel) {
        setGameActive(false);
        setTimeout(() => setLevelComplete(true), 1500);
      }
    } else {
      setFeedback({
        show: true,
        correct: false,
        message: 'Ups, ese no es el número correcto. ¡Inténtalo de nuevo!'
      });
    }
  }

  function closeFeedback() {
    setFeedback({ show: false, correct: false, message: '' });
    if (gameActive) {
      generatePattern();
    }
  }

  function nextLevel() {
    setLevelComplete(false);
    setCurrentLevel(prev => prev < maxLevel ? prev + 1 : 1);
    startNewGame();
  }

  function showHint() {
    const options = document.querySelectorAll('.option');
    options.forEach((option) => {
      const optionAnswer = parseInt(option.getAttribute('data-answer') || '0');
      if (optionAnswer === correctAnswer) {
        (option as HTMLElement).style.boxShadow = '0 0 20px #81C784';
        setTimeout(() => {
          (option as HTMLElement).style.boxShadow = '';
        }, 1000);
      }
    });
  }

  return (
    <>
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

      <main className="flex-1 py-10 bg-gradient-to-br from-purple-100 to-pink-100 text-black">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-8 text-center">
              <h1 className="text-4xl font-bold mb-2 text-black">🧩 Patrón Perdido</h1>
              <p className="text-lg text-black">¡Ayuda al personaje a encontrar el número que falta en la secuencia!</p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Score */}
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

              {/* Game Scene */}
              <div className="relative h-80 bg-gradient-to-b from-sky-200 to-sky-300 rounded-2xl mb-6 overflow-hidden">
                <div className="absolute top-8 right-12 text-6xl animate-spin-slow">☀️</div>
                <div className="absolute top-20 left-8 text-2xl animate-fly">🐦</div>
                
                {/* Pattern Display */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2">
                  <div className="flex gap-4 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl">
                    {sequence.map((num, idx) => (
                      <div
                          key={idx}
                          className={`w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-lg ${
                            num === null ? 'bg-white text-black border-2 border-gray-300' : 'bg-white border-2 border-gray-300 text-black'
                          }`}
                        >
                          {num === null ? '?' : num}
                        </div>
                    ))}
                  </div>
                </div>

                {/* Character */}
                <div className={`absolute bottom-32 left-12 text-6xl transition-all duration-500 ${jumping ? 'animate-jump' : ''}`}>
                  {character}
                </div>

                {/* Options */}
                <div className="absolute bottom-12 left-0 right-0 flex justify-around px-8">
                  {answers.map((answer, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(answer)}
                      data-answer={answer}
                      className="option bg-white rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer"
                    >
                      <div className="text-3xl font-bold text-black">{answer}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={startNewGame}
                  className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                >
                  🔄 Nuevo Juego
                </button>
                <button
                  onClick={showHint}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                >
                  💡 Pista
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feedback Modal */}
      {feedback.show && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 text-center max-w-md animate-scale-in">
            <div className={`text-7xl mb-4 ${feedback.correct ? 'text-green-500' : 'text-red-500'}`}>
              {feedback.correct ? '😊' : '😢'}
            </div>
            <h2 className="text-2xl font-bold mb-4 text-black">{feedback.message}</h2>
            <button
              onClick={closeFeedback}
              className="bg-blue-500 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Level Complete Modal */}
      {levelComplete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 text-center max-w-md animate-scale-in">
            <div className="text-7xl mb-4 text-yellow-400 animate-spin-slow">⭐</div>
            <h2 className="text-3xl font-bold mb-4 text-black">¡Nivel Completado!</h2>
            <p className="mb-6 text-black">¡Felicidades! Has completado el nivel con éxito.</p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <div className="text-3xl font-bold text-black">{correctScore}</div>
                <div className="text-sm text-black">Aciertos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black">{currentLevel}</div>
                <div className="text-sm text-black">Nivel</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black">{attemptsScore}</div>
                <div className="text-sm text-black">Intentos</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={nextLevel}
                className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold"
              >
                ➡️ Siguiente Nivel
              </button>
              <button
                onClick={startNewGame}
                className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white px-6 py-3 rounded-full font-bold"
              >
                🔄 Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes jump {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-60px); }
        }
        .animate-jump {
          animation: jump 1s ease-in-out;
        }
        @keyframes fly {
          0% { transform: translateX(-50px); }
          100% { transform: translateX(100vw); }
        }
        .animate-fly {
          animation: fly 20s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
