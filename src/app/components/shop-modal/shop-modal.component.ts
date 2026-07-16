import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  linkedSignal,
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
import { ShopComments } from '../../intefaces';
import { ShopReviews } from '../ShopReviews/shop-reviews';

interface ReviewModel {
  rating: string;
  comment: string;
}

@Component({
  selector: 'shop-modal',
  standalone: true,
  imports: [ShopReviews],
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

  open() {
    this.shopModal()?.nativeElement.showModal();
    this.isOpen.set(true);
  }

  close() {
    this.shopModal()?.nativeElement.close();
    this.isOpen.set(false);
    this.isModalChecked.emit(false);
  }

  currentShopNetworks = computed(() => {
    const currentShopName = this.shop();
    const foundShop = ShopSocialNetworks.find(
      (s) => s.name.toLowerCase() === currentShopName?.toLowerCase(),
    );
    return foundShop ? foundShop.socialNetworks : [];
  });
}
