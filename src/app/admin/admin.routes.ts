import { Routes } from "@angular/router";

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./login/login').then(c => c.Login) },
    { path: 'regs', loadComponent: () => import('./regs/regs').then(c => c.Regs) },
    { path: 'step/:regId/:regStepId', loadComponent: () => import('./view-step/view-form-step/view-form-step').then(c => c.ViewFormStep) },
    { path: 'dashboard/:id', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) },
    { path: '', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) },
    { path: '**', loadComponent: () => import('@app/not-found-page/not-found-page').then(c => c.NotFoundPage) }
]