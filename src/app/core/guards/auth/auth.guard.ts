import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { User } from '@interfaces/user';
import { AuthService } from '@services/auth/auth.service';
import { LoggedInUserService } from '@services/logged-in-user/logged-in-user.service';

export const authGuard: CanActivateFn = () => {
  const loggedInUserService = inject(LoggedInUserService);
  const authService = inject(AuthService);

  const loggedInUser: User = loggedInUserService.getLoggedInUser();
  const token: string = loggedInUserService.getTokenOfUser();

  if (!loggedInUser && !token) {
    authService.logout();
    return false;
  } else {
    return true;
  }
};
