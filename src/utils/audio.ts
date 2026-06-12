// Procedural Web Audio API sound generator for instant UI sound effect feedback.
class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // Lazy initialize on first user interaction to comply with modern browser autoplay policies
  }

  private initCtx() {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.ctx && AudioCtx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        const promise = this.ctx.resume();
        if (promise && typeof promise.catch === 'function') {
          promise.catch((e) => console.warn('AudioContext resume failed:', e));
        }
      }
    } catch (e) {
      console.warn('AudioContext failed to initialize safely:', e);
    }
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const oscillator = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, now);
      oscillator.frequency.exponentialRampToValueAtTime(150, now + 0.05);
      
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      
      oscillator.start(now);
      oscillator.stop(now + 0.05);
    } catch (err) {
      console.warn('Audio click effect error:', err);
    }
  }

  playSelect() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.setValueAtTime(900, now + 0.04);
      
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.setValueAtTime(0.04, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn(e);
    }
  }

  playSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const playChimeNode = (freq: number, start: number, duration: number, volume: number = 0.05) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(volume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        
        osc.start(start);
        osc.stop(start + duration);
      };

      // Play a beautiful, rapid political scale of triumph!
      playChimeNode(261.63, now, 0.15, 0.04);       // C4
      playChimeNode(329.63, now + 0.10, 0.15, 0.04);  // E4
      playChimeNode(392.00, now + 0.20, 0.15, 0.04);  // G4
      playChimeNode(523.25, now + 0.30, 0.35, 0.06);  // C5
    } catch (err) {
      console.warn('Audio success chime error:', err);
    }
  }

  playGong() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const delayOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      delayOsc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.6);
      
      delayOsc.type = 'sine';
      delayOsc.frequency.setValueAtTime(183, now); // subtly out of detune for nice chorus vibrato
      delayOsc.frequency.exponentialRampToValueAtTime(82, now + 0.6);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      
      osc.start(now);
      delayOsc.start(now);
      
      osc.stop(now + 0.65);
      delayOsc.stop(now + 0.65);
    } catch (e) {
      console.warn(e);
    }
  }

  playNextWeek() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.28);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);

      // Companion chime at the end of slide
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(580, now + 0.15);
      osc2.frequency.setValueAtTime(783.99, now + 0.24); // G5 note

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.setValueAtTime(0.04, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc2.start(now + 0.1);
      osc2.stop(now + 0.48);
    } catch (e) {
      console.warn(e);
    }
  }

  playKurultayCrowd() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 2.0;

      // 1. Create filtered noise block for applause & cheering
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(1.2, now);
      filter.frequency.setValueAtTime(1000, now);
      filter.frequency.exponentialRampToValueAtTime(700, now + duration);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.1, now + 0.25);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseNode.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noiseNode.start(now);
      noiseNode.stop(now + duration);

      // 2. Chanting/roaring oscillators (low-mid resonance)
      const baseFreqs = [200, 240, 300];
      baseFreqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        const lp = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq + (Math.random() * 6 - 3), now);

        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(400, now);

        oscGain.gain.setValueAtTime(0.001, now);
        oscGain.gain.linearRampToValueAtTime(0.03, now + 0.3 + (idx * 0.05));
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(lp);
        lp.connect(oscGain);
        oscGain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch (e) {
      console.warn('Kurultay crowd sound error:', e);
    }
  }

  playTeaClink() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const playSingleMetalClink = (timeOffset: number) => {
        if (!this.ctx) return;
        const t = now + timeOffset;
        const freqs = [3200, 4800, 6400];

        freqs.forEach(freq => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          osc.frequency.exponentialRampToValueAtTime(freq - 150, t + 0.04);

          gain.gain.setValueAtTime(0.015, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(t);
          osc.stop(t + 0.05);
        });
      };

      // Play sequences of stirring clicks with short delays
      playSingleMetalClink(0.0);
      playSingleMetalClink(0.08 + Math.random() * 0.03);
      playSingleMetalClink(0.18 + Math.random() * 0.04);
      playSingleMetalClink(0.26 + Math.random() * 0.04);
    } catch (e) {
      console.warn('Tea clink error:', e);
    }
  }

  playElectionTension() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Ominous low heartbeat tone (Pulse)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, now); // Low A
      osc.frequency.linearRampToValueAtTime(45, now + 1.2);
      
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.3);

      // Higher tense resonance sweep
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(110, now);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 1.0);
      
      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(0.04, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
      
      osc2.connect(filter);
      filter.connect(gain2);
      gain2.connect(this.ctx.destination);
      
      osc2.start(now);
      osc2.stop(now + 1.1);
    } catch (e) {
      console.warn('Election tension sound error:', e);
    }
  }
}

export const playSound = new SoundManager();
