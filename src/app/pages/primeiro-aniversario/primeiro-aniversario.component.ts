import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-primeiro-aniversario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './primeiro-aniversario.component.html',
  styleUrl: './primeiro-aniversario.component.scss'
})
export class PrimeiroAniversarioComponent {
  currentPage = signal<number>(0);
  totalPages = 4;

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
}
