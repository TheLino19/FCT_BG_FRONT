import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvoiceRequest, InvoiceListResponse, InvoiceSingleResponse, InvoiceEditRequest, InvoiceUpdateRequest } from '../../domain/models/invoice.model';
import { ResponseModel } from '../../domain/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class InvoiceApiService {
    private apiUrl = 'https://localhost:7224';

    constructor(private http: HttpClient) { }

    getInvoices(
        filterNumber: string,
        filterDate: string,
        filterAmount: number | null,
        filterState: boolean | null,
        pageNumber: number,
        pageSize: number
    ): Observable<InvoiceListResponse> {
        let params = new HttpParams()
            .set('PageNumber', pageNumber)
            .set('PageSize', pageSize);

        if (filterNumber) params = params.set('FiltroNumeroFactura', filterNumber);
        if (filterDate) params = params.set('FiltroFecha', filterDate);
        if (filterAmount !== null) params = params.set('FiltroMonto', filterAmount);
        if (filterState !== null) params = params.set('FiltroEstado', filterState);

        return this.http.post<InvoiceListResponse>(`${this.apiUrl}/ObtenerFacturas`, null, { params });
    }

    getInvoiceById(id: number): Observable<InvoiceSingleResponse> {
        const params = new HttpParams().set('Id', id);
        return this.http.post<InvoiceSingleResponse>(`${this.apiUrl}/ObtenerFactura`, null, { params });
    }

    createInvoice(invoice: InvoiceRequest): Observable<ResponseModel<string>> {
        return this.http.post<ResponseModel<string>>(`${this.apiUrl}/CrearFactura`, invoice);
    }

    insertInvoiceDetails(details: InvoiceEditRequest[]): Observable<ResponseModel<string>> {
        return this.http.post<ResponseModel<string>>(`${this.apiUrl}/InsertarDetalleFactura`, details);
    }

    deleteInvoiceDetail(id: number): Observable<ResponseModel<number>> {
        const params = new HttpParams().set('Id', id);
        return this.http.post<ResponseModel<number>>(`${this.apiUrl}/EliminarDetalleFactura`, {}, { params });
    }

    deleteInvoice(id: number): Observable<ResponseModel<number>> {
        const params = new HttpParams().set('Id', id);
        return this.http.post<ResponseModel<number>>(`${this.apiUrl}/EliminarFactura`, null, { params });
    }
}
