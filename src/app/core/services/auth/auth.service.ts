import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LOGIN_URL } from '@constants/endpoints';
import { LoginIn, LoginOut } from '@interfaces/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Injections
   */
  private readonly http: HttpClient = inject(HttpClient);

  public login(data: LoginIn): Observable<LoginOut> {
    return this.http.post<LoginOut>(LOGIN_URL, data);
  }
}
