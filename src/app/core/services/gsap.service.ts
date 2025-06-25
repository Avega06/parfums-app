import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root',
})
export class GsapService {
  constructor() {
    gsap.registerPlugin();
  }

  fadeIn(element: Element, options: gsap.TweenVars = {}) {
    gsap.fromTo(
      element,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.2, ease: 'power2.in', ...options }
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
      }
    );
  }
}
