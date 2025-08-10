import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  effect,
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

@Component({
  selector: 'shop-modal',
  imports: [],
  templateUrl: './shop-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopModalComponent {
  shopService = inject(ShopService);
  productsService = inject(ProductsService);

  shop = input.required<string>();
  isModalChecked = output<boolean>();

  shopModal = viewChild<HTMLDialogElement>('dialog');

  isOpen = signal(false);

  isMobile = computed(() => {
    const nav = navigator as any;
    return (
      nav.userAgentData?.mobile ??
      (navigator.maxTouchPoints > 0 &&
        /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))
    );
  });

  shopName = computed<string>(() => {
    console.log(this.shop());
    return this.shop();
  });

  shopImage = computed<string | undefined>(() => {
    console.log(this.shopService.getImageUrl(this.shopName()));
    return this.shopService.getImageUrl(this.shopName());
  });

  shopAddress = computed(() => {
    if (!this.shopResource.hasValue()) return '';

    const encodedAddress = encodeURIComponent(
      this.shopResource.value().at(0)!.address
    );

    return this.isMobile()
      ? `geo:0,0?q=${encodedAddress}`
      : `https://maps.google.com/?q=${encodedAddress}`;
  });

  shopResource = resource({
    params: () => {
      const shopName = this.shopName();

      if (shopName) {
        return { shop_name: shopName };
      }

      return null;
    },
    loader: ({ params }) => {
      return firstValueFrom(
        this.productsService.getShopByName(params!.shop_name)
      );
    },
  });

  close() {
    console.log('close press');
    this.isModalChecked.emit(false);
  }

  de = effect(() => {
    console.log(this.isMobile());

    console.log(`address: ${this.shopAddress()}`);
    console.log('shopInfoValue:', this.shopResource.value());
  });
}
