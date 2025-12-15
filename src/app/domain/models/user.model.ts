export interface ResponseModel<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: string[];
}

export interface UserRequest {
    userName: string;
    passwordHash: string;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
}

export interface UserEditRequest {
    id: string;
    nombre: string;
    apellidos: string;
    email: string;
    rol: string;
}

export interface UserResponse {
    idUsuario: number;
    nombres: string;
    userName: string;
    email: string;
    rol: string;
    activo: boolean;
    fechaCreacion: string; 
}
