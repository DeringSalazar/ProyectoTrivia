import React, { useState, useEffect } from 'react';
import Card from './Card';  // Importamos el componente de Carta
import Timer from './Timer';  // Importamos el componente de Temporizador
import GameOver from './GameOver'; // Importamos el componente de GameOver
import '../styles/MemoryGame.module.css';

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

const images = [
  { id: 1, img: discord, alt: ' ', bgImage: Brain },
  { id: 2, img: facebook, alt: ' ', bgImage: Brain },
  { id: 3, img: google_duo, alt: '  ', bgImage: Brain },
  { id: 4, img: instagram, alt: ' ', bgImage: Brain },
  { id: 5, img: linkedin, alt: ' ', bgImage: Brain },
  { id: 6, img: spotify, alt: ' ', bgImage: Brain },
  { id: 7, img: whatsapp, alt: ' ', bgImage: Brain },
  { id: 8, img: messenger, alt: ' ', bgImage: Brain },
  { id: 9, img: google, alt: ' ', bgImage: Brain },
  { id: 10, img: netflix, alt: ' ', bgImage: Brain },
];


const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [timer, setTimer] = useState(null);
  const [showAllCards, setShowAllCards] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const initializeGame = () => {
    const shuffledCards = [...images, ...images]; 
    setCards(shuffleArray(shuffledCards).map(card => ({ ...card, flipped: false }))); 
    setFlippedCards([]);
    setMatchedCards([]);
    setGameOver(false);
    setTimeRemaining(60); 
    clearInterval(timer); 
    startTimer(); 

    setShowAllCards(true);
    setTimeout(() => {
      setShowAllCards(false);
      setCards((prevCards) =>
        prevCards.map(card => ({ ...card, flipped: false }))
      );
    }, 3000); 
  };

  const startTimer = () => {
    const newTimer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 1) {
          clearInterval(newTimer);
          setGameOver(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    setTimer(newTimer);
  };

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || gameOver || showAllCards) return;

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstCard, secondCard] = newFlippedCards;
      if (cards[firstCard].img === cards[secondCard].img) {
        setMatchedCards((prev) => [...prev, cards[firstCard].img]);
      }
      setTimeout(() => setFlippedCards([]), 1000);
    }
  };

  useEffect(() => {
    if (matchedCards.length === images.length) {
      setGameOver(true);
    }
  }, [matchedCards]);

  const startGame = () => {
    setGameStarted(true);
    initializeGame();
  };

  return (
    <div>
      {!gameStarted ? (
        <div className="start-screen">
          <h1>¡Bienvenido al Memory Game!</h1>
          <button onClick={startGame} className="start-button">
            Iniciar Juego
          </button>
        </div>
      ) : (
        <>
          <h1>MemoryGame</h1>
          <Timer timeRemaining={timeRemaining} />
          <GameOver gameOver={gameOver} timeRemaining={timeRemaining} initializeGame={initializeGame} />
          <div className="grid-container">
            {cards.map((card, index) => (
              <Card 
                key={index} 
                index={index}
                card={card}
                flippedCards={flippedCards}
                matchedCards={matchedCards}
                showAllCards={showAllCards}
                handleCardClick={handleCardClick}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MemoryGame;
