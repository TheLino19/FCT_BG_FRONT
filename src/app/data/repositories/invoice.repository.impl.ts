import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceRepository } from '../../domain/interfaces/invoice.repository';
import { InvoiceApiService } from '../sources/invoice-api.service';
import { InvoiceRequest, InvoiceListResponse, InvoiceSingleResponse } from '../../domain/models/invoice.model';
import { ResponseModel } from '../../domain/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class InvoiceRepositoryImpl implements InvoiceRepository {
    constructor(private apiService: InvoiceApiService) { }

    getInvoices(
        filterNumber: string,
        filterDate: string,
        filterAmount: number | null,
        filterState: boolean | null,
        pageNumber: number,
        pageSize: number
    ): Observable<InvoiceListResponse> {
        return this.apiService.getInvoices(filterNumber, filterDate, filterAmount, filterState, pageNumber, pageSize);
    }

    getInvoiceById(id: number): Observable<InvoiceSingleResponse> {
        return this.apiService.getInvoiceById(id);
    }

    createInvoice(invoice: InvoiceRequest): Observable<ResponseModel<string>> {
        return this.apiService.createInvoice(invoice);
    }

    deleteInvoice(id: number): Observable<ResponseModel<number>> {
        return this.apiService.deleteInvoice(id);
    }
}
