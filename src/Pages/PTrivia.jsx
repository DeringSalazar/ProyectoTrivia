import React, { useState } from 'react';
import '../styles/CTrivia.css';
import logoImg from '../IMG/Brain.png'; 
import PHome from './PHome';

function PTrivia({ onShowGuide, onLogin }) {
  const [gameConfig, setGameConfig] = useState({
    category: '',
    difficulty: '',
  });
  const [questions, setQuestions] = useState([]);
  const [gameStats, setGameStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    percentage: 0,
  });
  const [user, setUser] = useState(null);
  const [showHome, setShowHome] = useState(false);
  
  // Función para manejar el inicio del juego
  const handleStartGame = () => {
    setShowHome(true);
  };
  
  return (
    <div className="trivia-container">
      <div className="trivia-content">
        {!showHome && (
          <>
            <img
              src={logoImg}
              alt="Logo del juego"
              className="game-logo"
            />
            <h1 className="game-title">Brain Brawl</h1>
          </>
        )}
        
        {showHome ? (
          <PHome
            setGameConfig={setGameConfig}
            setQuestions={setQuestions}
            user={user}
          />
        ) : (
          <div className="buttons-wrapper">
            <button
              className="game-button start-button"
              onClick={handleStartGame}
            >
              Iniciar Juego
            </button>
            <button
              className="game-button login-button"
              onClick={onLogin}
            >
              Iniciar Sesión
            </button>
            <button
              className="game-button guide-button"
              onClick={onShowGuide}
            >
              Guía del Juego
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PTrivia;