import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, ProgressBar, Button } from 'react-bootstrap';
import Question from './Question';
import Timer from './Timer';
function Game({ gameConfig, questions, setGameStats }) {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(getTimeLimit());
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [hasError, setHasError] = useState(false);

  function getTimeLimit() {
    switch (gameConfig.difficulty) {
      case 'easy': return 30;
      case 'medium': return 20;
      case 'hard': return 10;
      default: return 20;
    }
  }

  useEffect(() => {
    if (!questions || questions.length === 0) {
      setHasError(true);
      return;
    }
  }, [questions]);

  useEffect(() => {
    if (timeLeft === 0 && !isAnswered) {
      handleAnswer(null);
    }

    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isAnswered]);

  const handleAnswer = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correct_answer;
    const updatedScore = isCorrect ? score + 1 : score;

    setIsAnswered(true);
    setSelectedAnswer(answer);

    if (!isCorrect) {
      setCorrectAnswer(currentQuestion.correct_answer);
    } else {
      setScore(updatedScore);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
        setCorrectAnswer(null);
        setTimeLeft(getTimeLimit());
      } else {
        const percentage = Math.round((updatedScore / questions.length) * 100);
        const finalStats = {
          totalQuestions: questions.length,
          correctAnswers: updatedScore,
          percentage
        };
        setGameStats(finalStats);
        navigate('/PResults');
      }
    }, 2000);
  };

  if (hasError) {
    return (
      <div className="text-center">
        <h2>Error: No se encontraron preguntas disponibles.</h2>
        <Button onClick={restartGame} variant="primary">Reiniciar Juego</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="game-container">
      <div className="game-header mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Badge bg="primary">Pregunta {currentQuestionIndex + 1}/{questions.length}</Badge>
          <Badge bg="info">Puntuación: {score}</Badge>
        </div>
        <ProgressBar
          now={timeLeft}
          max={getTimeLimit()}
          variant={timeLeft < 5 ? "danger" : timeLeft < 10 ? "warning" : "success"}
          className="mb-2"
        />
        <div className="text-end">
          <small>Tiempo: {timeLeft}s</small>
        </div>
      </div>

      <Question
        question={currentQuestion}
        onAnswer={handleAnswer}
        isAnswered={isAnswered}
        selectedAnswer={selectedAnswer}
        timeIsUp={timeLeft === 0}
        correctAnswer={correctAnswer}
      />

      <div className="text-center mt-4">
        <Button onClick={() => restartGame()} variant="primary">Reiniciar Juego</Button>
      </div>
    </div>
  );

  function restartGame() {
    setScore(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(getTimeLimit());
    setIsAnswered(false);
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    setHasError(false);
    navigate('/');
  }
}

export default Game;