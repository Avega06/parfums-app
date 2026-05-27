import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'skeleton-view',
  standalone: true,
  template: `
    <div class="skeleton w-full h-full min-h-[635px] rounded-xl"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonViewComponent {}
