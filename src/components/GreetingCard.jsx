import { useState, useEffect } from 'react';
import { 
  FaEnvelope, 
  FaEnvelopeOpen, 
  FaHeart, 
  FaPenToSquare, 
  FaCheck, 
  FaQuoteLeft,
  FaQuoteRight 
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';
import { GiRose, GiLoveLetter } from 'react-icons/gi';
import { romanticAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

const DEFAULT_LETTER_CONTENT = `Gửi em bé yêu của anh,

Hôm nay 20-10, anh chỉ muốn mượn cái cớ này để nói là anh thương em nhiều xỉu luôn á! Ở cạnh em lúc nào cũng thấy thoải mái, vừa được là chính mình vừa có một người để cưng nựng, chăm sóc và chọc ghẹo mỗi ngày.

Cảm ơn em vì đã luôn lắng nghe, chia sẻ và đồng hành cùng anh qua từng chuyện nhỏ nhặt nhất. Nụ cười của em lúc nào cũng là nguồn năng lượng tích cực lớn nhất đối với anh.

Chúc em yêu hôm nay nhận được thật nhiều niềm vui, lúc nào cũng cười tít mắt, ăn ngon ngủ kỹ và luôn đáng yêu như vậy nha. Tụi mình sẽ cùng nhau đi qua thật nhiều ngày kỷ niệm ngọt ngào phía trước nữa nhé!

Thương em nhất trên đời nè! 💖💐`;

export default function GreetingCard({ herName = 'Em Yêu', hisName = 'Anh' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [letterText, setLetterText] = useState(DEFAULT_LETTER_CONTENT);
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(DEFAULT_LETTER_CONTENT);

  useEffect(() => {
    const savedLetter = localStorage.getItem('mylove_letter_text');
    if (savedLetter) {
      if (savedLetter.includes('cô gái') || savedLetter.includes('Phụ nữ Việt Nam') || savedLetter.includes('Ai bảo 20-10 chỉ là ngày của con gái')) {
        setLetterText(DEFAULT_LETTER_CONTENT);
        setDraftText(DEFAULT_LETTER_CONTENT);
        localStorage.setItem('mylove_letter_text', DEFAULT_LETTER_CONTENT);
      } else {
        setLetterText(savedLetter);
        setDraftText(savedLetter);
      }
    }
  }, []);

  const triggerConfetti = () => {
    // Left burst
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0.2, y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#ffd1dc', '#fbbf24'],
    });
    // Right burst
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 0.8, y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#ffd1dc', '#fbbf24'],
    });
  };

  const handleToggleCard = () => {
    romanticAudio.playChime();
    if (!isOpen) {
      triggerConfetti();
    }
    setIsOpen(!isOpen);
  };

  const handleSaveText = () => {
    setLetterText(draftText);
    localStorage.setItem('mylove_letter_text', draftText);
    setIsEditing(false);
    romanticAudio.playPop();
  };

  return (
    <section id="greeting-card-section" className="relative max-w-4xl mx-auto px-4 py-12">
      {/* Decorative floral subtitle */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <GiRose className="text-rose-500 text-xl sm:text-2xl transform -rotate-12" />
        <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-rose-500">
          💌 Bức Thư Tay Bí Mật
        </span>
        <GiRose className="text-rose-500 text-xl sm:text-2xl transform rotate-12" />
      </div>

      <h2 className="text-3xl sm:text-5xl font-serif-romantic font-bold text-rose-950 text-center mb-4">
        Bức Thư Anh Viết Cho Em
      </h2>
      <p className="text-rose-600/90 text-sm sm:text-base text-center max-w-md mx-auto mb-10 font-light">
        Không có gì đao to búa lớn, chỉ là mấy lời thật lòng anh muốn gửi riêng cho em nè. Chạm vào con dấu trái tim để mở ra đọc nhé!
      </p>

      {/* Main Interactive Envelope Container */}
      <div className="relative mx-auto max-w-xl">
        {/* Envelope Outer Frame */}
        <div 
          className={`relative transition-all duration-700 ease-out ${
            isOpen ? 'pb-8' : 'hover:-translate-y-2'
          }`}
        >
          {/* Unopened Envelope View */}
          {!isOpen && (
            <div
              onClick={handleToggleCard}
              className="group relative w-full aspect-[16/10] sm:aspect-[16/10] bg-gradient-to-br from-rose-100 via-rose-50 to-pink-100 rounded-3xl p-6 shadow-2xl border-2 border-rose-200/90 cursor-pointer overflow-hidden flex flex-col items-center justify-center text-center transition-all duration-500 hover:shadow-rose-300/60"
            >
              {/* Envelope flap folded graphic */}
              <div 
                className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-rose-200/90 to-rose-100/40 border-b border-rose-300/70"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                }}
              />

              {/* Envelope decorative diagonal backfolds */}
              <div 
                className="absolute inset-0 border-rose-200/60 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(254, 205, 211, 0.25) 25%, transparent 25%), linear-gradient(225deg, rgba(254, 205, 211, 0.25) 25%, transparent 25%)',
                }}
              />

              {/* Gold/Wax Heart Seal in center */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 p-1 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border-2 border-amber-300/80">
                  <div className="w-full h-full rounded-full border border-amber-200/50 flex items-center justify-center bg-rose-600/90">
                    <FaHeart className="text-amber-200 text-3xl sm:text-4xl animate-pulse drop-shadow" />
                  </div>
                  {/* Glowing halo */}
                  <div className="absolute -inset-2 bg-rose-400/30 rounded-full blur-md -z-10 group-hover:bg-rose-500/50 transition-colors" />
                </div>

                <div className="mt-4 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-rose-200 text-rose-700 font-medium text-xs sm:text-sm shadow flex items-center gap-2 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                  <HiSparkles className="text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                  Chạm để mở thiệp chúc mừng
                </div>
              </div>

              {/* Recipient tag */}
              <div className="absolute bottom-4 left-6 text-left">
                <span className="text-[11px] uppercase tracking-wider text-rose-400 font-semibold block">To my love:</span>
                <span className="font-serif-romantic text-base sm:text-lg font-bold text-rose-800">{herName}</span>
              </div>

              <div className="absolute bottom-4 right-6 text-right">
                <span className="text-[11px] uppercase tracking-wider text-rose-400 font-semibold block">Special Day:</span>
                <span className="font-semibold text-rose-700 text-sm">20 Tháng 10</span>
              </div>
            </div>
          )}

          {/* Opened Letter View */}
          {isOpen && (
            <div className="relative animate-fadeIn">
              {/* Paper Letter Canvas */}
              <div className="relative bg-[#fffdfa] rounded-3xl p-6 sm:p-10 shadow-2xl border border-rose-200/90 overflow-hidden">
                {/* Watermark & Corner Floral Accents */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-100/60 to-transparent rounded-bl-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-rose-100/60 to-transparent rounded-tr-full pointer-events-none" />

                {/* Top Actions Bar (Fold back, Edit, Stamp) */}
                <div className="flex items-center justify-between pb-4 border-b border-rose-100 mb-6">
                  <button
                    onClick={handleToggleCard}
                    className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full transition-colors font-medium cursor-pointer"
                  >
                    <FaEnvelope className="text-xs" /> Đóng thiệp lại
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(!isEditing);
                        setDraftText(letterText);
                      }}
                      className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full transition-colors font-medium cursor-pointer"
                    >
                      <FaPenToSquare className="text-xs" /> Chỉnh sửa lời chúc
                    </button>
                    <button
                      onClick={triggerConfetti}
                      className="p-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors text-xs cursor-pointer"
                      title="Bắn pháo hoa giấy"
                    >
                      ✨
                    </button>
                  </div>
                </div>

                {/* Letter Header */}
                <div className="text-center mb-6">
                  <span className="text-xs font-semibold tracking-widest uppercase text-rose-400">
                    Thư Gửi Người Thương • 20/10
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-serif-romantic font-bold text-rose-900 mt-2">
                    Gửi Em - {herName}
                  </h3>
                  <div className="w-16 h-0.5 bg-rose-300 mx-auto mt-3 rounded-full" />
                </div>

                {/* Letter Body or Editor */}
                {isEditing ? (
                  <div className="mb-6">
                    <label className="block text-xs font-medium text-rose-700 mb-2">
                      Tùy chỉnh nội dung bức thư tình 20-10 của bạn:
                    </label>
                    <textarea
                      rows={8}
                      value={draftText}
                      onChange={(e) => setDraftText(e.target.value)}
                      className="w-full p-4 text-sm sm:text-base leading-relaxed bg-rose-50/40 border border-rose-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-rose-900"
                    />
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-1.5 text-xs text-rose-600 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        onClick={handleSaveText}
                        className="px-5 py-1.5 text-xs bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg shadow flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <FaCheck /> Lưu thư mới
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative my-6 px-2 sm:px-6">
                    <FaQuoteLeft className="text-rose-200 text-2xl sm:text-3xl absolute -top-3 left-0 -z-0" />
                    <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-stone-700 font-light relative z-10 font-sans">
                      {letterText}
                    </p>
                    <FaQuoteRight className="text-rose-200 text-2xl sm:text-3xl absolute -bottom-3 right-0 -z-0" />
                  </div>
                )}

                {/* Letter Signature */}
                <div className="mt-8 pt-6 border-t border-rose-100/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GiLoveLetter className="text-rose-500 text-2xl" />
                    <span className="text-xs text-rose-400 italic">Mãi mãi một tình yêu</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-rose-400 block font-light">Người yêu của em,</span>
                    <span className="font-serif-romantic text-lg sm:text-xl font-bold text-rose-800">
                      {hisName} 💖
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
