import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceRepository } from '../../interfaces/invoice.repository';
import { InvoiceRequest } from '../../models/invoice.model';
import { ResponseModel } from '../../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class CreateInvoiceUseCase {
    constructor(private invoiceRepository: InvoiceRepository) { }

    execute(invoice: InvoiceRequest): Observable<ResponseModel<string>> {
        return this.invoiceRepository.createInvoice(invoice);
    }
}
