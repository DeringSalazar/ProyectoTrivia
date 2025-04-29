import React from 'react';
import { Button } from 'react-bootstrap';
import { Facebook, Twitter, Whatsapp } from 'react-bootstrap-icons';

function ShareButtons({ gameStats }) {
  const { totalQuestions, correctAnswers, percentage } = gameStats;

  const shareScore = (platform) => {
    const shareText = `¡Acabo de obtener ${correctAnswers}/${totalQuestions} (${percentage}%) en Trivia Challenge!`;
    const url = window.location.origin;
    let shareUrl = "";

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + url)}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="share-section mb-4">
      <p className="mb-3">¡Comparte tu puntuación!</p>
      <div className="d-flex justify-content-center gap-2">
        <Button variant="face" onClick={() => shareScore('facebook')}>
          <Facebook className="me-1" /> Facebook
        </Button>
        <Button variant="info" onClick={() => shareScore('twitter')}>
          <Twitter className="me-1" /> Twitter
        </Button>
        <Button variant="success" onClick={() => shareScore('whatsapp')}>
          <Whatsapp className="me-1" /> WhatsApp
        </Button>
      </div>
    </div>
  );
}

export default ShareButtons;
