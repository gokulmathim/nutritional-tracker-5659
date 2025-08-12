import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse, RegisterPayload, UserCredentials } from '../../models/types';

/**
 * PUBLIC_INTERFACE
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private _isAuthenticated$ = new BehaviorSubject<boolean>(this.hasToken());

  /** PUBLIC_INTERFACE */
  isAuthenticated$ = this._isAuthenticated$.asObservable();

  constructor(private api: ApiService) {}

  /** PUBLIC_INTERFACE */
  login(credentials: UserCredentials): Observable<AuthResponse> {
    /** Performs login and stores token */
    return this.api.login(credentials).pipe(tap((resp) => this.setAuth(resp)));
  }

  /** PUBLIC_INTERFACE */
  register(payload: RegisterPayload): Observable<AuthResponse> {
    /** Performs registration and stores token */
    return this.api.register(payload).pipe(tap((resp) => this.setAuth(resp)));
  }

  /** PUBLIC_INTERFACE */
  logout(): void {
    /** Clears auth token and user info */
    try {
      (globalThis as any)?.localStorage?.removeItem(this.TOKEN_KEY);
      (globalThis as any)?.localStorage?.removeItem(this.USER_KEY);
    } catch {
      // ignore in SSR
    }
    this._isAuthenticated$.next(false);
  }

  /** PUBLIC_INTERFACE */
  getToken(): string | null {
    /** Returns the stored JWT token, or null if not logged in */
    try {
      return (globalThis as any)?.localStorage?.getItem(this.TOKEN_KEY) ?? null;
    } catch {
      return null;
    }
  }

  /** PUBLIC_INTERFACE */
  getUser(): { id?: string; email: string; name?: string } | null {
    /** Returns the stored user object */
    try {
      const raw = (globalThis as any)?.localStorage?.getItem(this.USER_KEY) ?? null;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private setAuth(resp: AuthResponse): void {
    if (resp?.token) {
      try {
        (globalThis as any)?.localStorage?.setItem(this.TOKEN_KEY, resp.token);
        if (resp.user) {
          (globalThis as any)?.localStorage?.setItem(this.USER_KEY, JSON.stringify(resp.user));
        }
      } catch {
        // ignore in SSR
      }
      this._isAuthenticated$.next(true);
    }
  }

  private hasToken(): boolean {
    try {
      return !!(globalThis as any)?.localStorage?.getItem(this.TOKEN_KEY);
    } catch {
      return false;
    }
  }
}
