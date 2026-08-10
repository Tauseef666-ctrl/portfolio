import { createContext, type RefObject } from "react";
import type Lenis from "lenis";

export type AppContextValue = {
  lenisRef: RefObject<Lenis | null>;
  scrollTo: (target: string) => void;
};

export const AppContext = createContext<AppContextValue>({
  lenisRef: { current: null },
  scrollTo: () => {},
});
