import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import { ThemeControllerComponent } from '../theme-controller/ThemeController.component';
import { SearchInputComponent } from '../search-input/search-input.component';
import { ProductsService } from '../../../services/products.service';
import { input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'navbar',
  imports: [ThemeControllerComponent, SearchInputComponent, RouterLink],
  templateUrl: './Navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  theme = signal<string>('');
  productQuery = signal<string>('');
  productsListService = inject(ProductsService);

  productNameResource = resource({
    request: () => ({ query: this.productQuery()! }),
    loader: async ({ request }) => {
      return firstValueFrom(
        this.productsListService.getProductLikeTerm(request.query!)
      );
    },
  });

  ce = effect(() => {
    console.log('result of search:', this.productNameResource.value());
  });

  setTheme(theme: string) {
    this.theme.set(theme);
  }
}
