import { Button } from 'bootstrap';
import React from 'react';
import { Button } from 'react-router-dom';

function PlayAgainButton() {
  return (
    <div className="mt-3 d-grid gap-2">
      <Button to="/" className="btn-again">Jugar de nuevo</Button>
    </div>
  );
}

export default PlayAgainButton;
