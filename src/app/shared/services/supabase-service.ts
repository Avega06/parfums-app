import { inject, Service, PLATFORM_ID, signal } from '@angular/core';
import {
  AuthChangeEvent,
  Session,
  SupabaseClient,
  type User,
} from '@supabase/supabase-js';
import { injectSupabase } from '../../supabase.config';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Service()
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  private readonly _session = signal<Session | null>(null);
  readonly session = this._session.asReadonly();

  constructor() {
    this.supabase = injectSupabase();

    if (isPlatformBrowser(this.platformId)) {
      this.supabase.auth.onAuthStateChange((event, session) => {
        // Actualizamos la señal inmediatamente con el estado de las cookies/sesión
        this._session.set(session);

        // Control de flujos globales de navegación
        if (event === 'SIGNED_OUT') {
          // En lugar de recargar la página completa, usa el router de Angular
          this.router.navigate(['/login']);
        }
      });
    }
  }

  // getSesion() {
  //   return this.supabase.auth.getSession().then(({ data }) => {
  //     this.sesion.set(data.session);
  //   });
  // }

  async signUp(email: string, pass: string, metadata: any) {
    return await this.supabase.auth.signUp({
      email,
      password: pass,
      options: { data: metadata },
    });
  }

  async login(email: string, pass: string) {
    return await this.supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
  }

  async getUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      return null;
    }
    return data.user;
  }

  async profile(user: User) {
    return await this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single();
  }

  async loginWithProvider(provider: 'google' | 'facebook' | 'x') {
    return await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo:
          environment.supabaseCallback.length >= 1
            ? environment.supabaseCallback
            : 'http://localhost:4200/parfums/1',
      },
    });
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void,
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  async getToken() {
    const { data, error } = await this.supabase.auth.getSession();

    if (data.session) {
      return data.session;
    }

    return null;
  }

  signOut() {
    return this.supabase.auth.signOut();
  }
}
