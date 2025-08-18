import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  currentOpacity: number;
}

const SimpleStarsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initStars = () => {
      const numStars = 200;
      starsRef.current = [];

      for (let i = 0; i < numStars; i++) {
        starsRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.08 + 0.04,
          currentOpacity: Math.random() * 0.8 + 0.2,
        });
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas with dark background
      ctx.fillStyle = "rgba(12, 12, 12, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      timeRef.current += 0.016; // ~60fps

      starsRef.current.forEach((star) => {
        // Simple twinkle effect
        star.currentOpacity =
          star.opacity +
          Math.sin(timeRef.current * star.twinkleSpeed * 100) * 0.3;
        star.currentOpacity = Math.max(0.1, Math.min(1, star.currentOpacity));

        // Draw star
        ctx.fillStyle = `rgba(255, 255, 255, ${star.currentOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Add subtle glow for larger stars
        if (star.size > 1.5) {
          ctx.shadowColor = `rgba(255, 255, 255, ${star.currentOpacity * 0.5})`;
          ctx.shadowBlur = star.size * 2;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initStars();
    animate();

    const handleResize = () => {
      resizeCanvas();
      initStars(); // Reinitialize stars for new canvas size
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0"
      style={{
        background:
          "linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%)",
      }}
    />
  );
};

export default SimpleStarsBackground;
