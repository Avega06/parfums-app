import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductsFinder } from '../../../components/ProductsFinder/ProductsFinder';
import { UserStore } from '../../stores/UserStore';
import { NgOptimizedImage } from '@angular/common';
import { ThemeControllerComponent } from '../theme-controller/ThemeController.component';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services';

@Component({
  selector: 'mobile-side-drawer',
  imports: [
    NgOptimizedImage,
    ProductsFinder,
    ThemeControllerComponent,
    RouterLink,
  ],
  templateUrl: './mobile-side-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'drawer-side z-800',
  },
})
export class MobileSideDrawer {
  userStore = inject(UserStore);
  private supabaseService = inject(SupabaseService);

  async handleSignOut() {
    await this.supabaseService.signOut();
  }
}
