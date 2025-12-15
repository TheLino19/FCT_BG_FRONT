import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetUsersUseCase } from '../../../domain/usecases/user/get-users.usecase';
import { CreateUserUseCase } from '../../../domain/usecases/user/create-user.usecase';
import { UpdateUserUseCase } from '../../../domain/usecases/user/update-user.usecase';
import { DeleteUserUseCase } from '../../../domain/usecases/user/delete-user.usecase';
import { UserRequest, UserResponse, UserEditRequest } from '../../../domain/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  users: UserResponse[] = [];

  // Filters
  filterName: string = '';
  filterState: boolean | null = null;

  // Pagination
  pageNumber: number = 1;
  pageSize: number = 10;
  disableNext: boolean = false;

  // Modal
  showModal: boolean = false;
  isEditing: boolean = false;
  currentUserId: number | null = null;
  errors: string[] = [];
  newUser: UserRequest = {
    userName: '',
    passwordHash: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: ''
  };

  constructor(
    private getUsersUseCase: GetUsersUseCase,
    private createUserUseCase: CreateUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.getUsersUseCase.execute(this.filterState, this.filterName, this.pageNumber, this.pageSize)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.users = response.data;
            this.disableNext = this.users.length < this.pageSize;
          } else {
            console.error('Error loading users:', response.message);
            this.users = [];
            this.disableNext = true;
          }
        },
        error: (err) => {
          console.error('Error loading users:', err);
          this.users = [];
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

  saveUser(): void {
    this.errors = []; 
    if (this.isEditing && this.currentUserId) {
      const editRequest: UserEditRequest = {
        id: this.currentUserId.toString(),
        nombre: this.newUser.nombre,
        apellidos: this.newUser.apellido,
        email: this.newUser.email,
        rol: this.newUser.rol
      };

      this.updateUserUseCase.execute(editRequest).subscribe({
        next: (response) => {
          if (response.success) {
            Swal.fire('Éxito', 'Usuario actualizado exitosamente', 'success');
            this.loadUsers();
            this.closeModal();
          } else {
            this.errors = response.errors || [response.message || 'Error desconocido'];
            Swal.fire('Error', this.errors.join('<br>'), 'error');
          }
        },
        error: (err) => {
          console.error('Error updating user:', err);
          this.errors = ['Error de conexión al actualizar usuario'];
          Swal.fire('Error', 'Error de conexión al actualizar usuario', 'error');
        }
      });
    } else {
      this.createUserUseCase.execute(this.newUser).subscribe({
        next: (response) => {
          if (response.success) {
            Swal.fire('Éxito', 'Usuario creado exitosamente', 'success');
            this.loadUsers();
            this.closeModal();
          } else {
            this.errors = response.errors || [response.message || 'Error desconocido'];
            Swal.fire('Error', this.errors.join('<br>'), 'error');
          }
        },
        error: (err) => {
          console.error('Error creating user:', err);
          this.errors = ['Error de conexión al crear usuario'];
          Swal.fire('Error', 'Error de conexión al crear usuario', 'error');
        }
      });
    }
  }

  editUser(user: UserResponse): void {
    this.isEditing = true;
    this.currentUserId = user.idUsuario;
    this.showModal = true;
    this.newUser = {
      userName: user.userName,
      passwordHash: '', 
      nombre: user.nombres, 
      apellido: '', 
      email: user.email,
      rol: user.rol
    };
  }

  deleteUser(id: number): void {
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
        this.deleteUserUseCase.execute(id).subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
              this.loadUsers();
            } else {
              Swal.fire('Error', 'No se pudo eliminar el usuario: ' + response.message, 'error');
            }
          },
          error: (err) => {
            console.error('Error deleting user:', err);
            Swal.fire('Error', 'Error al eliminar usuario', 'error');
          }
        });
      }
    });
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentUserId = null;
    this.errors = [];
    this.newUser = {
      userName: '',
      passwordHash: '',
      nombre: '',
      apellido: '',
      email: '',
      rol: ''
    };
  }

  onFilterChange(): void {
    this.pageNumber = 1;
    this.loadUsers();
  }

  nextPage(): void {
    if (!this.disableNext) {
      this.pageNumber++;
      this.loadUsers();
    }
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadUsers();
    }
  }

  getFieldErrors(field: string): string[] {
    if (!this.errors || this.errors.length === 0) return [];

    const fieldLower = field.toLowerCase();
    return this.errors.filter(error => error.toLowerCase().includes(fieldLower));
  }
}
