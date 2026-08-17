import { Component, inject, linkedSignal, signal } from '@angular/core';
import { ThemeStore } from '../../core/services/ThemeStore';
import { ProductStore } from '../../stores';
import { ProductComments } from '../../intefaces';
import { AverageReviewScore } from '../../shared/components/reviews/average-review-score/average-review-score';
import { CustomReview } from '../../shared/components/reviews/custom-review/custom-review';

@Component({
  selector: 'product-reviews',
  imports: [AverageReviewScore, CustomReview],
  templateUrl: './product-reviews.html',
  host: {
    class: 'lg:col-span-12 flex flex-col gap-6',
  },
})
export class ProductReviews {
  public themeStore = inject(ThemeStore);
  public productStore = inject(ProductStore);

  readonly styles = this.themeStore.globalStyles;

  reviews = linkedSignal<ProductComments[]>(() => {
    const resourceValue = this.productStore.productReviewsResource.value();

    return resourceValue ?? [];
  });

  isLoading = signal<boolean>(false);
}
