import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LOGIN_URL } from '@constants/endpoints';
import { LoginIn, LoginOut } from '@interfaces/auth';
import { LoggedInUserService } from '@services/logged-in-user/logged-in-user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Injections
   */
  private readonly http: HttpClient = inject(HttpClient);
  private readonly _loggedInUserService: LoggedInUserService = inject(LoggedInUserService);
  private readonly _router: Router = inject(Router);

  public login(data: LoginIn): Observable<LoginOut> {
    return this.http.post<LoginOut>(LOGIN_URL, data);
  }

  public logout(): void {
    this._loggedInUserService.removeUserCookies();
    this._router.navigate(['authentication']);
  }
}
