import { Routes } from "@angular/router";

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./login/login').then(c => c.Login) },
    { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) },
    { path: '', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) },
    { path: '**', loadComponent: () => import('@app/not-found-page/not-found-page').then(c => c.NotFoundPage) }
]