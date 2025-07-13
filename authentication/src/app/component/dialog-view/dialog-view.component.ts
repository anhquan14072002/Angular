import { ToastService } from './../../services/toast.service';
import { UserApiService } from '../../services/api/userApi.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { User } from './../../type/user.type';
import { ToastModule } from 'primeng/toast';
import { Role } from '../../type/role.type';
import { RoleValue } from '../../utils/role';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-dialog-view',
  imports: [Dialog, ButtonModule, InputTextModule, FormsModule, ToastModule, SelectModule],
  templateUrl: './dialog-view.component.html',
  styleUrls: ['./dialog-view.component.css']
})
export class DialogViewComponent implements OnInit {

  constructor(
    private readonly userService: UserApiService,
    private readonly toast: ToastService
  ) {
  }
  @Input() visible: boolean = false;
  @Input() userDetail!: User;
  @Output() visibleChange = new EventEmitter<boolean>();
  roles: Role[] | undefined;

  selectedRole: Role | undefined;

  ngOnInit(): void {
    this.roles = RoleValue

  }
  onVisibleChange(newValue: boolean) {
    console.log(newValue);
    console.log("asdasdas", this.userDetail);
    this.visibleChange.emit(newValue);
  }

  closeDialog() {
    this.onVisibleChange(false);
  }

  saveDialog(form: any, userDetail: User) {
    console.log(userDetail);

    this.userService.updateUser(userDetail, userDetail.id).subscribe({
      next: () => {
        this.toast.showSuccess(`Cập nhập thành công`);
      },
      error: () => {
        this.toast.showError(`Cập nhập không thành công.`);
      }
    });
    this.onVisibleChange(false)
  }
}