import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../shared/services';
import { SocialButtons } from '../../../shared/components';
import { form, required, FormRoot, FormField } from '@angular/forms/signals';

interface SignUpFormModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, SocialButtons, FormRoot, FormField],
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

  signUpModel = signal<SignUpFormModel>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  signUpForm = form(
    this.signUpModel,
    (schemaPath) => {
      required(schemaPath.firstName);
      required(schemaPath.lastName);
      required(schemaPath.email);
      required(schemaPath.password);
      required(schemaPath.confirmPassword);
    },
    {
      submission: {
        action: async (field) => {
          const signUpValues = field().value;

          const { ...values } = signUpValues();

          await this.onSubmit(values);
        },
      },
    },
  );

  async onSubmit(values: SignUpFormModel) {
    if (values.password !== values.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    const { data, error } = await this.authService.signUp(
      values.email,
      values.password,
      {
        first_name: values.firstName,
        last_name: values.lastName,
      },
    );
    if (error) console.error(error);
    else alert('Revisa tu correo de confirmación');
  }

  async socialLogin(provider: any) {
    await this.authService.loginWithProvider(provider);
  }
}
