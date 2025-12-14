import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { UserRepositoryImpl } from './data/repositories/user.repository.impl';
import { ClientRepositoryImpl } from './data/repositories/client.repository.impl';
import { InvoiceRepositoryImpl } from './data/repositories/invoice.repository.impl';
import { ProductRepositoryImpl } from './data/repositories/product.repository.impl';
import { UserRepository } from './domain/interfaces/user.repository';
import { ClientRepository } from './domain/interfaces/client.repository';
import { InvoiceRepository } from './domain/interfaces/invoice.repository';
import { ProductRepository } from './domain/interfaces/product.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: UserRepository, useClass: UserRepositoryImpl },
    { provide: ClientRepository, useClass: ClientRepositoryImpl },
    { provide: InvoiceRepository, useClass: InvoiceRepositoryImpl },
    { provide: ProductRepository, useClass: ProductRepositoryImpl }
  ]
};
