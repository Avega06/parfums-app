import { Component, computed, effect, input, signal } from '@angular/core';
import { Field, FormField, ValidationError } from '@angular/forms/signals';

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

  showPassword = signal(false);

  toggleVisibility() {
    this.showPassword.update((value) => !value);
  }

  passwordInfo = computed(() => [
    'Debe tener más de 8 caracteres, incluyendo',
    '- Al menos un número',
    '- Al menos una letra minúscula',
    '- Al menos una letra mayúscula`',
  ]);
}
