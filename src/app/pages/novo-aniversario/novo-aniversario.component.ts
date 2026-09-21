import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-novo-aniversario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './novo-aniversario.component.html',
  styleUrl: './novo-aniversario.component.scss'
})
export class NovoAniversarioComponent {
  revealed = signal<boolean>(false);

  toggleReveal(): void {
    this.revealed.update(r => !r);
  }
}
