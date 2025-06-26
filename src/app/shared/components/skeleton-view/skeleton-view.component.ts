import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'skeleton-view',
  imports: [],
  templateUrl: './skeleton-view.component.html',
  host: { class: 'flex flex-wrap basis-128 gap-4 w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonViewComponent {
  totalCountSkeleton = input<number>();

  skeletons = computed(() => {
    const total: number[] = [];

    if (this.totalCountSkeleton()) {
      for (let i = 1; i <= this.totalCountSkeleton()!; i++) {
        total.push(i);
      }
    }

    return total;
  });
}
