import { Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicPlayerService, Track } from '../../services/music-player.service';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.scss'
})
export class MusicPlayerComponent {
  playerService = inject(MusicPlayerService);

  @ViewChild('progressBar') progressBarRef?: ElementRef<HTMLDivElement>;

  onSeek(event: MouseEvent): void {
    const bar = this.progressBarRef?.nativeElement;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    this.playerService.seek(percentage);
  }

  selectTrack(index: number): void {
    this.playerService.selectTrack(index, true);
    this.playerService.closePlaylist();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.player-root')) {
      this.playerService.closePlaylist();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Space' || event.key === ' ') {
      const activeEl = document.activeElement as HTMLElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);
      if (isInput) return;

      event.preventDefault();
      this.playerService.togglePlay();
    }
  }
}
