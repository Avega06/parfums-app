import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  resource,
  signal,
  viewChild,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { ShopService } from '../../services/shops.service';
// 1. Importar las utilidades de formularios reactivos
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';

interface UserReview {
  author: string;
  rating: number;
  comment: string;
  date: Date;
}

@Component({
  selector: 'shop-modal',
  standalone: true,
  // 2. Agregar ReactiveFormsModule y DatePipe a los imports
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './shop-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopModalComponent {
  shopService = inject(ShopService);
  productsService = inject(ProductsService);

  shop = input.required<string>();
  isModalChecked = output<boolean>();

  shopModal = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  isOpen = signal(false);

  reviewForm = new FormGroup({
    rating: new FormControl<number>(5, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    comment: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  // 4. Signal para almacenar los comentarios reactivamente
  reviews = signal<UserReview[]>([
    {
      author: 'Homero S.',
      rating: 5,
      comment: 'Excelente servicio y despacho súper rápido.',
      date: new Date('2026-05-12'),
    },
    {
      author: 'Francisco A.',
      rating: 4,
      comment: 'Muy buena atención, aunque el stock variaba un poco.',
      date: new Date('2026-06-02'),
    },
  ]);

  isMobile = computed(() => {
    const nav = navigator as any;
    return (
      nav.userAgentData?.mobile ??
      (navigator.maxTouchPoints > 0 &&
        /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))
    );
  });

  shopName = computed<string>(() => this.shop());
  shopImage = computed<string | undefined>(() =>
    this.shopService.getImageUrl(this.shopName()),
  );

  shopUriAddress = computed(() => {
    if (!this.shopResource.hasValue()) return '';
    const encodedAddress = encodeURIComponent(
      this.shopResource.value().at(0)!.address,
    );
    return this.isMobile()
      ? `geo:0,0?q=${encodedAddress}`
      : `https://maps.google.com/?q=${encodedAddress}`;
  });

  shopResource = resource({
    params: () => {
      const shopName = this.shopName();
      return shopName ? { shop_name: shopName } : null;
    },
    loader: ({ params }) =>
      firstValueFrom(this.productsService.getShopByName(params!.shop_name)),
  });

  // 5. Método para procesar el nuevo comentario de forma reactiva
  submitReview() {
    if (this.reviewForm.invalid) return;

    const { rating, comment } = this.reviewForm.getRawValue();

    const newReview: UserReview = {
      author: 'Usuario Anónimo', // Aquí puedes enlazar tu UserStore si lo requieres
      rating,
      comment,
      date: new Date(),
    };

    // Actualizamos el signal de reseñas de manera inmutable
    this.reviews.update((current) => [newReview, ...current]);

    // Reseteamos el formulario a sus valores base
    this.reviewForm.reset({ rating: 5, comment: '' });
  }

  open() {
    this.shopModal()?.nativeElement.showModal();
    this.isOpen.set(true);
  }

  close() {
    this.shopModal()?.nativeElement.close();
    this.isOpen.set(false);
    this.isModalChecked.emit(false);
  }

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
