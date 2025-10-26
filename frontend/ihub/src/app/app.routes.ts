import { Routes } from '@angular/router';
import { ViewUsersComponent } from './users/view-users/view-users.component';
import { ViewProductsComponent } from './products/view-products/view-products.component';
import { ViewOrdersComponent } from './orders/view-orders/view-orders.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { AuthGuard } from './guards/auth.guard';
import { PlaceOrderComponent } from './orders/place-order/place-order.component';
import { UpdateInventoryComponent } from './products/update-inventory/update-inventory.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'view-users', component: ViewUsersComponent, canActivate: [AuthGuard] },
  { path: 'view-products', component: ViewProductsComponent, canActivate: [AuthGuard] },
  { path: 'view-orders', component: ViewOrdersComponent, canActivate: [AuthGuard] },
  { path: 'add-user', component: AddUserComponent, canActivate: [AuthGuard] },
  { path: 'add-product', component: AddProductComponent, canActivate: [AuthGuard] },
  { path: 'place-order', component: PlaceOrderComponent, canActivate: [AuthGuard] },
  { path: 'update-inventory', component: UpdateInventoryComponent, canActivate: [AuthGuard] },
];
