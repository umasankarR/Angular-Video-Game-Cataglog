import { Routes } from '@angular/router';

export const VIDEO_GAMES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/game-list/game-list.component').then(m => m.GameListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./components/game-form/game-form.component').then(m => m.GameFormComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./components/game-form/game-form.component').then(m => m.GameFormComponent)
  }
];
