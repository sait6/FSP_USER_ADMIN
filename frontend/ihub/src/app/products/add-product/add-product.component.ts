import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductsService } from '../products.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-add-product',
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
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent {
  productForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required]],
      price: [Validators.required, Validators.min(0)],
      quantity: [Validators.required, Validators.min(0)],
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.loaderService.show();
      let productData = this.productForm.value;
      console.log('Final Submission:', productData);

      this.productsService.addProduct(productData).subscribe({
        next: (product) => {
          console.log(product);
          this.productForm.reset();
          this.loaderService.hide();
          this.router.navigateByUrl('/view-products');
        },
        error: (error) => {
          console.error('Error fetching products:', error);
          this.errorMessage = 'Failed to add products. Please try again later.';
          this.loaderService.hide();
          const message = error?.error?.message || this.errorMessage;
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
