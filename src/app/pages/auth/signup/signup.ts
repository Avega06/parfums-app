import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../shared/services';
import { SocialButtons } from '../../../shared/components';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, SocialButtons],
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

  form = signal({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  async onSubmit() {
    if (this.form().password !== this.form().confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    const { data, error } = await this.authService.signUp(
      this.form().email,
      this.form().password,
      { first_name: this.form().firstName, last_name: this.form().lastName },
    );
    if (error) console.error(error);
    else alert('Revisa tu correo de confirmación');
  }

  async socialLogin(provider: any) {
    await this.authService.loginWithProvider(provider);
  }
}
