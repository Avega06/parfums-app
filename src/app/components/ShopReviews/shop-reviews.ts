import {
  Component,
  inject,
  input,
  linkedSignal,
  resource,
  signal,
} from '@angular/core';
import { ShopComments } from '../../intefaces';
import { ShopService } from '../../services';
import { ThemeStore } from '../../core/services/ThemeStore';
import { AverageReviewScore } from '../../shared/components/reviews/average-review-score/average-review-score';
import { CustomReview } from '../../shared/components/reviews/custom-review/custom-review';

@Component({
  selector: 'shop-reviews',
  imports: [AverageReviewScore, CustomReview],
  templateUrl: './shop-reviews.html',
})
export class ShopReviews {
  shopService = inject(ShopService);

  readonly themeStore = inject(ThemeStore);
  protected readonly styles = this.themeStore.globalStyles;

  shopId = input.required<string>();

  isLoading = signal<boolean>(false);

  shopCommentsResource = resource({
    params: () => {
      const shopId = this.shopId();

      return shopId
        ? {
            shop_id: shopId,
          }
        : null;
    },
    loader: async ({ params }) => {
      return await this.shopService.getShopComments(params!.shop_id);
    },
  });

  reviews = linkedSignal<ShopComments[]>(() => {
    const resourceValue = this.shopCommentsResource.value();

    return resourceValue ?? [];
  });
}
