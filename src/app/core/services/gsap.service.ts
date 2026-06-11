import { Service } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

@Service()
export class GsapService {
  constructor() {
    gsap.registerPlugin(ScrollToPlugin);
  }

  fadeIn(element: Element, options: gsap.TweenVars = {}) {
    gsap.fromTo(
      element,

      { opacity: 0, y: 40 },

      { opacity: 1, y: 0, duration: 0.2, ease: 'power2.in', ...options },
    );
  }

  zoomIn(element: Element, options: gsap.TweenVars = {}) {
    gsap.fromTo(
      element,

      { scale: 1 },

      {
        scale: 1.1,

        duration: 0.2,

        ease: 'power2.out',

        yoyo: true,

        repeat: 1,

        ...options,
      },
    );
  }

  animatePacoSniff(element: HTMLElement) {
    return gsap.to(element, {
      // 96px * 4 saltos = 384px (para llegar al 5to perro)

      backgroundPositionX: '-383.5px',

      ease: 'steps(4)',

      duration: 1, // Ajusta la velocidad del olfateo

      repeat: -1,
    });
  }

  scrollToElementTop(
    container: HTMLElement,

    target: HTMLElement,

    options: gsap.TweenVars = {},
  ) {
    gsap.to(container, {
      scrollTo: {
        y: target.offsetTop - 5, // El -16 deja un margen elegante arriba (1rem)

        autoKill: true, // Permite que el usuario interrumpa el scroll si mueve el mouse
      },

      duration: 0.8,

      ease: 'power3.out', // Un ease suave y moderno, muy "Gemini"

      ...options,
    });
  }

  /**
   * Animación de entrada para un Toast de DaisyUI.
   * Por defecto entra desde la derecha con un efecto de rebote suave.
   */
  toastIn(element: HTMLElement, options: gsap.TweenVars = {}) {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        x: 100,
        scale: 0.9,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.2)', // Ese pequeño rebote que lo hace sentir orgánico
        ...options,
      },
    );
  }

  /**
   * Animación de salida para el Toast.
   * Se desvanece y se desplaza ligeramente antes de ser removido del DOM.
   */
  toastOut(element: HTMLElement, options: gsap.TweenVars = {}) {
    return gsap.to(element, {
      opacity: 0,
      x: 50,
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.in',
      ...options,
    });
  }

  // Por si quieres que el toast "tiemble" si es un error (estilo feedback táctil)
  shake(element: HTMLElement) {
    gsap.fromTo(
      element,
      { x: -4 },
      { x: 4, duration: 0.1, repeat: 5, yoyo: true, ease: 'none' },
    );
  }
}
