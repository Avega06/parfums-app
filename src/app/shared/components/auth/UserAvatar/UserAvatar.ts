import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { UserMetadata } from '@supabase/supabase-js';
import { SupabaseService } from '../../../services';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { UserStore } from '../../../stores/UserStore';

@Component({
  selector: 'user-avatar',
  imports: [RouterLink, NgOptimizedImage],

  templateUrl: './UserAvatar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatar {
  userInfo = input.required<UserMetadata>();
  isAvatarLoading = input.required<boolean>();

  userStore = inject(UserStore);
  private supabaseService = inject(SupabaseService);

  avatarUrl = signal<string>('');

  eventEffect = effect(() => {
    if (this.userStore.isAuthenticated())
      this.avatarUrl.set(this.userStore.userAvatar()!);
  });

  async handleSignOut() {
    await this.supabaseService.signOut();
  }
}
