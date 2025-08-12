import { HttpInterceptorFn } from '@angular/common/http';

/**
 * PUBLIC_INTERFACE
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // SSR-safe token retrieval
  let token: string | null = null;
  try {
    token = (globalThis as any)?.localStorage?.getItem('auth_token') ?? null;
  } catch {
    token = null;
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req);
};
