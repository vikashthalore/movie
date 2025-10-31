import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const genresList = [
  "Action",
  "Thriller",
  "Horror",
  "Comedy",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Drama",
  "Mystery",
  "Adventure",
  "Crime",
  "Animation",
  "War",
  "Family",
  "Documentary",
];

const GenreDropdown = ({ onGenreSelect = () => {}, activeGenre }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 hover:text-yellow-400 transition-all"
      >
        GENRES {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-2 w-44 z-50 max-h-64 overflow-y-auto animate-fadeIn">
          {genresList.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                onGenreSelect(genre);
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-1 text-sm rounded-md transition-all duration-300 ${
                activeGenre === genre
                  ? "bg-yellow-500 text-black font-semibold"
                  : "hover:bg-yellow-400 hover:text-black"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenreDropdown;

