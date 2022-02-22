import { createContext, useContext, useEffect, useState } from "react";

const IsMobileContext = createContext(false);

export const useIsMobile = () => useContext(IsMobileContext);

export function IsMobileProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <IsMobileContext.Provider value={isMobile}>
      {children}
    </IsMobileContext.Provider>
  );
}
