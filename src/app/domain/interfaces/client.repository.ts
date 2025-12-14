import { Observable } from 'rxjs';
import { ClientEditRequest, ClientRequest, ClientResponse, ResponseModel } from '../models/client.model';

export abstract class ClientRepository {
    abstract getClients(state: boolean | null, name: string, pageNumber: number, pageSize: number): Observable<ResponseModel<ClientResponse[]>>;
    abstract getClientById(id: number): Observable<ResponseModel<ClientResponse>>;
    abstract createClient(client: ClientRequest): Observable<ResponseModel<string>>;
    abstract updateClient(client: ClientEditRequest): Observable<ResponseModel<string>>;
    abstract deleteClient(id: number): Observable<ResponseModel<number>>;
}
