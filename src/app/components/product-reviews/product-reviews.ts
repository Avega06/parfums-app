import { Component, computed, inject, linkedSignal } from '@angular/core';
import { ThemeStore } from '../../core/services/ThemeStore';

@Component({
  selector: 'product-reviews',
  imports: [],
  templateUrl: './product-reviews.html',
  host: {
    class: 'lg:col-span-12 flex flex-col gap-6',
  },
})
export class ProductReviews {
  public themeStore = inject(ThemeStore);

  readonly styles = this.themeStore.globalStyles;

  reviews = linkedSignal<any[]>(() => ['review1']);

  averageRating = computed(() => {
    const currentReviews = this.reviews();
    if (currentReviews.length === 0) return 0;

    const sum = currentReviews.reduce((acc, item) => acc + item.rating, 0);
    return Math.round((sum / currentReviews.length) * 10) / 10;
  });

  averageRatingRounded = computed(() => {
    return Math.round(this.averageRating());
  });
}
