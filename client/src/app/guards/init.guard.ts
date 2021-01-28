import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { tap, catchError, exhaustMap, map } from 'rxjs/operators';

import { UserService } from '../services/user.service';
/*
import { User } from '../util/models';
*/
import { init, login } from '../actions/user.actions';

/*
interface UserResponsePayload {
  user: User;
}
*/

@Injectable({
  providedIn: 'root',
})
export class InitGuard implements CanActivate {
  constructor(
    public userService: UserService,
    public http: HttpClient,
    public store: Store<any>
  ) {}

  canActivate() {
    return this.store.pipe(
      select('user', 'init'),
      exhaustMap((isInitialized) => {
        if (isInitialized) {
          return of(isInitialized);
        }
        const token = localStorage.getItem('token');

        let user;
        try {
          user = JSON.parse(localStorage.getItem('user'));
        } catch (e) {
          user = null;
        }

        if (!token || !user) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.store.dispatch(init());
          return of(true);
        }
        return this.userService.getUser(user.id).pipe(
          map((fullUser) => {
            this.store.dispatch(login({ token, user: fullUser }));
            return true;
          }),
          catchError((_) => {
            this.userService.reset();
            return of(true);
          }),
          tap(() => this.store.dispatch(init()))
        );
      })
    ) as any;
  }
}
