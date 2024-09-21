import { inject, TestBed } from '@angular/core/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ShowToastrService } from '@services/general/show-toastr/show-toastr.service';
import { UtilsService } from './utils.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('UtilsService', () => {
  let service: UtilsService;
  let showToastr: ShowToastrService;

  const mockUtils = require('./mocks/utils.json');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [ToastrService]
    });

    service = TestBed.inject(UtilsService);
    showToastr = TestBed.inject(ShowToastrService);
  });

  it('should be created', inject([UtilsService], (service: UtilsService) => {
    expect(service).toBeTruthy();
  }));

  it('Configuración global de los Toastr', () => {
    const config = service.getDefaultToastrConfig();
    expect(config).toEqual(mockUtils?.GET_TOASTR_CONFIG);
  });

  it('Manejo de errores', function () {
    const spyToastr = jest.spyOn(showToastr, 'showToast');
    const error = new HttpErrorResponse({
      error: {
        status: 0
      }
    });

    service.errorHandle(error);
    expect(spyToastr).toBeCalledTimes(1);
  });
});
