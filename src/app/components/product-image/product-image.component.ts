import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'product-image',
  imports: [],
  templateUrl: './product-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImageComponent {
  imageSrc = input.required<string>();
  imageName = input.required<string>();
  heigth = input<string>();
  width = input<string>();
}
