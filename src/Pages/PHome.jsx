import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Add this import
import { Button, Form, Card, Spinner, Alert } from 'react-bootstrap';
import styles from '../styles/CHome.module.css';

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
  { id: 'hard', name: 'Difícil', timeLimit: 15 },
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

  const LIBRE_TRANSLATE_ENDPOINT = 'https://translate.fedilab.app';

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`
      );

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const data = await response.json();

      if (data.response_code === 0) {
        const processedQuestions = data.results.map(q => ({
          ...q,
          all_answers: [q.correct_answer, ...q.incorrect_answers].sort(() => Math.random() - 0.5)
        }));
        let finalQuestions = processedQuestions;

        if (language !== 'en') {
          console.log(`Intentando traducir preguntas al: ${language}`);

          try {
            finalQuestions = await translateAllQuestionsLibre(processedQuestions, language);
          } catch (translationError) {
            console.error("Error traduciendo preguntas:", translationError);

            setError("Error al traducir con LibreTranslate. Utilizando método de respaldo.");
            finalQuestions = applyBackupTranslation(processedQuestions, language);
          }
        }

        setQuestions(finalQuestions);
        setGameConfig({ category, difficulty, language });

        if (navigateToGame) {
          navigateToGame();
        }
      } else {
        setError('No se pudieron cargar las preguntas. Por favor, intenta con otra configuración.');
      }
    } catch (err) {
      setError('Error al conectar con la API. Por favor, intenta de nuevo más tarde.');
      console.error('Error al cargar preguntas:', err);
    } finally {
      setLoading(false);
    }
  };

  const translateAllQuestionsLibre = async (questions, targetLanguage) => {
    const translatedQuestions = [];

    for (const question of questions) {
      try {
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
        const validTranslation = translatedQuestion && translatedCorrectAnswer &&
          translatedIncorrectAnswers.every(answer => answer);

        if (!validTranslation) {
          console.warn('Algunas traducciones no fueron exitosas, usando texto original para esta pregunta');
          translatedQuestions.push(question);
          continue;
        }

        translatedQuestions.push({
          ...question,
          question: translatedQuestion,
          correct_answer: translatedCorrectAnswer,
          incorrect_answers: translatedIncorrectAnswers,
          all_answers: translatedAllAnswers,
          translated: true,
          targetLanguage
        });

      } catch (error) {
        console.error('Error traduciendo una pregunta:', error);
        translatedQuestions.push(question);
      }
    }

    return translatedQuestions;
  };

  const applyBackupTranslation = (questions, targetLanguage) => {
    if (!commonTranslations[targetLanguage]) {
      return questions;
    }

    return questions.map(question => {
      try {
        let translatedQuestion = question.question;
        let translatedCorrectAnswer = question.correct_answer;
        let translatedIncorrectAnswers = [...question.incorrect_answers];

        Object.entries(commonTranslations[targetLanguage]).forEach(([original, translated]) => {
          const regex = new RegExp(`\\b${original}\\b`, 'gi');
          translatedQuestion = translatedQuestion.replace(regex, translated);
          translatedCorrectAnswer = translatedCorrectAnswer.replace(regex, translated);
          translatedIncorrectAnswers = translatedIncorrectAnswers.map(answer =>
            answer.replace(regex, translated)
          );
        });

        const translatedAllAnswers = [translatedCorrectAnswer, ...translatedIncorrectAnswers]
          .sort(() => Math.random() - 0.5);

        return {
          ...question,
          question: translatedQuestion,
          correct_answer: translatedCorrectAnswer,
          incorrect_answers: translatedIncorrectAnswers,
          all_answers: translatedAllAnswers,
          translated: true,
          targetLanguage,
          backupTranslation: true
        };
      } catch (e) {
        console.error('Error en traducción de respaldo:', e);
        return question;
      }
    });
  };

  const translateTextLibre = async (text, targetLanguage) => {
    try {
      if (!text || text.trim() === '') {
        return text;
      }

      const formData = new URLSearchParams();
      formData.append('q', text);
      formData.append('source', 'en');
      formData.append('target', targetLanguage);
      formData.append('format', 'text');

      const response = await fetch(`${LIBRE_TRANSLATE_ENDPOINT}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (result && result.translatedText) {
        return result.translatedText;
      } else {
        return text;
      }
    } catch (error) {
      console.error(`Error con LibreTranslate:`, error);
      throw error;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !difficulty || !language) {
      setError('Por favor, selecciona una categoría, una dificultad y un idioma.');
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
              <Form.Select
                className={styles.formSelect}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className={styles.formGroup} style={{ "--animation-order": 2 }}>
              <Form.Label className={styles.formLabel}>Dificultad</Form.Label>
              <Form.Select
                className={styles.formSelect}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                disabled={loading}
              >
                <option value="">Selecciona una dificultad</option>
                {difficulties.map((diff) => (
                  <option key={diff.id} value={diff.id}>
                    {diff.name} - {diff.timeLimit} seg
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className={styles.formGroup} style={{ "--animation-order": 3 }}>
              <Form.Label className={styles.formLabel}>Idioma</Form.Label>
              <Form.Select
                className={styles.formSelect}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={loading}
              >
                <option value="">Selecciona un idioma</option>
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-grid">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className={styles.btnPrimary}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className={`me-2 ${styles.spinnerBorder}`}
                    />
                    Cargando...
                  </>
                ) : (
                  'Comenzar Juego'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default PHome;