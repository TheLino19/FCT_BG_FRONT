import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../interfaces/user.repository';
import { ResponseModel } from '../../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class DeleteUserUseCase {
    constructor(private userRepository: UserRepository) { }

    execute(id: number): Observable<ResponseModel<number>> {
        return this.userRepository.deleteUser(id);
    }
}
