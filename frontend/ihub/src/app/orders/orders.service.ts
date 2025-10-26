import { Injectable } from '@angular/core';
import { Order } from '../models/Order';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../config/api-endpoints.config';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  getAllOrders() {
    return this.http.get<Order[]>(API_ENDPOINTS.ORDERS);
  }

  placeOrderFromService (orderRequest:any){
    return this.http.post<any>(API_ENDPOINTS.ORDERS, orderRequest);
  }
}
