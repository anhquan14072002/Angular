import { CommonModule } from '@angular/common';
import { Component, OnInit, DoCheck } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { User } from '../../type/user.type';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userExisting: Partial<User> | null = null;
  previousUser: string | null = null;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.userExisting = user;
    });
  }

  handleLogout(): void {
    this.userService.removeUser()
    this.userExisting = null;
    this.previousUser = null;
    this.router.navigate(['/login']);
  }
}