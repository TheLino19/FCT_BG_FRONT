import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRepository } from '../../domain/interfaces/product.repository';
import { ProductResponse, ProductCreateRequest, ProductEditRequest, ProductDeleteRequest, ProductListRequest } from '../../domain/models/product.model';
import { ProductApiService } from '../sources/product-api.service';

@Injectable({
    providedIn: 'root'
})
export class ProductRepositoryImpl extends ProductRepository {
    constructor(private productApiService: ProductApiService) {
        super();
    }

    getProducts(request: ProductListRequest): Observable<ProductResponse[]> {
        return this.productApiService.getProducts(request);
    }

    getProductById(id: number): Observable<ProductResponse> {
        return this.productApiService.getProductById(id);
    }

    createProduct(request: ProductCreateRequest): Observable<void> {
        return this.productApiService.createProduct(request);
    }

    updateProduct(request: ProductEditRequest): Observable<void> {
        return this.productApiService.updateProduct(request);
    }

    deleteProduct(request: ProductDeleteRequest): Observable<void> {
        return this.productApiService.deleteProduct(request);
    }
}
