import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  model,
  viewChild,
} from '@angular/core';
import { GsapService } from '../../../core/services';

@Component({
  selector: 'toast-message',
  imports: [],
  templateUrl: './ToastMessage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastMessage {
  message = model<string | null>(null);

  private gsapService = inject(GsapService);

  toastRef = viewChild<ElementRef>('toastRef');

  constructor() {
    effect(() => {
      const currentMessage = this.message();
      const el = this.toastRef()?.nativeElement;

      // Si hay un mensaje y el elemento ya existe en el DOM
      if (currentMessage && el) {
        this.gsapService.toastIn(el);

        // Iniciamos el temporizador de salida
        setTimeout(() => {
          this.closeToast();
        }, 3000);
      }
    });
  }
  private closeToast() {
    const el = this.toastRef()?.nativeElement;
    if (el) {
      this.gsapService.toastOut(el, {
        onComplete: () => {
          // Al terminar la animación, notificamos al padre seteando el model a null
          this.message.set(null);
        },
      });
    }
  }
}
