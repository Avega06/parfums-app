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
    console.log('shopInfoValue:', this.shopResource.value());
  });
}
