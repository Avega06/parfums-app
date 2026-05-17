import { provideServerRendering, withAppShell, withRoutes } from '@angular/ssr';
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import AppShellComponent from './app-shell/app-shell.component';
import { CookieService } from 'ngx-cookie-service';

const serverConfig: ApplicationConfig = {
  providers: [
    CookieService,
    provideServerRendering(
      withRoutes(serverRoutes),
      withAppShell(AppShellComponent),
    ),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
