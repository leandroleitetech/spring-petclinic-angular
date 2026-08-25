import {inject} from '@angular/core';
import {CanActivateFn, Route, Router, Routes} from '@angular/router';
import {AuthService} from './auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login'], {queryParams: {redirectTo: state.url}});
};

/** Applies {@link authGuard} to every given route (and, by inheritance, to its children). */
export const guarded = (routes: Routes): Routes =>
  routes.map((route: Route) => ({...route, canActivate: [authGuard]}));
