import { Routes } from "@angular/router";

export const routes: Routes = [
    { path: 'signup/:id', loadComponent: () => import('./signup/signup').then(c => c.Signup) },
    { path: 'signin/:id', loadComponent: () => import('./signIn/signIn').then(c => c.signIn) },
    { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) },
    { path: 'fill-form/:id', loadComponent: () => import('./step-components/fill-form/fill-form').then(c => c.FillForm) },
    { path: 'pay/:id', loadComponent: () => import('./step-components/pay-expense/pay-expense').then(c => c.PayExpense) },
    { path: '', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) },
    { path: '**', loadComponent: () => import('@app/not-found-page/not-found-page').then(c => c.NotFoundPage) }
]