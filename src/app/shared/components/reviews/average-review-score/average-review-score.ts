import { Component, computed, inject, input } from '@angular/core';
import { CustomReview } from '../../../interfaces';
import { ThemeStore } from '../../../../core/services/ThemeStore';

@Component({
  selector: 'average-review-score',
  imports: [],
  templateUrl: './average-review-score.html',
})
export class AverageReviewScore {
  themeStore = inject(ThemeStore);
  readonly styles = this.themeStore.globalStyles;

  type = input.required<'product' | 'shop'>();
  reviews = input.required<CustomReview[]>();

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
