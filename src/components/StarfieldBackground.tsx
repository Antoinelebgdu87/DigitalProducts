import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  prevZ: number;
}

const StarfieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);

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
      const numStars = 800;
      starsRef.current = [];

      for (let i = 0; i < numStars; i++) {
        starsRef.current.push({
          x: (Math.random() - 0.5) * 1600,
          y: (Math.random() - 0.5) * 900,
          z: Math.random() * 1000,
          prevZ: Math.random() * 1000,
        });
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const speed = 2;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      starsRef.current.forEach((star) => {
        star.prevZ = star.z;
        star.z -= speed;

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * 1600;
          star.y = (Math.random() - 0.5) * 900;
          star.z = 1000;
          star.prevZ = 1000;
        }

        const x = (star.x / star.z) * 100 + centerX;
        const y = (star.y / star.z) * 100 + centerY;
        const prevX = (star.x / star.prevZ) * 100 + centerX;
        const prevY = (star.y / star.prevZ) * 100 + centerY;

        const opacity = Math.max(0, 1 - star.z / 1000);
        const size = Math.max(0.5, (1 - star.z / 1000) * 2);

        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = size;

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Add glow effect for closer stars
        if (star.z < 300) {
          ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
          ctx.shadowBlur = size * 2;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
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

export default StarfieldBackground;
