import { ResponseModel } from './user.model';

export interface InvoiceDetailRequest {
    productoId: number;
    cantidad: number;
}

export interface InvoiceRequest {
    numeroFactura: string;
    clienteId: number;
    usuarioId: number;
    total: number;
    tipoPago: string;
    estadoPago: string;
    dtoDetalleFacturas: InvoiceDetailRequest[];
}

export interface InvoiceEditRequest {
    facturaId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    subTotal: number;
    facturaDetalleId?: number; 
}

export interface InvoiceUpdateRequest {
    facturaId: number;
    numeroFactura: string;
    clienteId: number;
    usuarioId: number;
    total: number;
    tipoPago: string;
    estadoPago: string;
}

export interface InvoiceResponse {
    facturaId: number;
    fechaModificacion: string;
    nombreCliente: string;
    nombresCompleto: string; 
    estadoFactura: string;
    totalFactura: number;
    activo: boolean;
}

export interface InvoiceDetailResponse {
    facturaDetalleId: number;
    codigo: string;
    cantidad: number;
    descripcion: string;
    precioUnitario: number;
    precioSubtotal: number;
}

export interface InvoiceFullResponse {
    nombre: string;
    telefono: string;
    correo: string;
    vendedor: string;
    fechaCreacion: string;
    tipoPago: string;
    estadoPago: string;
    dtoDetalleFacturas: InvoiceDetailResponse[];
}

export interface InvoiceListResponse extends ResponseModel<InvoiceResponse[]> { }
export interface InvoiceSingleResponse extends ResponseModel<InvoiceFullResponse> { }
