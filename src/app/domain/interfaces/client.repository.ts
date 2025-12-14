import { Observable } from 'rxjs';
import { ClientEditRequest, ClientRequest, ClientResponse, ResponseModel } from '../models/client.model';

export interface ClientRepository {
    getClients(state: boolean | null, name: string, pageNumber: number, pageSize: number): Observable<ResponseModel<ClientResponse[]>>;
    getClientById(id: number): Observable<ResponseModel<ClientResponse>>;
    createClient(client: ClientRequest): Observable<ResponseModel<string>>;
    updateClient(client: ClientEditRequest): Observable<ResponseModel<string>>;
    deleteClient(id: number): Observable<ResponseModel<number>>;
}
