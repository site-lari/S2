import { Injectable, computed, effect, signal } from '@angular/core';

export interface Track {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  cover?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MusicPlayerService {
  private audio = new Audio();

  tracks = signal<Track[]>([
    {
      id: 'no-one-noticed',
      title: 'No One Noticed',
      subtitle: 'The Marías',
      src: 'assets/novo-aniversario/no-one-noticed.mp3',
      cover: 'assets/novo-aniversario/no-one-noticed.jpg'
    },
    {
      id: 'let-down',
      title: 'Let Down (Choir Version)',
      subtitle: 'Radiohead — Do 1º Aniversário',
      src: 'assets/site-lari/let-down.mp3',
      cover: 'assets/site-lari/download.jpeg'
    },
    {
      id: 'just-the-two-of-us',
      title: 'Just the Two of Us',
      subtitle: 'Grover Washington Jr. & Bill Withers',
      src: 'assets/um-ano/musica.mp3',
      cover: 'assets/um-ano/just-the-two-of-us.jpg'
    }
  ]);

  currentTrackIndex = signal<number>(0);
  isPlaying = signal<boolean>(false);
  currentTime = signal<number>(0);
  duration = signal<number>(0);
  isMuted = signal<boolean>(false);
  isPlaylistOpen = signal<boolean>(false);
  volume = signal<number>(0.7);

  currentTrack = computed(() => {
    const list = this.tracks();
    const idx = this.currentTrackIndex();
    return list[idx] || list[0];
  });

  progressPercent = computed(() => {
    const dur = this.duration();
    if (!dur || dur === 0) return 0;
    return (this.currentTime() / dur) * 100;
  });

  currentTimeFormatted = computed(() => this.formatTime(this.currentTime()));
  durationFormatted = computed(() => this.formatTime(this.duration()));

  constructor() {
    this.setupAudioListeners();
    this.loadCurrentTrack(false);
    this.attemptAutoplay();
  }

  private setupAudioListeners(): void {
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime.set(this.audio.currentTime);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration.set(this.audio.duration || 0);
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying.set(true);
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying.set(false);
    });

    this.audio.addEventListener('ended', () => {
      this.nextTrack(true);
    });
  }

  private loadCurrentTrack(autoPlay: boolean = false): void {
    const track = this.currentTrack();
    if (!track) return;

    const wasPlaying = this.isPlaying() || autoPlay;
    this.audio.src = track.src;
    this.audio.volume = this.volume();
    this.audio.muted = this.isMuted();
    this.audio.load();

    if (wasPlaying) {
      this.audio.play().then(() => {
        this.isPlaying.set(true);
      }).catch(err => {
        console.warn('Play prevented by browser:', err);
        this.isPlaying.set(false);
      });
    }
  }

  private attemptAutoplay(): void {
    this.audio.volume = this.volume();
    // Try direct play
    this.audio.play().then(() => {
      this.isPlaying.set(true);
    }).catch(() => {
      // Browser blocked autoplay; listen for first user click anywhere
      const startOnInteraction = () => {
        if (!this.isPlaying()) {
          this.play();
        }
        window.removeEventListener('click', startOnInteraction);
        window.removeEventListener('keydown', startOnInteraction);
        window.removeEventListener('touchstart', startOnInteraction);
      };
      window.addEventListener('click', startOnInteraction, { once: true });
      window.addEventListener('keydown', startOnInteraction, { once: true });
      window.addEventListener('touchstart', startOnInteraction, { once: true });
    });
  }

  play(): void {
    this.audio.play().then(() => {
      this.isPlaying.set(true);
    }).catch(err => {
      console.warn('Cannot start playback:', err);
    });
  }

  pause(): void {
    this.audio.pause();
    this.isPlaying.set(false);
  }

  togglePlay(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  selectTrack(index: number, autoPlay: boolean = true): void {
    if (index >= 0 && index < this.tracks().length) {
      this.currentTrackIndex.set(index);
      this.loadCurrentTrack(autoPlay);
    }
  }

  nextTrack(autoPlay: boolean = true): void {
    const nextIdx = (this.currentTrackIndex() + 1) % this.tracks().length;
    this.selectTrack(nextIdx, autoPlay);
  }

  prevTrack(): void {
    const total = this.tracks().length;
    const prevIdx = (this.currentTrackIndex() - 1 + total) % total;
    this.selectTrack(prevIdx, true);
  }

  seek(percentage: number): void {
    if (this.duration()) {
      const targetTime = (percentage / 100) * this.duration();
      this.audio.currentTime = targetTime;
      this.currentTime.set(targetTime);
    }
  }

  toggleMute(): void {
    this.audio.muted = !this.audio.muted;
    this.isMuted.set(this.audio.muted);
  }

  togglePlaylist(): void {
    this.isPlaylistOpen.update(open => !open);
  }

  closePlaylist(): void {
    this.isPlaylistOpen.set(false);
  }

  private formatTime(sec: number): string {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
}
