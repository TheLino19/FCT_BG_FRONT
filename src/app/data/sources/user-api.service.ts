import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel, UserEditRequest, UserRequest, UserResponse } from '../../domain/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserApiService {
    private apiUrl = 'https://localhost:7224'; // Base URL

    constructor(private http: HttpClient) { }

    getUsers(state: boolean | null, name: string, pageNumber: number, pageSize: number): Observable<ResponseModel<UserResponse[]>> {
        let params = new HttpParams()
            .set('PageNumber', pageNumber)
            .set('PageSize', pageSize);

        if (state !== null) {
            params = params.set('Estado', state);
        }
        if (name) {
            params = params.set('Nombre', name);
        }

        return this.http.post<ResponseModel<UserResponse[]>>(`${this.apiUrl}/ObtenerUsuarios`, {}, { params });
    }

    getUserById(id: number): Observable<ResponseModel<UserResponse>> {
        let params = new HttpParams().set('Id', id);
        return this.http.post<ResponseModel<UserResponse>>(`${this.apiUrl}/ObtenerUsuario`, {}, { params });
    }

    create(user: UserRequest): Observable<ResponseModel<string>> {
        return this.http.post<ResponseModel<string>>(`${this.apiUrl}/CrearUsuario`, user);
    }

    update(user: UserEditRequest): Observable<ResponseModel<string>> {
        return this.http.post<ResponseModel<string>>(`${this.apiUrl}/EditarUsuario`, user);
    }

    delete(id: number): Observable<ResponseModel<number>> {
        let params = new HttpParams().set('Id', id);
        return this.http.post<ResponseModel<number>>(`${this.apiUrl}/EliminarUsuarios`, {}, { params });
    }
}
