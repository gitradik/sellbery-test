import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { stringifyQuery, SortDirection } from './utils'; 

export interface User {
  id: number;
  name: string;
  email: string;
  pass?: string;
}

export type UserSortBy = 'id' | 'name' | 'email';

export interface UserQuery {
  sortBy: UserSortBy;
  direction: SortDirection;
}

@Injectable()
export class UsersService {
  private url = environment.apiUrl;

  constructor(private client: HttpClient) { }

  fetchUsers(query?: UserQuery): Observable<User[]> {
    return this.client.get(this.url + 'users' + stringifyQuery(query)) as Observable<User[]>;
  }

  removeUser(id: number): Observable<{ id: number, result: boolean }> {
    return this.client.delete(this.url + 'users/' + id) as Observable<{ id: number, result: boolean }>;
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.client.post(this.url + 'users', user) as Observable<User>;
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.client.put(this.url + 'users/' + id, user) as Observable<User>;
  }
}
