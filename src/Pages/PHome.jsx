import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Card, Spinner, Alert } from 'react-bootstrap';
import styles from '../styles/CHome.module.css';
import music from '../music/music1.mp3'; 

const categories = [
  { id: 9, name: 'Conocimiento General' },
  { id: 10, name: 'Libros' },
  { id: 11, name: 'Películas' },
  { id: 12, name: 'Música' },
  { id: 14, name: 'Televisión' },
  { id: 15, name: 'Videojuegos' },
  { id: 17, name: 'Ciencia y Naturaleza' },
  { id: 18, name: 'Computadoras' },
  { id: 21, name: 'Deportes' },
  { id: 22, name: 'Geografía' },
  { id: 23, name: 'Historia' },
];

const difficulties = [
  { id: 'easy', name: 'Fácil', timeLimit: 30 },
  { id: 'medium', name: 'Medio', timeLimit: 20 },
  { id: 'hard', name: 'Difícil', timeLimit: 10 },
];

const languages = [
  { id: 'en', name: 'Inglés' },
  { id: 'es', name: 'Español' },
  { id: 'fr', name: 'Francés' },
  { id: 'de', name: 'Alemán' },
  { id: 'it', name: 'Italiano' },
  { id: 'pt', name: 'Portugués' },
];

const commonTranslations = {
  es: {
    "What": "Qué",
    "Who": "Quién",
    "When": "Cuándo",
    "Where": "Dónde",
    "Which": "Cuál",
    "How": "Cómo",
    "In which": "En qué",
    "True": "Verdadero",
    "False": "Falso",
    "and": "y",
    "or": "o",
    "the": "el",
    "is": "es",
    "are": "son",
    "was": "fue",
    "were": "fueron"
  }
};

function PHome({ setGameConfig, setQuestions, user, navigateToGame }) {
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log('Autoplay bloqueado:', err.message);
        setIsPlaying(false);
      });
    }
  }, []);

  const toggleMusic = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const LIBRE_TRANSLATE_ENDPOINT = 'https://translate.fedilab.app';

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`
      );

      if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);

      const data = await response.json();

      if (data.response_code === 0) {
        const processedQuestions = data.results.map(q => ({
          ...q,
          all_answers: [q.correct_answer, ...q.incorrect_answers].sort(() => Math.random() - 0.5)
        }));
        let finalQuestions = processedQuestions;

        if (language !== 'en') {
          try {
            finalQuestions = await translateAllQuestionsLibre(processedQuestions, language);
          } catch {
            setError("Error al traducir. Usando traducción de respaldo.");
            finalQuestions = applyBackupTranslation(processedQuestions, language);
          }
        }

        setQuestions(finalQuestions);
        setGameConfig({ category, difficulty, language });

        if (navigateToGame) navigateToGame();
      } else {
        setError('No se pudieron cargar las preguntas. Intenta otra configuración.');
      }
    } catch (err) {
      setError('Error de conexión. Intenta más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const translateAllQuestionsLibre = async (questions, targetLanguage) => {
    const translatedQuestions = [];

    for (const question of questions) {
      const textsToTranslate = [
        question.question,
        question.correct_answer,
        ...question.incorrect_answers
      ];

      const translatedTexts = await Promise.all(
        textsToTranslate.map(text => translateTextLibre(text, targetLanguage))
      );

      const [translatedQuestion, translatedCorrectAnswer, ...translatedIncorrectAnswers] = translatedTexts;
      const translatedAllAnswers = [translatedCorrectAnswer, ...translatedIncorrectAnswers]
        .sort(() => Math.random() - 0.5);

      translatedQuestions.push({
        ...question,
        question: translatedQuestion,
        correct_answer: translatedCorrectAnswer,
        incorrect_answers: translatedIncorrectAnswers,
        all_answers: translatedAllAnswers,
        translated: true,
        targetLanguage
      });
    }

    return translatedQuestions;
  };

  const translateTextLibre = async (text, targetLanguage) => {
    if (!text) return text;

    const formData = new URLSearchParams();
    formData.append('q', text);
    formData.append('source', 'en');
    formData.append('target', targetLanguage);
    formData.append('format', 'text');

    const response = await fetch(`${LIBRE_TRANSLATE_ENDPOINT}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });

    const result = await response.json();
    return result?.translatedText || text;
  };

  const applyBackupTranslation = (questions, targetLanguage) => {
    if (!commonTranslations[targetLanguage]) return questions;

    return questions.map(question => {
      let { question: qText, correct_answer, incorrect_answers } = question;

      for (const [original, translated] of Object.entries(commonTranslations[targetLanguage])) {
        const regex = new RegExp(`\\b${original}\\b`, 'gi');
        qText = qText.replace(regex, translated);
        correct_answer = correct_answer.replace(regex, translated);
        incorrect_answers = incorrect_answers.map(ans => ans.replace(regex, translated));
      }

      return {
        ...question,
        question: qText,
        correct_answer,
        incorrect_answers,
        all_answers: [correct_answer, ...incorrect_answers].sort(() => Math.random() - 0.5),
        translated: true,
        backupTranslation: true
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !difficulty || !language) {
      setError('Por favor, selecciona una categoría, dificultad e idioma.');
      return;
    }
    fetchQuestions();
  };

  return (
    <div className={styles.quizContainer}>
      <header className={styles.headerBrain}>
        <h1 className="display-4">Brain Brawl</h1>
      </header>

      {user && (
        <div className={styles.userInfo}>
          <img src={user.photoURL} alt="User" className="avatar rounded-circle" width="40" />
          <span className="ms-2">{user.displayName}</span>
        </div>
      )}

      <Card className={styles.cardShadow}>
        <Card.Body className={styles.cardBody}>
          <Card.Title className={styles.cardTitle}>Configura tu Juego</Card.Title>

          {error && <Alert variant="danger" className={styles.alertDanger}>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className={styles.formGroup} style={{ "--animation-order": 1 }}>
              <Form.Label className={styles.formLabel}>Categoría</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} disabled={loading}>
                <option value="">Selecciona una categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className={styles.formGroup} style={{ "--animation-order": 2 }}>
              <Form.Label className={styles.formLabel}>Dificultad</Form.Label>
              <Form.Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} disabled={loading}>
                <option value="">Selecciona una dificultad</option>
                {difficulties.map(diff => (
                  <option key={diff.id} value={diff.id}>{diff.name} - {diff.timeLimit} seg</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className={styles.formGroup} style={{ "--animation-order": 3 }}>
              <Form.Label className={styles.formLabel}>Idioma</Form.Label>
              <Form.Select value={language} onChange={(e) => setLanguage(e.target.value)} disabled={loading}>
                <option value="">Selecciona un idioma</option>
                {languages.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-grid">
              <Button type="submit" disabled={loading} className={styles.btnPrimary}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    Cargando...
                  </>
                ) : 'Comenzar Juego'}
              </Button>
            </div>
          </Form>

         
        </Card.Body>
      </Card>

      
      <audio ref={audioRef} src={music} loop />
    </div>
  );
}

export default PHome;
