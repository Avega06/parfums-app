import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  type User,
} from '@supabase/supabase-js';
import { SupabaseStorageService } from './supabase-storage-service';
import { injectSupabase } from '../../supabase.config';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  private storageCustom = inject(SupabaseStorageService);

  session = signal<AuthSession | null>(null);

  constructor() {
    this.supabase = injectSupabase();
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
