import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../config/api-endpoints.config';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getAvailableProducts() {
    return this.http.get<Product[]>(API_ENDPOINTS.PRODUCTS);
  }

  addProduct(product:Product){
    return this.http.post<Product>(API_ENDPOINTS.PRODUCTS,product);
  }

  updateQuantity(productReq:any) {
    const url = `${API_ENDPOINTS.PRODUCTS}/${productReq.productId}/quantity?quantity=${productReq.quantity}`;
    return this.http.put<Product>(url, {});
  }
}
