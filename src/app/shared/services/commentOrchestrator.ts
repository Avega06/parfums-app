import { inject, Service } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ShopService } from '../../services';

interface ReviewSchema {
  id: string;
  rating: number;
  comment: string;
}

@Service()
export class CommentOrchestrator {
  private productsService = inject(ProductsService);
  private shopService = inject(ShopService);

  async sendComment(type: 'product' | 'shop', review: ReviewSchema) {
    if (type === 'product') {
      return await this.productsService.insertProductReviews(
        review.id!,
        review.rating,
        review.comment,
      );
    }
    return await this.shopService.insertShopComment(
      review.id!,
      review.rating,
      review.comment,
    );
  }
}
