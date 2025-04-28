import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../firebase';
import PLogin from '../Pages/PLogin';

function Login({ setUser }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const defaultPhotoURL = 'ruta/a/imagen/default.jpg'; 

 
  const getUserPhotoURL = (user) => {

    return user.photoURL || defaultPhotoURL;
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userPhotoURL = getUserPhotoURL(user); 

      setUser({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: userPhotoURL,
        provider: 'google',
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
      const userPhotoURL = getUserPhotoURL(user); 
      setUser({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: userPhotoURL,
        provider: 'facebook',
      });

      navigate('/');
    } catch (err) {
      setError('Error al iniciar sesión con Facebook');
      console.error(err);
    }
  };


  const loginWithEmailPassword = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const userPhotoURL = getUserPhotoURL(user); 
      const userDisplayName = user.displayName || user.email;

      setUser({
        uid: user.uid,
        displayName: userDisplayName,
        email: user.email,
        photoURL: userPhotoURL, 
        provider: 'password',
      });

      navigate('/');
    } catch (err) {
      setError('Correo o contraseña inválidos');
      console.error(err);
    }
  };

  // Registrar usuario con email y contraseña
  const registerWithEmailPassword = async (e) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      
      const userPhotoURL = getUserPhotoURL(user); 

     
      const userDisplayName = user.displayName || user.email;

      setUser({
        uid: user.uid,
        displayName: userDisplayName,
        email: user.email,
        photoURL: userPhotoURL,
        provider: 'password',
      });

      navigate('/');
    } catch (err) {
      setError('Error al registrar usuario: Ya existe esta cuenta');
      console.error(err);
    }
  };

  return (
    <PLogin 
      error={error} 
      loginWithGoogle={loginWithGoogle} 
      loginWithFacebook={loginWithFacebook}
      loginWithEmailPassword={loginWithEmailPassword}
      registerWithEmailPassword={registerWithEmailPassword}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      setUser={setUser}
    />
  );
}

export default Login;
