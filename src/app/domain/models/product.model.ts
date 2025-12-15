
export interface ProductResponse {
    productoId: number;
    nombre: string;
    codigo: string;
    precioUnitario: number;
    activo: boolean;
}


export interface ProductCreateRequest {
    codigo: string;
    nombre: string;
    precioUnitario: number;
}


export interface ProductEditRequest {
    id: number;
    codigo: string;
    nombre: string;
    precioUnitario: number;
}

export interface ProductDeleteRequest {
    id: number;
}


export interface ProductListRequest {
    pageNumber: number;
    pageSize: number;
    nombre?: string;
    activo?: boolean;
}
