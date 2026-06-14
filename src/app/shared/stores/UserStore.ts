import {
  Injectable,
  inject,
  signal,
  computed,
  resource,
  PLATFORM_ID,
  effect,
  Service,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseService } from '../services';
import { SSR_USER } from '../tokens';
import { User } from '@supabase/supabase-js';
import { CookieService } from 'ngx-cookie-service';

@Service()
export class UserStore {
  private readonly cookieService = inject(CookieService);
  private readonly supabase = inject(SupabaseService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ssrUser = inject(SSR_USER, { optional: true });

  readonly userResource = resource({
    defaultValue: this.ssrUser,
    params: () => ({
      session: this.supabase.session(), // 👈 Ahora escucha la señal global del servicio
      isBrowser: isPlatformBrowser(this.platformId),
    }),
    loader: async ({ params }) => {
      if (!params.isBrowser) return this.ssrUser;
      if (!params.session) return null;
      return await this.supabase.getUser();
    },
  });

  // Computed signals limpias y reactivas
  readonly currentUser = computed<User | null>(() => this.userResource.value());
  readonly session = computed(() => this.supabase.session());
  readonly isAuthenticated = computed(() => !!this.session());

  readonly userMetadata = computed(
    () => this.currentUser()?.user_metadata ?? {},
  );
  readonly userAvatar = computed<string | null>(() =>
    this.cookieService.get('user_avatar'),
  );
  readonly isLoading = this.userResource.isLoading;

  constructor() {
    // 3. Efecto reactivo: Se dispara automáticamente cada vez que userMetadata cambie de valor
    effect(() => {
      const metadata = this.userMetadata();
      const isBrowser = isPlatformBrowser(this.platformId);

      if (isBrowser && metadata && metadata['picture']) {
        // Setea el avatar automáticamente sin invocar métodos desde el Layout
        this.cookieService.set(
          'user_avatar',
          metadata['picture'],
          7,
          '/',
          '',
          true,
          'Lax',
        );
      }
    });
  }
}
