import React from 'react';

const GameOver = ({ gameOver, timeRemaining, initializeGame }) => {
  return (
    gameOver && (
      <div className="game-over-container">
        {timeRemaining > 0 ? (
          <p>¡Excelente trabajo! Has completado el juego en {60 - timeRemaining} segundos.</p>
        ) : (
          <p>¡Has perdido! El tiempo se acabó.</p>
        )}
        <button onClick={initializeGame} className="restart-button">
          Reiniciar juego
        </button>
      </div>
    )
  );
};

export default GameOver;
