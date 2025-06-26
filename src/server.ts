import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/context.mjs';

const angularAppEngine = new AngularAppEngine();

export async function netlifyAppEngineHandler(
  request: Request
): Promise<Response> {
  const context = getContext();

  // Puedes definir aquí endpoints API, si quieres
  // const pathname = new URL(request.url).pathname;
  // if (pathname === '/api/hello') {
  //   return Response.json({ message: 'Hello from the API' });
  // }

  const result = await angularAppEngine.handle(request, context);
  return result || new Response('Not found', { status: 404 });
}

/**
 * El handler que Angular CLI usa para SSR (dev y build).
 */
export const reqHandler = createRequestHandler(netlifyAppEngineHandler);
