import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../firebase'; // Ruta corregida
import PLogin from '../pages/PLogin'; // Importa PLogin

function Login({ setUser }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      setUser({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        provider: 'google'
      });
      
      navigate('/');
    } catch (err) {
      setError('Error al iniciar sesión con Google');
      console.error(err);
    }
  };
  
  const loginWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      
      setUser({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        provider: 'facebook'
      });
      
      navigate('/');
    } catch (err) {
      setError('Error al iniciar sesión con Facebook');
      console.error(err);
    }
  };

  return (
    <PLogin 
      error={error} 
      loginWithGoogle={loginWithGoogle} 
      loginWithFacebook={loginWithFacebook} 
      navigate={navigate}
    />
  );
}

export default Login;