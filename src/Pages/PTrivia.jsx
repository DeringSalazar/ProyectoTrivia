import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CTrivia.css';
import logoImg from '../IMG/Brain.png';
import PHome from './PHome';
import Game from '../Components/Game';
import Login from '../Components/Login';
import PResults from './PResults'; // Asegúrate de que la ruta es correcta

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
    navigate('/hangman'); // Redirige a la página del ahorcado
  };

  const handplayMemory = () => {
    navigate('/memory'); // Redirige a la página del juego de memoria
  }

  // Función para finalizar el juego y mostrar resultados
  const handleEndGame = (stats) => {
    console.log("Juego terminado, resultados:", stats);
    setGameStats(stats);
    setCurrentScreen('results');
  };

  // Función para volver a jugar
  const handlePlayAgain = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="trivia-container">
      <div className="trivia-content">
        {currentScreen === 'welcome' && (
          <>
            <img src={logoImg} alt="Brain Brawl Logo" className="logo" />
            <h1 className="title">Brain Brawl</h1>
            {user && (
            <div className="user-info">
              <img src={user.photoURL} alt="User" className="avatar rounded-circle" width="40" />
              <span className="ms-2">{user.displayName}</span>
            </div>
          )}
            <div className="button-container">
            <button className="login-button" onClick={navigateToLogin}>
                Iniciar Sesión
              </button>
              <button className="start-button" onClick={handleStartGame}>
                Juego Preguntas
              </button>
              
              <button className="hangman-button" onClick={handlePlayHangman}>
                Juego Ahorcado
              </button>

              <button className="memory-button" onClick={handplayMemory}>
                Juego Memoria
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
            setGameStats={setGameStats} // Mantener compatibilidad con tu código original
            onEndGame={handleEndGame} // Nuevo método para manejar el fin del juego
          />
        )}
        
        {currentScreen === 'login' && (
          <Login 
            setUser={setUser} 
            onLoginSuccess={() => setCurrentScreen('welcome')}
          />
        )}
        
        {currentScreen === 'results' && (
          <PResults 
            gameStats={gameStats} 
            user={user} 
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </div>
  );
}

export default PTrivia;