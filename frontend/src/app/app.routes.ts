import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { DefaultComponent } from './default/default.component';
import { AuthGuard } from './auth.guard';
import { CalendarComponent } from './calendar/calendar.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserHomeComponent } from './user-home/user-home.component';

export const routes: Routes = [
  { path: '', component: DefaultComponent },

  {
    path: 'login',
    component: LoginComponent,
    title: 'login',
  },
  // {
  //   path: 'user-login',
  //   component: UserLoginComponent,
  //   title: 'login',
  // },
  {
    path: 'signUp',
    component: SignupComponent,
    title: 'sign-up',
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard],
    data: {
      allowedUserTypes: [2], // Only  markting poeple have access
    },
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home',
    canActivate: [AuthGuard],
    data: {
      allowedUserTypes: [1], // Only user_type = 1 can access
    },
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [AuthGuard],
    data: {
      allowedUserTypes: [1], // Only hall owner's / patner logins have access
    },
  },
  {
    path: 'user-home',
    component: UserHomeComponent,
    canActivate: [AuthGuard],
    data: {
      allowedUserTypes: [3], // end user
    },
  },
];
