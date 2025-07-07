import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { User } from '../../type/user.type';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/api/user.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  user: Partial<User> = {
    email: '',
    password: ''
  };

  users: User[] = []

  constructor(
    private router: Router,
    private readonly toast: ToastService,
    private readonly userService: UserService,
  ) { }

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
  onSubmit() {
    if (!this.user.email || !this.user.password ||
      this.user.email.length < 8 || this.user.password.length < 8) {
      console.log("Tài khoản hoặc mật khẩu phải lớn hơn 8 kí tự");
      this.toast.showError('Tài khoản và mật khẩu phải có ít nhất 8 ký tự');
      return;
    }
    const filteredUser = this.users.find(u => u.email === this.user.email && u.password === this.user.password);

  
    if (filteredUser) {
      console.log('Đăng nhập thành công');
      console.log(filteredUser);
      localStorage.setItem('user', JSON.stringify(filteredUser));
      this.router.navigate(['/home']);
    } else {
      console.log('Tài khoản hoặc mật khẩu không chính xác');
      this.toast.showError('Tài khoản hoặc mật khẩu không chính xác');
    }
    console.log('Login submitted:', this.user);
  }
}