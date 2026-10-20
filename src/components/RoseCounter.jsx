import { useState } from 'react';
import { GiRose, GiFlowerTwirl } from 'react-icons/gi';
import { FaHeart } from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';
import { romanticAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

export default function RoseCounter() {
  const [roseCount, setRoseCount] = useState(99);
  const [flyingHearts, setFlyingHearts] = useState([]);
  const [message, setMessage] = useState('Em là bông hoa đẹp nhất trong lòng anh!');

  const handleSendRose = (e) => {
    romanticAudio.playChime();
    setRoseCount(prev => prev + 1);

    // Floating heart particle
    const id = Date.now() + Math.random();
    setFlyingHearts(prev => [...prev, { id, left: Math.random() * 80 + 10 }]);
    setTimeout(() => {
      setFlyingHearts(prev => prev.filter(h => h.id !== id));
    }, 1500);

    // Confetti every 5 roses
    if ((roseCount + 1) % 5 === 0) {
      confetti({
        particleCount: 25,
        spread: 60,
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#f472b6'],
        origin: { y: 0.8 },
      });
    }

    // Milestones
    const count = roseCount + 1;
    if (count === 100) {
      setMessage('🎉 100 đóa hồng: Trọn vẹn 100% tình yêu và sự chân thành!');
    } else if (count === 108) {
      setMessage('💖 108 đóa hồng: Lời cầu hôn ngọt ngào cho tương lai của hai đứa!');
    } else if (count === 365) {
      setMessage('🌸 365 đóa hồng: Mỗi ngày trong năm đều yêu em sâu đậm!');
    } else if (count === 520) {
      setMessage('✨ 520 đóa hồng: Anh yêu em (Wo ai ni)!');
    } else if (count === 999) {
      setMessage('🌹 999 đóa hồng: Tình yêu vĩnh cửu mãi mãi không phai nhạt!');
    } else {
      const sweetQuotes = [
        'Nụ cười của em là ánh nắng đẹp nhất!',
        'Cảm ơn em vì đã luôn là chỗ dựa bình yên của anh.',
        'Mỗi ngày có em đều là một ngày hạnh phúc.',
        'Hôm nay 20-10, em phải thật vui và rạng rỡ nhé!',
        'Gửi đến em ngàn đóa hồng thơm ngát!',
        'Yêu em hôm nay nhiều hơn hôm qua, và ít hơn ngày mai.',
      ];
      setMessage(sweetQuotes[count % sweetQuotes.length]);
    }
  };

  return (
    <section id="rose-section" className="relative max-w-4xl mx-auto px-4 py-16">
      <div className="relative glass-card rounded-3xl p-8 sm:p-12 overflow-hidden text-center border-2 border-rose-200/90 shadow-xl">
        {/* Background floral aura */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />

        {/* Floating animated hearts when clicking */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {flyingHearts.map(h => (
            <div
              key={h.id}
              className="absolute bottom-10 animate-float text-rose-500 text-2xl"
              style={{
                left: `${h.left}%`,
                animation: 'petalFall 1.8s ease-out forwards',
                transform: 'translateY(-150px)',
              }}
            >
              🌹
            </div>
          ))}
        </div>

        {/* Section Title */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-3">
          <GiFlowerTwirl className="text-base" /> Vườn Hoa Dành Tặng Em
        </div>

        <h3 className="text-3xl sm:text-4xl font-serif-romantic font-bold text-rose-950 mb-3">
          Gửi Tặng 999 Đóa Hồng Yêu Thương
        </h3>

        <p className="text-rose-600/80 text-sm max-w-md mx-auto mb-6 font-light">
          Mỗi lần em chạm vào bông hoa là một lời chúc và một đóa hồng tươi thắm gửi trao đến em.
        </p>

        {/* Big Glowing Rose Icon & Counter */}
        <div className="relative inline-flex flex-col items-center justify-center my-4">
          <div
            onClick={handleSendRose}
            className="group relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-rose-500 via-rose-400 to-pink-400 flex items-center justify-center shadow-2xl cursor-pointer hover:scale-108 active:scale-95 transition-all duration-300 border-4 border-white/80"
          >
            <GiRose className="text-white text-6xl sm:text-7xl drop-shadow-lg group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute -inset-2 rounded-full bg-rose-400/30 blur-lg -z-10 group-hover:bg-rose-500/50" />
          </div>

          <span className="mt-4 text-xs uppercase tracking-widest text-rose-400 font-semibold">
            Chạm vào bông hồng để gửi yêu thương
          </span>
        </div>

        {/* Counter Badge */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <FaHeart className="text-rose-500 animate-pulse" />
          <span className="text-4xl sm:text-6xl font-number font-black text-rose-600 tracking-tight leading-none">
            {roseCount}
          </span>
          <span className="text-base sm:text-lg font-medium text-rose-800">
            Đóa Hồng Đang Tỏa Sắc
          </span>
        </div>

        {/* Milestone Message banner */}
        <div className="mt-6 inline-block max-w-lg px-6 py-2.5 rounded-2xl bg-rose-50/90 border border-rose-200/80 text-rose-800 text-xs sm:text-sm font-medium shadow-xs">
          <span className="flex items-center justify-center gap-2">
            <HiSparkles className="text-amber-400 text-xs" />
            {message}
          </span>
        </div>
      </div>
    </section>
  );
}
