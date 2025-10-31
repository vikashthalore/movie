import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/${movie._id}`)}
      className="relative cursor-pointer rounded-md overflow-hidden group"
    >
      <img
        src={movie.mainPoster || movie.imgSample?.[0] || "/placeholder.png"}
        alt={movie.title}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute bottom-0 bg-black/70 text-white w-full p-2 text-center text-sm">
        {movie.title}
      </div>
    </div>
  );
};

export default MovieCard;

