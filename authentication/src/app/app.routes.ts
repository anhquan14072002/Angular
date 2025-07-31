import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './guard.ts/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { ErrorComponent } from './pages/error/error.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent },
    {
        path: '',
        component: ProfileComponent,
    },
    { path: '**', component: ErrorComponent },
];