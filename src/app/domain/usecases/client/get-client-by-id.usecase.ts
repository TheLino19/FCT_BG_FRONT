import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientRepository } from '../../interfaces/client.repository';
import { ClientResponse, ResponseModel } from '../../models/client.model';

@Injectable({
    providedIn: 'root'
})
export class GetClientByIdUseCase {
    constructor(@Inject('ClientRepository') private clientRepository: ClientRepository) { }

    execute(id: number): Observable<ResponseModel<ClientResponse>> {
        return this.clientRepository.getClientById(id);
    }
}
