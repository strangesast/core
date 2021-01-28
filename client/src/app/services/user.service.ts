import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { from, Observable } from 'rxjs';
import { exhaustMap, pluck, tap } from 'rxjs/operators';
import { Apollo, gql } from 'apollo-angular';
import {
  UserLoginPayload,
  UserLoginResult,
  UserCreatePayload,
  User,
} from '../util/models';

import { logout, login } from '../actions/user.actions';

const ONE_USER_QUERY = gql`
  query($id: Int!) {
    users_by_pk(id: $id) {
      color
      email
      id
      username
      user_roles {
        role {
          id
          description
          name
        }
      }
      employees(limit: 1, where: { user_id: { _eq: $id } }) {
        id
        first_name
        last_name
        middle_name
        code
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$ = this.store.pipe(select('user'), pluck('user'));

  constructor(
    public apollo: Apollo,
    public http: HttpClient,
    public store: Store<any>
  ) {}

  login(payload: UserLoginPayload) {
    return this.http.post<UserLoginResult>('/api/login', payload).pipe(
      exhaustMap(({ token, user }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return from(this.apollo.client.resetStore()).pipe(
          exhaustMap(() =>
            this.getUser(user.id).pipe(
              tap((fullUser) => {
                this.store.dispatch(login({ user: fullUser, token }));
                return fullUser;
              })
            )
          )
        );
      })
    );
  }

  getUser(userId: number): Observable<User> {
    return this.apollo
      .query({ query: ONE_USER_QUERY, variables: { id: userId } })
      .pipe(pluck('data', 'users_by_pk'));
  }

  reset() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.apollo.client.resetStore();
  }

  logout() {
    this.store.dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  create(payload: UserCreatePayload) {
    return this.http
      .post<UserLoginResult>('/api/user', payload)
      .pipe(
        tap(({ token, user }) => this.store.dispatch(login({ user, token })))
      );
  }

  hasRole(user: User, roleId: string) {
    return user.user_roles.some(({ role }) => role.id === roleId);
  }
}
