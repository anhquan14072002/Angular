import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../enum/user.type';

@Component({
  selector: 'app-header',
  imports: [RouterLink,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  userExisting: Partial<User> | null = null;
  constructor() { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.userExisting = JSON.parse(user);
      console.log('User existing:', this.userExisting);
    } else {
      this.userExisting = null;
      console.log('User not existing');
    }
  }

}
