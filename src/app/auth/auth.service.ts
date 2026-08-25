import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

const CREDENTIALS_KEY = 'petclinic.credentials';
const USERNAME_KEY = 'petclinic.username';

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  get credentials(): string | null {
    return sessionStorage.getItem(CREDENTIALS_KEY);
  }

  get username(): string | null {
    return sessionStorage.getItem(USERNAME_KEY);
  }

  isAuthenticated(): boolean {
    return this.credentials !== null;
  }

  login(username: string, password: string): Observable<void> {
    const credentials = btoa(`${username}:${password}`);
    const headers = new HttpHeaders({Authorization: `Basic ${credentials}`});
    return this.http.get(`${environment.REST_API_URL}pettypes`, {headers}).pipe(
      map(() => {
        sessionStorage.setItem(CREDENTIALS_KEY, credentials);
        sessionStorage.setItem(USERNAME_KEY, username);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(CREDENTIALS_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
  }
}
