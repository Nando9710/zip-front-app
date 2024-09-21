import { Injectable } from '@angular/core';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '@constants/storage';
import { User } from '@interfaces/user';
import { EncryptDecryptService } from '@services/encrypt-decrypt/encrypt-decrypt.service';
import Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root'
})
export class LoggedInUserService {

  /**
   * Devuelve el token de usuario
   *
   * @returns Token de usuario
   */
  public getTokenOfUser(): string {
    let token: string;

    if (TOKEN_STORAGE_KEY in localStorage) {
      token = localStorage.getItem(TOKEN_STORAGE_KEY);
    } else if (TOKEN_STORAGE_KEY in Cookies) {
      token = Cookies.get(TOKEN_STORAGE_KEY);
    }

    return token;
  }

  /**
   * Devuelve el usuario autenticado en el sistema
   *
   * @returns Usuario del sistema
   */
  public getLoggedInUser(): User {
    let user: string;

    if (USER_STORAGE_KEY in localStorage) {
      user = localStorage.getItem(USER_STORAGE_KEY);
    } else if (USER_STORAGE_KEY in Cookies) {
      user = Cookies.get(USER_STORAGE_KEY);
    }

    return user ? JSON.parse(EncryptDecryptService.decrypt(user)) : null;
  }
}
