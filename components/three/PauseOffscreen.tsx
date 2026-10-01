"use client";
import { useEffect, useRef, useState } from "react";

/** Renders children in a full-size box and tells them whether it is on screen, so WebGL loops can pause when scrolled away. */
export default function PauseOffscreen({ children }: { children: (visible: boolean) => React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className="h-full w-full">{children(visible)}</div>;
}
