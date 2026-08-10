import { useRef, type ReactNode } from "react";
import type Lenis from "lenis";
import { AppContext, type AppContextValue } from "./appContext";

export function AppProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  const scrollTo: AppContextValue["scrollTo"] = (target: string) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, {
        offset: -70,
        duration: 1.4,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return <AppContext.Provider value={{ lenisRef, scrollTo }}>{children}</AppContext.Provider>;
}
