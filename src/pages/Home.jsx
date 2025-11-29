import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import axios from "axios";
import { BASE_URL } from "../config";
import SeoText from "../components/SeoText";
import Footer from "../components/Footer";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(25); // default desktop

  // Responsive movies per page
  useEffect(() => {
    const updateMoviesPerPage = () => {
      setMoviesPerPage(window.innerWidth < 640 ? 15 : 25);
    };
    updateMoviesPerPage();
    window.addEventListener("resize", updateMoviesPerPage);
    return () => window.removeEventListener("resize", updateMoviesPerPage);
  }, []);

  // Fetch all movies once
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

  // Filter movies
  const filteredMovies = Array.isArray(movies)
    ? movies.filter((movie) => {
        const matchTitle = movie.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = selectedCategory ? movie.categories?.includes(selectedCategory) : true;
        const matchGenre = selectedGenre ? movie.genres?.includes(selectedGenre) : true;
        return matchTitle && matchCategory && matchGenre;
      })
    : [];

  // Pagination
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  // Reset all filters
  const handleHomeClick = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedGenre("");
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#111] min-h-screen text-white">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#111] border-b border-gray-800">
        <Navbar
          onSearch={setSearchTerm}
          onCategorySelect={(cat) => {
            setSelectedCategory(cat);
            setCurrentPage(1);
          }}
          onGenreSelect={(genre) => {
            setSelectedGenre(genre);
            setCurrentPage(1);
          }}
          onHomeClick={handleHomeClick}
        />
      </div>

      {/* Main Content (pushed below fixed navbar) */}
      <div className="pt-20">
        {/* Latest 10 Movies Horizontal Scroll */}
        {/* Latest 10 Movies Horizontal Scroll - FINAL FIXED */}
<div className="overflow-x-auto flex gap-5 py-6 px-5 bg-black scrollbar-hidden">
  {movies.slice(0, 10).map((movie) => {
    // Safe image picker
    let poster = "/placeholder.png"; // default

    if (movie.mainPoster && movie.mainPoster.trim() !== "") {
      poster = movie.mainPoster;
    } else if (movie.imgSample) {
      if (Array.isArray(movie.imgSample) && movie.imgSample.length > 0) {
        poster = movie.imgSample[0];
      } else if (typeof movie.imgSample === "string") {
        poster = movie.imgSample;
      }
    }

    return (
      <div key={movie._id} className="flex-shrink-0">
        <img
          src={poster}
          alt={movie.title || "Movie"}
          className="h-64 w-44 rounded-lg object-cover shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-800"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x600/111827/ffffff?text=No+Image";
          }}
        />
      </div>
    );
  })}
