import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
}

function Portal({ children }: PortalProps) {
  const [container, setContainer] = useState<Element | null>(null);
  useEffect(() => {
    const getContainer = document.querySelector("#modal-root");
    if (!getContainer) {
      const el = document.createElement("div");
      el.id = "modal-root";
      document.body.appendChild(el);
    }
    setContainer(getContainer);
  }, []);
  if (!container) return null;
  return createPortal(children, container);
}

export default Portal;
