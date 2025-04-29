import React, { useEffect, useState } from 'react';

function TimerMemory({ onTimeUp, gameActive }) {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!gameActive) return; 

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp(); 
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, onTimeUp]);

  return (
    <div>
      <h5>Tiempo restante: {timeLeft}s</h5>
    </div>
  );
}

export default TimerMemory;
