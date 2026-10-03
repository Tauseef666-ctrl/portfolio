import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { AppProvider } from "./context/app";
import { useApp } from "./hooks/useApp";
import { LoadingScreen } from "./components/effects/LoadingScreen";
import { CustomCursor } from "./components/effects/CustomCursor";
import { Atmosphere } from "./components/effects/Atmosphere";
import { Navbar } from "./components/navigation/Navbar";
import { FilmExperience } from "./components/experience/FilmExperience";
import { Footer } from "./components/sections/Footer";

function Shell() {
  const { lenisRef } = useApp();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.068,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    lenis.stop();

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [lenisRef]);

  useEffect(() => {
    if (ready) lenisRef.current?.start();
  }, [ready, lenisRef]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {!ready && <LoadingScreen onDone={() => setReady(true)} />}
      <CustomCursor />
      <Atmosphere />

      <Navbar />
      <main id="main">
        <FilmExperience />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <Shell />
      </AppProvider>
    </MotionConfig>
  );
}