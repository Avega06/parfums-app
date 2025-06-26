import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Product } from '../../intefaces/products-response.interface';
import { ProductCardsComponent } from '../product-cards/product-cards.component';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'products',
  imports: [ProductCardsComponent, RouterLink],
  templateUrl: './products.component.html',
  host: {
    class:
      'tablet:flex tablet:flex-wrap  basis-128 gap-4 w-full justify-center',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {
  details = input.required<Product[]>();

  productsService = inject(ProductsService);

  selectedProduct(product: Product) {
    this.productsService.product.set(product);
  }
}
