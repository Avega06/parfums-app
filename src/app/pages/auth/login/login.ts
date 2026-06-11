import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';

import { SupabaseService } from '../../../shared/services';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SocialButtons } from '../../../shared/components';

interface LoginFormModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    SocialButtons,
    FormField,
    FormRoot,
  ],
  templateUrl: './login.html',
})
export default class LoginComponent {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  loginModel = signal<LoginFormModel>({
    email: '',
    password: '',
  });

  loginForm = form(
    this.loginModel,
    (schemaPath) => {
      required(schemaPath.email);
      required(schemaPath.password);
    },
    {
      submission: {
        action: async (field) => {
          const loginData = field().value;

          const { email, password } = loginData();

          await this.onLogin(email, password);
        },
      },
    },
  );

  async onLogin(email: string, password: string) {
    const { data, error } = await this.supabaseService.login(email, password);

    if (error) alert(error.message);
    if (data) await this.router.navigate(['/']);
  }

  async socialLogin(provider: any) {
    const { error } = await this.supabaseService.loginWithProvider(provider);

    console.log(error);
    if (error) alert(error.message);
  }
}
