"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "datanest.motionPaused";

export default function MotionControl() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let next = false;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      next = saved === "true" || (saved === null && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch {
      try { next = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch {}
    }
    setPaused(next);
    document.documentElement.dataset.motionPaused = String(next);
  }, []);

  function toggle() {
    const next = !paused;
    setPaused(next);
    document.documentElement.dataset.motionPaused = String(next);
    try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}
  }

  const label = paused ? "Resume animations" : "Pause animations";

  return (
    <button
      className="motionControl"
      type="button"
      aria-pressed={paused}
      aria-label={label}
      onClick={toggle}
    >
      <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span> {label}
    </button>
  );
}
