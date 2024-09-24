import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '@constants/storage';
import { User } from '@interfaces/user';
import { EncryptDecryptService } from '@services/encrypt-decrypt/encrypt-decrypt.service';
import Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root'
})
export class LoggedInUserService {

  private readonly _platformId = inject(PLATFORM_ID);

  /**
   * Devuelve el token de usuario
   *
   * @returns Token de usuario
   */
  public getTokenOfUser(): string {
    let token: string;

    if (isPlatformBrowser(this._platformId)) {
      token = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!token) {
        token = Cookies.get(TOKEN_STORAGE_KEY);
      }
    }

    return token;
  }

  public setTokenOfUser(accessToken: string): void {
    if (isPlatformBrowser(this._platformId)) {
      Cookies.set(TOKEN_STORAGE_KEY, accessToken);
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    }
  }

  /**
   * Devuelve el usuario autenticado en el sistema
   *
   * @returns Usuario del sistema
   */
  public getLoggedInUser(): User {
    let user: string;

    if (isPlatformBrowser(this._platformId)) {
      user = localStorage.getItem(USER_STORAGE_KEY);

      if (!user) {
        user = Cookies.get(USER_STORAGE_KEY);
      }
    }

    return user ? JSON.parse(EncryptDecryptService.decrypt(user)) : null;
  }

  public setUser(user: User): void {
    if (isPlatformBrowser(this._platformId)) {
      Cookies.set(USER_STORAGE_KEY, EncryptDecryptService.encrypt(JSON.stringify(user)));
      localStorage.setItem(USER_STORAGE_KEY, EncryptDecryptService.encrypt(JSON.stringify(user)));
    }
  }

  public removeUserCookies(): void {
    if (isPlatformBrowser(this._platformId)) {
      Cookies.remove(TOKEN_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      Cookies.remove(USER_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }
}
