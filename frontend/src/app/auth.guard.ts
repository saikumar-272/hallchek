import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from './auth.service';

// export const authGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (authService.isLoggedIn()) {
//     return true;
//   } else {
//     alert('un-authorised access');
//     router.navigate(['/login']);
//     return false;
//   }
// };

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userType = Number(userData[0].user_type);
    const allowedTypes = route.data['allowedUserTypes'] as number[];
    if (allowedTypes.includes(userType)) {
      return true;
    }

    // Redirect to unauthorized page or login
    alert('un-authorised access');
    this.router.navigate(['/login']);
    return false;
  }
}
