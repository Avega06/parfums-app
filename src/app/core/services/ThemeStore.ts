import { Injectable, PLATFORM_ID, inject, signal, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'coffee' | 'chadmax';

@Injectable({ providedIn: 'root' })
export class ThemeStore {
  #platformId = inject(PLATFORM_ID);
  #isBrowser = isPlatformBrowser(this.#platformId);

  private readonly _theme = signal<Theme>('light');
  readonly theme = this._theme.asReadonly();

  constructor() {
    if (!this.#isBrowser) return;

    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      this._theme.set(stored);
    }

    effect(() => {
      const theme = this._theme();

      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);
  }

  toggle(): void {
    this._theme.set(this._theme() === 'chadmax' ? 'light' : 'chadmax');
  }
}
