import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';

@Directive({
  selector: 'textarea[autoGrow]',
  standalone: true,
})
export class AutoGrowDirective implements OnInit {
  private el = inject(ElementRef<HTMLTextAreaElement>);

  ngOnInit(): void {
    this.adjustHeight();
  }

  @HostListener('input')
  onInput(): void {
    this.adjustHeight();
  }

  private adjustHeight(): void {
    const textarea = this.el.nativeElement;

    // 1. Forzamos el reset de la altura para que pueda encogerse si borras texto
    textarea.style.height = 'auto';

    // 2. Asignamos la altura del scroll interno del contenido
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
