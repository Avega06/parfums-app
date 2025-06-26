import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  output,
  signal,
} from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { on } from 'node:events';

@Component({
  selector: 'search-input',
  imports: [],
  templateUrl: './search-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  productService = inject(ProductsService);
  value = output<string>();

  searchValue = signal<string>('');

  debounceEffect = effect((onCleanup) => {
    const value = this.searchValue();
    const timeout = setTimeout(() => {
      this.value.emit(value);
    }, 500);

    console.log(value);

    onCleanup(() => {
      clearTimeout(timeout);
    });
  });

  // updateValue(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   this.value.emit(input.value);
  //   //this.productService.searchValue.set(input.value);
  // }
}
