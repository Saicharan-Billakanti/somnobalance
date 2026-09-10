"use client";

import { useEffect, useRef, useState } from "react";

export function Reveal({
  children,
  from = "left",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  from?: "left" | "right";
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible
          ? "translate-x-0 opacity-100"
          : from === "left"
            ? "-translate-x-12 opacity-0"
            : "translate-x-12 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
