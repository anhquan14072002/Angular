import { ToastService } from './../../services/toast.service';
import { UserApiService } from '../../services/api/userApi.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { User } from './../../type/user.type';
import { ToastModule } from 'primeng/toast';
import { Role } from '../../type/role.type';
import { RoleValue } from '../../utils/role';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-view',
  imports: [
    Dialog,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    ToastModule,
    SelectModule,
    CommonModule
  ],
  templateUrl: './dialog-view.component.html',
  styleUrls: ['./dialog-view.component.css']
})
export class DialogViewComponent implements OnInit {
  @Input() visible: boolean = false;
  private _userDetail!: User; 
  
  @Input() 
  set userDetail(user: User) {
    if (user) {
      this._userDetail = user;
      this.userForm.patchValue({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address
      });
    }
  }
  
  get userDetail(): User {
    return this._userDetail;
  }

  @Output() visibleChange = new EventEmitter<boolean>();
  roles: Role[] | undefined;
  userForm: FormGroup;

  constructor(
    private readonly userApiService: UserApiService,
    private readonly toast: ToastService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
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
  }

  onVisibleChange(newValue: boolean) {
    this.visibleChange.emit(newValue);
  }

  closeDialog() {
    this.onVisibleChange(false);
  }

  saveDialog() {
    if (this.userForm.invalid || !this.userDetail) {
      return;
    }

    const formValue = this.userForm.value;
    const userToUpdate = {
      ...formValue,
      id: this.userForm.value.id || this.userDetail.id,
      password: this.userDetail.password // Sử dụng password từ userDetail hiện tại
    };

    if (!userToUpdate.id) {
      this.toast.showError('Không tìm thấy ID người dùng');
      return;
    }

    this.userApiService.updateUser(userToUpdate, userToUpdate.id).subscribe({
      next: () => {
        this.toast.showSuccess('Cập nhật thành công');
        this.onVisibleChange(false);
      },
      error: () => {
        this.toast.showError('Cập nhật không thành công');
      }
    });
  }
}