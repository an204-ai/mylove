import { useState, useEffect } from 'react';
import { FaHeart, FaCalendarDays, FaPenToSquare, FaCheck } from 'react-icons/fa6';

export default function LoveCounter({ coupleData, setCoupleData }) {
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState(coupleData.startDate || '2026-01-08');
  const [tempHisName, setTempHisName] = useState(coupleData.hisName || 'Anh');
  const [tempHerName, setTempHerName] = useState(coupleData.herName || 'Em Yêu');

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(coupleData.startDate || '2026-01-08').getTime();
      const now = new Date().getTime();
      const difference = Math.max(0, now - start);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeTogether({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [coupleData.startDate]);

  const handleSave = () => {
    const updated = {
      ...coupleData,
      startDate: tempDate,
      hisName: tempHisName,
      herName: tempHerName,
    };
    setCoupleData(updated);
    localStorage.setItem('mylove_couple_data', JSON.stringify(updated));
    setIsEditing(false);
  };

  return (
    <div className="relative mx-auto max-w-2xl px-4 py-6">
      {/* Couple Names Banner */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
        <span className="font-serif-romantic text-xl sm:text-2xl font-semibold text-rose-800 tracking-wide">
          {coupleData.hisName || 'Anh'}
        </span>
        <div className="relative flex items-center justify-center">
          <FaHeart className="text-2xl sm:text-3xl text-rose-500 animate-pulse drop-shadow-md" />
          <span className="absolute -top-1 -right-1 text-xs">✨</span>
        </div>
        <span className="font-serif-romantic text-xl sm:text-2xl font-semibold text-rose-800 tracking-wide">
          {coupleData.herName || 'Em Yêu'}
        </span>

        {/* Edit Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          title="Chỉnh sửa tên và ngày kỷ niệm"
          className="ml-2 p-1.5 rounded-full hover:bg-rose-100/70 text-rose-400 hover:text-rose-600 transition-colors text-xs cursor-pointer"
        >
          <FaPenToSquare />
        </button>
      </div>

      {/* Edit Form Modal/Drawer if open */}
      {isEditing && (
        <div className="mb-6 p-4 rounded-2xl glass-card border border-rose-300/80 shadow-lg animate-fadeIn text-left">
          <h4 className="text-sm font-semibold text-rose-900 mb-3 flex items-center gap-2">
            <FaCalendarDays className="text-rose-500" />
            Cài đặt thông tin đôi mình:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-rose-700 mb-1">Tên bạn (Anh)</label>
              <input
                type="text"
                value={tempHisName}
                onChange={(e) => setTempHisName(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-white/90 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-rose-700 mb-1">Tên người yêu (Em)</label>
              <input
                type="text"
                value={tempHerName}
                onChange={(e) => setTempHerName(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-white/90 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-rose-700 mb-1">Ngày bắt đầu yêu</label>
              <input
                type="date"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-white/90 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-xs text-rose-600 hover:bg-rose-100 rounded-md transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1 text-xs bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-md shadow flex items-center gap-1.5 transition cursor-pointer"
            >
              <FaCheck /> Lưu thay đổi
            </button>
          </div>
        </div>
      )}

      {/* Counter Grid */}
      <div className="text-xs uppercase tracking-widest text-rose-500/90 font-medium mb-3">
        Đã bên nhau được trọn vẹn
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
        {[
          { label: 'NGÀY', value: timeTogether.days },
          { label: 'GIỜ', value: timeTogether.hours },
          { label: 'PHÚT', value: timeTogether.minutes },
          { label: 'GIÂY', value: timeTogether.seconds },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl glass-card border border-rose-200/90 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
          >
            <span className="text-3xl sm:text-5xl font-number font-black text-rose-600 group-hover:text-rose-700 transition-colors leading-none tracking-tight my-1">
              {item.value}
            </span>
            <span className="text-[10px] sm:text-xs font-medium tracking-wider text-rose-400 mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs sm:text-sm text-rose-500/80 italic font-light">
        "Mỗi giây phút bên em đều là một món quà vô giá..."
      </p>
    </div>
  );
}
