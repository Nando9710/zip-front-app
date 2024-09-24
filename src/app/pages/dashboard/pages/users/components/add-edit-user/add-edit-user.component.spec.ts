import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { AddEditUserComponent } from './add-edit-user.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateUser, EditUser, User } from '@interfaces/user';
import { LoadingService } from '@services/loading/loading.service';
import { UserService } from '@services/user.service';
import { of, throwError } from 'rxjs';
import { ShowToastrService, ToastrTypes } from '@services/show-toastr/show-toastr.service';
import { DialogRef } from '@angular/cdk/dialog';

describe('AddEditUserComponent', () => {
  let component: AddEditUserComponent;
  let fixture: ComponentFixture<AddEditUserComponent>;
  let loadingService: LoadingService;
  let userService: UserService;
  let showToastrService: ShowToastrService;
  let dialogRef: MatDialogRef<AddEditUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddEditUserComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot()
      ],
      providers: [
        TranslateService,
        ToastrService,
        LoadingService,
        UserService,
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
            user: null
          }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddEditUserComponent);
    component = fixture.componentInstance;
    loadingService = TestBed.inject(LoadingService);
    userService = TestBed.inject(UserService);
    showToastrService = TestBed.inject(ShowToastrService);
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('createUser', () => {
    const mockUser = { id: '1', name: 'test', lastName: 'test', email: 'test@test.com' };

    it('should call createUser and show success toastr on success', () => {
      jest.spyOn(userService, 'createUser').mockReturnValue(of(mockUser));
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');
      const spyClose = jest.spyOn(dialogRef, 'close');
      const spyToast = jest.spyOn(showToastrService, 'showToast');

      component.form.setValue({
        name: 'test',
        lastName: 'test',
        email: 'test@test.com',
        password: 'Password123*'
      });
      component.createUser();

      expect(spyShow).toHaveBeenCalled();
      expect(userService.createUser).toHaveBeenCalled();
      expect(spyHide).toHaveBeenCalled();
      expect(spyClose).toHaveBeenCalledWith(mockUser);
      expect(spyToast).toHaveBeenCalledWith(
        'Se ha creado el usuario exitosamente',
        ToastrTypes.SUCCESS,
        true,
        'Felicidades!',
        expect.any(Object)
      );
    });

    it('should handle error and hide loading when createUser fails', () => {
      jest.spyOn(userService, 'createUser').mockReturnValue(throwError(() => new Error('error')));
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');
      const spyError = jest.spyOn(console, 'error');

      component.form.setValue({
        name: 'test',
        lastName: 'test',
        email: 'test@test.com',
        password: 'Password123*'
      });
      component.createUser();

      expect(spyShow).toHaveBeenCalled();
      expect(userService.createUser).toHaveBeenCalled();
      expect(spyHide).toHaveBeenCalled();
      expect(spyError).toHaveBeenCalledWith(new Error('error'));
    });
  });

  describe('editUser', () => {
    const mockUser = { id: '1', name: 'test', lastName: 'test', email: 'test@test.com' };

    it('should call editUser and show success toastr on success', () => {
      jest.spyOn(userService, 'editUser').mockReturnValue(of(mockUser));
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');
      const spyClose = jest.spyOn(dialogRef, 'close');
      const spyToast = jest.spyOn(showToastrService, 'showToast');

      component.user.set(mockUser);
      component.isEditing.set(true);
      component.form.patchValue({
        name: 'test',
        lastName: 'test',
        email: 'test@test.com'
      });
      component.editUser();

      expect(spyShow).toHaveBeenCalled();
      expect(userService.editUser).toHaveBeenCalled();
      expect(spyHide).toHaveBeenCalled();
      expect(spyClose).toHaveBeenCalledWith(mockUser);
      expect(spyToast).toHaveBeenCalledWith(
        'Se ha editado el usuario exitosamente',
        ToastrTypes.SUCCESS,
        true,
        'Felicidades!',
        expect.any(Object)
      );
    });

    it('should handle error and hide loading when editUser fails', () => {
      jest.spyOn(userService, 'editUser').mockReturnValue(throwError(() => new Error('error')));
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');
      const spyError = jest.spyOn(console, 'error');

      component.user.set(mockUser);
      component.isEditing.set(true);
      component.form.patchValue({
        name: 'test',
        lastName: 'test',
        email: 'test@test.com'
      });
      component.editUser();

      expect(spyShow).toHaveBeenCalled();
      expect(userService.editUser).toHaveBeenCalled();
      expect(spyHide).toHaveBeenCalled();
      expect(spyError).toHaveBeenCalledWith(new Error('error'));
    });
  });
});
