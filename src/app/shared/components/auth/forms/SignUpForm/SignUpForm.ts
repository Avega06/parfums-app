import { Component, computed, inject, signal } from '@angular/core';
import {
  SchemaPath,
  validate,
  form,
  required,
  FormRoot,
  FormField,
  email,
  minLength,
} from '@angular/forms/signals';
import { SupabaseService } from '../../../../services';
import { FormInput } from '../../../form-input/form-input';
import { Router } from '@angular/router';

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
  selector: 'sign-up-form',
  imports: [FormRoot, FormField, FormInput],
  templateUrl: './SignUpForm.html',
})
export class SignUpForm {
  private authService = inject(SupabaseService);
  private router = inject(Router);

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
      required(schemaPath.firstName, { message: 'El nombre es requerido' });
      required(schemaPath.lastName, { message: 'El apellido es requerido' });
      required(schemaPath.email, { message: 'El email es requerido' });
      email(schemaPath.email, { message: 'El email es invalido' });
      required(schemaPath.password, { message: 'La contraseña es requerida' });
      minLength(schemaPath.password, 8, {
        message: 'Debe tener mas de 8 caracteres',
      });
      validate(schemaPath.password, ({ value }) => {
        const text = value() || '';
        const errors: { kind: string; message: string }[] = [];

        if (!/[A-Z]/.test(text)) {
          errors.push({
            kind: 'requireUppercase',
            message: 'Debe contener al menos una letra mayúscula',
          });
        }
        if (!/[a-z]/.test(text)) {
          errors.push({
            kind: 'requireLowercase',
            message: 'Debe contener al menos una letra minúscula',
          });
        }
        if (!/\d/.test(text)) {
          errors.push({
            kind: 'requireNumber',
            message: 'Debe contener al menos un número',
          });
        }

        // Si hay errores, devolvemos el array. Si no, null.
        return errors.length > 0 ? errors : null;
      });

      passwordEquals(schemaPath.password, schemaPath.confirmPassword);
      required(schemaPath.confirmPassword, {
        message: 'La confirmación de la contraseña es requerida',
      });
    },
    {
      submission: {
        action: async (field) => {
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
    if (data.user && !data.session) {
      this.router.navigate(['auth/verify-email']);
    }
  }

  passwordMismatchError = computed(() => {
    const errors = this.signUpForm.confirmPassword().errors();

    // Como es un Arreglo, verificamos si alguno cumple con la condición
    return !!(
      errors && errors.some((error) => error.kind === 'passwordMismatch')
    );
  });
}
