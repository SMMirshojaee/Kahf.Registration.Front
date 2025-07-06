import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('@app/welcome/welcome').then(c => c.Welcome) },
    { path: 'applicant', loadChildren: () => import('./applicant/applicant.routes').then(r => r.routes) },
    { path: '**', loadComponent: () => import('@app/not-found-page/not-found-page').then(c => c.NotFoundPage) }
];
