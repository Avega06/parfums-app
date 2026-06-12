import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../shared/services';
import { SocialButtons } from '../../../shared/components';
import {
  form,
  required,
  FormRoot,
  FormField,
  validate,
  SchemaPath,
} from '@angular/forms/signals';

interface SignUpFormModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function passwordEquals(
  passwordPath: SchemaPath<string>,
  confirmPath: SchemaPath<string>,
  message: string = 'Las contraseñas no coinciden',
) {
  validate(confirmPath, ({ value, valueOf }) => {
    const confirmValue = value();
    const passwordValue = valueOf(passwordPath);

    if (!passwordValue) return null;

    return confirmValue === passwordValue
      ? null
      : { kind: 'passwordMismatch', message };
  });
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
      passwordEquals(schemaPath.password, schemaPath.confirmPassword);
    },
    {
      submission: {
        action: async (field) => {
          const signUpValues = field().value;

          const values = field().value;

          await this.onSubmit(values());
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

  passwordMismatchError = computed(() => {
    const errors = this.signUpForm.confirmPassword().errors();

    // Como es un Arreglo, verificamos si alguno cumple con la condición
    return !!(
      errors && errors.some((error) => error.kind === 'passwordMismatch')
    );
  });
}
