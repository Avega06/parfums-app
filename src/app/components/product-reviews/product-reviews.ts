import { Component, inject, linkedSignal, signal } from '@angular/core';
import { ThemeStore } from '../../core/services/ThemeStore';
import { ProductStore } from '../../stores';
import { form, required, minLength } from '@angular/forms/signals';
import { ProductComments } from '../../intefaces';
import { ProductsService } from '../../services/products.service';
import { AverageReviewScore } from '../../shared/components/reviews/average-review-score/average-review-score';
import { CustomReview } from '../../shared/components/reviews/custom-review/custom-review';

interface ReviewModel {
  rating: string;
  comment: string;
}

@Component({
  selector: 'product-reviews',
  imports: [AverageReviewScore, CustomReview],
  templateUrl: './product-reviews.html',
  host: {
    class: 'lg:col-span-12 flex flex-col gap-6',
  },
})
export class ProductReviews {
  private productsService = inject(ProductsService);

  public themeStore = inject(ThemeStore);
  public productStore = inject(ProductStore);

  readonly styles = this.themeStore.globalStyles;

  reviews = linkedSignal<ProductComments[]>(() => {
    const resourceValue = this.productStore.productReviewsResource.value();

    return resourceValue ?? [];
  });

  isLoading = signal<boolean>(false);
}
