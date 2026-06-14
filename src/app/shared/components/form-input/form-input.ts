import { Component, effect, input, signal } from '@angular/core';
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

  placeholder = input<string>();
  errors = input<ValidationError.WithFieldTree[]>();

  ce = effect(() => {
    console.log(this.errors());
  });

  showPassword = signal(false);

  toggleVisibility() {
    this.showPassword.update((value) => !value);
  }
}
