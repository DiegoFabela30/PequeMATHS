'use client';

import { useState, useEffect } from 'react';

const emojis = [
  '🍎', '🍌', '🍓', '🍕', '🍦', '🍭', '⚽', '🎈', '🎁', '',
  '🐶', '🐱', '🐰', '🦊', '🦁', '🐼', '🐵', '🐸', '🦄', '🐢'
];

export default function EncuentraElNumero() {
  const [targetNumber, setTargetNumber] = useState(0);
  const [correctScore, setCorrectScore] = useState(0);
  const [attemptsScore, setAttemptsScore] = useState(0);
  const [cards, setCards] = useState<Array<{ number: number; emoji: string }>>([]);
  const [feedback, setFeedback] = useState({ show: false, correct: false, message: '' });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    startNewGame();
  }, []);

  function startNewGame() {
    // eslint-disable-next-line react-hooks/purity
    const target = Math.floor(Math.random() * 10) + 1;
    setTargetNumber(target);
    
    const numbers = generateRandomNumbers(6, target);
    const newCards = numbers.map(num => ({
      number: num,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));
    
    setCards(newCards);
  }

  function generateRandomNumbers(count: number, includeNumber: number) {
    const numbers = [includeNumber];
    
    while (numbers.length < count) {
      // eslint-disable-next-line react-hooks/purity
      const randomNum = Math.floor(Math.random() * 10) + 1;
      if (!numbers.includes(randomNum)) {
        numbers.push(randomNum);
      }
    }
    
    return shuffleArray(numbers);
  }

  function shuffleArray(array: number[]) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  function handleCardClick(selectedNumber: number) {
    setAttemptsScore(prev => prev + 1);

    if (selectedNumber === targetNumber) {
      setCorrectScore(prev => prev + 1);
      setFeedback({
        show: true,
        correct: true,
        message: '¡Muy bien! ¡Lo encontraste!'
      });
    } else {
      setFeedback({
        show: true,
        correct: false,
        message: 'Ups, ese no es el número. ¡Inténtalo de nuevo!'
      });
    }
  }

  function closeFeedback() {
    setFeedback({ show: false, correct: false, message: '' });
    startNewGame();
  }

  function showHint() {
    const cardElements = document.querySelectorAll('.game-card');
    cardElements.forEach((card) => {
      const cardNumber = parseInt(card.getAttribute('data-number') || '0');
      if (cardNumber === targetNumber) {
        (card as HTMLElement).style.boxShadow = '0 0 30px #81C784';
        setTimeout(() => {
          (card as HTMLElement).style.boxShadow = '';
        }, 1000);
      }
    });
  }

  return (
    <>
      <header className="w-full bg-gradient-to-r from-green-500 to-emerald-600 py-4 px-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-yellow-300">Peque</span>
            <span className="text-4xl font-bold text-white">MATHS</span>
          </div>
          <a href="/." className="bg-white text-green-500 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 hover:text-green-600 transition-all hover:scale-105">
            🏠 Inicio
          </a>
        </div>
      </header>

      <main className="flex-1 py-10 bg-gradient-to-br from-green-100 to-emerald-100">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
              <h1 className="text-4xl font-bold mb-2">🔍 Encuentra el Número</h1>
              <p className="text-lg">¡Haz clic en la tarjeta que tenga la cantidad de elementos que se te pide!</p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Score */}
              <div className="flex justify-around mb-8 bg-gray-100 p-4 rounded-full">
                <div className="flex items-center gap-2">
                  <span className="font-bold">Aciertos:</span>
                  <span className="text-2xl text-green-600">{correctScore}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Intentos:</span>
                  <span className="text-2xl text-green-600">{attemptsScore}</span>
                </div>
              </div>

              {/* Question */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-2 animate-pulse">
                  ¿Dónde está el número <span className="text-green-600">{targetNumber}</span>?
                </h2>
                <p className="text-lg text-gray-600">Busca la tarjeta que tenga esa cantidad de elementos</p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {cards.map((card, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCardClick(card.number)}
                    data-number={card.number}
                    className="game-card bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer border-4 border-green-200 hover:border-green-400"
                  >
                    <div className="flex flex-wrap gap-2 justify-center mb-4 min-h-[120px] items-center">
                      {Array.from({ length: card.number }).map((_, i) => (
                        <span key={i} className="text-4xl">
                          {card.emoji}
                        </span>
                      ))}
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mt-4">
                      {card.number}
                    </div>
                  </button>
                ))}
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
            <h2 className="text-2xl font-bold mb-4">{feedback.message}</h2>
            <button
              onClick={closeFeedback}
              className="bg-green-500 text-white px-8 py-3 rounded-full font-bold hover:bg-green-600"
            >
              Continuar
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
      `}</style>
    </>
  );
}
