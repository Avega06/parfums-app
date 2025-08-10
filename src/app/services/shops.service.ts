import { Injectable } from '@angular/core';
import { ShopImagesSrc } from '../features/shops-images-url';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor() {}

  getImageUrl(name: string) {
    const shopSelected = ShopImagesSrc.find((shop) => shop.name === name);

    if (!shopSelected) return;

    return shopSelected.src;
  }
}
