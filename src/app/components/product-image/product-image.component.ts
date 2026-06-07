import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'product-image',
  imports: [NgOptimizedImage],
  templateUrl: './product-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImageComponent {
  imageSrc = input.required<string>();
  imageName = input.required<string>();
  isLoading = input<boolean>();

  heigth = input<string>();
  width = input<string>();

  ce = effect(() => {
    console.log(this.isLoading());
  });
}
