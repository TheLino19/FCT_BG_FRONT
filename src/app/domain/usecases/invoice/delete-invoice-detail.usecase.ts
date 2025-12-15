import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceRepository } from '../../interfaces/invoice.repository';
import { ResponseModel } from '../../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class DeleteInvoiceDetailUseCase {
    constructor(private invoiceRepository: InvoiceRepository) { }

    execute(id: number): Observable<ResponseModel<number>> {
        return this.invoiceRepository.deleteInvoiceDetail(id);
    }
}
