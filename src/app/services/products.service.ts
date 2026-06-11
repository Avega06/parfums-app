import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  Product,
  ProductsResponse,
} from '../intefaces/products-response.interface';
import { FilterState, ProductByTerm, ShopInfoResponse } from '../intefaces';
import { environment } from '../../environments/environment';

@Service()
export class ProductsService {
  searchValue = signal<string>('');
  product = signal<Product | null>(null);
  totalPages = signal<string>('');

  http = inject(HttpClient);

  getProductLikeTerm(term: string): Observable<ProductByTerm> {
    return this.http.get<ProductByTerm>(
      `${environment.apiUrl}/api/parfums/product_term/${term}`,
    );
  }

  getProducts(
    page: string,
    filters?: FilterState,
  ): Observable<ProductsResponse> {
    let params = new HttpParams().set('page', page).set('limit', '30');

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http
      .get<ProductsResponse>(`${environment.apiUrl}/api/parfums`, {
        params,
      })
      .pipe(
        map((response) => {
          const fallbackUrl =
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3ANo_Image_Available.jpg&psig=AOvVaw3E8Sekaxto6flY-AL5DVi_&ust=1751015586586000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCKj46sLfjo4DFQAAAAAdAAAAABAE';

          if (response.result?.result) {
            response.result.result = response.result.result.map((product) => {
              if (product.imageUrl === 'http://na') {
                return {
                  ...product,
                  imageUrl: fallbackUrl,
                };
              }
              return product;
            });
          }

          return response;
        }),
      );
  }

  getProductByName(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${environment.apiUrl}/api/parfums/product/${name}`,
      {},
    );
  }

  getShopByName(name: string): Observable<ShopInfoResponse[]> {
    return this.http.get<ShopInfoResponse[]>(
      `${environment.apiUrl}/api/parfums/shop/${name}`,
      {},
    );
  }
}
