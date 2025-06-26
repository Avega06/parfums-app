import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  resource,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, firstValueFrom, map, tap } from 'rxjs';
import { ProductImageComponent } from '../../components/product-image/product-image.component';
import { ProductsService } from '../../services/products.service';
import { CurrencyPipe } from '@angular/common';
import { ShopImagesSrc } from '../../features/shops-images-url';
import { DbService } from '../../core/services';

@Component({
  selector: 'app-product',
  imports: [ProductImageComponent, CurrencyPipe],
  templateUrl: './product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductComponent implements OnInit {
  shopModal = viewChild<Element>('shopModal');
  productsService = inject(ProductsService);
  private route = inject(ActivatedRoute);
  dbService = inject(DbService);

  shop = signal<any[]>([]);

  product = computed(() => {
    return (
      this.productsService.product()! ?? this.productResource.value()?.at(0)
    );
  });

  public productName = toSignal<string>(
    this.route.params.pipe(
      map((params) => params['product_id'] ?? ''),
      tap(console.log)
    )
  );

  ce = effect(() => {
    console.log('allShops', this.shop());
  });

  async ngOnInit() {
    await this.dbService.init();
    this.shop.set(this.dbService.queryShopsByName(this.product().shop));
  }

  getImageUrl(name: string) {
    const shopSelected = ShopImagesSrc.find((shop) => shop.name === name);
    // console.log(name, shopSelected);

    if (!shopSelected) return;

    return shopSelected.src;
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
