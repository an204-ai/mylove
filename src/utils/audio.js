// Romantic Audio Synthesizer and Sound Effects via Web Audio API
// 100% reliable, zero CORS issues, smooth soothing ambient piano/chime chords

class RomanticAudioManager {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.currentStep = 0;
    this.volume = 0.25;
    this.gainNode = null;
    this.customAudio = null;
    this.isCustomAudioPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (this.customAudio) {
      this.customAudio.volume = this.volume;
    }
  }

  playTone(freq, duration = 1.2, type = 'sine', startTime = 0) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);
    
    // Smooth bell-like envelope
    const t = this.ctx.currentTime + startTime;
    noteGain.gain.setValueAtTime(0.001, t);
    noteGain.gain.exponentialRampToValueAtTime(0.18, t + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    
    osc.connect(noteGain);
    noteGain.connect(this.gainNode);
    
    osc.start(t);
    osc.stop(t + duration);
  }

  // Play romantic chime sound effect (e.g. for opening card, sending rose)
  playChime() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
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

  // Romantic ambient progression: Canon in D / Romantic Lofi chord arpeggios
  startRomanticBGM() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Chord progressions in D major: D - A - Bm - F#m - G - D - G - A
    const chords = [
      [293.66, 369.99, 440.00, 587.33], // D, F#, A, D5
      [220.00, 277.18, 329.63, 440.00], // A, C#, E, A
      [246.94, 293.66, 369.99, 493.88], // Bm, D, F#, B
      [185.00, 220.00, 277.18, 369.99], // F#m, A, C#, F#
      [196.00, 246.94, 293.66, 392.00], // G, B, D, G
      [220.00, 293.66, 369.99, 440.00], // D/A
      [196.00, 246.94, 293.66, 493.88], // G
      [220.00, 277.18, 329.63, 554.37], // A
    ];

    let chordIdx = 0;
    let arpeggioStep = 0;

    const tick = () => {
      if (!this.isPlaying) return;
      const currentChord = chords[chordIdx];
      const noteFreq = currentChord[arpeggioStep % currentChord.length];
      
      // Warm celesta/piano tone
      this.playTone(noteFreq, 1.4, 'sine');
      
      // Add a soft sub-bass note on beat 0
      if (arpeggioStep === 0) {
        this.playTone(currentChord[0] / 2, 2.0, 'triangle');
      }

      arpeggioStep++;
      if (arpeggioStep >= 4) {
        arpeggioStep = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }

      this.timer = setTimeout(tick, 520); // ~115 bpm eighth notes
    };

    tick();
  }

  stopRomanticBGM() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  toggleBGM() {
    if (this.isPlaying) {
      this.stopRomanticBGM();
      return false;
    } else {
      this.startRomanticBGM();
      return true;
    }
  }
}

export const romanticAudio = new RomanticAudioManager();
