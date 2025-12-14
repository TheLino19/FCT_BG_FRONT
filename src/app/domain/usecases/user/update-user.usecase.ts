import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../interfaces/user.repository';
import { ResponseModel, UserEditRequest } from '../../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UpdateUserUseCase {
    constructor(private userRepository: UserRepository) { }

    execute(user: UserEditRequest): Observable<ResponseModel<string>> {
        return this.userRepository.updateUser(user);
    }
}
