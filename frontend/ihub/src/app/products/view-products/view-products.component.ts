import { Component } from '@angular/core';
import { Product } from '../../models/Product';
import { ProductsService } from '../products.service';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-view-products',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule],
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.scss',
})
export class ViewProductsComponent {
  availableProducts: Product[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'quantity',
  ];

  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private productsService: ProductsService, private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loaderService.show();
    this.productsService.getAvailableProducts().subscribe({
      next: (products) => {
        this.availableProducts = products;
        this.loaderService.hide();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.loaderService.hide();
        this.isLoading = false;
      },
    });
  }
}
