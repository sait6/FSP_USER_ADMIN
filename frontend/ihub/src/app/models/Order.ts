import { OrderStatus } from "../enums/order-status.enum";

export class Order {
    "id": string;
    "userId": string;
    "productId": string;
    "quantity": number;
    "totalPrice": number;
    "status": OrderStatus.PENDING;
  }