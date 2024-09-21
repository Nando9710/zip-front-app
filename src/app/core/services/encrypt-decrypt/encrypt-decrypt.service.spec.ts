import { inject, TestBed } from '@angular/core/testing';

import { EncryptDecryptService } from './encrypt-decrypt.service';

describe('EncryptDecryptService', (): void => {
  let service: EncryptDecryptService;

  beforeEach((): void => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(EncryptDecryptService);
  });

  it('should be created', inject([EncryptDecryptService], (service: EncryptDecryptService) => {
    expect(service).toBeTruthy();
  }));

  it('Encriptar y desencriptar', (): void => {
    const text: string = 'Banana';
    expect(EncryptDecryptService.decrypt(EncryptDecryptService.encrypt(text))).toEqual(text);
  });
});
