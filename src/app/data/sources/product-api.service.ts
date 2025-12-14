import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductResponse, ProductCreateRequest, ProductEditRequest, ProductDeleteRequest, ProductListRequest } from '../../domain/models/product.model';

interface ApiResponse<T> {
    data: T;
    success: boolean;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProductApiService {
    private apiUrl = 'https://localhost:7224';

    constructor(private http: HttpClient) { }

    getProducts(request: ProductListRequest): Observable<ProductResponse[]> {
        return this.http.get<ApiResponse<ProductResponse[]>>(`${this.apiUrl}/ObtenerProductos`)
            .pipe(map(response => response.data));
    }

    getProductById(id: number): Observable<ProductResponse> {
        return this.http.post<ApiResponse<ProductResponse>>(`${this.apiUrl}/ObtenerProducto`, { id })
            .pipe(map(response => response.data));
    }

    createProduct(request: ProductCreateRequest): Observable<void> {
        return this.http.post<ApiResponse<void>>(`${this.apiUrl}/CrearProducto`, request)
            .pipe(map(() => undefined));
    }

    updateProduct(request: ProductEditRequest): Observable<void> {
        return this.http.post<ApiResponse<void>>(`${this.apiUrl}/EditarProducto`, request)
            .pipe(map(() => undefined));
    }

    deleteProduct(request: ProductDeleteRequest): Observable<void> {
        return this.http.post<ApiResponse<void>>(`${this.apiUrl}/EliminarProductos`, request)
            .pipe(map(() => undefined));
    }
}
