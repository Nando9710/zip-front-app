import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { marker as _t } from '@biesbjerg/ngx-translate-extract-marker';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';

import { ShowToastrService, ToastrTypes } from '@services/show-toastr/show-toastr.service';
import { UtilsService } from '@services/utils/utils.service';
import { LoggedInUserService } from '@services/logged-in-user/logged-in-user.service';


/**
 * Interceptor encargado de poner la cabecera de Authentication en cada petición si el usuario está autenticado, además incluye el idioma y la moneda
 *
 * @param req - Petición Http
 * @param next - Función para manejar la petición Http
 */
export function TokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

  const token: string = inject(LoggedInUserService).getTokenOfUser();

  const headers: { [key: string]: string } = {
    'Cache-Control': 'public, max-age=32150000',
    'Referrer-Policy': 'no-referrer-when-downgrade',
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    'Access-Control-Allow-Origin': '*'
  };

  if (token) headers.Authorization = "Bearer " + token;

  return next(req.clone({ setHeaders: headers }));
}

/**
 * Interceptor encargado de manejar los errores en las peticiones Http
 *
 * @param req - Petición Http
 * @param next - Función para manejar la petición Http
 */
export function HttpErrorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const toastrService: ShowToastrService = inject(ShowToastrService);
  const utilsService: UtilsService = inject(UtilsService);

  return next(req).pipe(
    catchError((response: HttpErrorResponse) => {
      if (response?.error instanceof ErrorEvent) {
        toastrService.showToast(
          response?.error?.message,
          ToastrTypes.INFO,
          false,
          _t('Error'),
          utilsService.getDefaultToastrConfig()
        );
      } else {
        utilsService.errorHandle(response);
      }

      return throwError(() => response?.error);
    })
  );
}

