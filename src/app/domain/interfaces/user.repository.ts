import { Observable } from 'rxjs';
import { ResponseModel, UserEditRequest, UserRequest, UserResponse } from '../models/user.model';

export abstract class UserRepository {
    abstract getUsers(state: boolean | null, name: string, pageNumber: number, pageSize: number): Observable<ResponseModel<UserResponse[]>>;
    abstract getUserById(id: number): Observable<ResponseModel<UserResponse>>;
    abstract createUser(user: UserRequest): Observable<ResponseModel<string>>;
    abstract updateUser(user: UserEditRequest): Observable<ResponseModel<string>>;
    abstract deleteUser(id: number): Observable<ResponseModel<number>>;
}
