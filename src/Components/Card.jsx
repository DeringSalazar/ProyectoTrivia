import React from 'react';

const Card = ({ index, card, flippedCards, matchedCards, showAllCards, handleCardClick }) => {
  return (
    <div
      className={`card ${flippedCards.includes(index) || matchedCards.includes(card.img) || showAllCards ? 'flipped' : ''}`}
      onClick={() => handleCardClick(index)}
      style={{ backgroundImage: `url(${card.bgImage})` }}
    >
      <img
        src={flippedCards.includes(index) || matchedCards.includes(card.img) || showAllCards ? card.img : 'https://via.placeholder.com/100?text=Hidden'}
        alt={card.alt}
      />
    </div>
  );
};

export default Card;
