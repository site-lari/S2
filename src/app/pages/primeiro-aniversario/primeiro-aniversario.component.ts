import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-primeiro-aniversario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './primeiro-aniversario.component.html',
  styleUrl: './primeiro-aniversario.component.scss'
})
export class PrimeiroAniversarioComponent implements OnInit, OnDestroy {
  @ViewChild('audioPlayer') audioRef?: ElementRef<HTMLAudioElement>;
  @ViewChild('progressBar') progressRef?: ElementRef<HTMLDivElement>;

  currentPage = signal<number>(0);
  totalPages = 4;

  isPlaying = signal<boolean>(false);
  currentTimeFormatted = signal<string>('0:00');
  durationFormatted = signal<string>('0:00');
  progressPercent = signal<number>(0);

  private rafId?: number;

  ngOnInit(): void {
    // Component mounted
  }

  ngOnDestroy(): void {
    this.stopAudio();
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages - 1) {
      this.currentPage.update(page => page + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(page => page - 1);
    }
  }

  restartBook(): void {
    this.currentPage.set(0);
  }

  togglePlay(): void {
    const audio = this.audioRef?.nativeElement;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => {
        this.isPlaying.set(true);
        this.startProgressLoop();
      }).catch(err => {
        console.warn('Playback prevented:', err);
      });
    } else {
      audio.pause();
      this.isPlaying.set(false);
      if (this.rafId) cancelAnimationFrame(this.rafId);
    }
  }

  private stopAudio(): void {
    const audio = this.audioRef?.nativeElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      this.isPlaying.set(false);
    }
  }

  private startProgressLoop(): void {
    const loop = () => {
      const audio = this.audioRef?.nativeElement;
      if (audio && !audio.paused && audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        this.progressPercent.set(percent);
        this.currentTimeFormatted.set(this.formatTime(audio.currentTime));
        this.rafId = requestAnimationFrame(loop);
      }
    };
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(loop);
  }

  onAudioTimeUpdate(): void {
    const audio = this.audioRef?.nativeElement;
    if (audio && audio.duration) {
      const percent = (audio.currentTime / audio.duration) * 100;
      this.progressPercent.set(percent);
      this.currentTimeFormatted.set(this.formatTime(audio.currentTime));
    }
  }

  onAudioLoadedMetadata(): void {
    const audio = this.audioRef?.nativeElement;
    if (audio && audio.duration) {
      this.durationFormatted.set(this.formatTime(audio.duration));
    }
  }

  onAudioEnded(): void {
    const audio = this.audioRef?.nativeElement;
    if (audio) {
      audio.currentTime = 0;
    }
    this.isPlaying.set(false);
    this.progressPercent.set(0);
    this.currentTimeFormatted.set('0:00');
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  onProgressClick(event: MouseEvent): void {
    const audio = this.audioRef?.nativeElement;
    const progressEl = this.progressRef?.nativeElement;
    if (!audio || !progressEl || !audio.duration) return;

    const rect = progressEl.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    audio.currentTime = pct * audio.duration;
    this.progressPercent.set(pct * 100);
    this.currentTimeFormatted.set(this.formatTime(audio.currentTime));
  }

  formatTime(sec: number): string {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.code === 'Space' || event.key === ' ') {
      const target = event.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (isInput) return;

      event.preventDefault();
      this.togglePlay();
    }
  }
}
