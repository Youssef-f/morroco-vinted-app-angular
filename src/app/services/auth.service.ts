import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'token';

  constructor(private router: Router, private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    console.log('Login request payload:', { email, password });

    return this.http
      .post(
        `${this.apiUrl}/login`,
        {
          email: email,
          password: password,
        },
        { headers }
      )
      .pipe(
        tap((response: any) => {
          console.log('Auth service response:', response);
          if (response && response.jwt) {
            localStorage.setItem(this.TOKEN_KEY, response.jwt);
          } else if (response && response.token) {
            localStorage.setItem(this.TOKEN_KEY, response.token);
          } else if (response && response.access_token) {
            localStorage.setItem(this.TOKEN_KEY, response.access_token);
          } else {
            console.error('No token found in response:', response);
          }
        })
      );
  }

  getToken(): string | null {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      return token || null;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    try {
      const token = this.getToken();
      if (!token) return false;

      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      if (!payload || typeof payload.exp !== 'number') return false;

      return Date.now() < payload.exp * 1000;
    } catch {
      return false;
    }
  }

  logout(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch {}
    this.router.navigate(['/login']);
  }
}
