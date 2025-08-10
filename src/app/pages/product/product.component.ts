import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, map, tap } from 'rxjs';
import { ProductImageComponent } from '../../components/product-image/product-image.component';
import { ProductsService } from '../../services/products.service';
import { CurrencyPipe } from '@angular/common';
import { ShopImagesSrc } from '../../features/shops-images-url';
import { Meta, Title } from '@angular/platform-browser';
import { ShopInfoResponse } from '../../intefaces';
import { ShopModalComponent } from '../../components/shop-modal/shop-modal.component';

@Component({
  selector: 'app-product',
  imports: [ProductImageComponent, CurrencyPipe, ShopModalComponent],
  templateUrl: './product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductComponent {
  shopModal = viewChild<HTMLDialogElement>('shopModal');
  productsService = inject(ProductsService);
  private route = inject(ActivatedRoute);
  private title = inject(Title);
  private meta = inject(Meta);

  shop = signal<ShopInfoResponse | null>(null);
  isShopModalOpen = signal(false);

  product = computed(() => {
    return (
      this.productsService.product()! ?? this.productResource.value()?.at(0)
    );
  });

  shopName = computed<string>(() => {
    console.log(this.product().shop);
    return this.product().shop;
  });

  public productName = toSignal<string>(
    this.route.params.pipe(
      map((params) => params['product_id'] ?? ''),
      tap(console.log)
    )
  );

  metaTagsEffect = effect(() => {
    const pageTitle = this.product().product;
    const pageDescription = `${this.product().product} | ${
      this.product().shop
    }`;

    const imageSrc = `${this.product().imageUrl}`;
    this.title.setTitle(`${pageTitle}`);
    this.meta.updateTag({
      name: 'description',
      content: pageDescription,
    });
    this.meta.updateTag({
      name: 'og:title',
      content: pageTitle,
    });
    this.meta.updateTag({
      name: 'og:description',
      content: pageDescription,
    });
    this.meta.updateTag({
      name: 'og:image',
      content: imageSrc,
    });
    console.log('isModalOpen', this.isShopModalOpen());
  });

  getImageUrl(name: string) {
    const shopSelected = ShopImagesSrc.find((shop) => shop.name === name);

    if (!shopSelected) return;

    return shopSelected.src;
  }

  openShopModal() {
    this.isShopModalOpen.set(true);
  }

  closeModal(isClose: boolean) {
    console.log('isClose value:', isClose);
    this.isShopModalOpen.set(isClose);
  }

  productResource = resource({
    params: () => ({ product: this.productName()! }),
    loader: ({ params }) => {
      return firstValueFrom(
        this.productsService.getProductByName(params.product)
      );
    },
  });
}
