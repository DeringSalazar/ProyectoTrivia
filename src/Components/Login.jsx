import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, microsoftProvider } from '../firebase';
import PLogin from '../Pages/PLogin';

function Login({ setUser: setUserProp, onLoginSuccess }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUserState] = useState(null);

  const defaultPhotoURL = 'ruta/a/imagen/default.jpg';
  
  const getUserPhotoURL = (user) => {
    return user.photoURL || defaultPhotoURL;
  };

  const updateUser = (userData) => {
    setUserState(userData);
    if (setUserProp) setUserProp(userData);
    if (onLoginSuccess) onLoginSuccess(userData);
    else navigate('/');
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: getUserPhotoURL(user),
        provider: 'google',
      };
      updateUser(userData);
    } catch (err) {
      setError('Error al iniciar sesión con Google');
      console.error(err);
    }
  };

  const loginWithMicrosoft = async () => {
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      const user = result.user;
      const userData = {
        uid: user.uid,
        displayName: user.displayName || user.email,
        email: user.email,
        photoURL: getUserPhotoURL(user),
        provider: 'microsoft',
      };
      updateUser(userData);
    } catch (err) {
      setError('Error al iniciar sesión con Microsoft');
      console.error(err);
    }
  };

  const loginWithEmailPassword = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const userData = {
        uid: user.uid,
        displayName: user.displayName || user.email,
        email: user.email,
        photoURL: getUserPhotoURL(user),
        provider: 'password',
      };
      updateUser(userData);
    } catch (err) {
      setError('Correo o contraseña inválidos');
      console.error(err);
    }
  };

  const registerWithEmailPassword = async (e) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const userData = {
        uid: user.uid,
        displayName: user.displayName || user.email,
        email: user.email,
        photoURL: getUserPhotoURL(user),
        provider: 'password',
      };
      updateUser(userData);
    } catch (err) {
      setError('Error al registrar usuario: Ya existe esta cuenta');
      console.error(err);
    }
  };

  const navigateBack = () => {
    if (onLoginSuccess) onLoginSuccess(null);
    else navigate('/');
  };

  return (
    <PLogin
      error={error}
      loginWithGoogle={loginWithGoogle}
      loginWithMicrosoft={loginWithMicrosoft}
      loginWithEmailPassword={loginWithEmailPassword}
      registerWithEmailPassword={registerWithEmailPassword}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      user={user}
      navigate={navigateBack}
    />
  );
}

export default Login;
