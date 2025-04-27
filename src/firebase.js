import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDbOurgKaUJ8-VSLQGi8R98p3l6Cp4ofwk",
  authDomain: "logintrivia1.firebaseapp.com",
  projectId: "logintrivia1",
  storageBucket: "logintrivia1.appspot.com", 
  messagingSenderId: "681575019822",
  appId: "1:681575019822:web:d6d9be49d4446b869bb6bf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };