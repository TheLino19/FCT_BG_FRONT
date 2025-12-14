import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientRepository } from '../../interfaces/client.repository';
import { ResponseModel } from '../../models/client.model';

@Injectable({
    providedIn: 'root'
})
export class DeleteClientUseCase {
    constructor(@Inject('ClientRepository') private clientRepository: ClientRepository) { }

    execute(id: number): Observable<ResponseModel<number>> {
        return this.clientRepository.deleteClient(id);
    }
}
