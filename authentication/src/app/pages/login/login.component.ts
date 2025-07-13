import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { User } from '../../type/user.type';
import { ToastService } from '../../services/toast.service';
import { UserApiService } from '../../services/api/userApi.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  users: User[] = [];

  constructor(
    private router: Router,
    private readonly toast: ToastService,
    private readonly userApiService: UserApiService,
    private readonly userService: UserService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,          // Bắt buộc nhập
        Validators.email,             // Đúng định dạng email
        Validators.minLength(8),      // Tối thiểu 8 ký tự
      ]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
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

  onSubmit(): void {
    const formValue = this.loginForm.value;
    const filteredUser = this.users.find(u =>
      u.email === formValue.email &&
      u.password === formValue.password
    );

    if (filteredUser) {
      console.log('Đăng nhập thành công');
      this.userService.setUser(filteredUser);
      this.router.navigate(['/home']);
    } else {
      (formValue.email.length > 0 && formValue.password.length > 0) ?
        this.toast.showError("Tài khoản hoặc mật khẩu không đúng") : ''
    }
  }
}