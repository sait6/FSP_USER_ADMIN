import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { API_ENDPOINTS } from '../config/api-endpoints.config';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  userLogin(userData: User) {
    return this.http.post<User>(API_ENDPOINTS.LOGIN, userData);
  }
}
