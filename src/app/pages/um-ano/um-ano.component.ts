import { Component, ElementRef, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FloatingHeart {
  left: number;
  size: number;
  duration: number;
  delay: number;
}

interface CardItem {
  front: string;
  back: string;
  flipped: boolean;
}

interface TimelineItem {
  date: string;
  title: string;
  text: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-um-ano',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './um-ano.component.html',
  styleUrl: './um-ano.component.scss'
})
export class UmAnoComponent implements OnInit {
  isLetterModalOpen = signal<boolean>(false);

  daysCount = signal<number>(0);
  formattedStartDate = signal<string>('Desde 04/06/2025');

  floatingHearts = signal<FloatingHeart[]>([]);

  cards = signal<CardItem[]>([
    { front: "Por que você é especial?", back: "Pois você faz cada dia que passo contigo parecer mágico.", flipped: false },
    { front: "O que eu mais admiro?", back: "Sua maneira de tentar o seu melhor sempre, independente das circunstâncias.", flipped: false },
    { front: "Meu momento favorito?", back: "Impossível escolher um só!", flipped: false },
    { front: "O que eu desejo?", back: "Que a gente continue criando momentos incríveis juntos!", flipped: false },
    { front: "Uma coisa que aprendi?", back: "Que o tempo passa rápido demais quando estou com você.", flipped: false },
    { front: "Por que este presente?", back: "Para registrar o quanto você é importante pra mim. ❤️", flipped: false }
  ]);

  timeline: TimelineItem[] = [
    { date: "03/06/2025", title: "Primeiro contato com a minha amada", text: "O dia que tudo começou... O dia que se conhecemos.", icon: "fa-star", color: "#ff4d85" },
    { date: "Julho 2025", title: "Começo de algo maior", text: "Depois de tão pouco tempo, você já tinha começado a ser algo a mais.", icon: "fa-camera", color: "#d678ff" },
    { date: "Setembro 2025", title: "Amor", text: "Já sabia que lhe amava.", icon: "fa-coffee", color: "#f39c12" },
    { date: "Hoje", title: "Um ano de nós.", text: "E que venham muitos outros anos incríveis <3", icon: "fa-heart", color: "#ff4d85" }
  ];

  ngOnInit(): void {
    this.calculateDays();
    this.generateFloatingHearts();
  }

  private calculateDays(): void {
    const startDate = new Date("2025-06-04T00:00:00");
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.daysCount.set(diff);
    this.formattedStartDate.set(`Desde ${startDate.toLocaleDateString('pt-BR')}`);
  }

  private generateFloatingHearts(): void {
    const hearts: FloatingHeart[] = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      hearts.push({
        left: Math.random() * 96,
        size: Math.random() * 16 + 12,
        duration: Math.random() * 5 + 6,
        delay: Math.random() * 5
      });
    }
    this.floatingHearts.set(hearts);
  }

  toggleCard(index: number): void {
    this.cards.update(list => {
      const updated = [...list];
      updated[index] = { ...updated[index], flipped: !updated[index].flipped };
      return updated;
    });
  }

  openLetter(): void {
    this.isLetterModalOpen.set(true);
  }

  closeLetter(): void {
    this.isLetterModalOpen.set(false);
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeLetter();
    }
  }
}
