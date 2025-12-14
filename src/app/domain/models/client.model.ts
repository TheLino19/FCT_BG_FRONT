import { ResponseModel } from './user.model';

export type { ResponseModel };

export interface ClientRequest {
    identificacion: string;
    tipoIdentifiacion: string;
    nombre: string;
    telefono: string;
    email: string;
    direccion: string;
}

export interface ClientEditRequest {
    id: number;
    nombre: string;
    telefono: string;
    email: string;
    direccion: string;
}

export interface ClientResponse {
    clienteId: number;
    nombre: string;
    telefono: string;
    correo: string;
    direccion: string;
    activo: boolean;
    fechaRegistro: string;
}
