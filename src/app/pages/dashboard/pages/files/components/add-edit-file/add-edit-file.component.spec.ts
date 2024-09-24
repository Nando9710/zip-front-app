import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFileComponent } from './add-edit-file.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoadingService } from '@services/loading/loading.service';
import { FileService } from '@services/file/file.service';
import { ShowToastrService, ToastrTypes } from '@services/show-toastr/show-toastr.service';
import { of, throwError } from 'rxjs';
import { DialogRef } from '@angular/cdk/dialog';
import { LoggedInUserService } from '@services/logged-in-user/logged-in-user.service';

describe('AddEditFileComponent', () => {
  let component: AddEditFileComponent;
  let fixture: ComponentFixture<AddEditFileComponent>;
  let loadingService: LoadingService;
  let fileService: FileService;
  let showToastrService: ShowToastrService;
  let loggedInUserService: LoggedInUserService;
  let dialogRef: MatDialogRef<AddEditFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddEditFileComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot()
      ],
      providers: [
        TranslateService,
        ToastrService,
        LoadingService,
        FileService,
        LoggedInUserService,
        ShowToastrService,
        {
          provide: MatDialogRef, useValue: {
            close: jest.fn(),
            afterClosed: jest.fn().mockReturnValue(of(true)) // Simula la respuesta de afterClosed
          }
        },
        {
          provide: DialogRef, useValue: {
            close: jest.fn(),
            afterClosed: jest.fn().mockReturnValue(of(true)) // Simula la respuesta de afterClosed
          }
        },
        {
          provide: MAT_DIALOG_DATA, useValue: {
            isEditing: true,
            file: null
          }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddEditFileComponent);
    component = fixture.componentInstance;
    loadingService = TestBed.inject(LoadingService);
    fileService = TestBed.inject(FileService);
    showToastrService = TestBed.inject(ShowToastrService);
    loggedInUserService = TestBed.inject(LoggedInUserService);
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('createFile', () => {
    const mockFile = { id: '1', name: 'file.zip', description: 'test', path: 'file.zip' };

    it('should call createFile and show success toastr on success', () => {
      jest.spyOn(fileService, 'uploadFile').mockReturnValue(of(mockFile));
      jest.spyOn(loggedInUserService, 'getLoggedInUser').mockReturnValue({ id: '1', name: 'test', email: 'test@test.com' });
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');
      const spyClose = jest.spyOn(dialogRef, 'close');
      const spyToast = jest.spyOn(showToastrService, 'showToast');

      component.form.setValue({
        file: 'file.zip',
        description: 'test',
      });

      component.selectedFile.set(new File([''], 'file.zip'));
      component.uploadFile();

      expect(spyShow).toHaveBeenCalled();
      expect(fileService.uploadFile).toHaveBeenCalled();
      expect(spyHide).toHaveBeenCalled();
      expect(spyClose).toHaveBeenCalledWith(mockFile);
      expect(spyToast).toHaveBeenCalledWith(
        'Se ha añadido el archivo exitosamente',
        ToastrTypes.SUCCESS,
        true,
        'Felicidades!',
        expect.any(Object)
      );
    });

    it('should handle error and hide loading when createFile fails', () => {
      jest.spyOn(fileService, 'uploadFile').mockReturnValue(throwError(() => new Error('error')));
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');
      const spyError = jest.spyOn(console, 'error');

      component.form.setValue({
        file: 'file.zip',
        description: 'test',
      });
      component.uploadFile();

      expect(spyShow).toHaveBeenCalled();
      expect(fileService.uploadFile).toHaveBeenCalled();
      expect(spyHide).toHaveBeenCalled();
      expect(spyError).toHaveBeenCalledWith(new Error('error'));
    });
  });

  describe('editFile', () => {
    const mockFile = { id: '1', name: 'file.zip', description: 'test', path: 'file.zip' };

    it('should call editFile and show success toastr on success', () => {
      jest.spyOn(fileService, 'editFile').mockReturnValue(of(mockFile));
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');
      const spyClose = jest.spyOn(dialogRef, 'close');
      const spyToast = jest.spyOn(showToastrService, 'showToast');

      component.file.set(mockFile);
      component.isEditing.set(true);
      component.form.patchValue({
        description: 'test2',
      });
      component.editFile();

      expect(spyShow).toHaveBeenCalled();
      expect(fileService.editFile).toHaveBeenCalled();
      expect(spyHide).toHaveBeenCalled();
      expect(spyClose).toHaveBeenCalledWith(mockFile);
      expect(spyToast).toHaveBeenCalledWith(
        'Se ha editado el archivo exitosamente',
        ToastrTypes.SUCCESS,
        true,
        'Felicidades!',
        expect.any(Object)
      );
    });

    it('should handle error and hide loading when editFile fails', () => {
      jest.spyOn(fileService, 'editFile').mockReturnValue(throwError(() => new Error('error')));
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');
      const spyError = jest.spyOn(console, 'error');

      component.file.set(mockFile);
      component.isEditing.set(true);
      component.form.patchValue({
        description: 'test2',
      });
      component.editFile();

      expect(spyShow).toHaveBeenCalled();
      expect(fileService.editFile).toHaveBeenCalled();
      expect(spyHide).toHaveBeenCalled();
      expect(spyError).toHaveBeenCalledWith(new Error('error'));
    });
  });
});
