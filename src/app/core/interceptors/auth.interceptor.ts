import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = getServerErrorMessage(error);

      if (error.error instanceof ErrorEvent) {
        message = `Error: ${error.error.message}`;
      }

      if (error.status === 401) {
        auth.user.set(null);
        auth.authStatus.set('unauthenticated');
        if (!window.location.pathname.startsWith('/resetPassword')) {
          router.navigate(['/login']);
        }
      }else{
        messageService.add({
          key: 'global-toast',
          severity: 'error',
          summary: 'Error HTTP',
          detail: message,
          life: 5000,
        });
      }
      return throwError(() => error);
    }),
  );
};

function getServerErrorMessage(error: HttpErrorResponse): string {
  if (error.error?.details) {
    const msg = error.error.message + '\n';
    return msg + Object.values(error.error.details).join('\n ');
  }

  switch (error.status) {
    case 0:
      return 'No se pudo conectar al servidor';
    case 400:
      return extractErrorMessage(error.error);
    case 401:
      return 'Usuario no autorizado';
    case 403:
      return 'Acceso denegado';
    case 404:
      return 'Recurso no encontrado';
    case 405:
      return 'Método no permitido';
    case 415:
      return 'Tipo de medio no soportado';
    case 500:
      return 'Error interno del servidor';
    default:
      return error.error?.message || error.message;
  }
}

type ErrorDictionary = { [code: string]: string[] };

type ApiErrorShape =
  | string
  | string[]
  | ErrorDictionary
  | { errors?: ErrorDictionary | string[] }
  | undefined;

function extractErrorMessage(error: ApiErrorShape): string {
  if (!error) return 'Solicitud incorrecta';

  if (typeof error === 'string') return error;

  if (Array.isArray(error)) {
    return error[0] ?? 'Solicitud incorrecta';
  }

  // A partir de aquí, error es ErrorDictionary | { errors?: ErrorDictionary | string[] }
  const errors: ErrorDictionary | string[] | undefined =
    'errors' in error ? error.errors : (error as ErrorDictionary);

  if (!errors) return 'Solicitud incorrecta';

  if (Array.isArray(errors)) {
    return errors[0] ?? 'Solicitud incorrecta';
  }

  const firstKey = Object.keys(errors)[0];
  return firstKey ? (errors[firstKey]?.[0] ?? 'Solicitud incorrecta') : 'Solicitud incorrecta';
}