</div>

        {/* All Movies Title */}
        <h2 className="text-2xl font-bold px-5 py-6 flex items-center gap-2">
          All Movies
        </h2>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 px-5 pb-10">
          {currentMovies.length > 0 ? (
            currentMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center py-10">
              No movies found.
            </p>
          )}
        </div>

        {/* Pagination */}
        {/* Pagination */}
{filteredMovies.length > moviesPerPage && (
  <div className="flex flex-col items-center gap-6 pb-12">
    {/* Prev & Next Buttons */}
    <div className="flex items-center gap-6">
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className={`px-6 py-2.5 rounded-md font-semibold transition-all shadow-md ${
          currentPage === 1
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-yellow-400 text-black hover:bg-yellow-500 active:scale-95"
        }`}
      >
        Previous
      </button>

      <span className="text-gray-300 text-lg font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className={`px-6 py-2.5 rounded-md font-semibold transition-all shadow-md ${
          currentPage === totalPages
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-yellow-400 text-black hover:bg-yellow-500 active:scale-95"
        }`}
      >
        Next
      </button>
    </div>

    {/* NEW: Direct Go to Page Input */}
    <div className="flex items-center gap-3">
      <span className="text-gray-400 text-sm">Go to Page:</span>
      <input
        type="number"
        min="1"
        max={totalPages}
        value={currentPage}
        onChange={(e) => {
          const page = parseInt(e.target.value);
          if (!isNaN(page) && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) {
              setCurrentPage(page);
            }
          }
        }}
        className="w-20 px-3 py-2 bg-gray-800 text-white text-center rounded-md border border-gray-700 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 transition-all"
        placeholder="1"
      />
      <span className="text-gray-500 text-xs">/ {totalPages}</span>
    </div>

    {/* Optional: Small Tip */}
    <p className="text-gray-500 text-xs mt-2">
      Tip: Type page number (e.g., 10) and press Enter
    </p>
  </div>
)}

        {/* Social Media Section */}
        <div className="bg-black py-14 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-5 text-center">
            <h3 className="text-3xl font-bold mb-10 text-yellow-400">
              Join Us On Social Media
            </h3>
            <div className="flex justify-center gap-10 flex-wrap">
              {/* Telegram */}
              {import.meta.env.VITE_TELEGRAM && (
                <a
                  href={import.meta.env.VITE_TELEGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="bg-blue-600 p-5 rounded-full group-hover:bg-blue-500 transition-all hover:scale-110 shadow-xl">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.72 13.1l-3.94-1.23c-.85-.27-.85-.85.13-1.27l15.4-5.93c.71-.27 1.36.17 1.1.95l-2.48 11.7c-.17.85-.73 1.06-1.47.65l-3.75-2.76-1.8 1.74c-.2.2-.37.37-.76.37z" />
                    </svg>
                  </div>
                  <p className="mt-3 text-gray-300 font-medium">Telegram</p>
                </a>
              )}

              {/* WhatsApp */}
              {import.meta.env.VITE_WHATSAPP && (
                <a
                  href={import.meta.env.VITE_WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="bg-green-600 p-5 rounded-full group-hover:bg-green-500 transition-all hover:scale-110 shadow-xl">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 5.615h-.004c-1.679 0-3.331-.674-4.522-1.893l-.323-.202-3.456.903.916-3.342-.204-.323c-1.306-2.066-1.994-4.589-1.994-7.102 0-6.076 4.947-11.016 11.023-11.016 2.947 0 5.698 1.148 7.767 3.234 2.069 2.086 3.202 4.836 3.202 7.775 0 6.077-4.947 11.016-11.023 11.016z" />
                    </svg>
                  </div>
                  <p className="mt-3 text-gray-300 font-medium">WhatsApp</p>
                </a>
              )}

              {/* Instagram */}
              {import.meta.env.VITE_INSTAGRAM && (
                <a
                  href={import.meta.env.VITE_INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5 rounded-full group-hover:from-purple-500 group-hover:to-pink-500 transition-all hover:scale-110 shadow-xl">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <p className="mt-3 text-gray-300 font-medium">Instagram</p>
                </a>
              )}

              {/* Facebook */}
              {import.meta.env.VITE_FACEBOOK && (
                <a
                  href={import.meta.env.VITE_FACEBOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="bg-blue-700 p-5 rounded-full group-hover:bg-blue-600 transition-all hover:scale-110 shadow-xl">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.646c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.253h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" />
                    </svg>
                  </div>
                  <p className="mt-3 text-gray-300 font-medium">Facebook</p>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* SEO Text & Footer */}
        <SeoText />
        <Footer />
      </div>
    </div>
  );
};

export default Home;

// /////////////////

// import React, { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import MovieCard from "../components/MovieCard";
// import axios from "axios";
// import { BASE_URL } from "../config";
// import SeoText from "../components/SeoText";
// import Footer from "../components/Footer";

// const Home = () => {
//   const [movies, setMovies] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedGenre, setSelectedGenre] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [moviesPerPage, setMoviesPerPage] = useState(25); // default for desktop

//   // ✅ Responsive movies per page
//   useEffect(() => {
//     const updateMoviesPerPage = () => {
//       if (window.innerWidth < 640) setMoviesPerPage(15);
//       else setMoviesPerPage(25);
//     };
//     updateMoviesPerPage();
//     window.addEventListener("resize", updateMoviesPerPage);
//     return () => window.removeEventListener("resize", updateMoviesPerPage);
//   }, []);

//   // ✅ Fetch all movies once
//   useEffect(() => {
//     const fetchMovies = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/movies`);
//         setMovies(res.data.movies || []);
//       } catch (error) {
//         console.error("Error fetching movies:", error);
//       }
//     };
//     fetchMovies();
//   }, []);

//   // ✅ Filter logic
//   const filteredMovies = Array.isArray(movies)
//     ? movies.filter((movie) => {
//         const matchTitle = movie.title
//           ?.toLowerCase()
//           .includes(searchTerm.toLowerCase());
//         const matchCategory = selectedCategory
//           ? movie.categories?.includes(selectedCategory)
//           : true;
//         const matchGenre = selectedGenre
//           ? movie.genres?.includes(selectedGenre)
//           : true;
//         return matchTitle && matchCategory && matchGenre;
//       })
//     : [];

//   // ✅ Pagination logic
//   const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
//   const indexOfLastMovie = currentPage * moviesPerPage;
//   const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
//   const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

//   // ✅ Handle “Home” click — reset filters
//   const handleHomeClick = () => {
//     setSearchTerm("");
//     setSelectedCategory("");
//     setSelectedGenre("");
//     setCurrentPage(1);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <div className="bg-[#111] min-h-screen text-white">
//       {/* 🟢 Navbar (fixed at top) */}
//       <div className="fixed top-0 left-0 w-full z-50 bg-[#111] border-b border-gray-800">
//         <Navbar
//           onSearch={(value) => setSearchTerm(value)}
//           onCategorySelect={(category) => {
//             setSelectedCategory(category);
//             setCurrentPage(1);
//           }}
//           onGenreSelect={(genre) => {
//             setSelectedGenre(genre);
//             setCurrentPage(1);
//           }}
//           onHomeClick={handleHomeClick}
//         />
//       </div>

//       {/* 🔹 Push content below fixed navbar */}
//       <div className="pt-20">
//         {/* 🎞️ Latest 10 Movies (scrolls with page) */}
//         <div className="overflow-x-auto flex gap-4 py-5 px-5 bg-black scrollbar-hidden">
//           {movies.slice(0, 10).map((movie) => (
//             <img
//               key={movie._id}
//               src={movie.mainPoster || movie.imgSample?.[0] || "/placeholder.png"}
//               alt={movie.title}
//               className="h-56 w-40 rounded-md object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
//             />
//           ))}
//         </div>

