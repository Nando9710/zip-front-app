import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { USERS_URL } from '@constants/endpoints';
import { User } from '@interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http: HttpClient = inject(HttpClient);

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(USERS_URL);
  }
}
