import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { User } from '../../type/user.type';
import { ToastModule } from 'primeng/toast';
import { Role } from '../../type/role.type';
import { RoleValue } from '../../utils/role';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { UserApiService } from '../../services/api/userApi.service';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';
import { catchError, of, Subject, switchMap, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    ToastModule,
    DropdownModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  userDetail!: User;
  roles: Role[] | undefined;
  profileForm: FormGroup;
  isEditing = false;
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly userApiService: UserApiService,
    private readonly toast: ToastService,
    private readonly userService: UserService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]],
      role: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.roles = RoleValue;
    this.loadUserProfile();
  }

  getRoleName(roleValue: string | undefined): string {
    if (!roleValue || !this.roles) return roleValue || '';
    const role = this.roles.find(r => r.value === roleValue);
    return role ? role.name : roleValue;
  }

  loadUserProfile(): void {
    this.isLoading = true;

    this.userService.getUser()
      .pipe(
        take(1), // Chỉ lấy giá trị đầu tiên rồi complete
        takeUntil(this.destroy$),
        switchMap(user => {
          if (!user?.id) {
            this.toast.showError('Không tìm thấy thông tin người dùng');
            this.isLoading = false;
            return of(null);
          }

          // Cập nhật giá trị ban đầu từ local storage
          this.userDetail = user;
          this.profileForm.patchValue({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            address: user.address
          });

          return this.userApiService.getUserById(user.id).pipe(
            catchError(err => {
              this.toast.showError('Không thể cập nhật thông tin từ server');
              return of(user); // Fallback về dữ liệu local nếu có lỗi
            })
          );
        })
      )
      .subscribe({
        next: (updatedUser) => {
          if (!updatedUser) return;

          // Chỉ cập nhật nếu dữ liệu từ server khác với local
          if (JSON.stringify(updatedUser) !== JSON.stringify(this.userDetail)) {
            this.userDetail = updatedUser;
            this.userService.setUser(updatedUser);
            this.profileForm.patchValue({
              name: updatedUser.name,
              email: updatedUser.email,
              role: updatedUser.role,
              phoneNumber: updatedUser.phoneNumber,
              address: updatedUser.address
            });
          }

          this.isLoading = false;
        },
        error: (err) => {
          this.toast.showError('Không thể tải thông tin người dùng');
          this.isLoading = false;
        }
      });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.profileForm.patchValue({
      name: this.userDetail.name,
      email: this.userDetail.email,
      role: this.userDetail.role,
      phoneNumber: this.userDetail.phoneNumber,
      address: this.userDetail.address
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid || !this.userDetail) {
      return;
    }

    const userToUpdate = {
      ...this.profileForm.value,
      id: this.userDetail.id,
      password: this.userDetail.password
    };

    this.isLoading = true;
    this.userApiService.updateUser(userToUpdate, userToUpdate.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedUser) => {
          this.userDetail = updatedUser;
          this.userService.setUser(updatedUser);
          this.toast.showSuccess('Cập nhật thông tin thành công');
          this.isEditing = false;
          this.isLoading = false;
        },
        error: (err) => {
          this.toast.showError('Cập nhật không thành công');
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}