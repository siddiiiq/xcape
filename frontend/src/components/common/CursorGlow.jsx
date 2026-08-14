import { useEffect, useRef } from "react";

// A soft warm glow that follows the cursor around the page. Desktop-only
// (skipped on touch devices) and respects prefers-reduced-motion. Position
// is written straight to a CSS variable via a ref rather than React state,
// so mouse movement never triggers a re-render.
const CursorGlow = () => {
  const glowRef = useRef(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFinePointer || prefersReducedMotion) return undefined;

    const el = glowRef.current;
    let raf = null;

    const handleMove = (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--glow-x", `${e.clientX}px`);
        el.style.setProperty("--glow-y", `${e.clientY}px`);
        el.style.opacity = "1";
      });
    };

    const handleLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("mousemove", handleMove);
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />;
};

export default CursorGlow;
