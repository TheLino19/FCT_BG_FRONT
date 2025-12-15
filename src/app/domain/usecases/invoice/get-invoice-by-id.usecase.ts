import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceRepository } from '../../interfaces/invoice.repository';
import { InvoiceSingleResponse } from '../../models/invoice.model';

@Injectable({
    providedIn: 'root'
})
export class GetInvoiceByIdUseCase {
    constructor(private invoiceRepository: InvoiceRepository) { }

    execute(id: number): Observable<InvoiceSingleResponse> {
        return this.invoiceRepository.getInvoiceById(id);
    }
}
