import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'verify-email',
  imports: [],
  templateUrl: './verify-email.html',
  styles: [
    `
      .verify-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .card {
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        text-align: center;
        max-width: 400px;
      }
      .instruction {
        color: #666;
        margin: 1.5rem 0;
      }
      button {
        background: #3c82f6;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
      }
    `,
  ],
})
export default class VerifyEmail {
  private router = inject(Router);

  goToLogin() {
    this.router.navigate(['auth/login']);
  }
}
