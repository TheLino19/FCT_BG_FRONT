import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRepository } from '../../interfaces/product.repository';
import { ProductEditRequest } from '../../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class UpdateProductUseCase {
    constructor(private productRepository: ProductRepository) { }

    execute(request: ProductEditRequest): Observable<void> {
        return this.productRepository.updateProduct(request);
    }
}
