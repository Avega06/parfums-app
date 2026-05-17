import { Component, inject } from '@angular/core';
import { SupabaseService } from '../../../shared/services';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SocialButtons } from '../../../shared/components';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SocialButtons],
  templateUrl: './login.html',
})
export default class LoginComponent {
  private supabaseService = inject(SupabaseService);

  email = '';
  password = '';

  async onLogin() {
    const { error } = await this.supabaseService.login(
      this.email,
      this.password,
    );
    if (error) alert(error.message);
  }

  async socialLogin(provider: any) {
    const { error } = await this.supabaseService.loginWithProvider(provider);

    console.log(error);
    if (error) alert(error.message);
  }
}
