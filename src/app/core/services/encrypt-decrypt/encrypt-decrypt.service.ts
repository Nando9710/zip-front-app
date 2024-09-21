import { Injectable } from '@angular/core';
import { environment } from '@env';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {
  private static secretKey: string = environment.cryptoSecretKey;


  /**
   * Encripta y retorna el texto introducido
   *
   * @param text - Texto a encriptar
   */
  public static encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.secretKey.trim()).toString();
  }

  /**
   * Desencripta y retorna el texto introducido
   *
   * @param text - Texto a encriptar
   */
  public static decrypt(text: string): string {
    return CryptoJS.AES.decrypt(text, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }
}
