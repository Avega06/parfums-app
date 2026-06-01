import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeStore } from '../../../core/services/ThemeStore';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './Footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  themeStore = inject(ThemeStore);
}
