import React from 'react';
import { Card } from 'react-bootstrap';
import { SanitizeHtml } from './SanitizeHtml';
import AnswerButton from './AnswerButton';
import TimeUpMessage from './TimeUpMessage';

function Question({ question, onAnswer, isAnswered, selectedAnswer, timeIsUp }) {
  const cleanQuestion = SanitizeHtml(question.question);

  const answers = question.all_answers || 
    [question.correct_answer, ...question.incorrect_answers].sort(() => Math.random() - 0.5);

  return (
    <Card className="shadow question-card">
      <Card.Body>
        <Card.Title 
          className="mb-4 text-center"
          dangerouslySetInnerHTML={{ __html: cleanQuestion }}
        />
        
        <div className="d-grid gap-2">
          {answers.map((answer, index) => (
            <AnswerButton
              key={index}
              answer={answer}
              isAnswered={isAnswered}
              timeIsUp={timeIsUp}
              selectedAnswer={selectedAnswer}
              correctAnswer={question.correct_answer}
              onAnswer={onAnswer}
            />
          ))}
        </div>
        
        {timeIsUp && !isAnswered && <TimeUpMessage />}
      </Card.Body>
    </Card>
  );
}

export default Question;
