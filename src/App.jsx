import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './App.css';

{/* Pages */}
import PTrivia from './Pages/PTrivia';
import PResults from './Pages/PResults';
import Login from './Components/Login';


function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
         
        <Route path="/" element={<PTrivia count={count} setCount={setCount} />} />
        <Route path="/login" element={<Login />} /> {/* <-- Agrega esta ruta */}

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;