import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Message {
  message: string;
  sessionId: string;
  product_name: string;
  user: 'user' | 'agent';
}

@Service()
export class ChatBot {
  private http = inject(HttpClient);

  sendMessage(msg: Message): Observable<Message> {
    return this.http.post<Message>('', msg);
  }

  async sendMessageStream(
    payload: unknown,
    onChunk: (text: string) => void,
  ): Promise<void> {
    const response = await fetch('http://localhost:3000/paco-ai/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'cors',
    });

    if (!response.body) throw new Error('No body');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = '';
    let lastDispatchedIndex = 0; // Control de posición dentro del "content" activo
    let currentObjectNode = ''; // Guardará el nodo/agente actual

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // 1. Detectar cambio de nodo/agente en el buffer
      const nodeMatch = buffer.match(/"nodeName"\s*:\s*"([^"]+)"/g);
      if (nodeMatch) {
        const latestNode = nodeMatch[nodeMatch.length - 1];

        // Si el stream cambió a un agente distinto, reiniciamos el rastreo de caracteres
        if (currentObjectNode !== latestNode) {
          currentObjectNode = latestNode;
          lastDispatchedIndex = 0;
        }
      }

      // 2. Omitir el Orchestrator y procesar el stream de cualquier otro agente
      const isOrchestrator = currentObjectNode.includes('Orchestrator');

      if (!isOrchestrator) {
        const contentRegex = /"content"\s*:\s*"((?:[^"\\]|\\.)*)/g;
        let match: RegExpExecArray | null;

        while ((match = contentRegex.exec(buffer)) !== null) {
          const fullContent = match[1];

          if (fullContent.length > lastDispatchedIndex) {
            // Extraemos solo lo nuevo recibido en este chunk
            let newPiece = fullContent.substring(lastDispatchedIndex);

            // Convertimos las secuencias escapadas en caracteres reales
            newPiece = this.unescapeJsonString(newPiece);

            onChunk(newPiece);
            lastDispatchedIndex = fullContent.length;
          }
        }
      }

      // 3. Limpieza de buffer cuando se cierra un objeto JSON
      if (buffer.includes('}')) {
        const lastBrace = buffer.lastIndexOf('}');
        if (lastBrace > 0) {
          buffer = buffer.substring(lastBrace + 1);
          lastDispatchedIndex = 0; // Reseteo de índice para el próximo objeto JSON del stream
        }
      }
    }
  }

  // Función auxiliar para convertir "\n" en saltos de línea y \" en comillas
  private unescapeJsonString(str: string): string {
    return str
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\');
  }
}
