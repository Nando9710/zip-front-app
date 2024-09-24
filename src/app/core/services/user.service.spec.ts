import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreateUser, EditUser, User } from '@interfaces/user';
import { USERS_URL, USERS_URL_ID } from '@constants/endpoints';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        UserService
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all users', () => {
    const dummyUsers: User[] = [
      { id: '1', name: 'User1', email: 'user1@example.com' },
      { id: '2', name: 'User2', email: 'user2@example.com' }
    ];

    service.getUsers().subscribe({
      next: users => {
        expect(users.length).toBe(2);
        expect(users).toEqual(dummyUsers);
      }
    });

    const req = httpMock.expectOne(USERS_URL);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should create a user', () => {
    const newUser: CreateUser = { name: 'User3', lastName: 'test', email: 'user3@example.com', password: 'User123*' };
    const createdUser: User = { id: '3', name: 'User3', lastName: 'test', email: 'user3@example.com' };

    service.createUser(newUser).subscribe({
      next: user => {
        expect(user).toEqual(createdUser);
      }
    });

    const req = httpMock.expectOne(USERS_URL);
    expect(req.request.method).toBe('POST');
    req.flush(createdUser);
  });

  it('should edit a user', () => {
    const updatedUser: EditUser = { name: 'User1-Updated', email: 'user1updated@example.com' };
    const editedUser: User = { id: '1', name: 'User1-Updated', email: 'user1updated@example.com' };
    const id = '1';
    const url = USERS_URL_ID.replace(':id', id);

    service.editUser(updatedUser, id).subscribe({
      next: user => {
        expect(user).toEqual(editedUser);
      }
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
    req.flush(editedUser);
  });

  it('should delete a user', () => {
    const dummyUsers: User[] = [
      { id: '2', name: 'User2', email: 'user2@example.com' }
    ];
    const id = '1';
    const url = USERS_URL_ID.replace(':id', id);

    service.deleteUser(id).subscribe({
      next: users => {
        expect(users).toEqual(dummyUsers);
      }
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyUsers);
  });
});
