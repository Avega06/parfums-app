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
    if (!this.isBrowser()) this.isOnline.set(navigator.onLine);
  }

  listenerEffect = effect(() => {
    console.log('connected??', this.isOnline());
  });

  @HostListener('window:online')
  online() {
    this.isOnline.set(true);
  }

  @HostListener('window:offline')
  offline() {
    this.isOnline.set(false);
  }
}
