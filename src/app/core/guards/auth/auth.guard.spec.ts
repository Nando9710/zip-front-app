import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '@services/auth/auth.service';
import { LoggedInUserService } from '@services/logged-in-user/logged-in-user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { User } from '@interfaces/user';

jest.mock('@services/auth/auth.service');
jest.mock('@services/logged-in-user/logged-in-user.service');

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  let loggedInUserService: LoggedInUserService;
  let authService: AuthService;
  let routeSnapshot: ActivatedRouteSnapshot;
  let stateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        AuthService,
        LoggedInUserService,
        // { provide: authGuard, useFactory: authGuard },
      ],

    });

    authService = TestBed.inject(AuthService);
    loggedInUserService = TestBed.inject(LoggedInUserService);
    // Mocks para ActivatedRouteSnapshot y RouterStateSnapshot
    routeSnapshot = {} as ActivatedRouteSnapshot;
    stateSnapshot = {} as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if user and token exist', () => {
    const mockUser: User = { id: '1', name: 'test', email: 'test@test.com' }; // Ajusta según tu interfaz
    const spyGetLoggedInUser = jest.spyOn(loggedInUserService, 'getLoggedInUser').mockReturnValue(mockUser);
    const spyGetTokenOfUser = jest.spyOn(loggedInUserService, 'getTokenOfUser').mockReturnValue('mock-token');

    const result = executeGuard(routeSnapshot, stateSnapshot);

    expect(result).toBe(true);
    expect(spyGetLoggedInUser).toHaveBeenCalled();
    expect(spyGetTokenOfUser).toHaveBeenCalled();
  });

  it('should return false and call logout if no user and no token exist', () => {
    const spyGetLoggedInUser = jest.spyOn(loggedInUserService, 'getLoggedInUser').mockReturnValue(null);
    const spyGetTokenOfUser = jest.spyOn(loggedInUserService, 'getTokenOfUser').mockReturnValue(null);
    const spyLogout = jest.spyOn(authService, 'logout');

    const result = executeGuard(routeSnapshot, stateSnapshot);

    expect(result).toBe(false);
    expect(spyGetLoggedInUser).toHaveBeenCalled();
    expect(spyGetTokenOfUser).toHaveBeenCalled();
    expect(spyLogout).toHaveBeenCalled();
  });

  it('should return true if only token exists but no user', () => {
    const spyGetLoggedInUser = jest.spyOn(loggedInUserService, 'getLoggedInUser').mockReturnValue(null);
    const spyGetTokenOfUser = jest.spyOn(loggedInUserService, 'getTokenOfUser').mockReturnValue('mock-token');

    const result = executeGuard(routeSnapshot, stateSnapshot);

    expect(result).toBe(true);
    expect(spyGetLoggedInUser).toHaveBeenCalled();
    expect(spyGetTokenOfUser).toHaveBeenCalled();
  });

  it('should return true if only user exists but no token', () => {
    const mockUser: User = { id: '1', name: 'test', email: 'test@test.com' }; // Ajusta según tu interfaz
    const spyGetLoggedInUser = jest.spyOn(loggedInUserService, 'getLoggedInUser').mockReturnValue(mockUser);
    const spyGetTokenOfUser = jest.spyOn(loggedInUserService, 'getTokenOfUser').mockReturnValue(null);

    const result = executeGuard(routeSnapshot, stateSnapshot);

    expect(result).toBe(true);
    expect(spyGetLoggedInUser).toHaveBeenCalled();
    expect(spyGetTokenOfUser).toHaveBeenCalled();
  });

});
