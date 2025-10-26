import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../config/api-endpoints.config';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getRegisteredUsers() {
    return this.http.get<User[]>(API_ENDPOINTS.USERS, {withCredentials: true});
  }

  addUser(user:User){
    return this.http.post<User>(API_ENDPOINTS.USERS,user);
  }

  getUserByEmailId(emailId: string) {
    const params = new HttpParams().set('email', emailId);
    return this.http.get<User>(`${API_ENDPOINTS.USERS}/by-email`, { params });
  }

  getRoles() {
    return this.http.get(`${API_ENDPOINTS.USERS}/roles`);
  }
}
