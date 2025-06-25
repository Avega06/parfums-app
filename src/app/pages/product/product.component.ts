import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, firstValueFrom, map, tap } from 'rxjs';
import { ProductImageComponent } from '../../components/product-image/product-image.component';
import { ProductsService } from '../../services/products.service';
import { CurrencyPipe } from '@angular/common';
import { ShopImagesSrc } from '../../features/shops-images-url';

@Component({
  selector: 'app-product',
  imports: [ProductImageComponent, CurrencyPipe],
  templateUrl: './product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductComponent {
  shopModal = viewChild<Element>('shopModal');
  productsService = inject(ProductsService);
  private route = inject(ActivatedRoute);
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

  getImageUrl(name: string) {
    const shopSelected = ShopImagesSrc.find((shop) => shop.name === name);
    // console.log(name, shopSelected);

    if (!shopSelected) return;

    return shopSelected.src;
  }

  productResource = resource({
    request: () => ({ product: this.productName()! }),
    loader: ({ request }) => {
      return firstValueFrom(
        this.productsService.getProductByName(request.product)
      );
    },
  });
}
