import { Service } from '@angular/core';
import { ShopImagesSrc } from '../features/shops-images-url';

@Service()
export class ShopService {
  constructor() {}

  getImageUrl(name: string) {
    const shopSelected = ShopImagesSrc.find((shop) => shop.name === name);

    if (!shopSelected) return;

    return shopSelected.src;
  }
}
