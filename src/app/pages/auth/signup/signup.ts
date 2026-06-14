import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../shared/services';
import { SocialButtons } from '../../../shared/components';

import { SignUpForm } from '../../../shared/components/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, SocialButtons, SignUpForm],
  templateUrl: './signup.html',
  styles: [
    `
      :host {
        display: block;
      }
      .input:focus {
        outline: 2px solid rgba(255, 255, 255, 0.5);
      }
    `,
  ],
})
export default class SignUpComponent {
  private authService = inject(SupabaseService);

  async socialLogin(provider: any) {
    await this.authService.loginWithProvider(provider);
  }
}
