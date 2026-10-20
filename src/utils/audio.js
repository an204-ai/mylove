// Romantic Audio Manager with support for custom music and Web Audio chime effects

class RomanticAudioManager {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.volume = 0.35;
    this.gainNode = null;
    this.audioElement = null;
    this.synthTimer = null;
    this.hasStarted = false;
    this.songTitle = 'Thank You For Everything - Diego Gonzalez';
  }

  getAudio() {
    if (!this.audioElement && typeof window !== 'undefined') {
      // Use the downloaded high-quality audio track
      this.audioElement = new Audio('/audio/bgm.mp4');
      this.audioElement.loop = true;
      this.audioElement.volume = this.volume;
      this.audioElement.preload = 'auto';

      this.audioElement.addEventListener('play', () => {
        this.isPlaying = true;
      });
      this.audioElement.addEventListener('pause', () => {
        this.isPlaying = false;
      });
      this.audioElement.addEventListener('ended', () => {
        this.audioElement.currentTime = 0;
        this.audioElement.play().catch(() => {});
      });
    }
    return this.audioElement;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.getAudio();
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  playTone(freq, duration = 1.2, type = 'sine', startTime = 0) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

    const t = this.ctx.currentTime + startTime;
    noteGain.gain.setValueAtTime(0.001, t);
    noteGain.gain.exponentialRampToValueAtTime(0.18, t + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(t);
    osc.stop(t + duration);
  }

  // Play romantic chime sound effect
  playChime() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.8, 'sine', idx * 0.08);
    });
  }

  playPop() {
    this.init();
    const notes = [440, 659.25, 880];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.4, 'triangle', idx * 0.05);
    });
  }

  // Start background song ("Thank You For Everything - Diego Gonzalez") at specified second (default 20s)
  startRomanticBGM(startSec = 20) {
    this.init();
    const audio = this.getAudio();
    if (audio) {
      audio.volume = this.volume;

      // Jump to 20 seconds on first start
      if (!this.hasStarted && typeof startSec === 'number' && startSec > 0) {
        this.hasStarted = true;
        const setSeekTime = () => {
          try {
            audio.currentTime = startSec;
          } catch (err) {}
        };

        if (audio.readyState >= 1) {
          setSeekTime();
        } else {
          audio.addEventListener('loadedmetadata', setSeekTime, { once: true });
        }
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            // Guarantee seek if loaded late
            if (startSec > 0 && audio.currentTime < startSec - 1) {
              try {
                audio.currentTime = startSec;
              } catch (e) {}
            }
          })
          .catch((err) => {
            console.warn('Autoplay prevented or waiting for interaction:', err);
            this.startSynthBGM();
          });
      }
    } else {
      this.startSynthBGM();
    }
  }

  stopRomanticBGM() {
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopSynthBGM();
  }

  toggleBGM(startSec = 20) {
    this.init();
    if (this.isPlaying) {
      this.stopRomanticBGM();
      return false;
    } else {
      this.startRomanticBGM(startSec);
      return true;
    }
  }

  // Fallback synthesized chords if audio cannot be loaded
  startSynthBGM() {
    if (this.synthTimer) return;
    const chords = [
      [293.66, 369.99, 440.0, 587.33],
      [220.0, 277.18, 329.63, 440.0],
      [246.94, 293.66, 369.99, 493.88],
      [185.0, 220.0, 277.18, 369.99],
    ];
    let chordIdx = 0;
    let step = 0;

    const tick = () => {
      if (!this.isPlaying) return;
      const currentChord = chords[chordIdx];
      this.playTone(currentChord[step % currentChord.length], 1.4, 'sine');
      step++;
      if (step >= 4) {
        step = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }
      this.synthTimer = setTimeout(tick, 520);
    };
    tick();
  }

  stopSynthBGM() {
    if (this.synthTimer) {
      clearTimeout(this.synthTimer);
      this.synthTimer = null;
    }
  }
}

export const romanticAudio = new RomanticAudioManager();
