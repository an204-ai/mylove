import { FaHeart, FaEnvelope, FaCamera } from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';
import { GiRose, GiFlowerTwirl } from 'react-icons/gi';
import LoveCounter from './LoveCounter';

export default function HeroSection({ coupleData, setCoupleData }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 pt-20 pb-12 overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-tr from-rose-200/50 via-pink-200/40 to-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating Floral badges */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-rose-200/80 shadow-xs mb-6 animate-pulse-slow">
        <GiRose className="text-rose-500 text-sm" />
        <span className="text-xs sm:text-sm font-semibold tracking-wide text-rose-700">
          20 Tháng 10 • Ngày Đặc Biệt Dành Cho Em
        </span>
        <HiSparkles className="text-amber-400 text-xs" />
      </div>

      {/* Main Hero Headings */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif-romantic font-bold text-rose-950 leading-tight mb-3">
        Chúc Mừng 20-10, <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 font-dancing text-5xl sm:text-7xl md:text-8xl">
          {coupleData.herName || 'Em Của Anh'} 💖
        </span>
      </h1>

      <p className="max-w-xl mx-auto text-base sm:text-lg text-rose-700/90 font-light leading-relaxed mb-8">
        Ai bảo 20-10 chỉ con gái mới có hoa nè? Hôm nay anh dành trọn vẹn bó hoa này và cả sự cưng chiều cho em!
      </p>

      {/* Dual Floating Polaroids Preview */}
      <div className="relative flex items-center justify-center gap-3 sm:gap-6 my-4 mb-8">
        {/* Photo 1 */}
        <div className="w-28 h-38 sm:w-36 sm:h-50 p-2.5 bg-white rounded-2xl shadow-xl border border-rose-200/80 -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300">
          <img
            src="/image/E0CEBB60-1501-4888-A6CB-1000EA38CC05.jpg"
            alt={coupleData.hisName || 'Anh'}
            className="w-full h-4/5 object-cover rounded-xl"
          />
          <div className="text-[11px] text-center font-serif-romantic font-semibold text-rose-700 mt-1.5">
            {coupleData.hisName || 'Anh'} ✨
          </div>
        </div>

        {/* Center Heart Emblem */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-300/60 z-10 animate-bounce" style={{ animationDuration: '2.5s' }}>
          <FaHeart className="text-white text-2xl drop-shadow" />
        </div>

        {/* Photo 2 */}
        <div className="w-28 h-38 sm:w-36 sm:h-50 p-2.5 bg-white rounded-2xl shadow-xl border border-rose-200/80 rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300">
          <img
            src="/image/IMG_1487.JPG"
            alt={coupleData.herName || 'Em Yêu'}
            className="w-full h-4/5 object-cover rounded-xl"
          />
          <div className="text-[11px] text-center font-serif-romantic font-semibold text-rose-700 mt-1.5">
            {coupleData.herName || 'Em Yêu'} 🌹
          </div>
        </div>
      </div>

      {/* Call to Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
        <button
          onClick={() => scrollTo('greeting-card-section')}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white font-medium text-sm sm:text-base shadow-lg shadow-rose-300/50 hover:shadow-xl hover:shadow-rose-400/60 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
        >
          <FaEnvelope className="text-base" /> Mở Thiệp Chúc Mừng 💌
        </button>

        <button
          onClick={() => scrollTo('gallery-section')}
          className="px-6 py-3 rounded-full glass-card text-rose-800 font-medium text-sm sm:text-base hover:bg-rose-100/60 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <FaCamera className="text-rose-500 text-base" /> Kho Kỷ Niệm
        </button>

        <button
          onClick={() => scrollTo('rose-section')}
          className="px-6 py-3 rounded-full glass-card text-rose-800 font-medium text-sm sm:text-base hover:bg-rose-100/60 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <GiRose className="text-rose-500 text-base" /> Vườn Hoa Tặng Em
        </button>
      </div>

      {/* Love Days Counter Component */}
      <LoveCounter coupleData={coupleData} setCoupleData={setCoupleData} />
    </section>
  );
}
