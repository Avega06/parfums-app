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
import { ShopSocialNetworks } from '../../features';
import {
  form,
  FormField,
  FormRoot,
  minLength,
  required,
} from '@angular/forms/signals';

interface UserReview {
  author: string;
  rating: number;
  comment: string;
  date: Date;
}

interface ReviewModel {
  rating: string;
  comment: string;
}

@Component({
  selector: 'shop-modal',
  standalone: true,
  imports: [FormRoot, FormField, DatePipe],
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

  reviewModel = signal<ReviewModel>({
    rating: '5',
    comment: '',
  });

  reviewForm = form(this.reviewModel, (schemaPath) => {
    required(schemaPath.rating);
    required(schemaPath.comment);

    minLength(schemaPath.comment, 3);
  });

  public isLoading = signal<boolean>(false);
  reviews = signal<UserReview[]>([]);

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

  async submitReview() {
    // Validar formulario (invocando la función del form signal si es un Signal-based form)
    if (this.reviewForm().invalid()) return;

    const { rating, comment } = this.reviewForm().value();

    this.isLoading.set(true);

    try {
      // 2. Llamamos a la Edge Function pasándole los datos limpios
      const response = await this.shopService.insertShopComment(
        this.shopResource.value()?.at(0)?.shopId!,
        +rating,
        comment,
      );

      // 3. Si la Edge Function responde con éxito, construimos el objeto final
      // Nota: 'response.data' contendrá las columnas reales devueltas por Postgres (id, created_at, etc.)
      const newReview: UserReview = {
        author: 'Tú', // O la data que extraigas de tu UserStore/Auth
        rating: response.data.rating,
        comment: response.data.comment,
        date: new Date(response.data.created_at), // Usamos la fecha exacta del servidor en UTC
      };

      // 4. Actualizamos el signal de reseñas de manera inmutable
      this.reviews.update((current) => [newReview, ...current]);

      // 5. Reseteamos el formulario a sus valores base solo si se guardó con éxito
      this.reviewForm().reset({ rating: '5', comment: '' });
    } catch (error) {
      console.error('Error al guardar la reseña:', error);
      // Aquí puedes manejar una alerta visual en la UI usando otro Signal si lo deseas
      alert('Hubo un error al publicar tu comentario. Inténtalo de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
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

  currentShopNetworks = computed(() => {
    const currentShopName = this.shop();
    const foundShop = ShopSocialNetworks.find(
      (s) => s.name.toLowerCase() === currentShopName?.toLowerCase(),
    );
    return foundShop ? foundShop.socialNetworks : [];
  });
}
