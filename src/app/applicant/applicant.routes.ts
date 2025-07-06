import { Routes } from "@angular/router";

export const routes: Routes = [
    { path: 'signup', loadComponent: () => import('./signup/signup').then(c => c.Signup) },
    { path: 'followup', loadComponent: () => import('./followup/followup').then(c => c.Followup) },
]