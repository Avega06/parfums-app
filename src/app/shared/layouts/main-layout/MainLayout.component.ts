import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  NavbarComponent,
  SearchInputComponent,
  SearchList,
} from '../../components';
import { Footer } from '../../components/Footer/Footer';

import { SupabaseService } from '../../services';
import { ProductStore, UserStore } from '../../stores';
import { Session, UserMetadata } from '@supabase/supabase-js';
import { ToastMessage } from '../../components/toast-tmessage/ToastMessage';
import { ProductsFinder } from '../../../components/ProductsFinder/ProductsFinder';
import { MobileSideDrawer } from '../../components/mobile-side-drawer/mobile-side-drawer';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    NavbarComponent,
    Footer,
    CommonModule,
    ToastMessage,
    MobileSideDrawer,
  ],
  templateUrl: './MainLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainLayoutComponent implements OnInit {
  // public supabaseService = inject(SupabaseService);

  public userStore = inject(UserStore);

  public router = inject(Router);

  public session = signal<Session | null>(null);

  #platformId = inject(PLATFORM_ID);

  isOnline = signal<boolean | null>(this.userStore.isAuthenticated());
  toastMsg = signal<string | null>(null);

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.isOnline.set(navigator.onLine);
      window.addEventListener('online', () => this.isOnline.set(true));
      window.addEventListener('offline', () => this.isOnline.set(false));
    }

    if (this.userStore.isAuthenticated()) {
      this.dispararNotificacion(this.userStore.userMetadata());
    }
  }

  async dispararNotificacion(user: UserMetadata) {
    if (!this.userStore.isLoading()) {
      this.toastMsg.set(`¡Bienvenido 👋 ${user['name']}!`);
    }
  }

  isBrowser = computed(() => {
    return isPlatformBrowser(this.#platformId);
  });
}
