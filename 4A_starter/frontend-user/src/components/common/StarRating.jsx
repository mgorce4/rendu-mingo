import React, { useState } from "react";

const StarRating = ({ rating, onRate, editable }) => {
  const [currentRating, setCurrentRating] = useState(rating);
  const [hoverRating, setHoverRating] = useState(rating);

  // Lorsque l'utilisateur clique sur une étoile,on met à jour la note actuelle et on appelle la fonction de rappel pour enregistrer la note
  const handleClick = (value) => {
    if (!editable) return;

    setCurrentRating(value);
    onRate(value);
  };

  // Lorsque la souris survole une étoile, on met à jour la note affichée
  const handleMouseEnter = (value) => {
    if (!editable) return;
    setHoverRating(value);
  };

  // Lorsque la souris quitte une étoile, on revient à la note actuelle
  const handleMouseLeave = () => {
    if (!editable) return;
    setHoverRating(currentRating);
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= hoverRating ? "active" : ""} text-sm`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          role="button"
          tabIndex={0}
          aria-label={`Note : ${star}/5`}
          tooltip={`Note : ${star}/5`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
