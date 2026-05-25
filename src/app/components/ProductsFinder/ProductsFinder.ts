import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ProductStore } from '../../shared/stores';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { SearchList } from '../../shared/components/searchList/searchList';

@Component({
  selector: 'products-finder',
  imports: [SearchInputComponent, SearchList],
  templateUrl: './ProductsFinder.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsFinder {
  public productsStore = inject(ProductStore);

  productFound = computed(() => {
    const productResource = this.productsStore.productNameResource;
    if (productResource.hasValue()) return productResource.value()?.products!;

    return [];
  });

  showResults = computed(
    () => this.productsStore.productQuery().trim().length > 0,
  );
}
