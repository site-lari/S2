import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface GiftCard {
  id: string;
  badge: string;
  badgeColor: string;
  icon: string;
  title: string;
  description: string;
  musicTag: string;
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
      badge: '1º Presente',
      badgeColor: '#ff4e50',
      icon: 'fa-book-open',
      title: 'O Livro de Aniversário',
      description: 'O início de tudo: páginas folheadas com carinho, balões coloridos, memórias e nossa foto especial.',
      musicTag: 'Radiohead — Let Down',
      route: '/primeiro-aniversario',
      buttonText: 'Abrir Livrinho',
      accentGradient: 'linear-gradient(135deg, #95071a 0%, #ff4e50 100%)'
    },
    {
      id: 'um-ano',
      badge: '1 Ano Juntos',
      badgeColor: '#ff4d85',
      icon: 'fa-heart',
      title: 'Um Ano de Nós',
      description: 'Contador de dias desde o nosso começo, cartinha selada no envelope, cards interativos e nossa linha do tempo.',
      musicTag: 'Nossa Música Especial',
      route: '/um-ano',
      buttonText: 'Reviver Momentos',
      accentGradient: 'linear-gradient(135deg, #ff4d85 0%, #ff7eb3 100%)'
    },
    {
      id: 'novo-aniversario',
      badge: 'Novo Capítulo',
      badgeColor: '#9b5de5',
      icon: 'fa-gift',
      title: 'Seu Novo Aniversário',
      description: 'Mais um ano ao seu lado! O próximo presente preparado especialmente para a garota mais incrível.',
      musicTag: 'Próxima Surpresa',
      route: '/novo-aniversario',
      buttonText: 'Descobrir Surpresa',
      accentGradient: 'linear-gradient(135deg, #7928ca 0%, #ff0080 100%)'
    }
  ];
}
