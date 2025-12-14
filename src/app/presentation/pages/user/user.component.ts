import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetUsersUseCase } from '../../../domain/usecases/user/get-users.usecase';
import { CreateUserUseCase } from '../../../domain/usecases/user/create-user.usecase';
import { UpdateUserUseCase } from '../../../domain/usecases/user/update-user.usecase';
import { DeleteUserUseCase } from '../../../domain/usecases/user/delete-user.usecase';
import { UserRequest, UserResponse, UserEditRequest } from '../../../domain/models/user.model';

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

  // Create/Edit User Form
  isEditing: boolean = false;
  currentUserId: string | null = null;
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
            // Disable next button if fewer items than pageSize are returned
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

  saveUser(): void {
    if (this.isEditing && this.currentUserId) {
      const editRequest: UserEditRequest = {
        id: this.currentUserId,
        nombre: this.newUser.nombre,
        apellidos: this.newUser.apellido,
        email: this.newUser.email,
        rol: this.newUser.rol
      };

      this.updateUserUseCase.execute(editRequest).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Usuario actualizado exitosamente');
            this.loadUsers();
            this.resetForm();
          } else {
            alert('Error al actualizar usuario: ' + response.message);
          }
        },
        error: (err) => {
          console.error('Error updating user:', err);
          alert('Error al actualizar usuario');
        }
      });
    } else {
      this.createUserUseCase.execute(this.newUser).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Usuario creado exitosamente');
            this.loadUsers();
            this.resetForm();
          } else {
            alert('Error al crear usuario: ' + response.message);
          }
        },
        error: (err) => {
          console.error('Error creating user:', err);
          alert('Error al crear usuario');
        }
      });
    }
  }

  editUser(user: UserResponse): void {
    this.isEditing = true;
    this.currentUserId = user.idUsuario.toString();
    // Assuming 'nombres' contains "Name Surname" or just "Name"
    // We'll just put everything in 'nombre' for now or try to split if needed.
    // Given the DTOs, let's just use what we have.
    this.newUser = {
      userName: user.userName,
      passwordHash: '', // Password not editable here
      nombre: user.nombres, // Mapping full name to nombre
      apellido: '', // We don't have separate surname in response, leaving empty or need to handle
      email: user.email,
      rol: user.rol
    };
  }

  deleteUser(id: number): void {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.deleteUserUseCase.execute(id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Usuario eliminado exitosamente');
            this.loadUsers();
          } else {
            alert('Error al eliminar usuario: ' + response.message);
          }
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Error al eliminar usuario');
        }
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentUserId = null;
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
}
