import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { AppProvider } from "./context/app";
import { useApp } from "./hooks/useApp";
import { LoadingScreen } from "./components/effects/LoadingScreen";
import { CustomCursor } from "./components/effects/CustomCursor";
import { Atmosphere } from "./components/effects/Atmosphere";
import { Navbar } from "./components/navigation/Navbar";
import { CinematicHero } from "./components/scenes/CinematicHero";
import { StoryScene } from "./components/scenes/StoryScene";
import { CraftScene } from "./components/scenes/CraftScene";
import { WorkScene } from "./components/scenes/WorkScene";
import { ProofScene } from "./components/scenes/ProofScene";
import { ExploreScene } from "./components/scenes/ExploreScene";
import { NowScene } from "./components/scenes/NowScene";
import { ReachScene } from "./components/scenes/ReachScene";
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
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <LoadingScreen onDone={() => setReady(true)} />
      <CustomCursor />
      <Atmosphere />

      <Navbar />
      <main id="main">
        <CinematicHero />
        <StoryScene />
        <CraftScene />
        <WorkScene />
        <ProofScene />
        <ExploreScene />
        <NowScene />
        <ReachScene />
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