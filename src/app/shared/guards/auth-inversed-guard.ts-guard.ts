import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { SupabaseService } from '../services';

export const authInversedGuard: CanActivateFn = async (route, state) => {
  const userStore = inject(SupabaseService);
  const router = inject(Router);

  const sesion = await userStore.getToken();

  if (sesion) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
