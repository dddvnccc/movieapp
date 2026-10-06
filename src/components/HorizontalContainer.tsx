import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
interface HorizontalContainerProps {
  children: React.ReactNode;
}

function HorizontalContainer({ children }: HorizontalContainerProps) {
  const [passStart, setPassStart] = useState(false);
  const [passEnd, setPassEnd] = useState(false);
  const containerRef = useRef<HTMLUListElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const { scrollLeft, scrollWidth, offsetWidth } = e.currentTarget;

    setPassStart(scrollLeft > 0);
    setPassEnd(scrollLeft >= scrollWidth - (offsetWidth + 100));
  };
  return (
    <div className="relative group/scroll">
      {passStart && (
        <button
          onClick={() => {
            if (containerRef.current) {
              containerRef.current.scrollBy({
                left: -containerRef.current.offsetWidth,
                behavior: "smooth",
              });
            }
          }}
          className="absolute z-40 top-1/3 left-0 bg-red-500 w-fit rounded-full p-2 flex items-center justify-center border opacity-0 group-hover/scroll:opacity-100 hover:scale-105"
        >
          <ChevronLeft />
        </button>
      )}

      {!passEnd && (
        <button
          onClick={() => {
            if (containerRef.current) {
              containerRef.current.scrollBy({
                left: containerRef.current.offsetWidth * 0.8,
                behavior: "smooth",
              });
            }
          }}
          className="absolute z-40 top-1/3 right-0 bg-red-500 w-fit opacity-0 group-hover/scroll:opacity-100 rounded-full p-2 flex items-center justify-center border"
        >
          <ChevronRight />
        </button>
      )}
      <div
        style={{
          pointerEvents: "none",
          opacity: passStart ? "1" : "0",
        }}
        className="absolute left-0 bg-gradient-to-r from-black to-transparent w-20 h-full z-20 transition-all duration-300"
      ></div>
      <div
        style={{
          pointerEvents: "none",
          opacity: passEnd ? "0" : "1",
        }}
        className="absolute right-0 bg-gradient-to-l from-black to-transparent w-20 h-full z-20 transition-all duration-300"
      ></div>
      <ul
        ref={containerRef}
        onScroll={handleScroll}
        onClick={() => console.log(containerRef.current?.scrollLeft)}
        className="flex items-center overflow-x-auto gap-6 horizontal-container"
      >
        {children}
      </ul>
    </div>
  );
}

export default HorizontalContainer;
