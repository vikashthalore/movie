import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import RelatedMovie from "../components/RelatedMovie";
import ReactPlayer from "react-player";
import { BASE_URL } from "../config";
import SeoText from "../components/SeoText";
import Footer from "../components/Footer";
import Experiance from "../components/Experiance";
import MovieWatch from "../components/MovieWatct";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [watchLink, setWatchLink] = useState(null);
    const [selectedMood, setSelectedMood] = useState(null); // user ne kya vote kiya
  const [moodCounts, setMoodCounts] = useState([]); // initial counts (tum change kar sakte ho)

  // YE DONO YAHAN PEHLE HI DAAL DO
  const moodCards = [
  { label: "Okay",      icon: "😑" },
  { label: "Average",   icon: "🙂" },
  { label: "Good",      icon: "😀" },
  { label: "Fantastic", icon: "🤩" },
  { label: "Awesome",   icon: "😍" },
];

  const handleMoodVote = (index) => {
    setMoodCounts(prev => {
      const newCounts = [...prev];
      if (selectedMood !== null && selectedMood !== index) {
        newCounts[selectedMood] -= 1; // purana vote hatao
      }
      if (selectedMood === index) {
        setSelectedMood(null); // same click → cancel
      } else {
        newCounts[index] += 1;
        setSelectedMood(index);
      }
      return newCounts;
    });
  };
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/movies/${id}`);
        setMovie(res.data.movie);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };
    fetchMovie();
  }, [id]);

  if (!movie)
    return (
      <div className="text-center text-yellow-400 p-10 text-lg animate-pulse">
        Loading movie details...
      </div>
    );

  // 🎬 Trailer link (first link)
  const trailerLink = movie.downloadLinks?.[0];

  // ✅ Universal playable video
 {/* 🎥 Trailer Player */}
{trailerLink ? (
  <div className="w-full sm:w-4/5 md:w-3/4 lg:w-2/3 aspect-video rounded-xl overflow-hidden shadow-lg border border-yellow-500/50 mb-10">
    {/* 🧠 Decide what to render */}
    {trailerLink.includes("youtube.com") || trailerLink.includes("youtu.be") ? (
      <iframe
        src={
          trailerLink.includes("watch?v=")
            ? trailerLink.replace("watch?v=", "embed/")
            : trailerLink.includes("youtu.be/")
            ? trailerLink.replace("youtu.be/", "youtube.com/embed/")
            : trailerLink
        }
        width="100%"
        height="100%"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-xl"
      ></iframe>
    ) : trailerLink.includes("voe.sx") ||
      trailerLink.includes("streamtape") ||
      trailerLink.includes("dood") ? (
      <iframe
        src={trailerLink}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        scrolling="no"
        className="rounded-xl"
      ></iframe>
    ) : (
      <ReactPlayer
        url={trailerLink}
        controls
        width="100%"
        height="100%"
        playing={false}
        config={{
          file: { attributes: { controlsList: "nodownload" } },
        }}
        onError={(e) => console.error("🎬 Trailer failed to load:", e)}
      />
    )}
  </div>
) : (
  <p className="text-yellow-400 italic mb-10">
    🎬 Trailer not available for this movie
  </p>
)}

  // 😍 Mood emojis
         {/* Mood Rating Section - WITH VOTING & COUNT */}
        <div className="w-full mt-16 mb-20">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
            How was the Movie?
          </h2>

          {/* Mood Cards with Vote Count */}
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {moodCards.map((mood, index) => (
              <button
                key={index}
                onClick={() => handleMoodVote(index)}
                className={`relative bg-gray-900 border-2 rounded-2xl p-6 w-28 sm:w-32 transition-all duration-300 transform hover:scale-110
                  ${selectedMood === index 
                    ? "border-yellow-400 shadow-2xl shadow-yellow-400/30 scale-110" 
                    : "border-gray-700 hover:border-yellow-500"}`}
              >
                <div className="text-5xl mb-3">{mood.icon}</div>
                <p className="text-sm font-semibold text-gray-300">{mood.label}</p>

                {/* Vote Count Badge */}
                <div className="absolute -top-3 -right-3 bg-yellow-500 text-black text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                  {moodCounts[index]}
                </div>

                {/* Selected Indicator */}
                {selectedMood === index && (
                  <div className="absolute inset-0 border-4 border-yellow-400 rounded-2xl animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          {/* Feedback Message */}
          {selectedMood !== null && (
            <p className="text-center text-green-400 mt-8 text-lg font-medium animate-fadeIn">
              Thanks for your vote! You chose: <span className="text-yellow-400 font-bold">{moodCards[selectedMood].label}</span>
            </p>
          )}
        </div>


  return (
    <div className="bg-black text-white min-h-screen">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-yellow-500 flex items-center justify-between px-4">
        <Navbar />
        <button
          onClick={() => navigate(-1)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-1 px-3 rounded-md ml-2 text-sm transition-all duration-300"
        >
          ⬅ Back
        </button>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 mt-28 flex flex-col items-center text-center animate-fadeIn">
         <p className="text-center text-yellow-400 font-semibold text-lg m-0.5">
    ⭐ MoviesFear – Stream, Download & Enjoy HD Movies Without Limits! ⭐
       </p>
        {/* 🎞 Poster */}
        <img
          src={movie.mainPoster || movie.imgSample?.[0] || "/placeholder.png"}
          alt={movie.title}
          className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 rounded-xl shadow-lg mb-8 border border-yellow-600/40 hover:scale-105 transition-all duration-300"
        />

        {/* 🎬 Title */}
        <h1 className="text-4xl font-bold text-yellow-400 mb-3">
          {movie.title}
        </h1>

        {/* 📝 Description */}
        <p className="text-gray-300 max-w-3xl leading-relaxed mb-8">
          {movie.description}
        </p>

        {/* 📦 Info Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mb-10">
          <div className="bg-gray-900 border border-yellow-600/40 p-4 rounded-xl shadow-md hover:scale-105 transition-all duration-300">
            <h3 className="text-yellow-400 font-semibold text-lg mb-1">
              🎞 Full Title
            </h3>
            <p className="text-gray-300">{movie.fullTitle || movie.title}</p>
          </div>

          <div className="bg-gray-900 border border-yellow-600/40 p-4 rounded-xl shadow-md hover:scale-105 transition-all duration-300">
            <h3 className="text-yellow-400 font-semibold text-lg mb-1">
              👨‍🎤 Cast
            </h3>
            <p className="text-gray-300">
              {movie.actors?.join(", ") || "Not Available"}
            </p>
          </div>

          <div className="bg-gray-900 border border-yellow-600/40 p-4 rounded-xl shadow-md hover:scale-105 transition-all duration-300">
            <h3 className="text-yellow-400 font-semibold text-lg mb-1">
              🧩 Type / Genre
            </h3>
            <p className="text-gray-300">
              {movie.genres?.join(", ") || "Not Available"}
            </p>
          </div>
        </div>

        {/* 🎥 Trailer Player */}
        {trailerLink ? (
  <div className="w-full sm:w-4/5 md:w-3/4 lg:w-2/3 aspect-video rounded-xl overflow-hidden shadow-lg border border-yellow-500/50 mb-10">
    {trailerLink.includes("youtube.com") || trailerLink.includes("youtu.be") ? (
      <iframe
        src={
          trailerLink.includes("watch?v=")
            ? trailerLink.replace("watch?v=", "embed/")
            : trailerLink.includes("youtu.be/")
            ? trailerLink.replace("youtu.be/", "youtube.com/embed/")
            : trailerLink
        }
        width="100%"
        height="100%"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-xl"
      ></iframe>
    ) : trailerLink.includes("voe.sx") ||
      trailerLink.includes("streamtape") ||
      trailerLink.includes("dood") ? (
      <iframe
        src={trailerLink}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        scrolling="no"
        className="rounded-xl"
      ></iframe>
    ) : (
      <ReactPlayer
        url={trailerLink}
        controls
        width="100%"
        height="100%"
        playing={false}
        config={{
          file: { attributes: { controlsList: "nodownload" } },
        }}
        onError={(e) => console.error("🎬 Trailer failed to load:", e)}
      />
    )}
  </div>
) : (
  <p className="text-yellow-400 italic mb-10">
    🎬 Trailer not available for this movie
  </p>
)}

        {/* 📸 Screenshots */}
        {/* Screenshots -  */}
{movie.imgSample?.length > 0 && (
  <div className="w-full max-w-6xl mx-auto px-4 my-12">
    <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">
      Screenshots
    </h2>

    {/* Responsive Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movie.imgSample.map((img, i) => (
        <div
          key={i}
          className="group relative overflow-hidden rounded-xl shadow-xl border border-yellow-600/20 cursor-pointer transform transition-all duration-300 hover:scale-102"
        >
          <img
            src={img}
            alt={`Screenshot ${i + 1}`}
            className="w-full h-48 sm:h-56 object-cover"
            loading="lazy"
          />
          {/* Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="text-yellow-400 font-bold text-sm">{i + 1}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        {/* ⬇️ Download (2–5) + Watch (6) */}
        {movie.downloadLinks && movie.downloadLinks.length > 1 && (
          <div className="w-full mt-6 mb-12">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              🎬 Movie Links <br />
              480p 720p 1080p 4k 
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {/* 2–5 → Download Buttons */}
              {movie.downloadLinks.slice(1, 5).map((link, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-5 rounded-full shadow-md transition-all duration-300 hover:scale-105 hover:shadow-yellow-400/50"
                >
                  Download {idx + 1}
                </a>
              ))}

              {/* 6th → Watch Page Redirect */}
              {movie.downloadLinks.length >= 6 && (
                <button
  onClick={() => setWatchLink(movie.downloadLinks[5])} // 6th link (index 5)
  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all duration-300 hover:scale-110 hover:shadow-green-400/50"
>
  ▶ Watch Now
</button>
              )}
            </div>
          </div>
        )}
        
      {/* 🎥 Fullscreen Watch Player */}
{watchLink && <MovieWatch watchLink={watchLink} onClose={() => setWatchLink(null)} />}
       


        {/* 🎬 Related Movies */}
        <div className="border-y-2 border-yellow-300 w-full h-auto">
          <RelatedMovie />
        </div>

        {/* 🌟 Mood Rating Section */}
        <div className="w-full mt-16 mb-20">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6">
            🌟 How was the Movie?
          </h2>
                  {/* Mood Rating Section - AB 100% KAAM KAREGA */}
        <div className="w-full mt-16 mb-20 px-4">
          

          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {moodCards.map((mood, index) => (
              <button
                key={index}
                onClick={() => handleMoodVote(index)}
                className={`relative bg-gray-900 border-2 rounded-3xl p-8 w-32 transition-all duration-300 hover:scale-110
                  ${selectedMood === index 
                    ? "border-yellow-400 shadow-2xl shadow-yellow-500/40 ring-4 ring-yellow-400/30" 
                    : "border-gray-700 hover:border-yellow-500"}`}
              >
                <div className="text-6xl mb-4">{mood.icon}</div>
                <p className="text-lg font-bold">{mood.label}</p>

                {/* Count Badge */}
                {/* <div className="absolute -top-3 -right-3 bg-yellow-500 text-black font-bold text-sm rounded-full w-10 h-10 flex items-center shadow-xl border-2 border-black">
                  {moodCounts[index]}
                </div> */}
              </button>
            ))}
          </div>

          {selectedMood !== null && (
            <p className="text-center mt-8 text-green-400 text-xl font-medium">
              Thank you! You rated it as <span className="text-yellow-400 font-bold">{moodCards[selectedMood].label}</span>
            </p>
          )}
        </div>


          <div>
          <Experiance />
        </div>
        </div>

        

        <div>
          <SeoText />
        </div>
      
                        <Footer />

        {/* FINAL 100% WORKING AD LAYER (NO ERROR, NO WARNING) */}
        <AdRedirectLayer movieId={id} />
      </div>
    </div>
  );
};

// NAYA COMPONENT (Bahar bana diya – bilkul safe!)
const AdRedirectLayer = ({ movieId }) => {
  const key = `ad_clicked_${movieId}`;
  const [showLayer, setShowLayer] = useState(false);

  // Check 30 min expiry
  useEffect(() => {
    const timestamp = localStorage.getItem(`${key}_time`);
    const now = Date.now();
    if (timestamp && now - timestamp < 30 * 60 * 1000) {
      return; // mat dikhao
    }

    const timer = setTimeout(() => setShowLayer(true), 5000);
    return () => clearTimeout(timer);
  }, [movieId]);

  if (!showLayer) return null;

  const handleClick = () => {
    localStorage.setItem(key, "true");
    localStorage.setItem(`${key}_time`, Date.now().toString());
    window.open("https://11745.xml.4armn.com/direct-link?pubid=994579", "_blank");
  };

  return (
    <>
      {/* Invisible Click Layer */}
      <div
        className="fixed inset-0 z-[9999] cursor-pointer"
        onClick={handleClick}
      />

      {/* Banner */}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[99999] animate-bounce">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full shadow-2xl font-bold text-lg border-4 border-white">
          Click anywhere → Get HD Link Instantly!
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
