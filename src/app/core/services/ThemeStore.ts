import {
  Injectable,
  PLATFORM_ID,
  inject,
  signal,
  effect,
  computed,
  DOCUMENT,
  REQUEST,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GlobalStyle } from '../../intefaces';

export type Theme = 'light' | 'coffee' | 'chadmax';

@Injectable({ providedIn: 'root' })
export class ThemeStore {
  readonly #platformId = inject(PLATFORM_ID);
  readonly #isBrowser = isPlatformBrowser(this.#platformId);
  readonly #document = inject(DOCUMENT);
  readonly #request = inject(REQUEST, { optional: true });

  private readonly _theme = signal<Theme>(this.#getInitialTheme());
  readonly theme = this._theme.asReadonly();

  constructor() {
    // APLICACIÓN INMEDIATA (Funciona tanto en Node.js/SSR como en el Navegador)
    this.#applyThemeToDocument(this.theme());

    if (!this.#isBrowser) return;

    // Reacción a cambios de estado únicamente en el cliente
    effect(async () => {
      const currentTheme = this.theme();
      this.#applyThemeToDocument(currentTheme);

      if ('cookieStore' in window) {
        await cookieStore.set({
          name: 'theme',
          value: currentTheme,
          path: '/',
          expires: Date.now() + 31536000000,
          sameSite: 'lax',
        });
      }
    });
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);
  }

  toggle(): void {
    this._theme.set(this._theme() === 'chadmax' ? 'light' : 'chadmax');
  }

  logoSrc = computed(() => {
    return this.theme() === 'chadmax'
      ? '/logo-dark-transparent-v2.png'
      : '/logo-light-transparent-v2.png';
  });

  globalStyles = computed<GlobalStyle>(() => {
    return this.theme() === 'chadmax'
      ? {
          card_bg: '#1a1a1a',
          btn_bg: 'bg-base-300',
          card_text_opacity: '',
        }
      : {
          card_bg: '',
          btn_bg: '',
          card_text_opacity: '',
        };
  });

  #getInitialTheme(): Theme {
    let cookieString = '';

    if (this.#isBrowser) {
      cookieString = this.#document.cookie || '';
    } else if (this.#request) {
      cookieString = this.#request.headers.get('cookie') || '';
    }

    const match = cookieString.match(/theme=(light|coffee|chadmax)/);
    return (match?.[1] as Theme) ?? 'light';
  }

  #applyThemeToDocument(theme: Theme): void {
    this.#document.documentElement.setAttribute('data-theme', theme);
  }
}
