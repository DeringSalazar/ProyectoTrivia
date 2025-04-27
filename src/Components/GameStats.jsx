import React from 'react';
import { Card, Button } from 'react-bootstrap';

function GameStats({ totalQuestions, correctAnswers, percentage, onRestart }) {
  return (
    <div className="text-center">
      <Card>
        <Card.Body>
          <Card.Title>Estadísticas Finales</Card.Title>
          <Card.Text>
            Total de preguntas: {totalQuestions} <br />
            Respuestas correctas: {correctAnswers} <br />
            Porcentaje: {percentage}%
          </Card.Text>
          <Button onClick={onRestart} variant="primary">Reiniciar Juego</Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default GameStats;