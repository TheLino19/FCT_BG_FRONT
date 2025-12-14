import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientEditRequest, ClientRequest, ClientResponse, ResponseModel } from '../../domain/models/client.model';

@Injectable({
    providedIn: 'root'
})
export class ClientApiService {
    private apiUrl = 'https://localhost:7224'; // Base URL

    constructor(private http: HttpClient) { }

    getClients(state: boolean | null, name: string, pageNumber: number, pageSize: number): Observable<ResponseModel<ClientResponse[]>> {
        let params = new HttpParams()
            .set('PageNumber', pageNumber)
            .set('PageSize', pageSize);

        if (state !== null) {
            params = params.set('Estado', state);
        }
        if (name) {
            params = params.set('Nombre', name);
        }

        return this.http.post<ResponseModel<ClientResponse[]>>(`${this.apiUrl}/ObtenerClientes`, {}, { params });
    }

    getClientById(id: number): Observable<ResponseModel<ClientResponse>> {
        let params = new HttpParams().set('Id', id);
        return this.http.post<ResponseModel<ClientResponse>>(`${this.apiUrl}/ObtenerCliente`, {}, { params });
    }

    create(client: ClientRequest): Observable<ResponseModel<string>> {
        return this.http.post<ResponseModel<string>>(`${this.apiUrl}/CrearCliente`, client);
    }

    update(client: ClientEditRequest): Observable<ResponseModel<string>> {
        return this.http.post<ResponseModel<string>>(`${this.apiUrl}/EditarCliente`, client);
    }

    delete(id: number): Observable<ResponseModel<number>> {
        let params = new HttpParams().set('Id', id);
        return this.http.post<ResponseModel<number>>(`${this.apiUrl}/EliminarCliente`, {}, { params });
    }
}
