import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const credentials = this.authService.credentials;
    const isApiRequest = request.url.startsWith(environment.REST_API_URL);
    if (credentials && isApiRequest && !request.headers.has('Authorization')) {
      request = request.clone({setHeaders: {Authorization: `Basic ${credentials}`}});
    }
    return next.handle(request);
  }
}
