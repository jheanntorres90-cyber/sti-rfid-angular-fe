import { Routes } from '@angular/router';
import {AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { LandingComponent } from './feature/landing/landing';

export const routes: Routes = [
  // ✅ Default redirect
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
   {
    path: 'landing',
    component: AuthLayoutComponent,
    children: [{ path: '', component: LandingComponent}],
  },

   { path: '**', redirectTo: 'landing' },
];
