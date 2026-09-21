import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/hub/hub.component').then(m => m.HubComponent),
    title: 'Nosso Cantinho ❤️'
  },
  {
    path: 'primeiro-aniversario',
    loadComponent: () => import('./pages/primeiro-aniversario/primeiro-aniversario.component').then(m => m.PrimeiroAniversarioComponent),
    title: 'Feliz Aniversário 🎂'
  },
  {
    path: 'um-ano',
    loadComponent: () => import('./pages/um-ano/um-ano.component').then(m => m.UmAnoComponent),
    title: 'Um Ano de Nós 💖'
  },
  {
    path: 'novo-aniversario',
    loadComponent: () => import('./pages/novo-aniversario/novo-aniversario.component').then(m => m.NovoAniversarioComponent),
    title: 'Novo Aniversário ✨'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
