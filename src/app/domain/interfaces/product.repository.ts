import { Observable } from 'rxjs';
import { ProductResponse, ProductCreateRequest, ProductEditRequest, ProductDeleteRequest, ProductListRequest } from '../models/product.model';

export abstract class ProductRepository {
    abstract getProducts(request: ProductListRequest): Observable<ProductResponse[]>;
    abstract getProductById(id: number): Observable<ProductResponse>;
    abstract createProduct(request: ProductCreateRequest): Observable<void>;
    abstract updateProduct(request: ProductEditRequest): Observable<void>;
    abstract deleteProduct(request: ProductDeleteRequest): Observable<void>;
}
