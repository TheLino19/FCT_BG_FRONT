import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GetInvoicesUseCase } from '../../../domain/usecases/invoice/get-invoices.usecase';
import { CreateInvoiceUseCase } from '../../../domain/usecases/invoice/create-invoice.usecase';
import { DeleteInvoiceUseCase } from '../../../domain/usecases/invoice/delete-invoice.usecase';
import { DeleteInvoiceDetailUseCase } from '../../../domain/usecases/invoice/delete-invoice-detail.usecase';
import { GetInvoiceByIdUseCase } from '../../../domain/usecases/invoice/get-invoice-by-id.usecase';
import { InsertInvoiceDetailsUseCase } from '../../../domain/usecases/invoice/insert-invoice-details.usecase';
import { GetClientsUseCase } from '../../../domain/usecases/client/get-clients.usecase';
import { GetUsersUseCase } from '../../../domain/usecases/user/get-users.usecase';
import { GetProductsUseCase } from '../../../domain/usecases/product/get-products.usecase';
import { InvoiceResponse, InvoiceRequest, InvoiceEditRequest, InvoiceUpdateRequest } from '../../../domain/models/invoice.model';
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
  facturaDetalleId?: number;
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
  isEditMode: boolean = false;
  currentInvoiceId: number = 0;

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
    private deleteInvoiceDetailUseCase: DeleteInvoiceDetailUseCase,
    private getInvoiceByIdUseCase: GetInvoiceByIdUseCase,
    private insertInvoiceDetailsUseCase: InsertInvoiceDetailsUseCase,
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
    this.isEditMode = false;
    this.showForm = true;
    this.setCurrentDate();
    this.resetForm();
    this.addProductRow();
  }

  editInvoice(invoice: InvoiceResponse): void {
    this.isEditMode = true;
    this.currentInvoiceId = invoice.facturaId;
    this.showForm = true;

    // Cargar detalles de la factura
    this.getInvoiceByIdUseCase.execute(invoice.facturaId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const data = response.data;

          // Mapear fecha
          this.invoiceDate = data.fechaCreacion.split('T')[0];

          // Mapear cliente (buscando por nombre ya que no tenemos ID en la respuesta)
          const client = this.clients.find(c => c.nombre === data.nombre);
          if (client) {
            this.selectedClientId = client.clienteId;
            this.clientPhone = client.telefono;
            this.clientEmail = client.correo;
          }

          // Mapear otros campos
          this.paymentMethod = data.tipoPago;
          this.invoiceStatus = data.estadoPago;

          // Mapear productos
          this.invoiceDetails = data.dtoDetalleFacturas.map(detail => {
            // Buscar producto por código (más seguro) o nombre
            const product = this.products.find(p => p.codigo === detail.codigo || p.nombre === detail.descripcion);
            return {
              productoId: product ? product.productoId : 0,
              nombreProducto: detail.descripcion,
              cantidad: detail.cantidad,
              precioUnitario: detail.precioUnitario,
              subtotal: detail.precioSubtotal,
              facturaDetalleId: detail.facturaDetalleId
            };
          });

          this.calculateTotal();
        } else {
          Swal.fire('Error', 'No se pudieron cargar los detalles de la factura', 'error');
          this.closeForm();
        }
      },
      error: (error) => {
        console.error('Error loading invoice details:', error);
        Swal.fire('Error', 'Error al cargar la factura', 'error');
        this.closeForm();
      }
    });
  }

  closeForm(): void {
    this.showForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.isEditMode = false;
    this.currentInvoiceId = 0;
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
    const detail = this.invoiceDetails[index];

    if (this.isEditMode && detail.facturaDetalleId) {
      // Si estamos editando y el detalle tiene ID, eliminar del backend
      Swal.fire({
        title: '¿Eliminar producto?',
        text: "El producto se eliminará de la factura guardada",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteInvoiceDetailUseCase.execute(detail.facturaDetalleId!).subscribe({
            next: (response) => {
              if (response.success) {
                this.invoiceDetails.splice(index, 1);
                this.calculateTotal();
                Swal.fire('Eliminado', 'El producto ha sido eliminado de la factura', 'success');
              } else {
                Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
              }
            },
            error: (error) => {
              console.error('Error deleting detail:', error);
              Swal.fire('Error', 'Ocurrió un error al eliminar el producto', 'error');
            }
          });
        }
      });
    } else {
      // Si es nuevo o no estamos en modo edición, solo quitar de la lista
      if (this.invoiceDetails.length > 1) {
        this.invoiceDetails.splice(index, 1);
        this.calculateTotal();
      } else {
        Swal.fire('Advertencia', 'Debe haber al menos un producto', 'warning');
      }
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

    // 1. Preparar request de cabecera (sin detalles)
    const invoiceRequest: InvoiceRequest = {
      numeroFactura: this.isEditMode ? `FAC-${this.currentInvoiceId}` : this.generateInvoiceNumber(),
      clienteId: this.selectedClientId,
      usuarioId: this.currentUserId,
      total: this.total,
      tipoPago: this.paymentMethod,
      estadoPago: this.invoiceStatus,
      dtoDetalleFacturas: [] // Enviamos vacío o lo quitamos si el backend lo ignora
    };

    const saveDetails = (invoiceId: number) => {
      if (this.invoiceDetails.length === 0) {
        // Si no hay detalles, solo notificar éxito (caso raro pero posible)
        Swal.fire('Éxito', `Factura ${this.isEditMode ? 'actualizada' : 'creada'} correctamente`, 'success');
        this.loadInvoices();
        this.closeForm();
        return;
      }

      const detailsRequest: InvoiceEditRequest[] = this.invoiceDetails.map(d => ({
        facturaId: invoiceId,
        productoId: d.productoId,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subTotal: d.subtotal
      }));

      this.insertInvoiceDetailsUseCase.execute(detailsRequest).subscribe({
        next: () => {
          Swal.fire('Éxito', `Factura ${this.isEditMode ? 'actualizada' : 'creada'} correctamente`, 'success');
          this.loadInvoices();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error saving details:', error);
          Swal.fire('Advertencia', 'Factura guardada pero hubo error al guardar los detalles', 'warning');
          this.loadInvoices(); // Recargamos de todas formas
          this.closeForm();
        }
      });
    };

    if (this.isEditMode) {
      // Si la factura existe, solo llama /InsertarDetalleFactura para que actualice los detalles
      saveDetails(this.currentInvoiceId);
    } else {
      // Si se crea una nueva factura, llama /CrearFactura y luego agrega los detalles si existen
      const invoiceRequest: InvoiceRequest = {
        numeroFactura: this.generateInvoiceNumber(),
        clienteId: this.selectedClientId,
        usuarioId: this.currentUserId,
        total: this.total,
        tipoPago: this.paymentMethod,
        estadoPago: this.invoiceStatus,
        dtoDetalleFacturas: []
      };

      this.createInvoiceUseCase.execute(invoiceRequest).subscribe({
        next: (response) => {
          // Asumimos que el backend devuelve el ID en response.data
          // Intentamos convertir data a número si es string
          let newInvoiceId = 0;
          if (typeof response.data === 'number') {
            newInvoiceId = response.data;
          } else if (typeof response.data === 'string') {
            newInvoiceId = parseInt(response.data, 10);
          }

          if (newInvoiceId > 0) {
            saveDetails(newInvoiceId);
          } else {
            console.error('Invalid invoice ID returned:', response.data);
            Swal.fire('Advertencia', 'Factura creada pero no se pudo obtener el ID para guardar detalles', 'warning');
            this.loadInvoices();
            this.closeForm();
          }
        },
        error: (error) => {
          console.error('Error creating invoice:', error);
          Swal.fire('Error', error.error?.message || 'No se pudo crear la factura', 'error');
        }
      });
    }
    // Según requerimiento: Al actualizar, solo insertamos los detalles
    // El endpoint /EditarFactura no existe
    saveDetails(this.currentInvoiceId);
  } else {
  const invoiceRequest: InvoiceRequest = {
    numeroFactura: this.generateInvoiceNumber(),
    clienteId: this.selectedClientId,
    usuarioId: this.currentUserId,
    total: this.total,
    tipoPago: this.paymentMethod,
    estadoPago: this.invoiceStatus,
    dtoDetalleFacturas: []
  };

  this.createInvoiceUseCase.execute(invoiceRequest).subscribe({
    next: (response) => {
      // Asumimos que el backend devuelve el ID en response.data o response.message
      // Si response.data es string, intentamos parsearlo si es un número, o usamos una lógica alternativa
      // IMPORTANTE: Si el backend devuelve "Factura creada" en lugar del ID, esto fallará.
      // Por ahora intentamos convertir data a número.
      const newInvoiceId = Number(response.data);

      if (!isNaN(newInvoiceId) && newInvoiceId > 0) {
        saveDetails(newInvoiceId);
      } else {
        // Fallback: Si no devuelve ID, no podemos guardar detalles.
        // Esto es crítico. Si el backend no devuelve ID, hay que avisar al usuario.
        console.warn('Backend did not return a valid ID:', response.data);
        Swal.fire('Advertencia', 'Factura creada pero no se pudo obtener el ID para guardar detalles', 'warning');
        this.loadInvoices();
        this.closeForm();
      }
    },
    error: (error) => {
      console.error('Error creating invoice:', error);
      Swal.fire('Error', error.error?.message || 'No se pudo crear la factura', 'error');
    }
  });
}
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
  if(!this.disableNext) {
  this.pageNumber++;
  this.loadInvoices();
}
  }

prevPage(): void {
  if(this.pageNumber > 1) {
  this.pageNumber--;
  this.loadInvoices();
}
  }
}
