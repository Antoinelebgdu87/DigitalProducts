import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export const ModernBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle system with enhanced visuals
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      dx: number;
      dy: number;
      dz: number;
      size: number;
      alpha: number;
      color: string;
      pulse: number;
      pulseSpeed: number;
    }> = [];

    // Create floating particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        dx: (Math.random() - 0.5) * 0.8,
        dy: (Math.random() - 0.5) * 0.8,
        dz: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.6 + 0.2,
        color: `hsl(${Math.random() * 60}deg, ${70 + Math.random() * 30}%, ${50 + Math.random() * 30}%)`,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    let animationId: number;
    let frame = 0;

    const animate = () => {
      frame++;

      // Create trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.z += particle.dz;
        particle.pulse += particle.pulseSpeed;

        // Wrap around edges with 3D perspective
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;
        if (particle.z < 0) particle.z = 1000;
        if (particle.z > 1000) particle.z = 0;

        // 3D perspective
        const perspective = 1000;
        const scale = perspective / (perspective + particle.z);
        const x2d = particle.x * scale;
        const y2d = particle.y * scale;
        const size2d = particle.size * scale;

        // Pulsing effect
        const pulseSize = size2d * (1 + Math.sin(particle.pulse) * 0.3);
        const pulseAlpha =
          particle.alpha * (0.7 + Math.sin(particle.pulse) * 0.3);

        // Draw main particle with glow
        const gradient = ctx.createRadialGradient(
          x2d,
          y2d,
          0,
          x2d,
          y2d,
          pulseSize * 4,
        );
        gradient.addColorStop(
          0,
          particle.color.replace(")", `, ${pulseAlpha})`),
        );
        gradient.addColorStop(
          0.3,
          particle.color.replace(")", `, ${pulseAlpha * 0.6})`),
        );
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x2d, y2d, pulseSize * 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw core particle
        ctx.fillStyle = particle.color.replace(")", `, ${pulseAlpha})`);
        ctx.beginPath();
        ctx.arc(x2d, y2d, pulseSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections between nearby particles
        particles.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const dz = particle.z - otherParticle.z;
          const distance3d = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance3d < 200) {
            const otherScale = perspective / (perspective + otherParticle.z);
            const otherX2d = otherParticle.x * otherScale;
            const otherY2d = otherParticle.y * otherScale;

            const connectionAlpha = Math.max(0, (1 - distance3d / 200) * 0.3);

            const connectionGradient = ctx.createLinearGradient(
              x2d,
              y2d,
              otherX2d,
              otherY2d,
            );
            connectionGradient.addColorStop(
              0,
              `rgba(220, 38, 38, ${connectionAlpha * pulseAlpha})`,
            );
            connectionGradient.addColorStop(
              0.5,
              `rgba(239, 68, 68, ${connectionAlpha * 0.5})`,
            );
            connectionGradient.addColorStop(
              1,
              `rgba(220, 38, 38, ${connectionAlpha * pulseAlpha})`,
            );

            ctx.strokeStyle = connectionGradient;
            ctx.lineWidth = connectionAlpha * 2;
            ctx.beginPath();
            ctx.moveTo(x2d, y2d);
            ctx.lineTo(otherX2d, otherY2d);
            ctx.stroke();
          }
        });
      });

      // Add floating energy waves
      if (frame % 120 === 0) {
        const waveX = Math.random() * canvas.width;
        const waveY = Math.random() * canvas.height;

        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            const waveGradient = ctx.createRadialGradient(
              waveX,
              waveY,
              0,
              waveX,
              waveY,
              100 + i * 50,
            );
            waveGradient.addColorStop(0, "transparent");
            waveGradient.addColorStop(
              0.5,
              `rgba(220, 38, 38, ${0.1 - i * 0.03})`,
            );
            waveGradient.addColorStop(1, "transparent");

            ctx.fillStyle = waveGradient;
            ctx.beginPath();
            ctx.arc(waveX, waveY, 100 + i * 50, 0, Math.PI * 2);
            ctx.fill();
          }, i * 100);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      {/* Gradient backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-red-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Animated canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Overlay patterns */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(220,38,38,0.3)_0%,transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(239,68,68,0.2)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 left-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_100%,rgba(185,28,28,0.3)_0%,transparent_50%)]" />
      </div>

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 border border-red-500/20 rotate-45"
        animate={{
          rotate: [45, 405],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute top-3/4 right-1/4 w-24 h-24 border border-red-400/30 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-red-500/20 to-transparent rotate-12"
        animate={{
          rotate: [12, 372],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
