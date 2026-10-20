import { useState, useEffect } from 'react';
import { HiSparkles } from 'react-icons/hi2';
import { FaHeart, FaGift, FaCheck, FaRotateRight, FaTicket } from 'react-icons/fa6';
import { GiStarShuriken, GiMagicSwirl, GiFairyWand } from 'react-icons/gi';
import { romanticAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

const WISH_COUPONS = [
  {
    id: 1,
    code: 'VOUCHER-2010-01',
    icon: '🍧',
    title: 'Phiếu Trà Sữa & Ăn Vặt Đêm Khuya',
    tag: 'Đặc Quyền Ăn Uống',
    color: 'from-amber-400 via-orange-400 to-rose-400',
    starColor: '#f59e0b',
    desc: 'Áp dụng bất cứ lúc nào em thèm ngọt hay thèm ăn đêm. Anh sẽ lập tức dắt xe chở đi ăn hoặc đặt ship ngay tắp lự, không được cằn nhằn chuyện cân nặng gì hết!',
    condition: 'Hiệu lực: Vĩnh viễn • Sử dụng không giới hạn',
  },
  {
    id: 2,
    code: 'VOUCHER-2010-02',
    icon: '💆‍♂️',
    title: 'Phiếu Massage & Xoa Đầu Cực Đã',
    tag: 'Chăm Sóc Toàn Diện',
    color: 'from-pink-400 via-rose-400 to-red-400',
    starColor: '#ec4899',
    desc: 'Dành cho những ngày em đi làm, đi học về mệt mỏi. Được hưởng dịch vụ xoa bóp vai gáy, bóp tay và gãi đầu chuyên nghiệp từ anh trong 30 phút full combo.',
    condition: 'Hiệu lực: Bất cứ lúc nào em thấy mệt',
  },
  {
    id: 3,
    code: 'VOUCHER-2010-03',
    icon: '👑',
    title: 'Phiếu "Em Luôn Luôn Đúng" Trong 24h',
    tag: 'Đặc Quyền Tối Thượng',
    color: 'from-purple-400 via-pink-500 to-rose-500',
    starColor: '#a855f7',
    desc: 'Trong vòng 24 giờ kể từ khi kích hoạt, em luôn đúng 100%! Được quyền giận dỗi, nhõng nhẽo không cần lý do mà anh vẫn phải dỗ dành và nhận lỗi trước.',
    condition: 'Hiệu lực: Sử dụng khi muốn làm nũng',
  },
  {
    id: 4,
    code: 'VOUCHER-2010-04',
    icon: '🍳',
    title: 'Phiếu Bếp Trưởng Phục Vụ Tận Giường',
    tag: 'Món Ngon Cho Em',
    color: 'from-emerald-400 via-teal-400 to-rose-400',
    starColor: '#10b981',
    desc: 'Một bữa ăn thịnh soạn do chính tay anh vào bếp chuẩn bị theo đúng các món em thích, kèm món tráng miệng ngọt ngào và anh bao luôn khâu rửa chén dọn dẹp.',
    condition: 'Hiệu lực: Gọi món trước 2 tiếng',
  },
  {
    id: 5,
    code: 'VOUCHER-2010-05',
    icon: '🎬',
    title: 'Phiếu Rạp Phim Tại Gia Vip Pro',
    tag: 'Hẹn Hò Ấm Áp',
    color: 'from-blue-400 via-indigo-400 to-pink-400',
    starColor: '#3b82f6',
    desc: 'Em được toàn quyền chọn phim yêu thích. Anh chịu trách nhiệm chuẩn bị bỏng ngô, nước ngọt, ôm em vào lòng xem cùng từ đầu tới cuối không ngủ gật.',
    condition: 'Hiệu lực: Áp dụng cho mọi buổi tối rảnh',
  },
  {
    id: 6,
    code: 'VOUCHER-2010-06',
    icon: '🤗',
    title: 'Phiếu Ôm Sạc Năng Lượng 10 Phút',
    tag: 'Liều Thuốc Tinh Thần',
    color: 'from-rose-400 via-pink-400 to-amber-300',
    starColor: '#f43f5e',
    desc: 'Một cái ôm thật chặt từ phía sau, vỗ về xoa lưng và hít hà mùi hương của em để xua tan mọi áp lực, mỏi mệt trong cuộc sống ngoài kia.',
    condition: 'Hiệu lực: Không giới hạn số lần ôm',
  },
  {
    id: 7,
    code: 'VOUCHER-2010-07',
    icon: '🚗',
    title: 'Phiếu Hóng Gió Đêm Ngắm Phố Phường',
    tag: 'Chữa Lành Tâm Hồn',
    color: 'from-cyan-400 via-sky-400 to-rose-400',
    starColor: '#06b6d4',
    desc: 'Bất cứ khi nào em thấy ngột ngạt hay buồn chán, chỉ cần ới một tiếng là anh sẽ dắt xe chở em đi lượn khắp phố phường hóng gió mát rượi.',
    condition: 'Hiệu lực: Bất kể ngày hay đêm',
  },
  {
    id: 8,
    code: 'VOUCHER-2010-08',
    icon: '🎁',
    title: 'Phiếu Điều Ước Vạn Năng Tự Chọn',
    tag: 'Thẻ Bài Tối Thượng',
    color: 'from-amber-300 via-rose-400 to-purple-500',
    starColor: '#fbbf24',
    desc: 'Tấm vé quyền lực nhất! Em có thể tự điền bất kỳ một mong muốn nào, chỉ cần trong khả năng của anh thì anh sẽ cố gắng 100% để biến nó thành hiện thực.',
    condition: 'Hiệu lực: Vĩnh cửu trọn đời',
  },
];

export default function WishingJar({ herName = 'Em Yêu' }) {
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [stampedIds, setStampedIds] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [starAnimKey, setStarAnimKey] = useState(0);

  // Load unlocked coupons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mylove_wishing_coupons');
    if (saved) {
      try {
        setUnlockedIds(JSON.parse(saved));
      } catch (e) {
        setUnlockedIds([1, 2]);
      }
    } else {
      // By default 2 are already unlocked to tempt user
      setUnlockedIds([1, 2]);
    }

    const savedStamps = localStorage.getItem('mylove_stamped_coupons');
    if (savedStamps) {
      try {
        setStampedIds(JSON.parse(savedStamps));
      } catch (e) {}
    }
  }, []);

  const saveUnlocked = (newIds) => {
    setUnlockedIds(newIds);
    localStorage.setItem('mylove_wishing_coupons', JSON.stringify(newIds));
  };

  const handleDrawStar = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setStarAnimKey((prev) => prev + 1);
    romanticAudio.playChime();

    // Find remaining locked coupons
    const remaining = WISH_COUPONS.filter((c) => !unlockedIds.includes(c.id));
    let chosen;
    if (remaining.length > 0) {
      chosen = remaining[Math.floor(Math.random() * remaining.length)];
    } else {
      // All unlocked, pick any random
      chosen = WISH_COUPONS[Math.floor(Math.random() * WISH_COUPONS.length)];
    }

    // Trigger star flying animation for 700ms then show modal
    setTimeout(() => {
      if (!unlockedIds.includes(chosen.id)) {
        saveUnlocked([...unlockedIds, chosen.id]);
      }
      setActiveCoupon(chosen);
      setIsDrawing(false);

      // Celebration confetti
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f43f5e', '#ec4899', '#38bdf8', '#a855f7'],
      });
    }, 850);
  };

  const handleStamp = (id) => {
    if (stampedIds.includes(id)) return;
    romanticAudio.playPop();
    const newStamps = [...stampedIds, id];
    setStampedIds(newStamps);
    localStorage.setItem('mylove_stamped_coupons', JSON.stringify(newStamps));

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.5 },
      colors: ['#ef4444', '#f43f5e', '#fbbf24'],
    });
  };

  return (
    <section id="wishing-jar-section" className="relative max-w-5xl mx-auto px-4 py-16">
      {/* Decorative floral subtitle */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/90 border border-rose-200/80 text-rose-700 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-xs mb-3">
          <HiSparkles className="text-amber-500 text-sm" />
          <span>Hũ Ngôi Sao • Bộ Đặc Quyền 20-10</span>
          <GiMagicSwirl className="text-rose-500 text-sm" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif-romantic font-bold text-rose-950 mb-3">
          Chiếc Hũ Điều Ước Dành Riêng Cho Em
        </h2>
        <p className="text-rose-700/80 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
          Không cần đợi sao băng hay sinh nhật đâu nè! Hôm nay em có trọn bộ đặc quyền được anh chiều chuộng vô điều kiện. Hãy chạm vào chiếc hũ để rút một ngôi sao may mắn nhé!
        </p>
      </div>

      {/* Main Interactive Stage: Wishing Jar + Star Launcher */}
      <div className="relative glass-card rounded-3xl p-6 sm:p-10 border-2 border-rose-200/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12 overflow-hidden">
        {/* Soft Background Auras */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT: Glowing Wishing Glass Jar SVG Illustration */}
        <div className="relative flex-1 flex flex-col items-center justify-center">
          <div
            onClick={handleDrawStar}
            className="group relative cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-300"
            title="Chạm vào hũ để rút ngôi sao may mắn!"
          >
            {/* Flying Star Particle when drawing */}
            {isDrawing && (
              <div
                key={starAnimKey}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                style={{
                  animation: 'float 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  transform: 'translateY(-140px) scale(1.8) rotate(180deg)',
                }}
              >
                <GiStarShuriken className="text-amber-400 text-5xl filter drop-shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-spin" />
              </div>
            )}

            {/* Glowing Aura Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-amber-300/20 via-pink-400/20 to-rose-400/30 blur-2xl group-hover:blur-3xl transition-all" />

            {/* SVG Wishing Jar */}
            <svg
              className="w-56 h-72 sm:w-64 sm:h-80 overflow-visible drop-shadow-xl"
              viewBox="0 0 200 250"
            >
              <defs>
                {/* Glass Reflection Gradient */}
                <linearGradient id="glassBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="30%" stopColor="#fecdd3" stopOpacity="0.15" />
                  <stop offset="70%" stopColor="#f43f5e" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
                </linearGradient>

                {/* Cork Stopper Gradient */}
                <linearGradient id="corkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#b45309" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>

                {/* Ribbon Gradient */}
                <linearGradient id="jarRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>

              {/* Cork Stopper */}
              <polygon points="75,25 125,25 120,45 80,45" fill="url(#corkGrad)" rx="2" />
              <rect x="70" y="20" width="60" height="8" rx="3" fill="#92400e" />

              {/* Jar Neck Ring */}
              <rect
                x="65"
                y="45"
                width="70"
                height="12"
                rx="4"
                fill="url(#glassBodyGrad)"
                stroke="#fda4af"
                strokeWidth="1.5"
              />

              {/* Jar Body with rounded elegant curves */}
              <path
                d="M 68,57 C 40,75 35,115 35,170 C 35,225 55,235 100,235 C 145,235 165,225 165,170 C 165,115 160,75 132,57 Z"
                fill="url(#glassBodyGrad)"
                stroke="#f43f5e"
                strokeWidth="1.8"
                strokeOpacity="0.5"
              />

              {/* Left Glass Specular Highlight Curve */}
              <path
                d="M 48,90 C 42,130 44,180 58,215"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.65"
              />

              {/* Floating Origami Stars inside the Jar */}
              <g className="animate-pulse-slow">
                {/* Star 1 - Gold */}
                <circle cx="85" cy="185" r="14" fill="#fbbf24" opacity="0.9" />
                <path d="M 85,173 L 88,181 L 97,181 L 90,186 L 93,194 L 85,189 L 77,194 L 80,186 L 73,181 L 82,181 Z" fill="#ffffff" />

                {/* Star 2 - Pink */}
                <circle cx="115" cy="165" r="13" fill="#f43f5e" opacity="0.85" />
                <path d="M 115,154 L 118,161 L 126,161 L 120,166 L 122,173 L 115,169 L 108,173 L 110,166 L 104,161 L 112,161 Z" fill="#ffe4e6" />

                {/* Star 3 - Amber */}
                <circle cx="70" cy="140" r="12" fill="#fb923c" opacity="0.85" />
                <path d="M 70,130 L 72,136 L 79,136 L 74,141 L 76,147 L 70,143 L 64,147 L 66,141 L 61,136 L 68,136 Z" fill="#ffffff" />

                {/* Star 4 - Lavender */}
                <circle cx="125" cy="125" r="12" fill="#c084fc" opacity="0.85" />
                <path d="M 125,115 L 127,121 L 134,121 L 129,126 L 131,132 L 125,128 L 119,132 L 121,126 L 116,121 L 123,121 Z" fill="#ffffff" />

                {/* Star 5 - Sky Blue */}
                <circle cx="100" cy="130" r="11" fill="#38bdf8" opacity="0.85" />
                <path d="M 100,121 L 102,126 L 108,126 L 103,130 L 105,136 L 100,132 L 95,136 L 97,130 L 92,126 L 98,126 Z" fill="#ffffff" />

                {/* Star 6 - Mint */}
                <circle cx="95" cy="205" r="10" fill="#34d399" opacity="0.85" />
              </g>

              {/* Fireflies / Magic Light Motes in Jar */}
              <circle cx="65" cy="110" r="2.5" fill="#fef08a" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="135" cy="190" r="2" fill="#fef08a" className="animate-ping" style={{ animationDuration: '2.5s' }} />
              <circle cx="85" cy="85" r="1.8" fill="#ffffff" className="animate-pulse" />

              {/* Twine Ribbon around the Neck */}
              <path d="M 66,54 Q 100,58 134,54" stroke="url(#jarRibbon)" strokeWidth="4" fill="none" />
              {/* Hanging Tag */}
              <path d="M 100,56 L 90,82 L 115,82 Z" fill="#fff1f2" stroke="#fb7185" strokeWidth="1" />
              <text x="101" y="76" fontSize="7" fontWeight="bold" fill="#be123c" textAnchor="middle">
                20-10
              </text>
            </svg>

            {/* Click to draw hint */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-rose-700 shadow-md border border-rose-200 flex items-center gap-1.5 group-hover:bg-rose-50 transition-colors">
              <GiFairyWand className="text-amber-500" />
              <span>Chạm vào hũ để rút sao ✨</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Status, Draw Button & Unlocked Grid */}
        <div className="flex-1 w-full flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
              Bộ Sưu Tập Phiếu Cưng Chiều
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white shadow-xs">
              {unlockedIds.length} / {WISH_COUPONS.length} Đã Mở
            </span>
          </div>

          <h3 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-rose-950 mb-3">
            Em Đã Có {unlockedIds.length} Thẻ Đặc Quyền!
          </h3>

          <p className="text-xs sm:text-sm text-rose-700/80 font-light mb-6 leading-relaxed">
            Mỗi ngôi sao trong hũ tương ứng với một thẻ đặc quyền siêu cấp đáng yêu. Khi nào cần dùng, em chỉ cần "đóng dấu" để bắt anh thực hiện ngay nhé!
          </p>

          {/* Action Button: Rút Thêm Ngôi Sao */}
          <button
            onClick={handleDrawStar}
            disabled={isDrawing}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white font-medium text-sm sm:text-base shadow-xl shadow-rose-400/40 hover:shadow-rose-400/70 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 mb-6"
          >
            <GiStarShuriken className={`text-amber-200 text-lg ${isDrawing ? 'animate-spin' : ''}`} />
            <span>{isDrawing ? 'Đang Lấy Ngôi Sao Ra...' : 'Rút Một Ngôi Sao May Mắn ✨'}</span>
            <HiSparkles className="text-amber-200 text-sm" />
          </button>

          {/* Mini Preview Icons of Unlocked Coupons */}
          <div className="w-full pt-4 border-t border-rose-200/60">
            <div className="text-xs font-medium text-rose-600/80 mb-3 text-left">
              Bấm vào phiếu để xem chi tiết & đóng dấu:
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5 w-full">
              {WISH_COUPONS.map((coupon) => {
                const isUnlocked = unlockedIds.includes(coupon.id);
                const isStamped = stampedIds.includes(coupon.id);

                return (
                  <button
                    key={coupon.id}
                    onClick={() => {
                      if (isUnlocked) {
                        romanticAudio.playPop();
                        setActiveCoupon(coupon);
                      } else {
                        handleDrawStar();
                      }
                    }}
                    className={`relative p-2.5 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
                      isUnlocked
                        ? 'bg-white/90 hover:bg-rose-50 border-rose-200 shadow-sm hover:shadow-md hover:scale-105'
                        : 'bg-rose-100/40 border-dashed border-rose-300/60 opacity-60 hover:opacity-80'
                    }`}
                  >
                    <span className="text-2xl mb-1">{isUnlocked ? coupon.icon : '🔒'}</span>
                    <span className="text-[10px] font-medium text-rose-900 truncate w-full text-center">
                      {isUnlocked ? coupon.tag : 'Chưa Mở'}
                    </span>

                    {/* Stamped Indicator */}
                    {isStamped && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold shadow-xs">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* POPUP MODAL: Reveal & Stamp Love Coupon */}
      {activeCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-rose-200 overflow-hidden transform animate-scaleUp">
            {/* Top Close Button */}
            <button
              onClick={() => setActiveCoupon(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Glowing Header Banner */}
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${activeCoupon.color} text-white mb-5 shadow-lg relative overflow-hidden`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase bg-black/20 px-2.5 py-0.5 rounded-full">
                  {activeCoupon.code}
                </span>
                <span className="text-xs font-semibold bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                  {activeCoupon.tag}
                </span>
              </div>

              <div className="flex items-center gap-3 my-2">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
                  {activeCoupon.icon}
                </div>
                <div>
                  <h4 className="font-serif-romantic text-lg sm:text-xl font-bold leading-tight drop-shadow-xs">
                    {activeCoupon.title}
                  </h4>
                  <span className="text-[11px] text-white/90 font-light">
                    Dành tặng riêng cho {herName}
                  </span>
                </div>
              </div>
            </div>

            {/* Description & Perk Details */}
            <div className="bg-rose-50/70 rounded-2xl p-4 border border-rose-200/70 mb-5 text-left">
              <div className="text-xs font-bold uppercase tracking-wide text-rose-500 mb-1.5 flex items-center gap-1.5">
                <FaGift className="text-xs" /> Quyền Lợi Của Em:
              </div>
              <p className="text-sm text-rose-900 leading-relaxed font-light mb-3">
                {activeCoupon.desc}
              </p>
              <div className="text-[11px] text-rose-600/80 font-medium border-t border-rose-200/60 pt-2 flex items-center gap-1">
                <span>📌</span> {activeCoupon.condition}
              </div>
            </div>

            {/* Stamp Status Display */}
            {stampedIds.includes(activeCoupon.id) ? (
              <div className="p-3 rounded-2xl bg-red-50 border-2 border-dashed border-red-400 text-red-600 font-bold text-center text-sm mb-4 flex items-center justify-center gap-2 transform -rotate-1 shadow-inner">
                <FaCheck className="text-red-500" />
                <span>ĐÃ KÍCH HOẠT • CÓ HIỆU LỰC TRỌN ĐỜI 💮</span>
              </div>
            ) : (
              <button
                onClick={() => handleStamp(activeCoupon.id)}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold text-sm shadow-lg shadow-rose-400/50 hover:shadow-rose-400 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mb-4"
              >
                <span>💮 Đóng Dấu Kích Hoạt Thẻ Này</span>
              </button>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <button
                onClick={() => {
                  setActiveCoupon(null);
                  handleDrawStar();
                }}
                className="flex-1 py-2.5 rounded-full bg-rose-100/80 text-rose-700 hover:bg-rose-200 font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FaRotateRight className="text-xs" /> Rút Thẻ Khác
              </button>
              <button
                onClick={() => setActiveCoupon(null)}
                className="flex-1 py-2.5 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 font-medium transition-colors cursor-pointer"
              >
                Lưu Vào Ví
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
