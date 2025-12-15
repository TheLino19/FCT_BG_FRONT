// Product Response Model
export interface ProductResponse {
    productoId: number;
    nombre: string;
    codigo: string;
    precioUnitario: number;
    activo: boolean;
}

// Product Create Request
export interface ProductCreateRequest {
    codigo: string;
    nombre: string;
    precioUnitario: number;
}

// Product Edit Request
export interface ProductEditRequest {
    id: number;
    codigo: string;
    nombre: string;
    precioUnitario: number;
}

// Product Delete Request
export interface ProductDeleteRequest {
    id: number;
}

// Product List Request
export interface ProductListRequest {
    pageNumber: number;
    pageSize: number;
    nombre?: string;
    activo?: boolean;
}
