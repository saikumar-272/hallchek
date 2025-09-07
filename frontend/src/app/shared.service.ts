import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private mobileNumber = signal('');

  setMobile(mobile: string) {
    this.mobileNumber.set(mobile);
  }

  getMobile() {
    return this.mobileNumber;
  }

  clearMobile() {
    this.mobileNumber.set('');
  }
}
