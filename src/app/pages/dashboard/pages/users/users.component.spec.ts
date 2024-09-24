import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserService } from '@services/user.service';
import { of, throwError } from 'rxjs';
import { LoadingService } from '@services/loading/loading.service';
import { ShowToastrService, ToastrTypes } from '@services/show-toastr/show-toastr.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { User } from '@interfaces/user';
import { AddEditUserComponent } from './components/add-edit-user/add-edit-user.component';
import { DialogRef } from '@angular/cdk/dialog';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let userService: UserService;
  let loadingService: LoadingService;
  let showToastrService: ShowToastrService;
  let dialog: MatDialog;
  let dialogRef: MatDialogRef<AddEditUserComponent>;

  const dummyUser: User = { id: '3', name: 'User3', lastName: 'test', email: 'user3@example.com' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UsersComponent,
        MatDialogModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot()
      ],
      providers: [
        UserService,
        TranslateService,
        ToastrService,
        {
          provide: MatDialogRef, useValue: {
            close: jest.fn(),
            afterClosed: jest.fn().mockReturnValue(of(dummyUser)) // Simula la respuesta de afterClosed
          }
        },
        {
          provide: DialogRef, useValue: {
            close: jest.fn(),
            afterClosed: jest.fn().mockReturnValue(of(dummyUser)) // Simula la respuesta de afterClosed
          }
        },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    loadingService = TestBed.inject(LoadingService);
    showToastrService = TestBed.inject(ShowToastrService);
    dialog = TestBed.inject(MatDialog)
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should call getUsers', () => {
    jest.spyOn(component, 'getUsers');

    component.ngOnInit();

    expect(component.getUsers).toHaveBeenCalled();
  });

  describe('getUsers', () => {
    it('should call getUsers', () => {
      const mockUsers = [{ id: '1', name: 'User1', email: 'user1@example.com' }];

      jest.spyOn(userService, 'getUsers').mockReturnValue(of(mockUsers));
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');

      component.getUsers();

      expect(spyShow).toHaveBeenCalled();
      expect(userService.getUsers).toHaveBeenCalled();
      expect(component.dataSource()).toEqual(mockUsers);
      expect(spyHide).toHaveBeenCalled();
    });

    it('should handle error and hide loading when getUsers fails', () => {
      jest.spyOn(userService, 'getUsers').mockReturnValue(throwError(() => new Error('error')));
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');
      const spyError = jest.spyOn(console, 'error');

      component.getUsers();

      expect(spyShow).toHaveBeenCalled();
      expect(userService.getUsers).toHaveBeenCalled();
      expect(component.dataSource()).toBeNull();
      expect(spyHide).toHaveBeenCalled();
      expect(spyError).toHaveBeenCalledWith(new Error('error'));
    });
  })

  it('should open AddEditUserComponent dialog when addUser is called', () => {
    jest.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(null) } as any);
    jest.spyOn(component, 'getUsers');

    component.addUser();

    expect(dialog.open).toHaveBeenCalled();

    dialogRef.afterClosed().subscribe({
      next: (user) => {
        expect(user).toEqual(dummyUser);
        expect(component.getUsers).toHaveBeenCalled();
      }
    });
  });

  it('should open AddEditUserComponent dialog when editUser is called', () => {
    jest.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(null) } as any);
    jest.spyOn(component, 'editUser');

    component.editUser(dummyUser);

    expect(dialog.open).toHaveBeenCalled();

    dialogRef.afterClosed().subscribe({
      next: (user) => {
        expect(user).toEqual(dummyUser);
        expect(component.getUsers).toHaveBeenCalled();
      }
    });
  });

  describe('deleteUser', () => {
    const mockUsers = [{ id: '1', name: 'User1', email: 'user1@example.com' }];

    it('should call deleteUser and show success toastr on success', () => {
      jest.spyOn(userService, 'deleteUser').mockReturnValue(of(mockUsers));
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');
      const spyToast = jest.spyOn(showToastrService, 'showToast');

      component.deleteUser(dummyUser);

      expect(spyShow).toHaveBeenCalled();
      expect(userService.deleteUser).toHaveBeenCalled();
      expect(spyHide).toHaveBeenCalled();
      expect(spyToast).toHaveBeenCalledWith(
        'Se ha eliminado el usuario exitosamente',
        ToastrTypes.SUCCESS,
        true,
        'Felicidades!',
        expect.any(Object)
      );
    });

    it('should handle error and hide loading when deleteUser fails', () => {
      jest.spyOn(userService, 'deleteUser').mockReturnValue(throwError(() => new Error('error')));
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');
      const spyError = jest.spyOn(console, 'error');

      component.deleteUser(dummyUser);

      expect(spyShow).toHaveBeenCalled();
      expect(userService.deleteUser).toHaveBeenCalled();
      expect(spyHide).toHaveBeenCalled();
      expect(spyError).toHaveBeenCalledWith(new Error('error'));
    });
  });
});
