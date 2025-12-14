import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceRepository } from '../../interfaces/invoice.repository';
import { InvoiceListResponse } from '../../models/invoice.model';

@Injectable({
    providedIn: 'root'
})
export class GetInvoicesUseCase {
    constructor(private invoiceRepository: InvoiceRepository) { }

    execute(
        filterNumber: string,
        filterDate: string,
        filterAmount: number | null,
        filterState: boolean | null,
        pageNumber: number,
        pageSize: number
    ): Observable<InvoiceListResponse> {
        return this.invoiceRepository.getInvoices(filterNumber, filterDate, filterAmount, filterState, pageNumber, pageSize);
    }
}
