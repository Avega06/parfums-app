import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { ProductMock } from '../shared/mocks/product-response.mock';
import {
  Product,
  ProductsResponse,
} from '../intefaces/products-response.interface';
import { ProductByTerm, ShopResponse } from '../intefaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  searchValue = signal<string>('');
  product = signal<Product | null>(null);

  http = inject(HttpClient);

  getProductLikeTerm(term: string): Observable<ProductByTerm> {
    return this.http.get<ProductByTerm>(
      `${environment.apiUrl}/api/parfums/product_term/${term}`
    );
  }

  getProducts(page: string): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(
      `${environment.apiUrl}/api/parfums`,
      {
        params: {
          page: page,
          limit: 20,
        },
      }
    );
  }

  getProductByName(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${environment.apiUrl}/api/parfums/product/${name}`,
      {}
    );
  }

  getShopByName(name: string): Observable<ShopResponse> {
    return this.http.get<ShopResponse>(
      `${environment.apiUrl}/api/parfums/shop/${name}`,
      {}
    );
  }
}
