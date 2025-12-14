import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientRepository } from '../../interfaces/client.repository';
import { ClientResponse, ResponseModel } from '../../models/client.model';

@Injectable({
    providedIn: 'root'
})
export class GetClientsUseCase {
    constructor(private clientRepository: ClientRepository) { }

    execute(state: boolean | null, name: string, pageNumber: number, pageSize: number): Observable<ResponseModel<ClientResponse[]>> {
        return this.clientRepository.getClients(state, name, pageNumber, pageSize);
    }
}
