import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientRepository } from '../../interfaces/client.repository';
import { ClientRequest, ResponseModel } from '../../models/client.model';

@Injectable({
    providedIn: 'root'
})
export class CreateClientUseCase {
    constructor(private clientRepository: ClientRepository) { }

    execute(client: ClientRequest): Observable<ResponseModel<string>> {
        return this.clientRepository.createClient(client);
    }
}
