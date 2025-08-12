import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login/login.page';
import { RegisterPageComponent } from './pages/register/register.page';
import { DashboardPageComponent } from './pages/dashboard/dashboard.page';
import { HistoryPageComponent } from './pages/history/history.page';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => Promise.resolve(LoginPageComponent) },
  { path: 'register', loadComponent: () => Promise.resolve(RegisterPageComponent) },
  { path: '', canActivate: [authGuard], loadComponent: () => Promise.resolve(DashboardPageComponent) },
  { path: 'history', canActivate: [authGuard], loadComponent: () => Promise.resolve(HistoryPageComponent) },
  { path: '**', redirectTo: '' },
];
