import React from 'react';
import { Card } from 'react-bootstrap';
import ResultSummary from './ResultSummary';
import ShareButtons from './ShareButtons';
import LoginPrompt from './LoginPrompt';
import PlayAgainButton from './PlayAgainButton';

function Results({ gameStats, user }) {
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

        <PlayAgainButton />
      </Card.Body>
    </Card>
  );
}

export default Results;