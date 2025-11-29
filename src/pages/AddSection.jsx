import React, { useEffect, useState } from "react";

const AddSection = ({ movieId }) => {
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    // Agar movieId nahi hai to kuch mat karo
    if (!movieId) return;

    const key = `ad_clicked_${movieId}`;
    const timestamp = localStorage.getItem(`${key}_time`);
    const now = Date.now();

    // Agar 30 minute se kam time hua hai → ad mat dikhao
    if (timestamp && now - timestamp < 30 * 60 * 1000) {
      setShowAd(false);
      return;
    }

    // 5 second baad ad dikhao
    const timer = setTimeout(() => {
      setShowAd(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [movieId]);

  const handleAdClick = () => {
    if (!movieId) return;

    const key = `ad_clicked_${movieId}`;
    localStorage.setItem(key, "true");
    localStorage.setItem(`${key}_time`, Date.now().toString());

    // Ad kholo
    window.open("https://11745.xml.4armn.com/direct-link?pubid=994579", "_blank");

    // Layer turant hata do taaki dobara click na ho
    setShowAd(false);
  };

  // Agar ad nahi dikhana to kuch return mat karo
  if (!showAd) return null;

  return (
    <>
      {/* Puri screen pe invisible clickable layer */}
      <div
        onClick={handleAdClick}
        className="fixed inset-0 z-[9999] cursor-pointer"
      />

      {/* Mast banner top pe */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[99999] animate-bounce">
        <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full shadow-2xl font-bold text-lg md:text-xl border-4 border-white tracking-wide">
          Click Anywhere → Get Free HD Download Link!
        </div>
      </div>

      {/* Optional: Chhota sa corner badge bhi laga sakte hain */}
      <div className="fixed bottom-5 right-5 z-[99999] bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
        Ad Active
      </div>
    </>
  );
};

export default AddSection;
