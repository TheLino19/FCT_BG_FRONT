import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetInvoicesUseCase } from '../../../domain/usecases/invoice/get-invoices.usecase';
import { CreateInvoiceUseCase } from '../../../domain/usecases/invoice/create-invoice.usecase';
import { DeleteInvoiceUseCase } from '../../../domain/usecases/invoice/delete-invoice.usecase';
import { GetClientsUseCase } from '../../../domain/usecases/client/get-clients.usecase';
import { GetUsersUseCase } from '../../../domain/usecases/user/get-users.usecase';
import { InvoiceResponse, InvoiceRequest } from '../../../domain/models/invoice.model';
import { ClientResponse } from '../../../domain/models/client.model';
import { UserResponse } from '../../../domain/models/user.model';
import Swal from 'sweetalert2';

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

  // Filters
  filterNumber: string = '';
  filterDate: string = '';
  filterAmount: number | null = null;
  filterState: boolean | null = null;

  // Pagination
  pageNumber: number = 1;
  pageSize: number = 10;
  disableNext: boolean = false;

  // Modal
  showModal: boolean = false;
  errors: string[] = [];
  newInvoice: InvoiceRequest = {
    numeroFactura: '',
    clienteId: 0,
    usuarioId: 0,
    total: 0,
    tipoPago: 'Efectivo', // Default
    estadoPago: 'Pagado' // Default
  };

  constructor(
    private getInvoicesUseCase: GetInvoicesUseCase,
    private createInvoiceUseCase: CreateInvoiceUseCase,
    private deleteInvoiceUseCase: DeleteInvoiceUseCase,
    private getClientsUseCase: GetClientsUseCase,
    private getUsersUseCase: GetUsersUseCase
  ) { }

  ngOnInit(): void {
    this.loadInvoices();
    this.loadClients();
    this.loadSellers();
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

  openModal(): void {
    this.showModal = true;
    this.errors = [];
    this.newInvoice = {
      numeroFactura: '',
      clienteId: 0,
      usuarioId: 0,
      total: 0,
      tipoPago: 'Efectivo',
      estadoPago: 'Pagado'
    };
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveInvoice(): void {
    this.errors = [];
    this.createInvoiceUseCase.execute(this.newInvoice).subscribe({
      next: (response) => {
        if (response.success) {
          Swal.fire('Éxito', 'Factura creada exitosamente', 'success');
          this.loadInvoices();
          this.closeModal();
        } else {
          this.errors = response.errors || [response.message || 'Error desconocido'];
          Swal.fire('Error', this.errors.join('<br>'), 'error');
        }
      },
      error: (err) => {
        console.error('Error creating invoice:', err);
        Swal.fire('Error', 'Error de conexión al crear factura', 'error');
      }
    });
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
