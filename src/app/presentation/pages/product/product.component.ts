import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { GetProductsUseCase } from '../../../domain/usecases/product/get-products.usecase';
import { CreateProductUseCase } from '../../../domain/usecases/product/create-product.usecase';
import { UpdateProductUseCase } from '../../../domain/usecases/product/update-product.usecase';
import { DeleteProductUseCase } from '../../../domain/usecases/product/delete-product.usecase';
import { ProductResponse, ProductCreateRequest, ProductEditRequest } from '../../../domain/models/product.model';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  products: ProductResponse[] = [];
  showModal = false;
  isEditing = false;

  newProduct: ProductCreateRequest & { id?: number } = {
    codigo: '',
    nombre: '',
    precioUnitario: 0
  };

  // Pagination
  pageNumber = 1;
  pageSize = 10;
  disableNext = false;

  // Filters
  filterName = '';

  // Validation errors
  validationErrors: { [key: string]: string[] } = {};

  // Current editing product ID
  currentProductId: number | null = null;

  constructor(
    private getProductsUseCase: GetProductsUseCase,
    private createProductUseCase: CreateProductUseCase,
    private updateProductUseCase: UpdateProductUseCase,
    private deleteProductUseCase: DeleteProductUseCase
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    const request = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      nombre: this.filterName || undefined,
      activo: true
    };

    this.getProductsUseCase.execute(request).subscribe({
      next: (data) => {
        this.products = data;
        this.disableNext = data.length < this.pageSize;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
      }
    });
  }

  openModal(): void {
    this.showModal = true;
    this.isEditing = false;
    this.resetForm();
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newProduct = {
      codigo: '',
      nombre: '',
      precioUnitario: 0
    };
    this.validationErrors = {};
    this.currentProductId = null;
  }

  saveProduct(): void {
    this.validationErrors = {};

    if (this.isEditing && this.currentProductId) {
      const editRequest: ProductEditRequest = {
        id: this.currentProductId,
        codigo: this.newProduct.codigo,
        nombre: this.newProduct.nombre,
        precioUnitario: this.newProduct.precioUnitario
      };

      this.updateProductUseCase.execute(editRequest).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
          this.closeModal();
          this.loadProducts();
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      const createRequest: ProductCreateRequest = {
        codigo: this.newProduct.codigo,
        nombre: this.newProduct.nombre,
        precioUnitario: this.newProduct.precioUnitario
      };

      this.createProductUseCase.execute(createRequest).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Producto creado correctamente', 'success');
          this.closeModal();
          this.loadProducts();
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  editProduct(product: ProductResponse): void {
    this.isEditing = true;
    this.currentProductId = product.productoId;
    this.newProduct = {
      codigo: product.codigo,
      nombre: product.nombre,
      precioUnitario: product.precioUnitario
    };
    this.showModal = true;
  }

  deleteProduct(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteProductUseCase.execute({ id }).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Producto eliminado correctamente', 'success');
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
          }
        });
      }
    });
  }

  nextPage(): void {
    this.pageNumber++;
    this.loadProducts();
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadProducts();
    }
  }

  onFilterChange(): void {
    this.pageNumber = 1;
    this.loadProducts();
  }

  getFieldErrors(field: string): string[] {
    return this.validationErrors[field] || [];
  }

  private handleError(error: any): void {
    if (error.error && error.error.errors) {
      this.validationErrors = error.error.errors;
      Swal.fire('Error de validación', 'Por favor, revisa los campos del formulario', 'error');
    } else {
      Swal.fire('Error', error.error?.message || 'Ocurrió un error al procesar la solicitud', 'error');
    }
  }
}
