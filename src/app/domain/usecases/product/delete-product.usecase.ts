import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRepository } from '../../interfaces/product.repository';
import { ProductDeleteRequest } from '../../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class DeleteProductUseCase {
    constructor(private productRepository: ProductRepository) { }

    execute(request: ProductDeleteRequest): Observable<void> {
        return this.productRepository.deleteProduct(request);
    }
}
