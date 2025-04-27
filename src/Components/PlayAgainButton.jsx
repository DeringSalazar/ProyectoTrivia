import React from 'react';
import { Link } from 'react-router-dom';

function PlayAgainButton() {
  return (
    <div className="mt-3 d-grid gap-2">
      <Link to="/" className="btn btn-primary">Jugar de nuevo</Link>
    </div>
  );
}

export default PlayAgainButton;
