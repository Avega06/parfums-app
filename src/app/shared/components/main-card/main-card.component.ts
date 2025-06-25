import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'main-card',
  imports: [],
  templateUrl: './main-card.component.html',
  host: {
    class:
      'row-start-1 col-span-5 col-start-2 card card-side h-50 w-300 bg-base-200 shadow-sm ',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainCardComponent {}
