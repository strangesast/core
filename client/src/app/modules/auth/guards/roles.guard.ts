import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';

import { UserService } from '../../../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class RolesGuard implements CanActivate {
  constructor(public userService: UserService, public router: Router) {}

  canActivate(next: ActivatedRouteSnapshot) {
    return this.userService.user$.pipe(
      map((user) => {
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }
        if (next.data?.roles.length === 0) {
          return true;
        }
        if (
          !next.data.roles.some((role) => this.userService.hasRole(user, role))
        ) {
          this.router.navigate(['/forbidden']);
          return false;
        }
        return true;
      })
    );
  }
}
