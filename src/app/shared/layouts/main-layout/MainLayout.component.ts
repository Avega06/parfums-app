import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { NavbarComponent } from '../../components';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './MainLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainLayoutComponent implements OnInit {
  #platformId = inject(PLATFORM_ID);

  isBrowser = computed(() => {
    return isPlatformBrowser(this.#platformId);
  });

  isOnline = signal<boolean | null>(null);

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.isOnline.set(navigator.onLine);
      window.addEventListener('online', () => this.isOnline.set(true));
      window.addEventListener('offline', () => this.isOnline.set(false));

      console.log('connected??', this.isOnline());
    }
  }
}
