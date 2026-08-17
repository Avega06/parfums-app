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
import { form, required, minLength } from '@angular/forms/signals';
import { ThemeStore } from '../../core/services/ThemeStore';
import { AverageReviewScore } from '../../shared/components/reviews/average-review-score/average-review-score';
import { CustomReview } from '../../shared/components/reviews/custom-review/custom-review';

interface ReviewModel {
  rating: string;
  comment: string;
}

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

  reviewModel = signal<ReviewModel>({
    rating: '5',
    comment: '',
  });

  reviewForm = form(this.reviewModel, (schemaPath) => {
    required(schemaPath.rating);
    required(schemaPath.comment);

    minLength(schemaPath.comment, 3);
  });

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

  async submitReview() {
    if (this.reviewForm().invalid()) return;

    const { rating, comment } = this.reviewForm().value();
    this.isLoading.set(true);

    try {
      // 1. Insertamos en Supabase mediante la Edge Function
      const response = await this.shopService.insertShopComment(
        this.shopId(),
        +rating,
        comment,
      );

      console.log(response);
      // 2. Construimos el objeto con la respuesta real del servidor
      const newReview: ShopComments = {
        author_name: 'Tú', // Puedes extraerlo de tu UserStore/Auth
        rating: response.data.rating,
        comment: response.data.comment,
        created_at: new Date(response.data.created_at),
      };

      // 3. Actualizamos el linkedSignal. ¡Esto es totalmente válido ahora!
      this.reviews.update((current) => [newReview, ...current]);

      // 4. Reseteamos el formulario
      this.reviewForm().reset({ rating: '5', comment: '' });
    } catch (error) {
      console.error('Error al guardar la reseña:', error);
      alert('Hubo un error al publicar tu comentario. Inténtalo de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
