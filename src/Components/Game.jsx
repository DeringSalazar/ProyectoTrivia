import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, ProgressBar, Button } from 'react-bootstrap';
import Question from './Question';
import Timer from './Timer';
import '../Styles/CGame.css';
import logoImg from '../IMG/Brain.png'; 
import music from '../music/music2.mp3'; 

function Game({ gameConfig, questions, setGameStats, onEndGame }) {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(getTimeLimit());
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [hasError, setHasError] = useState(false);
 

  const audioRef = useRef(null); 

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

    if (audioRef.current) {
      audioRef.current.play();
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

  const handleTimeUp = () => {
    if (!isAnswered) {
      handleAnswer(null);
    }
  };

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
        
        if (onEndGame) {
          onEndGame(finalStats);
        } else {
          navigate('/PResults');
        }
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
  const [showHome] = useState(false);

  return (
    <div className="game-container">
      <audio ref={audioRef} src={music} loop />

      {!showHome && (
        <>
          <img
            src={logoImg}
            alt="Logo del juego"
            className="game-logo"
          />
          <h1 className="game-title">Brain Brawl</h1>
        </>
      )}
      <div className="game-header mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Badge className="question-badge" bg="primary">Pregunta {currentQuestionIndex + 1}/{questions.length}</Badge>
          <Badge className="score-badge" bg="info">Puntuación: {score}</Badge>
        </div>
        <ProgressBar
          now={timeLeft}
          max={getTimeLimit()}
          variant={timeLeft < 5 ? "danger" : timeLeft < 10 ? "warning" : "success"}
          className="mb-2"
        />
        
        <Timer 
          timeLeft={timeLeft} 
          onTimeUp={handleTimeUp} 
        />
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
