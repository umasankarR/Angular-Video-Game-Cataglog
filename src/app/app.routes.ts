import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'games',
    pathMatch: 'full'
  },
  {
    path: 'games',
    loadChildren: () => import('./features/video-games/video-games.routes').then(m => m.VIDEO_GAMES_ROUTES)
  },
  { path: '**', redirectTo: 'games' }
];
