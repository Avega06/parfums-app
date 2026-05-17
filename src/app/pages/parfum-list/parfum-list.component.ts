import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  resource,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { ProductsComponent } from '../../components/products/products.component';
import {
  MainCardComponent,
  PageControllerComponent,
} from '../../shared/components';
import { PerfumeFiltersComponent } from '../../components/perfume-filters/perfume-filters.component';
import { FilterState } from '../../intefaces';
import { SupabaseService } from '../../shared/services';
import { ToastMessage } from '../../shared/components/toast-tmessage/ToastMessage';
import { User, UserMetadata } from '@supabase/supabase-js';
import { UserStore } from '../../shared/stores/UserStore';

@Component({
  selector: 'app-parfum-list',
  imports: [
    MainCardComponent,
    PageControllerComponent,
    ProductsComponent,
    PerfumeFiltersComponent,
  ],
  templateUrl: './parfum-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ParfumListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productsListService = inject(ProductsService);
  private supabaseService = inject(SupabaseService);
  private userStore = inject(UserStore);

  public currentPage = toSignal<string>(
    this.route.params.pipe(map((params) => params['page'] ?? '1')),
  );

  activeFilters = signal<FilterState>({
    shop: null,
    price_range: null,
    type_parfum: null,
    audience: null,
  });

  totalPages = computed<string>(() => {
    const total = this.productsListService.totalPages() ?? '0';
    return total;
  });

  ngOnInit(): void {
    this.supabaseService.authChanges((event, session) => {
      if (event === 'SIGNED_OUT') {
        window.location.href = '/';
      }
    });
  }
  updateFilters(newFilters: FilterState) {
    this.activeFilters.set(newFilters);
    // Nota: Al setear la señal, el resource detecta el cambio de params y se dispara solo
  }
}
