import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { UserRepositoryImpl } from './data/repositories/user.repository.impl';
import { ClientRepositoryImpl } from './data/repositories/client.repository.impl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: 'UserRepository', useClass: UserRepositoryImpl },
    { provide: 'ClientRepository', useClass: ClientRepositoryImpl }
  ]
};
