import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../interfaces/user.repository';
import { ResponseModel, UserResponse } from '../../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class GetUsersUseCase {
    constructor(private userRepository: UserRepository) { }

    execute(state: boolean | null, name: string, pageNumber: number, pageSize: number): Observable<ResponseModel<UserResponse[]>> {
        return this.userRepository.getUsers(state, name, pageNumber, pageSize);
    }
}
