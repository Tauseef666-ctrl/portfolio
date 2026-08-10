import { useEffect, useState } from "react";
import Lenis from "lenis";
import { AppProvider } from "./context/app";
import { useApp } from "./hooks/useApp";
import { LoadingScreen } from "./components/effects/LoadingScreen";
import { CustomCursor } from "./components/effects/CustomCursor";
import { ParticleField } from "./components/effects/ParticleField";
import { Navbar } from "./components/navigation/Navbar";
import { Hero } from "./components/sections/Hero";
import { Perspective } from "./components/sections/Perspective";
import { Skills } from "./components/sections/Skills";
import { Projects } from "./components/sections/Projects";
import { Testing } from "./components/sections/Testing";
import { AI } from "./components/sections/AI";
import { About } from "./components/sections/About";
import { Journey } from "./components/sections/Journey";
import { Achievements } from "./components/sections/Achievements";
import { Contact } from "./components/sections/Contact";
import { Footer } from "./components/sections/Footer";

function Shell() {
  const { lenisRef } = useApp();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 });
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
      <LoadingScreen onDone={() => setReady(true)} />
      <CustomCursor />
      <ParticleField />
      <div className="ambient" aria-hidden="true">
        <div className="blob blob-cyan" />
        <div className="blob blob-violet" />
        <div className="blob blob-magenta" />
      </div>
      <div className="grid-overlay" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <Navbar />
      <main>
        <Hero />
        <Perspective />
        <Skills />
        <Projects />
        <Testing />
        <AI />
        <About />
        <Journey />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
