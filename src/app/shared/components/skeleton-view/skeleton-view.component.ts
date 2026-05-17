import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'skeleton-view',
  template: ` <div class="skeleton h-[570px] w-100 tablet:w-70"></div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonViewComponent {}
