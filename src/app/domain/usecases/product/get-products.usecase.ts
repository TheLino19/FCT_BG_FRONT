import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRepository } from '../../interfaces/product.repository';
import { ProductListRequest, ProductResponse } from '../../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class GetProductsUseCase {
    constructor(private productRepository: ProductRepository) { }

    execute(request: ProductListRequest): Observable<ProductResponse[]> {
        return this.productRepository.getProducts(request);
    }
}
