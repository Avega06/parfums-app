import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'product-list-page',
  imports: [],
  templateUrl: './product-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductListPage {}
