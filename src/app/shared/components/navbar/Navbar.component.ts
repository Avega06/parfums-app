import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  PLATFORM_ID,
  resource,
  signal,
} from '@angular/core';
import { ThemeControllerComponent } from '../theme-controller/ThemeController.component';
import { SearchInputComponent } from '../search-input/search-input.component';
import { ProductsService } from '../../../services/products.service';
import { input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'navbar',
  imports: [ThemeControllerComponent, SearchInputComponent, RouterLink],
  templateUrl: './Navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  #platformId = inject(PLATFORM_ID);
  productsListService = inject(ProductsService);
  theme = signal<string>('');
  productQuery = signal<string>('');

  isBrowser = computed(() => {
    return isPlatformBrowser(this.#platformId);
  });

  width = computed(() => {
    if (!this.isBrowser) return;
    return window.screen.width;
  });

  ce = effect(() => {
    console.log(this.width());
  });
  productNameResource = resource({
    params: this.productQuery,
    loader: async ({ params }) => {
      if (!params || params.trim().length === 0) {
        return null; // o null, o lo que tenga sentido
      }
      try {
        return await firstValueFrom(
          this.productsListService.getProductLikeTerm(params)
        );
      } catch (err) {
        // Si err no es Error, conviértelo:
        if (!(err instanceof Error)) {
          throw new Error(JSON.stringify(err));
        }
        throw err;
      }
    },
  });

  setTheme(theme: string) {
    this.theme.set(theme);
  }
}
