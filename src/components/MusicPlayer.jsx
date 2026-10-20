import { useState, useEffect } from 'react';
import { 
  FaMusic, 
  FaPlay, 
  FaPause, 
  FaVolumeHigh, 
  FaVolumeXmark, 
  FaHeart 
} from 'react-icons/fa6';
import { GiFlowerTwirl } from 'react-icons/gi';
import { romanticAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

export default function MusicPlayer({ isPetalsActive, setIsPetalsActive }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const togglePlay = () => {
    romanticAudio.init();
    const playing = romanticAudio.toggleBGM();
    setIsPlaying(playing);
    if (playing) {
      romanticAudio.playChime();
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    romanticAudio.setVolume(newVol);
    if (newVol === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      romanticAudio.setVolume(volume || 0.3);
      setIsMuted(false);
    } else {
      romanticAudio.setVolume(0);
      setIsMuted(true);
    }
  };

  const sendHeartBurst = (e) => {
    romanticAudio.playPop();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      origin: { x, y },
      particleCount: 25,
      spread: 60,
      startVelocity: 25,
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#e11d48', '#fbcfe8'],
      shapes: ['circle'],
      scalar: 1.2,
    });
  };

  return (
    <header className="fixed top-4 right-4 z-40 flex items-center gap-2 sm:gap-3">
      {/* Send Heart Confetti Button */}
      <button
        onClick={sendHeartBurst}
        title="Thả tim yêu thương"
        className="group relative flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-full glass-card text-rose-600 hover:text-rose-700 shadow-md hover:shadow-rose-300/40 hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95"
      >
        <FaHeart className="text-rose-500 animate-pulse text-sm sm:text-base group-hover:scale-125 transition-transform" />
        <span className="text-xs sm:text-sm font-medium tracking-wide">Thả Tim</span>
      </button>

      {/* Petals Toggle */}
      <button
        onClick={() => setIsPetalsActive(!isPetalsActive)}
        title={isPetalsActive ? "Tắt hiệu ứng cánh hoa" : "Bật hiệu ứng cánh hoa"}
        className={`p-2.5 rounded-full glass-card transition-all duration-300 cursor-pointer shadow-md active:scale-95 ${
          isPetalsActive ? 'text-rose-600 ring-2 ring-rose-300' : 'text-stone-400 hover:text-rose-500'
        }`}
      >
        <GiFlowerTwirl className={`text-lg sm:text-xl ${isPetalsActive ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
      </button>

      {/* Romantic Music Player Container */}
      <div 
        className="relative flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full glass-card shadow-lg border border-rose-200/80 transition-all duration-300"
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
      >
        {/* Rotating Mini Vinyl with Couple photo */}
        <div 
          onClick={togglePlay}
          className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-rose-400 shadow cursor-pointer transition-transform ${
            isPlaying ? 'animate-spin' : 'hover:scale-105'
          }`}
          style={{ animationDuration: '8s' }}
          title={isPlaying ? "Tạm dừng nhạc lãng mạn" : "Bật nhạc piano lãng mạn"}
        >
          <img 
            src="/image/IMG_1055.jpg" 
            alt="My Love" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-rose-900/20 backdrop-blur-[0.5px] flex items-center justify-center">
            {isPlaying ? (
              <FaPause className="text-white text-xs drop-shadow" />
            ) : (
              <FaPlay className="text-white text-xs ml-0.5 drop-shadow" />
            )}
          </div>
        </div>

        {/* Music Info Label */}
        <div className="hidden md:flex flex-col text-left pr-1 cursor-pointer" onClick={togglePlay}>
          <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
            <FaMusic className={`text-[10px] ${isPlaying ? 'animate-bounce' : ''}`} />
            {isPlaying ? 'Giai Điệu Tình Yêu' : 'Bật Nhạc 20-10'}
          </span>
          <span className="text-[10px] text-rose-400 font-normal">
            {isPlaying ? 'Piano Lofi Romance' : 'Nhấn để nghe'}
          </span>
        </div>

        {/* Mute / Unmute Button */}
        <button
          onClick={toggleMute}
          className="text-rose-600 hover:text-rose-800 transition-colors p-1 cursor-pointer"
          title={isMuted ? "Bật âm lượng" : "Tắt tiếng"}
        >
          {isMuted || volume === 0 ? (
            <FaVolumeXmark className="text-sm sm:text-base text-rose-400" />
          ) : (
            <FaVolumeHigh className="text-sm sm:text-base" />
          )}
        </button>

        {/* Volume Slider Popover */}
        {showVolumeSlider && (
          <div className="absolute top-full mt-2 right-0 p-2 glass-card rounded-xl shadow-xl flex items-center gap-2 animate-fadeIn z-50">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 sm:w-24 accent-rose-500 cursor-pointer h-1.5 bg-rose-200 rounded-lg"
            />
            <span className="text-[10px] font-medium text-rose-600 w-6">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
