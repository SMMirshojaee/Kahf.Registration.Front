import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config'; // add this
import Aura from '@primeng/themes/aura'; // add this
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
// import lara from '@primeng/themes/lara'; // add this
// import material from '@primeng/themes/material'; // add this
// import nora from '@primeng/themes/nora'; // add this

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Aura, 
        options: {
          // darkModeSelector: false || 'none',
          darkModeSelector: '.app-dark-style'
        }
      },
    }),
  ]
};
