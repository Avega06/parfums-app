import { Component, computed, effect, input, signal } from '@angular/core';
import {
  Field,
  form,
  FormField,
  ValidationError,
} from '@angular/forms/signals';

@Component({
  selector: 'form-input',
  imports: [FormField],
  templateUrl: './form-input.html',
  host: {
    class: 'block w-full',
  },
})
export class FormInput {
  formField = input.required<Field<any, string | number>>();
  type = input.required<string>();
  formClass = input.required<string>();

  isTouched = input<boolean>();
  isPasswordInfo = input<boolean>();

  placeholder = input<string>();
  errors = input<ValidationError.WithFieldTree[]>();

  showPassword = signal<boolean>(false);
  isFocussed = signal<boolean>(false);
  inputValue = signal<string>('');

  toggleVisibility() {
    this.showPassword.update((value) => !value);
  }

  isInvalidField = computed<boolean>(() => {
    const field = this.formField();

    return field().invalid();
  });

  passwordInfo = computed(() => {
    if (this.type() !== 'password') return;
    const field = this.formField();

    const value = field().value() || '';

    const hasValue = value.length > 0;

    return [
      {
        valid: hasValue && !this.errors()!.some((e) => e.kind === 'minLength'),
        message: 'Debe tener más de 8 caracteres, incluyendo:',
      },
      {
        valid: !this.errors()!.some((e) => e.kind === 'requireNumber'),
        message: 'Al menos un número',
      },
      {
        valid: !this.errors()!.some((e) => e.kind === 'requireLowercase'),
        message: 'Al menos una letra minúscula',
      },
      {
        valid: !this.errors()!.some((e) => e.kind === 'requireUppercase'),
        message: 'Al menos una letra mayúscula`',
      },
    ];
  });
}