//         {/* 🔥 All Movies Section */}
//         <h2 className="text-xl sm:text-2xl font-bold px-5 py-4 flex items-center gap-2">
//           🎬 All Movies
//         </h2>

//         {/* 🎬 Paginated Movie Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 px-5 pb-10">
//           {currentMovies.length > 0 ? (
//             currentMovies.map((movie) => (
//               <MovieCard key={movie._id} movie={movie} />
//             ))
//           ) : (
//             <p className="text-gray-400 col-span-full text-center">
//               No movies found.
//             </p>
//           )}
//         </div>

//         {/* 🔄 Pagination Controls */}
//         {filteredMovies.length > 0 && (
//           <div className="flex justify-center items-center gap-3 pb-10">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => p - 1)}
//               className={`px-3 py-1 rounded-md ${
//                 currentPage === 1
//                   ? "bg-gray-700 text-gray-400"
//                   : "bg-yellow-400 text-black hover:bg-yellow-500"
//               }`}
//             >
//               Prev
//             </button>

//             <span className="text-gray-300">
//               Page {currentPage} / {totalPages || 1}
//             </span>

//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((p) => p + 1)}
//               className={`px-3 py-1 rounded-md ${
//                 currentPage === totalPages
//                   ? "bg-gray-700 text-gray-400"
//                   : "bg-yellow-400 text-black hover:bg-yellow-500"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//       // Home.js ke end me, <Footer /> se just pehle yeh section add karo

//       <div className="pt-20">
//         {/* ... existing code ... */}
//       </div>

//       {/* 🌟 Social Links Section - Bottom Fixed ya Footer ke upar */}
//       <div className="bg-black py-10 border-t border-gray-800">
//         <div className="max-w-7xl mx-auto px-5 text-center">
//           <h3 className="text-2xl font-bold mb-6 text-yellow-400">
//             Join Us On Social Media
//           </h3>
//           <div className="flex justify-center gap-8 flex-wrap">
//             {/* Telegram */}
//             {process.env.REACT_APP_TELEGRAM && (
//               <a
//                 href={process.env.REACT_APP_TELEGRAM}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group flex flex-col items-center gap-2 hover:scale-110 transition-transform"
//               >
//                 <div className="bg-blue-600 p-4 rounded-full group-hover:bg-blue-500 transition-colors">
//                   <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.72 13.1l-3.94-1.23c-.85-.27-.85-.85.13-1.27l15.4-5.93c.71-.27 1.36.17 1.1.95l-2.48 11.7c-.17.85-.73 1.06-1.47.65l-3.75-2.76-1.8 1.74c-.2.2-.37.37-.76.37z"/>
//                   </svg>
//                 </div>
//                 <span className="text-sm text-gray-300">Telegram</span>
//               </a>
//             )}

//             {/* WhatsApp */}
//             {process.env.REACT_APP_WHATSAPP && (
//               <a
//                 href={process.env.REACT_APP_WHATSAPP}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group flex flex-col items-center gap-2 hover:scale-110 transition-transform"
//               >
//                 <div className="bg-green-600 p-4 rounded-full group-hover:bg-green-500 transition-colors">
//                   <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 5.615h-.004c-1.679 0-3.331-.674-4.522-1.893l-.323-.202-3.456.903.916-3.342-.204-.323c-1.306-2.066-1.994-4.589-1.994-7.102 0-6.076 4.947-11.016 11.023-11.016 2.947 0 5.698 1.148 7.767 3.234 2.069 2.086 3.202 4.836 3.202 7.775 0 6.077-4.947 11.016-11.023 11.016z"/>
//                   </svg>
//                 </div>
//                 <span className="text-sm text-gray-300">WhatsApp</span>
//               </a>
//             )}

//             {/* Instagram */}
//             {process.env.REACT_APP_INSTAGRAM && (
//               <a
//                 href={process.env.REACT_APP_INSTAGRAM}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group flex flex-col items-center gap-2 hover:scale-110 transition-transform"
//               >
//                 <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full group-hover:from-purple-500 group-hover:to-pink-500 transition-all">
//                   <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
//                   </svg>
//                 </div>
//                 <span className="text-sm text-gray-300">Instagram</span>
//               </a>
//             )}

//             {/* Facebook */}
//             {process.env.REACT_APP_FACEBOOK && (
//               <a
//                 href={process.env.REACT_APP_FACEBOOK}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group flex flex-col items-center gap-2 hover:scale-110 transition-transform"
//               >
//                 <div className="bg-blue-700 p-4 rounded-full group-hover:bg-blue-600 transition-colors">
//                   <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.646c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.253h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z"/>
//                   </svg>
//                 </div>
//                 <span className="text-sm text-gray-300">Facebook</span>
//               </a>
//             )}
//           </div>
//         </div>
//       </div>

//       <div><SeoText /></div>
//       <Footer />
//     </div>
//   );
// }

// export default Home;



