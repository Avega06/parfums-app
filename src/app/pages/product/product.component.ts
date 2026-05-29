import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
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
import { ChatbotComponent } from '../../shared/components/Chatbot/Chatbot';
import {
  ProductPriceHistoryChartComponent,
  PriceHistory,
} from '../../components/product-price-history-chart/product-price-history-chart.component';
import { UserStore } from '../../shared/stores';
import { UserButtons } from '../../shared/components/user-buttons/user-buttons';

@Component({
  selector: 'app-product',
  imports: [
    CurrencyPipe,
    ChatbotComponent,
    ProductPriceHistoryChartComponent,
    ProductImageComponent,
    UserButtons,
  ],
  templateUrl: './product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductComponent {
  product_id = input<string>();
  shopModal = viewChild<HTMLDialogElement>('shopModal');

  open = signal(false);

  isFavorite = signal(false);
  isSubscribed = signal(false);

  toggleFavorite() {
    this.isFavorite.update((v) => !v);
  }

  toggleNotify() {
    this.isSubscribed.update((v) => !v);
    // Aquí iría tu lógica de integración con Telegram
  }

  productsService = inject(ProductsService);
  private route = inject(ActivatedRoute);
  private title = inject(Title);
  private meta = inject(Meta);

  userStore = inject(UserStore);

  shop = signal<ShopInfoResponse | null>(null);
  showUserButtons = signal<boolean>(false);
  isShopModalOpen = signal(false);

  // Mock Price History Data
  priceHistory = signal<PriceHistory[]>([
    { date: '2025-01-01', price: 89990 },
    { date: '2025-02-01', price: 85990 },
    { date: '2025-03-01', price: 87990 },
    { date: '2025-04-01', price: 82990 },
    { date: '2025-05-01', price: 84990 },
  ]);

  product = computed(() => {
    console.log('selected product', this.productsService.product());

    if (this.productsService.product()) return this.productsService.product()!;

    const resourceValue = this.productResource.value()?.at(0);

    return resourceValue;
  });

  shopName = computed<string>(() => {
    console.log(this.product()!.shop);
    return this.product()!.shop;
  });

  public productName = toSignal<string>(
    this.route.params.pipe(
      map((params) => params['product_id'] ?? ''),
      tap(console.log),
    ),
  );

  constructor() {
    effect(() => {
      if (this.userStore.isAuthenticated()) this.showUserButtons.set(true);

      const pageTitle = this.product()!.product;
      const pageDescription = `${this.product()!.product} | ${
        this.product()!.shop
      }`;

      const imageSrc = `${this.product()!.imageUrl}`;
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
    });
  }

  getImageUrl(name: string) {
    const shopSelected = ShopImagesSrc.find((shop) => shop.name === name);

    if (!shopSelected) return;

    return shopSelected.src;
  }

  toggle() {
    this.open.update((v) => !v);
  }

  openShopModal() {
    this.isShopModalOpen.set(true);
  }

  closeModal(isClose: boolean) {
    console.log('isClose value:', isClose);
    this.isShopModalOpen.set(isClose);
  }

  productResource = resource({
    params: () => ({ product: this.product_id()! }),
    loader: ({ params }) => {
      return firstValueFrom(
        this.productsService.getProductByName(params.product),
      );
    },
  });
}
