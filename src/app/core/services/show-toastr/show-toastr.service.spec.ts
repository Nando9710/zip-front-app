import {inject, TestBed} from '@angular/core/testing';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

import {ShowToastrService, ToastrTypes} from './show-toastr.service';

describe('ShowToastrService', () => {
  let service: ShowToastrService;
  let toastrService: ToastrService;
  let spyToastr;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot(),
        TranslateModule.forRoot()
      ],
      providers: [ToastrService, TranslateService]
    });

    service = TestBed.inject(ShowToastrService);
    toastrService = TestBed.inject(ToastrService);
  });

  it('should be created', inject([ShowToastrService], (service: ShowToastrService) => {
    expect(service).toBeTruthy();
  }));

  it('Mostrar mensaje satisfactorio', () => {
    spyToastr = jest.spyOn(toastrService, 'success');
    service.showToast('Correcto', ToastrTypes.SUCCESS);
    expect(spyToastr).toBeCalledTimes(1);
  });

  it('Mostrar mensaje de advertencia', () => {
    spyToastr = jest.spyOn(toastrService, 'warning');
    service.showToast('Advertencia', ToastrTypes.WARNING);
    expect(spyToastr).toBeCalledTimes(1);
  });

  it('Mostrar mensaje de error', () => {
    spyToastr = jest.spyOn(toastrService, 'error');
    service.showToast('Error', ToastrTypes.ERROR);
    expect(spyToastr).toBeCalledTimes(1);
  });

  it('Mostrar mensaje general', () => {
    spyToastr = jest.spyOn(toastrService, 'show');
    service.showToast('Mostrar', ToastrTypes.SHOW);
    expect(spyToastr).toBeCalledTimes(1);
  });

  it('Mostrar mensaje de información', () => {
    spyToastr = jest.spyOn(toastrService, 'info');
    service.showToast('Información', ToastrTypes.INFO);
    expect(spyToastr).toBeCalledTimes(1);
  });

  it('Mostrar mensaje por default', () => {
    spyToastr = jest.spyOn(toastrService, 'show');
    service.showToast('Por defecto');
    expect(spyToastr).toBeCalledTimes(1);
  });
});
