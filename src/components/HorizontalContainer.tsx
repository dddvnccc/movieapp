import React from "react";

interface HorizontalContainerProps {
  children: React.ReactNode;
}

function HorizontalContainer({ children }: HorizontalContainerProps) {
  return (
    <ul className="flex items-center overflow-x-auto gap-6 horizontal-container">
      {children}
    </ul>
  );
}

export default HorizontalContainer;
