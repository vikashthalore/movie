import React, { useEffect, useState } from "react";

// YE ARRAY ME SAB LINK DAAL DE (jitne chahe utne add kar sakta hai)
const AD_LINKS = [
  "https://11745.xml.4armn.com/direct-link?pubid=994579",
  "https://10183.xml.4armn.com/direct-link?pubid=994579&siteid=994579",
  // Yahan aur bhi add kar sakta hai
  // "https://abc.xml.4armn.com/direct-link?pubid=994579",
];

const AddSection = ({ movieId }) => {
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    const key = `ad_clicked_${movieId}`;
    const timestamp = localStorage.getItem(`${key}_time`);
    const now = Date.now();

    if (timestamp && now - timestamp < 30 * 60 * 1000) {
      setShowAd(false);
      return;
    }

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

    // YE LINE — HAR BAAR RANDOM LINK KHULEGA!
    const randomLink = AD_LINKS[Math.floor(Math.random() * AD_LINKS.length)];
    window.open(randomLink, "_blank");

    setShowAd(false);
  };

  if (!showAd) return null;

  return (
    <>
      <div
        onClick={handleAdClick}
        className="fixed inset-0 z-[9999] cursor-pointer"
      />

      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[99999] animate-bounce">
        <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full shadow-2xl font-bold text-lg md:text-xl border-4 border-white tracking-wide">
          Click Anywhere → Get Free HD Download Link!
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-[99999] bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
        Ad Active
      </div>
    </>
  );
};

export default AddSection;