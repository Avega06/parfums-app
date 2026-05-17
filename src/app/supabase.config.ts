// src/app/supabase.config.ts
import {
  createServerClient,
  createBrowserClient,
  CookieOptions,
} from '@supabase/ssr';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { environment } from '../environments/environment.development';

// Definimos el tipo de nuestras cookies
export interface CookieMap {
  [key: string]: string | undefined;
}

// Creamos el token tipado
export const REQUEST_COOKIES_MAP = new InjectionToken<CookieMap>(
  'REQUEST_COOKIES_MAP',
);

export const injectSupabase = () => {
  const platformId = inject(PLATFORM_ID);
  const url = environment.supabaseUrl;
  const key = environment.supabaseKey;

  if (isPlatformServer(platformId)) {
    // Lógica para el Servidor (SSR)
    // Aquí es donde Node.js maneja las cookies

    const allCookies = inject(REQUEST_COOKIES_MAP, { optional: true }) || {};
    return createServerClient(url, key, {
      cookies: {
        get(name: string) {
          // Aquí integrarías con el REQUEST de Express/Node
          return allCookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          // Lógica para setear en la respuesta del servidor
        },
        remove(name: string, options: CookieOptions) {
          // Lógica para borrar
        },
      },
    });
  }

  return createBrowserClient(url, key);
};
