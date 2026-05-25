import { inject, Injectable, resource, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProductsService } from '../../services/products.service';

@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  private productsService = inject(ProductsService);

  productQuery = signal<string>('');

  productNameResource = resource({
    params: this.productQuery,
    loader: async ({ params }) => {
      if (!params || params.trim().length === 0) {
        return null;
      }
      try {
        return await firstValueFrom(
          this.productsService.getProductLikeTerm(params),
        );
      } catch (err) {
        if (!(err instanceof Error)) {
          throw new Error(JSON.stringify(err));
        }
        throw err;
      }
    },
  });
}
