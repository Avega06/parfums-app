import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ThemeStore } from '../../../core/services/ThemeStore';

@Component({
  selector: 'theme-controller',
  standalone: true,
  templateUrl: './ThemeController.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeControllerComponent {
  themeStore = inject(ThemeStore);

  isCoffeeTheme = computed(() => this.themeStore.theme() === 'coffee');

  toggleTheme(event: Event): void {
    this.themeStore.toggle();
  }
}
