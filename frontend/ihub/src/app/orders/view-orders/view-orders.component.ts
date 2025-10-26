import { Component } from '@angular/core';
import { Order } from '../../models/Order';
import { OrdersService } from '../orders.service';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule],
  templateUrl: './view-orders.component.html',
  styleUrl: './view-orders.component.scss',
})
export class ViewOrdersComponent {
  ordersPlaced: Order[] = [];
  displayedColumns: string[] = [
    'id',
    'userId',
    'productId',
    'quantity',
    'totalPrice',
    'status',
  ];

  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private ordersService: OrdersService, private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loaderService.show();
    this.ordersService.getAllOrders().subscribe({
      next: (orders) => {
        this.ordersPlaced = orders;
        this.loaderService.hide();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.errorMessage = 'Failed to load orders. Please try again later.';
        this.loaderService.hide();
        this.isLoading = false;
      },
    });
  }
}
