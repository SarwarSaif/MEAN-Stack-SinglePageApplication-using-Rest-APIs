import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable() // Empty injectable annotation to inject other services
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    // Clone the token to manipulate the token else it will cause unwanted side-effects
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer' + authToken) // Authorization is case insensitive
      // pass config to clone to edit
      // edit hesder to set a new header and overwrite it if none

    });
    return next.handle(authRequest);
  }
}
