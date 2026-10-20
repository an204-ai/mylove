import { useState, useEffect, useRef } from 'react';
import { GiRose } from 'react-icons/gi';
import { HiSparkles } from 'react-icons/hi2';
import { romanticAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

// 24 Big Velvet Red Roses forming a lush, round dome bouquet (Bó hoa hồng bự)
// Staggered with a tight 0.10s interval for a continuous, seamless blooming flow
const BOUQUET_ROSES = [
  // 1. Center Heart Roses (First to sprout upward from deep inside the bouquet)
  { id: 1,  cx: 0,   cy: 0,   scale: 1.25, rot: 0,   delay: 0.25, color: '#e11d48' },
  { id: 2,  cx: -26, cy: -8,  scale: 1.15, rot: -12, delay: 0.35, color: '#be123c' },
  { id: 3,  cx: 26,  cy: -8,  scale: 1.15, rot: 12,  delay: 0.45, color: '#be123c' },
  { id: 4,  cx: -14, cy: 22,  scale: 1.12, rot: -8,  delay: 0.55, color: '#f43f5e' },
  { id: 5,  cx: 14,  cy: 22,  scale: 1.12, rot: 8,   delay: 0.65, color: '#e11d48' },
  { id: 6,  cx: 0,   cy: -32, scale: 1.18, rot: 5,   delay: 0.75, color: '#f43f5e' },

  // 2. Mid Ring Roses (Sprouting continuously around the core)
  { id: 7,  cx: -52, cy: -20, scale: 1.08, rot: -20, delay: 0.85, color: '#9f1239' },
  { id: 8,  cx: 52,  cy: -20, scale: 1.08, rot: 20,  delay: 0.95, color: '#9f1239' },
  { id: 9,  cx: -32, cy: -46, scale: 1.05, rot: -15, delay: 1.05, color: '#e11d48' },
  { id: 10, cx: 32,  cy: -46, scale: 1.05, rot: 15,  delay: 1.15, color: '#e11d48' },
  { id: 11, cx: -45, cy: 15,  scale: 1.05, rot: -16, delay: 1.25, color: '#be123c' },
  { id: 12, cx: 45,  cy: 15,  scale: 1.05, rot: 16,  delay: 1.35, color: '#be123c' },
  { id: 13, cx: -18, cy: 45,  scale: 1.02, rot: -10, delay: 1.45, color: '#f43f5e' },
  { id: 14, cx: 18,  cy: 45,  scale: 1.02, rot: 10,  delay: 1.55, color: '#f43f5e' },
  { id: 15, cx: 0,   cy: -68, scale: 1.08, rot: 0,   delay: 1.65, color: '#fb7185' },

  // 3. Outer Lush Perimeter Roses (Completing the big, voluminous round bouquet)
  { id: 16, cx: -76, cy: -42, scale: 0.98, rot: -32, delay: 1.75, color: '#881337' },
  { id: 17, cx: 76,  cy: -42, scale: 0.98, rot: 32,  delay: 1.85, color: '#881337' },
  { id: 18, cx: -40, cy: -75, scale: 0.96, rot: -22, delay: 1.95, color: '#9f1239' },
  { id: 19, cx: 40,  cy: -75, scale: 0.96, rot: 22,  delay: 2.05, color: '#9f1239' },
  { id: 20, cx: -80, cy: -2,  scale: 0.95, rot: -42, delay: 2.15, color: '#be123c' },
  { id: 21, cx: 80,  cy: -2,  scale: 0.95, rot: 42,  delay: 2.25, color: '#be123c' },
  { id: 22, cx: -65, cy: 35,  scale: 0.92, rot: -25, delay: 2.35, color: '#e11d48' },
  { id: 23, cx: 65,  cy: 35,  scale: 0.92, rot: 25,  delay: 2.45, color: '#e11d48' },
  { id: 24, cx: 0,   cy: -98, scale: 0.98, rot: 2,   delay: 2.55, color: '#fb7185' },
];

export default function IntroScreen({ herName = 'Em Yêu', onEnter }) {
  const canvasRef = useRef(null);
  const [isFullyBloomed, setIsFullyBloomed] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [bubblePopCount, setBubblePopCount] = useState(0);

  // When all 24 roses finish sprouting & blooming continuously (~3.2s):
  // 1. Mark bouquet as fully bloomed
  // 2. Trigger golden celebration shimmer
  // 3. Reveal bubbles, floating petals, and greeting text
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFullyBloomed(true);

      // Gentle celebratory sparkle burst
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.45 },
          colors: ['#fbbf24', '#f43f5e', '#fda4af', '#ffffff'],
          scalar: 0.85,
        });
      } catch (err) {
        // Fallback gracefully
      }
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  // Canvas Particle System:
  // ONLY ACTIVATED once isFullyBloomed is true!
  // Handles floating iridescent bubbles, falling rose petals, and click bursts.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const bubbles = [];
    const petals = [];
    const fallingPetals = [];
    const sparks = [];
    const bubbleHues = [335, 345, 280, 45, 195];

    // --- Bubble Class ---
    class Bubble {
      constructor(customX, customY, isMini = false) {
        this.reset(customX, customY, isMini);
      }

      reset(customX, customY, isMini = false) {
        this.x = customX ?? Math.random() * width;
        this.y = customY ?? height + Math.random() * 80 + 30;
        this.radius = isMini ? Math.random() * 12 + 9 : Math.random() * 22 + 14;
        this.vy = -(Math.random() * 1.1 + 0.6);
        this.vx = Math.random() * 0.6 - 0.3;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.025 + 0.01;
        this.hue = bubbleHues[Math.floor(Math.random() * bubbleHues.length)];
        this.opacity = 0;
        this.targetOpacity = Math.random() * 0.45 + 0.35;
        this.popped = false;
      }

      pop() {
        if (this.popped) return;
        this.popped = true;
        for (let i = 0; i < 6; i++) {
          petals.push(new BurstPetal(this.x, this.y, this.hue));
        }
        for (let i = 0; i < 5; i++) {
          sparks.push(new Spark(this.x, this.y));
        }
      }

      update() {
        if (this.opacity < this.targetOpacity) {
          this.opacity += 0.02;
        }

        this.y += this.vy;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.8 + this.vx;

        // Auto pop near upper 20% of screen with low probability
        if (this.y < height * 0.22 && Math.random() < 0.01) {
          this.pop();
        }

        if (this.y < -50 || this.popped) {
          this.reset();
        }
      }

      draw() {
        if (this.opacity <= 0) return;
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
        grad.addColorStop(0, `hsla(${this.hue}, 90%, 96%, ${this.opacity * 0.95})`);
        grad.addColorStop(0.5, `hsla(${this.hue + 30}, 80%, 75%, ${this.opacity * 0.4})`);
        grad.addColorStop(0.85, `hsla(${this.hue - 20}, 90%, 65%, ${this.opacity * 0.6})`);
        grad.addColorStop(1, `hsla(${this.hue}, 90%, 70%, ${this.opacity * 0.85})`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 1.3;
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 92%, ${this.opacity * 0.85})`;
        ctx.stroke();

        // Gloss highlight
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.9})`;
        ctx.beginPath();
        ctx.ellipse(
          -this.radius * 0.35,
          -this.radius * 0.35,
          this.radius * 0.3,
          this.radius * 0.16,
          -Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
      }
    }

    // --- Falling Rose Petal Class (Hiệu ứng cánh hoa rơi) ---
    class FallingPetal {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -30;
        this.size = Math.random() * 8 + 10;
        this.vy = Math.random() * 1.1 + 0.8;
        this.vx = Math.random() * 0.6 - 0.3;
        this.sway = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.03;
        this.opacity = Math.random() * 0.45 + 0.45;
        this.color = Math.random() > 0.4 ? '#e11d48' : '#fda4af';
      }

      update() {
        this.y += this.vy;
        this.sway += this.swaySpeed;
        this.x += Math.sin(this.sway) * 1.2 + this.vx;
        this.rotation += this.rotSpeed;

        if (this.y > height + 40) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        // Romantic organic petal shape
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.5, this.size * 0.9, this.size * 0.6, 0, this.size);
        ctx.bezierCurveTo(-this.size * 0.9, this.size * 0.6, -this.size * 0.8, -this.size * 0.5, 0, -this.size);
        ctx.fill();

        ctx.restore();
      }
    }

    // --- Burst Petal from Pop ---
    class BurstPetal {
      constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = Math.random() * 7 + 8;
        this.life = 0;
        this.maxLife = Math.random() * 35 + 25;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.15;
        this.opacity = 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.08;
        this.vx *= 0.96;
        this.rotation += this.rotSpeed;
        this.life++;
        this.opacity = 1 - this.life / this.maxLife;
      }

      draw() {
        if (this.opacity <= 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = `hsla(${this.hue}, 85%, 65%, ${this.opacity})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // --- Spark Class ---
    class Spark {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 0;
        this.maxLife = Math.random() * 25 + 15;
        this.size = Math.random() * 2 + 1;
        this.opacity = 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.life++;
        this.opacity = 1 - this.life / this.maxLife;
      }

      draw() {
        if (this.opacity <= 0) return;
        ctx.fillStyle = `rgba(254, 240, 138, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Only populate bubbles and falling petals if isFullyBloomed is true!
    if (isFullyBloomed) {
      const bubbleCount = width < 768 ? 16 : 24;
      for (let i = 0; i < bubbleCount; i++) {
        bubbles.push(new Bubble());
      }

      const petalCount = width < 768 ? 14 : 22;
      for (let i = 0; i < petalCount; i++) {
        fallingPetals.push(new FallingPetal());
      }
    }

    const handleCanvasClick = (e) => {
      if (!isFullyBloomed) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let hit = false;
      bubbles.forEach((b) => {
        const dist = Math.hypot(b.x - clickX, b.y - clickY);
        if (dist < b.radius + 15) {
          b.pop();
          hit = true;
        }
      });

      if (!hit) {
        for (let i = 0; i < 6; i++) {
          petals.push(new BurstPetal(clickX, clickY, 340));
          sparks.push(new Spark(clickX, clickY));
        }
      }

      romanticAudio.playPop();
      setBubblePopCount((prev) => prev + 1);
    };

    canvas.addEventListener('click', handleCanvasClick);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // ONLY draw particles if bouquet has finished blooming!
      if (isFullyBloomed) {
        // 1. Draw Continuous Falling Rose Petals
        fallingPetals.forEach((p) => {
          p.update();
          p.draw();
        });

        // 2. Draw Burst Petals
        for (let i = petals.length - 1; i >= 0; i--) {
          petals[i].update();
          petals[i].draw();
          if (petals[i].opacity <= 0) petals.splice(i, 1);
        }

        // 3. Draw Sparks
        for (let i = sparks.length - 1; i >= 0; i--) {
          sparks[i].update();
          sparks[i].draw();
          if (sparks[i].opacity <= 0) sparks.splice(i, 1);
        }

        // 4. Draw Rising Bubbles
        bubbles.forEach((b) => {
          b.update();
          b.draw();
        });
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animId);
    };
  }, [isFullyBloomed]);

  const handleEnter = (e) => {
    if (e) e.stopPropagation();
    if (isOpening) return;
    setIsOpening(true);

    romanticAudio.playChime();
    romanticAudio.startRomanticBGM(20);

    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#fbbf24', '#fda4af', '#f472b6', '#ffffff'],
      scalar: 1.25,
    });

    setTimeout(() => {
      setIsDismissed(true);
      if (onEnter) onEnter();
    }, 850);
  };

  if (isDismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden select-none transition-all duration-1000 ease-out ${
        isOpening ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: '#070105', // Deep luxurious midnight stage
      }}
    >
      {/* Inline styles for sprout-and-bloom keyframes */}
      <style>{`
        @keyframes sproutContinuous {
          0% {
            transform: scale(0) translateY(26px) rotate(-22deg);
            opacity: 0;
            filter: brightness(0.7);
          }
          40% {
            transform: scale(0.48) translateY(12px) rotate(-10deg);
            opacity: 0.9;
          }
          75% {
            transform: scale(1.16) translateY(-4px) rotate(4deg);
            opacity: 1;
            filter: brightness(1.12);
          }
          100% {
            transform: scale(1) translateY(0px) rotate(0deg);
            opacity: 1;
            filter: brightness(1);
          }
        }
      `}</style>

      {/* Atmospheric Romantic Glow */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-1500"
        style={{
          background: 'radial-gradient(ellipse at 50% 38%, rgba(159, 18, 57, 0.42) 0%, rgba(30, 4, 15, 0.88) 65%, #070105 100%)',
        }}
      >
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[540px] h-[360px] sm:h-[540px] bg-rose-500/18 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Interactive Bubbles & Petals Canvas (Starts active after flowers finish) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer z-10"
      />

      {/* Centerpiece: Big Realistic Rose Bouquet (Bó Hoa Hồng Bự Xịn Sò) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-15">
        <div className="relative -mt-20 sm:-mt-24 md:-mt-28">
          
          {/* Big Realistic Rose Bouquet SVG */}
          <svg
            className="w-[300px] h-[350px] sm:w-[380px] sm:h-[430px] md:w-[420px] md:h-[470px] overflow-visible drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)]"
            viewBox="-200 -200 400 430"
          >
            <defs>
              {/* Luxury Korean Matte Wrapping Gradients */}
              <linearGradient id="wrapPaperOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#27272a" />
                <stop offset="50%" stopColor="#18181b" />
                <stop offset="100%" stopColor="#09090b" />
              </linearGradient>

              <linearGradient id="wrapPaperInner" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3f3f46" />
                <stop offset="100%" stopColor="#18181b" />
              </linearGradient>

              {/* Gold rim piping on paper wings */}
              <linearGradient id="goldEdgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="50%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              {/* Ruffled White/Blush Florist Tissue Paper */}
              <linearGradient id="tissueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#ffe4e6" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#fecdd3" stopOpacity="0.6" />
              </linearGradient>

              {/* Satin Ribbon Bow Gradient */}
              <linearGradient id="satinRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="45%" stopColor="#f43f5e" />
                <stop offset="85%" stopColor="#be123c" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>

              {/* Realistic Velvety Rose Petal Gradients */}
              <radialGradient id="roseBaseGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#be123c" />
                <stop offset="70%" stopColor="#881337" />
                <stop offset="100%" stopColor="#4c0519" />
              </radialGradient>

              <linearGradient id="petalTopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fda4af" />
                <stop offset="40%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>

              <linearGradient id="petalSideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="50%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#9f1239" />
              </linearGradient>

              {/* --- DETAILED REALISTIC GARDEN ROSE SYMBOL --- */}
              <g id="realisticGardenRose">
                {/* 1. Base Shadow Foundation (gives 3D depth between flowers) */}
                <ellipse cx="0" cy="0" rx="27" ry="25" fill="#380415" />
                
                {/* 2. Outer Velvety Petal Layer (Organic curved petals overlapping) */}
                {/* Bottom Center Outer Petal */}
                <path d="M-22,6 C-24,24 -8,31 0,31 C8,31 24,24 22,6 C16,14 -16,14 -22,6 Z" fill="url(#roseBaseGrad)" />
                <path d="M-18,12 C-10,25 10,25 18,12 C10,16 -10,16 -18,12 Z" fill="#e11d48" opacity="0.6" />
                
                {/* Bottom Left Petal */}
                <path d="M-28,-4 C-36,14 -22,27 -8,27 C-18,18 -24,8 -28,-4 Z" fill="url(#petalSideGrad)" />
                {/* Bottom Right Petal */}
                <path d="M28,-4 C36,14 22,27 8,27 C18,18 24,8 28,-4 Z" fill="url(#petalSideGrad)" />

                {/* Top Left Outer Petal */}
                <path d="M-26,-8 C-29,-26 -8,-32 0,-30 C-12,-24 -20,-16 -26,-8 Z" fill="#9f1239" />
                {/* Top Right Outer Petal */}
                <path d="M26,-8 C29,-26 8,-32 0,-30 C12,-24 20,-16 26,-8 Z" fill="#9f1239" />

                {/* 3. Middle Tier Petals with Petal Curl Highlights */}
                {/* Left Inner Flap */}
                <path d="M-20,-12 C-26,4 -14,18 0,18 C-12,14 -18,2 -20,-12 Z" fill="url(#petalTopGrad)" />
                {/* Right Inner Flap */}
                <path d="M20,-12 C26,4 14,18 0,18 C12,14 18,2 20,-12 Z" fill="url(#petalTopGrad)" />
                
                {/* Front Middle Cup */}
                <path d="M-15,6 C-12,19 12,19 15,6 C8,12 -8,12 -15,6 Z" fill="#f43f5e" />

                {/* 4. Center Rosette Spiral Core (The tight bud whorl) */}
                <ellipse cx="0" cy="-3" rx="13" ry="11" fill="#881337" />
                <path d="M-11,-5 C-14,6 -2,12 0,12 C2,12 14,6 11,-5 C6,2 -6,2 -11,-5 Z" fill="#be123c" />
                
                {/* Inner Spiral Petal Edges */}
                <path d="M-7,-3 C-9,-10 0,-12 3,-10 C7,-8 8,-2 4,3 C1,7 -5,6 -6,2 C-7,-1 -4,-4 0,-4 C2,-4 3,-2 2,0" fill="none" stroke="#fda4af" strokeWidth="1.8" strokeLinecap="round" />
                <ellipse cx="0" cy="-2" rx="4" ry="3" fill="#ffe4e6" opacity="0.85" />
                <path d="M-2,-2 Q0,-5 2,-2" stroke="#be123c" strokeWidth="1.2" fill="none" />

                {/* 5. Dew Drop Specular Highlight */}
                <ellipse cx="14" cy="11" rx="2.5" ry="1.8" fill="rgba(255,255,255,0.7)" />
                <circle cx="13.5" cy="10.5" r="0.8" fill="#ffffff" />
              </g>

              {/* --- BABY'S BREATH SPRIG (Hoa Baby Trắng) --- */}
              <g id="babyBreath">
                {/* Stems */}
                <path d="M0,20 Q-5,8 -12,0 M0,20 Q5,10 12,2 M0,20 L0,-6" stroke="#4ade80" strokeWidth="1.2" fill="none" opacity="0.85" />
                {/* Tiny Star Florets */}
                <circle cx="-12" cy="0" r="3.2" fill="#ffffff" />
                <circle cx="-12" cy="0" r="1.1" fill="#fef08a" />
                <circle cx="12" cy="2" r="3.2" fill="#ffffff" />
                <circle cx="12" cy="2" r="1.1" fill="#fef08a" />
                <circle cx="0" cy="-6" r="3.5" fill="#ffffff" />
                <circle cx="0" cy="-6" r="1.2" fill="#fef08a" />
                <circle cx="-5" cy="8" r="2.6" fill="#ffffff" />
                <circle cx="6" cy="11" r="2.6" fill="#ffffff" />
              </g>

              {/* --- SAGE EUCALYPTUS SPRIG --- */}
              <g id="eucalyptusSprig">
                <path d="M0,35 Q-5,15 0,-15" stroke="#365314" strokeWidth="1.8" fill="none" />
                <ellipse cx="-8" cy="20" rx="9" ry="6" transform="rotate(-25 -8 20)" fill="#4d7c0f" opacity="0.9" />
                <ellipse cx="8" cy="10" rx="9" ry="6" transform="rotate(25 8 10)" fill="#65a30d" opacity="0.9" />
                <ellipse cx="-7" cy="0" rx="8" ry="5.5" transform="rotate(-30 -7 0)" fill="#4d7c0f" opacity="0.95" />
                <ellipse cx="7" cy="-8" rx="7.5" ry="5" transform="rotate(25 7 -8)" fill="#84cc16" opacity="0.9" />
              </g>

              {/* --- ROSE EMERALD LEAF --- */}
              <g id="roseLeaf">
                <path d="M0,0 C-14,-10 -15,-30 0,-40 C15,-30 14,-10 0,0 Z" fill="#14532d" />
                <path d="M0,-38 L0,0" stroke="#4ade80" strokeWidth="1" opacity="0.5" />
              </g>
            </defs>

            {/* 1. Bouquet Wrapping Paper Cone (Behind Roses) */}
            <g className="animate-fadeIn" style={{ animationDuration: '0.8s' }}>
              {/* Back dark wrapping sheet */}
              <path
                d="M-135,-45 C-70,-75 70,-75 135,-45 L40,165 L-40,165 Z"
                fill="url(#wrapPaperInner)"
              />

              {/* Left Fan-Folded Outer Wing */}
              <path
                d="M-140,-40 C-155,30 -75,140 -40,165 L-10,170 L-95,-25 Z"
                fill="url(#wrapPaperOuter)"
                stroke="url(#goldEdgeGrad)"
                strokeWidth="1.5"
              />

              {/* Right Fan-Folded Outer Wing */}
              <path
                d="M140,-40 C155,30 75,140 40,165 L10,170 L95,-25 Z"
                fill="url(#wrapPaperOuter)"
                stroke="url(#goldEdgeGrad)"
                strokeWidth="1.5"
              />

              {/* Ruffled White/Blush Florist Crinkle Tissue Paper Underlay */}
              <path
                d="M-120,-35 Q-85,-60 -55,-42 Q-25,-65 0,-48 Q25,-65 55,-42 Q85,-60 120,-35 L42,125 L-42,125 Z"
                fill="url(#tissueGrad)"
              />
            </g>

            {/* 2. Eucalyptus & Rose Greenery Framing the Dome */}
            <g opacity="0.95">
              <use href="#eucalyptusSprig" transform="translate(-105, -35) rotate(-55) scale(1.15)" />
              <use href="#eucalyptusSprig" transform="translate(105, -35) rotate(55) scale(1.15)" />
              <use href="#eucalyptusSprig" transform="translate(-60, -85) rotate(-25) scale(1.0)" />
              <use href="#eucalyptusSprig" transform="translate(60, -85) rotate(25) scale(1.0)" />
              <use href="#roseLeaf" transform="translate(-95, 10) rotate(-75) scale(0.9)" />
              <use href="#roseLeaf" transform="translate(95, 10) rotate(75) scale(0.9)" />
              <use href="#roseLeaf" transform="translate(0, -110) rotate(0) scale(0.85)" />
            </g>

            {/* 3. Baby's Breath Florets (Hoa baby trắng) Peeking Out */}
            <g opacity="0.95">
              <use href="#babyBreath" transform="translate(-90, -55) rotate(-35) scale(1.1)" />
              <use href="#babyBreath" transform="translate(90, -55) rotate(35) scale(1.1)" />
              <use href="#babyBreath" transform="translate(-45, -95) rotate(-15) scale(1.0)" />
              <use href="#babyBreath" transform="translate(45, -95) rotate(15) scale(1.0)" />
              <use href="#babyBreath" transform="translate(-85, 15) rotate(-50) scale(1.0)" />
              <use href="#babyBreath" transform="translate(85, 15) rotate(50) scale(1.0)" />
            </g>

            {/* 4. 24 BIG VELVET ROSES SPROUTING & BLOOMING CONTINUOUSLY */}
            {/* Seamless 0.10s progression - no choppy intervals! */}
            {BOUQUET_ROSES.map((rose) => (
              <g
                key={rose.id}
                style={{
                  transformOrigin: `${rose.cx}px ${rose.cy}px`,
                  animation: `sproutContinuous 0.58s cubic-bezier(0.34, 1.35, 0.64, 1) ${rose.delay}s forwards`,
                  transform: 'scale(0)',
                  opacity: 0,
                }}
              >
                <use
                  href="#realisticGardenRose"
                  x={rose.cx}
                  y={rose.cy}
                  transform={`rotate(${rose.rot} ${rose.cx} ${rose.cy}) scale(${rose.scale})`}
                />
              </g>
            ))}

            {/* 5. Front Kraft Sleeves & Luxury Satin Ribbon (In Front of Stems) */}
            <g transform="translate(0, 0)">
              {/* Left Front Folded Sleeve */}
              <path
                d="M-85,38 C-60,75 -35,120 -28,160 L0,165 L-42,75 Z"
                fill="#18181b"
                stroke="url(#goldEdgeGrad)"
                strokeWidth="1"
              />

              {/* Right Front Folded Sleeve */}
              <path
                d="M85,38 C60,75 35,120 28,160 L0,165 L42,75 Z"
                fill="#27272a"
                stroke="url(#goldEdgeGrad)"
                strokeWidth="1"
              />

              {/* Handle Wrap Ribbon Tie */}
              <rect
                x="-25"
                y="145"
                width="50"
                height="18"
                rx="4"
                fill="#1c1917"
                stroke="url(#goldEdgeGrad)"
                strokeWidth="1"
              />
              <text
                x="0"
                y="157"
                fill="#fef08a"
                fontSize="8"
                fontWeight="bold"
                letterSpacing="1.5"
                textAnchor="middle"
              >
                FOR YOU
              </text>
            </g>

            {/* 6. Big Satin Ribbon Bow at Bouquet Center */}
            <g transform="translate(0, 110)">
              {/* Ribbon Tails */}
              <path
                d="M-6,10 Q-32,55 -18,95 Q-10,115 -25,130"
                stroke="url(#satinRibbonGrad)"
                strokeWidth="9"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M6,10 Q32,55 18,95 Q10,115 25,130"
                stroke="url(#satinRibbonGrad)"
                strokeWidth="9"
                fill="none"
                strokeLinecap="round"
              />

              {/* Big Double Loops */}
              <ellipse
                cx="-26"
                cy="0"
                rx="24"
                ry="14"
                transform="rotate(-20 -26 0)"
                fill="url(#satinRibbonGrad)"
              />
              <ellipse
                cx="26"
                cy="0"
                rx="24"
                ry="14"
                transform="rotate(20 26 0)"
                fill="url(#satinRibbonGrad)"
              />

              {/* Inner loop shadows for 3D puffiness */}
              <ellipse
                cx="-24"
                cy="0"
                rx="12"
                ry="6"
                transform="rotate(-20 -24 0)"
                fill="#4c0519"
                opacity="0.65"
              />
              <ellipse
                cx="24"
                cy="0"
                rx="12"
                ry="6"
                transform="rotate(20 24 0)"
                fill="#4c0519"
                opacity="0.65"
              />

              {/* Center Knot & Gold Jewel Pin */}
              <circle cx="0" cy="0" r="9" fill="#fb7185" stroke="#be123c" strokeWidth="2" />
              <circle cx="0" cy="0" r="3.5" fill="#fef08a" />
            </g>
          </svg>

          {/* Golden Sparkles radiating when bouquet completes blooming */}
          {isFullyBloomed && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center animate-fadeIn">
              <HiSparkles className="absolute -top-6 -right-6 text-amber-300 text-3xl animate-bounce" />
              <HiSparkles className="absolute -top-3 -left-6 text-amber-200 text-2xl animate-pulse" />
              <HiSparkles className="absolute bottom-20 right-2 text-amber-300 text-xl animate-spin" style={{ animationDuration: '4s' }} />
            </div>
          )}
        </div>
      </div>

      {/* Foreground UI: APPARENT ONLY AFTER ALL ROSES HAVE FULLY BLOOMED! */}
      <div 
        className={`relative z-20 h-full flex flex-col justify-between items-center px-4 py-6 sm:py-8 pointer-events-none transition-all duration-1000 ease-out ${
          isFullyBloomed 
            ? 'opacity-100 translate-y-0 filter blur-0 pointer-events-auto' 
            : 'opacity-0 translate-y-8 filter blur-sm pointer-events-none'
        }`}
      >
        {/* Top Cute Badge */}
        <div className="pointer-events-auto mt-1 sm:mt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-rose-300/30 text-rose-200 text-xs sm:text-sm font-light tracking-widest uppercase shadow-lg shadow-rose-950/40">
            <GiRose className="text-rose-400 text-sm" />
            <span>20.10 • Tặng Em Yêu 💐</span>
            <HiSparkles className="text-amber-300 text-xs" />
          </div>
        </div>

        {/* Center Cute Message Below Bouquet */}
        <div className="text-center mt-auto mb-3 sm:mb-4 max-w-lg mx-auto">
          {/* Heading */}
          <h1 className="font-serif-romantic text-3xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-rose-300 font-bold drop-shadow-md mb-2 leading-tight">
            Bó Hoa Này Dành Riêng Cho Em
          </h1>

          {/* Cute, authentic tone for boyfriend */}
          <p className="text-xs sm:text-base text-rose-200/90 font-light leading-relaxed mb-3 px-2 sm:px-4">
            Ai bảo 20-10 là chỉ con gái mới có hoa nè?<br />
            Hôm nay em cũng có một bó hoa to đùng và tất cả sự cưng chiều của anh! ❤️
          </p>

          {/* Interactive Hint */}
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs text-rose-300/80 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-rose-400/25 pointer-events-auto shadow-sm">
            <span>✨ Chạm vào bong bóng để nổ thành cánh hoa nhé</span>
            {bubblePopCount > 0 && (
              <span className="text-amber-300 font-semibold ml-1">({bubblePopCount} 🌸)</span>
            )}
          </div>
        </div>

        {/* Bottom Call-to-Action Button */}
        <div className="flex flex-col items-center gap-2 pb-2 sm:pb-4 pointer-events-auto">
          <button
            onClick={handleEnter}
            className="group relative px-8 sm:px-11 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 text-white font-medium text-base sm:text-lg shadow-2xl shadow-rose-500/80 hover:shadow-rose-400 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/50 flex items-center gap-3 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
              <GiRose className="text-amber-200 text-lg" />
            </div>
            <span className="tracking-wide font-serif-romantic font-bold">
              Nhận Bó Hoa Này Nè 💐
            </span>
            <HiSparkles className="text-amber-200 text-sm group-hover:scale-125 transition-transform" />

            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 blur-sm opacity-50 group-hover:opacity-100 transition-opacity -z-10" />
          </button>

          <span className="text-[11px] text-rose-300/60 font-light italic">
            Chạm vào để bật nhạc và mở quà nha
          </span>
        </div>
      </div>
    </div>
  );
}
