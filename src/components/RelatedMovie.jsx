import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from "../config";

const RelatedMovie = () => {
  const { id } = useParams();
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        
        // Correct way to fetch movie by ID
        const res = await axios.get(`${BASE_URL}/api/movies/${id}`);
        const currentMovie = res.data.movie;
        if (!currentMovie) return;

        // 🔍 Get related movies by genre or actor
        const genre = currentMovie.genres?.[0];
        const actor = currentMovie.actors?.[0];

        const relatedRes = await axios.get(`${BASE_URL}/api/movies`);
        const allMovies = relatedRes.data.movies || [];

        const filtered = allMovies.filter(
          (m) =>
            m._id !== id &&
            (m.genres?.includes(genre) || m.actors?.includes(actor))
        );

        // 🎯 Limit: Desktop 30, Mobile 18 — handle dynamically in CSS
        setRelated(filtered.slice(0, 30));
      } catch (err) {
        console.error("Error fetching related movies:", err);
      }
    };

    fetchRelated();
  }, [id]);

  if (related.length === 0)
    return (
      <div className="text-gray-400 text-center py-8">
        No related movies found.
      </div>
    );

  return (
    <div className="w-full py-10 px-4 sm:px-6 lg:px-8 bg-black text-white">
      <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
        🎬 Related Movies
      </h2>

      <div
        className="
          grid 
          grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
          gap-5 sm:gap-6 lg:gap-8
        "
      >
        {related.map((movie) => (
          <Link
            key={movie._id}
            to={`/movie/${movie._id}`}
            className="
              group relative bg-gray-900 border border-yellow-600/30 
              rounded-xl overflow-hidden shadow-md hover:shadow-yellow-400/20 
              hover:scale-105 transition-all duration-300
            "
          >
            <img
              src={movie.mainPoster || movie.imgSample?.[0] || "/placeholder.png"}
              alt={movie.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-3 text-center">
              <h3 className="text-sm sm:text-base font-semibold text-yellow-300 group-hover:text-yellow-400 transition-all">
                {movie.title.length > 30
                  ? movie.title.slice(0, 30) + "..."
                  : movie.title}
              </h3>
              <p className="text-gray-400 text-xs mt-1">
                {movie.genres?.slice(0, 2).join(", ")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedMovie;
