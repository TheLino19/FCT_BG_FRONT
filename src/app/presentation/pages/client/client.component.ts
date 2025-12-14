import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetClientsUseCase } from '../../../domain/usecases/client/get-clients.usecase';
import { CreateClientUseCase } from '../../../domain/usecases/client/create-client.usecase';
import { UpdateClientUseCase } from '../../../domain/usecases/client/update-client.usecase';
import { DeleteClientUseCase } from '../../../domain/usecases/client/delete-client.usecase';
import { ClientRequest, ClientResponse, ClientEditRequest } from '../../../domain/models/client.model';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit {
  clients: ClientResponse[] = [];

  // Filters
  filterName: string = '';
  filterState: boolean | null = null;

  // Pagination
  pageNumber: number = 1;
  pageSize: number = 10;
  disableNext: boolean = false;

  // Create/Edit Client Form
  isEditing: boolean = false;
  currentClientId: number | null = null;
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

  saveClient(): void {
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
            alert('Cliente actualizado exitosamente');
            this.loadClients();
            this.resetForm();
          } else {
            alert('Error al actualizar cliente: ' + response.message);
          }
        },
        error: (err) => {
          console.error('Error updating client:', err);
          alert('Error al actualizar cliente');
        }
      });
    } else {
      this.createClientUseCase.execute(this.newClient).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Cliente creado exitosamente');
            this.loadClients();
            this.resetForm();
          } else {
            alert('Error al crear cliente: ' + response.message);
          }
        },
        error: (err) => {
          console.error('Error creating client:', err);
          alert('Error al crear cliente');
        }
      });
    }
  }

  editClient(client: ClientResponse): void {
    this.isEditing = true;
    this.currentClientId = client.clienteId;
    this.newClient = {
      identificacion: '', // Not editable and not in response usually needed for update
      tipoIdentifiacion: '', // Not editable
      nombre: client.nombre,
      telefono: client.telefono,
      email: client.correo,
      direccion: client.direccion
    };
  }

  deleteClient(id: number): void {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      this.deleteClientUseCase.execute(id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Cliente eliminado exitosamente');
            this.loadClients();
          } else {
            alert('Error al eliminar cliente: ' + response.message);
          }
        },
        error: (err) => {
          console.error('Error deleting client:', err);
          alert('Error al eliminar cliente');
        }
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentClientId = null;
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
}
