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
import { isPlatformBrowser } from '@angular/common';
import { SearchList } from '../searchList/searchList';
import { UserStore } from '../../stores';
import { UserDropdown, UserAvatar } from '../auth';

@Component({
  selector: 'navbar',
  imports: [
    ThemeControllerComponent,
    SearchInputComponent,
    RouterLink,
    SearchList,
    UserDropdown,
    UserAvatar,
  ],
  templateUrl: './Navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  #platformId = inject(PLATFORM_ID);
  productsListService = inject(ProductsService);
  userStore = inject(UserStore);

  theme = signal<string>('');
  productQuery = signal<string>('');

  showResults = computed(() => this.productQuery().trim().length > 0);

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.width.set(window.screen.width);
    }
  }
  isBrowser = computed(() => {
    return isPlatformBrowser(this.#platformId);
  });

  width = signal(0);

  ce = effect(() => {
    // Combinando ambas soluciones
  });

  productNameResource = resource({
    params: this.productQuery,
    loader: async ({ params }) => {
      if (!params || params.trim().length === 0) {
        return null;
      }
      try {
        return await firstValueFrom(
          this.productsListService.getProductLikeTerm(params),
        );
      } catch (err) {
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
