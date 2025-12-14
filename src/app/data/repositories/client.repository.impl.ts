import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientRepository } from '../../domain/interfaces/client.repository';
import { ClientEditRequest, ClientRequest, ClientResponse, ResponseModel } from '../../domain/models/client.model';
import { ClientApiService } from '../sources/client-api.service';

@Injectable({
    providedIn: 'root'
})
export class ClientRepositoryImpl implements ClientRepository {
    constructor(private clientApiService: ClientApiService) { }

    getClients(state: boolean | null, name: string, pageNumber: number, pageSize: number): Observable<ResponseModel<ClientResponse[]>> {
        return this.clientApiService.getClients(state, name, pageNumber, pageSize);
    }

    getClientById(id: number): Observable<ResponseModel<ClientResponse>> {
        return this.clientApiService.getClientById(id);
    }

    createClient(client: ClientRequest): Observable<ResponseModel<string>> {
        return this.clientApiService.create(client);
    }

    updateClient(client: ClientEditRequest): Observable<ResponseModel<string>> {
        return this.clientApiService.update(client);
    }

    deleteClient(id: number): Observable<ResponseModel<number>> {
        return this.clientApiService.delete(id);
    }
}
