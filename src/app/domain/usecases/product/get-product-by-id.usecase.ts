import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRepository } from '../../interfaces/product.repository';
import { ProductResponse } from '../../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class GetProductByIdUseCase {
    constructor(private productRepository: ProductRepository) { }

    execute(id: number): Observable<ProductResponse> {
        return this.productRepository.getProductById(id);
    }
}
