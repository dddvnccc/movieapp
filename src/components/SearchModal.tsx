import React, { useEffect, useState, useRef } from "react";
import { Search } from "lucide-react";
interface SearchModalProps {
  isActive: boolean;
  handleClose: () => void;
}
function SearchModal({ isActive, handleClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showTitle, setShowTitle] = useState("");
  useEffect(() => {
    document.body.style.overflowY = isActive ? "hidden" : "";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflowY = "";
      inputRef.current?.blur();
    };
  }, [isActive]);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
  };

  return (
    <div
      onClick={handleClose}
      style={{ display: isActive ? "flex" : "none" }}
      className="fixed z-50 inset-0 bg-black/80 items-start"
    >
      <div
        className="max-w-screen-md mt-32 w-full mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-black/90 border border-white/20 rounded-tl-lg rounded-tr-lg flex items-center gap-6 px-6"
        >
          <Search size={20} />
          <input
            ref={inputRef}
            value={showTitle}
            onChange={(e) => setShowTitle(e.target.value)}
            className="bg-transparent py-6 outline-none flex-1 w-full"
            placeholder="Search movie / series"
          />
        </form>
        <ul className="border border-white/20 rounded-bl-lg rounded-br-lg p-6">
          asldnksdk
        </ul>
      </div>
    </div>
  );
}

export default SearchModal;
