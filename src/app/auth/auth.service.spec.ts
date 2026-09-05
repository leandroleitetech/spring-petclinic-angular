import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';

import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';

describe('AuthService', () => {
  let httpTestingController: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthService]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpTestingController.verify();
    sessionStorage.clear();
  });

  it('stores the base64 credentials on successful login', () => {
    authService.login('admin', 'admin123').subscribe();

    const req = httpTestingController.expectOne(`${environment.REST_API_URL}pettypes`);
    expect(req.request.headers.get('Authorization')).toEqual('Basic YWRtaW46YWRtaW4xMjM=');
    req.flush([]);

    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.credentials).toEqual('YWRtaW46YWRtaW4xMjM=');
    expect(authService.username).toEqual('admin');
  });

  it('keeps the user unauthenticated when the API rejects the credentials', () => {
    authService.login('admin', 'wrong').subscribe({error: () => undefined});

    httpTestingController.expectOne(`${environment.REST_API_URL}pettypes`)
      .flush('Unauthorized', {status: 401, statusText: 'Unauthorized'});

    expect(authService.isAuthenticated()).toBe(false);
  });

  it('clears the credentials on logout', () => {
    authService.login('admin', 'admin123').subscribe();
    httpTestingController.expectOne(`${environment.REST_API_URL}pettypes`).flush([]);

    authService.logout();

    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.credentials).toBeNull();
  });

  it('sends a PUT to change password', () => {
    authService.changePassword('admin123', 'newpass123', 'newpass123').subscribe();

    const req = httpTestingController.expectOne(`${environment.REST_API_URL}auth/password`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual({currentPassword: 'admin123', newPassword: 'newpass123', confirmPassword: 'newpass123'});
    req.flush(null);
  });

  it('sends a password reset request and returns the token', () => {
    authService.requestPasswordReset('admin').subscribe(response => {
      expect(response.token).toEqual('reset-token');
    });

    const req = httpTestingController.expectOne(`${environment.REST_API_URL}auth/password-reset/request`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({username: 'admin'});
    req.flush({token: 'reset-token'});
  });

  it('sends a password reset confirmation', () => {
    authService.confirmPasswordReset('reset-token', 'newpass123', 'newpass123').subscribe();

    const req = httpTestingController.expectOne(`${environment.REST_API_URL}auth/password-reset/confirm`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({token: 'reset-token', newPassword: 'newpass123', confirmPassword: 'newpass123'});
    req.flush(null);
  });
});
