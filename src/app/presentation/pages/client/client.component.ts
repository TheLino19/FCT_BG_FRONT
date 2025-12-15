import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetClientsUseCase } from '../../../domain/usecases/client/get-clients.usecase';
import { CreateClientUseCase } from '../../../domain/usecases/client/create-client.usecase';
import { UpdateClientUseCase } from '../../../domain/usecases/client/update-client.usecase';
import { DeleteClientUseCase } from '../../../domain/usecases/client/delete-client.usecase';
import { ClientRequest, ClientResponse, ClientEditRequest } from '../../../domain/models/client.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit {
  clients: ClientResponse[] = [];


  filterName: string = '';
  filterState: boolean | null = null;

  
  pageNumber: number = 1;
  pageSize: number = 10;
  disableNext: boolean = false;

 
  showModal: boolean = false;
  isEditing: boolean = false;
  currentClientId: number | null = null;
  errors: string[] = [];
  newClient: ClientRequest = {
    identificacion: '',
    tipoIdentifiacion: '',
    nombre: '',
    telefono: '',
    email: '',
    direccion: ''
  };

  constructor(
    private getClientsUseCase: GetClientsUseCase,
    private createClientUseCase: CreateClientUseCase,
    private updateClientUseCase: UpdateClientUseCase,
    private deleteClientUseCase: DeleteClientUseCase
  ) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.getClientsUseCase.execute(this.filterState, this.filterName, this.pageNumber, this.pageSize)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.clients = response.data;
            this.disableNext = this.clients.length < this.pageSize;
          } else {
            console.error('Error loading clients:', response.message);
            this.clients = [];
            this.disableNext = true;
          }
        },
        error: (err) => {
          console.error('Error loading clients:', err);
          this.clients = [];
          this.disableNext = true;
        }
      });
  }

  openModal(): void {
    this.showModal = true;
    this.resetForm();
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  saveClient(): void {
    this.errors = []; 
    if (this.isEditing && this.currentClientId) {
      const editRequest: ClientEditRequest = {
        id: this.currentClientId,
        nombre: this.newClient.nombre,
        telefono: this.newClient.telefono,
        email: this.newClient.email,
        direccion: this.newClient.direccion
      };

      this.updateClientUseCase.execute(editRequest).subscribe({
        next: (response) => {
          if (response.success) {
            Swal.fire('Éxito', 'Cliente actualizado exitosamente', 'success');
            this.loadClients();
            this.closeModal();
          } else {
            this.errors = response.errors || [response.message || 'Error desconocido'];
            Swal.fire('Error', this.errors.join('<br>'), 'error');
          }
        },
        error: (err) => {
          console.error('Error updating client:', err);
          this.errors = ['Error de conexión al actualizar cliente'];
          Swal.fire('Error', 'Error de conexión al actualizar cliente', 'error');
        }
      });
    } else {
      this.createClientUseCase.execute(this.newClient).subscribe({
        next: (response) => {
          if (response.success) {
            Swal.fire('Éxito', 'Cliente creado exitosamente', 'success');
            this.loadClients();
            this.closeModal();
          } else {
            this.errors = response.errors || [response.message || 'Error desconocido'];
            Swal.fire('Error', this.errors.join('<br>'), 'error');
          }
        },
        error: (err) => {
          console.error('Error creating client:', err);
          this.errors = ['Error de conexión al crear cliente'];
          Swal.fire('Error', 'Error de conexión al crear cliente', 'error');
        }
      });
    }
  }

  editClient(client: ClientResponse): void {
    this.isEditing = true;
    this.currentClientId = client.clienteId;
    this.showModal = true;
    this.newClient = {
      identificacion: '',
      tipoIdentifiacion: '',
      nombre: client.nombre,
      telefono: client.telefono,
      email: client.correo,
      direccion: client.direccion
    };
  }

  deleteClient(id: number): void {
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
        this.deleteClientUseCase.execute(id).subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire('Eliminado', 'El cliente ha sido eliminado.', 'success');
              this.loadClients();
            } else {
              Swal.fire('Error', 'No se pudo eliminar el cliente: ' + response.message, 'error');
            }
          },
          error: (err) => {
            console.error('Error deleting client:', err);
            Swal.fire('Error', 'Error al eliminar cliente', 'error');
          }
        });
      }
    });
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentClientId = null;
    this.errors = [];
    this.newClient = {
      identificacion: '',
      tipoIdentifiacion: '',
      nombre: '',
      telefono: '',
      email: '',
      direccion: ''
    };
  }

  onFilterChange(): void {
    this.pageNumber = 1;
    this.loadClients();
  }

  nextPage(): void {
    if (!this.disableNext) {
      this.pageNumber++;
      this.loadClients();
    }
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadClients();
    }
  }

  getFieldErrors(field: string): string[] {
    if (!this.errors || this.errors.length === 0) return [];

    const fieldLower = field.toLowerCase();
    return this.errors.filter(error => error.toLowerCase().includes(fieldLower));
  }
}
