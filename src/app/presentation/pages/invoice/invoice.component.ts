import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GetInvoicesUseCase } from '../../../domain/usecases/invoice/get-invoices.usecase';
import { CreateInvoiceUseCase } from '../../../domain/usecases/invoice/create-invoice.usecase';
import { DeleteInvoiceUseCase } from '../../../domain/usecases/invoice/delete-invoice.usecase';
import { GetClientsUseCase } from '../../../domain/usecases/client/get-clients.usecase';
import { GetUsersUseCase } from '../../../domain/usecases/user/get-users.usecase';
import { GetProductsUseCase } from '../../../domain/usecases/product/get-products.usecase';
import { InvoiceResponse, InvoiceRequest } from '../../../domain/models/invoice.model';
import { ClientResponse } from '../../../domain/models/client.model';
import { UserResponse } from '../../../domain/models/user.model';
import { ProductResponse } from '../../../domain/models/product.model';
import Swal from 'sweetalert2';

interface InvoiceDetail {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit {
  invoices: InvoiceResponse[] = [];
  clients: ClientResponse[] = [];
  sellers: UserResponse[] = [];
  products: ProductResponse[] = [];

  // Filters
  filterNumber: string = '';
  filterDate: string = '';
  filterAmount: number | null = null;
  filterState: boolean | null = null;

  // Pagination
  pageNumber: number = 1;
  pageSize: number = 10;
  disableNext: boolean = false;

  // Form state
  showForm: boolean = false;

  // Invoice creation form
  selectedClientId: number = 0;
  clientPhone: string = '';
  clientEmail: string = '';
  invoiceDate: string = '';
  paymentMethod: string = 'Efectivo';
  invoiceStatus: string = 'Pendiente';
  invoiceDetails: InvoiceDetail[] = [];
  total: number = 0;

  paymentMethods = ['Efectivo', 'Tarjeta', 'Transferencia'];
  invoiceStatuses = ['Pendiente', 'Pagada', 'Cancelada'];
  currentUserId: number = 1;

  errors: string[] = [];

  constructor(
    private router: Router,
    private getInvoicesUseCase: GetInvoicesUseCase,
    private createInvoiceUseCase: CreateInvoiceUseCase,
    private deleteInvoiceUseCase: DeleteInvoiceUseCase,
    private getClientsUseCase: GetClientsUseCase,
    private getUsersUseCase: GetUsersUseCase,
    private getProductsUseCase: GetProductsUseCase
  ) { }

  ngOnInit(): void {
    this.loadInvoices();
    this.loadClients();
    this.loadSellers();
    this.loadProducts();
  }

  loadInvoices(): void {
    this.getInvoicesUseCase.execute(
      this.filterNumber,
      this.filterDate,
      this.filterAmount,
      this.filterState,
      this.pageNumber,
      this.pageSize
    ).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.invoices = response.data;
          this.disableNext = this.invoices.length < this.pageSize;
        } else {
          this.invoices = [];
          this.disableNext = true;
        }
      },
      error: (err) => {
        console.error('Error loading invoices:', err);
        this.invoices = [];
      }
    });
  }

  loadClients(): void {
    // Load all active clients (assuming large page size or implementing search later)
    this.getClientsUseCase.execute(true, '', 1, 100).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.clients = res.data;
        }
      }
    });
  }

  loadSellers(): void {
    // Load all active users (sellers)
    this.getUsersUseCase.execute(true, '', 1, 100).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.sellers = res.data;
        }
      }
    });
  }

  loadProducts(): void {
    this.getProductsUseCase.execute({
      pageNumber: 1,
      pageSize: 100,
      activo: true
    }).subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.setCurrentDate();
    this.resetForm();
    this.addProductRow();
  }

  closeForm(): void {
    this.showForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.selectedClientId = 0;
    this.clientPhone = '';
    this.clientEmail = '';
    this.paymentMethod = 'Efectivo';
    this.invoiceStatus = 'Pendiente';
    this.invoiceDetails = [];
    this.total = 0;
    this.errors = [];
  }

  setCurrentDate(): void {
    const today = new Date();
    this.invoiceDate = today.toISOString().split('T')[0];
  }

  onClientChange(): void {
    const client = this.clients.find(c => c.clienteId === this.selectedClientId);
    if (client) {
      this.clientPhone = client.telefono;
      this.clientEmail = client.correo;
    } else {
      this.clientPhone = '';
      this.clientEmail = '';
    }
  }

  onProductChange(detail: InvoiceDetail): void {
    const product = this.products.find(p => p.productoId === detail.productoId);
    if (product) {
      detail.nombreProducto = product.nombre;
      detail.precioUnitario = product.precioUnitario;
      this.calculateSubtotal(detail);
    }
  }

  onQuantityChange(detail: InvoiceDetail): void {
    this.calculateSubtotal(detail);
  }

  calculateSubtotal(detail: InvoiceDetail): void {
    detail.subtotal = detail.cantidad * detail.precioUnitario;
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.total = this.invoiceDetails.reduce((sum, d) => sum + d.subtotal, 0);
  }

  addProductRow(): void {
    this.invoiceDetails.push({
      productoId: 0,
      nombreProducto: '',
      cantidad: 1,
      precioUnitario: 0,
      subtotal: 0
    });
  }

  removeProductRow(index: number): void {
    if (this.invoiceDetails.length > 1) {
      this.invoiceDetails.splice(index, 1);
      this.calculateTotal();
    } else {
      Swal.fire('Advertencia', 'Debe haber al menos un producto', 'warning');
    }
  }

  saveInvoice(): void {
    if (this.selectedClientId === 0) {
      Swal.fire('Error', 'Debe seleccionar un cliente', 'error');
      return;
    }

    const hasInvalidProducts = this.invoiceDetails.some(d => d.productoId === 0 || d.cantidad <= 0);
    if (hasInvalidProducts) {
      Swal.fire('Error', 'Todos los productos deben tener un producto seleccionado y cantidad válida', 'error');
      return;
    }

    if (this.total <= 0) {
      Swal.fire('Error', 'El total debe ser mayor a 0', 'error');
      return;
    }

    const invoiceRequest = {
      numeroFactura: this.generateInvoiceNumber(),
      clienteId: this.selectedClientId,
      usuarioId: this.currentUserId,
      total: this.total,
      tipoPago: this.paymentMethod,
      estadoPago: this.invoiceStatus
    };

    this.createInvoiceUseCase.execute(invoiceRequest).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Factura creada correctamente', 'success');
        this.loadInvoices();
        this.closeForm();
      },
      error: (error) => {
        console.error('Error creating invoice:', error);
        Swal.fire('Error', error.error?.message || 'No se pudo crear la factura', 'error');
      }
    });
  }

  generateInvoiceNumber(): string {
    const timestamp = Date.now();
    return `FAC-${timestamp}`;
  }

  deleteInvoice(id: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: "No podrá revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteInvoiceUseCase.execute(id).subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire('Eliminado', 'La factura ha sido eliminada.', 'success');
              this.loadInvoices();
            } else {
              Swal.fire('Error', 'No se pudo eliminar la factura: ' + response.message, 'error');
            }
          },
          error: (err) => {
            console.error('Error deleting invoice:', err);
            Swal.fire('Error', 'Error al eliminar factura', 'error');
          }
        });
      }
    });
  }

  onFilterChange(): void {
    this.pageNumber = 1;
    this.loadInvoices();
  }

  nextPage(): void {
    if (!this.disableNext) {
      this.pageNumber++;
      this.loadInvoices();
    }
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadInvoices();
    }
  }
}
