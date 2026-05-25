import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  PLATFORM_ID,
  resource,
  signal,
} from '@angular/core';
import { ThemeControllerComponent } from '../theme-controller/ThemeController.component';
import { SearchInputComponent } from '../search-input/search-input.component';
import { ProductsService } from '../../../services/products.service';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { SearchList } from '../searchList/searchList';
import { ProductStore, UserStore } from '../../stores';
import { UserDropdown, UserAvatar } from '../auth';
import { ThemeStore } from '../../../core/services/ThemeStore';
import { ProductsFinder } from '../../../components/ProductsFinder/ProductsFinder';

@Component({
  selector: 'navbar',
  imports: [
    ThemeControllerComponent,
    RouterLink,
    UserDropdown,
    UserAvatar,
    NgOptimizedImage,
    ProductsFinder,
  ],
  templateUrl: './Navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  #platformId = inject(PLATFORM_ID);

  userStore = inject(UserStore);
  themeStore = inject(ThemeStore);

  theme = signal<string>('');

  width = signal(0);

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.width.set(window.screen.width);
    }
  }

  // productNameResource = resource({
  //   params: this.productQuery,
  //   loader: async ({ params }) => {
  //     if (!params || params.trim().length === 0) {
  //       return null;
  //     }
  //     try {
  //       return await firstValueFrom(
  //         this.productsListService.getProductLikeTerm(params),
  //       );
  //     } catch (err) {
  //       if (!(err instanceof Error)) {
  //         throw new Error(JSON.stringify(err));
  //       }
  //       throw err;
  //     }
  //   },
  // });

  setTheme(theme: string) {
    this.theme.set(theme);
  }

  isBrowser = computed(() => {
    return isPlatformBrowser(this.#platformId);
  });

  logoSrc = computed(() => {
    return this.themeStore.theme() === 'chadmax'
      ? '/logo-dark-transparent.png' // Si está oscuro, muestra el logo claro
      : '/logo-light-transparent.png'; // Si está claro, muestra el logo oscuro
  });
}
