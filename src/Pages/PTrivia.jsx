import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [currentScreen, setCurrentScreen] = useState('welcome'); // welcome, home, game, login, results

  const navigate = useNavigate();

  // Función para manejar el inicio del juego principal
  const handleStartGame = () => {
    setCurrentScreen('home');
  };

  // Función para navegar al juego
  const navigateToGame = () => {
    setCurrentScreen('game');
  };

  const navigateToLogin = () => {
    setCurrentScreen('login');
  };

  // Función para jugar ahorcado
  const handlePlayHangman = () => {
    navigate('/hangman');
  };

  // Función para manejar el éxito del login
  const handleLoginSuccess = (userData) => {
    if (userData) {
      setUser(userData);
      setCurrentScreen('home'); // Redirecciona a PHome después de login exitoso
    } else {
      // Si userData es null, volvemos a la pantalla de bienvenida
      setCurrentScreen('welcome');
    }
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
              <button className="login-button" onClick={navigateToLogin}>
                Iniciar Sesión
              </button>
              
              <button className="guide-button" onClick={handlePlayHangman}>
                Juego Ahorcado
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
            onLoginSuccess={handleLoginSuccess} 
          />
        )}

        {currentScreen === 'results' && (
          <div className="results-container">
            <h2>Resultados del juego</h2>
            <p>Respuestas correctas: {gameStats.correctAnswers} de {gameStats.totalQuestions}</p>
            <p>Porcentaje: {gameStats.percentage}%</p>
            <button onClick={() => setCurrentScreen('welcome')}>
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PTrivia;