import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRepository } from '../../interfaces/product.repository';
import { ProductCreateRequest } from '../../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class CreateProductUseCase {
    constructor(private productRepository: ProductRepository) { }

    execute(request: ProductCreateRequest): Observable<void> {
        return this.productRepository.createProduct(request);
    }
}
