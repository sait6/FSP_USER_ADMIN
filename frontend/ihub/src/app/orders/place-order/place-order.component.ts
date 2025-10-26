import { Component } from '@angular/core';
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
import { UsersService } from '../../users/users.service';
import { User } from '../../models/User';
import { NgForOf } from '@angular/common';
import { Product } from '../../models/Product';
import { ProductsService } from '../../products/products.service';
import { OrdersService } from '../orders.service';
import { LoaderService } from '../../loader.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-place-order',
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
  templateUrl: './place-order.component.html',
  styleUrl: './place-order.component.scss',
})
export class PlaceOrderComponent {
  orderForm!: FormGroup;
  loggedInUser!: User;
  availableProducts!: Product[];

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private productService: ProductsService,
    private orderService: OrdersService,
    private loaderService: LoaderService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.orderForm = this.fb.group({
      userId: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      product: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
    });

    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (loggedInUserEmail) {
      this.getLoggedInUserByEmail(loggedInUserEmail);
    }
    this.getAllAvailableProducts();
  }

  getLoggedInUserByEmail(email: string) {
    this.usersService.getUserByEmailId(email).subscribe({
      next: (data: User) => {
        if (data) {
          this.loggedInUser = data;
          localStorage.setItem('loggedInUser', JSON.stringify(data));

          this.orderForm.patchValue({
            userId: data.id,
          });
          console.log('Fetched user:', data);
        }
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
    });
  }

  getAllAvailableProducts() {
    this.productService.getAvailableProducts().subscribe({
      next: (data: Product[]) => {
        this.availableProducts = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  placeOrder() {
    this.loaderService.show();
    if (this.orderForm.valid && this.loggedInUser) {      
      let orderReq = {
        userId: this.loggedInUser.id,
        productId: this.orderForm.getRawValue().product,
        quantity: this.orderForm.getRawValue().quantity
      }

      this.orderService.placeOrderFromService(orderReq).subscribe({
        next: (data:any)=> {
          if(data){
            console.log("Placed order successfully,"+ data);
            let message = "Order placed successfully";
            this.snackbar.open(message, 'Close', {
              duration: 4000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.loaderService.hide();
            this.router.navigateByUrl('view-orders');
          }
        },
        error: (error)=>{
          console.log(error);
        }
      })
    }
  }
}
