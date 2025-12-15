import { Observable } from 'rxjs';
import { InvoiceRequest, InvoiceListResponse, InvoiceSingleResponse, InvoiceEditRequest, InvoiceUpdateRequest } from '../models/invoice.model';
import { ResponseModel } from '../models/user.model';

export abstract class InvoiceRepository {
    abstract getInvoices(
        filterNumber: string,
        filterDate: string,
        filterAmount: number | null,
        filterState: boolean | null,
        pageNumber: number,
        pageSize: number
    ): Observable<InvoiceListResponse>;

    abstract getInvoiceById(id: number): Observable<InvoiceSingleResponse>;
    abstract createInvoice(invoice: InvoiceRequest): Observable<ResponseModel<string>>;
    abstract insertInvoiceDetails(details: InvoiceEditRequest[]): Observable<ResponseModel<string>>;
    abstract deleteInvoiceDetail(id: number): Observable<ResponseModel<number>>;
    abstract deleteInvoice(id: number): Observable<ResponseModel<number>>;
}
