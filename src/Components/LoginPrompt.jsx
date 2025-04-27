import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function LoginPrompt() {
  return (
    <Card className="mb-4 bg-light">
      <Card.Body>
        <p>Inicia sesión para compartir tus resultados</p>
        <Link to="/login" className="btn btn-outline-primary">Iniciar Sesión</Link>
      </Card.Body>
    </Card>
  );
}

export default LoginPrompt;
