import { useState } from 'react';
import { 
  FaHeart, 
  FaRegHeart, 
  FaCamera, 
  FaXmark, 
  FaChevronLeft, 
  FaChevronRight 
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';
import { romanticAudio } from '../utils/audio';

const INITIAL_PHOTOS = [
  {
    id: '1',
    src: '/image/IMG_1055.jpg',
    title: 'Khoảnh Khắc Bên Nhau',
    date: 'Những ngày tháng bình yên',
    caption: 'Chỉ cần ở bên em, mọi muộn phiền ngoài kia đều tan biến. Nụ cười của em luôn là điều quý giá nhất với anh.',
    rotation: '-rotate-2',
    aspect: 'aspect-[4/3]',
    tag: 'Ngọt ngào',
    likes: 99,
  },
  {
    id: '2',
    src: '/image/IMG_1036.JPG',
    title: 'Góc Nhỏ Tình Yêu',
    date: 'Ảnh Polaroid kỷ niệm',
    caption: 'Bức ảnh lưu giữ từng cái nháy mắt, cái chu môi đáng yêu của hai đứa mình.',
    rotation: 'rotate-2',
    aspect: 'aspect-[3/4]',
    tag: 'Nhắng nhít',
    likes: 120,
  },
  {
    id: '3',
    src: '/image/IMG_1037.JPG',
    title: 'Hôn Gió Gửi Em',
    date: 'Khoảnh khắc vui vẻ',
    caption: 'Dù ở đâu thì tụi mình vẫn luôn có cách khiến cho đối phương phải bật cười hạnh phúc.',
    rotation: '-rotate-1',
    aspect: 'aspect-[4/3]',
    tag: 'Nhắng nhít',
    likes: 105,
  },
  {
    id: '4',
    src: '/image/IMG_1038.JPG',
    title: 'Nụ Cười Rạng Rỡ',
    date: 'Những giây phút ngọt ngào',
    caption: 'Nhìn thấy em cười rạng rỡ là niềm hạnh phúc lớn nhất của anh trong cuộc đời này.',
    rotation: 'rotate-3',
    aspect: 'aspect-[3/4]',
    tag: 'Ngọt ngào',
    likes: 150,
  },
  {
    id: '5',
    src: '/image/IMG_1056.jpg',
    title: 'Duyên Phận Từ Bé',
    date: 'Ảnh kỷ niệm tuổi thơ',
    caption: 'Hai đứa nhóc ngày nào giơ tay chữ V, ai ngờ lớn lên lại trở thành một nửa không thể thiếu của nhau.',
    rotation: '-rotate-3',
    aspect: 'aspect-square',
    tag: 'Kỷ niệm',
    likes: 999,
  },
];

export default function PhotoGallery() {
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleLike = (id, e) => {
    e.stopPropagation();
    romanticAudio.playPop();
    setPhotos(prev =>
      prev.map(p => (p.id === id ? { ...p, likes: p.likes + 1, liked: true } : p))
    );
  };

  const filteredPhotos = activeFilter === 'all'
    ? photos
    : photos.filter(p => p.tag === activeFilter);

  const openLightbox = (index) => {
    romanticAudio.playChime();
    setSelectedPhotoIndex(index);
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev + 1) % filteredPhotos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  return (
    <section id="gallery-section" className="relative max-w-6xl mx-auto px-4 py-16">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/90 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-2.5 border border-rose-200">
          <FaCamera className="text-xs text-rose-500" /> 🎞️ Cuộn Phim Kỷ Niệm Của Hai Đứa
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-romantic font-bold text-rose-950 mb-3">
          Nhật Ký Nụ Cười Của Chúng Mình
        </h2>
        <p className="text-rose-700/80 text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed">
          Mỗi tấm hình là một mảnh ghép kỷ niệm đáng yêu của hai đứa mình. Nhìn lại tấm nào cũng thấy vừa nhắng nhít vừa ấm áp hết trơn!
        </p>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {[
            { id: 'all', label: 'Tất cả kỷ niệm' },
            { id: 'Ngọt ngào', label: '🌸 Ngọt ngào' },
            { id: 'Nhắng nhít', label: '✨ Nhắng nhít đáng yêu' },
            { id: 'Kỷ niệm', label: '📸 Kỷ niệm tuổi thơ' },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                activeFilter === filter.id
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                  : 'bg-white/70 hover:bg-rose-50 text-rose-700 border border-rose-200/60'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrapbook Grid of Polaroids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 items-start">
        {filteredPhotos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => openLightbox(index)}
            className={`group relative bg-white p-4 pb-6 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-rose-300/40 border border-stone-200/80 transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:scale-[1.02] ${photo.rotation} hover:rotate-0`}
          >
            {/* Washi Tape Decal at the top of the polaroid */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-rose-200/70 backdrop-blur-[1px] rotate-1 shadow-xs border-y border-rose-300/40 rounded-sm z-10 pointer-events-none" />

            {/* Photo Container */}
            <div className={`relative w-full ${photo.aspect} overflow-hidden rounded-xl bg-stone-100`}>
              <img
                src={photo.src}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-white text-xs font-medium flex items-center gap-1">
                  <HiSparkles className="text-amber-300 text-xs" /> Bấm để phóng to
                </span>
              </div>
            </div>

            {/* Polaroid Bottom Notes */}
            <div className="mt-4 px-1">
              <div className="flex items-center justify-between">
                <h4 className="font-serif-romantic text-lg font-bold text-rose-950 group-hover:text-rose-600 transition-colors">
                  {photo.title}
                </h4>
                {/* Heart Button */}
                <button
                  onClick={(e) => handleLike(photo.id, e)}
                  className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 p-1 rounded-full transition-transform active:scale-125 cursor-pointer"
                  title="Thả tim cho bức ảnh này"
                >
                  <FaHeart className="text-sm text-rose-500 animate-pulse" />
                  <span className="font-semibold text-xs">{photo.likes}</span>
                </button>
              </div>

              <p className="text-xs text-stone-500 mt-1 line-clamp-2 font-light">
                {photo.caption}
              </p>
              
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-dashed border-stone-200 text-[10px] text-stone-400">
                <span>{photo.date}</span>
                <span className="text-rose-400 font-medium">#{photo.tag}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#fffdfa] rounded-3xl overflow-hidden shadow-2xl border border-rose-200/50 flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-rose-500 hover:text-white text-stone-700 flex items-center justify-center transition-colors shadow cursor-pointer"
            >
              <FaXmark className="text-base" />
            </button>

            {/* Image Preview Container */}
            <div className="relative md:w-3/5 bg-stone-950 flex items-center justify-center min-h-[340px] max-h-[75vh] overflow-hidden">
              <img
                src={filteredPhotos[selectedPhotoIndex].src}
                alt={filteredPhotos[selectedPhotoIndex].title}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />

              {/* Prev Button */}
              <button
                onClick={prevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition cursor-pointer"
              >
                <FaChevronLeft />
              </button>
              {/* Next Button */}
              <button
                onClick={nextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition cursor-pointer"
              >
                <FaChevronRight />
              </button>
            </div>

            {/* Details Panel */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold mb-2">
                  {filteredPhotos[selectedPhotoIndex].tag}
                </div>
                <h3 className="text-2xl font-serif-romantic font-bold text-rose-950 mb-2">
                  {filteredPhotos[selectedPhotoIndex].title}
                </h3>
                <p className="text-xs text-rose-400 mb-4">
                  {filteredPhotos[selectedPhotoIndex].date}
                </p>
                <p className="text-sm text-stone-700 leading-relaxed font-light">
                  {filteredPhotos[selectedPhotoIndex].caption}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-rose-100 flex items-center justify-between">
                <button
                  onClick={(e) => handleLike(filteredPhotos[selectedPhotoIndex].id, e)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium text-xs transition cursor-pointer"
                >
                  <FaHeart className="text-rose-500" />
                  <span>{filteredPhotos[selectedPhotoIndex].likes} Yêu Thích</span>
                </button>
                <span className="text-xs text-stone-400">
                  {selectedPhotoIndex + 1} / {filteredPhotos.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
