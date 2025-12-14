import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../interfaces/user.repository';
import { ResponseModel, UserRequest } from '../../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class CreateUserUseCase {
    constructor(@Inject('UserRepository') private userRepository: UserRepository) { }

    execute(user: UserRequest): Observable<ResponseModel<string>> {
        return this.userRepository.createUser(user);
    }
}
