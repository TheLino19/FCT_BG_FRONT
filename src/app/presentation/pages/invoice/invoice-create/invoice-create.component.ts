import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GetClientsUseCase } from '../../../../domain/usecases/client/get-clients.usecase';
import { GetProductsUseCase } from '../../../../domain/usecases/product/get-products.usecase';
import { CreateInvoiceUseCase } from '../../../../domain/usecases/invoice/create-invoice.usecase';
import { ClientResponse } from '../../../../domain/models/client.model';
import { ProductResponse } from '../../../../domain/models/product.model';

interface InvoiceDetail {
    productoId: number;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

@Component({
    selector: 'app-invoice-create',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './invoice-create.component.html',
    styleUrl: './invoice-create.component.css'
})
export class InvoiceCreateComponent implements OnInit {
    clients: ClientResponse[] = [];
    products: ProductResponse[] = [];

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

    constructor(
        private router: Router,
        private getClientsUseCase: GetClientsUseCase,
        private getProductsUseCase: GetProductsUseCase,
        private createInvoiceUseCase: CreateInvoiceUseCase
    ) { }

    ngOnInit(): void {
        this.setCurrentDate();
        this.loadClients();
        this.loadProducts();
        this.addProductRow();
    }

    setCurrentDate(): void {
        const today = new Date();
        this.invoiceDate = today.toISOString().split('T')[0];
    }

    loadClients(): void {
        this.getClientsUseCase.execute(true, '', 1, 100).subscribe({
            next: (response) => {
                this.clients = response.data || [];
            },
            error: (error) => {
                console.error('Error loading clients:', error);
                Swal.fire('Error', 'No se pudieron cargar los clientes', 'error');
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
                Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
            }
        });
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
                this.router.navigate(['/invoice']);
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

    cancel(): void {
        this.router.navigate(['/invoice']);
    }
}
