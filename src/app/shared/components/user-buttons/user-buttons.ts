import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'user-buttons',
  imports: [],
  templateUrl: './user-buttons.html',
  host: {
    class: 'flex justify-center gap-4 mt-8',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserButtons {
  isFavorite = signal(false);
  isSubscribed = signal(false);

  toggleFavorite() {
    this.isFavorite.update((v) => !v);
  }
}
