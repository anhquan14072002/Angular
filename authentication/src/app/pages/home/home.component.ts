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

@Component({
  selector: 'app-home',
  imports: [ToastModule, TableModule, ButtonModule, DialogViewComponent, SelectModule, FormsModule, DialogCreateComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly toast: ToastService,
    private readonly userService: UserApiService
  ) { };
  //Visibility dialog 
  visible: boolean = false;
  showCreateDialog: boolean = false

  users: User[] = [];
  userDetail!: User;

  first = 0;

  rows = 10;

  fetchData = () => {
    this.userService.getAllUser().subscribe({
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
    this.fetchData()
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
    this.userService.deleteUser(id).subscribe({
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
