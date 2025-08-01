import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ROLE_MANAGER } from '../enum/role';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private readonly userService: UserService,
  ) { }

  canActivate(): Observable<boolean> {
    return this.userService.getUser().pipe(
      map(user => {
        if (user.role === ROLE_MANAGER.Admin) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}