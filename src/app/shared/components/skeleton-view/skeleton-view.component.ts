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
  host: { class: 'row-start-2 col-start-2 col-span-5 flex flex-wrap gap-2' },
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
