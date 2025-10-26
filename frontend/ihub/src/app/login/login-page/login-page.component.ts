import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  login() {
    this.loaderService.show();
    console.log(this.loginForm.value);
    let userPayload = this.loginForm.value;
    this.loginService.userLogin(userPayload).subscribe({
      next: (data: any) => {
        if (data) {
          this.loginForm.reset();
          this.loaderService.loading$;
          localStorage.setItem('token', data?.token);
          localStorage.setItem('loggedInUserEmail', userPayload.email);
          this.loaderService.hide();
          this.router.navigateByUrl('/view-users');
          let message = 'Logged in Successfully!!!';
          this.snackbar.open(message, 'Close', {
            duration: 4000,
            panelClass: ['snackbar-error'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      },
      error: (error) => {
        console.error('Error fetching while login:', error);
        this.errorMessage = 'Failed to login. Please try again later.';
        this.loaderService.hide();
        const message = error?.error?.message || this.errorMessage;
        this.snackbar.open(message, 'Close', {
          duration: 4000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }
}
