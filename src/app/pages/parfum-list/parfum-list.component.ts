import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  resource,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, map, tap } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { ProductsComponent } from '../../components/products/products.component';
import { Product } from '../../intefaces/products-response.interface';
import {
  SkeletonViewComponent,
  MainCardComponent,
  PageControllerComponent,
} from '../../shared/components';

@Component({
  selector: 'app-parfum-list',
  imports: [
    MainCardComponent,
    PageControllerComponent,
    ProductsComponent,
    SkeletonViewComponent,
  ],
  templateUrl: './parfum-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ParfumListComponent {
  private route = inject(ActivatedRoute);
  private productsListService = inject(ProductsService);
  public currentPage = toSignal<string>(
    this.route.params.pipe(
      map((params) => params['page'] ?? '1'),
      tap(console.log)
    )
  );

  totalPages = computed<string>(() => {
    const total = this.parfumsResource.value()?.result.pages ?? '0';
    return total;
  });

  products = computed<Product[]>(() => {
    const resourceValue = this.parfumsResource.value();

    if (!resourceValue || !resourceValue.result) {
      return [];
    }

    return resourceValue.result.result as Product[];
  });

  parfumsResource = resource({
    request: () => ({ page: this.currentPage()! }),
    loader: async ({ request }) => {
      return firstValueFrom(
        this.productsListService.getProducts(request.page!)
      );
    },
  });
}
