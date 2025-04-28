import React from 'react';
import { Card, Button, Alert, Form } from 'react-bootstrap';
import { Google, Facebook, Envelope } from 'react-bootstrap-icons'; 
import logoImga from '../IMG/Brain.png';

function PLogin({ 
  error, 
  loginWithGoogle, 
  loginWithFacebook, 
  loginWithEmailPassword,
  registerWithEmailPassword,
  email,
  setEmail,
  password,
  setPassword,
  user, // Recibimos user
  navigate
}) {
  return (
    <>
      <div className="logo-trivialogin mb-4">
        <img src={logoImga} alt="Cerebro" />
      </div>
      <Card className="shadow-sm">
        <Card.Body className="p-4 text-center">
          <Card.Title className="mb-4">Iniciar Sesión</Card.Title>

          {error && <Alert variant="danger">{error}</Alert>}

          {user && user.displayName && ( // Usamos user aquí
            <div className="user-info mb-4">
              <img 
                src={user.photoURL || 'ruta/a/imagen/default.jpg'} 
                alt="User" 
                className="user-photo" 
                style={{ width: '50px', height: '50px', borderRadius: '50%' }} 
              />
              <span>{user.displayName}</span>
            </div>
          )}

          <Form onSubmit={loginWithEmailPassword} className="mb-4">
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Control 
                type="email" 
                placeholder="Correo electrónico" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Control 
                type="password" 
                placeholder="Contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="btn btn-success"
              type="submit"
              className="w-100 mb-3 d-flex align-items-center justify-content-center btn-gray"
            >
              <Envelope className="me-2" /> 
              Iniciar sesión con Email
            </Button>
          </Form>

          <Button
            variant="btn btn-success" 
            onClick={registerWithEmailPassword}
            className="w-100 mb-3 d-flex align-items-center justify-content-center btn-gray"
          >
            <Envelope className="me-2" /> 
            Registrarse con Email
          </Button>

          <div className="d-flex gap-3 mb-3 justify-content-center">
            <Button
              variant="outline-danger"
              onClick={loginWithGoogle}
              className="d-flex align-items-center justify-content-center p-2"
              style={{ width: '50px', height: '50px' }} 
            >
              <Google className="m-auto" size={24} /> 
            </Button>

            <Button
              variant="outline-primary"
              onClick={loginWithFacebook}
              className="d-flex align-items-center justify-content-center p-2"
              style={{ width: '50px', height: '50px' }} 
            >
              <Facebook className="m-auto" size={24} /> 
            </Button>
          </div>

          <Button
            variant="link"
            onClick={() => navigate('/')}
          >
            Volver sin iniciar sesión
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}

export default PLogin;
