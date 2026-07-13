import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { ProductsFavorites } from '../../../services';

@Component({
  selector: 'user-buttons',
  imports: [],
  templateUrl: './user-buttons.html',
  host: {
    class: 'flex justify-center gap-4 mt-8',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserButtons {
  productFavorites = inject(ProductsFavorites);

  isFavorite = signal(false);
  isLoading = signal(false);
  isSubscribed = signal(false);

  productId = input.required<string>();

  favoritesEffect = effect(async () => {
    if (this.productId()) {
      this.isLoading.set(true);
      try {
        const data = await this.productFavorites.checkProductFavorite(
          this.productId(),
        );

        if (data) {
          this.isFavorite.set(data);
        } else {
          this.isFavorite.set(false);
        }
      } catch (error) {
        console.error('Error al obtener el estado de favorito:', error);
      } finally {
        this.isLoading.set(false);
      }
    }
  });

  async toggleFavorite() {
    this.isLoading.set(true);
    try {
      const data = await this.productFavorites.toggleFavorite(this.productId());

      this.isFavorite.set(data!);
    } catch (error) {
      console.error('Error al cambiar estado de favorito:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
