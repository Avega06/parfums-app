// user.store.ts
import {
  Injectable,
  inject,
  signal,
  computed,
  resource,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseService } from '../services';
import { SSR_USER } from '../tokens'; // Define esto en un archivo de tokens
import { User, UserMetadata } from '@supabase/supabase-js';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private cookieService = inject(CookieService);
  private readonly supabase = inject(SupabaseService);
  private readonly platformId = inject(PLATFORM_ID);

  // Recibimos el usuario inyectado desde el server.ts
  private readonly ssrUser = inject(SSR_USER, { optional: true });

  // Signal principal iniciado con el valor de SSR
  readonly user = signal<any | null>(this.ssrUser);

  userMetadata = signal<UserMetadata>([]);

  userResource = resource({
    defaultValue: this.ssrUser,
    params: () => ({
      session: this.supabase.session(), // Necesitas actualizar este signal en SupabaseService
      isBrowser: isPlatformBrowser(this.platformId),
    }),
    loader: async ({ params }) => {
      if (!params.isBrowser) return this.ssrUser; // En servidor devolvemos lo que ya tenemos
      // En cliente, si no hay sesión activa en el SDK, devolvemos null
      if (!params.session) return null;

      console.log('logging de sesion');

      // Si hay sesión, pedimos el usuario actual al SDK para asegurar frescura
      return await this.supabase.getUser();
    },
  });

  setAvatar() {
    // Guardamos la cookie por 7 días, con path raíz y Secure
    this.cookieService.set(
      'user_avatar',
      this.userMetadata()['picture'],
      7,
      '/',
      '',
      true,
      'Lax',
    );
  }

  // Computed signals para el resto de la app
  currentUser = computed<User>(() => this.userResource.value() ?? this.user());
  session = computed(() => this.supabase.session());
  isAuthenticated = computed(() => !!this.session());

  userAvatar = computed<string | null>(() => {
    return this.cookieService.get('user_avatar');
  });

  isLoading = this.userResource.isLoading;
}
