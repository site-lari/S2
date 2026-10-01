import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NoteDetail {
  id: number;
  tag: string;
  title: string;
  text: string;
  icon: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-novo-aniversario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './novo-aniversario.component.html',
  styleUrl: './novo-aniversario.component.scss'
})
export class NovoAniversarioComponent {
  candleLit = signal<boolean>(true);
  wishMade = signal<boolean>(false);

  notes = signal<NoteDetail[]>([
 
    {
      id: 1,
      tag: 'Detalhe nº 1',
      title: 'Nossas conversas bobas',
      text: 'Falar de tudo e de nada, perder a noção do tempo nas madrugadas e ter a certeza de que qualquer assunto com você é divertido.',
      icon: 'fa-mug-hot',
      isOpen: false
    },
    {
      id: 2,
      tag: 'Detalhe nº 2',
      title: 'A sua sensibilidade',
      text: 'O jeito atencioso e doce como você se importa com as coisas e as pessoas. É uma das qualidades que mais admiro em você.',
      icon: 'fa-feather-pointed',
      isOpen: false
    },
    {
      id: 3,
      tag: 'Detalhe nº 3',
      title: 'A paz da sua companhia',
      text: 'Não precisar de grandes coisas; só de estarmos juntos, mesmo fazendo coisas simples, já é o melhor momento do dia.',
      icon: 'fa-heart',
      isOpen: false
    },
  ]);

  toggleNote(index: number): void {
    this.notes.update(items => {
      const copy = [...items];
      copy[index] = { ...copy[index], isOpen: !copy[index].isOpen };
      return copy;
    });
  }

  blowCandle(): void {
    if (this.candleLit()) {
      this.candleLit.set(false);
      this.wishMade.set(true);
    } else {
      this.candleLit.set(true);
      this.wishMade.set(false);
    }
  }
}
