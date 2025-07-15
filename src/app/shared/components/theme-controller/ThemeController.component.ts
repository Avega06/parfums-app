import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';

@Component({
  selector: 'theme-controller',
  imports: [],
  templateUrl: './ThemeController.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeControllerComponent {
  #platformId = inject(PLATFORM_ID);
  selectTheme = output<string>();
  isCoffeeTheme = signal<boolean>(false);

  isBrowser = computed(() => {
    return isPlatformBrowser(this.#platformId);
  });

  ngOnInit(): void {
    if (this.isBrowser()) {
      const storedTheme = localStorage.getItem('theme');
      this.isCoffeeTheme.set(storedTheme === 'coffee');
      //this.setTheme(this.isCoffeeTheme() ? 'coffee' : 'light');
    }
  }

  toggleTheme(event: Event): void {
    this.isCoffeeTheme.set((event.target as HTMLInputElement).checked);
    const newTheme = this.isCoffeeTheme() ? 'coffee' : 'light';
    this.setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  setTheme(theme: string): void {
    // Cambia el atributo "data-theme" en el elemento raíz.
    document.documentElement.setAttribute('data-theme', theme);
    this.selectTheme.emit(theme);
  }
}
