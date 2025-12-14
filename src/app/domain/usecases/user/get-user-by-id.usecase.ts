import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../interfaces/user.repository';
import { ResponseModel, UserResponse } from '../../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class GetUserByIdUseCase {
    constructor(private userRepository: UserRepository) { }

    execute(id: number): Observable<ResponseModel<UserResponse>> {
        return this.userRepository.getUserById(id);
    }
}
