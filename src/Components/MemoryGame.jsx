import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import discord from '../IMG/discord.png';
import facebook from '../IMG/facebook.png';
import google_duo from '../IMG/google_duo.png';
import instagram from '../IMG/instagram.png';
import whatsapp from '../IMG/whatsapp.png';
import spotify from '../IMG/spotify.png';
import linkedin from '../IMG/linkedin.png';
import google from '../IMG/google.png';
import messenger from '../IMG/messenger.png';
import netflix from '../IMG/netflix.png';
import Brain from '../IMG/Brain.png';
import '../Styles/MemoryGame.css';
import Timer from './TimerMemory.jsx';
import { useNavigate } from 'react-router-dom';

const images = [
  { src: discord, name: 'discord' },
  { src: facebook, name: 'facebook' },
  { src: google_duo, name: 'google_duo' },
  { src: instagram, name: 'instagram' },
  { src: whatsapp, name: 'whatsapp' },
  { src: spotify, name: 'spotify' },
  { src: linkedin, name: 'linkedin' },
  { src: google, name: 'google' },
  { src: messenger, name: 'messenger' },
  { src: netflix, name: 'netflix' },
];

function MemoryGame() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showAllCards, setShowAllCards] = useState(true);
  const [timerResetKey, setTimerResetKey] = useState(0); // Para reiniciar el temporizador

  const initializeGame = () => {
    const shuffledCards = [...images, ...images]
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({
        id: index,
        src: image.src,
        name: image.name,
        flipped: true,
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setGameOver(false);
    setShowAllCards(true);

    setTimeout(() => {
      const hiddenCards = shuffledCards.map(card => ({ ...card, flipped: false }));
      setCards(hiddenCards);
      setShowAllCards(false);
    }, 3000);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (cardIndex) => {
    if (flippedCards.length === 2 || cards[cardIndex].flipped || gameOver || moves >= 25 || showAllCards) return;

    const newCards = [...cards];
    newCards[cardIndex].flipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardIndex];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prevMoves => prevMoves + 1);
      const [firstIndex, secondIndex] = newFlippedCards;
      if (newCards[firstIndex].name === newCards[secondIndex].name) {
        if (!matchedCards.includes(newCards[firstIndex].name)) {
          setMatchedCards([...matchedCards, newCards[firstIndex].name]);
        }
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          newCards[firstIndex].flipped = false;
          newCards[secondIndex].flipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleTimeUp = () => {
    setGameOver(true);
  };

  const handleRestart = () => {
    setTimerResetKey(prev => prev + 1); // Reinicia el temporizador
    initializeGame();
  };

  return (
    <div className="memory-game-container text-center">
      <h2 className="mb-4">Juego de Memoria 🧠</h2>

      {!gameOver && (
        <Timer
          key={timerResetKey}
          onTimeUp={handleTimeUp}
          gameActive={!gameOver && !showAllCards}
        />
      )}

      <div>
        <h5 className="move-counter">Movimientos: {moves}</h5>
        {moves >= 25 && !gameOver && (
          <div className="move-limit-message alert alert-danger mt-3">
            ¡Perdiste! Has superado el límite de 25 movimientos.
          </div>
        )}
      </div>

      <div className="card-grid">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card-item ${card.flipped ? 'card-flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            {card.flipped || matchedCards.includes(card.name) ? (
              <img src={card.src} alt={card.name} className="card-image" />
            ) : (
              <img src={Brain} alt="Brain" className="card-image" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        {matchedCards.length === images.length && !gameOver && (
          <div className="win-message alert alert-success mt-3">
            ¡Ganaste el juego en {moves} movimientos!
          </div>
        )}
        <Button onClick={handleRestart} className="me-2">Reiniciar Juego</Button>
        <Button onClick={() => navigate('/')}>Volver al inicio</Button>
      </div>
    </div>
  );
}

export default MemoryGame;
