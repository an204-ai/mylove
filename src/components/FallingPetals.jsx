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

    // Rose & Blossom Petal Colors
    const petalColors = [
      'rgba(244, 114, 182, 0.75)', // pink-400
      'rgba(251, 113, 133, 0.75)', // rose-400
      'rgba(243, 232, 255, 0.65)', // purple-100
      'rgba(254, 205, 211, 0.8)',  // rose-200
      'rgba(225, 29, 72, 0.6)',    // rose-600
    ];

    const petalCount = window.innerWidth < 768 ? 24 : 45;
    const petals = [];

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -20;
        this.size = Math.random() * 12 + 8;
        this.speedY = Math.random() * 1.5 + 0.8;
        this.speedX = Math.random() * 1.2 - 0.6;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
        this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
        this.sway = Math.random() * 2;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.isLeaf = Math.random() > 0.85; // 15% chance to be a gentle green leaf
      }

      update() {
        this.y += this.speedY;
        this.sway += this.swaySpeed;
        this.x += Math.sin(this.sway) * 1.2 + this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        if (this.isLeaf) {
          // Tender green leaf
          ctx.fillStyle = 'rgba(134, 239, 172, 0.7)'; // green-300
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size * 0.5, this.size * 1.1, Math.PI / 4, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          // Elegant curved rose petal shape
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

    for (let i = 0; i < petalCount; i++) {
      petals.push(new Petal());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < petals.length; i++) {
        petals[i].update();
        petals[i].draw();
      }
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
      style={{ opacity: 0.88 }}
    />
  );
}
