import { Component, inject, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  FormRoot,
  required,
} from '@angular/forms/signals';
import { SupabaseService } from '../../../../services';
import { Router } from '@angular/router';
import { FormInput } from '../../../form-input/form-input';

interface LoginFormModel {
  email: string;
  password: string;
}

@Component({
  selector: 'login-form',
  imports: [FormRoot, FormField, FormInput],
  templateUrl: './LoginForm.html',
})
export class LoginForm {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  loginModel = signal<LoginFormModel>({
    email: '',
    password: '',
  });

  showPassword = signal(false);

  toggleVisibility() {
    this.showPassword.update((value) => !value);
  }

  loginForm = form(
    this.loginModel,
    (schemaPath) => {
      required(schemaPath.email, { message: 'El email es requerido' });
      email(schemaPath.email, { message: 'El email es invalido' });
      required(schemaPath.password, {
        message: 'La contraseña es requerida',
      });
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
    console.log(error?.code);
    if (error?.code === 'email_not_confirmed') {
      await this.router.navigate(['auth/verify-email']);
      return;
    }
    if (data) await this.router.navigate(['/']);
  }
}
