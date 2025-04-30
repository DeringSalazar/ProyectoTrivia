// HangmanGame.jsx
import React, { useState, useEffect } from "react";
import '../Styles/Ahorcado.css';
import logoImg from '../IMG/Brain.png';
import { useNavigate } from 'react-router-dom';

const spanishWords = [
  "GATO", "PERRO", "CABALLO", "ELEFANTE", "TIGRE", "VACA", "LEON", "PATO", "CIELO",
  "MAR", "SOL", "LUNA", "ESTRELLA", "CIUDAD", "ESCUELA", "JARDIN", "FLORES", "MUSICA", "DIA",
  "NOCHE", "SOMBRERO", "CAMISA", "PANTALON", "BICI", "ZAPATO", "LIBRO", "CUADERNO", "CARTERA",
  "FAMILIA", "ALIMENTO", "AUTOMOVIL", "ARBOL", "SILLA", "VENTANA", "PUERTA", "AMIGO",
  "CARRERA", "CORRER", "VIAJE", "AVION", "PESCADO", "COMIDA", "AGUA", "TIERRA", "PESCADOR",
  "CASTILLO", "PIRATA", "MALDITO", "MONSTRUO", "FANTASMA", "ACUARIO", "COCHE", "AUTOBUS",
  "BICICLETA", "MOTO", "SOFA", "TELEVISOR", "CINE", "CARTA", "TELON", "TEATRO", "JUEGO",
  "HERRAMIENTA", "TALLER", "MARTILLO", "CLAVO", "DESTORNILLADOR", "PAPEL", "HOJA", "LIBERTAD",
  "ESPEJO", "NEVADO", "PAIS", "AMERICA", "EUROPA", "AFRICA", "ASIA", "OCEANO", "ATLANTICO", "PACIFICO",
  "VULCANO", "FUMO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE", "DIEZ", "MIL", "CINCUENTA", "CIEN",
  "CUARENTA", "DOCTOR", "ENFERMERO", "MEDICINA", "CURA", "SALUD", "FIESTA", "CUMPLEANOS", "NAVIDAD",
  "MES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO", "DESIERTO", "SELVA",
  "LAGO", "PLAYA", "MUSEO", "GALERIA", "ZOOLOGICO", "RATON", "SERPIENTE", "COBRA", "TIBURON",
  "BALLENA", "DELFIN", "GAVIOTA", "PATITO", "PESCA", "CARNAVAL", "DISFRAZ", "COSTUMBRE", "INVIERNO",
  "VERANO", "PRIMAVERA", "FRESCO", "CALOR", "CIEGO", "SORDO", "MUDO", "CIEGOS", "SORDOS", "NOCTURNO",
  "LLUVIA", "NIEVE", "AGUACERO", "TORNADO", "HURACAN", "INUNDACION", "TERREMOTO", "RAYO", "TRUENO",
  "TEMPORAL", "LIGERO", "LENTO", "RAPIDO", "VELOCIDAD", "RUTA", "CAMINO", "CARRETERA", "AUTOPISTA",
  "PUENTE", "FERRIS", "PUERTO", "BOMBA", "EXPLORADOR", "ROCA", "PAREDES", "LAZO", "CINTA",
  "CRUCERO", "PASTEL", "CARAMELO", "GALLETA", "YOGUR", "FRUTA"
];

function HangmanGame() {
  const navigate = useNavigate();
  const [selectedWord, setSelectedWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState("");
  const [isDead, setIsDead] = useState(false);
  const maxMistakes = 6;

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    const word = spanishWords[Math.floor(Math.random() * spanishWords.length)];
    setSelectedWord(word);
    setGuessedLetters([]);
    setMistakes(0);
    setMessage("");
    setIsDead(false);
    resetCanvas();
  };

  const guessLetter = (letter) => {
    if (guessedLetters.includes(letter) || mistakes >= maxMistakes || isDead) return;

    setGuessedLetters(prev => [...prev, letter]);

    if (selectedWord.includes(letter)) {
      const allGuessed = selectedWord.split("").every(
        (l) => [...guessedLetters, letter].includes(l)
      );
      if (allGuessed) {
        setMessage("¡Ganaste! 🎉");
      }
    } else {
      setMistakes(prev => {
        const newMistakes = prev + 1;
        drawPart(newMistakes);
        if (newMistakes >= maxMistakes) {
          setIsDead(true);
          setMessage(`¡Perdiste! La palabra era: ${selectedWord}`);
        }
        return newMistakes;
      });
    }
  };

  const drawPart = (mistakes) => {
    const canvas = document.getElementById("hangmanCanvas");
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 3;
    switch (mistakes) {
      case 1:
        ctx.beginPath();
        ctx.arc(200, 100, 20, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 2:
        ctx.beginPath();
        ctx.moveTo(200, 120);
        ctx.lineTo(200, 190);
        ctx.stroke();
        break;
      case 3:
        ctx.beginPath();
        ctx.moveTo(200, 140);
        ctx.lineTo(170, 170);
        ctx.stroke();
        break;
      case 4:
        ctx.beginPath();
        ctx.moveTo(200, 140);
        ctx.lineTo(230, 170);
        ctx.stroke();
        break;
      case 5:
        ctx.beginPath();
        ctx.moveTo(200, 190);
        ctx.lineTo(170, 240);
        ctx.stroke();
        break;
      case 6:
        ctx.beginPath();
        ctx.moveTo(200, 190);
        ctx.lineTo(230, 240);
        ctx.stroke();
        drawDeadFace();
        break;
      default:
        break;
    }
  };

  const drawDeadFace = () => {
    const canvas = document.getElementById("hangmanCanvas");
    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(190, 90);
    ctx.lineTo(210, 110);
    ctx.moveTo(210, 90);
    ctx.lineTo(190, 110);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(200, 130, 10, 0, Math.PI);
    ctx.stroke();
  };

  const resetCanvas = () => {
    const canvas = document.getElementById("hangmanCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBase();
  };

  const drawBase = () => {
    const canvas = document.getElementById("hangmanCanvas");
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(50, 280);
    ctx.lineTo(250, 280);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(100, 280);
    ctx.lineTo(100, 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(100, 50);
    ctx.lineTo(200, 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(200, 50);
    ctx.lineTo(200, 80);
    ctx.stroke();
  };

  const updateWord = () => {
    return selectedWord
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");
  };

  const generateLetterButtons = () => {
    const letters = [];
    for (let i = 65; i <= 90; i++) {
      const char = String.fromCharCode(i);
      letters.push(
        <button
          key={char}
          onClick={() => guessLetter(char)}
          disabled={guessedLetters.includes(char) || mistakes >= maxMistakes || isDead}
          className={guessedLetters.includes(char) ? 'disabled' : ''}
        >
          {char}
        </button>
      );
    }
    return letters;
  };

  return (
    <div>
      <div className="logo-trivia">
        <img src={logoImg} alt="Cerebro" />
      </div>

      <div id="game">
        <div id="question">¿Completa la palabra?</div>
        <div id="word">{updateWord()}</div>
        <div id="letters" className="letters">{generateLetterButtons()}</div>
        <canvas id="hangmanCanvas" width="300" height="300"></canvas>
        <div id="message">{message}</div>
        <div id="attempts">
          Intentos: {mistakes}/{maxMistakes}
        </div>
        <div className="button-acciones">
        <button id="restartGameBtn" onClick={startGame}>
          Reiniciar Juego
        </button>
        <button id="goBackBtn" onClick={() => navigate('/')}>
          Regresar al Inicio
        </button>
        </div>
      </div>
    </div>
  );
}

export default HangmanGame;
