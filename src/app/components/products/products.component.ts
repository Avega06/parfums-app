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
    class: 'row-start-2 col-start-2 col-span-5 flex flex-wrap gap-2 w-full',
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
