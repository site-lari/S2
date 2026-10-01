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
      subtitle: 'Radiohead - Choir Version',
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
  hasAutoplayBlocked = signal<boolean>(false);
  volume = signal<number>(0.7);

  private interactionEvents = ['pointerdown', 'touchstart', 'touchend', 'click', 'keydown', 'scroll'];
  private listenersBound = false;

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
    this.audio.preload = 'auto';
    // Mobile WebKit playsinline properties
    (this.audio as any).playsInline = true;
    (this.audio as any).webkitPlaysInline = true;

    this.setupAudioListeners();
    this.loadCurrentTrack(false);
    this.attemptAutoplay();
  }

  private resolveAssetUrl(path: string): string {
    if (typeof document !== 'undefined' && document.baseURI) {
      try {
        return new URL(path, document.baseURI).href;
      } catch {
        return path;
      }
    }
    return path;
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
      this.hasAutoplayBlocked.set(false);
      this.updateMediaSession();
      this.cleanupInteractionUnlock();
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
    this.audio.src = this.resolveAssetUrl(track.src);
    this.audio.volume = this.volume();
    this.audio.muted = this.isMuted();
    this.audio.load();

    if (wasPlaying) {
      this.play();
    }
  }

  private attemptAutoplay(): void {
    this.audio.volume = this.volume();
    this.audio.muted = false;

    // Attach interaction unlock listeners immediately
    this.setupInteractionUnlock();

    // Attempt direct play (succeeds on desktop or browsers with high media engagement)
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isPlaying.set(true);
        this.hasAutoplayBlocked.set(false);
        this.cleanupInteractionUnlock();
      }).catch((err) => {
        console.log('Mobile/Browser blocked direct autoplay; waiting for user gesture:', err);
        this.isPlaying.set(false);
        this.hasAutoplayBlocked.set(true);
      });
    } else {
      this.hasAutoplayBlocked.set(true);
    }
  }

  private unlockHandler = (event?: Event): void => {
    if (this.isPlaying()) {
      this.cleanupInteractionUnlock();
      return;
    }

    this.audio.muted = false;
    this.audio.volume = this.volume();

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isPlaying.set(true);
        this.hasAutoplayBlocked.set(false);
        this.cleanupInteractionUnlock();
      }).catch(err => {
        console.warn('Playback attempt after touch still blocked, will retry on next interaction:', err);
        // Do NOT cleanup: allow subsequent user touches to unlock
      });
    }
  };

  private setupInteractionUnlock(): void {
    if (this.listenersBound || typeof window === 'undefined' || typeof document === 'undefined') return;
    this.listenersBound = true;

    this.interactionEvents.forEach(evt => {
      document.addEventListener(evt, this.unlockHandler, { capture: true, passive: true });
      window.addEventListener(evt, this.unlockHandler, { capture: true, passive: true });
    });
  }

  private cleanupInteractionUnlock(): void {
    if (!this.listenersBound || typeof window === 'undefined' || typeof document === 'undefined') return;
    this.interactionEvents.forEach(evt => {
      document.removeEventListener(evt, this.unlockHandler, { capture: true });
      window.removeEventListener(evt, this.unlockHandler, { capture: true });
    });
    this.listenersBound = false;
  }

  play(): void {
    this.audio.muted = false;
    this.audio.volume = this.volume();

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isPlaying.set(true);
        this.hasAutoplayBlocked.set(false);
        this.cleanupInteractionUnlock();
      }).catch(err => {
        console.warn('Cannot start playback:', err);
      });
    }
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

  private updateMediaSession(): void {
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      const track = this.currentTrack();
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: track.subtitle,
          album: 'Nosso Cantinho ❤️',
          artwork: track.cover ? [
            { src: this.resolveAssetUrl(track.cover), sizes: '512x512', type: 'image/jpeg' }
          ] : []
        });

        navigator.mediaSession.setActionHandler('play', () => this.play());
        navigator.mediaSession.setActionHandler('pause', () => this.pause());
        navigator.mediaSession.setActionHandler('previoustrack', () => this.prevTrack());
        navigator.mediaSession.setActionHandler('nexttrack', () => this.nextTrack());
      } catch (e) {
        // MediaMetadata fallback
      }
    }
  }

  private formatTime(sec: number): string {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
}
