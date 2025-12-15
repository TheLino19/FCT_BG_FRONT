import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceRepository } from '../../interfaces/invoice.repository';
import { InvoiceEditRequest } from '../../models/invoice.model';
import { ResponseModel } from '../../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class InsertInvoiceDetailsUseCase {
    constructor(private invoiceRepository: InvoiceRepository) { }

    execute(details: InvoiceEditRequest[]): Observable<ResponseModel<string>> {
        return this.invoiceRepository.insertInvoiceDetails(details);
    }
}
