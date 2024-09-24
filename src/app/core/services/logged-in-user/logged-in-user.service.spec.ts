import { TestBed } from '@angular/core/testing';

import { LoggedInUserService } from './logged-in-user.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '@constants/storage';
import Cookies from 'js-cookie';
import { User } from '@interfaces/user';
import { EncryptDecryptService } from '@services/encrypt-decrypt/encrypt-decrypt.service';

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  remove: jest.fn(),
  set: jest.fn()
}));
jest.mock('@services/encrypt-decrypt/encrypt-decrypt.service');
jest.mock('@angular/common', () => ({
  isPlatformBrowser: jest.fn()
}));

describe('LoggedInUserService', () => {
  let service: LoggedInUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoggedInUserService,
        EncryptDecryptService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ],
    });
    service = TestBed.inject(LoggedInUserService);
    (isPlatformBrowser as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTokenOfUser', () => {
    it('should return token from localStorage', () => {
      const mockToken = 'mockToken';
      localStorage.setItem(TOKEN_STORAGE_KEY, mockToken);

      const token = service.getTokenOfUser();

      expect(token).toBe(mockToken);
    });

    it('should return token from Cookies if not in localStorage', () => {
      const mockToken = 'user-token';

      localStorage.removeItem(TOKEN_STORAGE_KEY);
      Cookies.set(TOKEN_STORAGE_KEY, mockToken);

      const spyCookies = jest.spyOn(Cookies, 'get');
      (Cookies.get as jest.Mock).mockReturnValue(mockToken);

      const token = service.getTokenOfUser();

      expect(spyCookies).toHaveBeenCalledWith(TOKEN_STORAGE_KEY);
      expect(token).toBe(mockToken);
    });

    it('should return undefined if token is not found', () => {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      (Cookies.get as jest.Mock).mockReturnValue(undefined);

      const token = service.getTokenOfUser();

      expect(token).toBeUndefined();
    });
  });

  describe('setTokenOfUser', () => {
    it('should set token in localStorage and Cookies', () => {
      const mockToken = 'mockToken';

      service.setTokenOfUser(mockToken);

      expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe(mockToken);
      expect(Cookies.set).toHaveBeenCalledWith(TOKEN_STORAGE_KEY, mockToken);
    });
  });

  describe('getLoggedInUser', () => {
    it('should return user from localStorage', () => {
      const mockUser = { id: 1, name: 'Test User' };
      const encryptedUser = 'encryptedUser';
      localStorage.setItem(USER_STORAGE_KEY, encryptedUser);
      (EncryptDecryptService.decrypt as jest.Mock).mockReturnValue(JSON.stringify(mockUser));

      const user = service.getLoggedInUser();

      expect(user).toEqual(mockUser);
    });

    it('should return user from Cookies if not in localStorage', () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@test.com' };
      const encryptedUser = 'encryptedUser';
      (Cookies.get as jest.Mock).mockReturnValue(encryptedUser);
      (EncryptDecryptService.decrypt as jest.Mock).mockReturnValue(JSON.stringify(mockUser));

      const user = service.getLoggedInUser();

      expect(user).toEqual(mockUser);
    });

    it('should return null if no user found', () => {
      localStorage.removeItem(USER_STORAGE_KEY);
      (Cookies.get as jest.Mock).mockReturnValue(undefined);

      const user = service.getLoggedInUser();

      expect(user).toBeNull();
    });
  });

  describe('setUser', () => {
    it('should set user in localStorage and Cookies', () => {
      const mockUser: User = { id: '1', name: 'Test User', email: 'test@test.com' };
      const encryptedUser = 'encryptedUser';
      (EncryptDecryptService.encrypt as jest.Mock).mockReturnValue(encryptedUser);

      service.setUser(mockUser);

      expect(localStorage.getItem(USER_STORAGE_KEY)).toBe(encryptedUser);
      expect(Cookies.set).toHaveBeenCalledWith(USER_STORAGE_KEY, encryptedUser);
    });
  });

  describe('removeUserCookies', () => {
    it('should remove user and token from localStorage and Cookies', () => {
      service.removeUserCookies();

      expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
      expect(localStorage.getItem(USER_STORAGE_KEY)).toBeNull();
      expect(Cookies.remove).toHaveBeenCalledWith(TOKEN_STORAGE_KEY);
      expect(Cookies.remove).toHaveBeenCalledWith(USER_STORAGE_KEY);
    });
  });
});
