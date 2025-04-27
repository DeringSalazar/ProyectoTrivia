import React from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { Google, Facebook } from 'react-bootstrap-icons';

function PLogin({ error, loginWithGoogle, loginWithFacebook, navigate }) {
  return (
    <Card className="shadow-sm">
      <Card.Body className="p-4 text-center">
        <Card.Title className="mb-4">Iniciar Sesión</Card.Title>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <p className="mb-4">Inicia sesión para guardar y compartir tus estadísticas</p>
        
        <div className="d-grid gap-3">
          <Button 
            variant="outline-danger" 
            onClick={loginWithGoogle}
            className="d-flex align-items-center justify-content-center"
          >
            <Google className="me-2" />
            Continuar con Google
          </Button>
          
          <Button 
            variant="outline-primary" 
            onClick={loginWithFacebook}
            className="d-flex align-items-center justify-content-center"
          >
            <Facebook className="me-2" />
            Continuar con Facebook
          </Button>
          
          <Button 
            variant="link" 
            onClick={() => navigate('/')}
          >
            Volver sin iniciar sesión
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default PLogin;

