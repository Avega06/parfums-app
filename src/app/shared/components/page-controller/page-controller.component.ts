import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'page-controller',
  imports: [RouterLink],
  templateUrl: './page-controller.component.html',
  host: {
    class: 'row-start-3 col-start-4 join',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageControllerComponent {
  totalPages = input.required<string>();
  currentPage = input.required<string>();

  prevPage = computed(() => {
    const page = +this.currentPage();
    return page > 1 ? page - 1 : 1;
  });

  nextPage = computed(() => {
    const page = +this.currentPage();
    const total = +this.totalPages();
    return page < total ? page + 1 : total;
  });

  readonly pages = computed(() => {
    const total: number = +this.totalPages();
    const current: number = +this.currentPage();

    const delta = 2; // Cuántos mostrar antes y después

    const range: (number | string)[] = [];

    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    range.push(1);

    if (left > 2) range.push('...');

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < total - 1) range.push('...');

    if (total > 1) range.push(total);

    return range;
  });

  // goTo(position: string) {
  //   if (position === 'next') {
  //     const nextPage = `${+this.currentPage() + 1}`;
  //   } else {
  //     const backPage = `${+this.currentPage() - 1}`;
  //   }
  // }
}
