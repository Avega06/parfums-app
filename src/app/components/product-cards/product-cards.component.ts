import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Product } from '../../intefaces/products-response.interface';
import { CurrencyPipe } from '@angular/common';
import { ShopImagesSrc } from '../../features/shops-images-url';
import { GsapService } from '../../core/services/gsap.service';

@Component({
  selector: 'product-cards',
  imports: [CurrencyPipe],
  templateUrl: './product-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'card bg-base-100 card-xl w-100 tablet:w-86 shadow-sm ',
  },
})
export class ProductCardsComponent {
  imageElement = viewChild<ElementRef<HTMLImageElement>>('imageEl');
  product = input<Product>();

  gsapService = inject(GsapService);

  animationEffect = effect(() => {
    const url = this.product()?.imageUrl;

    if (url && this.imageElement()?.nativeElement) {
      this.gsapService.fadeIn(this.imageElement()!.nativeElement);
    }
  });

  @HostListener('mouseenter')
  onFocus() {
    if (this.imageElement()?.nativeElement) {
      this.gsapService.zoomIn(this.imageElement()!.nativeElement);
    }
  }

  getImageUrl(name: string) {
    const shopSelected = ShopImagesSrc.find((shop) => shop.name === name);
    // console.log(name, shopSelected);

    if (!shopSelected) return;

    return shopSelected.src;
  }
}
