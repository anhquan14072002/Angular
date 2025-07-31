import { CommonModule } from '@angular/common';
import { Component, OnInit, DoCheck, HostListener, ElementRef } from '@angular/core';
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
  adminExisting: Partial<User> | null = null;
  previousUser: string | null = null;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly elementRef: ElementRef
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

  //open toggle
  isDropdownOpen: boolean = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Đóng dropdown khi click ra ngoài
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

}