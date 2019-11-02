import {
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
    // If return true than router will proceed,
    // If return false than router will deny
    // before returning false, should redirected
    const isAuth = this.authService.getIsAuthenticated();
    if (!isAuth) {
      this.router.navigate(['/login']);
    }
    return isAuth;
  }

}
