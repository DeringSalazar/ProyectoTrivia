import React from 'react';

const Timer = ({ timeRemaining }) => {
  return (
    <div className="top-right">
      <div className="timer">
        {timeRemaining}s
      </div>
    </div>
  );
};

export default Timer;