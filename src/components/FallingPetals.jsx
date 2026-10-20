import { useEffect, useRef } from 'react';

export default function FallingPetals({ isEnabled = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Rose Petal Colors
    const petalColors = [
      'rgba(244, 114, 182, 0.72)', // pink-400
      'rgba(251, 113, 133, 0.72)', // rose-400
      'rgba(254, 205, 211, 0.78)', // rose-200
      'rgba(225, 29, 72, 0.55)',   // rose-600
      'rgba(253, 164, 175, 0.65)', // rose-300
    ];

    const bubbleHues = [335, 345, 280, 45, 195];

    // --- Falling Petal Class ---
    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -25;
        this.size = Math.random() * 11 + 7;
        this.speedY = Math.random() * 1.3 + 0.7;
        this.speedX = Math.random() * 1.0 - 0.5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
        this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
        this.sway = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.isLeaf = Math.random() > 0.88; // 12% chance for soft eucalyptus leaf
      }

      update() {
        this.y += this.speedY;
        this.sway += this.swaySpeed;
        this.x += Math.sin(this.sway) * 1.1 + this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 25 || this.x < -30 || this.x > width + 30) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        if (this.isLeaf) {
          ctx.fillStyle = 'rgba(134, 239, 172, 0.65)';
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size * 0.45, this.size * 1.0, Math.PI / 4, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(
            -this.size * 0.6,
            -this.size * 0.8,
            -this.size * 0.8,
            this.size * 0.8,
            0,
            this.size
          );
          ctx.bezierCurveTo(
            this.size * 0.8,
            this.size * 0.8,
            this.size * 0.6,
            -this.size * 0.8,
            0,
            0
          );
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // --- Floating Ambient Bubble Class (From Intro Atmosphere) ---
    class AmbientBubble {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + Math.random() * 60 + 20;
        this.radius = Math.random() * 16 + 10;
        this.vy = -(Math.random() * 0.9 + 0.4);
        this.vx = Math.random() * 0.5 - 0.25;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        this.hue = bubbleHues[Math.floor(Math.random() * bubbleHues.length)];
        this.opacity = Math.random() * 0.25 + 0.18;
      }

      update() {
        this.y += this.vy;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.7 + this.vx;

        if (this.y < -40) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        const grad = ctx.createRadialGradient(
          -this.radius * 0.3,
          -this.radius * 0.3,
          this.radius * 0.1,
          0,
          0,
          this.radius
        );
        grad.addColorStop(0, `hsla(${this.hue}, 90%, 96%, ${this.opacity * 0.9})`);
        grad.addColorStop(0.5, `hsla(${this.hue + 25}, 80%, 75%, ${this.opacity * 0.35})`);
        grad.addColorStop(0.85, `hsla(${this.hue - 20}, 90%, 65%, ${this.opacity * 0.5})`);
        grad.addColorStop(1, `hsla(${this.hue}, 90%, 70%, ${this.opacity * 0.7})`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 1;
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 90%, ${this.opacity * 0.7})`;
        ctx.stroke();

        // Gloss highlight
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.8})`;
        ctx.beginPath();
        ctx.ellipse(
          -this.radius * 0.35,
          -this.radius * 0.35,
          this.radius * 0.28,
          this.radius * 0.14,
          -Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
      }
    }

    // --- Subtle Fairy Sparkle Class ---
    class FairySparkle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;
        this.size = Math.random() * 2 + 1;
        this.vy = -(Math.random() * 0.6 + 0.2);
        this.alpha = Math.random() * 0.5 + 0.2;
        this.pulse = Math.random() * Math.PI * 2;
      }

      update() {
        this.y += this.vy;
        this.pulse += 0.03;
        if (this.y < -10) this.reset(false);
      }

      draw() {
        const curAlpha = Math.max(0, this.alpha * (0.6 + 0.4 * Math.sin(this.pulse)));
        ctx.fillStyle = `rgba(251, 191, 36, ${curAlpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const petalCount = window.innerWidth < 768 ? 20 : 36;
    const bubbleCount = window.innerWidth < 768 ? 10 : 16;
    const sparkleCount = window.innerWidth < 768 ? 12 : 20;

    const petals = [];
    const bubbles = [];
    const sparkles = [];

    for (let i = 0; i < petalCount; i++) petals.push(new Petal());
    for (let i = 0; i < bubbleCount; i++) bubbles.push(new AmbientBubble());
    for (let i = 0; i < sparkleCount; i++) sparkles.push(new FairySparkle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle fairy sparkles
      sparkles.forEach((s) => {
        s.update();
        s.draw();
      });

      // Draw floating bubbles
      bubbles.forEach((b) => {
        b.update();
        b.draw();
      });

      // Draw falling rose petals
      petals.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={{ opacity: 0.85 }}
    />
  );
}
