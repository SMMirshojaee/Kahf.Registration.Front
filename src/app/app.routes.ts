import { Routes } from '@angular/router';
import { applicantGuard } from './core/guards/applicant-guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('@app/welcome/welcome').then(c => c.Welcome) },
    { path: 'applicant', loadChildren: () => import('./applicant/applicant.routes').then(r => r.routes), canActivate: [applicantGuard] },
    { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(r => r.routes) },
    { path: '**', loadComponent: () => import('@app/not-found-page/not-found-page').then(c => c.NotFoundPage) }
];
