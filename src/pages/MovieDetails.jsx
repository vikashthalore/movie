import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import RelatedMovie from "../components/RelatedMovie";
import ReactPlayer from "react-player";
import { BASE_URL } from "../config";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

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
  const moodCards = [
    { label: "Okay", icon: "😑" },
    { label: "Average", icon: "😋" },
    { label: "Good", icon: "😄" },
    { label: "Fantastic", icon: "😅" },
    { label: "Awesome", icon: "😍" },
  ];

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
        {movie.imgSample?.length > 0 && (
          <div className="w-full mx-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">
              📸 Screenshots
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {movie.imgSample.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`screenshot-${i}`}
                  className="rounded-lg w-48 h-32 object-cover shadow-md hover:scale-105 transition-all duration-300 border border-yellow-600/30"
                />
              ))}
            </div>
          </div>
        )}

        {/* ⬇️ Download (2–5) + Watch (6) */}
        {movie.downloadLinks && movie.downloadLinks.length > 1 && (
          <div className="w-full mt-6 mb-12">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              🎬 Movie Links
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
                  onClick={() => navigate(`/watch/${id}`)}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all duration-300 hover:scale-110 hover:shadow-green-400/50"
                >
                  ▶ Watch Now
                </button>
              )}
            </div>
          </div>
        )}

        {/* 🌟 Mood Rating Section */}
        <div className="w-full mt-16 mb-20">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6">
            🌟 How was the Movie?
          </h2>
          <div className="flex flex-wrap justify-center gap-5">
            {moodCards.map((mood, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-yellow-600/40 rounded-xl shadow-md hover:scale-110 hover:border-yellow-400 transition-all duration-300 flex flex-col items-center justify-center p-4 w-24 sm:w-28"
              >
                <span className="text-3xl mb-1">{mood.icon}</span>
                <p className="text-sm text-gray-300 font-medium">
                  {mood.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 🎬 Related Movies */}
        <div className="border-y-2 w-full h-auto">
          <RelatedMovie />
        </div>

{/* 🧾 SEO Text */} <section className="px-4 sm:px-8 lg:px-16 py-10 bg-gradient-to-b from-black via-gray-950 to-black text-gray-300 space-y-6"> <p className="text-base sm:text-lg leading-relaxed text-justify"> Enjoy unlimited entertainment with our{" "} <span className="text-yellow-400 font-semibold"> free movie download </span>{" "} collection featuring{" "} <span className="text-yellow-400 font-semibold"> Bollywood, Hollywood, and South Indian movies </span> . Stream or download the latest HD 720p and 1080p films directly in one click — from trending action thrillers to emotional dramas, everything is available here. Experience cinema like never before with fast servers, smooth playback, and{" "} <span className="text-yellow-400 font-semibold"> full HD free movie downloads </span>{" "} anytime, anywhere. </p> <p className="text-base sm:text-lg leading-relaxed text-justify"> Explore thousands of{" "} <span className="text-yellow-400 font-semibold"> best movies in HD quality </span>{" "} across all genres — Action, Romance, Comedy, Horror, and Sci-Fi. Download your favorite titles for free and watch offline on any device. Our library is updated daily to bring you the latest{" "} <span className="text-yellow-400 font-semibold"> Bollywood, Hollywood, and South dubbed movies </span>{" "} in HD print for a superior viewing experience. </p> <p className="text-base sm:text-lg text-center text-yellow-400 font-semibold"> Free HD Movies — Anytime, Anywhere! </p> </section>

        {/* 📜 Footer */}
        <footer className="text-gray-500 text-sm py-6 mt-10 border-t border-yellow-700/30 w-full text-center">
          © {new Date().getFullYear()} YourSiteName | All Rights Reserved
        </footer>
      </div>
    </div>
  );
};

export default MovieDetails;
