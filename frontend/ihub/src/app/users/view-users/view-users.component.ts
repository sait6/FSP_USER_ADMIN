import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../users.service';
import { User } from '../../models/User';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-view-users',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule],
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss'],
})
export class ViewUsersComponent implements OnInit {
  registeredUsers: User[] = [];
  displayedColumns: string[] = [
    'id',
    'firstname',
    'lastname',
    'email',
    'role',
    'country',
    'city',
    'balance',
  ];

  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private usersService: UsersService, private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loaderService.show();
    this.usersService.getRegisteredUsers().subscribe({
      next: (users) => {
        this.registeredUsers = users;
        this.loaderService.hide();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.loaderService.hide();
        this.errorMessage = 'Failed to load users. Please try again later.';
        this.isLoading = false;
      },
    });
  }
}
