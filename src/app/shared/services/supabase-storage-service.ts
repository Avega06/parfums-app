import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { REQUEST } from '../tokens';

@Injectable({ providedIn: 'root' })
export class SupabaseStorageService {
  private readonly cookieService = inject(CookieService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly request = inject(REQUEST, { optional: true }) as any;

  getItem(key: string): string | null {
    if (isPlatformServer(this.platformId)) {
      const cookieHeader = this.request?.headers?.cookie || '';
      const match = cookieHeader.match(new RegExp(`(^| )${key}=([^;]+)`));
      return match ? decodeURIComponent(match[2]) : null;
    }
    return this.cookieService.get(key) || null;
  }

  setItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cookieService.set(key, value, {
        path: '/',
        secure: false,
        sameSite: 'Lax',
        expires: 7,
      });
    }
  }

  removeItem(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.cookieService.delete(key, '/');
    }
  }
}
