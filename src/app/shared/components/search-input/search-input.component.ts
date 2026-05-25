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
import { ThemeStore } from '../../../core/services/ThemeStore';

@Component({
  selector: 'search-input',
  imports: [],
  templateUrl: './search-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  themeStore = inject(ThemeStore);

  productService = inject(ProductsService);

  value = output<string>();

  searchValue = signal<string>('');

  debounceEffect = effect((onCleanup) => {
    const value = this.searchValue();
    const timeout = setTimeout(() => {
      this.value.emit(value);
    }, 500);

    onCleanup(() => {
      clearTimeout(timeout);
    });
  });
}
