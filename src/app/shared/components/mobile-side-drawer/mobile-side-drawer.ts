import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductsFinder } from '../../../components/ProductsFinder/ProductsFinder';
import { UserAvatar } from '../auth';
import { UserStore } from '../../stores/UserStore';
import { NgOptimizedImage } from '@angular/common';
import { ThemeControllerComponent } from '../theme-controller/ThemeController.component';

@Component({
  selector: 'mobile-side-drawer',
  imports: [NgOptimizedImage, ProductsFinder, ThemeControllerComponent],
  templateUrl: './mobile-side-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'drawer-side z-800',
  },
})
export class MobileSideDrawer {
  userStore = inject(UserStore);
}
