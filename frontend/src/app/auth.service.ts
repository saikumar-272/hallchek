import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  loggedIn = signal(false);
  defaultCmp = signal(false);

  constructor() {
    // Check on load
    this.loggedIn.set(!!localStorage.getItem('mobileNumber'));
  }

  offDefaultCmp() {
    this.defaultCmp.set(false);
  }
  OnDefaultCmp() {
    this.defaultCmp.set(true);
  }

  isdefaultCmp() {
    return this.defaultCmp();
  }
  isLoggedIn() {
    console.log('cheking given ', this.loggedIn());
    return this.loggedIn();
  }

  login(mobile: string, userData: []) {
    console.log('login service executed');

    localStorage.setItem('mobileNumber', mobile);
    localStorage.setItem('userData', JSON.stringify(userData));
    this.loggedIn.set(true); // ✅ CRITICAL — must set signal!
    console.log(this.loggedIn());
  }

  logout() {
    console.log('log out service executed');

    localStorage.removeItem('mobileNumber');

    this.loggedIn.set(false);
    console.log(this.loggedIn());
  }
}
