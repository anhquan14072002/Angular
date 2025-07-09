import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogViewComponent } from '../../component/dialog-view/dialog-view.component';
import { ToastService } from '../../services/toast.service';
import { User } from '../../type/user.type';
import { UserService } from './../../services/api/user.service';

@Component({
  selector: 'app-home',
  imports: [ToastModule, TableModule, ButtonModule, DialogViewComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(
    private readonly toast: ToastService,
    private readonly userService: UserService
  ) { }
  //Visibility dialog 
  visible: boolean = false;


  users!: User[];
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

  ngOnInit(): void {
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
    console.log('newValue', newValue);
    this.visible = newValue;

  }
  handleUserDetail(user: User) {
    this.visible = true;
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
