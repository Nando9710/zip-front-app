import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

import { AuthService } from './auth.service';
import { LoggedInUserService } from '@services/logged-in-user/logged-in-user.service';
import { Router } from '@angular/router';
import { LoginIn, LoginOut } from '@interfaces/auth';
import { LOGIN_URL } from '@constants/endpoints';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let loggedInUserService: LoggedInUserService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthService,
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: LoggedInUserService, useValue: { removeUserCookies: jest.fn() } }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    loggedInUserService = TestBed.inject(LoggedInUserService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login a user', () => {
    const loginData: LoginIn = { email: 'test@test.com', password: 'password' };
    const loginResponse: LoginOut = { id: '1', name: 'Test User', email: 'test@test.com', accessToken: 'accessToken' };

    service.login(loginData).subscribe({
      next: response => {
        expect(response).toEqual(loginResponse);
      }
    });

    const req = httpMock.expectOne(LOGIN_URL);
    expect(req.request.method).toBe('POST');
    req.flush(loginResponse);
  });

  it('should logout the user and navigate to authentication page', () => {
    const spyRemoveUserCookies = jest.spyOn(loggedInUserService, 'removeUserCookies');
    const spyNavigate = jest.spyOn(router, 'navigate');

    service.logout();

    expect(spyRemoveUserCookies).toHaveBeenCalled();
    expect(spyNavigate).toHaveBeenCalledWith(['authentication']);
  });
});
