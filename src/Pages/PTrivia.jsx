// PTrivia.jsx
import '../styles/CTrivia.css';
import nubladoImg from '../IMG/nublado.png';
import logoImg from '../IMG/Logo.png';

function PTrivia({ onStartGame, onShowGuide, onLogin }) {
  return (
    <div className="full-screen-container">
      <div className="game-background">
        {/* Nubes en las esquinas superiores */}
        <img
          src={nubladoImg}
          alt='nubes'
          className='cloud top-left-cloud'
        />
        <img
          src={nubladoImg}
          alt='nubes'
          className='cloud top-right-cloud'
        />
        
        {/* Contenido central */}
        <div className="center-content">
          <img
            src={logoImg}
            alt="Logo del juego"
            className="game-logo"
          />
          
          <h1 className="game-title">Brain Brawl</h1>
          
          <div className="buttons-wrapper">
            <button
              className="game-button start-button"
              onClick={onStartGame}
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
        </div>
      </div>
    </div>
  );
}

export default PTrivia;