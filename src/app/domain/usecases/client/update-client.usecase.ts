import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientRepository } from '../../interfaces/client.repository';
import { ClientEditRequest, ResponseModel } from '../../models/client.model';

@Injectable({
    providedIn: 'root'
})
export class UpdateClientUseCase {
    constructor(@Inject('ClientRepository') private clientRepository: ClientRepository) { }

    execute(client: ClientEditRequest): Observable<ResponseModel<string>> {
        return this.clientRepository.updateClient(client);
    }
}
