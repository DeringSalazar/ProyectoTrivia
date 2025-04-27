import React from 'react';
import { ProgressBar } from 'react-bootstrap';

function ResultSummary({ gameStats }) {
  const { totalQuestions, correctAnswers, percentage } = gameStats;

  const getFeedback = () => {
    if (percentage >= 80) return "¡Excelente trabajo!";
    if (percentage >= 60) return "¡Buen trabajo!";
    if (percentage >= 40) return "No está mal, sigue practicando.";
    return "Sigue intentándolo, ¡mejorarás con la práctica!";
  };

  const getProgressVariant = () => {
    if (percentage >= 70) return "success";
    if (percentage >= 40) return "warning";
    return "danger";
  };

  return (
    <div className="mb-4">
      <h2 className="display-4 mb-0">{percentage}%</h2>
      <p className="text-muted">{correctAnswers} de {totalQuestions} respuestas correctas</p>
      <ProgressBar now={percentage} variant={getProgressVariant()} className="my-3" />
      <p className="feedback">{getFeedback()}</p>
    </div>
  );
}

export default ResultSummary;
