import React from 'react';
import { Button } from 'react-bootstrap';
import DOMPurify from 'dompurify';

function AnswerButton({ answer, isAnswered, timeIsUp, selectedAnswer, correctAnswer, onAnswer }) {
  const getButtonVariant = () => {
    if (!isAnswered && !timeIsUp) return "outline-primary";
    if (answer === correctAnswer) return "success";
    if (selectedAnswer === answer) return "danger";
    return "outline-secondary";
  };

  return (
    <Button
      variant={getButtonVariant()}
      onClick={() => !isAnswered && onAnswer(answer)}
      disabled={isAnswered || timeIsUp}
      className="py-2 text-start"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(answer) }}
    />
  );
}

export default AnswerButton;