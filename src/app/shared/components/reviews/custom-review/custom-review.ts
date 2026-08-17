import {
  Component,
  inject,
  input,
  linkedSignal,
  Resource,
  signal,
} from '@angular/core';
import { ThemeStore } from '../../../../core/services/ThemeStore';
import {
  form,
  required,
  minLength,
  FormField,
  FormRoot,
} from '@angular/forms/signals';
import { CustomReview as Review } from '../../../interfaces';
import { DatePipe } from '@angular/common';
import { CommentOrchestrator } from '../../../services';

interface ReviewModel {
  rating: string;
  comment: string;
}

@Component({
  selector: 'custom-review',
  imports: [FormRoot, FormField, DatePipe],
  templateUrl: './custom-review.html',
})
export class CustomReview {
  themeStore = inject(ThemeStore);
  readonly styles = this.themeStore.globalStyles;

  private commentOrcherstatorService = inject(CommentOrchestrator);

  reviews = input.required<Review[]>();

  option = input.required<'product' | 'shop'>();
  id = input.required<string>();

  comments = linkedSignal<Review[]>(() => {
    return this.reviews();
  });

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

  async submitReview() {
    if (this.reviewForm().invalid()) return;

    const { rating, comment } = this.reviewForm().value();
    this.isLoading.set(true);

    try {
      const response = await this.commentOrcherstatorService.sendComment(
        this.option(),
        {
          id: this.id(),
          rating: +rating,
          comment: comment,
        },
      );
      // 2. Construimos el objeto con la respuesta real del servidor
      const newReview: Review = {
        author_name: 'Tú', // Puedes extraerlo de tu UserStore/Auth
        rating: response.data.rating,
        comment: response.data.comment,
        created_at: new Date(response.data.created_at),
      };

      // 3. Actualizamos el linkedSignal. ¡Esto es totalmente válido ahora!
      this.comments.update((current) => [newReview, ...current]);

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
