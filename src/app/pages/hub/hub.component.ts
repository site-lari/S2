import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface GiftCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  route: string;
  buttonText: string;
  accentGradient: string;
}

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss'
})
export class HubComponent {
  gifts: GiftCard[] = [
    {
      id: 'livro',
      icon: 'fa-book-open',
      title: '02/10/2025',
      description: 'Primeiro presentinho',
      route: '/primeiro-aniversario',
      buttonText: 'Abrir presente',
      accentGradient: 'linear-gradient(135deg, #95071a 0%, #ff4e50 100%)'
    },
    {
      id: 'um-ano',
      icon: 'fa-heart',
      title: '03/06/2026',
      description: '1 Aninho',
      route: '/um-ano',
      buttonText: 'Abrir presente',
      accentGradient: 'linear-gradient(135deg, #ff4d85 0%, #ff7eb3 100%)'
    },
    {
      id: 'novo-aniversario',
      icon: 'fa-sun',
      title: '02/10/2026',
      description: 'Segundo niver com a minha fofa',
      route: '/novo-aniversario',
      buttonText: 'Abrir presente',
      accentGradient: 'linear-gradient(135deg, #c87d69 0%, #e5a97b 100%)'
    }
  ];
}
