import { BASE_URLS } from './base-url.config';

export const API_ENDPOINTS = {
  USERS: `${BASE_URLS.USERS}/api/users`,
  PRODUCTS: `${BASE_URLS.PRODUCTS}/api/products`,
  ORDERS: `${BASE_URLS.ORDERS}/api/orders`,
  LOGIN: `${BASE_URLS.USERS}/api/auth/login`
};