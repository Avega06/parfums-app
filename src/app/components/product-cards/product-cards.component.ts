import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../intefaces/products-response.interface';
import { ShopImagesSrc } from '../../features/shops-images-url';
import { GsapService } from '../../core/services/gsap.service';
import { ThemeStore } from '../../core/services/ThemeStore';

@Component({
  selector: 'product-cards',
  imports: [CurrencyPipe],
  templateUrl: './product-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // 1. Clases estáticas que siempre lleva el card
    class:
      'card shadow-xl rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-300 hover:scale-[1.02] flex flex-col h-full w-full',
    // 2. Clase o estilos dinámicos desde la señal
    '[class]': 'hostClasses()',
    '[style.background-color]': 'themeStore.globalStyles().card_bg || null',
  },
})
export class ProductCardsComponent {
  readonly themeStore = inject(ThemeStore);
  readonly gsapService = inject(GsapService);

  imageElement = viewChild<ElementRef<HTMLImageElement>>('imageEl');
  product = input<Product>();

  // Si prefieres manejar las clases resultantes en un getter o propiedad calculada
  protected hostClasses(): string {
    const styles = this.themeStore.globalStyles();
    return styles.card_bg.startsWith('bg-') ? styles.card_bg : '';
  }

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
    return shopSelected?.src;
  }
}
