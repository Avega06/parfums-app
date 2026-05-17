import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div
      class="min-h-screen w-full flex items-center justify-center p-4
             bg-[url('/perfumes.webp')] bg-cover bg-center bg-no-repeat"
    >
      <div class="absolute inset-0 bg-black/20"></div>

      <div class="relative z-10 w-full flex justify-center">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export default class AuthLayoutComponent {}
