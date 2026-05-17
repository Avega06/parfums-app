import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { type ProductItem } from '../../../intefaces';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'search-list',
  templateUrl: './searchList.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchList {
  products = input.required<ProductItem[]>();

  router = inject(Router);

  encodedProducts = computed(() =>
    this.products().map((product) => ({
      ...product,
      encodedName: encodeURIComponent(product.name),
    })),
  );

  goToProduct(name: string) {
    console.log('Navegando a:', name);
    this.router.navigate(['/product', name]);
  }
}
