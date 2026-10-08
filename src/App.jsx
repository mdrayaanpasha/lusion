import { useEffect, useState } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Home from "./pages/home.jsx";
import Loader from "./components/Loader.jsx";
import Nav from "./components/Nav.jsx";

function App() {
  const [loading, setLoading] = useState(true);

  // Locomotive-style smooth inertia scrolling, site-wide.
  // Lenis drives native scroll position, so every section's existing
  // scroll-driven animation keeps working — just glides now.
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.085,          // lower = smoother / heavier momentum
      wheelMultiplier: 1,
      smoothWheel: true,
      anchors: true,        // smooth-scroll in-page #links too
    });

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <Nav />
      <Home />
    </>
  )
}

export default App;
