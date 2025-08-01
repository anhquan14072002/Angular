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
  selector: 'app-dialog-create',
  imports: [
    Dialog,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    ToastModule,
    SelectModule,
    CommonModule
  ],
  templateUrl: './dialog-create.component.html',
  styleUrls: ['./dialog-create.component.css']
})
export class DialogCreateComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() userCreated = new EventEmitter<User>(); // Event khi tạo thành công

  roles: Role[] | undefined;
  userForm: FormGroup;

  constructor(
    private readonly userService: UserApiService,
    private readonly toast: ToastService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
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
    if (!newValue) {
      this.userForm.reset(); // Reset form khi đóng dialog
    }
  }

  closeDialog() {
    this.onVisibleChange(false);
  }

  createUser() {
    if (this.userForm.invalid) return;
    const newUser = this.userForm.value;
    this.userService.createUser(newUser).subscribe({
      next: (createdUser: any) => {
        this.toast.showSuccess('Tạo người dùng thành công');
        this.userCreated.emit(createdUser);
        this.onVisibleChange(false);
      },
      error: () => {
        this.toast.showError('Tạo người dùng không thành công');
      }
    });
  }
}