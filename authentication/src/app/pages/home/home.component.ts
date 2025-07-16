import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogViewComponent } from '../../component/dialog-view/dialog-view.component';
import { UserApiService } from '../../services/api/userApi.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../type/user.type';
import { RoleValue } from '../../utils/role';
import { DialogCreateComponent } from '../../component/dialog-create/dialog-create.component';
import { StatusValue } from '../../utils/status';
import { Status } from '../../type/status.type';

@Component({
  selector: 'app-home',
  imports: [ToastModule, TableModule, ButtonModule, DialogViewComponent, SelectModule, FormsModule, DialogCreateComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly toast: ToastService,
    private readonly userApiService: UserApiService,
    private readonly userService:UserService
  ) { };
  users: User[] = [];
  userDetail!: User;
  userExisting!:User;
  status: Status[] | undefined;

  //Visibility dialog 
  visible: boolean = false;
  showCreateDialog: boolean = false

  first = 0;

  rows = 10;

  fetchData = () => {
    this.userApiService.getAllUser().subscribe({
      next: (response) => {
        console.log('API response:', response);
        this.users = response;
      },
      error: (error) => {
        console.error('API error:', error);
        this.toast.showError('Lỗi khi gọi API');
      }
    });
  }

  ngOnInit() {
     this.userService.getUser().subscribe(user => {
      this.userExisting = user;
    });
    this.status = StatusValue,
      this.fetchData()
  }

  onStatusChange(event: any, user: User) {
    const updateUser = { ...user, isActive: event.value }
    this.userApiService.updateUser(updateUser, user.id).subscribe({
      next: () => {
        this.toast.showSuccess('Cập nhật thành công');
      },
      error: () => {
        this.toast.showError('Cập nhật không thành công');
      }
    });
    console.log(event.value);
    console.log(user);

  }
  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.users ? this.first + this.rows >= this.users.length : true;
  }

  isFirstPage(): boolean {
    return this.users ? this.first === 0 : true;
  }

  onVisibleChange(newValue: boolean) {
    this.fetchData()
    this.visible = newValue;

  }
  openCreateDialog() {
    this.showCreateDialog = true;
  }

  onUserCreated() {
    this.fetchData()
  }

  getRoleName(roleValue: string): string {
    const role = RoleValue.find(r => r.value === roleValue);
    return role ? role.name : roleValue;
  }
  handleUserDetail(user: User) {
    this.visible = true;
    this.userDetail = user
    console.log(this.userDetail);

  }

  handleDeleteUser(id: string, name: string): void {
    this.userApiService.deleteUser(id).subscribe({
      next: () => {
        this.toast.showSuccess(`Xóa thành công người dùng: ${name}`);
        this.fetchData()
      },
      error: () => {
        this.toast.showError(`Xóa người dùng ${name} thất bại. Vui lòng thử lại.`);
      }
    });
  }
}
