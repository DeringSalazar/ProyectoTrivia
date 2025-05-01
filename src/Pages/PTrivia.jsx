import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/CTrivia.css';
import logoImg from '../IMG/Brain.png';
import PHome from './PHome';
import Game from '../Components/Game';
import Login from '../Components/Login';
import PResults from './PResults';
import music from '../music/music4.mp3'; 

function PTrivia() {
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
  const [currentScreen, setCurrentScreen] = useState('welcome'); 

  const navigate = useNavigate();
  const audioRef = useRef(null); 

  useEffect(() => {
    if (audioRef.current) {
      if (currentScreen === 'welcome' || currentScreen === 'hangman') {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentScreen]);

  const handleStartGame = () => {
    setCurrentScreen('home'); 
  };

  const navigateToGame = () => {
    setCurrentScreen('game'); 
  };

  const navigateToLogin = () => {
    setCurrentScreen('login'); 
  };

  const handlePlayHangman = () => {
    setCurrentScreen('hangman'); 
    navigate('/hangman'); 
  };

  const handplayMemory = () => {
    setCurrentScreen('memory'); 
    navigate('/memory');
  };

  const handleEndGame = (stats) => {
    console.log("Juego terminado, resultados:", stats);
    setGameStats(stats);
    setCurrentScreen('results'); 
  };

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
            setGameStats={setGameStats}
            onEndGame={handleEndGame}
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

      <audio ref={audioRef} src={music} loop />
    </div>
  );
}

export default PTrivia;
