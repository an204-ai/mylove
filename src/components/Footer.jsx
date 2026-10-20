import { FaHeart, FaArrowUp } from 'react-icons/fa6';
import { GiRose } from 'react-icons/gi';

export default function Footer({ hisName = 'Anh', herName = 'Em Yêu' }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 px-4 text-center border-t border-rose-200/60 bg-gradient-to-b from-transparent to-rose-100/40">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <div className="flex items-center gap-2 mb-3">
          <GiRose className="text-rose-500 text-xl" />
          <FaHeart className="text-rose-500 text-sm animate-pulse" />
          <GiRose className="text-rose-500 text-xl" />
        </div>

        <p className="font-serif-romantic text-lg sm:text-xl font-bold text-rose-950 mb-1">
          {hisName} &hearts; {herName}
        </p>

        <p className="text-xs sm:text-sm text-rose-700/80 font-light max-w-md mx-auto mb-6 leading-relaxed">
          Món quà nhỏ nhưng chứa trọn vẹn sự cưng chiều của anh dành cho em nhân ngày 20-10. Cảm ơn em vì đã là một phần tuyệt vời nhất trong cuộc sống của anh! ❤️
        </p>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-medium text-rose-700 hover:text-rose-900 hover:bg-rose-100/80 transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <FaArrowUp className="text-xs" /> Trở về đầu trang
        </button>

        <div className="text-[11px] text-rose-400/80 mt-8 font-light">
          20.10.2026 • Mãi Yêu Em 💖
        </div>
      </div>
    </footer>
  );
}
