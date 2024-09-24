import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '@services/auth/auth.service';
import { LoadingService } from '@services/loading/loading.service';
import { ShowToastrService, ToastrTypes } from '@services/show-toastr/show-toastr.service';
import { UtilsService } from '@services/utils/utils.service';
import { LoggedInUserService } from '@services/logged-in-user/logged-in-user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginOut } from '@interfaces/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let loadingService: LoadingService;
  let showToastrService: ShowToastrService;
  let loggedInUserService: LoggedInUserService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot()
      ],
      providers: [
        TranslateService,
        ToastrService,
        AuthService,
        LoadingService,
        ShowToastrService,
        UtilsService,
        Router,
        LoggedInUserService
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    loadingService = TestBed.inject(LoadingService);
    showToastrService = TestBed.inject(ShowToastrService);
    loggedInUserService = TestBed.inject(LoggedInUserService);
    router = TestBed.inject(Router);
    fixture.detectChanges();

    jest.clearAllMocks(); // Reset mocks between tests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('login', () => {
    const mockUser: LoginOut = { id: '1', name: 'test', email: 'test@test.com', accessToken: 'accessToken' };

    it('should call login, show toastr, and navigate on success', () => {
      const spyLogin = jest.spyOn(authService, 'login').mockReturnValue(of(mockUser));
      const spySetTokenOfUser = jest.spyOn(loggedInUserService, 'setTokenOfUser');
      const spyRemoveUserCookies = jest.spyOn(loggedInUserService, 'removeUserCookies');
      const spySetUser = jest.spyOn(loggedInUserService, 'setUser');
      const spyShowToast = jest.spyOn(showToastrService, 'showToast');
      const spyNavigate = jest.spyOn(router, 'navigate');
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');

      component.form.setValue({ email: 'test@test.com', password: 'password123' });
      component.login();

      expect(spyShow).toHaveBeenCalled();
      expect(spyRemoveUserCookies).toHaveBeenCalled();
      expect(spyLogin).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password123' });
      expect(spyHide).toHaveBeenCalled();
      expect(spyShowToast).toHaveBeenCalledWith(
        'Ha iniciado sesión exitosamente', ToastrTypes.SUCCESS, true, 'Felicidades!', expect.any(Object)
      );
      expect(spySetTokenOfUser).toHaveBeenCalledWith(mockUser.accessToken);
      expect(spySetUser).toHaveBeenCalledWith(mockUser);
      expect(spyNavigate).toHaveBeenCalledWith(['dashboard']);
    });

    it('should handle login error and hide loading', () => {
      const spyLogin = jest.spyOn(authService, 'login').mockReturnValue(throwError(() => errorResponse));
      const spyShow = jest.spyOn(loadingService, 'show');
      const spyHide = jest.spyOn(loadingService, 'hide');
      const spyError = jest.spyOn(console, 'error'); // To check if error is logged

      const errorResponse = new Error('Login failed');

      component.form.setValue({ email: 'test@test.com', password: 'password123' });
      component.login();

      expect(spyShow).toHaveBeenCalled();
      expect(spyLogin).toHaveBeenCalled();
      expect(spyHide).toHaveBeenCalled();
      expect(spyError).toHaveBeenCalledWith(errorResponse);
    });
  });

  describe('form validation', () => {
    it('should initialize with invalid form', () => {
      expect(component.form.valid).toBe(false);
    });

    it('should validate email and password fields correctly', () => {
      const emailControl = component.form.get('email');
      const passwordControl = component.form.get('password');

      // Initially invalid
      expect(emailControl.valid).toBe(false);
      expect(passwordControl.valid).toBe(false);

      // Set valid values
      emailControl.setValue('test@test.com');
      passwordControl.setValue('password123');

      expect(emailControl.valid).toBe(true);
      expect(passwordControl.valid).toBe(true);
    });

    it('should invalidate form with incorrect email format', () => {
      const emailControl = component.form.get('email');

      emailControl.setValue('invalid-email');
      expect(emailControl.valid).toBe(false);
    });
  });

  describe('hide signal', () => {
    it('should toggle hide signal', () => {
      expect(component.hide()).toBe(false);

      // Simulate toggling hide state
      component.hide.set(true);
      expect(component.hide()).toBe(true);
    });
  });
});
