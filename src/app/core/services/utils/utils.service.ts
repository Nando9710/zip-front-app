import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ShowToastrService, ToastrConfig, ToastrTypes } from "@services/show-toastr/show-toastr.service";
import { marker as _t } from '@biesbjerg/ngx-translate-extract-marker';
import { LoadingService } from "@services/loading/loading.service";
import { UntypedFormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { LoggedInUserService } from "@services/logged-in-user/logged-in-user.service";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  /**
   * Injections
   */
  private readonly _showToastrService: ShowToastrService = inject(ShowToastrService);
  private readonly _loadingService: LoadingService = inject(LoadingService);
  private readonly _loggedInUserService: LoggedInUserService = inject(LoggedInUserService);
  private readonly _router: Router = inject(Router);

  private readonly toastrTypes: typeof ToastrTypes = ToastrTypes;

  /**
   * Devuelve la configuración global para los Toastr
   *
   * @returns Devuelve la configuración global en la estructura definida por la interfaz ToastrConfig
   */
  public getDefaultToastrConfig(): ToastrConfig {
    return {
      timeOut: 8000,
      progressBar: false,
      positionClass: 'toast-top-right',
      closeButton: false
    };
  }

  /**
   * Realiza el manejo de los errores devueltos por las peticiones al servidor y lanza una notificación al usuario
   *
   * @param response - La respuesta a la petición Http del servidor
   */
  public errorHandle(response: HttpErrorResponse): void {
    let messages: string[];

    if ([401, 403].includes(response?.status)) {
      this._loggedInUserService.removeUserCookies();

      this._showToastrService.showToast(
        _t('Usuario no autorizado'),
        this.toastrTypes.INFO,
        false,
        'Error',
        this.getDefaultToastrConfig()
      );

      this._router.navigate(['authentication']);
    } else if (response?.status === 400) {
      if (typeof response?.error?.message === 'string') {
        messages = [response?.error?.message];
      } else if (typeof response?.error?.error?.message === 'string') {
        messages = [response.error.error.message];
      } else {
        response?.error?.message?.forEach((message: string): void => {
          messages.push(message);
        });
      }
    } else if (response?.status === 500) {
      messages = [_t('Error interno, por favor póngase en contacto con el administrador.')];
    } else if (response?.status === 0) {
      messages = [_t('El servidor esta caído o necesita revisar su conexión')];
    }

    messages?.forEach((message: string): void => {
      this._showToastrService.showToast(
        message, this.toastrTypes.INFO, false, 'Error', this.getDefaultToastrConfig()
      );
    });

    this._loadingService.hide();
  }
}
