import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import axios from "axios";
import { BASE_URL } from "../config";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(25); // default for desktop

  // ✅ Responsive movies per page
  useEffect(() => {
    const updateMoviesPerPage = () => {
      if (window.innerWidth < 640) setMoviesPerPage(15);
      else setMoviesPerPage(25);
    };
    updateMoviesPerPage();
    window.addEventListener("resize", updateMoviesPerPage);
    return () => window.removeEventListener("resize", updateMoviesPerPage);
  }, []);

  // ✅ Fetch all movies once
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/movies`);
        setMovies(res.data.movies || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  // ✅ Filter logic
  const filteredMovies = Array.isArray(movies)
    ? movies.filter((movie) => {
        const matchTitle = movie.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchCategory = selectedCategory
          ? movie.categories?.includes(selectedCategory)
          : true;
        const matchGenre = selectedGenre
          ? movie.genres?.includes(selectedGenre)
          : true;
        return matchTitle && matchCategory && matchGenre;
      })
    : [];

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  // ✅ Handle “Home” click — reset filters
  const handleHomeClick = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedGenre("");
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#111] min-h-screen text-white">
      {/* 🟢 Navbar (fixed at top) */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#111] border-b border-gray-800">
        <Navbar
          onSearch={(value) => setSearchTerm(value)}
          onCategorySelect={(category) => {
            setSelectedCategory(category);
            setCurrentPage(1);
          }}
          onGenreSelect={(genre) => {
            setSelectedGenre(genre);
            setCurrentPage(1);
          }}
          onHomeClick={handleHomeClick}
        />
      </div>

      {/* 🔹 Push content below fixed navbar */}
      <div className="pt-20">
        {/* 🎞️ Latest 10 Movies (scrolls with page) */}
        <div className="overflow-x-auto flex gap-4 py-5 px-5 bg-black scrollbar-hidden">
          {movies.slice(0, 10).map((movie) => (
            <img
              key={movie._id}
              src={movie.mainPoster || movie.imgSample?.[0] || "/placeholder.png"}
              alt={movie.title}
              className="h-56 w-40 rounded-md object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          ))}
        </div>

        {/* 🔥 All Movies Section */}
        <h2 className="text-xl sm:text-2xl font-bold px-5 py-4 flex items-center gap-2">
          🎬 All Movies
        </h2>

        {/* 🎬 Paginated Movie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 px-5 pb-10">
          {currentMovies.length > 0 ? (
            currentMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center">
              No movies found.
            </p>
          )}
        </div>

        {/* 🔄 Pagination Controls */}
        {filteredMovies.length > 0 && (
          <div className="flex justify-center items-center gap-3 pb-10">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-gray-700 text-gray-400"
                  : "bg-yellow-400 text-black hover:bg-yellow-500"
              }`}
            >
              Prev
            </button>

            <span className="text-gray-300">
              Page {currentPage} / {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-700 text-gray-400"
                  : "bg-yellow-400 text-black hover:bg-yellow-500"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;




// ////////////////////////

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import MovieCard from "../components/MovieCard";

// const Home = () => {
//   const [movies, setMovies] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("Home");

//   useEffect(() => {
//     const fetchMovies = async () => {
//       const res = await axios.get("http://localhost:5000/api/movies");
//       setMovies(res.data.movies);
//       setFiltered(res.data.movies);
//     };
//     fetchMovies();
//   }, []);

//   useEffect(() => {
//     let result = movies;
//     if (category !== "Home") {
//       result = result.filter((m) => m.categories?.includes(category));
//     }
//     if (search) {
//       result = result.filter((m) =>
//         m.title.toLowerCase().includes(search.toLowerCase())
//       );
//     }
//     setFiltered(result);
//   }, [search, category, movies]);

//   return (
//     <div className="bg-[#111] min-h-screen text-white">
//       <Navbar onSearch={setSearch} onCategorySelect={setCategory} />

//       {/* 🔥 Banner Section */}
//       <div className="overflow-x-auto flex gap-4 py-5 px-5 bg-[#000]">
//         {movies.slice(0, 10).map((movie) => (
//           <img
//             key={movie._id}
//             src={movie.image || movie.imgSample?.[0]}
//             alt={movie.title}
//             className="h-56 w-40 rounded-md object-cover hover:scale-105 transition"
//           />
//         ))}
//       </div>

//       {/* ⚡ Latest Releases */}
//       <h2 className="text-xl sm:text-2xl font-bold px-5 py-4">
//         🔥 Latest Releases
//       </h2>

//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 px-5 pb-10">
//         {filtered.length > 0 ? (
//           filtered.map((movie) => <MovieCard key={movie._id} movie={movie} />)
//         ) : (
//           <p className="text-gray-400 col-span-full text-center">
//             No movies found.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;
