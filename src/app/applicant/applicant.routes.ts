import { Routes } from "@angular/router";

export const routes: Routes = [
    { path: 'signup/:id', loadComponent: () => import('./signup/signup').then(c => c.Signup) },
    { path: 'followup/:id', loadComponent: () => import('./followup/followup').then(c => c.Followup) },
    { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) },
]