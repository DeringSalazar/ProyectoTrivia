import React from 'react';
import { Card, Button } from 'react-bootstrap';
import ResultSummary from '../Components/ResultSummary';
import ShareButtons from '../Components/ShareButtons';
import LoginPrompt from '../Components/LoginPrompt';
import '../Styles/CResults.css';

function PResults({ gameStats, user, onPlayAgain }) {
  const hasStats = gameStats && 
    typeof gameStats.totalQuestions === 'number' && 
    typeof gameStats.correctAnswers === 'number' && 
    typeof gameStats.percentage === 'number';

  if (!hasStats) {
    return (
      <Card className="shadow-sm results-card text-center">
        <Card.Body className="p-4">
          <Card.Title className="display-6 mb-3">Sin resultados disponibles</Card.Title>
          <p>No se encontraron datos del juego anterior.</p>
          <Button onClick={onPlayAgain} variant="primary">Jugar ahora</Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm results-card">
      <Card.Body className="p-4 text-center">
        <Card.Title className="display-6 mb-3">Resultados</Card.Title>
        
        <ResultSummary gameStats={gameStats} />
        {user ? (
          <ShareButtons gameStats={gameStats} />
        ) : (
          <LoginPrompt />
        )}
        
        <Button 
          onClick={onPlayAgain} 
          variant="primary" 
          size="lg" 
          className="mt-4"
        >
          Jugar de nuevo
        </Button>
      </Card.Body>
    </Card>
  );
}

function getColorByPercentage(percentage) {
  if (percentage < 40) return '#dc3545'; 
  if (percentage < 70) return '#ffc107'; 
  return '#28a745'; 
}

export default PResults;