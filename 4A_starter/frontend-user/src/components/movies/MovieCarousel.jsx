import { useState, useRef } from "react";
import MovieCard from "./MovieCard";

function MovieCarousel({ title, movies }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollPosition =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });

    //Mise à jour canScrollLeft et canScrollRight
    setCanScrollLeft(newScrollPosition > 0);
    setCanScrollRight(
      newScrollPosition < container.scrollWidth - container.clientWidth,
    );
  };

  return movies.length > 0 && (
    <section className="py-8 group relative">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 px-4">{title}</h2>

      {/* Bouton Gauche */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black p-2 rounded-r opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Container scrollable */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 "
        style={{ scrollbarWidth: "none" }}
      >
        {movies.map((movie) => (
          <div key={`${title}_${movie._id}`} className="shrink-0 w-48 md:w-64">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* Bouton Droite */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black p-2 rounded-l opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </section>
  );
}

export default MovieCarousel;
