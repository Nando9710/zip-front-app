import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesComponent } from './files.component';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileDownloaded, Files } from '@interfaces/file';
import { FileService } from '@services/file/file.service';
import { of, throwError } from 'rxjs';
import { LoadingService } from '@services/loading/loading.service';
import { ShowToastrService, ToastrTypes } from '@services/show-toastr/show-toastr.service';
import { AddEditFileComponent } from './components/add-edit-file/add-edit-file.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';

describe('FilesComponent', () => {
  let component: FilesComponent;
  let fixture: ComponentFixture<FilesComponent>;
  let fileService: FileService;
  let loadingService: LoadingService;
  let showToastrService: ShowToastrService;
  let dialog: MatDialog;
  let dialogRef: MatDialogRef<AddEditFileComponent>;

  const dummyFile: Files = { id: '3', name: 'file3.zip', description: 'test', path: 'file3.zip' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FilesComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot()
      ],
      providers: [
        FileService,
        ToastrService,
        TranslateService,
        {
          provide: MatDialogRef, useValue: {
            close: jest.fn(),
            afterClosed: jest.fn().mockReturnValue(of(dummyFile)) // Simula la respuesta de afterClosed
          }
        },
        {
          provide: DialogRef, useValue: {
            close: jest.fn(),
            afterClosed: jest.fn().mockReturnValue(of(dummyFile)) // Simula la respuesta de afterClosed
          }
        },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FilesComponent);
    component = fixture.componentInstance;
    fileService = TestBed.inject(FileService);
    loadingService = TestBed.inject(LoadingService);
    showToastrService = TestBed.inject(ShowToastrService);
    dialog = TestBed.inject(MatDialog)
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should call getFiles', () => {
    jest.spyOn(component, 'getFiles');

    component.ngOnInit();

    expect(component.getFiles).toHaveBeenCalled();
  });

  describe('getFiles', () => {
    it('should call getFiles', () => {
      const mockFiles: Files[] = [{ id: '1', name: 'file1.zip', description: 'description', path: 'file1.zip' }];

      jest.spyOn(fileService, 'getFiles').mockReturnValue(of(mockFiles));
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');

      component.getFiles();

      expect(spyShow).toHaveBeenCalled();
      expect(fileService.getFiles).toHaveBeenCalled();
      expect(component.dataSource()).toEqual(mockFiles);
      expect(spyHide).toHaveBeenCalled();
    });

    it('should handle error and hide loading when createFile fails', () => {
      jest.spyOn(fileService, 'getFiles').mockReturnValue(throwError(() => new Error('error')));
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');
      const spyError = jest.spyOn(console, 'error');

      component.getFiles();

      expect(spyShow).toHaveBeenCalled();
      expect(fileService.getFiles).toHaveBeenCalled();
      expect(component.dataSource()).toBeNull();
      expect(spyHide).toHaveBeenCalled();
      expect(spyError).toHaveBeenCalledWith(new Error('error'));
    });
  })

  it('should open AddEditFileComponent dialog when uploadFile is called', () => {
    jest.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(null) } as any);
    jest.spyOn(component, 'getFiles');

    component.uploadFile();

    expect(dialog.open).toHaveBeenCalled();

    dialogRef.afterClosed().subscribe({
      next: (file) => {
        expect(file).toEqual(dummyFile);
        expect(component.getFiles).toHaveBeenCalled();
      }
    });
  });

  it('should open AddEditFileComponent dialog when editFile is called', () => {
    jest.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(null) } as any);
    jest.spyOn(component, 'editFile');

    component.editFile(dummyFile);

    expect(dialog.open).toHaveBeenCalled();

    dialogRef.afterClosed().subscribe({
      next: (file) => {
        expect(file).toEqual(dummyFile);
        expect(component.getFiles).toHaveBeenCalled();
      }
    });
  });

  describe('deleteFile', () => {
    const mockFiles: Files[] = [{ id: '1', name: 'file1.zip', description: 'description', path: 'file1.zip' }];

    it('should call deleteFile and show success toastr on success', () => {
      jest.spyOn(fileService, 'deleteFile').mockReturnValue(of(mockFiles));
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');
      const spyToast = jest.spyOn(showToastrService, 'showToast');

      component.deleteFile(dummyFile);

      expect(spyShow).toHaveBeenCalled();
      expect(fileService.deleteFile).toHaveBeenCalled();
      expect(spyHide).toHaveBeenCalled();
      expect(spyToast).toHaveBeenCalledWith(
        'Se ha eliminado el archivo exitosamente',
        ToastrTypes.SUCCESS,
        true,
        'Felicidades!',
        expect.any(Object)
      );
    });

    it('should handle error and hide loading when deleteFile fails', () => {
      jest.spyOn(fileService, 'deleteFile').mockReturnValue(throwError(() => new Error('error')));
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');
      const spyError = jest.spyOn(console, 'error');

      component.deleteFile(dummyFile);

      expect(spyShow).toHaveBeenCalled();
      expect(fileService.deleteFile).toHaveBeenCalled();
      expect(spyHide).toHaveBeenCalled();
      expect(spyError).toHaveBeenCalledWith(new Error('error'));
    });
  });

  describe('downloadFile', () => {
    const downloadedFile: FileDownloaded = { data: new Blob(), error: null };

    it('should call downloadFile and show success toastr on success', () => {
      jest.spyOn(fileService, 'downloadFile').mockReturnValue(of(downloadedFile));
      const spyShow = jest.spyOn(loadingService, 'show');

      component.downloadFile(dummyFile);

      expect(spyShow).toHaveBeenCalled();
      expect(fileService.downloadFile).toHaveBeenCalled();
    });
  });
});
