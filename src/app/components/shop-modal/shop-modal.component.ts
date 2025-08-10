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

  shop = input.required<string>();
  isModalChecked = output<boolean>();
  isMobile = signal(
    (navigator as any).userAgentData?.mobile ??
      (navigator.maxTouchPoints > 0 &&
        /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))
  );

  shopModal = viewChild<HTMLDialogElement>('dialog');
  productsService = inject(ProductsService);

  isOpen = signal(false);

  shopName = computed<string>(() => {
    console.log(this.shop());
    return this.shop();
  });

  shopImage = computed<string | undefined>(() => {
    console.log(this.shopService.getImageUrl(this.shopName()));
    return this.shopService.getImageUrl(this.shopName());
  });

  shopAddress = computed(() => {
    if (this.shopResource.hasValue()) {
      const encodedAddress = encodeURIComponent(
        this.shopResource.value().at(0)!.address
      );

      if (this.isMobile()) return `geo:0,0?q=${encodedAddress}`;

      return `https://maps.google.com/?q=${encodedAddress}`;
    }
    return;
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
