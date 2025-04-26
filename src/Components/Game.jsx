import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, ProgressBar, Badge } from 'react-bootstrap';
import Question from './Question';

function Game({ gameConfig, questions, setGameStats }) {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(getTimeLimit());
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
 
  function getTimeLimit() {
    switch(gameConfig.difficulty) {
      case 'easy': return 30;
      case 'medium': return 20;
      case 'hard': return 15;
      default: return 20;
    }
  }
  
 
  useEffect(() => {
    if (timeLeft <= 0 || isAnswered) {
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, isAnswered]);
  

  useEffect(() => {
    if (timeLeft === 0 && !isAnswered) {
      handleAnswer(null);
    }
  }, [timeLeft, isAnswered]);
  
  const handleAnswer = (answer) => {
    setIsAnswered(true);
    setSelectedAnswer(answer);
    
    const currentQuestion = questions[currentQuestionIndex];
    if (answer === currentQuestion.correct_answer) {
      setScore(score + 1);
    }
    
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
        setTimeLeft(getTimeLimit());
      } else {
        const finalStats = {
          totalQuestions: questions.length,
          correctAnswers: score + (answer === currentQuestion.correct_answer ? 1 : 0),
          percentage: Math.round(((score + (answer === currentQuestion.correct_answer ? 1 : 0)) / questions.length) * 100)
        };
        setGameStats(finalStats);
        navigate('/results');
      }
    }, 2000);
  };
  
  if (!questions || questions.length === 0) {
    navigate('/');
    return null;
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
      />
    </div>
  );
}

export default Game;