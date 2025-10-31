import React, { useState } from "react";
import { Menu, X, ArrowLeft } from "lucide-react";
import GenreDropdown from "./GenreDropdown";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({
  onSearch = () => {},
  onCategorySelect = () => {},
  onGenreSelect = () => {},
  onHomeClick = () => {},
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Home");
  const [activeGenre, setActiveGenre] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    "Home",
    "Bollywood",
    "Hollywood",
    "South",
    "Web Series",
    "Anime",
    "Documentary",
    "K-Drama",
  ];

  // ✅ Category Click
  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setActiveGenre(null);

    if (cat === "Home") {
      onHomeClick();
      navigate("/"); // ✅ Redirect to Home always
    } else {
      onCategorySelect(cat);
    }

    setMenuOpen(false);
  };

  // ✅ Genre Click
  const handleGenreSelect = (genre) => {
    setActiveGenre(genre);
    setActiveCategory(null);
    onGenreSelect(genre);
    setMenuOpen(false);
  };

  // ✅ Go Back Button
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/"); // fallback
    }
  };

  return (
    <nav className="bg-black text-white py-3 shadow-md sticky top-0 z-50 border-b border-yellow-500/30">
      <div className="flex items-center justify-between px-4 sm:px-8">
        {/* 🎬 Logo + Back Button */}
        <div className="flex items-center gap-3">
          {/* ⬅️ Back Button */}
          {location.pathname !== "/" && (
            <button
              onClick={handleBack}
              className="p-1.5 rounded-md hover:bg-yellow-500 hover:text-black transition-all"
              title="Go Back"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {/* Logo */}
          <div
            className="flex items-center gap-1 text-yellow-400 text-xl font-bold cursor-pointer hover:scale-105 transition-all"
            onClick={() => handleCategoryClick("Home")}
          >
            🎬Find
          </div>
        </div>

        {/* 🔍 Search + Menu */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-800 text-white px-3 py-1 rounded-md w-32 sm:w-48 outline-none text-sm placeholder-gray-400"
            onChange={(e) => onSearch(e.target.value)}
          />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white transition-all hover:text-yellow-400"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 💻 Desktop Menu */}
        <div
          className="hidden md:flex flex-wrap items-center justify-end gap-2 text-sm font-medium max-w-3xl"
          style={{ wordWrap: "break-word" }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3 py-1 rounded-md transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-yellow-500 text-black font-semibold scale-105 shadow-md"
                  : "hover:text-yellow-400"
              }`}
            >
              {cat}
            </button>
          ))}

          {/* 🎭 Genre Dropdown */}
          <GenreDropdown
            onGenreSelect={handleGenreSelect}
            activeGenre={activeGenre}
          />
        </div>
      </div>

      {/* 📱 Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 py-4 animate-fadeIn">
          <div className="flex flex-col items-start gap-2 px-5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`w-full text-left px-3 py-2 rounded-md transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-yellow-500 text-black font-semibold"
                    : "hover:text-yellow-400"
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Genre inside mobile menu */}
            <GenreDropdown
              onGenreSelect={handleGenreSelect}
              activeGenre={activeGenre}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;



// ///////////////////////////

// import React, { useState } from "react";
// import { Menu, X } from "lucide-react";
// import GenreDropdown from "./GenreDropdown";

// const Navbar = ({ onSearch, onCategorySelect, onGenreSelect }) => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const categories = [
//     "Home",
//     "Bollywood",
//     "Hollywood",
//     "South",
//     "Web Series",
//     "Anime",
//     "Documentary",
//     "K-Drama",
//   ];

//   return (
//     <div className="bg-black text-white py-3 shadow-md sticky top-0 z-50 transition-all duration-200">
//       <div className="flex items-center justify-between px-5 sm:px-10">
//         {/* Left Logo */}
//         <div className="flex items-center gap-2 text-yellow-400 text-xl font-bold">
//           🎬 HDHub4U Clone
//         </div>

//         {/* Right Search (always visible) */}
//         <div className="flex items-center gap-3">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="bg-gray-800 text-white px-3 py-1 rounded-md w-32 sm:w-48 outline-none text-sm"
//             onChange={(e) => onSearch(e.target.value)}
//           />

//           {/* Hamburger Icon for Mobile */}
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="md:hidden text-white transition-all duration-500"
//           >
//             {menuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Center Menu (Desktop Only) */}
//         <div className="hidden md:flex items-center gap-5 text-sm">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => onCategorySelect(cat)}
//               className="hover:text-yellow-400 transition"
//             >
//               {cat}
//             </button>
//           ))}

//           <GenreDropdown onGenreSelect={onGenreSelect} />
//         </div>
//       </div>

//       {/* 📱 Mobile Dropdown Menu */}
//       {menuOpen && (
//         <div className="md:hidden bg-gray-900 border-t border-gray-800 py-4">
//           <div className="flex flex-col items-start gap-3 px-5">
//             {categories.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => {
//                   onCategorySelect(cat);
//                   setMenuOpen(false);
//                 }}
//                 className="w-full text-left hover:text-yellow-400 transition"
//               >
//                 {cat}
//               </button>
//             ))}

//             {/* Genre Dropdown inside mobile menu */}
//             <GenreDropdown
//               onGenreSelect={(g) => {
//                 onGenreSelect(g);
//                 setMenuOpen(false);
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Navbar;
