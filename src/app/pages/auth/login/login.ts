import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';

import { SupabaseService } from '../../../shared/services';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SocialButtons } from '../../../shared/components';
import { LoginForm } from '../../../shared/components/auth/forms/LoginForm/LoginForm';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SocialButtons, LoginForm],
  templateUrl: './login.html',
})
export default class LoginComponent {
  private supabaseService = inject(SupabaseService);

  async socialLogin(provider: any) {
    const { error } = await this.supabaseService.loginWithProvider(provider);

    console.log(error);
    if (error) alert(error.message);
  }
}
