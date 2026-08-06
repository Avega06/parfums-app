import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { ChatBot } from '../../services/ChatBot';

import { MarkdownModule } from 'ngx-markdown';
import { ThemeStore } from '../../../core/services/ThemeStore';
import { GsapService } from '../../../core/services';
import { UserStore } from '../../stores';
import { AutoGrowDirective } from '../../directives/AutoGrow';
import { isPlatformBrowser } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-chatbot',
  templateUrl: './Chatbot.html',
  imports: [MarkdownModule, AutoGrowDirective],
})
export class ChatbotComponent {
  pacoElement = viewChild<ElementRef<HTMLDivElement>>('pacoSniff');

  private chatBootService = inject(ChatBot);
  private themeStore = inject(ThemeStore);
  userStore = inject(UserStore);

  #platformId = inject(PLATFORM_ID);
  #isBrowser = isPlatformBrowser(this.#platformId);

  private gsapService = inject(GsapService);

  closeChatbot = output<boolean>();

  productName = input.required<string>();

  input = signal<string>('');
  loading = signal<boolean>(false);
  isMinimize = signal<boolean>(true);
  sessionId = signal<string>(crypto.randomUUID());

  messages_theme = computed<string>(() => {
    return this.themeStore.theme() === 'light' ? 'caramellatte' : 'luxury';
  });

  messagesContainer =
    viewChild<ElementRef<HTMLDivElement>>('messagesContainer');

  messages = signal<{ role: 'user' | 'agent'; text: string }[]>([]);

  syncSessionEffect = effect(() => {
    const product = this.productName();
    if (!product) return;

    const storageKey = `paco_sid_${product.toLowerCase().replace(/\s+/g, '_')}`;

    if (this.#isBrowser) {
      const existingSid = sessionStorage.getItem(storageKey);

      if (existingSid) {
        this.sessionId.set(existingSid);
      } else {
        this.clearOtherPacoSessions();

        const newUuid = crypto.randomUUID();
        sessionStorage.setItem(storageKey, newUuid);
        this.sessionId.set(newUuid);

        this.messages.set([]);
      }
    }
  });

  private clearOtherPacoSessions() {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith('paco_sid_'))
      .forEach((key) => sessionStorage.removeItem(key));
  }

  async send(event: Event) {
    event.preventDefault();
    const value = this.input().trim();
    if (!value || this.loading()) return;

    // 1. Agregar mensaje del usuario y activar loading
    this.messages.update((m) => [...m, { role: 'user', text: value }]);
    this.input.set('');
    this.loading.set(true);

    // 2. Preparar el mensaje del agente
    this.messages.update((m) => [...m, { role: 'agent', text: '' }]);

    // 3. Scroll exacto + Padding temporal
    requestAnimationFrame(() => {
      const container = this.messagesContainer()?.nativeElement;
      if (!container) return;

      const userMessages = container.querySelectorAll('.chat-end');
      const lastUserMsg = userMessages[userMessages.length - 1] as HTMLElement;

      if (lastUserMsg) {
        // Asignamos padding temporal igual al alto del contenedor
        // Esto le da el espacio necesario al scroll para subir la pregunta al tope
        container.style.paddingBottom = `${container.clientHeight}px`;

        const containerRect = container.getBoundingClientRect();
        const msgRect = lastUserMsg.getBoundingClientRect();

        const targetScrollTop =
          container.scrollTop + (msgRect.top - containerRect.top) - 12;

        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth',
        });
      }
    });

    try {
      await this.chatBootService.sendMessageStream(
        {
          sessionId: this.sessionId(),
          message: value,
          user: 'user',
          product_name: this.productName(),
        },
        (content) => {
          this.messages.update((msgs) => {
            const last = msgs[msgs.length - 1];
            if (last && last.role === 'agent') {
              const newMsgs = [...msgs];
              newMsgs[msgs.length - 1] = {
                ...last,
                text: last.text + content,
              };
              return newMsgs;
            }
            return msgs;
          });
        },
      );
    } catch (err) {
      console.error(err);
    } finally {
      this.loading.set(false);

      // 4. Limpieza: Se remueve el padding temporal al finalizar el stream
      const container = this.messagesContainer()?.nativeElement;
      if (container) {
        container.style.paddingBottom = '';
      }
    }
  }
  handleClose() {
    this.closeChatbot.emit(false);
  }

  handleMinimize() {
    this.isMinimize.set(!this.isMinimize());
  }
}
