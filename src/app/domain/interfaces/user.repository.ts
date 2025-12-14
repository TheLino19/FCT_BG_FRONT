import { Observable } from 'rxjs';
import { ResponseModel, UserEditRequest, UserRequest, UserResponse } from '../models/user.model';

export interface UserRepository {
    getUsers(state: boolean | null, name: string, pageNumber: number, pageSize: number): Observable<ResponseModel<UserResponse[]>>;
    getUserById(id: number): Observable<ResponseModel<UserResponse>>;
    createUser(user: UserRequest): Observable<ResponseModel<string>>;
    updateUser(user: UserEditRequest): Observable<ResponseModel<string>>;
    deleteUser(id: number): Observable<ResponseModel<number>>;
}
