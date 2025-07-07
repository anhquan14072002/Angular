import { ToastModule } from 'primeng/toast';
import { User } from '../../type/user.type';
import { UserService } from './../../services/api/user.service';
import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [ToastModule, TableModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(
    private readonly toast: ToastService,
    private readonly userService: UserService
  ) { }
  users!: User[];
  first = 0;

  rows = 10;
  ngOnInit(): void {
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

  handleUser(user:User) {
    alert("hello");
    console.log(user);
  }
}
