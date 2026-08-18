import {
  Component,
  effect,
  inject,
  input,
  linkedSignal,
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

  comments = signal<Review[]>([]);

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

  constructor() {
    effect(() => {
      if (this.comments().length === 0 && this.reviews().length > 0) {
        this.comments.set(this.reviews());
      }
    });
  }

  async submitReview() {
    if (this.reviewForm().invalid()) return;

    const { rating, comment } = this.reviewForm().value();
    this.isLoading.set(true);

    const newReview: Review = {
      author_name: 'Tú',
      rating: +rating,
      comment: comment,
      created_at: new Date(),
      isPublishing: true,
    };

    this.comments.update((current) => [newReview, ...current]);
    this.reviewForm().reset({ rating: '5', comment: '' });

    try {
      await this.commentOrcherstatorService.sendComment(this.option(), {
        id: this.id(),
        rating: +rating,
        comment: comment,
      });

      this.comments.update((current) =>
        current.map((item) =>
          item === newReview ? { ...item, isPublishing: false } : item,
        ),
      );
    } catch (error) {
      console.error('Error al guardar la reseña:', error);
      this.comments.update((current) =>
        current.filter((item) => item !== newReview),
      );
      alert('Hubo un error al publicar tu comentario.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
