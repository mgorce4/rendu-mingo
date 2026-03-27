import { useState } from "react";

function MovieDescription({ description }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <p className={isExpanded ? '' : 'line-clamp-2'}>
        {description}
      </p>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Voir moins' : 'Voir plus'}
      </button>
    </div>
  );
}
export default MovieDescription;