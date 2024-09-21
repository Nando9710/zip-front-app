import {Injectable, inject} from '@angular/core';
import {IndividualConfig, ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

export enum ToastrTypes {
  'ERROR',
  'SUCCESS',
  'INFO',
  'SHOW',
  'WARNING'
}

export interface ToastrConfig {
  timeOut?: number;
  positionClass?: string;
  closeButton?: boolean;
  progressBar?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ShowToastrService {
  /**
   * Injections
  */
  private readonly _toastr: ToastrService = inject(ToastrService);
  private readonly _translateService: TranslateService = inject(TranslateService);

  /**
   * Muestra una notificación
   *
   * @param message - Mensaje para mostrar en la notificación
   * @param type - El tipo de notificción
   * @param toTranslate - Si es necesario o no traducir el mensaje
   * @param secondaryMessage - El subtítulo de las notificaciones
   * @param config - La configuración de las notificaciones
   */
  public showToast(message: string, type?: ToastrTypes, toTranslate?: boolean, secondaryMessage?: string, config?: ToastrConfig): void {
    secondaryMessage = secondaryMessage ?? '';

    if (toTranslate) {
      message = this._translateService.instant(message);
      secondaryMessage = secondaryMessage ? this._translateService.instant(secondaryMessage) : undefined;
    }

    const toastrConfig: Partial<IndividualConfig> = {
      ...config,
      timeOut: config?.timeOut ?? 8000,
      positionClass: config?.positionClass ?? 'toast-top-right'
    };

    switch (type) {
    case ToastrTypes.SUCCESS:
      this._toastr.success(message, secondaryMessage, toastrConfig);
      break;
    case ToastrTypes.ERROR:
      this._toastr.error(message, secondaryMessage, toastrConfig);
      break;
    case ToastrTypes.INFO:
      this._toastr.info(message, secondaryMessage, toastrConfig);
      break;
    case ToastrTypes.WARNING:
      this._toastr.warning(message, secondaryMessage, toastrConfig);
      break;
    case ToastrTypes.SHOW:
      this._toastr.show(message, secondaryMessage, toastrConfig);
      break;
    default:
      this._toastr.show(message, secondaryMessage, toastrConfig);
      break;
    }
  }
}
