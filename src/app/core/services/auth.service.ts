import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError, finalize } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
  emailConfirmed: boolean;
  roles: string[];
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  readonly user = signal<User | null>(null);
  readonly authStatus = signal<AuthStatus>('loading');

  checkAuth(): Observable<User> {
    this.authStatus.set('loading');
    return this.api.get<User>('auth/me').pipe(
      tap({
        next: (user) => {
          this.user.set(user);
          this.authStatus.set('authenticated');
        },
        error: () => {},
      }),
    );
  }

  login(email: string, password: string): Observable<User> {
    return this.api.post<User>('auth/token', { email, password }).pipe(
      tap((user) => {
        this.user.set(user);
        this.authStatus.set('authenticated');
      }),
      catchError((err) => {
        this.user.set(null);
        this.authStatus.set('unauthenticated');
        return throwError(() => err);
      }),
    );
  }

  logout(): void {
    this.api.post<void>('auth/logout', {}).pipe(
      finalize(() => {
        this.user.set(null);
        this.authStatus.set('unauthenticated');
        this.router.navigate(['/login']);
      }),
    ).subscribe({ error: () => {} });
  }

  isAuthenticated(): boolean {
    return this.authStatus() === 'authenticated';
  }

  isOfflineError(err: unknown): boolean {
    return err instanceof HttpErrorResponse && err.status === 0;
  }
}
