import React, { useEffect, useRef, useState } from "react";

const MovieWatch = ({ watchLink, onClose }) => {
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const [showControls, setShowControls] = useState(true);

  // ✅ Toggle Fullscreen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // ✅ Detect double-click for fullscreen toggle
  const handleDoubleClick = (e) => {
    e.preventDefault();
    toggleFullScreen();
  };

  // ✅ Show/Hide control buttons when user interacts
  const handleUserActivity = () => {
    setShowControls(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);
  };

  // ✅ Back button handling (popstate event)
  useEffect(() => {
    const handlePopState = () => {
      onClose(); // close player when browser back is clicked
    };

    window.history.pushState({ movieWatchOpen: true }, "");
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onClose]);

  // ✅ Mouse/Keyboard activity listener
  useEffect(() => {
    const events = ["mousemove", "mousedown", "touchstart", "keydown"];
    events.forEach((event) =>
      containerRef.current?.addEventListener(event, handleUserActivity)
    );

    timeoutRef.current = setTimeout(() => setShowControls(false), 3000);

    return () => {
      events.forEach((event) =>
        containerRef.current?.removeEventListener(event, handleUserActivity)
      );
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // ✅ PostMessage fullscreen support (e.g., YouTube)
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === "playFullscreen" || event.data?.event === "requestFullscreen") {
        toggleFullScreen();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!watchLink) return null;

  // ✅ Normalize YouTube URLs for fullscreen
  const finalLink =
    watchLink.includes("youtube.com") || watchLink.includes("youtu.be")
      ? `${watchLink.split("?")[0]}?fs=1&autoplay=1&rel=0`
      : watchLink;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-[100] overflow-hidden cursor-none"
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
      onDoubleClick={handleDoubleClick} // ✅ double click toggle fullscreen
    >
      <iframe
        src={finalLink}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen
        title="Movie Player"
      />

      {/* 🎛️ Floating Controls */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Fullscreen Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFullScreen();
          }}
          className="pointer-events-auto absolute bottom-16 right-6 bg-white text-black px-5 py-3 rounded-lg shadow-xl z-20 hover:bg-gray-200 text-lg font-semibold flex items-center gap-2"
        >
          ⛶ Fullscreen
        </button>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="pointer-events-auto absolute bottom-16 left-6 
             bg-red-600 hover:bg-red-700 text-white font-bold 
             w-16 h-16 rounded-full flex items-center justify-center 
             shadow-2xl z-30 text-2xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default MovieWatch;

// import React from "react";

// const MovieWatch = ({ watchLink, onClose }) => {
//   if (!watchLink) return null; // ✅ safe check

//   return (
//     <div className="fixed inset-0 bg-black z-50 flex justify-center items-center">
//       <iframe
//         src={watchLink}
//         className="w-full h-full"
//         frameBorder="0"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
//         allowFullScreen
//         scrolling="no"
//         title="MoviesFear Watch Player"
//       ></iframe>

//       <button
//         onClick={onClose}
//         className="absolute top-5 right-5 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg shadow-lg"
//       >
//         ✖ Close
//       </button>
//     </div>
//   );
// };

// export default MovieWatch;
