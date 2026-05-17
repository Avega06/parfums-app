import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  resource,
} from '@angular/core';
import { Product } from '../../intefaces/products-response.interface';
import { ProductCardsComponent } from '../product-cards/product-cards.component';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { firstValueFrom } from 'rxjs';
import { SkeletonViewComponent } from '../../shared/components';
import { FilterState } from '../../intefaces';

@Component({
  selector: 'products',
  imports: [ProductCardsComponent, RouterLink, SkeletonViewComponent],
  templateUrl: './products.component.html',
  host: {
    class: 'flex flex-wrap gap-10  justify-center w-full ',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {
  productsService = inject(ProductsService);

  currentPage = input.required<string>();
  activeFilters = input<FilterState>();

  selectedProduct(product: Product) {
    this.productsService.product.set(product);
  }

  products = computed<Product[]>(() => {
    const resourceValue = this.parfumsResource.value();

    if (!resourceValue || !resourceValue.result) {
      return [];
    }

    return resourceValue.result.result as Product[];
  });

  paginationEffect = effect(() => {
    if (this.parfumsResource.hasValue()) {
      const allPages = this.parfumsResource.value().result.pages;
      this.productsService.totalPages.set(allPages);
    }
  });

  parfumsResource = resource({
    params: () => ({
      page: this.currentPage()!,
      filters: this.activeFilters(),
    }),
    loader: async ({ params }) => {
      return firstValueFrom(
        this.productsService.getProducts(params.page!, params.filters),
      );
    },
  });
}
