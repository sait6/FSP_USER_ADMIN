import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../../models/Product';
import { LoaderService } from '../../loader.service';
import { NgForOf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../models/User';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../users/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-inventory',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    NgForOf,
  ],
  templateUrl: './update-inventory.component.html',
  styleUrls: ['./update-inventory.component.scss'],
})
export class UpdateInventoryComponent implements OnInit {
  inventoryForm!: FormGroup;
  loggedInUser!: User;
  availableProducts: Product[] = [];
  errorMessage = '';

  constructor(
    private productsService: ProductsService,
    private usersService: UsersService,
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.inventoryForm = this.fb.group({
      userId: [{ value: '', disabled: true }],
      product: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
    });

    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (loggedInUserEmail) {
      this.getLoggedInUserByEmail(loggedInUserEmail);
    }

    this.loadAvailableProducts();
  }

  private getLoggedInUserByEmail(email: string): void {
    this.usersService.getUserByEmailId(email).subscribe({
      next: (data: User) => {
        if (data) {
          this.loggedInUser = data;
          this.inventoryForm.patchValue({
            userId: data.id,
          });
          console.log('Fetched user:', data);
        }
      },
      error: (error) => {
        console.error('Error fetching user:', error);
        this.snackbar.open('Failed to fetch user info.', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }

  private loadAvailableProducts(): void {
    this.loaderService.show();
    this.productsService.getAvailableProducts().subscribe({
      next: (products) => {
        this.availableProducts = products;
        this.loaderService.hide();
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.loaderService.hide();
        this.snackbar.open(this.errorMessage, 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }

  updateInventoryItems(): void {
    if (this.inventoryForm.invalid) {
      this.snackbar.open('Please fill all required fields correctly.', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }

    const req = {
      productId: this.inventoryForm.getRawValue().product,
      quantity: this.inventoryForm.getRawValue().quantity,
    };

    console.log('Update Request:', req);

    this.loaderService.show();
    this.productsService.updateQuantity(req).subscribe({
      next: (product) => {
        this.loaderService.hide();
        if (product) {
          this.snackbar.open('Product quantity updated successfully.', 'Close', {
            duration: 4000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
        this.router.navigateByUrl('view-products');
        this.inventoryForm.reset();
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.errorMessage = 'Failed to update product. Please try again later.';
        this.loaderService.hide();
        this.snackbar.open(this.errorMessage, 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }
}
