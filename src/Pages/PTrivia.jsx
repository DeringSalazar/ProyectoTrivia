import React, { useState } from 'react';
import '../styles/CTrivia.css';
import logoImg from '../IMG/Brain.png';
import PHome from './PHome';
import Game from '../Components/Game';
import Login from '../Components/Login';

function PTrivia({ onShowGuide, onLogin }) {
  const [gameConfig, setGameConfig] = useState({
    category: '',
    difficulty: '',
    language: '',
  });
  const [questions, setQuestions] = useState([]);
  const [gameStats, setGameStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    percentage: 0,
  });
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('welcome'); // welcome, home, game

  // Función para manejar el inicio del juego
  const handleStartGame = () => {
    setCurrentScreen('home');
  };

  // Función para navegar al juego (se pasa a PHome)
  const navigateToGame = () => {
    setCurrentScreen('game');
  };

  const navigateToLogin = () => {
    setCurrentScreen('login');
  };

  return (
    <div className="trivia-container">
      <div className="trivia-content">
        {currentScreen === 'welcome' && (
          <>
            <img src={logoImg} alt="Brain Brawl Logo" className="logo" />
            <h1 className="title">Brain Brawl</h1>

            <div className="button-container">
              <button className="start-button" onClick={handleStartGame}>
                Iniciar Juego
              </button>
              <button className="login-button" onClick={onLogin}>
                Iniciar Sesión
              </button>
              <button className="guide-button" onClick={onShowGuide}>
                Guía del Juego
              </button>
            </div>
          </>
        )}

        {currentScreen === 'home' && (
          <PHome
            setGameConfig={setGameConfig}
            setQuestions={setQuestions}
            user={user}
            navigateToGame={navigateToGame}
          />
        )}

        {currentScreen === 'game' && (
          <Game
            questions={questions}
            gameConfig={gameConfig}
            setGameStats={setGameStats}
            onEndGame={() => setCurrentScreen('results')}
          />
        )}

        {currentScreen === 'login' && (
          <Login
          setUser={setUser}
        />
        )}

        {currentScreen === 'results' && (
          <div className="results-container">
            <h2>Resultados del juego</h2>
            <p>Respuestas correctas: {gameStats.correctAnswers} de {gameStats.totalQuestions}</p>
            <p>Porcentaje: {gameStats.percentage}%</p>
            <button onClick={() => setCurrentScreen('welcome')}>Volver al inicio</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PTrivia;