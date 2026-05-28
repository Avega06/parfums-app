import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  afterNextRender,
} from '@angular/core';
import { type ProductItem } from '../../../intefaces';
import { Router } from '@angular/router';

@Component({
  selector: 'search-list',
  templateUrl: './searchList.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchList {
  products = input.required<ProductItem[]>();
  router = inject(Router);

  // Señal para controlar si debemos aplicar el comportamiento del drawer
  isMobile = signal(false);

  encodedProducts = computed(() =>
    this.products().map((product) => ({
      ...product,
      encodedName: encodeURIComponent(product.name),
    })),
  );

  constructor() {
    afterNextRender(() => {
      const mediaQuery = window.matchMedia('(max-width: 1023px)');

      this.isMobile.set(mediaQuery.matches);

      mediaQuery.addEventListener('change', (e) => {
        this.isMobile.set(e.matches);
      });
    });
  }

  goToProduct(name: string) {
    console.log('Navegando a:', name);
    this.router.navigate(['/product', name]);
  }
}
