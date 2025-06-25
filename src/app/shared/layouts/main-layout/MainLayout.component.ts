import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostListener,
  signal,
} from '@angular/core';
import { NavbarComponent } from '../../components';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './MainLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainLayoutComponent {
  isOnline = signal<boolean>(navigator.onLine);

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
