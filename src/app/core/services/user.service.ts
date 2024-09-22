import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { USERS_URL, USERS_URL_ID } from '@constants/endpoints';
import { CreateUser, EditUser, User } from '@interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http: HttpClient = inject(HttpClient);

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(USERS_URL);
  }

  public createUser(data: CreateUser): Observable<User> {
    return this.http.post<User>(USERS_URL, data);
  }

  public editUser(data: EditUser, id: string): Observable<User> {
    const URL = USERS_URL_ID.replace(':id', id);

    return this.http.patch<User>(URL, data);
  }

  public deleteUser(id: string): Observable<User[]> {
    const URL = USERS_URL_ID.replace(':id', id);
    return this.http.delete<User[]>(URL);
  }
}
