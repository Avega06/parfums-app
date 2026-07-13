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
    ShopModalComponent,
  ],
  templateUrl: './product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductComponent {
  product_id = input<string>();
  modal = viewChild(ShopModalComponent);

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
    if (this.productsService.product()) return this.productsService.product()!;

    const resourceValue = this.productResource.value()?.at(0);

    return resourceValue;
  });

  shopName = computed<string>(() => {
    return this.product()?.shop!;
  });

  public productName = toSignal<string>(
    this.route.params.pipe(
      map((params) => params['product_id'] ?? ''),
      tap(console.log),
    ),
  );

  constructor() {
    effect(() => {
      // 1. Manejo del estado de autenticación de forma independiente
      if (this.userStore.isAuthenticated()) {
        this.showUserButtons.set(true);
      }

      // 2. Obtenemos el producto actual de la señal computada
      const currentProduct = this.product();

      // Si el resource aún no se resuelve o la señal está vacía, salimos de forma segura
      if (!currentProduct) return;

      // 3. Una vez que el producto existe, extraemos sus propiedades de forma segura
      const pageTitle = currentProduct.product;
      const pageDescription = `${currentProduct.product} | ${currentProduct.shop}`;
      const imageSrc = currentProduct.imageUrl;

      // 4. Asignamos los metatags (Se ejecutará tanto en Servidor como en Cliente)
      this.title.setTitle(pageTitle);
      this.meta.updateTag({ name: 'description', content: pageDescription });
      this.meta.updateTag({ name: 'og:title', content: pageTitle });
      this.meta.updateTag({ name: 'og:description', content: pageDescription });
      this.meta.updateTag({ name: 'og:image', content: imageSrc });

      console.log(currentProduct);
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
    this.modal()?.open();
  }

  closeModal(isClose: boolean) {
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
