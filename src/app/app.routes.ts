import { Routes } from '@angular/router';
import { UserComponent } from './presentation/pages/user/user.component';
import { ClientComponent } from './presentation/pages/client/client.component';
import { InvoiceComponent } from './presentation/pages/invoice/invoice.component';
import { InvoiceCreateComponent } from './presentation/pages/invoice/invoice-create/invoice-create.component';
import { ProductComponent } from './presentation/pages/product/product.component';

export const routes: Routes = [
    { path: 'user', component: UserComponent },
    { path: 'client', component: ClientComponent },
    { path: 'invoice', component: InvoiceComponent },
    { path: 'invoice/create', component: InvoiceCreateComponent },
    { path: 'product', component: ProductComponent },
    { path: '', redirectTo: '/user', pathMatch: 'full' }
];
