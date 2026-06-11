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

  async sendMessageStream(payload: any, onChunk: (text: string) => void) {
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
    let lastDispatchedIndex = 0; // Para no repetir texto ya enviado del mismo objeto
    let currentObjectNode = ''; // Para saber de qué nodo viene el texto

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // 1. Detectar en qué nodo estamos (Orchestrator o Analyst)
      // Buscamos el último "nodeName" que apareció en el buffer
      const nodeMatch = buffer.match(/"nodeName"\s*:\s*"([^"]+)"/g);
      if (nodeMatch) {
        currentObjectNode = nodeMatch[nodeMatch.length - 1];
      }

      // 2. Extraer el contenido de la propiedad "content" aunque el JSON no haya terminado
      // Buscamos lo que hay entre "content":"  y la siguiente comilla no escapada
      const contentRegex = /"content"\s*:\s*"((?:[^"\\]|\\.)*)/g;
      let match;

      while ((match = contentRegex.exec(buffer)) !== null) {
        // await new Promise((resolve) => setTimeout(resolve, 50));
        // match[1] contiene el texto dentro de "content" (con escapes como \n o \")
        let fullContent = match[1];

        // Solo procesamos si es del Analyst (o quita este IF si quieres ver TODO)
        if (!currentObjectNode.includes('Orchestrator')) {
          if (fullContent.length > lastDispatchedIndex) {
            // Extraemos solo lo NUEVO
            let newPiece = fullContent.substring(lastDispatchedIndex);

            // Limpiamos los escapes de caracteres (ej: de \n a salto de línea real)
            newPiece = this.unescapeJsonString(newPiece);

            onChunk(newPiece);
            lastDispatchedIndex = fullContent.length;
          }
        }
      }

      // 3. Si detectamos que un objeto JSON se cerró totalmente, reseteamos el índice
      // para el siguiente objeto que venga en el stream.
      if (buffer.includes('}')) {
        // Si hay una llave de cierre, el siguiente "content" empezará de cero
        // Solo reseteamos si la llave está después del último match
        lastDispatchedIndex = 0;
        // Opcional: limpiar buffer de objetos ya cerrados para ahorrar memoria
        const lastBrace = buffer.lastIndexOf('}');
        if (lastBrace > 0) buffer = buffer.substring(lastBrace);
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
