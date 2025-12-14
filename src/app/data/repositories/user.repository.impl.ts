import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../domain/interfaces/user.repository';
import { ResponseModel, UserEditRequest, UserRequest, UserResponse } from '../../domain/models/user.model';
import { UserApiService } from '../sources/user-api.service';

@Injectable({
    providedIn: 'root'
})
export class UserRepositoryImpl implements UserRepository {
    constructor(private userApiService: UserApiService) { }

    getUsers(state: boolean, name: string, pageNumber: number, pageSize: number): Observable<ResponseModel<UserResponse[]>> {
        return this.userApiService.getUsers(state, name, pageNumber, pageSize);
    }

    getUserById(id: number): Observable<ResponseModel<UserResponse>> {
        return this.userApiService.getUserById(id);
    }

    createUser(user: UserRequest): Observable<ResponseModel<string>> {
        return this.userApiService.create(user);
    }

    updateUser(user: UserEditRequest): Observable<ResponseModel<string>> {
        return this.userApiService.update(user);
    }

    deleteUser(id: number): Observable<ResponseModel<number>> {
        return this.userApiService.delete(id);
    }
}
