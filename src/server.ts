import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import { createClient } from '@supabase/supabase-js';
import { REQUEST_COOKIES_MAP } from '../src/app/supabase.config';
import express from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const browserDistFolder = join(__dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use(async (req, res, next) => {
  const cookieString = req.headers.cookie ?? '';

  // Parsear cookies a un objeto simple (CookieMap)
  const cookieMap = Object.fromEntries(
    cookieString
      .split('; ')
      .map((c) => {
        const [key, ...v] = c.split('=');
        return [key.trim(), v.join('=')];
      })
      .filter((parts) => parts[0] !== ''),
  );

  const supabaseUrl = process.env['NG_SUPABASE_URL'] ?? '';
  const supabaseKey = process.env['NG_SUPABASE_KEY'] ?? '';

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Faltan las variables de entorno de Supabase en process.env',
    );
  }

  // Opcional: Si aún quieres el objeto user para otras rutas de Express
  const supabase = createClient(
    supabaseUrl,
    supabaseKey, // Usa la anon key
    {
      global: { headers: { cookie: cookieString } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  (req as any).user = user;
  (req as any).cookieMap = cookieMap; // Guardamos el mapa en el request

  next();
});

// 2. Handler de Angular
app.use((req, res, next) => {
  angularApp
    .handle(req, {
      providers: [
        // PROVEER EL VALOR AQUÍ
        {
          provide: REQUEST_COOKIES_MAP,
          useValue: (req as any).cookieMap ?? {},
        },
        {
          provide: 'SSR_USER',
          useValue: (req as any).user ?? null,
        },
      ],
    })
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 5000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
