import React, { useEffect } from 'react';

function Timer({ timeLeft, onTimeUp }) {
  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  return (
    <div className="text-end">
      <small>Tiempo: {timeLeft}s</small>
    </div>
  );
}

export default Timer;