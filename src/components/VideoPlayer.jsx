import { useEffect, useRef } from "react";
import { RiCloseLargeFill } from "react-icons/ri";

// eslint-disable-next-line react/prop-types
const VideoPlayer = ({ videoUrl, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 dark:bg-black/50 flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-[#151B21] rounded-lg relative max-w-2xl w-full"
      >
        <div className="relative flex justify-between items-center py-4 px-6 border-b border-sky-200 dark:border-gray-800">
          <h5 className="text-xl font-semibold">Video Demo</h5>
          <button
            className="cursor-pointer border border-[#1F2937] dark:bg-[#1F2937] p-2 rounded"
            onClick={onClose}
          >
            <RiCloseLargeFill className="text-xl font-medium" />
          </button>
        </div>
        <iframe
          src={videoUrl}
          title="Video Demo"
          className="w-full h-72 md:h-96 rounded-lg p-6"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
