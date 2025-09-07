import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  isActiveLogin = computed(() => this.authService.isLoggedIn());
  isDefultCmp = computed(() => this.authService.isdefaultCmp());

  logout() {
    console.log('header function called');
    this.authService.logout();
    this.router.navigate(['/']);
  }
  registerSpace() {
    this.router.navigate(['/signUp']);
  }

  login() {
    this.router.navigate(['/login'], {
      queryParams: { login_type: 'partnerLogin', title: 'Partner Sign-In' },
    });
  }

  userLogin() {
    this.router.navigate(['/login'], {
      queryParams: { login_type: 'userLogin', title: 'Sign-In/Sign-Up' },
    });
  }
}
