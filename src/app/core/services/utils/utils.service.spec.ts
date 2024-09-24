import { inject, TestBed } from '@angular/core/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ShowToastrService, ToastrTypes } from '@services/show-toastr/show-toastr.service';
import { UtilsService } from './utils.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingService } from '@services/loading/loading.service';
import { LoggedInUserService } from '@services/logged-in-user/logged-in-user.service';
import { Router } from '@angular/router';

describe('UtilsService', () => {
  let service: UtilsService;
  let showToastr: ShowToastrService;
  let loadingService: LoadingService;
  let loggedInUserService: LoggedInUserService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        UtilsService,
        ToastrService,
        LoadingService,
        LoggedInUserService,
        Router
      ]
    });

    service = TestBed.inject(UtilsService);
    showToastr = TestBed.inject(ShowToastrService);
    loadingService = TestBed.inject(LoadingService);
    loggedInUserService = TestBed.inject(LoggedInUserService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', inject([UtilsService], (service: UtilsService) => {
    expect(service).toBeTruthy();
  }));

  it('Configuración global de los Toastr', () => {
    const config = service.getDefaultToastrConfig();
    expect(config).toEqual({
      "timeOut": 8000,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "closeButton": false
    });
  });

  describe('errorHandle', () => {
    it('should handle 401 and 403 errors', () => {
      const mockResponse = new HttpErrorResponse({ status: 401 });
      const spyRemoveUserCookies = jest.spyOn(loggedInUserService, 'removeUserCookies');
      const spyShowToast = jest.spyOn(showToastr, 'showToast');
      const spyRouterNavigate = jest.spyOn(router, 'navigate');

      service.errorHandle(mockResponse);

      expect(spyRemoveUserCookies).toHaveBeenCalled();
      expect(spyShowToast).toHaveBeenCalledWith(
        'Usuario no autorizado', ToastrTypes.INFO, false, 'Error', service.getDefaultToastrConfig()
      );
      expect(spyRouterNavigate).toHaveBeenCalledWith(['authentication']);
    });

    it('should handle 400 errors and show messages', () => {
      const spyShowToast = jest.spyOn(showToastr, 'showToast');

      const mockResponse = new HttpErrorResponse({
        status: 400,
        error: { message: 'Error específico del servidor' }
      });

      service.errorHandle(mockResponse);

      expect(spyShowToast).toHaveBeenCalledWith(
        'Error específico del servidor', ToastrTypes.INFO, false, 'Error', service.getDefaultToastrConfig()
      );
    });

    it('should handle 500 errors', () => {
      const spyShowToast = jest.spyOn(showToastr, 'showToast');
      const mockResponse = new HttpErrorResponse({ status: 500 });

      service.errorHandle(mockResponse);

      expect(spyShowToast).toHaveBeenCalledWith(
        'Error interno, por favor póngase en contacto con el administrador.',
        ToastrTypes.INFO,
        false,
        'Error',
        service.getDefaultToastrConfig()
      );
    });

    it('should handle network issues (status 0)', () => {
      const spyShowToast = jest.spyOn(showToastr, 'showToast');
      const mockResponse = new HttpErrorResponse({ status: 0 });

      service.errorHandle(mockResponse);

      expect(spyShowToast).toHaveBeenCalledWith(
        'El servidor esta caído o necesita revisar su conexión',
        ToastrTypes.INFO,
        false,
        'Error',
        service.getDefaultToastrConfig()
      );
    });

    it('should hide loading service after handling error', () => {
      const spyHide = jest.spyOn(loadingService, 'hide');
      const mockResponse = new HttpErrorResponse({ status: 500 });

      service.errorHandle(mockResponse);

      expect(spyHide).toHaveBeenCalled();
    });
  });
});
