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
import { RouterLink } from '@angular/router';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { UserStore } from '../../stores';
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
}
