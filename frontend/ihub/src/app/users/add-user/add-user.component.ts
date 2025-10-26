import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    NgIf,
    NgFor,
    NgForOf,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {
  roles: any;
  step = 1;
  formOne!: FormGroup;
  formTwo!: FormGroup;
  errorMessage: string | null = null;
  userRoles: any;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.getAllRoles();

    this.formOne = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });

    this.formTwo = this.fb.group({
      role: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      balance: [Validators.required, Validators.min(0)],
    });
  }

  getAllRoles() {
    this.usersService.getRoles().subscribe({
      next: (roles) => {
        console.log(roles);
        this.loaderService.hide();
        this.userRoles = roles;
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
        this.errorMessage = 'Failed to fetch roles. Please try again later.';
        const message = error?.error?.message || this.errorMessage;
        this.loaderService.hide();
        this.snackBar.open(message, 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }

  nextStep() {
    if (this.formOne.valid && this.passwordsMatch()) {
      this.step = 2;
    }
  }

  previousStep() {
    this.step = 1;
  }

  passwordsMatch(): boolean {
    return (
      this.formOne.get('password')?.value ===
      this.formOne.get('confirmPassword')?.value
    );
  }

  onSubmit() {
    this.loaderService.show();
    if (this.formTwo.valid) {
      const fullData = {
        ...this.formOne.value,
        ...this.formTwo.value,
      };

      let req = {
        firstname: fullData.firstname,
        lastname: fullData.lastname,
        email: fullData.email,
        password: fullData.password,
        role: { name: fullData.role.name },
        city: fullData.city,
        country: fullData.country,
        balance: fullData.balance,
      };

      this.usersService.addUser(req).subscribe({
        next: (user) => {
          console.log(user);
          this.formOne.reset();
          this.formTwo.reset();
          this.loaderService.hide();
          this.router.navigateByUrl('/view-users');
        },
        error: (error) => {
          console.error('Error fetching users:', error);
          this.errorMessage = 'Failed to add users. Please try again later.';
          const message =
            error?.error?.message || 'Failed to add user. Please try again.';
          this.loaderService.hide();
          this.snackBar.open(message, 'Close', {
            duration: 4000,
            panelClass: ['snackbar-error'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
      });
    }
  }
}
