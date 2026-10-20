import { useState, useEffect } from 'react';
import IntroScreen from './components/IntroScreen';
import FallingPetals from './components/FallingPetals';
import MusicPlayer from './components/MusicPlayer';
import HeroSection from './components/HeroSection';
import GreetingCard from './components/GreetingCard';
import PhotoGallery from './components/PhotoGallery';
import Footer from './components/Footer';

export default function App() {
  const [isPetalsActive, setIsPetalsActive] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);
  const [coupleData, setCoupleData] = useState({
    hisName: 'Anh',
    herName: 'Em Yêu',
    startDate: '2026-01-08',
  });

  useEffect(() => {
    const saved = localStorage.getItem('mylove_couple_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure the anniversary date is updated to 2026-01-08 if it was the old default
        if (parsed.startDate === '2023-10-20' || !parsed.startDate) {
          parsed.startDate = '2026-01-08';
          localStorage.setItem('mylove_couple_data', JSON.stringify(parsed));
        }
        setCoupleData(parsed);
      } catch (e) {
        console.error('Failed to parse saved couple data', e);
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-rose-50/60 via-pink-50/40 to-rose-100/30 text-rose-950 font-sans selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden">
      {/* Full-screen Opening Intro Overlay with Animation */}
      <IntroScreen 
        herName={coupleData.herName} 
        hisName={coupleData.hisName} 
        onEnter={() => setHasEntered(true)} 
      />

      {/* Falling Rose & Blossom Petals Canvas */}
      <FallingPetals isEnabled={isPetalsActive} />

      {/* Floating Music & Controls Bar */}
      <MusicPlayer 
        isPetalsActive={isPetalsActive} 
        setIsPetalsActive={setIsPetalsActive} 
      />

      {/* Hero Section with Love Days Counter & Couple Names */}
      <HeroSection 
        coupleData={coupleData} 
        setCoupleData={setCoupleData} 
      />

      {/* 3D Envelope & Opening Greeting Card */}
      <GreetingCard 
        herName={coupleData.herName} 
        hisName={coupleData.hisName} 
      />

      {/* Scrapbook Polaroid & Film Gallery */}
      <PhotoGallery />

      {/* Footer */}
      <Footer 
        hisName={coupleData.hisName} 
        herName={coupleData.herName} 
      />
    </div>
  );
}
